import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

const SALT_ROUNDS = 12;

export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isValid: boolean;
}

@Injectable()
export class PasswordSecurityService {
  constructor(private prisma: PrismaService) {}

  /**
   * Hash a password using bcrypt with cost factor 12
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Verify a password against a hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(
    password: string,
    userInfo: { name: string; email: string }
  ): PasswordStrength {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters');
    } else if (password.length >= 12) {
      score++;
    }

    // Character variety
    if (!/[a-z]/.test(password)) {
      feedback.push('Include lowercase letters');
    } else {
      score++;
    }


    if (!/[A-Z]/.test(password)) {
      feedback.push('Include uppercase letters');
    } else {
      score++;
    }

    if (!/[0-9]/.test(password)) {
      feedback.push('Include numbers');
    } else {
      score++;
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      feedback.push('Include special characters');
    } else {
      score++;
    }

    // Personal info check
    const lowerPassword = password.toLowerCase();
    const nameParts = userInfo.name.toLowerCase().split(' ');
    const containsName = nameParts.some(part => part.length > 2 && lowerPassword.includes(part));
    
    if (containsName) {
      feedback.push('Password should not contain your name');
      score = Math.max(0, score - 2);
    }

    const emailUser = userInfo.email.split('@')[0].toLowerCase();
    if (lowerPassword.includes(emailUser)) {
      feedback.push('Password should not contain your email');
      score = Math.max(0, score - 2);
    }

    // Common password check
    if (this.isCommonPassword(password)) {
      feedback.push('This password is too common');
      score = 0;
    }

    return {
      score,
      feedback,
      isValid: score >= 3 && feedback.length === 0
    };
  }

  /**
   * Check if password was used in the last 5 passwords
   */
  async checkPasswordHistory(userId: string, newPassword: string): Promise<boolean> {
    const history = await this.prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    for (const record of history) {
      if (await bcrypt.compare(newPassword, record.passwordHash)) {
        return false; // Password was used before
      }
    }

    return true; // Password is new
  }

  /**
   * Add password to history and maintain only last 5
   */
  async addToPasswordHistory(userId: string, passwordHash: string): Promise<void> {
    await this.prisma.passwordHistory.create({
      data: { userId, passwordHash }
    });

    // Keep only last 5 passwords
    const history = await this.prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: 5
    });

    if (history.length > 0) {
      await this.prisma.passwordHistory.deleteMany({
        where: {
          id: { in: history.map(h => h.id) }
        }
      });
    }
  }

  /**
   * Check if password is in common passwords list
   * For now, checking against a basic list. In production, load from file.
   */
  private isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password', 'password123', '12345678', 'qwerty', 'abc123',
      'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
      'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
      'bailey', 'passw0rd', 'shadow', '123123', '654321',
      'superman', 'qazwsx', 'michael', 'football', 'welcome'
    ];

    return commonPasswords.includes(password.toLowerCase());
  }
}
