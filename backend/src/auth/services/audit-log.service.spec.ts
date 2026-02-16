import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogService, AuditEventType } from './audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuditLogService', () => {
  let service: AuditLogService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    auditLog: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
    Object.values(mockPrismaService.auditLog).forEach((mock) => mock.mockReset());
  });

  describe('log', () => {
    it('should create an audit log entry', async () => {
      mockPrismaService.auditLog.create.mockResolvedValue({});

      await service.log(
        AuditEventType.LOGIN_SUCCESS,
        '192.168.1.1',
        'user123',
        'Mozilla/5.0',
        { test: 'data' },
      );

      expect(mockPrismaService.auditLog.create).toHaveBeenCalledWith({
        data: {
          eventType: AuditEventType.LOGIN_SUCCESS,
          userId: 'user123',
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
          details: JSON.stringify({ test: 'data' }),
        },
      });
    });

    it('should create log without optional fields', async () => {
      mockPrismaService.auditLog.create.mockResolvedValue({});

      await service.log(AuditEventType.UNAUTHORIZED_ACCESS, '192.168.1.1');

      expect(mockPrismaService.auditLog.create).toHaveBeenCalledWith({
        data: {
          eventType: AuditEventType.UNAUTHORIZED_ACCESS,
          userId: undefined,
          ipAddress: '192.168.1.1',
          userAgent: undefined,
          details: null,
        },
      });
    });
  });

  describe('logAuthEvent', () => {
    it('should log login success', async () => {
      mockPrismaService.auditLog.create.mockResolvedValue({});

      await service.logAuthEvent(
        AuditEventType.LOGIN_SUCCESS,
        'user123',
        '192.168.1.1',
        'Chrome',
        { rememberMe: true },
      );

      expect(mockPrismaService.auditLog.create).toHaveBeenCalled();
      const call = mockPrismaService.auditLog.create.mock.calls[0][0];
      expect(call.data.eventType).toBe(AuditEventType.LOGIN_SUCCESS);
      expect(call.data.userId).toBe('user123');
    });

    it('should log login failure', async () => {
      mockPrismaService.auditLog.create.mockResolvedValue({});

      await service.logAuthEvent(
        AuditEventType.LOGIN_FAILED,
        'user123',
        '192.168.1.1',
        'Chrome',
        { reason: 'Invalid password' },
      );

      expect(mockPrismaService.auditLog.create).toHaveBeenCalled();
      const call = mockPrismaService.auditLog.create.mock.calls[0][0];
      expect(call.data.eventType).toBe(AuditEventType.LOGIN_FAILED);
    });
  });

  describe('logAuthorizationFailure', () => {
    it('should log unauthorized access', async () => {
      mockPrismaService.auditLog.create.mockResolvedValue({});

      await service.logAuthorizationFailure(
        AuditEventType.UNAUTHORIZED_ACCESS,
        'user123',
        '192.168.1.1',
        '/admin/users',
        'Chrome',
      );

      expect(mockPrismaService.auditLog.create).toHaveBeenCalled();
      const call = mockPrismaService.auditLog.create.mock.calls[0][0];
      expect(call.data.eventType).toBe(AuditEventType.UNAUTHORIZED_ACCESS);
      const details = JSON.parse(call.data.details);
      expect(details.resource).toBe('/admin/users');
    });

    it('should log permission denied', async () => {
      mockPrismaService.auditLog.create.mockResolvedValue({});

      await service.logAuthorizationFailure(
        AuditEventType.PERMISSION_DENIED,
        undefined,
        '192.168.1.1',
        '/api/sensitive',
      );

      expect(mockPrismaService.auditLog.create).toHaveBeenCalled();
      const call = mockPrismaService.auditLog.create.mock.calls[0][0];
      expect(call.data.userId).toBeUndefined();
    });
  });

  describe('logSensitiveDataAccess', () => {
    it('should log data view', async () => {
      mockPrismaService.auditLog.create.mockResolvedValue({});

      await service.logSensitiveDataAccess(
        'user123',
        '192.168.1.1',
        'StudentRecord',
        'record456',
        'VIEW',
        'Chrome',
      );

      expect(mockPrismaService.auditLog.create).toHaveBeenCalled();
      const call = mockPrismaService.auditLog.create.mock.calls[0][0];
      expect(call.data.eventType).toBe(AuditEventType.SENSITIVE_DATA_ACCESS);
      const details = JSON.parse(call.data.details);
      expect(details.dataType).toBe('StudentRecord');
      expect(details.action).toBe('VIEW');
    });

    it('should log data export', async () => {
      mockPrismaService.auditLog.create.mockResolvedValue({});

      await service.logSensitiveDataAccess(
        'user123',
        '192.168.1.1',
        'StudentGrades',
        'export789',
        'EXPORT',
      );

      expect(mockPrismaService.auditLog.create).toHaveBeenCalled();
      const call = mockPrismaService.auditLog.create.mock.calls[0][0];
      expect(call.data.eventType).toBe(AuditEventType.SENSITIVE_DATA_EXPORT);
    });
  });

  describe('searchLogs', () => {
    const mockLogs = [
      {
        id: 'log1',
        eventType: AuditEventType.LOGIN_SUCCESS,
        userId: 'user123',
        ipAddress: '192.168.1.1',
        userAgent: 'Chrome',
        details: JSON.stringify({ test: 'data' }),
        createdAt: new Date(),
      },
      {
        id: 'log2',
        eventType: AuditEventType.LOGOUT,
        userId: 'user123',
        ipAddress: '192.168.1.1',
        userAgent: 'Chrome',
        details: null,
        createdAt: new Date(),
      },
    ];

    it('should search logs with filters', async () => {
      mockPrismaService.auditLog.findMany.mockResolvedValue(mockLogs);
      mockPrismaService.auditLog.count.mockResolvedValue(2);

      const result = await service.searchLogs({
        userId: 'user123',
        eventType: AuditEventType.LOGIN_SUCCESS,
        limit: 10,
        offset: 0,
      });

      expect(result.logs).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(mockPrismaService.auditLog.findMany).toHaveBeenCalled();
    });

    it('should filter by date range', async () => {
      mockPrismaService.auditLog.findMany.mockResolvedValue([]);
      mockPrismaService.auditLog.count.mockResolvedValue(0);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      await service.searchLogs({ startDate, endDate });

      const call = mockPrismaService.auditLog.findMany.mock.calls[0][0];
      expect(call.where.createdAt.gte).toEqual(startDate);
      expect(call.where.createdAt.lte).toEqual(endDate);
    });

    it('should filter by IP address', async () => {
      mockPrismaService.auditLog.findMany.mockResolvedValue([]);
      mockPrismaService.auditLog.count.mockResolvedValue(0);

      await service.searchLogs({ ipAddress: '192.168.1.1' });

      const call = mockPrismaService.auditLog.findMany.mock.calls[0][0];
      expect(call.where.ipAddress).toBe('192.168.1.1');
    });

    it('should use default limit and offset', async () => {
      mockPrismaService.auditLog.findMany.mockResolvedValue([]);
      mockPrismaService.auditLog.count.mockResolvedValue(0);

      await service.searchLogs({});

      const call = mockPrismaService.auditLog.findMany.mock.calls[0][0];
      expect(call.take).toBe(100);
      expect(call.skip).toBe(0);
    });

    it('should parse JSON details', async () => {
      mockPrismaService.auditLog.findMany.mockResolvedValue(mockLogs);
      mockPrismaService.auditLog.count.mockResolvedValue(2);

      const result = await service.searchLogs({});

      expect(result.logs[0].details).toEqual({ test: 'data' });
      expect(result.logs[1].details).toBeUndefined();
    });
  });

  describe('getUserLogs', () => {
    it('should get logs for specific user', async () => {
      const mockLogs = [
        {
          id: 'log1',
          eventType: AuditEventType.LOGIN_SUCCESS,
          userId: 'user123',
          ipAddress: '192.168.1.1',
          userAgent: 'Chrome',
          details: null,
          createdAt: new Date(),
        },
      ];
      mockPrismaService.auditLog.findMany.mockResolvedValue(mockLogs);

      const result = await service.getUserLogs('user123', 50, 0);

      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe('user123');
      expect(mockPrismaService.auditLog.findMany).toHaveBeenCalledWith({
        where: { userId: 'user123' },
        orderBy: { createdAt: 'desc' },
        take: 50,
        skip: 0,
      });
    });
  });

  describe('getRecentLogs', () => {
    it('should get recent logs', async () => {
      const mockLogs = [
        {
          id: 'log1',
          eventType: AuditEventType.LOGIN_SUCCESS,
          userId: 'user123',
          ipAddress: '192.168.1.1',
          userAgent: 'Chrome',
          details: null,
          createdAt: new Date(),
        },
      ];
      mockPrismaService.auditLog.findMany.mockResolvedValue(mockLogs);

      const result = await service.getRecentLogs(100);

      expect(result).toHaveLength(1);
      expect(mockPrismaService.auditLog.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
    });
  });

  describe('cleanupOldLogs', () => {
    it('should delete logs older than specified days', async () => {
      mockPrismaService.auditLog.deleteMany.mockResolvedValue({ count: 150 });

      const result = await service.cleanupOldLogs(90);

      expect(result).toBe(150);
      expect(mockPrismaService.auditLog.deleteMany).toHaveBeenCalled();
      const call = mockPrismaService.auditLog.deleteMany.mock.calls[0][0];
      expect(call.where.createdAt.lt).toBeInstanceOf(Date);
    });

    it('should use default 90 days', async () => {
      mockPrismaService.auditLog.deleteMany.mockResolvedValue({ count: 0 });

      await service.cleanupOldLogs();

      const call = mockPrismaService.auditLog.deleteMany.mock.calls[0][0];
      const cutoffDate = call.where.createdAt.lt;
      const expectedDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      expect(Math.abs(cutoffDate.getTime() - expectedDate.getTime())).toBeLessThan(1000);
    });
  });

  describe('getStatistics', () => {
    it('should calculate statistics', async () => {
      const mockLogs = [
        {
          eventType: AuditEventType.LOGIN_SUCCESS,
          userId: 'user1',
          ipAddress: '192.168.1.1',
        },
        {
          eventType: AuditEventType.LOGIN_SUCCESS,
          userId: 'user2',
          ipAddress: '192.168.1.2',
        },
        {
          eventType: AuditEventType.LOGOUT,
          userId: 'user1',
          ipAddress: '192.168.1.1',
        },
      ];
      mockPrismaService.auditLog.findMany.mockResolvedValue(mockLogs);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const result = await service.getStatistics(startDate, endDate);

      expect(result.totalEvents).toBe(3);
      expect(result.eventsByType[AuditEventType.LOGIN_SUCCESS]).toBe(2);
      expect(result.eventsByType[AuditEventType.LOGOUT]).toBe(1);
      expect(result.uniqueUsers).toBe(2);
      expect(result.uniqueIPs).toBe(2);
    });

    it('should handle logs without userId', async () => {
      const mockLogs = [
        {
          eventType: AuditEventType.UNAUTHORIZED_ACCESS,
          userId: null,
          ipAddress: '192.168.1.1',
        },
      ];
      mockPrismaService.auditLog.findMany.mockResolvedValue(mockLogs);

      const result = await service.getStatistics(new Date(), new Date());

      expect(result.uniqueUsers).toBe(0);
      expect(result.uniqueIPs).toBe(1);
    });
  });
});
