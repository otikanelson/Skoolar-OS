# EduCore OS - Multi-Tenant SaaS Implementation Plan

## Table of Contents
1. [Overview](#overview)
2. [Business Model](#business-model)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Subscription Plans](#subscription-plans)
5. [School Onboarding Flow](#school-onboarding-flow)
6. [Technical Architecture](#technical-architecture)
7. [Implementation Phases](#implementation-phases)
8. [Database Schema Updates](#database-schema-updates)
9. [API Endpoints](#api-endpoints)
10. [Frontend Pages](#frontend-pages)

---

## 1. Overview

EduCore OS is a **multi-tenant SaaS platform** that provides school management systems to educational institutions. Each school gets their own isolated portal with customizable branding while sharing the same backend infrastructure.

### Key Concepts:
- **Manufacturer (You)**: Platform owner who manages all schools
- **School**: Educational institution that subscribes to the platform
- **School Admin**: Primary user from the school who manages their portal
- **End Users**: Teachers, students, parents within each school

---

## 2. Business Model

### Revenue Streams:
1. **Subscription Fees**: Monthly/annual recurring revenue per school
2. **Setup Fees**: One-time fee for custom website/branding
3. **Premium Features**: Add-ons like SMS notifications, custom reports
4. **Student-Based Pricing**: Tiered pricing based on student count

### Value Proposition:
- **For Schools**: Affordable, ready-to-use school management system
- **For You**: Scalable SaaS business with recurring revenue
- **For End Users**: Modern, easy-to-use educational platform

---

## 3. User Roles & Permissions

### Role Hierarchy:

```
MANUFACTURER (You)
├── Platform-wide access
├── Manage all schools
├── Approve registrations
├── View analytics
└── System configuration

SCHOOL_ADMIN (School Principal/IT Head)
├── School-level access only
├── Manage school users
├── Configure school settings
├── View school reports
└── Cannot access other schools

ADMIN (School Administrator)
├── Approve results
├── Manage academic calendar
├── View all reports
└── Limited user management

HOD (Head of Department)
├── Approve department results
├── View department reports
└── Manage department teachers

TEACHER
├── Enter scores
├── View assigned classes
└── Submit results

PARENT
├── View children's results
├── View attendance
└── Receive notifications

STUDENT
├── Take exams
├── View results
└── View timetable
```

### Permission Matrix:

| Feature | MANUFACTURER | SCHOOL_ADMIN | ADMIN | HOD | TEACHER | PARENT | STUDENT |
|---------|--------------|--------------|-------|-----|---------|--------|---------|
| Manage Schools | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approve School Registration | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View All Schools Analytics | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create School Users | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage School Settings | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve Results | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Enter Scores | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Own School Data | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 4. Subscription Plans

### **Revenue Target**: ₦1.2 Billion/year
**Strategy**: Per-student pricing model (like Microsoft 365 Education)

---

### **Pricing Model: Pay-Per-Student**

**Base Rate**: ₦8,000 per student/year (₦667/student/month)

#### **How It Works:**
- School pays based on **active student count**
- Minimum: 50 students (₦400,000/year)
- No maximum limit
- Quarterly billing recommended
- Annual payment gets 15% discount

#### **Pricing Examples:**

| Students | Monthly | Quarterly | Annual | Annual (15% off) |
|----------|---------|-----------|--------|------------------|
| 50       | ₦33,350 | ₦100,000  | ₦400,000 | ₦340,000 |
| 100      | ₦66,700 | ₦200,000  | ₦800,000 | ₦680,000 |
| 200      | ₦133,400| ₦400,000  | ₦1,600,000 | ₦1,360,000 |
| 300      | ₦200,000| ₦600,000  | ₦2,400,000 | ₦2,040,000 |
| 500      | ₦333,500| ₦1,000,000| ₦4,000,000 | ₦3,400,000 |
| 1000     | ₦667,000| ₦2,000,000| ₦8,000,000 | ₦6,800,000 |

---

### **Tiered Plans (Feature-Based)**

All plans include per-student pricing, but differ in features:

#### **Essential Plan** - ₦8,000/student/year
**Target**: Small private schools (50-150 students)

**Core Features**:
- ✅ Student & teacher management
- ✅ Result processing & report cards
- ✅ Attendance tracking
- ✅ Parent portal access
- ✅ Basic analytics dashboard
- ✅ Email notifications
- ✅ Mobile-responsive interface
- ✅ Subdomain (e.g., `schoolname.educore.ng`)
- ✅ 2GB cloud storage
- ✅ Email support (48hr response)

**Limitations**:
- ❌ No CBT exams
- ❌ No SMS notifications
- ❌ No custom branding
- ❌ No API access

**Minimum**: ₦400,000/year (50 students)

---

#### **Professional Plan** - ₦10,000/student/year
**Target**: Medium private schools (150-400 students)

**Everything in Essential +**:
- ✅ CBT examination system
- ✅ Question bank (1,000 questions)
- ✅ Automated grading
- ✅ SMS notifications (500 SMS/month included)
- ✅ Advanced analytics & reports
- ✅ Fee management system
- ✅ Timetable management
- ✅ Custom subdomain or domain mapping
- ✅ 10GB cloud storage
- ✅ Priority email support (24hr response)
- ✅ Phone support (business hours)

**Minimum**: ₦1,500,000/year (150 students)

---

#### **Enterprise Plan** - ₦12,000/student/year
**Target**: Large private schools (400+ students)

**Everything in Professional +**:
- ✅ Custom school website (5 templates)
- ✅ White-label branding (logo, colors, domain)
- ✅ Unlimited question bank
- ✅ SMS notifications (2,000 SMS/month included)
- ✅ Library management system
- ✅ Inventory management
- ✅ Multi-campus support (up to 3 campuses)
- ✅ API access for integrations
- ✅ Custom reports builder
- ✅ 50GB cloud storage
- ✅ Dedicated account manager
- ✅ 24/7 phone support
- ✅ On-site training (1 session/year)
- ✅ 99.9% uptime SLA

**Minimum**: ₦4,800,000/year (400 students)

---

#### **Premium Plan** - Custom Pricing
**Target**: Elite schools, multi-campus institutions, school chains

**Everything in Enterprise +**:
- ✅ Fully custom website design
- ✅ Unlimited campuses
- ✅ Unlimited SMS
- ✅ Custom feature development
- ✅ On-premise deployment option
- ✅ Dedicated server resources
- ✅ White-glove onboarding
- ✅ Quarterly business reviews
- ✅ Priority feature requests
- ✅ 99.99% uptime SLA
- ✅ Unlimited storage

**Minimum**: ₦10,000,000/year (negotiable)

---

### **Volume Discounts (Automatic)**

Encourage larger schools with tiered discounts:

| Student Count | Discount | Effective Rate |
|---------------|----------|----------------|
| 50-199        | 0%       | ₦8,000/student |
| 200-399       | 5%       | ₦7,600/student |
| 400-599       | 10%      | ₦7,200/student |
| 600-999       | 15%      | ₦6,800/student |
| 1000+         | 20%      | ₦6,400/student |

**Example**: 
- School with 500 students on Professional Plan
- Base: ₦10,000 × 500 = ₦5,000,000
- Discount (10%): -₦500,000
- **Final**: ₦4,500,000/year

---

### **Add-Ons & Extras**

#### **SMS Bundles** (All plans)
- 1,000 SMS: ₦15,000
- 5,000 SMS: ₦60,000 (₦12/SMS)
- 10,000 SMS: ₦100,000 (₦10/SMS)

#### **Storage Upgrades**
- +10GB: ₦50,000/year
- +50GB: ₦200,000/year
- +100GB: ₦350,000/year

#### **Professional Services**
- Data migration: ₦150,000 one-time
- Custom training: ₦100,000/session
- Custom report development: ₦200,000 each
- Website redesign: ₦500,000 one-time
- Integration development: ₦300,000+ (depends on complexity)

#### **Additional Campuses** (Enterprise+)
- 4th campus: +₦500,000/year
- 5th+ campus: +₦400,000/year each

---

### **Payment Terms**

#### **Annual Payment** (Recommended)
- 15% discount
- Pay once, use for 12 months
- Free setup & onboarding
- 1 month free trial

#### **Quarterly Payment**
- 5% discount
- Pay every 3 months
- Setup fee: ₦50,000
- 2 weeks free trial

#### **Monthly Payment**
- No discount
- Pay monthly
- Setup fee: ₦100,000
- 1 week free trial

---

### **Setup Fees**

| Plan | Annual | Quarterly | Monthly |
|------|--------|-----------|---------|
| Essential | FREE | ₦50,000 | ₦100,000 |
| Professional | FREE | ₦75,000 | ₦150,000 |
| Enterprise | FREE | ₦100,000 | ₦200,000 |
| Premium | FREE | FREE | FREE |

---

### **Revenue Projections**

#### **Year 1 Target: ₦1.2B**

**Conservative Scenario** (500 schools):
- 300 schools × 150 students × ₦8,000 = ₦360M
- 150 schools × 300 students × ₦10,000 = ₦450M
- 50 schools × 500 students × ₦12,000 = ₦300M
- **Total**: ₦1.11B ✅

**Aggressive Scenario** (400 schools):
- 200 schools × 200 students × ₦8,000 = ₦320M
- 150 schools × 350 students × ₦10,000 = ₦525M
- 50 schools × 600 students × ₦12,000 = ₦360M
- **Total**: ₦1.205B ✅

**Required**: 400-500 schools in Year 1

---

### **Competitive Positioning**

#### **vs. Manual Systems** (Paper-based)
- Schools spend ₦500K-₦2M/year on:
  - Stationery & printing
  - Manual data entry staff
  - Result processing errors
  - Lost records
- **EduCore ROI**: 2-3x cost savings + efficiency

#### **vs. Competitors** (Other school software)
- Most charge ₦1M-₦3M flat fee (regardless of size)
- **EduCore advantage**: Pay only for what you use
- Small schools save money
- Large schools get volume discounts

#### **Value Proposition**:
- "Pay per student, not per school"
- "Start small, scale as you grow"
- "No hidden fees, transparent pricing"

---

### **Sales Strategy**

#### **Target Market Segmentation**:

**Tier 1: Premium Private Schools** (50 schools)
- 400-1000 students
- High fees (₦500K-₦2M/term)
- Tech-savvy
- Target: Enterprise/Premium plans
- Revenue: ₦300M-₦500M

**Tier 2: Mid-Range Private Schools** (200 schools)
- 200-400 students
- Medium fees (₦200K-₦500K/term)
- Growing schools
- Target: Professional plan
- Revenue: ₦400M-₦600M

**Tier 3: Budget Private Schools** (250 schools)
- 50-200 students
- Lower fees (₦50K-₦200K/term)
- Cost-conscious
- Target: Essential plan
- Revenue: ₦200M-₦300M

**Total**: 500 schools = ₦1.2B/year ✅

---

## 5. School Onboarding Flow

### Step 1: School Discovery & Registration
**Duration**: 5-10 minutes

1. School visits `educore.ng` (main website)
2. Clicks "Get Started" or "Sign Up"
3. Fills registration form:
   - School name
   - School type (Primary/Secondary/Tertiary)
   - School email (official)
   - School phone
   - School address (state, LGA, full address)
   - Contact person name
   - Contact person role (Principal/IT Head/Admin)
   - Contact person phone
   - Estimated student count
   - Preferred subdomain (e.g., `fieldgreen`)
   - How did you hear about us?
4. Uploads verification documents:
   - School registration certificate (CAC/Ministry of Education)
   - Valid ID of contact person
   - Proof of address (utility bill/bank statement)
5. Agrees to Terms of Service
6. Submits registration

**Status**: `PENDING_VERIFICATION`

### Step 2: Manufacturer Verification
**Duration**: 1-3 business days

**Manufacturer Dashboard Actions**:
1. Review school registration
2. Verify documents:
   - Check CAC registration number
   - Verify school exists (Google Maps, website, social media)
   - Confirm contact person identity
   - Check for duplicate registrations
3. Decision:
   - **Approve**: Move to Step 3
   - **Reject**: Send rejection email with reason
   - **Request More Info**: Email school for clarification

**Status**: `VERIFIED` or `REJECTED`

### Step 3: Plan Selection & Payment
**Duration**: 5-10 minutes

1. School receives approval email with login link
2. School logs in with temporary credentials
3. Views pricing page with plan comparison
4. Selects subscription plan
5. Reviews order summary
6. Enters payment details:
   - Card number
   - Expiry date
   - CVV
   - Billing address
7. **Payment simulation** (for now):
   - Show loading spinner
   - Simulate 3-second processing
   - Show success message
8. Payment confirmed

**Status**: `PAYMENT_COMPLETED`

### Step 4: Portal Configuration
**Duration**: 10-15 minutes

School chooses portal setup option:

#### **Option A: Subdomain Only** (Fastest)
- School uses `schoolname.educore.ng`
- Instant activation
- Basic branding (logo, colors)
- **Status**: `ACTIVE`

#### **Option B: Custom Website + Portal**
- School provides:
  - Existing website URL (if any)
  - School logo (high-res)
  - Brand colors (primary, secondary)
  - School motto/vision
  - 3-5 photos of school
  - Social media links
- **OR** School uses website builder:
  - Choose template (5-10 options)
  - Customize sections (About, Gallery, Contact)
  - Preview before publishing
- Manufacturer reviews and builds (2-5 days)
- **Status**: `WEBSITE_IN_PROGRESS` → `ACTIVE`

#### **Option C: Custom Domain**
- School provides domain (e.g., `portal.fieldgreenschool.com`)
- Manufacturer provides DNS records
- School updates DNS settings
- SSL certificate auto-generated
- **Status**: `DNS_PENDING` → `ACTIVE`

### Step 5: School Admin Setup
**Duration**: 30-60 minutes

1. School receives welcome email with:
   - Portal URL
   - Admin username
   - Temporary password
   - Quick start guide
2. School admin logs in
3. **Onboarding wizard**:
   - Change password
   - Complete school profile
   - Upload school logo
   - Set academic year
   - Configure grading system
   - Add first users (teachers/students)
4. Dashboard tour
5. Access to help documentation

**Status**: `ONBOARDED`

### Step 6: Daily Operations
School is now fully operational!

---

## 6. Technical Architecture

### Multi-Tenancy Strategy: **Shared Database with Tenant Isolation**

#### Why This Approach?
- **Cost-effective**: Single database for all schools
- **Easy maintenance**: One codebase, one database
- **Scalable**: Can handle 100+ schools easily
- **Data isolation**: Each school's data is completely separate

#### How It Works:
1. Every table has a `schoolId` column
2. All queries automatically filter by `schoolId`
3. Middleware ensures users can only access their school's data
4. Manufacturer can access all schools

#### Example:
```sql
-- Teacher can only see students from their school
SELECT * FROM students WHERE schoolId = 'school-123';

-- Manufacturer can see all students
SELECT * FROM students; -- No filter
```

### Domain/Subdomain Routing:

#### Subdomain Approach:
```
fieldgreen.educore.ng → School ID: fieldgreen
stmarys.educore.ng → School ID: stmarys
```

#### Custom Domain Approach:
```
portal.fieldgreenschool.com → School ID: fieldgreen (via DNS mapping)
```

#### Implementation:
- Frontend checks subdomain/domain on load
- Extracts school identifier
- Passes to backend with every request
- Backend validates and filters data

---

## 7. Implementation Phases

### **Phase 1: Foundation & Cleanup** (Week 1)
**Goal**: Remove demo mode, set up multi-tenancy

#### Tasks:
1. **Remove Demo Mode**:
   - Delete `DEMO_MODE` flag
   - Remove `DEMO_USERS` object
   - Remove demo login function
   - Clean up all demo-related code

2. **Update Database Schema**:
   - Add `School` table
   - Add `schoolId` to all relevant tables
   - Add `MANUFACTURER` role
   - Create migration

3. **Create Manufacturer Account**:
   - Seed script for your account
   - Email: `manufacturer@educore.ng`
   - Full platform access

4. **Update Authentication**:
   - Add school context to JWT
   - Middleware for tenant isolation
   - Role-based access control

**Deliverables**:
- Clean codebase (no demo mode)
- Multi-tenant database
- Manufacturer account created
- Authentication working

---

### **Phase 2: Manufacturer Dashboard** (Week 2)
**Goal**: Build platform admin interface

#### Pages:
1. **Manufacturer Login** (`/manufacturer/login`)
   - Separate login page
   - Different styling (platform branding)

2. **Manufacturer Dashboard** (`/manufacturer/dashboard`)
   - Total schools (active/pending/suspended)
   - Total revenue (MRR, ARR)
   - Recent registrations
   - System health metrics
   - Quick actions

3. **Schools Management** (`/manufacturer/schools`)
   - List all schools (table)
   - Search and filter
   - View school details
   - Approve/reject registrations
   - Suspend/activate schools
   - View school analytics

4. **School Details** (`/manufacturer/schools/:id`)
   - School information
   - Subscription details
   - Usage statistics
   - User count
   - Activity logs
   - Actions (suspend, delete, edit)

5. **Registrations** (`/manufacturer/registrations`)
   - Pending registrations
   - Review documents
   - Approve/reject workflow
   - Request more information

6. **Analytics** (`/manufacturer/analytics`)
   - Revenue charts
   - Growth metrics
   - Churn rate
   - Popular plans
   - Geographic distribution

7. **Bug Reports** (`/manufacturer/bugs`)
   - User-submitted bugs
   - Priority levels
   - Status tracking
   - Assign to developer

8. **Partnerships** (`/manufacturer/partnerships`)
   - Partner schools
   - Referral tracking
   - Commission management

9. **Settings** (`/manufacturer/settings`)
   - Platform configuration
   - Email templates
   - Pricing management
   - Feature flags

**Deliverables**:
- Complete manufacturer dashboard
- School management interface
- Analytics and reporting

---

### **Phase 3: School Registration Flow** (Week 3)
**Goal**: Public-facing school signup

#### Pages:
1. **Landing Page** (`/`) - Update existing
   - Hero section
   - Features showcase
   - Pricing preview
   - Testimonials
   - CTA: "Get Started"

2. **Registration Form** (`/register`)
   - Multi-step form (4 steps):
     - Step 1: School Information
     - Step 2: Contact Person
     - Step 3: Verification Documents
     - Step 4: Review & Submit
   - Progress indicator
   - Form validation
   - File upload

3. **Registration Success** (`/register/success`)
   - Confirmation message
   - What happens next
   - Expected timeline
   - Contact information

4. **Registration Status** (`/register/status/:token`)
   - Check application status
   - View feedback
   - Upload additional documents

**Backend**:
- School registration API
- Document upload (AWS S3 or Cloudinary)
- Email notifications (SendGrid)
- Status tracking

**Deliverables**:
- Complete registration flow
- Document upload working
- Email notifications
- Status tracking

---

### **Phase 4: Payment Integration** (Week 4)
**Goal**: Subscription and payment handling

#### Pages:
1. **Pricing Page** (`/pricing`) - Update existing
   - Plan comparison table
   - Feature breakdown
   - FAQ section
   - CTA: "Choose Plan"

2. **Checkout** (`/checkout`)
   - Plan summary
   - Payment form (simulated)
   - Order review
   - Terms acceptance

3. **Payment Success** (`/checkout/success`)
   - Payment confirmation
   - Receipt/invoice
   - Next steps
   - Portal access link

4. **Payment Failed** (`/checkout/failed`)
   - Error message
   - Retry option
   - Contact support

**Backend**:
- Subscription management
- Payment simulation
- Invoice generation
- Webhook handling (for future real payments)

**Deliverables**:
- Pricing page
- Checkout flow
- Payment simulation
- Subscription tracking

---

### **Phase 5: Portal Configuration** (Week 5)
**Goal**: School portal setup and customization

#### Pages:
1. **Portal Setup Wizard** (`/setup`)
   - Welcome screen
   - Choose setup option
   - Configuration steps
   - Completion confirmation

2. **Subdomain Setup** (`/setup/subdomain`)
   - Check availability
   - Instant activation
   - Basic branding

3. **Website Builder** (`/setup/website`)
   - Template selection
   - Drag-and-drop editor (simple)
   - Preview
   - Publish

4. **Custom Domain Setup** (`/setup/domain`)
   - Domain input
   - DNS instructions
   - Verification
   - SSL setup

5. **Branding Configuration** (`/setup/branding`)
   - Logo upload
   - Color picker
   - Font selection
   - Preview

**Backend**:
- Subdomain management
- DNS configuration
- SSL certificate generation
- Website template engine

**Deliverables**:
- Portal setup wizard
- Subdomain activation
- Basic website builder
- Custom domain support

---

### **Phase 6: School Admin Portal** (Week 6)
**Goal**: School-level administration

#### Pages:
1. **School Admin Dashboard** (`/school-admin/dashboard`)
   - School overview
   - User statistics
   - Recent activity
   - Quick actions

2. **User Management** (`/school-admin/users`)
   - Create users (bulk & single)
   - Import from CSV
   - Assign roles
   - Manage permissions
   - Deactivate users

3. **School Settings** (`/school-admin/settings`)
   - School profile
   - Academic calendar
   - Grading system
   - Subscription details
   - Billing history

4. **Reports** (`/school-admin/reports`)
   - User activity
   - System usage
   - Export data

**Backend**:
- User creation API
- Bulk import
- School settings management
- Tenant-isolated queries

**Deliverables**:
- School admin dashboard
- User management system
- School configuration
- Reporting

---

### **Phase 7: Email & Notifications** (Week 7)
**Goal**: Automated communication

#### Email Templates:
1. **School Registration**:
   - Registration received
   - Verification in progress
   - Approved/rejected
   - Payment reminder

2. **School Admin**:
   - Welcome email
   - Password reset
   - Subscription expiring
   - Subscription renewed

3. **Manufacturer**:
   - New registration alert
   - Payment received
   - Bug report submitted

#### Implementation:
- SendGrid integration
- Email template system
- Queue system (Bull/Redis)
- Email logs

**Deliverables**:
- SendGrid setup
- Email templates
- Automated notifications
- Email tracking

---

### **Phase 8: Testing & Polish** (Week 8)
**Goal**: End-to-end testing and refinement

#### Tasks:
1. **Complete Flow Test**:
   - Register real school
   - Verify and approve
   - Complete payment
   - Set up portal
   - Create users
   - Test login

2. **Bug Fixes**:
   - Fix any issues found
   - Improve UX
   - Performance optimization

3. **Documentation**:
   - User guides
   - API documentation
   - Deployment guide

**Deliverables**:
- Fully tested system
- Bug-free experience
- Complete documentation

---

## 8. Database Schema Updates

### New Tables:

#### **schools**
```sql
id: String (PK)
name: String
type: Enum (PRIMARY, SECONDARY, TERTIARY)
email: String (unique)
phone: String
address: String
state: String
lga: String
contactPersonName: String
contactPersonRole: String
contactPersonPhone: String
estimatedStudentCount: Int
subdomain: String (unique)
customDomain: String?
logoUrl: String?
primaryColor: String?
secondaryColor: String?
status: Enum (PENDING_VERIFICATION, VERIFIED, PAYMENT_COMPLETED, ACTIVE, SUSPENDED, CANCELLED)
subscriptionPlan: Enum (STARTER, PROFESSIONAL, ENTERPRISE, PREMIUM)
subscriptionStatus: Enum (TRIAL, ACTIVE, EXPIRED, CANCELLED)
subscriptionStartDate: DateTime?
subscriptionEndDate: DateTime?
paymentMethod: String?
billingEmail: String?
verificationDocuments: JSON
rejectionReason: String?
websiteUrl: String?
motto: String?
vision: String?
createdAt: DateTime
updatedAt: DateTime
```

#### **subscriptions**
```sql
id: String (PK)
schoolId: String (FK)
plan: Enum
amount: Float
currency: String
interval: Enum (MONTHLY, ANNUAL)
status: Enum
startDate: DateTime
endDate: DateTime
autoRenew: Boolean
createdAt: DateTime
updatedAt: DateTime
```

#### **payments**
```sql
id: String (PK)
schoolId: String (FK)
subscriptionId: String (FK)
amount: Float
currency: String
paymentMethod: String
transactionId: String
status: Enum (PENDING, COMPLETED, FAILED, REFUNDED)
paidAt: DateTime?
createdAt: DateTime
```

#### **bug_reports**
```sql
id: String (PK)
schoolId: String (FK)?
userId: String (FK)?
title: String
description: String
priority: Enum (LOW, MEDIUM, HIGH, CRITICAL)
status: Enum (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
attachments: JSON
assignedTo: String?
createdAt: DateTime
updatedAt: DateTime
```

#### **partnerships**
```sql
id: String (PK)
schoolId: String (FK)
partnerType: Enum (REFERRAL, RESELLER, AFFILIATE)
commissionRate: Float
totalReferrals: Int
totalEarnings: Float
status: Enum (ACTIVE, INACTIVE)
createdAt: DateTime
updatedAt: DateTime
```

### Updated Tables:

Add `schoolId` to:
- users
- teachers
- students
- parents
- classes
- subjects
- results
- exams
- (all existing tables)

### New Enum:

```typescript
enum UserRole {
  MANUFACTURER      // You - platform owner
  SCHOOL_ADMIN      // School's primary admin
  ADMIN             // School's secondary admin
  HOD               // Head of Department
  TEACHER
  PARENT
  STUDENT
}
```

---

## 9. API Endpoints

### Manufacturer Endpoints:

```
POST   /api/manufacturer/login
GET    /api/manufacturer/dashboard/stats
GET    /api/manufacturer/schools
GET    /api/manufacturer/schools/:id
PUT    /api/manufacturer/schools/:id/approve
PUT    /api/manufacturer/schools/:id/reject
PUT    /api/manufacturer/schools/:id/suspend
DELETE /api/manufacturer/schools/:id
GET    /api/manufacturer/registrations
GET    /api/manufacturer/analytics
GET    /api/manufacturer/bugs
POST   /api/manufacturer/bugs/:id/assign
GET    /api/manufacturer/partnerships
```

### School Registration Endpoints:

```
POST   /api/register/school
POST   /api/register/upload-document
GET    /api/register/status/:token
GET    /api/register/check-subdomain/:subdomain
```

### Payment Endpoints:

```
GET    /api/pricing/plans
POST   /api/checkout/create-order
POST   /api/checkout/process-payment
GET    /api/checkout/invoice/:id
```

### School Admin Endpoints:

```
POST   /api/school-admin/login
GET    /api/school-admin/dashboard
POST   /api/school-admin/users
POST   /api/school-admin/users/bulk-import
PUT    /api/school-admin/users/:id
DELETE /api/school-admin/users/:id
GET    /api/school-admin/settings
PUT    /api/school-admin/settings
```

---

## 10. Frontend Pages

### Public Pages:
- `/` - Landing page
- `/pricing` - Pricing plans
- `/register` - School registration
- `/register/success` - Registration confirmation
- `/register/status/:token` - Check status
- `/login` - Portal connection (existing)
- `/login/user` - User login (existing)
- `/login/direct` - Direct login (existing)

### Manufacturer Pages:
- `/manufacturer/login` - Manufacturer login
- `/manufacturer/dashboard` - Main dashboard
- `/manufacturer/schools` - Schools list
- `/manufacturer/schools/:id` - School details
- `/manufacturer/registrations` - Pending registrations
- `/manufacturer/analytics` - Platform analytics
- `/manufacturer/bugs` - Bug reports
- `/manufacturer/partnerships` - Partnerships
- `/manufacturer/settings` - Platform settings

### School Admin Pages:
- `/school-admin/dashboard` - School dashboard
- `/school-admin/users` - User management
- `/school-admin/users/create` - Create user
- `/school-admin/users/import` - Bulk import
- `/school-admin/settings` - School settings
- `/school-admin/reports` - Reports

### Setup Pages:
- `/setup` - Setup wizard
- `/setup/subdomain` - Subdomain setup
- `/setup/website` - Website builder
- `/setup/domain` - Custom domain
- `/setup/branding` - Branding config

### Checkout Pages:
- `/checkout` - Payment checkout
- `/checkout/success` - Payment success
- `/checkout/failed` - Payment failed

---

## Summary

This plan transforms EduCore OS from a single-school system into a **multi-tenant SaaS platform** where:

1. **You (Manufacturer)** manage multiple schools from a central dashboard
2. **Schools** register, subscribe, and get their own branded portal
3. **School Admins** manage their users and settings independently
4. **End Users** use the portal for daily school operations

**Total Timeline**: 8 weeks for full implementation

**Next Steps**:
1. Review and approve this plan
2. Discuss subscription pricing
3. Start Phase 1 implementation

---

**Questions? Feedback? Let's discuss before we start building!** 🚀
