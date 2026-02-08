import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordSecurityService } from './password-security.service';
import { PortalService } from './portal.service';
import { AuditLogService, AuditEventType } from './audit-log.service';
import { SchoolType, SchoolStatus, SubscriptionPlan, SubscriptionStatus, UserRole } from '@prisma/client';

export interface SchoolRegistrationData {
  // School Information
  schoolName: string;
  schoolType: SchoolType;
  email: string;
  phone: string;
  address: string;
  state: string;
  lga: string;
  
  // Contact Person
  contactPersonName: string;
  contactPersonRole: string;
  contactPersonPhone: string;
  
  // Additional Info
  estimatedStudentCount: number;
  subdomain: string;
  
  // Admin Account
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

@Injectable()
export class RegistrationService {
  constructor(
    private prisma: PrismaService,
    private passwordSecurityService: PasswordSecurityService,
    private portalService: PortalService,
    private auditLogService: AuditLogService,
  ) {}

  /**
   * Register a new school
   */
  async registerSchool(
    data: SchoolRegistrationData,
    ipAddress: string,
    userAgent?: string,
  ): Promise<{ schoolId: string; message: string }> {
    // Validate subdomain format
    const subdomainValidation = this.portalService.validateSubdomain(data.subdomain);
    if (!subdomainValidation.valid) {
      throw new BadRequestException(subdomainValidation.error);
    }

    // Check if subdomain is available
    const isAvailable = await this.portalService.isSubdomainAvailable(data.subdomain);
    if (!isAvailable) {
      throw new ConflictException('This subdomain is already taken');
    }

    // Check if school email already exists
    const existingSchool = await this.prisma.school.findUnique({
      where: { email: data.email },
    });
    if (existingSchool) {
      throw new ConflictException('A school with this email already exists');
    }

    // Check if admin email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.adminEmail },
    });
    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    // Validate admin password
    const passwordValidation = this.passwordSecurityService.validatePasswordStrength(
      data.adminPassword,
      { name: data.adminName, email: data.adminEmail },
    );
    if (!passwordValidation.isValid) {
      throw new BadRequestException(
        `Password does not meet requirements: ${passwordValidation.feedback.join(', ')}`,
      );
    }

    // Hash admin password
    const hashedPassword = await this.passwordSecurityService.hashPassword(data.adminPassword);

    // Create school and admin user in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create school with PENDING_VERIFICATION status
      const school = await tx.school.create({
        data: {
          name: data.schoolName,
          type: data.schoolType,
          email: data.email,
          phone: data.phone,
          address: data.address,
          state: data.state,
          lga: data.lga,
          contactPersonName: data.contactPersonName,
          contactPersonRole: data.contactPersonRole,
          contactPersonPhone: data.contactPersonPhone,
          estimatedStudentCount: data.estimatedStudentCount,
          subdomain: data.subdomain.toLowerCase(),
          status: SchoolStatus.PENDING_VERIFICATION,
          subscriptionPlan: SubscriptionPlan.ESSENTIAL,
          subscriptionStatus: SubscriptionStatus.TRIAL,
        },
      });

      // Create admin user
      const adminUser = await tx.user.create({
        data: {
          email: data.adminEmail,
          password: hashedPassword,
          name: data.adminName,
          role: UserRole.SCHOOL_ADMIN,
          schoolId: school.id,
          requirePasswordChange: false, // They just set their password
        },
      });

      // Store password in history
      await tx.passwordHistory.create({
        data: {
          userId: adminUser.id,
          passwordHash: hashedPassword,
        },
      });

      return { school, adminUser };
    });

    // Log registration
    await this.auditLogService.log(
      AuditEventType.USER_CREATED,
      ipAddress,
      result.adminUser.id,
      userAgent,
      {
        schoolId: result.school.id,
        schoolName: result.school.name,
        subdomain: result.school.subdomain,
      },
    );

    return {
      schoolId: result.school.id,
      message: 'School registered successfully! Your account is pending verification.',
    };
  }

  /**
   * Get registration by school ID (for admin review)
   */
  async getRegistrationById(schoolId: string) {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        users: {
          where: { role: UserRole.SCHOOL_ADMIN },
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
          },
        },
      },
    });

    return school;
  }

  /**
   * Get all pending registrations (for manufacturer approval)
   */
  async getPendingRegistrations() {
    const schools = await this.prisma.school.findMany({
      where: { status: SchoolStatus.PENDING_VERIFICATION },
      include: {
        users: {
          where: { role: UserRole.SCHOOL_ADMIN },
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return schools;
  }

  /**
   * Approve school registration (manufacturer action)
   */
  async approveRegistration(
    schoolId: string,
    manufacturerId: string,
    ipAddress: string,
    userAgent?: string,
  ): Promise<void> {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      throw new BadRequestException('School not found');
    }

    if (school.status !== SchoolStatus.PENDING_VERIFICATION) {
      throw new BadRequestException('School is not pending verification');
    }

    // Update school status to ACTIVE
    await this.prisma.school.update({
      where: { id: schoolId },
      data: { status: SchoolStatus.ACTIVE },
    });

    // Log approval
    await this.auditLogService.log(
      AuditEventType.USER_UPDATED,
      ipAddress,
      manufacturerId,
      userAgent,
      {
        action: 'APPROVE_SCHOOL',
        schoolId,
        schoolName: school.name,
      },
    );

    // TODO: Send approval email to school admin (Phase 9)
  }

  /**
   * Reject school registration (manufacturer action)
   */
  async rejectRegistration(
    schoolId: string,
    reason: string,
    manufacturerId: string,
    ipAddress: string,
    userAgent?: string,
  ): Promise<void> {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      throw new BadRequestException('School not found');
    }

    if (school.status !== SchoolStatus.PENDING_VERIFICATION) {
      throw new BadRequestException('School is not pending verification');
    }

    // Update school status to SUSPENDED (instead of REJECTED)
    await this.prisma.school.update({
      where: { id: schoolId },
      data: { status: SchoolStatus.SUSPENDED },
    });

    // Log rejection
    await this.auditLogService.log(
      AuditEventType.USER_UPDATED,
      ipAddress,
      manufacturerId,
      userAgent,
      {
        action: 'REJECT_SCHOOL',
        schoolId,
        schoolName: school.name,
        reason,
      },
    );

    // TODO: Send rejection email to school admin (Phase 9)
  }
}
