import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('SessionService', () => {
  let service: SessionService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    session: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
    Object.values(mockPrismaService.session).forEach((mock) => mock.mockReset());
  });

  describe('createSession', () => {
    const userId = 'user123';
    const refreshToken = 'refresh-token';
    const ipAddress = '192.168.1.1';
    const userAgent = 'Mozilla/5.0';
    const expiresInSeconds = 7 * 24 * 60 * 60; // 7 days

    it('should create a new session', async () => {
      const mockSession = {
        id: 'session123',
        userId,
        refreshToken,
        ipAddress,
        userAgent,
        createdAt: new Date(),
        lastActivityAt: new Date(),
        expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
      };
      mockPrismaService.session.create.mockResolvedValue(mockSession);

      const result = await service.createSession(
        userId,
        refreshToken,
        ipAddress,
        userAgent,
        expiresInSeconds,
      );

      expect(result.id).toBe('session123');
      expect(result.userId).toBe(userId);
      expect(result.ipAddress).toBe(ipAddress);
      expect(mockPrismaService.session.create).toHaveBeenCalled();
    });

    it('should set correct expiry time', async () => {
      const beforeTime = Date.now();
      mockPrismaService.session.create.mockResolvedValue({
        id: 'session123',
        userId,
        refreshToken,
        ipAddress,
        userAgent,
        createdAt: new Date(),
        lastActivityAt: new Date(),
        expiresAt: new Date(beforeTime + expiresInSeconds * 1000),
      });

      const result = await service.createSession(
        userId,
        refreshToken,
        ipAddress,
        userAgent,
        expiresInSeconds,
      );

      const expectedExpiry = beforeTime + expiresInSeconds * 1000;
      const actualExpiry = result.expiresAt.getTime();
      expect(Math.abs(actualExpiry - expectedExpiry)).toBeLessThan(1000);
    });
  });

  describe('getSessionByToken', () => {
    it('should return session when found', async () => {
      const mockSession = {
        id: 'session123',
        userId: 'user123',
        refreshToken: 'token',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        createdAt: new Date(),
        lastActivityAt: new Date(),
        expiresAt: new Date(),
      };
      mockPrismaService.session.findFirst.mockResolvedValue(mockSession);

      const result = await service.getSessionByToken('token');

      expect(result).toBeTruthy();
      expect(result?.id).toBe('session123');
    });

    it('should return null when session not found', async () => {
      mockPrismaService.session.findFirst.mockResolvedValue(null);

      const result = await service.getSessionByToken('invalid-token');

      expect(result).toBeNull();
    });
  });

  describe('getUserSessions', () => {
    const userId = 'user123';

    it('should return all active sessions for user', async () => {
      const mockSessions = [
        {
          id: 'session1',
          userId,
          refreshToken: 'token1',
          ipAddress: '192.168.1.1',
          userAgent: 'Chrome',
          createdAt: new Date(),
          lastActivityAt: new Date(),
          expiresAt: new Date(Date.now() + 1000000),
        },
        {
          id: 'session2',
          userId,
          refreshToken: 'token2',
          ipAddress: '192.168.1.2',
          userAgent: 'Firefox',
          createdAt: new Date(),
          lastActivityAt: new Date(),
          expiresAt: new Date(Date.now() + 1000000),
        },
      ];
      mockPrismaService.session.findMany.mockResolvedValue(mockSessions);

      const result = await service.getUserSessions(userId);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('session1');
      expect(result[1].id).toBe('session2');
    });

    it('should mark current session', async () => {
      const mockSessions = [
        {
          id: 'session1',
          userId,
          refreshToken: 'token1',
          ipAddress: '192.168.1.1',
          userAgent: 'Chrome',
          createdAt: new Date(),
          lastActivityAt: new Date(),
          expiresAt: new Date(Date.now() + 1000000),
        },
      ];
      mockPrismaService.session.findMany.mockResolvedValue(mockSessions);

      const result = await service.getUserSessions(userId, 'session1');

      expect(result[0].isCurrent).toBe(true);
    });

    it('should only return non-expired sessions', async () => {
      mockPrismaService.session.findMany.mockResolvedValue([]);

      await service.getUserSessions(userId);

      const call = mockPrismaService.session.findMany.mock.calls[0][0];
      expect(call.where.expiresAt.gt).toBeInstanceOf(Date);
    });
  });

  describe('updateSessionActivity', () => {
    it('should update last activity timestamp', async () => {
      mockPrismaService.session.update.mockResolvedValue({});

      await service.updateSessionActivity('session123');

      expect(mockPrismaService.session.update).toHaveBeenCalledWith({
        where: { id: 'session123' },
        data: { lastActivityAt: expect.any(Date) },
      });
    });
  });

  describe('revokeSession', () => {
    const sessionId = 'session123';
    const userId = 'user123';

    it('should revoke session successfully', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue({
        id: sessionId,
        userId,
      });
      mockPrismaService.session.delete.mockResolvedValue({});

      await service.revokeSession(sessionId, userId);

      expect(mockPrismaService.session.delete).toHaveBeenCalledWith({
        where: { id: sessionId },
      });
    });

    it('should throw NotFoundException when session not found', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue(null);

      await expect(service.revokeSession(sessionId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw error when user does not own session', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue({
        id: sessionId,
        userId: 'different-user',
      });

      await expect(service.revokeSession(sessionId, userId)).rejects.toThrow(
        'Unauthorized to revoke this session',
      );
    });
  });

  describe('revokeOtherSessions', () => {
    it('should revoke all sessions except current', async () => {
      mockPrismaService.session.deleteMany.mockResolvedValue({ count: 3 });

      const count = await service.revokeOtherSessions('user123', 'session1');

      expect(count).toBe(3);
      expect(mockPrismaService.session.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: 'user123',
          id: { not: 'session1' },
        },
      });
    });
  });

  describe('revokeAllSessions', () => {
    it('should revoke all sessions for user', async () => {
      mockPrismaService.session.deleteMany.mockResolvedValue({ count: 5 });

      const count = await service.revokeAllSessions('user123');

      expect(count).toBe(5);
      expect(mockPrismaService.session.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user123' },
      });
    });
  });

  describe('cleanupExpiredSessions', () => {
    it('should delete expired sessions', async () => {
      mockPrismaService.session.deleteMany.mockResolvedValue({ count: 10 });

      const count = await service.cleanupExpiredSessions();

      expect(count).toBe(10);
      expect(mockPrismaService.session.deleteMany).toHaveBeenCalledWith({
        where: {
          expiresAt: { lt: expect.any(Date) },
        },
      });
    });
  });

  describe('isSessionValid', () => {
    const sessionId = 'session123';

    it('should return true for valid session', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue({
        id: sessionId,
        expiresAt: new Date(Date.now() + 1000000),
        lastActivityAt: new Date(),
      });

      const result = await service.isSessionValid(sessionId);

      expect(result).toBe(true);
    });

    it('should return false when session not found', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue(null);

      const result = await service.isSessionValid(sessionId);

      expect(result).toBe(false);
    });

    it('should return false when session is expired', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue({
        id: sessionId,
        expiresAt: new Date(Date.now() - 1000),
        lastActivityAt: new Date(),
      });

      const result = await service.isSessionValid(sessionId);

      expect(result).toBe(false);
    });

    it('should return false when session is idle too long', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue({
        id: sessionId,
        expiresAt: new Date(Date.now() + 1000000),
        lastActivityAt: new Date(Date.now() - 31 * 60 * 1000), // 31 minutes ago
      });

      const result = await service.isSessionValid(sessionId, 30);

      expect(result).toBe(false);
    });

    it('should return true when session is within idle time', async () => {
      mockPrismaService.session.findUnique.mockResolvedValue({
        id: sessionId,
        expiresAt: new Date(Date.now() + 1000000),
        lastActivityAt: new Date(Date.now() - 29 * 60 * 1000), // 29 minutes ago
      });

      const result = await service.isSessionValid(sessionId, 30);

      expect(result).toBe(true);
    });
  });
});
