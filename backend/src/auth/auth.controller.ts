import { Controller, Post, Body, UseGuards, Request, Get, Ip, Headers, Param } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CheckPortalDto } from './dto/check-portal.dto';
import { RegisterSchoolDto } from './dto/register-school.dto';
import { PasswordResetService } from './services/password-reset.service';
import { PasswordChangeService } from './services/password-change.service';
import { PortalService } from './services/portal.service';
import { RegistrationService } from './services/registration.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private passwordResetService: PasswordResetService,
    private passwordChangeService: PasswordChangeService,
    private portalService: PortalService,
    private registrationService: RegistrationService,
  ) {}

  @Post('check-portal')
  async checkPortal(@Body() checkPortalDto: CheckPortalDto) {
    const portal = await this.portalService.checkPortal(checkPortalDto.identifier);
    return {
      success: true,
      portal,
    };
  }

  @Post('register-school')
  async registerSchool(
    @Body() registerSchoolDto: RegisterSchoolDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const result = await this.registrationService.registerSchool(
      registerSchoolDto,
      ipAddress,
      userAgent,
    );
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('registrations/pending')
  async getPendingRegistrations() {
    return this.registrationService.getPendingRegistrations();
  }

  @UseGuards(JwtAuthGuard)
  @Post('registrations/:schoolId/approve')
  async approveRegistration(
    @Param('schoolId') schoolId: string,
    @Request() req,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    await this.registrationService.approveRegistration(
      schoolId,
      req.user?.id || 'system',
      ipAddress,
      userAgent,
    );
    return { message: 'School approved successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('registrations/:schoolId/reject')
  async rejectRegistration(
    @Param('schoolId') schoolId: string,
    @Body('reason') reason: string,
    @Request() req,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    await this.registrationService.rejectRegistration(
      schoolId,
      reason,
      req.user?.id || 'system',
      ipAddress,
      userAgent,
    );
    return { message: 'School rejected successfully' };
  }

  // @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 requests per 15 minutes - TEMPORARILY DISABLED FOR TESTING
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
      loginDto.portalId,
      ipAddress,
    );
    return this.authService.login(
      user,
      ipAddress,
      userAgent || 'Unknown',
      loginDto.rememberMe || false,
    );
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  async logout(
    @Body('refreshToken') refreshToken: string,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    await this.authService.logout(refreshToken, ipAddress, userAgent);
    return { message: 'Logged out successfully' };
  }

  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 requests per hour
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    await this.passwordResetService.requestPasswordReset(
      forgotPasswordDto.email,
      ipAddress,
      userAgent,
    );
    // Always return success to prevent email enumeration
    return {
      message: 'If an account exists with this email, a password reset link has been sent.',
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    await this.passwordResetService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
      ipAddress,
      userAgent,
    );
    return { message: 'Password has been reset successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    // Get current session ID from request (would need to be added to JWT payload or passed separately)
    const currentSessionId = req.user.sessionId || 'unknown';
    
    await this.passwordChangeService.changePassword(
      req.user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
      currentSessionId,
      ipAddress,
      userAgent,
    );
    return { message: 'Password changed successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('require-password-change')
  async checkRequirePasswordChange(@Request() req) {
    const required = await this.passwordChangeService.checkRequirePasswordChange(req.user.id);
    return { requirePasswordChange: required };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verifyToken(@Request() req) {
    return {
      valid: true,
      user: req.user,
    };
  }
}
