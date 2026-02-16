import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordSecurityService } from './password-security.service';
import { SessionService } from './session.service';
import { AuditLogService } from './audit-log.service';

describe('PasswordResetService', () => {
  let service: PasswordResetService;
  let prismaService: PrismaService;
  let passwordSecurityService: PasswordSecurityService;
  let sessionService: SessionService;
  let auditLogService: AuditLogService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    passwordResetToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockPasswordSecurityService = {
    validatePasswordStrength: jest.fn(),
    checkPasswordHistory: jest.fn(),
    hashPassword: jest.fn(),
    storePasswordHistory: jest.fn(),
  };

  const mockSessionService = {
    revokeAllSessions: jest.fn(),
  };

  const mockAuditLogService = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordResetService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PasswordSecurityService,
          useValue: mockPasswordSecurityService,
        },
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
        {
          provide: AuditLogService,
          useValue: mockAuditLogService,
        },
      ],
    }).compile();

    service = module.get<PasswordResetService>(PasswordResetService);
    prismaService = module.get<PrismaService>(PrismaService);
    passwordSecurityService = module.get<PasswordSecurityService>(PasswordSecurityService);
    sessionService = module.get<SessionService>(SessionService);
    auditLogService = module.get<AuditLogService>(AuditLogService);

    jest.clearAllMocks();
    Object.values(mockPrismaService.user).forEach((mock) => mock.mockReset());
    Object.values(mockPrismaService.passwordResetToken).forEach((mock) => mock.mockReset());
    Object.values(mockPasswordSecurityService).forEach((mock) => mock.mockReset());
    mockSessionService.revokeAllSessions.mockReset();
    mockAuditLogService.log.mockReset();
  });

  describe('requestPasswordReset', () => {
    const email = 'test@example.com';
    const ipAddress = '192.168.1.1';
    const userAgent = 'Chrome';

    it('should generate and store reset token for existing user', async () => {
      const mockUser = {
        id: 'user123',
        email,
        name: 'Test User',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.passwordResetToken.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaService.passwordResetToken.create.mockResolvedValue({});
      mockAuditLogService.log.mockResolvedValue(undefined);

      const result = await service.requestPasswordReset(email, ipAddress, userAgent);

      expect(result.token).toBeDefined();
      expect(result.token).toHaveLength(64); // 32 bytes = 64 hex chars
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(mockPrismaService.passwordResetToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user123' },
      });
      expect(mockPrismaService.passwordResetToken.create).toHaveBeenCalled();
      expect(mockAuditLogService.log).toHaveBeenCalled();
    });

    it('should return fake token for non-existent user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.requestPasswordReset(email, ipAddress);

      expect(result.token).toBeDefined();
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(mockPrismaService.passwordResetToken.create).not.toHaveBeenCalled();
      expect(mockAuditLogService.log).not.toHaveBeenCalled();
    });

    it('should set token expiry to 1 hour', async () => {
      const mockUser = { id: 'user123', email, name: 'Test' };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.passwordResetToken.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaService.passwordResetToken.create.mockResolvedValue({});
      mockAuditLogService.log.mockResolvedValue(undefined);

      const beforeTime = Date.now();
      const result = await service.requestPasswordReset(email, ipAddress);
      const afterTime = Date.now();

      const expectedExpiry = 60 * 60 * 1000; // 1 hour in ms
      const actualExpiry = result.expiresAt.getTime() - beforeTime;

      expect(actualExpiry).toBeGreaterThanOrEqual(expectedExpiry - 1000);
      expect(actualExpiry).toBeLessThanOrEqual(expectedExpiry + 1000);
    });

    it('should invalidate existing tokens before creating new one', async () => {
      const mockUser = { id: 'user123', email, name: 'Test' };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.passwordResetToken.deleteMany.mockResolvedValue({ count: 2 });
      mockPrismaService.passwordResetToken.create.mockResolvedValue({});
      mockAuditLogService.log.mockResolvedValue(undefined);

      await service.requestPasswordReset(email, ipAddress);

      expect(mockPrismaService.passwordResetToken.deleteMany).toHaveBeenCalled();
      expect(mockPrismaService.passwordResetToken.create).toHaveBeenCalled();
    });
  });

  describe('validateResetToken', () => {
    const token = 'valid-token-123';
    const email = 'test@example.com';

    it('should return valid for valid token', async () => {
      mockPrismaService.passwordResetToken.findUnique.mockResolvedValue({
        token,
        email,
        used: false,
        expiresAt: new Date(Date.now() + 1000000),
      });

      const result = await service.validateResetToken(token);

      expect(result.valid).toBe(true);
      expect(result.email).toBe(email);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for non-existent token', async () => {
      mockPrismaService.passwordResetToken.findUnique.mockResolvedValue(null);

      const result = await service.validateResetToken(token);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid token');
    });

    it('should return invalid for used token', async () => {
      mockPrismaService.passwordResetToken.findUnique.mockResolvedValue({
        token,
        userId: 'user123',
        used: true,
        expiresAt: new Date(Date.now() + 1000000),
      });

      const result = await service.validateResetToken(token);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Token already used');
    });

    it('should return invalid for expired token', async () => {
      mockPrismaService.passwordResetToken.findUnique.mockResolvedValue({
        token,
        userId: 'user123',
        used: false,
        expiresAt: new Date(Date.now() - 1000),
      });

      const result = await service.validateResetToken(token);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Token expired');
    });
  });

  describe('resetPassword', () => {
    const token = 'valid-token';
    const newPassword = 'NewSecurePass123!';
    const ipAddress = '192.168.1.1';
    const userAgent = 'Chrome';

    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      password: 'old-hash',
    };

    beforeEach(() => {
      mockPrismaService.passwordResetToken.findUnique.mockResolvedValue({
        token,
        userId: 'user123',
        used: false,
        expiresAt: new Date(Date.now() + 1000000),
      });
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPasswordSecurityService.validatePasswordStrength.mockResolvedValue({
        isValid: true,
        errors: [],
      });
      mockPasswordSecurityService.checkPasswordHistory.mockResolvedValue(false);
      mockPasswordSecurityService.hashPassword.mockResolvedValue('new-hash');
      mockPasswordSecurityService.storePasswordHistory.mockResolvedValue(undefined);
      mockPrismaService.user.update.mockResolvedValue({});
      mockPrismaService.passwordResetToken.update.mockResolvedValue({});
      mockSessionService.revokeAllSessions.mockResolvedValue(2);
      mockAuditLogService.log.mockResolvedValue(undefined);
    });

    it('should reset password successfully', async () => {
      await service.resetPassword(token, newPassword, ipAddress, userAgent);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: {
          password: 'new-hash',
          requirePasswordChange: false,
        },
      });
      expect(mockPrismaService.passwordResetToken.update).toHaveBeenCalledWith({
        where: { token },
        data: { used: true },
      });
      expect(mockSessionService.revokeAllSessions).toHaveBeenCalledWith('user123');
      expect(mockAuditLogService.log).toHaveBeenCalled();
    });

    it('should throw error for invalid token', async () => {
      mockPrismaService.passwordResetToken.findUnique.mockResolvedValue(null);

      await expect(
        service.resetPassword(token, newPassword, ipAddress),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error for weak password', async () => {
      mockPasswordSecurityService.validatePasswordStrength.mockResolvedValue({
        isValid: false,
        errors: ['Password too short'],
      });

      await expect(
        service.resetPassword(token, newPassword, ipAddress),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error for reused password', async () => {
      mockPasswordSecurityService.checkPasswordHistory.mockResolvedValue(true);

      await expect(
        service.resetPassword(token, newPassword, ipAddress),
      ).rejects.toThrow('Password has been used recently');
    });

    it('should throw error if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.resetPassword(token, newPassword, ipAddress),
      ).rejects.toThrow(NotFoundException);
    });

    it('should store password in history', async () => {
      await service.resetPassword(token, newPassword, ipAddress);

      expect(mockPasswordSecurityService.storePasswordHistory).toHaveBeenCalledWith(
        'user123',
        'new-hash',
      );
    });

    it('should invalidate all sessions', async () => {
      await service.resetPassword(token, newPassword, ipAddress);

      expect(mockSessionService.revokeAllSessions).toHaveBeenCalledWith('user123');
    });
  });

  describe('cleanupExpiredTokens', () => {
    it('should delete expired tokens', async () => {
      mockPrismaService.passwordResetToken.deleteMany.mockResolvedValue({ count: 5 });

      const result = await service.cleanupExpiredTokens();

      expect(result).toBe(5);
      expect(mockPrismaService.passwordResetToken.deleteMany).toHaveBeenCalledWith({
        where: {
          expiresAt: { lt: expect.any(Date) },
        },
      });
    });
  });

  describe('getActiveResetToken', () => {
    it('should return active token for user', async () => {
      const mockToken = {
        token: 'active-token',
        userId: 'user123',
        used: false,
        expiresAt: new Date(Date.now() + 1000000),
        createdAt: new Date(),
      };
      mockPrismaService.passwordResetToken.findFirst.mockResolvedValue(mockToken);

      const result = await service.getActiveResetToken('user123');

      expect(result).toBeTruthy();
      expect(result?.token).toBe('active-token');
    });

    it('should return null if no active token', async () => {
      mockPrismaService.passwordResetToken.findFirst.mockResolvedValue(null);

      const result = await service.getActiveResetToken('user123');

      expect(result).toBeNull();
    });
  });
});
