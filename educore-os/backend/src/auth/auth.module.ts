import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TokenService } from './services/token.service';
import { SessionService } from './services/session.service';
import { PasswordSecurityService } from './services/password-security.service';
import { LoginRateLimiterService } from './services/login-rate-limiter.service';
import { AccountLockoutService } from './services/account-lockout.service';
import { AuditLogService } from './services/audit-log.service';
import { PasswordResetService } from './services/password-reset.service';
import { PasswordChangeService } from './services/password-change.service';
import { PortalService } from './services/portal.service';
import { RegistrationService } from './services/registration.service';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'educore-secret-key-change-in-production',
      signOptions: { expiresIn: '15m' }, // Default for access tokens
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    TokenService,
    SessionService,
    PasswordSecurityService,
    LoginRateLimiterService,
    AccountLockoutService,
    AuditLogService,
    PasswordResetService,
    PasswordChangeService,
    PortalService,
    RegistrationService,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    TokenService,
    SessionService,
    PasswordSecurityService,
    LoginRateLimiterService,
    AccountLockoutService,
    AuditLogService,
    PasswordResetService,
    PasswordChangeService,
    PortalService,
    RegistrationService,
  ],
})
export class AuthModule {}
