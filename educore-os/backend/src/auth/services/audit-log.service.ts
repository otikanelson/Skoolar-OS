import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export enum AuditEventType {
  // Authentication events
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  
  // Password events
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',
  PASSWORD_RESET_COMPLETED = 'PASSWORD_RESET_COMPLETED',
  
  // Account events
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED = 'ACCOUNT_UNLOCKED',
  
  // Authorization events
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  
  // Session events
  SESSION_CREATED = 'SESSION_CREATED',
  SESSION_REVOKED = 'SESSION_REVOKED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  
  // Data access events
  SENSITIVE_DATA_ACCESS = 'SENSITIVE_DATA_ACCESS',
  SENSITIVE_DATA_EXPORT = 'SENSITIVE_DATA_EXPORT',
  
  // User management events
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
}

export interface AuditLogEntry {
  id: string;
  eventType: string;
  userId?: string;
  ipAddress: string;
  userAgent?: string;
  details?: any;
  createdAt: Date;
}

export interface AuditLogFilter {
  userId?: string;
  eventType?: AuditEventType;
  startDate?: Date;
  endDate?: Date;
  ipAddress?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  /**
   * Log an audit event
   */
  async log(
    eventType: AuditEventType,
    ipAddress: string,
    userId?: string,
    userAgent?: string,
    details?: any,
  ): Promise<void> {
    // Get schoolId from user if userId is provided
    let schoolId: string | undefined;
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { schoolId: true },
      });
      schoolId = user?.schoolId || undefined;
    }

    await this.prisma.auditLog.create({
      data: {
        action: eventType,
        userId,
        schoolId,
        ipAddress,
        userAgent,
        success: true,
        metadata: details || null,
      },
    });
  }

  /**
   * Log authentication event
   */
  async logAuthEvent(
    eventType: AuditEventType.LOGIN_SUCCESS | AuditEventType.LOGIN_FAILED | AuditEventType.LOGOUT,
    userId: string,
    ipAddress: string,
    userAgent?: string,
    details?: any,
  ): Promise<void> {
    await this.log(eventType, ipAddress, userId, userAgent, details);
  }

  /**
   * Log authorization failure
   */
  async logAuthorizationFailure(
    eventType: AuditEventType.UNAUTHORIZED_ACCESS | AuditEventType.PERMISSION_DENIED,
    userId: string | undefined,
    ipAddress: string,
    resource: string,
    userAgent?: string,
  ): Promise<void> {
    await this.log(eventType, ipAddress, userId, userAgent, {
      resource,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log sensitive data access
   */
  async logSensitiveDataAccess(
    userId: string,
    ipAddress: string,
    dataType: string,
    recordId: string,
    action: 'VIEW' | 'EXPORT' | 'MODIFY',
    userAgent?: string,
  ): Promise<void> {
    const eventType = action === 'EXPORT' 
      ? AuditEventType.SENSITIVE_DATA_EXPORT 
      : AuditEventType.SENSITIVE_DATA_ACCESS;

    await this.log(eventType, ipAddress, userId, userAgent, {
      dataType,
      recordId,
      action,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Search audit logs with filters
   */
  async searchLogs(filter: AuditLogFilter): Promise<{
    logs: AuditLogEntry[];
    total: number;
  }> {
    const where: any = {};

    if (filter.userId) {
      where.userId = filter.userId;
    }

    if (filter.eventType) {
      where.action = filter.eventType;
    }

    if (filter.ipAddress) {
      where.ipAddress = filter.ipAddress;
    }

    if (filter.startDate || filter.endDate) {
      where.createdAt = {};
      if (filter.startDate) {
        where.createdAt.gte = filter.startDate;
      }
      if (filter.endDate) {
        where.createdAt.lte = filter.endDate;
      }
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filter.limit || 100,
        skip: filter.offset || 0,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      logs: logs.map((log) => ({
        id: log.id,
        eventType: log.action,
        userId: log.userId || undefined,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent || undefined,
        details: log.metadata,
        createdAt: log.createdAt,
      })),
      total,
    };
  }

  /**
   * Get audit logs for a specific user
   */
  async getUserLogs(
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<AuditLogEntry[]> {
    const logs = await this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return logs.map((log) => ({
      id: log.id,
      eventType: log.action,
      userId: log.userId || undefined,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent || undefined,
      details: log.metadata,
      createdAt: log.createdAt,
    }));
  }

  /**
   * Get recent audit logs
   */
  async getRecentLogs(limit: number = 100): Promise<AuditLogEntry[]> {
    const logs = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return logs.map((log) => ({
      id: log.id,
      eventType: log.action,
      userId: log.userId || undefined,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent || undefined,
      details: log.metadata,
      createdAt: log.createdAt,
    }));
  }

  /**
   * Clean up old audit logs (older than specified days)
   * Should be run periodically via cron job
   */
  async cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

    const result = await this.prisma.auditLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
      },
    });

    return result.count;
  }

  /**
   * Get audit log statistics
   */
  async getStatistics(startDate: Date, endDate: Date): Promise<{
    totalEvents: number;
    eventsByType: Record<string, number>;
    uniqueUsers: number;
    uniqueIPs: number;
  }> {
    const logs = await this.prisma.auditLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        action: true,
        userId: true,
        ipAddress: true,
      },
    });

    const eventsByType: Record<string, number> = {};
    const uniqueUsers = new Set<string>();
    const uniqueIPs = new Set<string>();

    logs.forEach((log) => {
      // Count events by type
      eventsByType[log.action] = (eventsByType[log.action] || 0) + 1;

      // Track unique users
      if (log.userId) {
        uniqueUsers.add(log.userId);
      }

      // Track unique IPs
      if (log.ipAddress) {
        uniqueIPs.add(log.ipAddress);
      }
    });

    return {
      totalEvents: logs.length,
      eventsByType,
      uniqueUsers: uniqueUsers.size,
      uniqueIPs: uniqueIPs.size,
    };
  }
}
