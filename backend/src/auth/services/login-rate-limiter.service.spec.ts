import { Test, TestingModule } from '@nestjs/testing';
import { LoginRateLimiterService } from './login-rate-limiter.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('LoginRateLimiterService', () => {
  let service: LoginRateLimiterService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    loginAttempt: {
      count: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginRateLimiterService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LoginRateLimiterService>(LoginRateLimiterService);
    prismaService = module.get<PrismaService>(PrismaService);
    
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Also reset mock implementations
    mockPrismaService.loginAttempt.count.mockReset();
    mockPrismaService.loginAttempt.create.mockReset();
    mockPrismaService.loginAttempt.deleteMany.mockReset();
  });

  afterEach(() => {
    // Mocks are already cleared in beforeEach
  });

  describe('checkRateLimit', () => {
    const email = 'test@example.com';
    const ipAddress = '192.168.1.1';

    it('should allow login when no previous attempts', async () => {
      mockPrismaService.loginAttempt.count
        .mockResolvedValueOnce(0) // email attempts
        .mockResolvedValueOnce(0); // IP attempts

      const result = await service.checkRateLimit(email, ipAddress);

      expect(result.allowed).toBe(true);
      expect(result.retryAfter).toBeUndefined();
      expect(mockPrismaService.loginAttempt.count).toHaveBeenCalledTimes(2);
    });

    it('should allow login with less than 5 email attempts', async () => {
      mockPrismaService.loginAttempt.count
        .mockResolvedValueOnce(3) // email attempts
        .mockResolvedValueOnce(2); // IP attempts

      const result = await service.checkRateLimit(email, ipAddress);

      expect(result.allowed).toBe(true);
    });

    it('should block login after 5 failed email attempts', async () => {
      mockPrismaService.loginAttempt.count
        .mockResolvedValueOnce(5) // email attempts
        .mockResolvedValueOnce(2); // IP attempts

      const result = await service.checkRateLimit(email, ipAddress);

      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBe(900); // 15 minutes
    });

    it('should block login after 10 failed IP attempts', async () => {
      // Email is under limit (4 attempts)
      // IP is at limit (10 attempts)
      mockPrismaService.loginAttempt.count
        .mockResolvedValueOnce(4)  // email attempts (under limit)
        .mockResolvedValueOnce(10); // IP attempts (at limit)

      const result = await service.checkRateLimit(email, ipAddress);

      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBe(900);
      expect(mockPrismaService.loginAttempt.count).toHaveBeenCalledTimes(2);
    });


    it('should check attempts within 15 minute window', async () => {
      // Set up mock to return 0 for both calls
      mockPrismaService.loginAttempt.count
        .mockResolvedValueOnce(0) // email attempts
        .mockResolvedValueOnce(0); // IP attempts

      await service.checkRateLimit(email, ipAddress);
      
      // Verify both email and IP checks were made
      expect(mockPrismaService.loginAttempt.count).toHaveBeenCalledTimes(2);
      
      // Verify email check with correct parameters
      const emailCall = mockPrismaService.loginAttempt.count.mock.calls[0][0];
      expect(emailCall.where.email).toBe(email);
      expect(emailCall.where.success).toBe(false);
      expect(emailCall.where.createdAt.gte).toBeInstanceOf(Date);

      // Verify IP check with correct parameters
      const ipCall = mockPrismaService.loginAttempt.count.mock.calls[1][0];
      expect(ipCall.where.ipAddress).toBe(ipAddress);
      expect(ipCall.where.success).toBe(false);
      expect(ipCall.where.createdAt.gte).toBeInstanceOf(Date);
    });

    it('should prioritize email limit over IP limit', async () => {
      // Email is at limit (5 attempts), should return early
      mockPrismaService.loginAttempt.count.mockImplementation(() => {
        return Promise.resolve(5); // email attempts (at limit)
      });

      const result = await service.checkRateLimit(email, ipAddress);

      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBe(900);
      // Should only check email, not IP (early return)
      expect(mockPrismaService.loginAttempt.count).toHaveBeenCalledTimes(1);
    });

    it('should handle different emails from same IP', async () => {
      const email1 = 'user1@example.com';
      const email2 = 'user2@example.com';

      // Email 1 has 5 attempts (blocked)
      mockPrismaService.loginAttempt.count.mockImplementation(() => {
        return Promise.resolve(5);
      });
      const result1 = await service.checkRateLimit(email1, ipAddress);
      expect(result1.allowed).toBe(false);
      expect(result1.retryAfter).toBe(900);
      expect(mockPrismaService.loginAttempt.count).toHaveBeenCalledTimes(1);

      // Clear mocks for second test
      jest.clearAllMocks();

      // Email 2 has 0 attempts, IP has 5 attempts (both under limits)
      let callCount = 0;
      mockPrismaService.loginAttempt.count.mockImplementation(() => {
        callCount++;
        if (callCount === 1) return Promise.resolve(0); // email attempts
        if (callCount === 2) return Promise.resolve(5); // IP attempts
        return Promise.resolve(0);
      });
      const result2 = await service.checkRateLimit(email2, ipAddress);
      expect(result2.allowed).toBe(true);
      expect(mockPrismaService.loginAttempt.count).toHaveBeenCalledTimes(2);
    });
  });

  describe('recordAttempt', () => {
    it('should record successful login attempt', async () => {
      const attemptData = {
        email: 'test@example.com',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        success: true,
        userId: 'user123'
      };

      mockPrismaService.loginAttempt.create.mockResolvedValue({});

      await service.recordAttempt(attemptData);

      expect(mockPrismaService.loginAttempt.create).toHaveBeenCalledWith({
        data: attemptData
      });
    });

    it('should record failed login attempt with reason', async () => {
      const attemptData = {
        email: 'test@example.com',
        ipAddress: '192.168.1.1',
        success: false,
        failureReason: 'Invalid password'
      };

      mockPrismaService.loginAttempt.create.mockResolvedValue({});

      await service.recordAttempt(attemptData);

      expect(mockPrismaService.loginAttempt.create).toHaveBeenCalledWith({
        data: attemptData
      });
    });

    it('should record attempt without optional fields', async () => {
      const attemptData = {
        email: 'test@example.com',
        ipAddress: '192.168.1.1',
        success: false
      };

      mockPrismaService.loginAttempt.create.mockResolvedValue({});

      await service.recordAttempt(attemptData);

      expect(mockPrismaService.loginAttempt.create).toHaveBeenCalledWith({
        data: attemptData
      });
    });
  });

  describe('cleanupOldAttempts', () => {
    it('should delete attempts older than 30 days', async () => {
      mockPrismaService.loginAttempt.deleteMany.mockResolvedValue({ count: 150 });

      const result = await service.cleanupOldAttempts();

      expect(result).toBe(150);
      expect(mockPrismaService.loginAttempt.deleteMany).toHaveBeenCalledWith({
        where: {
          createdAt: { lt: expect.any(Date) }
        }
      });
    });

    it('should return 0 when no old attempts to delete', async () => {
      mockPrismaService.loginAttempt.deleteMany.mockResolvedValue({ count: 0 });

      const result = await service.cleanupOldAttempts();

      expect(result).toBe(0);
    });

    it('should calculate 30 days correctly', async () => {
      mockPrismaService.loginAttempt.deleteMany.mockResolvedValue({ count: 10 });

      await service.cleanupOldAttempts();

      const call = mockPrismaService.loginAttempt.deleteMany.mock.calls[0][0];
      const thirtyDaysAgo = call.where.createdAt.lt;
      const expectedDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      // Allow 1 second difference for test execution time
      expect(Math.abs(thirtyDaysAgo.getTime() - expectedDate.getTime())).toBeLessThan(1000);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle rapid successive attempts', async () => {
      const email = 'attacker@example.com';
      const ipAddress = '10.0.0.1';

      // Simulate 5 rapid attempts
      for (let i = 0; i < 5; i++) {
        mockPrismaService.loginAttempt.count.mockResolvedValueOnce(i);
        const result = await service.checkRateLimit(email, ipAddress);
        expect(result.allowed).toBe(true);
      }

      // 6th attempt should be blocked
      mockPrismaService.loginAttempt.count.mockResolvedValueOnce(5);
      const result = await service.checkRateLimit(email, ipAddress);
      expect(result.allowed).toBe(false);
    });

    it('should allow attempts after rate limit window expires', async () => {
      const email = 'test@example.com';
      const ipAddress = '192.168.1.1';

      // First check: 5 attempts (blocked)
      mockPrismaService.loginAttempt.count.mockResolvedValueOnce(5);
      const blockedResult = await service.checkRateLimit(email, ipAddress);
      expect(blockedResult.allowed).toBe(false);

      // After 15 minutes: old attempts don't count
      mockPrismaService.loginAttempt.count
        .mockResolvedValueOnce(0) // email attempts
        .mockResolvedValueOnce(0); // IP attempts
      const allowedResult = await service.checkRateLimit(email, ipAddress);
      expect(allowedResult.allowed).toBe(true);
    });

    it('should track both successful and failed attempts separately', async () => {
      const email = 'test@example.com';
      const ipAddress = '192.168.1.1';

      // Record 3 failed attempts
      for (let i = 0; i < 3; i++) {
        await service.recordAttempt({
          email,
          ipAddress,
          success: false,
          failureReason: 'Invalid password'
        });
      }

      // Record 1 successful attempt
      await service.recordAttempt({
        email,
        ipAddress,
        success: true,
        userId: 'user123'
      });

      // Rate limit should only count failed attempts
      mockPrismaService.loginAttempt.count.mockResolvedValueOnce(3);
      const result = await service.checkRateLimit(email, ipAddress);
      expect(result.allowed).toBe(true);
    });
  });
});
