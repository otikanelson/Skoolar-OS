# Skoolar Secure Authentication System - Design Document

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Registration │  │ Multi-Step   │  │ Password     │          │
│  │ Form         │  │ Login        │  │ Management   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS + JWT
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (NestJS)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Auth         │  │ Rate Limiter │  │ Security     │          │
│  │ Controller   │  │ Middleware   │  │ Middleware   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Auth Service │  │ Token Service│  │ Audit Logger │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL/Neon)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Users        │  │ Schools      │  │ Audit Logs   │          │
│  │ Sessions     │  │ LoginAttempts│  │ PasswordHist │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

**Frontend:**
- React 18+ with TypeScript
- React Router for navigation
- Axios for API calls
- React Hook Form for form validation
- Zod for schema validation
- TailwindCSS for styling

**Backend:**
- NestJS with TypeScript
- Passport.js for authentication strategies
- JWT for token management
- bcrypt for password hashing
- class-validator for input validation
- @nestjs/throttler for rate limiting
- nodemailer for email notifications

**Database:**
- PostgreSQL (Neon)
- Prisma ORM
- Redis for rate limiting and session storage

**Security Tools:**
- helmet for security headers
- csurf for CSRF protection
- express-rate-limit for API rate limiting
- validator for input sanitization

## 2. Database Schema Design

### 2.1 Enhanced User Model


```prisma
model User {
  id                    String          @id @default(cuid())
  schoolId              String?
  email                 String          @unique
  password              String
  name                  String
  role                  UserRole
  status                UserStatus      @default(ACTIVE)
  
  // Security fields
  requirePasswordChange Boolean         @default(false)
  passwordChangedAt     DateTime?
  lastLoginAt           DateTime?
  lastLoginIp           String?
  failedLoginAttempts   Int             @default(0)
  lockedUntil           DateTime?
  mfaEnabled            Boolean         @default(false)
  mfaSecret             String?
  
  // Timestamps
  createdAt             DateTime        @default(now())
  updatedAt             DateTime        @updatedAt
  
  // Relations
  school                School?         @relation(fields: [schoolId], references: [id])
  passwordHistory       PasswordHistory[]
  loginAttempts         LoginAttempt[]
  sessions              Session[]
  auditLogs             AuditLog[]
  
  @@index([email])
  @@index([schoolId])
  @@map("users")
}
```

### 2.2 New Security Models

```prisma
// Track password history to prevent reuse
model PasswordHistory {
  id          String   @id @default(cuid())
  userId      String
  passwordHash String
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@map("password_history")
}

// Track login attempts for rate limiting and security
model LoginAttempt {
  id          String   @id @default(cuid())
  userId      String?
  email       String
  ipAddress   String
  userAgent   String?
  success     Boolean
  failureReason String?
  createdAt   DateTime @default(now())
  
  user        User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([email, createdAt])
  @@index([ipAddress, createdAt])
  @@map("login_attempts")
}

// Manage active sessions
model Session {
  id          String   @id @default(cuid())
  userId      String
  token       String   @unique
  refreshToken String? @unique
  ipAddress   String
  userAgent   String?
  expiresAt   DateTime
  lastActivityAt DateTime @default(now())
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([token])
  @@index([expiresAt])
  @@map("sessions")
}

// Password reset tokens
model PasswordResetToken {
  id          String   @id @default(cuid())
  email       String
  token       String   @unique
  expiresAt   DateTime
  used        Boolean  @default(false)
  usedAt      DateTime?
  createdAt   DateTime @default(now())
  
  @@index([email])
  @@index([token])
  @@index([expiresAt])
  @@map("password_reset_tokens")
}

// Comprehensive audit logging
model AuditLog {
  id          String   @id @default(cuid())
  userId      String?
  schoolId    String?
  action      String
  resource    String?
  resourceId  String?
  ipAddress   String?
  userAgent   String?
  success     Boolean
  errorMessage String?
  metadata    Json?
  createdAt   DateTime @default(now())
  
  user        User?    @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([schoolId])
  @@index([action])
  @@index([createdAt])
  @@map("audit_logs")
}
```

## 3. API Design

### 3.1 Authentication Endpoints

#### POST /api/auth/register
Register a new school.

**Request:**
```typescript
{
  // School information
  schoolName: string;
  schoolType: 'PRIMARY' | 'SECONDARY' | 'TERTIARY';
  email: string;
  phone: string;
  address: string;
  state: string;
  lga: string;
  
  // Contact person
  contactPersonName: string;
  contactPersonRole: string;
  contactPersonPhone: string;
  
  // Additional info
  estimatedStudentCount: number;
  subdomain: string;
  customDomain?: string;
  
  // Documents (file uploads)
  verificationDocuments: File[];
}
```

**Response:**
```typescript
{
  success: true;
  message: "Registration submitted successfully";
  school: {
    id: string;
    name: string;
    subdomain: string;
    status: "PENDING_VERIFICATION";
  }
}
```

#### POST /api/auth/check-portal
Check if a school portal exists and is active.

**Request:**
```typescript
{
  portal: string; // subdomain or custom domain
}
```

**Response:**
```typescript
{
  exists: true;
  school: {
    id: string;
    name: string;
    subdomain: string;
    status: "ACTIVE";
    logoUrl?: string;
  }
}
```

#### POST /api/auth/login
Authenticate user credentials.

**Request:**
```typescript
{
  email: string;
  password: string;
  portalId: string; // from check-portal response
  rememberMe?: boolean;
}
```

**Response:**
```typescript
{
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    schoolId: string;
    requirePasswordChange: boolean;
  }
}
```

#### POST /api/auth/refresh
Refresh access token using refresh token.

**Request:**
```typescript
{
  refreshToken: string;
}
```

**Response:**
```typescript
{
  accessToken: string;
  refreshToken: string;
}
```

#### POST /api/auth/logout
Invalidate current session.

**Request:**
```typescript
{
  refreshToken: string;
}
```

**Response:**
```typescript
{
  success: true;
  message: "Logged out successfully";
}
```

### 3.2 Password Management Endpoints

#### POST /api/auth/forgot-password
Request password reset.

**Request:**
```typescript
{
  email: string;
}
```

**Response:**
```typescript
{
  success: true;
  message: "Password reset email sent";
}
```

#### POST /api/auth/reset-password
Reset password using token.

**Request:**
```typescript
{
  token: string;
  newPassword: string;
}
```

**Response:**
```typescript
{
  success: true;
  message: "Password reset successfully";
}
```

#### POST /api/auth/change-password
Change password for logged-in user.

**Request:**
```typescript
{
  currentPassword: string;
  newPassword: string;
}
```

**Response:**
```typescript
{
  success: true;
  message: "Password changed successfully";
}
```

### 3.3 Session Management Endpoints

#### GET /api/auth/sessions
Get all active sessions for current user.

**Response:**
```typescript
{
  sessions: [
    {
      id: string;
      ipAddress: string;
      userAgent: string;
      lastActivityAt: string;
      createdAt: string;
      current: boolean;
    }
  ]
}
```

#### DELETE /api/auth/sessions/:id
Revoke a specific session.

**Response:**
```typescript
{
  success: true;
  message: "Session revoked successfully";
}
```

## 4. Security Implementation Details


### 4.1 Password Security

#### Password Hashing
```typescript
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

#### Password Strength Validation
```typescript
interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isValid: boolean;
}

function validatePasswordStrength(password: string, userInfo: { name: string; email: string }): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;
  
  // Length check
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters');
  } else if (password.length >= 12) {
    score++;
  }
  
  // Character variety
  if (!/[a-z]/.test(password)) {
    feedback.push('Include lowercase letters');
  } else {
    score++;
  }
  
  if (!/[A-Z]/.test(password)) {
    feedback.push('Include uppercase letters');
  } else {
    score++;
  }
  
  if (!/[0-9]/.test(password)) {
    feedback.push('Include numbers');
  } else {
    score++;
  }
  
  if (!/[^a-zA-Z0-9]/.test(password)) {
    feedback.push('Include special characters');
  } else {
    score++;
  }
  
  // Personal info check
  const lowerPassword = password.toLowerCase();
  if (lowerPassword.includes(userInfo.name.toLowerCase())) {
    feedback.push('Password should not contain your name');
    score = Math.max(0, score - 2);
  }
  
  const emailUser = userInfo.email.split('@')[0].toLowerCase();
  if (lowerPassword.includes(emailUser)) {
    feedback.push('Password should not contain your email');
    score = Math.max(0, score - 2);
  }
  
  // Common password check (implement with a list)
  if (isCommonPassword(password)) {
    feedback.push('This password is too common');
    score = 0;
  }
  
  return {
    score,
    feedback,
    isValid: score >= 3 && feedback.length === 0
  };
}
```

#### Password History Check
```typescript
async function checkPasswordHistory(userId: string, newPassword: string): Promise<boolean> {
  const history = await prisma.passwordHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  
  for (const record of history) {
    if (await bcrypt.compare(newPassword, record.passwordHash)) {
      return false; // Password was used before
    }
  }
  
  return true; // Password is new
}

async function addToPasswordHistory(userId: string, passwordHash: string): Promise<void> {
  await prisma.passwordHistory.create({
    data: { userId, passwordHash }
  });
  
  // Keep only last 5 passwords
  const history = await prisma.passwordHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    skip: 5
  });
  
  if (history.length > 0) {
    await prisma.passwordHistory.deleteMany({
      where: {
        id: { in: history.map(h => h.id) }
      }
    });
  }
}
```

### 4.2 Rate Limiting

#### Implementation with @nestjs/throttler
```typescript
// app.module.ts
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

// auth.controller.ts
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  @Throttle(5, 900) // 5 requests per 15 minutes
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // ...
  }
  
  @Throttle(3, 3600) // 3 requests per hour
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    // ...
  }
}
```

#### Custom Rate Limiter for Login Attempts
```typescript
@Injectable()
export class LoginRateLimiter {
  constructor(private prisma: PrismaService) {}
  
  async checkRateLimit(email: string, ipAddress: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    // Check failed attempts by email
    const emailAttempts = await this.prisma.loginAttempt.count({
      where: {
        email,
        success: false,
        createdAt: { gte: fifteenMinutesAgo }
      }
    });
    
    if (emailAttempts >= 5) {
      return { allowed: false, retryAfter: 900 }; // 15 minutes
    }
    
    // Check failed attempts by IP
    const ipAttempts = await this.prisma.loginAttempt.count({
      where: {
        ipAddress,
        success: false,
        createdAt: { gte: fifteenMinutesAgo }
      }
    });
    
    if (ipAttempts >= 10) {
      return { allowed: false, retryAfter: 900 };
    }
    
    return { allowed: true };
  }
  
  async recordAttempt(data: {
    email: string;
    ipAddress: string;
    userAgent?: string;
    success: boolean;
    failureReason?: string;
    userId?: string;
  }): Promise<void> {
    await this.prisma.loginAttempt.create({ data });
  }
}
```

### 4.3 Account Lockout

```typescript
@Injectable()
export class AccountLockoutService {
  constructor(private prisma: PrismaService) {}
  
  async checkLockout(userId: string): Promise<{ locked: boolean; until?: Date }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { lockedUntil: true }
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return { locked: true, until: user.lockedUntil };
    }
    
    // Clear lockout if expired
    if (user.lockedUntil) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { lockedUntil: null, failedLoginAttempts: 0 }
      });
    }
    
    return { locked: false };
  }
  
  async recordFailedAttempt(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { failedLoginAttempts: true }
    });
    
    if (!user) return;
    
    const attempts = user.failedLoginAttempts + 1;
    
    if (attempts >= 5) {
      // Lock account for 30 minutes
      const lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
      await this.prisma.user.update({
        where: { id: userId },
        data: { failedLoginAttempts: attempts, lockedUntil }
      });
    } else {
      await this.prisma.user.update({
        where: { id: userId },
        data: { failedLoginAttempts: attempts }
      });
    }
  }
  
  async resetFailedAttempts(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { failedLoginAttempts: 0, lockedUntil: null }
    });
  }
}
```

### 4.4 JWT Token Management

```typescript
interface JwtPayload {
  sub: string; // user ID
  email: string;
  role: string;
  schoolId?: string;
  sessionId: string;
  iat: number;
  exp: number;
}

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}
  
  async generateTokens(user: User, ipAddress: string, userAgent: string, rememberMe: boolean = false) {
    const expiresIn = rememberMe ? '30d' : '24h';
    const expiresAt = new Date(Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000);
    
    // Create session
    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        token: '', // Will be updated
        ipAddress,
        userAgent,
        expiresAt
      }
    });
    
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      sessionId: session.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(expiresAt.getTime() / 1000)
    };
    
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(
      { sub: user.id, sessionId: session.id },
      { expiresIn }
    );
    
    // Update session with tokens
    await this.prisma.session.update({
      where: { id: session.id },
      data: { token: accessToken, refreshToken }
    });
    
    return { accessToken, refreshToken };
  }
  
  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      
      // Verify session exists and is valid
      const session = await this.prisma.session.findUnique({
        where: { refreshToken },
        include: { user: true }
      });
      
      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      // Generate new tokens
      const newAccessToken = this.jwtService.sign({
        sub: session.user.id,
        email: session.user.email,
        role: session.user.role,
        schoolId: session.user.schoolId,
        sessionId: session.id
      }, { expiresIn: '15m' });
      
      const newRefreshToken = this.jwtService.sign({
        sub: session.user.id,
        sessionId: session.id
      }, { expiresIn: '30d' });
      
      // Update session
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          token: newAccessToken,
          refreshToken: newRefreshToken,
          lastActivityAt: new Date()
        }
      });
      
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  
  async revokeSession(sessionId: string): Promise<void> {
    await this.prisma.session.delete({
      where: { id: sessionId }
    });
  }
  
  async revokeAllUserSessions(userId: string, exceptSessionId?: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        userId,
        id: exceptSessionId ? { not: exceptSessionId } : undefined
      }
    });
  }
}
```

### 4.5 Input Validation

```typescript
// DTOs with class-validator
import { IsEmail, IsString, MinLength, Matches, IsBoolean, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
  
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
  
  @IsString()
  portalId: string;
  
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class RegisterSchoolDto {
  @IsString()
  @MinLength(3)
  schoolName: string;
  
  @IsEmail()
  email: string;
  
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number' })
  phone: string;
  
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'Subdomain can only contain lowercase letters, numbers, and hyphens' })
  subdomain: string;
  
  // ... other fields
}

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;
  
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number, and special character'
  })
  newPassword: string;
}
```

### 4.6 Audit Logging

```typescript
@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}
  
  async log(data: {
    userId?: string;
    schoolId?: string;
    action: string;
    resource?: string;
    resourceId?: string;
    ipAddress?: string;
    userAgent?: string;
    success: boolean;
    errorMessage?: string;
    metadata?: any;
  }): Promise<void> {
    await this.prisma.auditLog.create({ data });
  }
  
  async logAuthEvent(
    action: 'LOGIN' | 'LOGOUT' | 'PASSWORD_CHANGE' | 'PASSWORD_RESET' | 'FAILED_LOGIN',
    userId: string | null,
    email: string,
    ipAddress: string,
    success: boolean,
    errorMessage?: string
  ): Promise<void> {
    await this.log({
      userId,
      action,
      resource: 'auth',
      ipAddress,
      success,
      errorMessage,
      metadata: { email }
    });
  }
}
```

## 5. Frontend Implementation


### 5.1 Multi-Step Login Flow

```typescript
// Step 1: Portal Connection
interface PortalCheckState {
  portal: string;
  school: {
    id: string;
    name: string;
    logoUrl?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

function PortalConnectionStep() {
  const [state, setState] = useState<PortalCheckState>({
    portal: '',
    school: null,
    loading: false,
    error: null
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await api.post('/auth/check-portal', {
        portal: state.portal
      });
      
      if (response.data.exists && response.data.school.status === 'ACTIVE') {
        setState(prev => ({ ...prev, school: response.data.school, loading: false }));
        // Move to next step
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'School not found or not active'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Unable to connect to portal'
      }));
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={state.portal}
        onChange={(e) => setState(prev => ({ ...prev, portal: e.target.value }))}
        placeholder="Enter school subdomain"
      />
      <button type="submit" disabled={state.loading}>
        {state.loading ? 'Connecting...' : 'Continue'}
      </button>
      {state.error && <div className="error">{state.error}</div>}
    </form>
  );
}

// Step 2: User Login
interface LoginState {
  email: string;
  password: string;
  rememberMe: boolean;
  loading: boolean;
  error: string | null;
}

function UserLoginStep({ portalId }: { portalId: string }) {
  const [state, setState] = useState<LoginState>({
    email: '',
    password: '',
    rememberMe: false,
    loading: false,
    error: null
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await api.post('/auth/login', {
        email: state.email,
        password: state.password,
        portalId,
        rememberMe: state.rememberMe
      });
      
      // Store tokens securely
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      // Check if password change required
      if (response.data.user.requirePasswordChange) {
        // Redirect to password change page
      } else {
        // Redirect to dashboard
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Login failed'
      }));
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={state.email}
        onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={state.password}
        onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
        placeholder="Password"
        required
      />
      <label>
        <input
          type="checkbox"
          checked={state.rememberMe}
          onChange={(e) => setState(prev => ({ ...prev, rememberMe: e.target.checked }))}
        />
        Remember me for 30 days
      </label>
      <button type="submit" disabled={state.loading}>
        {state.loading ? 'Logging in...' : 'Login'}
      </button>
      {state.error && <div className="error">{state.error}</div>}
    </form>
  );
}
```

### 5.2 Password Strength Indicator

```typescript
interface PasswordStrengthProps {
  password: string;
  userInfo: { name: string; email: string };
}

function PasswordStrengthIndicator({ password, userInfo }: PasswordStrengthProps) {
  const [strength, setStrength] = useState({ score: 0, feedback: [], isValid: false });
  
  useEffect(() => {
    if (password) {
      // Call validation function
      const result = validatePasswordStrength(password, userInfo);
      setStrength(result);
    }
  }, [password, userInfo]);
  
  const getStrengthLabel = (score: number) => {
    if (score === 0) return 'Very Weak';
    if (score === 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Good';
    return 'Strong';
  };
  
  const getStrengthColor = (score: number) => {
    if (score === 0) return 'red';
    if (score === 1) return 'orange';
    if (score === 2) return 'yellow';
    if (score === 3) return 'lightgreen';
    return 'green';
  };
  
  return (
    <div className="password-strength">
      <div className="strength-bar">
        <div
          className="strength-fill"
          style={{
            width: `${(strength.score / 4) * 100}%`,
            backgroundColor: getStrengthColor(strength.score)
          }}
        />
      </div>
      <div className="strength-label">{getStrengthLabel(strength.score)}</div>
      {strength.feedback.length > 0 && (
        <ul className="strength-feedback">
          {strength.feedback.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 5.3 Secure Token Storage

```typescript
// Token management utility
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  
  static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }
  
  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }
  
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
  
  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
  
  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// Axios interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = TokenManager.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        const response = await api.post('/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        TokenManager.setTokens(accessToken, newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        TokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### 5.4 Protected Routes

```typescript
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
}

// Usage in routes
<Routes>
  <Route path="/login" element={<Login />} />
  
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
  </Route>
  
  <Route element={<ProtectedRoute allowedRoles={['MANUFACTURER']} />}>
    <Route path="/manufacturer/dashboard" element={<ManufacturerDashboard />} />
  </Route>
  
  <Route element={<ProtectedRoute allowedRoles={['SCHOOL_ADMIN', 'ADMIN']} />}>
    <Route path="/admin/users" element={<UserManagement />} />
  </Route>
</Routes>
```

## 6. Security Headers Configuration

```typescript
// main.ts
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.skoolar.com'],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  }));
  
  // CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  await app.listen(3000);
}
```

## 7. Testing Strategy

### 7.1 Unit Tests
- Password hashing and verification
- Password strength validation
- Token generation and verification
- Rate limiting logic
- Account lockout logic

### 7.2 Integration Tests
- Login flow (success and failure cases)
- Password reset flow
- Token refresh flow
- Session management
- Multi-tenancy isolation

### 7.3 Security Tests
- SQL injection attempts
- XSS attempts
- CSRF attacks
- Brute force attacks
- Session hijacking attempts
- Token manipulation

### 7.4 End-to-End Tests
- Complete registration flow
- Complete login flow
- Password change flow
- Multi-step login
- Session timeout

## 8. Deployment Considerations

### 8.1 Environment Variables
```env
# JWT
JWT_SECRET=<256-bit-secret>
JWT_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=30d

# Database
DATABASE_URL=<connection-string>

# Email
SMTP_HOST=<smtp-host>
SMTP_PORT=587
SMTP_USER=<smtp-user>
SMTP_PASSWORD=<smtp-password>
FROM_EMAIL=noreply@skoolar.com

# Security
ALLOWED_ORIGINS=https://skoolar.com,https://app.skoolar.com
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=10

# Redis (for rate limiting)
REDIS_URL=<redis-connection-string>
```

### 8.2 Production Checklist
- [ ] Strong JWT secret (minimum 256 bits)
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Error messages don't leak information
- [ ] Audit logging enabled
- [ ] Database backups configured
- [ ] Monitoring and alerting set up
- [ ] Incident response plan documented

## 9. Monitoring and Alerts

### 9.1 Metrics to Track
- Failed login attempts per minute
- Account lockouts per hour
- Password reset requests per hour
- Active sessions count
- Token refresh rate
- API response times
- Error rates

### 9.2 Alerts to Configure
- Spike in failed login attempts (possible attack)
- Multiple account lockouts (possible brute force)
- Unusual number of password resets
- High error rates
- Slow API responses
- Database connection issues

## 10. Future Enhancements

### Phase 2
- Two-factor authentication (TOTP)
- Email verification on registration
- SMS notifications for security events
- IP whitelisting for administrators
- Device fingerprinting

### Phase 3
- Biometric authentication
- Hardware security keys (WebAuthn)
- Single Sign-On (SSO) integration
- Advanced threat detection with ML
- Passwordless authentication

---

This design provides a comprehensive, security-hardened authentication system suitable for production use with sensitive educational data.
