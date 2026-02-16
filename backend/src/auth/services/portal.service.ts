import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface PortalInfo {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  status: string;
  logo?: string;
}

@Injectable()
export class PortalService {
  constructor(private prisma: PrismaService) {}

  /**
   * Check if portal exists and is active by subdomain or custom domain
   */
  async checkPortal(identifier: string): Promise<PortalInfo> {
    // Normalize identifier (remove protocol, www, trailing slashes)
    const normalizedIdentifier = identifier
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .replace(/\/$/, '');

    // Try to find school by subdomain or custom domain
    const school = await this.prisma.school.findFirst({
      where: {
        OR: [
          { subdomain: normalizedIdentifier },
          { customDomain: normalizedIdentifier },
        ],
      },
      select: {
        id: true,
        name: true,
        subdomain: true,
        customDomain: true,
        status: true,
        logoUrl: true,
      },
    });

    if (!school) {
      throw new NotFoundException('School not found. Please check your portal address.');
    }

    // Check if school is active
    if (school.status !== 'ACTIVE') {
      throw new BadRequestException(
        `This school portal is currently ${school.status.toLowerCase()}. Please contact support.`,
      );
    }

    return {
      id: school.id,
      name: school.name,
      subdomain: school.subdomain,
      customDomain: school.customDomain || undefined,
      status: school.status,
      logo: school.logoUrl || undefined,
    };
  }

  /**
   * Validate subdomain format
   */
  validateSubdomain(subdomain: string): { valid: boolean; error?: string } {
    // Subdomain rules:
    // - 3-63 characters
    // - Only lowercase letters, numbers, and hyphens
    // - Cannot start or end with hyphen
    // - Cannot contain consecutive hyphens

    if (!subdomain || subdomain.length < 3) {
      return { valid: false, error: 'Subdomain must be at least 3 characters long' };
    }

    if (subdomain.length > 63) {
      return { valid: false, error: 'Subdomain must be at most 63 characters long' };
    }

    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return {
        valid: false,
        error: 'Subdomain can only contain lowercase letters, numbers, and hyphens',
      };
    }

    if (subdomain.startsWith('-') || subdomain.endsWith('-')) {
      return { valid: false, error: 'Subdomain cannot start or end with a hyphen' };
    }

    if (subdomain.includes('--')) {
      return { valid: false, error: 'Subdomain cannot contain consecutive hyphens' };
    }

    // Reserved subdomains
    const reserved = [
      'www',
      'api',
      'admin',
      'app',
      'mail',
      'ftp',
      'localhost',
      'staging',
      'dev',
      'test',
    ];
    if (reserved.includes(subdomain)) {
      return { valid: false, error: 'This subdomain is reserved' };
    }

    return { valid: true };
  }

  /**
   * Check if subdomain is available
   */
  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    const existing = await this.prisma.school.findUnique({
      where: { subdomain },
    });

    return !existing;
  }

  /**
   * Get school by ID
   */
  async getSchoolById(schoolId: string): Promise<PortalInfo | null> {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
      select: {
        id: true,
        name: true,
        subdomain: true,
        customDomain: true,
        status: true,
        logoUrl: true,
      },
    });

    if (!school) {
      return null;
    }

    return {
      id: school.id,
      name: school.name,
      subdomain: school.subdomain,
      customDomain: school.customDomain || undefined,
      status: school.status,
      logo: school.logoUrl || undefined,
    };
  }
}
