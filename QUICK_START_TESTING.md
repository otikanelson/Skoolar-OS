# Quick Start Testing Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Start the Backend
```bash
cd educore-os/backend
npm run start:dev
```
Wait for: `EduCore API running on port 3000`

### Step 2: Start the Frontend
```bash
cd educore-os/frontend
npm run dev
```
Wait for: `Local: http://localhost:5173`

### Step 3: Register a School
1. Open browser: `http://localhost:5173/register`
2. Fill in the form (4 steps):
   - **School Info:** Name, type, email, phone, address, state, LGA
   - **Contact Person:** Name, role, phone
   - **School Details:** Student count, subdomain (e.g., `myschool`)
   - **Admin Account:** Name, email, password (must be strong!)
3. Click "Submit Registration"
4. See success message

### Step 4: Activate the School
```sql
-- In your database client (or Prisma Studio)
UPDATE schools 
SET status = 'ACTIVE' 
WHERE subdomain = 'myschool';
```

### Step 5: Login
**Option A: Multi-Step Login**
1. Go to: `http://localhost:5173/login`
2. Enter portal ID: `myschool`
3. Click "Connect to Portal"
4. Enter your admin email and password
5. Check "Remember me" (optional)
6. Click "Sign In"

**Option B: Direct Login**
1. Go to: `http://localhost:5173/login/direct`
2. Enter your admin email and password
3. Click "Sign In"

### Step 6: Test Security Features

**Test Rate Limiting:**
- Try logging in with wrong password 6 times
- You'll be blocked after 5 attempts

**Test Account Lockout:**
- After 5 failed attempts, account locks for 30 minutes
- Reset with: `UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE email = 'your@email.com';`

**Test Password Strength:**
- Try weak passwords during registration
- System enforces: 8+ chars, uppercase, lowercase, number, special char

---

## 🧪 Quick Test Scenarios

### Scenario 1: Happy Path (2 minutes)
1. Register school ✓
2. Activate school ✓
3. Login ✓
4. See dashboard ✓

### Scenario 2: Security Test (3 minutes)
1. Try wrong password 3 times ✓
2. See error messages ✓
3. Login with correct password ✓
4. Check audit logs in database ✓

### Scenario 3: Validation Test (2 minutes)
1. Try registering with weak password ✗
2. Try registering with invalid subdomain ✗
3. Try registering with duplicate email ✗
4. Register with valid data ✓

---

## 📊 Quick Database Checks

### Check if school was created:
```sql
SELECT id, name, subdomain, status FROM schools;
```

### Check if admin user was created:
```sql
SELECT id, email, name, role FROM users WHERE role = 'SCHOOL_ADMIN';
```

### Check audit logs:
```sql
SELECT action, success, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 10;
```

### Check active sessions:
```sql
SELECT user_id, ip_address, expires_at FROM sessions WHERE revoked = false;
```

---

## 🐛 Common Issues

**Issue: "Cannot connect to server"**
- Solution: Make sure backend is running on port 3000

**Issue: "School not found"**
- Solution: Activate the school with SQL update

**Issue: "Account is locked"**
- Solution: Reset with SQL: `UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE email = 'your@email.com';`

**Issue: "Rate limit exceeded"**
- Solution: Wait 15 minutes or clear: `DELETE FROM login_attempts WHERE email = 'your@email.com';`

---

## ✅ Success Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] School registered successfully
- [ ] School status set to ACTIVE
- [ ] Login successful
- [ ] Dashboard loads
- [ ] Audit logs created
- [ ] Session created

---

## 🎯 What to Test

### Must Test:
1. ✅ School registration with all validations
2. ✅ Login with correct credentials
3. ✅ Login with wrong credentials (see error)
4. ✅ Rate limiting (try 6 wrong passwords)
5. ✅ Password strength validation

### Nice to Test:
6. ✅ Remember me checkbox
7. ✅ Subdomain validation
8. ✅ Duplicate registration prevention
9. ✅ Multi-step vs direct login
10. ✅ Audit log entries

---

## 📝 Test Data

### Sample School Registration:
```
School Name: Test Secondary School
School Type: Secondary School
Email: admin@testschool.edu
Phone: +234 800 123 4567
Address: 123 Education Street
State: Lagos
LGA: Ikeja

Contact Person: John Doe
Role: Principal
Phone: +234 800 765 4321

Student Count: 500
Subdomain: testschool

Admin Name: Jane Admin
Admin Email: jane@testschool.edu
Password: SecurePass123!
```

### Sample Login:
```
Email: jane@testschool.edu
Password: SecurePass123!
Portal: testschool (for multi-step)
```

---

## 🔍 Where to Look

### Frontend Logs:
- Open browser console (F12)
- Check Network tab for API calls
- Check Console tab for errors

### Backend Logs:
- Terminal where `npm run start:dev` is running
- Look for error messages
- Check API request logs

### Database:
- Use Prisma Studio: `npx prisma studio`
- Or use your SQL client
- Check tables: schools, users, sessions, audit_logs

---

## 🎉 You're Ready!

If you can complete the 5 steps above, your authentication system is working!

For detailed testing, see `TEST_GUIDE.md`
For implementation details, see `IMPLEMENTATION_SUMMARY.md`
