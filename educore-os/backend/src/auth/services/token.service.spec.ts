import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };

  const mockPrismaService = {
    session: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
    mockJwtService.sign.mockReset();
    mockJwtService.verify.mockReset();
    mockJwtService.decode.mockReset();
    mockPrismaService.session.findFirst.mockReset();
    mockPrismaService.session.update.mockReset();
  });

  describe('generateTokenPair', () => {
    const userId = 'user123';
    const email = 'test@example.com';
    const role = 'STUDENT';
    const schoolId = 'school123';

    it('should generate access and refresh tokens', async () => {
      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.generateTokenPair(userId, email, role, schoolId);

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.expiresIn).toBe(7 * 24 * 60 * 60); // 7 days
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    });

    it('should generate tokens with correct payload for access token', async () => {
      mockJwtService.sign.mockReturnValue('token');

      await service.generateTokenPair(userId, email, role, schoolId);

      const accessTokenCall = mockJwtService.sign.mock.calls[0];
      expect(accessTokenCall[0]).toEqual({
        sub: userId,
        email,
        role,
        schoolId,
        type: 'access',
      });
      expect(accessTokenCall[1]).toEqual({ expiresIn: '15m' });
    });

    it('should generate tokens with correct payload for refresh token', async () => {
      mockJwtService.sign.mockReturnValue('token');

      await service.generateTokenPair(userId, email, role, schoolId);

      const refreshTokenCall = mockJwtService.sign.mock.calls[1];
      expect(refreshTokenCall[0]).toEqual({
        sub: userId,
        email,
        role,
        schoolId,
        type: 'refresh',
      });
      expect(refreshTokenCall[1]).toEqual({ expiresIn: '7d' });
    });

    it('should generate 30-day tokens when rememberMe is true', async () => {
      mockJwtService.sign.mockReturnValue('token');

      const result = await service.generateTokenPair(userId, email, role, schoolId, true);

      expect(result.expiresIn).toBe(30 * 24 * 60 * 60); // 30 days
      const refreshTokenCall = mockJwtService.sign.mock.calls[1];
      expect(refreshTokenCall[1]).toEqual({ expiresIn: '30d' });
    });

    it('should generate tokens without schoolId', async () => {
      mockJwtService.sign.mockReturnValue('token');

      await service.generateTokenPair(userId, email, role);

      const accessTokenCall = mockJwtService.sign.mock.calls[0];
      expect(accessTokenCall[0].schoolId).toBeUndefined();
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode valid token', async () => {
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'STUDENT',
        type: 'access' as const,
      };
      mockJwtService.verify.mockReturnValue(payload);

      const result = await service.verifyToken('valid-token');

      expect(result).toEqual(payload);
      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token');
    });

    it('should throw error for invalid token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.verifyToken('invalid-token')).rejects.toThrow(
        'Invalid or expired token',
      );
    });

    it('should throw error for expired token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      await expect(service.verifyToken('expired-token')).rejects.toThrow(
        'Invalid or expired token',
      );
    });
  });

  describe('refreshAccessToken', () => {
    const refreshToken = 'valid-refresh-token';
    const payload = {
      sub: 'user123',
      email: 'test@example.com',
      role: 'STUDENT',
      schoolId: 'school123',
      type: 'refresh' as const,
    };

    it('should generate new access token from valid refresh token', async () => {
      mockJwtService.verify.mockReturnValue(payload);
      mockPrismaService.session.findFirst.mockResolvedValue({
        id: 'session123',
        userId: 'user123',
        refreshToken,
        expiresAt: new Date(Date.now() + 1000000),
      });
      mockJwtService.sign.mockReturnValue('new-access-token');
      mockPrismaService.session.update.mockResolvedValue({});

      const result = await service.refreshAccessToken(refreshToken);

      expect(result.accessToken).toBe('new-access-token');
      expect(mockPrismaService.session.update).toHaveBeenCalled();
    });

    it('should throw error if token type is not refresh', async () => {
      mockJwtService.verify.mockReturnValue({ ...payload, type: 'access' });

      await expect(service.refreshAccessToken(refreshToken)).rejects.toThrow(
        'Invalid token type',
      );
    });

    it('should throw error if session not found', async () => {
      mockJwtService.verify.mockReturnValue(payload);
      mockPrismaService.session.findFirst.mockResolvedValue(null);

      await expect(service.refreshAccessToken(refreshToken)).rejects.toThrow(
        'Session not found or expired',
      );
    });

    it('should throw error if session is expired', async () => {
      mockJwtService.verify.mockReturnValue(payload);
      // When session is expired, findFirst returns null because of the expiresAt filter
      mockPrismaService.session.findFirst.mockResolvedValue(null);

      await expect(service.refreshAccessToken(refreshToken)).rejects.toThrow(
        'Session not found or expired',
      );
    });

    it('should update session last activity', async () => {
      mockJwtService.verify.mockReturnValue(payload);
      mockPrismaService.session.findFirst.mockResolvedValue({
        id: 'session123',
        userId: 'user123',
        refreshToken,
        expiresAt: new Date(Date.now() + 1000000),
      });
      mockJwtService.sign.mockReturnValue('new-access-token');
      mockPrismaService.session.update.mockResolvedValue({});

      await service.refreshAccessToken(refreshToken);

      expect(mockPrismaService.session.update).toHaveBeenCalledWith({
        where: { id: 'session123' },
        data: { lastActivityAt: expect.any(Date) },
      });
    });
  });

  describe('decodeToken', () => {
    it('should decode token without verification', () => {
      const payload = {
        sub: 'user123',
        email: 'test@example.com',
        role: 'STUDENT',
        type: 'access' as const,
      };
      mockJwtService.decode.mockReturnValue(payload);

      const result = service.decodeToken('some-token');

      expect(result).toEqual(payload);
      expect(mockJwtService.decode).toHaveBeenCalledWith('some-token');
    });

    it('should return null for invalid token', () => {
      mockJwtService.decode.mockImplementation(() => {
        throw new Error('Invalid');
      });

      const result = service.decodeToken('invalid-token');

      expect(result).toBeNull();
    });
  });

  describe('getAccessTokenExpiry', () => {
    it('should return 15 minutes in seconds', () => {
      const expiry = service.getAccessTokenExpiry();
      expect(expiry).toBe(15 * 60);
    });
  });

  describe('getRefreshTokenExpiry', () => {
    it('should return 7 days in seconds by default', () => {
      const expiry = service.getRefreshTokenExpiry();
      expect(expiry).toBe(7 * 24 * 60 * 60);
    });

    it('should return 30 days in seconds when rememberMe is true', () => {
      const expiry = service.getRefreshTokenExpiry(true);
      expect(expiry).toBe(30 * 24 * 60 * 60);
    });
  });
});
