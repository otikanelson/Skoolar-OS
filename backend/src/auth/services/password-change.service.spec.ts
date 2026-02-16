import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PasswordChangeService } from './password-change.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordSecurityService } from './password-security.service';
import { SessionService } from './session.service';
import { AuditLogService } from './audit-log.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('PasswordChangeService', () => {
  let service: PasswordChangeService;
  let prismaService: PrismaService;
  let passwordSecurityService: PasswordSecurityService;
  let sessionService: SessionService;
  let auditLogService: AuditLogService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockPasswordSecurityService = {
    validatePasswordStrength: jest.fn(),
    checkPasswordHistory: jest.fn(),
    hashPassword: jest.fn(),
    storePasswordHistory: jest.fn(),
  };

  const mockSessionService = {
    revokeOtherSessions: jest.fn(),
  };

  const mockAuditLogService = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordChangeService,
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

    service = module.get<PasswordChangeService>(PasswordChangeService);
    prismaService = module.get<PrismaService>(PrismaService);
    passwordSecurityService = module.get<PasswordSecurityService>(PasswordSecurityService);
    sessionService = module.get<SessionService>(SessionService);
    auditLogService = module.get<AuditLogService>(AuditLogService);

    jest.clearAllMocks();
    Object.values(mockPrismaService.user).forEach((mock) => mock.mockReset());
    Object.values(mockPasswordSecurityService).forEach((mock) => mock.mockReset());
    mockSessionService.revokeOtherSessions.mockReset();
    mockAuditLogService.log.mockReset();
  });

  describe('changePassword', () => {
    const userId = 'user123';
    const currentPassword = 'OldPassword123!';
    const newPassword = 'NewPassword456!';
    const currentSessionId = 'session123';
    const ipAddress = '192.168.1.1';
    const userAgent = 'Chrome';

    const mockUser = {
      id: userId,
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashed-old-password',
    };

    beforeEach(() => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPasswordSecurityService.validatePasswordStrength.mockResolvedValue({
        isValid: true,
        errors: [],
      });
      mockPasswordSecurityService.checkPasswordHistory.mockResolvedValue(false);
      mockPasswordSecurityService.hashPassword.mockResolvedValue('hashed-new-password');
      mockPasswordSecurityService.storePasswordHistory.mockResolvedValue(undefined);
      mockPrismaService.user.update.mockResolvedValue({});
      mockSessionService.revokeOtherSessions.mockResolvedValue(2);
      mockAuditLogService.log.mockResolvedValue(undefined);
    });

    it('should change password successfully', async () => {
      await service.changePassword(
        userId,
        currentPassword,
        newPassword,
        currentSessionId,
        ipAddress,
        userAgent,
      );

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          password: 'hashed-new-password',
          requirePasswordChange: false,
        },
      });
      expect(mockSessionService.revokeOtherSessions).toHaveBeenCalledWith(
        userId,
        currentSessionId,
      );
      expect(mockAuditLogService.log).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.changePassword(
          userId,
          currentPassword,
          newPassword,
          currentSessionId,
          ipAddress,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw error if current password is incorrect', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        service.changePassword(
          userId,
          currentPassword,
          newPassword,
          currentSessionId,
          ipAddress,
        ),
      ).rejects.toThrow('Current password is incorrect');
    });

    it('should throw error if new password is weak', async () => {
      mockPasswordSecurityService.validatePasswordStrength.mockResolvedValue({
        isValid: false,
        errors: ['Password too short', 'Missing special character'],
      });

      await expect(
        service.changePassword(
          userId,
          currentPassword,
          newPassword,
          currentSessionId,
          ipAddress,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error if new password is same as current', async () => {
      (bcrypt.compare as jest.Mock)
        .mockResolvedValueOnce(true) // Current password check
        .mockResolvedValueOnce(true); // Same password check

      await expect(
        service.changePassword(
          userId,
          currentPassword,
          currentPassword,
          currentSessionId,
          ipAddress,
        ),
      ).rejects.toThrow('New password must be different from current password');
    });

    it('should throw error if password was used recently', async () => {
      mockPasswordSecurityService.checkPasswordHistory.mockResolvedValue(true);

      await expect(
        service.changePassword(
          userId,
          currentPassword,
          newPassword,
          currentSessionId,
          ipAddress,
        ),
      ).rejects.toThrow('Password has been used recently');
    });

    it('should store password in history', async () => {
      await service.changePassword(
        userId,
        currentPassword,
        newPassword,
        currentSessionId,
        ipAddress,
      );

      expect(mockPasswordSecurityService.storePasswordHistory).toHaveBeenCalledWith(
        userId,
        'hashed-new-password',
      );
    });

    it('should invalidate other sessions but keep current', async () => {
      await service.changePassword(
        userId,
        currentPassword,
        newPassword,
        currentSessionId,
        ipAddress,
      );

      expect(mockSessionService.revokeOtherSessions).toHaveBeenCalledWith(
        userId,
        currentSessionId,
      );
    });

    it('should clear requirePasswordChange flag', async () => {
      await service.changePassword(
        userId,
        currentPassword,
        newPassword,
        currentSessionId,
        ipAddress,
      );

      const updateCall = mockPrismaService.user.update.mock.calls[0][0];
      expect(updateCall.data.requirePasswordChange).toBe(false);
    });
  });

  describe('checkRequirePasswordChange', () => {
    it('should return true if password change required', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        requirePasswordChange: true,
      });

      const result = await service.checkRequirePasswordChange('user123');

      expect(result).toBe(true);
    });

    it('should return false if password change not required', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        requirePasswordChange: false,
      });

      const result = await service.checkRequirePasswordChange('user123');

      expect(result).toBe(false);
    });

    it('should return false if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.checkRequirePasswordChange('user123');

      expect(result).toBe(false);
    });
  });

  describe('setRequirePasswordChange', () => {
    it('should set requirePasswordChange to true', async () => {
      mockPrismaService.user.update.mockResolvedValue({});

      await service.setRequirePasswordChange('user123', true);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: { requirePasswordChange: true },
      });
    });

    it('should set requirePasswordChange to false', async () => {
      mockPrismaService.user.update.mockResolvedValue({});

      await service.setRequirePasswordChange('user123', false);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: { requirePasswordChange: false },
      });
    });
  });
});
