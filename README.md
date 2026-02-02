# EduCore OS - Academic Management Platform

A multi-tenant SaaS platform for Nigerian secondary schools that unifies academic management and computer-based testing (CBT) in a single system.

## 🎯 Features

- **Multi-Tenant Architecture**: Each school gets a dedicated portal (schoolname.educore.ng)
- **Student Records Management**: Digital profiles, class assignments, academic history
- **Continuous Assessment & Results**: Score entry, approval workflows, automated report cards
- **Computer-Based Examinations**: Question banks, timed sessions, auto-marking
- **Parent Portal**: Mobile-friendly access to results and academic progress
- **Role-Based Access**: Admin, Teacher, HOD, Parent, Student portals

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **Deployment**: Vercel

### Backend
- **Framework**: NestJS (Node.js)
- **Authentication**: JWT + Passport
- **Password Security**: bcrypt
- **Validation**: class-validator
- **Database**: PostgreSQL (planned)
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

#### Frontend
```bash
cd educore-os/frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

#### Backend
```bash
cd educore-os/backend
npm install
npm run start:dev
```
Backend runs on: http://localhost:3000

## 🔐 Demo Accounts

All demo users have password: `password123`

| Email | Role | Access |
|-------|------|--------|
| admin@fieldgreen.edu | Admin | Full system access |
| teacher@fieldgreen.edu | Teacher | Score entry, class management |
| parent@fieldgreen.edu | Parent | View results, download reports |
| student@fieldgreen.edu | Student | Take exams, view results |

## 📱 Login Flow

### Option 1: Portal-First (Recommended)
1. Enter school portal ID (e.g., "fieldgreen")
2. Connect to school network
3. Sign in with email and password

### Option 2: Direct Login
1. Enter full institutional email
2. System auto-detects portal
3. Single-step authentication

## 🎨 Design Philosophy

- **Institutional Aesthetic**: Professional, banking-software style
- **Color Scheme**: Dark blue (#1e3a8a) and white
- **Typography**: Clean, structured, serious
- **Animations**: Subtle fade-in and slide-in effects
- **No Flashy Elements**: No gradients, emojis, or playful UI

## 📂 Project Structure

```
educore-os/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── PortalConnect.jsx
│   │   │   ├── UserLogin.jsx
│   │   │   ├── DirectLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── StudentManagement.jsx
│   │   │   ├── TeacherLedger.jsx
│   │   │   ├── ExamHall.jsx
│   │   │   ├── ParentDashboard.jsx
│   │   │   ├── ReportCard.jsx
│   │   │   ├── ResultApproval.jsx
│   │   │   └── Pricing.jsx
│   │   ├── styles/
│   │   │   └── colors.js
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
└── README.md
```

## 🌐 Deployment

See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy
```bash
# Make script executable
chmod +x deploy.sh

# Run deployment script
./deploy.sh
```

## 🔧 Environment Variables

### Frontend
```env
VITE_API_URL=https://your-backend-url.vercel.app/api
VITE_APP_NAME=EduCore OS
```

### Backend
```env
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=3000
```

## 📊 MVP Scope

### Core Modules
1. **Student Records Management**
   - Digital profiles
   - Class/arm assignment
   - Subject enrollment
   - Search and filtering

2. **Continuous Assessment & Results**
   - Excel-like score entry
   - Three-stage approval workflow
   - Automated computation
   - PDF report cards
   - Parent notifications

3. **CBT Examination System**
   - Question bank creation
   - Exam scheduling
   - Timed interface
   - Auto-marking
   - Score integration

## 🎯 Target Market

- 56,000+ secondary schools in Nigeria
- Focus on private schools initially
- Schools with existing IT infrastructure
- Looking for unified academic management

## 💰 Pricing Model

- **Basic**: ₦200/student/month - Records + Results
- **Standard**: ₦300/student/month - Basic + CBT
- **Premium**: ₦400/student/month - Standard + Analytics
- **Setup Fee**: ₦200,000 - ₦400,000 (one-time)

## 🛣️ Roadmap

### Phase 1 (MVP - Current)
- ✅ Multi-tenant architecture
- ✅ Authentication system
- ✅ Student records
- ✅ Result processing
- ✅ CBT system
- ✅ Parent portal

### Phase 2 (Next)
- [ ] PostgreSQL integration
- [ ] Advanced analytics
- [ ] Attendance tracking
- [ ] Fee management
- [ ] SMS/Email notifications
- [ ] Mobile apps

### Phase 3 (Future)
- [ ] Library management
- [ ] Hostel management
- [ ] Timetable generation
- [ ] Staff payroll
- [ ] Alumni portal

## 🤝 Contributing

This is a private project. For access or collaboration inquiries, contact the development team.

## 📄 License

Proprietary - All rights reserved

## 📞 Support

For support, email: support@educore.ng

## 🙏 Acknowledgments

- Built for Nigerian secondary schools
- Designed with institutional professionalism
- Focused on real school workflows

---

**EduCore OS** - Academic Management Made Simple
