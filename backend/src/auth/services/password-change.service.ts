import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordSecurityService } from './password-security.service';
import { SessionService } from './session.service';
import { AuditLogService, AuditEventType } from './audit-log.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordChangeService {
  constructor(
    private prisma: PrismaService,
    private passwordSecurityService: PasswordSecurityService,
    private sessionService: SessionService,
    private auditLogService: AuditLogService,
  ) {}

  /**
   * Change user password (requires current password verification)
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    currentSessionId: string,
    ipAddress: string,
    userAgent?: string,
  ): Promise<void> {
    // Get user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Validate new password strength
    const strengthValidation = this.passwordSecurityService.validatePasswordStrength(
      newPassword,
      { email: user.email, name: user.name },
    );

    if (!strengthValidation.isValid) {
      throw new BadRequestException(
        `New password does not meet requirements: ${strengthValidation.feedback.join(', ')}`,
      );
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    // Check password history
    const isReused = await this.passwordSecurityService.checkPasswordHistory(
      userId,
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
      where: { id: userId },
      data: {
        password: hashedPassword,
        requirePasswordChange: false,
      },
    });

    // Store in password history
    await this.passwordSecurityService.addToPasswordHistory(userId, hashedPassword);

    // Invalidate all other sessions (keep current session active)
    await this.sessionService.revokeOtherSessions(userId, currentSessionId);

    // Log password change
    await this.auditLogService.log(
      AuditEventType.PASSWORD_CHANGED,
      ipAddress,
      userId,
      userAgent,
    );

    // Note: Email notification would be sent here (task 9.6)
    // This would be implemented when email service is added in Phase 9
  }

  /**
   * Force password change on first login
   */
  async checkRequirePasswordChange(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { requirePasswordChange: true },
    });

    return user?.requirePasswordChange || false;
  }

  /**
   * Set requirePasswordChange flag for user
   */
  async setRequirePasswordChange(userId: string, required: boolean): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { requirePasswordChange: required },
    });
  }
}
