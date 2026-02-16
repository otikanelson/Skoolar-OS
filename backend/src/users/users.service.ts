import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export interface User {
  id: string;
  email: string;
  password: string;
  role: string;
  name: string;
  schoolId?: string | null;
  requirePasswordChange?: boolean;
  lastLoginAt?: Date | null;
  lastLoginIp?: string | null;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error('Prisma findByEmail error:', error);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);
      console.error('Error meta:', error?.meta);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(userData: { email: string; password: string; name: string; role: any }): Promise<User> {
    return this.prisma.user.create({
      data: userData,
    });
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

