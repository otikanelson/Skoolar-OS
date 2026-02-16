import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordSecurityService } from './password-security.service';
import { SessionService } from './session.service';
import { AuditLogService, AuditEventType } from './audit-log.service';
import * as crypto from 'crypto';

export interface PasswordResetRequest {
  token: string;
  expiresAt: Date;
}

@Injectable()
export class PasswordResetService {
  private readonly TOKEN_EXPIRY_HOURS = 1;

  constructor(
    private prisma: PrismaService,
    private passwordSecurityService: PasswordSecurityService,
    private sessionService: SessionService,
    private auditLogService: AuditLogService,
  ) {}

  /**
   * Generate a secure reset token using crypto.randomBytes
   */
  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Request password reset - generates token and stores it
   */
  async requestPasswordReset(
    email: string,
    ipAddress: string,
    userAgent?: string,
  ): Promise<PasswordResetRequest> {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      // Still return a fake token to prevent email enumeration
      return {
        token: this.generateResetToken(),
        expiresAt: new Date(Date.now() + this.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000),
      };
    }

    // Generate secure token
    const token = this.generateResetToken();
    const expiresAt = new Date(Date.now() + this.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    // Invalidate any existing reset tokens for this user
    await this.prisma.passwordResetToken.deleteMany({
      where: { email: user.email },
    });

    // Store new reset token
    await this.prisma.passwordResetToken.create({
      data: {
        email: user.email,
        token,
        expiresAt,
      },
    });

    // Log the password reset request
    await this.auditLogService.log(
      AuditEventType.PASSWORD_RESET_REQUESTED,
      ipAddress,
      user.id,
      userAgent,
      { email },
    );

    return { token, expiresAt };
  }

  /**
   * Validate reset token
   */
  async validateResetToken(token: string): Promise<{
    valid: boolean;
    email?: string;
    error?: string;
  }> {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return { valid: false, error: 'Invalid token' };
    }

    if (resetToken.used) {
      return { valid: false, error: 'Token already used' };
    }

    if (resetToken.expiresAt < new Date()) {
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true, email: resetToken.email };
  }

  /**
   * Reset password using token
   */
  async resetPassword(
    token: string,
    newPassword: string,
    ipAddress: string,
    userAgent?: string,
  ): Promise<void> {
    // Validate token
    const validation = await this.validateResetToken(token);
    if (!validation.valid || !validation.email) {
      throw new BadRequestException(validation.error || 'Invalid token');
    }

    // Get user by email from token
    const user = await this.prisma.user.findUnique({
      where: { email: validation.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate new password strength
    const strengthValidation = this.passwordSecurityService.validatePasswordStrength(
      newPassword,
      { email: user.email, name: user.name },
    );

    if (!strengthValidation.isValid) {
      throw new BadRequestException(
        `Password does not meet requirements: ${strengthValidation.feedback.join(', ')}`,
      );
    }

    // Check password history
    const isReused = await this.passwordSecurityService.checkPasswordHistory(
      user.id,
      newPassword,
    );

    if (isReused) {
      throw new BadRequestException(
        'Password has been used recently. Please choose a different password.',
      );
    }

    // Hash new password
    const hashedPassword = await this.passwordSecurityService.hashPassword(newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        requirePasswordChange: false,
      },
    });

    // Store in password history
    await this.passwordSecurityService.addToPasswordHistory(
      user.id,
      hashedPassword,
    );

    // Mark token as used
    await this.prisma.passwordResetToken.update({
      where: { token },
      data: { used: true, usedAt: new Date() },
    });

    // Invalidate all sessions for this user (force re-login)
    await this.sessionService.revokeAllSessions(user.id);

    // Log password reset completion
    await this.auditLogService.log(
      AuditEventType.PASSWORD_RESET_COMPLETED,
      ipAddress,
      user.id,
      userAgent,
    );
  }

  /**
   * Clean up expired reset tokens
   * Should be run periodically via cron job
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    return result.count;
  }

  /**
   * Get active reset token for user email (for testing/admin purposes)
   */
  async getActiveResetToken(email: string): Promise<PasswordResetRequest | null> {
    const token = await this.prisma.passwordResetToken.findFirst({
      where: {
        email,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!token) {
      return null;
    }

    return {
      token: token.token,
      expiresAt: token.expiresAt,
    };
  }
}
