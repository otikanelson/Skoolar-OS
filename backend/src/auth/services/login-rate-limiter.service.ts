import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number; // seconds
}

@Injectable()
export class LoginRateLimiterService {
  constructor(private prisma: PrismaService) {}

  /**
   * Check if login attempt is allowed based on rate limits
   * - Max 5 failed attempts per email per 15 minutes
   * - Max 10 failed attempts per IP per 15 minutes
   */
  async checkRateLimit(email: string, ipAddress: string): Promise<RateLimitResult> {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    // Check failed attempts by email
    const emailAttempts = await this.prisma.loginAttempt.count({
      where: {
        email,
        success: false,
        createdAt: { gte: fifteenMinutesAgo }
      }
    });

    if (emailAttempts >= 5) {
      return { allowed: false, retryAfter: 900 }; // 15 minutes
    }

    // Check failed attempts by IP
    const ipAttempts = await this.prisma.loginAttempt.count({
      where: {
        ipAddress,
        success: false,
        createdAt: { gte: fifteenMinutesAgo }
      }
    });

    if (ipAttempts >= 10) {
      return { allowed: false, retryAfter: 900 };
    }

    return { allowed: true };
  }

  /**
   * Record a login attempt (success or failure)
   */
  async recordAttempt(data: {
    email: string;
    ipAddress: string;
    userAgent?: string;
    success: boolean;
    failureReason?: string;
    userId?: string;
  }): Promise<void> {
    await this.prisma.loginAttempt.create({ data });
  }

  /**
   * Clean up old login attempts (older than 30 days)
   * Should be run periodically via cron job
   */
  async cleanupOldAttempts(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const result = await this.prisma.loginAttempt.deleteMany({
      where: {
        createdAt: { lt: thirtyDaysAgo }
      }
    });

    return result.count;
  }
}
