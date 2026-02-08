import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface LockoutStatus {
  locked: boolean;
  until?: Date;
  attemptsRemaining?: number;
}

@Injectable()
export class AccountLockoutService {
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes

  constructor(private prisma: PrismaService) {}

  /**
   * Check if account is currently locked
   */
  async checkLockout(userId: string): Promise<LockoutStatus> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { lockedUntil: true, failedLoginAttempts: true }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return {
        locked: true,
        until: user.lockedUntil
      };
    }

    // Clear lockout if expired
    if (user.lockedUntil) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { lockedUntil: null, failedLoginAttempts: 0 }
      });
      
      // Return with reset attempts
      return {
        locked: false,
        attemptsRemaining: this.MAX_FAILED_ATTEMPTS
      };
    }

    return {
      locked: false,
      attemptsRemaining: this.MAX_FAILED_ATTEMPTS - user.failedLoginAttempts
    };
  }

  /**
   * Record a failed login attempt and lock account if threshold reached
   */
  async recordFailedAttempt(userId: string): Promise<LockoutStatus> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { failedLoginAttempts: true }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const attempts = user.failedLoginAttempts + 1;

    if (attempts >= this.MAX_FAILED_ATTEMPTS) {
      // Lock account for 30 minutes
      const lockedUntil = new Date(Date.now() + this.LOCKOUT_DURATION_MS);
      await this.prisma.user.update({
        where: { id: userId },
        data: { failedLoginAttempts: attempts, lockedUntil }
      });

      return {
        locked: true,
        until: lockedUntil
      };
    } else {
      await this.prisma.user.update({
        where: { id: userId },
        data: { failedLoginAttempts: attempts }
      });

      return {
        locked: false,
        attemptsRemaining: this.MAX_FAILED_ATTEMPTS - attempts
      };
    }
  }

  /**
   * Reset failed attempts counter (called on successful login)
   */
  async resetFailedAttempts(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { failedLoginAttempts: 0, lockedUntil: null }
    });
  }

  /**
   * Manually unlock an account (admin action)
   */
  async unlockAccount(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { failedLoginAttempts: 0, lockedUntil: null }
    });
  }
}
