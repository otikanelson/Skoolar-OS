import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

export interface TokenPayload {
  sub: string; // user ID
  email: string;
  role: string;
  schoolId?: string;
  type: 'access' | 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class TokenService {
  private readonly ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
  private readonly REFRESH_TOKEN_EXPIRY = '7d'; // 7 days
  private readonly REMEMBER_ME_EXPIRY = '30d'; // 30 days

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /**
   * Generate access and refresh token pair
   */
  async generateTokenPair(
    userId: string,
    email: string,
    role: string,
    schoolId?: string,
    rememberMe: boolean = false,
  ): Promise<TokenPair> {
    const refreshTokenExpiry = rememberMe ? this.REMEMBER_ME_EXPIRY : this.REFRESH_TOKEN_EXPIRY;

    // Generate access token
    const accessTokenPayload: TokenPayload = {
      sub: userId,
      email,
      role,
      schoolId,
      type: 'access',
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });

    // Generate refresh token
    const refreshTokenPayload: TokenPayload = {
      sub: userId,
      email,
      role,
      schoolId,
      type: 'refresh',
    };

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: refreshTokenExpiry,
    });

    // Calculate expiry time in seconds
    const expiresIn = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  /**
   * Verify and decode a token
   */
  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      return this.jwtService.verify<TokenPayload>(token);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    // Verify refresh token
    const payload = await this.verifyToken(refreshToken);

    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    // Check if session exists and is valid
    const session = await this.prisma.session.findFirst({
      where: {
        userId: payload.sub,
        refreshToken,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      throw new Error('Session not found or expired');
    }

    // Generate new access token
    const accessTokenPayload: TokenPayload = {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      schoolId: payload.schoolId,
      type: 'access',
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });

    // Update session last activity
    await this.prisma.session.update({
      where: { id: session.id },
      data: { lastActivityAt: new Date() },
    });

    return { accessToken };
  }

  /**
   * Decode token without verification (for expired tokens)
   */
  decodeToken(token: string): TokenPayload | null {
    try {
      return this.jwtService.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }

  /**
   * Get token expiry time in seconds
   */
  getAccessTokenExpiry(): number {
    return 15 * 60; // 15 minutes in seconds
  }

  getRefreshTokenExpiry(rememberMe: boolean = false): number {
    return rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // seconds
  }
}
