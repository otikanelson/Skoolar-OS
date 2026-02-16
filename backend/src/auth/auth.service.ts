import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TokenService } from './services/token.service';
import { SessionService } from './services/session.service';
import { LoginRateLimiterService } from './services/login-rate-limiter.service';
import { AccountLockoutService } from './services/account-lockout.service';
import { AuditLogService, AuditEventType } from './services/audit-log.service';
import { PortalService } from './services/portal.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private sessionService: SessionService,
    private rateLimiterService: LoginRateLimiterService,
    private lockoutService: AccountLockoutService,
    private auditLogService: AuditLogService,
    private portalService: PortalService,
    private prisma: PrismaService,
  ) {}

  /**
   * Validate user credentials with comprehensive security checks
   */
  async validateUser(
    email: string,
    password: string,
    portalId?: string,
    ipAddress?: string,
  ): Promise<any> {
    // 1. Check rate limits (email and IP)
    if (ipAddress) {
      const rateLimit = await this.rateLimiterService.checkRateLimit(email, ipAddress);
      if (!rateLimit.allowed) {
        await this.auditLogService.log(
          AuditEventType.LOGIN_FAILED,
          ipAddress,
          null,
          null,
          { email, reason: 'Rate limit exceeded' },
        );
        throw new UnauthorizedException(
          `Too many login attempts. Please try again in ${Math.ceil(rateLimit.retryAfter / 60)} minutes.`,
        );
      }
    }

    // 2. Find user by email
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // Record failed attempt even if user doesn't exist (for rate limiting)
      if (ipAddress) {
        await this.rateLimiterService.recordAttempt({
          email,
          ipAddress,
          success: false,
          failureReason: 'User not found',
        });
        await this.auditLogService.log(
          AuditEventType.LOGIN_FAILED,
          ipAddress,
          null,
          null,
          { email, reason: 'User not found' },
        );
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Validate portal/school if portalId provided
    if (portalId) {
      const portal = await this.portalService.checkPortal(portalId);
      
      if (user.schoolId) {
        const school = await this.prisma.school.findUnique({
          where: { id: user.schoolId },
        });
        
        if (!school || school.id !== portal.id) {
          if (ipAddress) {
            await this.rateLimiterService.recordAttempt({
              email,
              ipAddress,
              success: false,
              failureReason: 'User does not belong to this school',
              userId: user.id,
            });
            await this.lockoutService.recordFailedAttempt(user.id);
            await this.auditLogService.log(
              AuditEventType.LOGIN_FAILED,
              ipAddress,
              user.id,
              null,
              { email, reason: 'User does not belong to this school' },
            );
          }
          throw new UnauthorizedException('Invalid credentials');
        }
      } else {
        // User has no schoolId (e.g., MANUFACTURER), check if they should have one
        if (user.role !== 'MANUFACTURER') {
          throw new UnauthorizedException('Invalid credentials');
        }
      }
    }

    // 4. Check account lockout status
    const lockoutStatus = await this.lockoutService.checkLockout(user.id);
    if (lockoutStatus.locked) {
      if (ipAddress) {
        await this.auditLogService.log(
          AuditEventType.LOGIN_FAILED,
          ipAddress,
          user.id,
          null,
          { email, reason: 'Account locked' },
        );
      }
      const remainingTime = lockoutStatus.until 
        ? Math.ceil((lockoutStatus.until.getTime() - Date.now()) / 1000)
        : 1800; // Default 30 minutes
      throw new UnauthorizedException(
        `Account is locked due to too many failed login attempts. Please try again in ${Math.ceil(remainingTime / 60)} minutes.`,
      );
    }

    // 5. Verify password
    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      // Record failed attempt
      if (ipAddress) {
        await this.rateLimiterService.recordAttempt({
          email,
          ipAddress,
          success: false,
          failureReason: 'Invalid password',
          userId: user.id,
        });
        const newLockoutStatus = await this.lockoutService.recordFailedAttempt(user.id);
        await this.auditLogService.log(
          AuditEventType.LOGIN_FAILED,
          ipAddress,
          user.id,
          null,
          { email, reason: 'Invalid password' },
        );
        
        // Check if account is now locked after this attempt
        if (newLockoutStatus.locked) {
          const remainingTime = newLockoutStatus.until 
            ? Math.ceil((newLockoutStatus.until.getTime() - Date.now()) / 1000)
            : 1800; // Default 30 minutes
          throw new UnauthorizedException(
            `Account has been locked due to too many failed login attempts. Please try again in ${Math.ceil(remainingTime / 60)} minutes.`,
          );
        }
      }
      
      throw new UnauthorizedException('Invalid credentials');
    }

    // 6. Reset failed attempts on successful validation
    await this.lockoutService.resetFailedAttempts(user.id);

    const { password: _, ...result } = user;
    return result;
  }

  /**
   * Complete login process after successful validation
   */
  async login(
    user: any,
    ipAddress: string,
    userAgent: string,
    rememberMe: boolean = false,
  ) {
    // Get school status if user belongs to a school
    let schoolStatus = null;
    if (user.schoolId) {
      const school = await this.prisma.school.findUnique({
        where: { id: user.schoolId },
        select: { status: true },
      });
      schoolStatus = school?.status || null;
    }

    // Generate token pair
    const tokens = await this.tokenService.generateTokenPair(
      user.id,
      user.email,
      user.role,
      user.schoolId,
      rememberMe,
    );

    // Create session
    await this.sessionService.createSession(
      user.id,
      tokens.refreshToken,
      ipAddress,
      userAgent,
      tokens.expiresIn,
    );

    // Update last login timestamp and IP
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    });

    // Log successful login
    await this.auditLogService.log(
      AuditEventType.LOGIN_SUCCESS,
      ipAddress,
      user.id,
      userAgent,
      { rememberMe },
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        schoolId: user.schoolId,
        schoolStatus: schoolStatus,
        requirePasswordChange: user.requirePasswordChange,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    const { accessToken } = await this.tokenService.refreshAccessToken(refreshToken);
    
    // Log token refresh
    const payload = this.tokenService.decodeToken(refreshToken);
    if (payload) {
      await this.auditLogService.log(
        AuditEventType.TOKEN_REFRESH,
        'unknown', // IP not available in this context
        payload.sub,
      );
    }
    
    return { accessToken };
  }

  async logout(refreshToken: string, ipAddress?: string, userAgent?: string) {
    const session = await this.sessionService.getSessionByToken(refreshToken);
    if (session) {
      await this.sessionService.revokeSession(session.id, session.userId);
      
      // Log logout
      await this.auditLogService.log(
        AuditEventType.LOGOUT,
        ipAddress || session.ipAddress,
        session.userId,
        userAgent,
      );
    }
  }

  async validateToken(payload: any) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    const { password: _, ...result } = user;
    return result;
  }
}
