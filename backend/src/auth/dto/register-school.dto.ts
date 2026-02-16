import { IsString, IsEmail, IsNotEmpty, IsEnum, IsNumber, Min, MinLength, Matches } from 'class-validator';
import { SchoolType } from '@prisma/client';

export class RegisterSchoolDto {
  // School Information
  @IsString()
  @IsNotEmpty()
  schoolName: string;

  @IsEnum(SchoolType)
  schoolType: SchoolType;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  lga: string;

  // Contact Person
  @IsString()
  @IsNotEmpty()
  contactPersonName: string;

  @IsString()
  @IsNotEmpty()
  contactPersonRole: string;

  @IsString()
  @IsNotEmpty()
  contactPersonPhone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  contactPersonId: string;

  // Additional Info
  @IsNumber()
  @Min(1)
  estimatedStudentCount: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Subdomain can only contain lowercase letters, numbers, and hyphens',
  })
  subdomain: string;

  // Admin Account
  @IsString()
  @IsNotEmpty()
  adminName: string;

  @IsEmail()
  @IsNotEmpty()
  adminEmail: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  adminPassword: string;
}
