import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface SessionInfo {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  isCurrent?: boolean;
}

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new session
   */
  async createSession(
    userId: string,
    refreshToken: string,
    ipAddress: string,
    userAgent: string,
    expiresInSeconds: number,
  ): Promise<SessionInfo> {
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    const session = await this.prisma.session.create({
      data: {
        userId,
        token: refreshToken, // Use refresh token as the session token
        refreshToken,
        ipAddress,
        userAgent,
        expiresAt,
        lastActivityAt: new Date(),
      },
    });

    return {
      id: session.id,
      userId: session.userId,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      createdAt: session.createdAt,
      lastActivityAt: session.lastActivityAt,
      expiresAt: session.expiresAt,
    };
  }

  /**
   * Get session by refresh token
   */
  async getSessionByToken(refreshToken: string): Promise<SessionInfo | null> {
    const session = await this.prisma.session.findFirst({
      where: { refreshToken },
    });

    if (!session) {
      return null;
    }

    return {
      id: session.id,
      userId: session.userId,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      createdAt: session.createdAt,
      lastActivityAt: session.lastActivityAt,
      expiresAt: session.expiresAt,
    };
  }

  /**
   * Get all active sessions for a user
   */
  async getUserSessions(userId: string, currentSessionId?: string): Promise<SessionInfo[]> {
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      orderBy: { lastActivityAt: 'desc' },
    });

    return sessions.map((session) => ({
      id: session.id,
      userId: session.userId,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      createdAt: session.createdAt,
      lastActivityAt: session.lastActivityAt,
      expiresAt: session.expiresAt,
      isCurrent: currentSessionId ? session.id === currentSessionId : undefined,
    }));
  }

  /**
   * Update session last activity timestamp
   */
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { lastActivityAt: new Date() },
    });
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: string, userId: string): Promise<void> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new Error('Unauthorized to revoke this session');
    }

    await this.prisma.session.delete({
      where: { id: sessionId },
    });
  }

  /**
   * Revoke all sessions for a user except the current one
   */
  async revokeOtherSessions(userId: string, currentSessionId: string): Promise<number> {
    const result = await this.prisma.session.deleteMany({
      where: {
        userId,
        id: { not: currentSessionId },
      },
    });

    return result.count;
  }

  /**
   * Revoke all sessions for a user
   */
  async revokeAllSessions(userId: string): Promise<number> {
    const result = await this.prisma.session.deleteMany({
      where: { userId },
    });

    return result.count;
  }

  /**
   * Clean up expired sessions
   * Should be run periodically via cron job
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.prisma.session.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    return result.count;
  }

  /**
   * Check if session is expired or inactive
   */
  async isSessionValid(sessionId: string, maxIdleMinutes: number = 30): Promise<boolean> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return false;
    }

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      return false;
    }

    // Check if session is idle for too long
    const idleTime = Date.now() - session.lastActivityAt.getTime();
    const maxIdleMs = maxIdleMinutes * 60 * 1000;

    if (idleTime > maxIdleMs) {
      return false;
    }

    return true;
  }
}
