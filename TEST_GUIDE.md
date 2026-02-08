# EduCore Authentication System - Test Guide

## Overview
This guide provides step-by-step instructions for testing the secure authentication system, including school registration, login flows, and security features.

## Prerequisites
- Backend running on `http://localhost:3000`
- Frontend running on `http://localhost:5173`
- Database cleared and ready for testing
- Postman or similar API testing tool (optional)

---

## Test Scenarios

### 1. School Registration Flow

#### Test 1.1: Successful School Registration
**Objective:** Register a new school successfully

**Steps:**
1. Navigate to `http://localhost:5173/register`
2. Fill in Step 1 - School Information:
   - School Name: `Test Secondary School`
   - School Type: `Secondary School`
   - School Email: `admin@testschool.edu`
   - School Phone: `+234 800 123 4567`
   - School Address: `123 Education Street`
   - State: `Lagos`
   - LGA: `Ikeja`
3. Click "Next"
4. Fill in Step 2 - Contact Person:
   - Full Name: `John Doe`
   - Role/Position: `Principal`
   - Phone Number: `+234 800 765 4321`
5. Click "Next"
6. Fill in Step 3 - School Details:
   - Estimated Student Count: `500`
   - School Subdomain: `testschool`
7. Verify subdomain preview shows: `testschool.educore.ng`
8. Click "Next"
9. Fill in Step 4 - Admin Account:
   - Admin Full Name: `Jane Admin`
   - Admin Email: `jane@testschool.edu`
   - Password: `SecurePass123!`
   - Confirm Password: `SecurePass123!`
10. Verify password strength indicator shows "Strong"
11. Click "Submit Registration"

**Expected Result:**
- Success message displayed
- "Your school registration has been submitted successfully"
- "Your account is pending verification by our team"
- Auto-redirect to login page after 3 seconds

**Database Verification:**
- School created with status `PENDING_VERIFICATION`
- Admin user created with role `SCHOOL_ADMIN`
- Password stored in `PasswordHistory` table
- Audit log entry created

---

#### Test 1.2: Subdomain Validation
**Objective:** Test subdomain format validation

**Test Cases:**
| Subdomain | Expected Result |
|-----------|----------------|
| `ab` | Error: "Subdomain must be at least 3 characters long" |
| `test-school` | Valid ✓ |
| `-testschool` | Error: "Subdomain cannot start or end with a hyphen" |
| `testschool-` | Error: "Subdomain cannot start or end with a hyphen" |
| `test--school` | Error: "Subdomain cannot contain consecutive hyphens" |
| `Test School` | Auto-formatted to `testschool` |
| `www` | Error: "This subdomain is reserved and cannot be used" |
| `api` | Error: "This subdomain is reserved and cannot be used" |

---

#### Test 1.3: Password Strength Validation
**Objective:** Test password strength requirements

**Test Cases:**
| Password | Strength | Valid |
|----------|----------|-------|
| `pass` | Weak | ✗ |
| `password` | Weak | ✗ |
| `Password1` | Medium | ✗ |
| `Password1!` | Strong | ✓ |
| `SecurePass123!` | Strong | ✓ |

**Requirements:**
- ✓ At least 8 characters
- ✓ Contains uppercase letter
- ✓ Contains lowercase letter
- ✓ Contains number
- ✓ Contains special character

---

#### Test 1.4: Duplicate Registration Prevention
**Objective:** Prevent duplicate school registrations

**Steps:**
1. Complete a successful registration (Test 1.1)
2. Try to register again with the same:
   - School email
   - Admin email
   - Subdomain

**Expected Results:**
- School email: "A school with this email already exists"
- Admin email: "A user with this email already exists"
- Subdomain: "This subdomain is already taken"

---

### 2. Multi-Step Login Flow

#### Test 2.1: Portal Connection
**Objective:** Connect to a school portal

**Steps:**
1. Navigate to `http://localhost:5173/login`
2. Enter portal ID: `testschool`
3. Click "Connect to Portal"

**Expected Result:**
- Redirected to `/login/user?portal=testschool`
- Portal connection status shown
- School name displayed

---

#### Test 2.2: Successful Login (Multi-Step)
**Objective:** Login with valid credentials through portal

**Steps:**
1. Complete Test 2.1 (Portal Connection)
2. Enter credentials:
   - Email: `jane@testschool.edu`
   - Password: `SecurePass123!`
   - Check "Remember me"
3. Click "Sign In"

**Expected Result:**
- Login successful
- Redirected to appropriate dashboard based on role
- Access token and refresh token stored
- Session created in database
- Last login timestamp updated
- Audit log entry created

**Database Verification:**
- `User.lastLoginAt` updated
- `User.lastLoginIp` updated
- `Session` record created
- `AuditLog` entry with `LOGIN_SUCCESS`

---

#### Test 2.3: Direct Login
**Objective:** Login without portal connection step

**Steps:**
1. Navigate to `http://localhost:5173/login/direct`
2. Enter credentials:
   - Email: `jane@testschool.edu`
   - Password: `SecurePass123!`
3. Click "Sign In"

**Expected Result:**
- Login successful
- School automatically detected from email
- Redirected to dashboard

---

### 3. Security Features Testing

#### Test 3.1: Rate Limiting (Email-Based)
**Objective:** Test email-based rate limiting

**Steps:**
1. Attempt to login with wrong password 6 times using same email
2. Try to login again

**Expected Result:**
- After 5 failed attempts: "Too many login attempts. Please try again in X minutes."
- Rate limit: 5 attempts per 15 minutes per email

---

#### Test 3.2: Rate Limiting (IP-Based)
**Objective:** Test IP-based rate limiting

**Steps:**
1. Attempt to login with different emails but wrong passwords 11 times from same IP
2. Try to login again

**Expected Result:**
- After 10 failed attempts: "Too many login attempts from this IP. Please try again in X minutes."
- Rate limit: 10 attempts per 15 minutes per IP

---

#### Test 3.3: Account Lockout
**Objective:** Test account lockout after failed attempts

**Steps:**
1. Attempt to login with wrong password 5 times for same account
2. Try to login with correct password

**Expected Result:**
- After 5 failed attempts: "Account has been locked due to too many failed login attempts. Please try again in X minutes."
- Lockout duration: 30 minutes
- Account automatically unlocked after 30 minutes

**Database Verification:**
- `User.failedLoginAttempts` = 5
- `User.lockedUntil` set to 30 minutes from now
- `LoginAttempt` records created for each attempt

---

#### Test 3.4: Invalid Credentials
**Objective:** Test login with invalid credentials

**Test Cases:**
| Email | Password | Expected Result |
|-------|----------|----------------|
| `nonexistent@test.com` | `any` | "Invalid credentials" |
| `jane@testschool.edu` | `wrongpass` | "Invalid credentials" |
| `jane@testschool.edu` | `` | Validation error |
| `` | `SecurePass123!` | Validation error |

---

#### Test 3.5: Portal Validation
**Objective:** Test user belongs to correct school

**Steps:**
1. Register two schools: `school1` and `school2`
2. Try to login to `school1` with `school2` user credentials

**Expected Result:**
- Error: "Invalid credentials"
- Failed attempt recorded
- Audit log entry created

---

#### Test 3.6: Remember Me Functionality
**Objective:** Test extended session duration

**Steps:**
1. Login with "Remember me" checked
2. Check session expiry in database

**Expected Result:**
- Without "Remember me": Session expires in 7 days
- With "Remember me": Session expires in 30 days

---

### 4. Password Management

#### Test 4.1: First Login Password Change
**Objective:** Test requirePasswordChange flag

**Steps:**
1. Create user with `requirePasswordChange: true`
2. Login with that user
3. Verify redirect to password change page

**Expected Result:**
- Redirected to `/change-password`
- Cannot access other pages until password changed
- Flag cleared after successful password change

---

#### Test 4.2: Password History
**Objective:** Test password reuse prevention

**Steps:**
1. Login and change password to `NewPass123!`
2. Try to change password back to `SecurePass123!`

**Expected Result:**
- Error: "Password has been used recently. Please choose a different password."
- System keeps last 5 passwords in history

---

### 5. Audit Logging

#### Test 5.1: Login Events
**Objective:** Verify all login events are logged

**Events to Verify:**
- `LOGIN_SUCCESS` - Successful login
- `LOGIN_FAILED` - Failed login attempt
- `LOGOUT` - User logout
- `TOKEN_REFRESH` - Token refresh
- `PASSWORD_RESET_REQUESTED` - Password reset request
- `PASSWORD_RESET_COMPLETED` - Password reset completion
- `PASSWORD_CHANGED` - Password change

**Database Query:**
```sql
SELECT * FROM audit_logs 
WHERE action IN ('LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT')
ORDER BY created_at DESC;
```

---

### 6. Session Management

#### Test 6.1: Token Refresh
**Objective:** Test access token refresh

**Steps:**
1. Login successfully
2. Wait for access token to expire (15 minutes)
3. Make an authenticated API request

**Expected Result:**
- Frontend automatically refreshes token
- Request succeeds with new access token
- Audit log entry created

---

#### Test 6.2: Logout
**Objective:** Test logout functionality

**Steps:**
1. Login successfully
2. Click logout
3. Try to access protected route

**Expected Result:**
- Session revoked in database
- Tokens cleared from localStorage
- Redirected to login page
- Audit log entry created

---

## API Testing with Postman

### Register School
```http
POST http://localhost:3000/auth/register-school
Content-Type: application/json

{
  "schoolName": "Test Secondary School",
  "schoolType": "SECONDARY",
  "email": "admin@testschool.edu",
  "phone": "+234 800 123 4567",
  "address": "123 Education Street",
  "state": "Lagos",
  "lga": "Ikeja",
  "contactPersonName": "John Doe",
  "contactPersonRole": "Principal",
  "contactPersonPhone": "+234 800 765 4321",
  "estimatedStudentCount": 500,
  "subdomain": "testschool",
  "adminName": "Jane Admin",
  "adminEmail": "jane@testschool.edu",
  "adminPassword": "SecurePass123!"
}
```

### Check Portal
```http
POST http://localhost:3000/auth/check-portal
Content-Type: application/json

{
  "identifier": "testschool"
}
```

### Login
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "jane@testschool.edu",
  "password": "SecurePass123!",
  "rememberMe": true,
  "portalId": "testschool"
}
```

### Refresh Token
```http
POST http://localhost:3000/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refresh_token_from_login>"
}
```

### Logout
```http
POST http://localhost:3000/auth/logout
Content-Type: application/json

{
  "refreshToken": "<refresh_token_from_login>"
}
```

---

## Database Verification Queries

### Check School Registration
```sql
SELECT id, name, subdomain, status, created_at 
FROM schools 
WHERE subdomain = 'testschool';
```

### Check Admin User
```sql
SELECT u.id, u.email, u.name, u.role, u.require_password_change, u.last_login_at
FROM users u
JOIN schools s ON u.school_id = s.id
WHERE s.subdomain = 'testschool' AND u.role = 'SCHOOL_ADMIN';
```

### Check Password History
```sql
SELECT ph.id, ph.user_id, ph.created_at
FROM password_history ph
JOIN users u ON ph.user_id = u.id
WHERE u.email = 'jane@testschool.edu'
ORDER BY ph.created_at DESC;
```

### Check Active Sessions
```sql
SELECT id, user_id, ip_address, user_agent, expires_at, revoked
FROM sessions
WHERE user_id = '<user_id>' AND revoked = false
ORDER BY created_at DESC;
```

### Check Login Attempts
```sql
SELECT email, ip_address, success, failure_reason, created_at
FROM login_attempts
WHERE email = 'jane@testschool.edu'
ORDER BY created_at DESC
LIMIT 10;
```

### Check Audit Logs
```sql
SELECT action, user_id, ip_address, success, metadata, created_at
FROM audit_logs
WHERE user_id = '<user_id>'
ORDER BY created_at DESC
LIMIT 20;
```

### Check Account Lockout Status
```sql
SELECT id, email, failed_login_attempts, locked_until
FROM users
WHERE email = 'jane@testschool.edu';
```

---

## Security Testing Checklist

- [ ] SQL Injection: Try `' OR '1'='1` in email field
- [ ] XSS: Try `<script>alert('xss')</script>` in text fields
- [ ] Rate Limiting: Verify 5 email attempts / 15 min
- [ ] Rate Limiting: Verify 10 IP attempts / 15 min
- [ ] Account Lockout: Verify 5 failed attempts = 30 min lockout
- [ ] Password Strength: Verify all requirements enforced
- [ ] Password History: Verify last 5 passwords prevented
- [ ] Session Security: Verify tokens expire correctly
- [ ] Audit Logging: Verify all events logged
- [ ] Multi-Tenancy: Verify users can't access other schools

---

## Common Issues & Troubleshooting

### Issue: "Cannot connect to server"
**Solution:** Ensure backend is running on port 3000
```bash
cd educore-os/backend
npm run start:dev
```

### Issue: "School not found"
**Solution:** Ensure school status is `ACTIVE`, not `PENDING_VERIFICATION`
```sql
UPDATE schools SET status = 'ACTIVE' WHERE subdomain = 'testschool';
```

### Issue: "Account is locked"
**Solution:** Reset lockout manually
```sql
UPDATE users 
SET failed_login_attempts = 0, locked_until = NULL 
WHERE email = 'jane@testschool.edu';
```

### Issue: "Rate limit exceeded"
**Solution:** Wait 15 minutes or clear rate limit data
```sql
DELETE FROM login_attempts WHERE email = 'jane@testschool.edu';
```

---

## Test Data Setup

### Create Test School (Already Active)
```sql
-- Run this if you want to skip approval process
UPDATE schools 
SET status = 'ACTIVE' 
WHERE subdomain = 'testschool';
```

### Create Additional Test Users
```sql
-- Teacher
INSERT INTO users (email, password, name, role, school_id)
VALUES (
  'teacher@testschool.edu',
  '<bcrypt_hash>',
  'Test Teacher',
  'TEACHER',
  '<school_id>'
);

-- Student
INSERT INTO users (email, password, name, role, school_id)
VALUES (
  'student@testschool.edu',
  '<bcrypt_hash>',
  'Test Student',
  'STUDENT',
  '<school_id>'
);
```

---

## Success Criteria

✅ All registration validations working
✅ Multi-step login flow functional
✅ Direct login flow functional
✅ Rate limiting enforced (email and IP)
✅ Account lockout after 5 failed attempts
✅ Password strength requirements enforced
✅ Password history prevents reuse
✅ Sessions created and managed correctly
✅ Audit logs capture all events
✅ Remember me extends session duration
✅ Portal validation prevents cross-school access

---

## Next Steps After Testing

1. **Email Integration:** Implement email notifications (Phase 9)
2. **Password Reset:** Implement forgot password flow
3. **Session Management UI:** Build session management page
4. **Admin Dashboard:** Build manufacturer approval interface
5. **Security Headers:** Add helmet and security middleware
6. **Production Deployment:** Configure for production environment

---

## Contact

For issues or questions during testing, refer to:
- Backend logs: `educore-os/backend` console
- Frontend logs: Browser console (F12)
- Database: Check Prisma Studio or direct SQL queries
