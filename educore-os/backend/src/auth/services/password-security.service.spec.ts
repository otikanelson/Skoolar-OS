import { Test, TestingModule } from '@nestjs/testing';
import { PasswordSecurityService } from './password-security.service';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('PasswordSecurityService', () => {
  let service: PasswordSecurityService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    passwordHistory: {
      findMany: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordSecurityService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PasswordSecurityService>(PasswordSecurityService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash a password using bcrypt', async () => {
      const password = 'TestPassword123!';
      const hash = await service.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await service.hashPassword(password);
      const hash2 = await service.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const password = 'TestPassword123!';
      const hash = await bcrypt.hash(password, 12);

      const result = await service.verifyPassword(password, hash);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hash = await bcrypt.hash(password, 12);

      const result = await service.verifyPassword(wrongPassword, hash);
      expect(result).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    const userInfo = { name: 'John Doe', email: 'john.doe@example.com' };

    it('should validate a strong password', () => {
      const password = 'StrongP@ssw0rd!';
      const result = service.validatePasswordStrength(password, userInfo);

      expect(result.score).toBeGreaterThanOrEqual(3);
      expect(result.isValid).toBe(true);
      expect(result.feedback).toHaveLength(0);
    });

    it('should reject password shorter than 8 characters', () => {
      const password = 'Short1!';
      const result = service.validatePasswordStrength(password, userInfo);

      expect(result.isValid).toBe(false);
      expect(result.feedback).toContain('Password must be at least 8 characters');
    });

    it('should reject password without lowercase letters', () => {
      const password = 'PASSWORD123!';
      const result = service.validatePasswordStrength(password, userInfo);

      expect(result.isValid).toBe(false);
      expect(result.feedback).toContain('Include lowercase letters');
    });

    it('should reject password without uppercase letters', () => {
      const password = 'password123!';
      const result = service.validatePasswordStrength(password, userInfo);

      expect(result.isValid).toBe(false);
      expect(result.feedback).toContain('Include uppercase letters');
    });

    it('should reject password without numbers', () => {
      const password = 'Password!';
      const result = service.validatePasswordStrength(password, userInfo);

      expect(result.isValid).toBe(false);
      expect(result.feedback).toContain('Include numbers');
    });

    it('should reject password without special characters', () => {
      const password = 'Password123';
      const result = service.validatePasswordStrength(password, userInfo);

      expect(result.isValid).toBe(false);
      expect(result.feedback).toContain('Include special characters');
    });

    it('should reject password containing user name', () => {
      const password = 'JohnDoe123!';  // Contains name (without space)
      const result = service.validatePasswordStrength(password, userInfo);

      // Should have feedback about containing name
      expect(result.feedback).toContain('Password should not contain your name');
      // Score should be reduced or invalid
      expect(result.isValid).toBe(false);
    });

    it('should reject password containing email username', () => {
      const password = 'john.doe123!';
      const result = service.validatePasswordStrength(password, userInfo);

      expect(result.isValid).toBe(false);
      expect(result.feedback).toContain('Password should not contain your email');
    });

    it('should reject common passwords', () => {
      const password = 'password123';
      const result = service.validatePasswordStrength(password, userInfo);

      expect(result.isValid).toBe(false);
      expect(result.feedback).toContain('This password is too common');
      expect(result.score).toBe(0);
    });

    it('should give higher score for longer passwords', () => {
      const shortPassword = 'Pass123!';
      const longPassword = 'LongPassword123!';

      const shortResult = service.validatePasswordStrength(shortPassword, userInfo);
      const longResult = service.validatePasswordStrength(longPassword, userInfo);

      expect(longResult.score).toBeGreaterThan(shortResult.score);
    });
  });

  describe('checkPasswordHistory', () => {
    it('should return true if password is not in history', async () => {
      const userId = 'user123';
      const newPassword = 'NewPassword123!';

      mockPrismaService.passwordHistory.findMany.mockResolvedValue([]);

      const result = await service.checkPasswordHistory(userId, newPassword);
      expect(result).toBe(true);
    });

    it('should return false if password was used before', async () => {
      const userId = 'user123';
      const password = 'UsedPassword123!';
      const hash = await bcrypt.hash(password, 12);

      mockPrismaService.passwordHistory.findMany.mockResolvedValue([
        { id: '1', userId, passwordHash: hash, createdAt: new Date() },
      ]);

      const result = await service.checkPasswordHistory(userId, password);
      expect(result).toBe(false);
    });

    it('should check only last 5 passwords', async () => {
      const userId = 'user123';
      const newPassword = 'NewPassword123!';

      mockPrismaService.passwordHistory.findMany.mockResolvedValue([]);

      await service.checkPasswordHistory(userId, newPassword);

      expect(mockPrismaService.passwordHistory.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
    });
  });

  describe('addToPasswordHistory', () => {
    it('should add password to history', async () => {
      const userId = 'user123';
      const passwordHash = 'hashedPassword';

      mockPrismaService.passwordHistory.create.mockResolvedValue({});
      mockPrismaService.passwordHistory.findMany.mockResolvedValue([]);

      await service.addToPasswordHistory(userId, passwordHash);

      expect(mockPrismaService.passwordHistory.create).toHaveBeenCalledWith({
        data: { userId, passwordHash },
      });
    });

    it('should delete old passwords beyond 5', async () => {
      const userId = 'user123';
      const passwordHash = 'hashedPassword';

      const oldPasswords = [
        { id: '6', userId, passwordHash: 'old1', createdAt: new Date() },
        { id: '7', userId, passwordHash: 'old2', createdAt: new Date() },
      ];

      mockPrismaService.passwordHistory.create.mockResolvedValue({});
      mockPrismaService.passwordHistory.findMany.mockResolvedValue(oldPasswords);

      await service.addToPasswordHistory(userId, passwordHash);

      expect(mockPrismaService.passwordHistory.deleteMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['6', '7'] },
        },
      });
    });

    it('should not delete if less than 5 passwords', async () => {
      const userId = 'user123';
      const passwordHash = 'hashedPassword';

      mockPrismaService.passwordHistory.create.mockResolvedValue({});
      mockPrismaService.passwordHistory.findMany.mockResolvedValue([]);

      await service.addToPasswordHistory(userId, passwordHash);

      expect(mockPrismaService.passwordHistory.deleteMany).not.toHaveBeenCalled();
    });
  });
});
