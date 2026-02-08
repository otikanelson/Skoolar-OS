import { Test, TestingModule } from '@nestjs/testing';
import { AccountLockoutService } from './account-lockout.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('AccountLockoutService', () => {
  let service: AccountLockoutService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountLockoutService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AccountLockoutService>(AccountLockoutService);
    prismaService = module.get<PrismaService>(PrismaService);
    
    // Reset all mocks before each test
    jest.clearAllMocks();
    mockPrismaService.user.findUnique.mockReset();
    mockPrismaService.user.update.mockReset();
  });

  describe('checkLockout', () => {
    const userId = 'user123';

    it('should return not locked when user has no failed attempts', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        lockedUntil: null,
        failedLoginAttempts: 0
      });

      const result = await service.checkLockout(userId);

      expect(result.locked).toBe(false);
      expect(result.attemptsRemaining).toBe(5);
      expect(result.until).toBeUndefined();
    });

    it('should return not locked with correct attempts remaining', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        lockedUntil: null,
        failedLoginAttempts: 3
      });

      const result = await service.checkLockout(userId);

      expect(result.locked).toBe(false);
      expect(result.attemptsRemaining).toBe(2);
    });

    it('should return locked when account is currently locked', async () => {
      const futureDate = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      mockPrismaService.user.findUnique.mockResolvedValue({
        lockedUntil: futureDate,
        failedLoginAttempts: 5
      });

      const result = await service.checkLockout(userId);

      expect(result.locked).toBe(true);
      expect(result.until).toEqual(futureDate);
      expect(result.attemptsRemaining).toBeUndefined();
    });

    it('should clear expired lockout and return not locked', async () => {
      const pastDate = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago
      mockPrismaService.user.findUnique.mockResolvedValue({
        lockedUntil: pastDate,
        failedLoginAttempts: 5
      });
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.checkLockout(userId);

      expect(result.locked).toBe(false);
      expect(result.attemptsRemaining).toBe(5);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { lockedUntil: null, failedLoginAttempts: 0 }
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.checkLockout(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('recordFailedAttempt', () => {
    const userId = 'user123';

    it('should increment failed attempts counter', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        failedLoginAttempts: 2
      });
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.recordFailedAttempt(userId);

      expect(result.locked).toBe(false);
      expect(result.attemptsRemaining).toBe(2); // 5 - 3 = 2
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { failedLoginAttempts: 3 }
      });
    });

    it('should lock account after 5th failed attempt', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        failedLoginAttempts: 4
      });
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.recordFailedAttempt(userId);

      expect(result.locked).toBe(true);
      expect(result.until).toBeInstanceOf(Date);
      expect(result.attemptsRemaining).toBeUndefined();
      
      const updateCall = mockPrismaService.user.update.mock.calls[0][0];
      expect(updateCall.data.failedLoginAttempts).toBe(5);
      expect(updateCall.data.lockedUntil).toBeInstanceOf(Date);
    });

    it('should lock account for 30 minutes', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        failedLoginAttempts: 4
      });
      mockPrismaService.user.update.mockResolvedValue({});

      const beforeTime = Date.now();
      const result = await service.recordFailedAttempt(userId);
      const afterTime = Date.now();

      const expectedLockoutTime = 30 * 60 * 1000; // 30 minutes in ms
      const actualLockoutTime = result.until!.getTime() - beforeTime;
      
      // Allow 1 second tolerance for test execution time
      expect(actualLockoutTime).toBeGreaterThanOrEqual(expectedLockoutTime - 1000);
      expect(actualLockoutTime).toBeLessThanOrEqual(expectedLockoutTime + 1000);
    });

    it('should not lock account before 5th attempt', async () => {
      for (let i = 0; i < 4; i++) {
        mockPrismaService.user.findUnique.mockResolvedValue({
          failedLoginAttempts: i
        });
        mockPrismaService.user.update.mockResolvedValue({});

        const result = await service.recordFailedAttempt(userId);
        expect(result.locked).toBe(false);
        
        jest.clearAllMocks();
        mockPrismaService.user.findUnique.mockReset();
        mockPrismaService.user.update.mockReset();
      }
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.recordFailedAttempt(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('resetFailedAttempts', () => {
    const userId = 'user123';

    it('should reset failed attempts counter to 0', async () => {
      mockPrismaService.user.update.mockResolvedValue({});

      await service.resetFailedAttempts(userId);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { failedLoginAttempts: 0, lockedUntil: null }
      });
    });

    it('should clear lockout date', async () => {
      mockPrismaService.user.update.mockResolvedValue({});

      await service.resetFailedAttempts(userId);

      const updateCall = mockPrismaService.user.update.mock.calls[0][0];
      expect(updateCall.data.lockedUntil).toBeNull();
    });
  });

  describe('unlockAccount', () => {
    const userId = 'user123';

    it('should unlock account and reset failed attempts', async () => {
      mockPrismaService.user.update.mockResolvedValue({});

      await service.unlockAccount(userId);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { failedLoginAttempts: 0, lockedUntil: null }
      });
    });
  });

  describe('Integration scenarios', () => {
    const userId = 'user123';

    it('should handle complete lockout and unlock cycle', async () => {
      // Start with 0 attempts
      mockPrismaService.user.findUnique.mockResolvedValue({
        lockedUntil: null,
        failedLoginAttempts: 0
      });
      let status = await service.checkLockout(userId);
      expect(status.locked).toBe(false);
      expect(status.attemptsRemaining).toBe(5);

      // Record 5 failed attempts
      for (let i = 0; i < 5; i++) {
        mockPrismaService.user.findUnique.mockResolvedValue({
          failedLoginAttempts: i
        });
        mockPrismaService.user.update.mockResolvedValue({});
        await service.recordFailedAttempt(userId);
      }

      // Check that account is locked
      const futureDate = new Date(Date.now() + 30 * 60 * 1000);
      mockPrismaService.user.findUnique.mockResolvedValue({
        lockedUntil: futureDate,
        failedLoginAttempts: 5
      });
      status = await service.checkLockout(userId);
      expect(status.locked).toBe(true);

      // Unlock account
      mockPrismaService.user.update.mockResolvedValue({});
      await service.unlockAccount(userId);

      // Verify account is unlocked
      mockPrismaService.user.findUnique.mockResolvedValue({
        lockedUntil: null,
        failedLoginAttempts: 0
      });
      status = await service.checkLockout(userId);
      expect(status.locked).toBe(false);
    });

    it('should handle successful login after failed attempts', async () => {
      // Record 3 failed attempts
      for (let i = 0; i < 3; i++) {
        mockPrismaService.user.findUnique.mockResolvedValue({
          failedLoginAttempts: i
        });
        mockPrismaService.user.update.mockResolvedValue({});
        await service.recordFailedAttempt(userId);
      }

      // Successful login - reset attempts
      mockPrismaService.user.update.mockResolvedValue({});
      await service.resetFailedAttempts(userId);

      // Verify attempts are reset
      mockPrismaService.user.findUnique.mockResolvedValue({
        lockedUntil: null,
        failedLoginAttempts: 0
      });
      const status = await service.checkLockout(userId);
      expect(status.locked).toBe(false);
      expect(status.attemptsRemaining).toBe(5);
    });

    it('should handle lockout expiration', async () => {
      // Account is locked
      const pastDate = new Date(Date.now() - 1000); // 1 second ago
      mockPrismaService.user.findUnique.mockResolvedValue({
        lockedUntil: pastDate,
        failedLoginAttempts: 5
      });
      mockPrismaService.user.update.mockResolvedValue({});

      // Check lockout - should auto-clear
      const status = await service.checkLockout(userId);
      expect(status.locked).toBe(false);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { lockedUntil: null, failedLoginAttempts: 0 }
      });
    });
  });
});
