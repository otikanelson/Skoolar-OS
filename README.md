# 🎓 Skoolar

**Modern School Management Platform for Nigerian Secondary Schools**

Skoolar is a comprehensive, multi-tenant SaaS platform that empowers educational institutions with powerful tools for student management, academic tracking, examination systems, and administrative workflows.

---

## ✨ Features

### 🏫 Multi-Tenant Architecture
- **Isolated School Portals** - Each school gets their own branded subdomain (e.g., `yourschool.skoolar.com`)
- **Custom Branding** - Schools can customize logos, colors, and themes
- **Secure Data Isolation** - Complete data separation between institutions

### 👥 User Management
- **Role-Based Access Control** - Manufacturer, School Admin, HOD, Teacher, Parent, Student roles
- **Secure Authentication** - JWT-based auth with refresh tokens
- **Account Security** - Password policies, account lockout, session management
- **Audit Logging** - Comprehensive activity tracking for compliance

### 📚 Academic Management
- **Student Records** - Complete student information and enrollment tracking
- **Class Management** - Organize students by class levels (JSS1-SSS3)
- **Subject Assignment** - Flexible subject allocation and teacher assignments
- **Result Processing** - CA scores, exam scores, grading, and report cards
- **Academic Calendar** - Term management and academic year tracking

### 📝 Examination System
- **Computer-Based Testing (CBT)** - Create and conduct online exams
- **Question Bank** - Multiple choice, true/false, and essay questions
- **Exam Monitoring** - Track violations and submission status
- **Automated Grading** - Instant results for objective questions

### 💼 Administrative Tools
- **School Registration** - Self-service onboarding with manufacturer approval
- **Subscription Management** - Flexible pricing plans (Essential, Professional, Enterprise)
- **Payment Tracking** - Monitor subscriptions and payment history
- **Dashboard Analytics** - Key metrics and insights

---

## 🚀 Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport.js
- **Security**: Bcrypt, Rate Limiting, CORS
- **Deployment**: Vercel Serverless Functions

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Hooks
- **Deployment**: Vercel

---

## 📦 Project Structure

```
skoolar/
├── skoolar-platform/
│   ├── backend/              # NestJS API
│   │   ├── api/             # Serverless function entry
│   │   ├── prisma/          # Database schema & migrations
│   │   ├── src/
│   │   │   ├── auth/        # Authentication module
│   │   │   ├── users/       # User management
│   │   │   └── prisma/      # Database service
│   │   └── package.json
│   │
│   └── frontend/            # React SPA
│       ├── src/
│       │   ├── pages/       # Route components
│       │   ├── components/  # Reusable UI components
│       │   ├── services/    # API client
│       │   ├── utils/       # Helper functions
│       │   └── hooks/       # Custom React hooks
│       └── package.json
│
├── .kiro/                   # Kiro AI specs
├── vercel.json             # Deployment config
└── README.md
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (or Neon serverless)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd skoolar
```

### 2. Backend Setup

```bash
cd skoolar-platform/backend
npm install
```

Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@host:5432/skoolar"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-token-secret"
NODE_ENV="development"
```

Run database migrations:
```bash
npx prisma migrate dev
npx prisma db seed
```

Start the backend:
```bash
npm run start:dev
```

Backend runs on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd skoolar-platform/frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Skoolar
```

Start the frontend:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Create Manufacturer Account

```bash
cd skoolar-platform/backend
node create-manufacturer.js "Admin Name" "admin@skoolar.com" "SecurePassword123!"
```

---

## 🔐 Default Credentials

After seeding the database, you can login with:

**Manufacturer Portal:**
- Email: `manufacturer@skoolar.com`
- Password: `Manufacturer@123`

**Test School Admin:**
- Portal: `fieldgreen`
- Email: `admin@fieldgreen.edu.ng`
- Password: `Admin@123`

---

## 📱 User Workflows

### School Registration Flow
1. School visits landing page
2. Fills registration form with school details
3. Creates admin account credentials
4. Waits for manufacturer approval
5. Receives approval email
6. Logs in and starts using the platform

### Manufacturer Approval Flow
1. Login to manufacturer dashboard
2. View pending school registrations
3. Review school details and documents
4. Approve or reject with reason
5. School receives notification

### Student Result Management
1. Teacher enters CA and exam scores
2. HOD reviews and approves results
3. School admin gives final approval
4. Results are published
5. Students/parents can view report cards

---

## 🎨 Design System

### Color Palette
- **Primary**: Navy Blue (#1e3a8a) - Trust, professionalism
- **Background**: Stone (#fafaf9) - Clean, minimal
- **Success**: Green - Approvals, positive actions
- **Error**: Red - Warnings, rejections
- **Warning**: Yellow - Pending states

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Readable, professional
- **Monospace**: Portal IDs, technical data

---

## 🔒 Security Features

- **Password Security**: Bcrypt hashing, strength validation, history tracking
- **Session Management**: JWT access tokens (15min) + refresh tokens (7 days)
- **Rate Limiting**: Login attempt throttling, API rate limits
- **Account Lockout**: Automatic lockout after failed attempts
- **Audit Logging**: All critical actions logged with IP and user agent
- **CORS Protection**: Configured allowed origins
- **Input Validation**: DTO validation with class-validator
- **SQL Injection Prevention**: Prisma ORM parameterized queries

---

## 📊 Database Schema

Key models:
- **School** - Multi-tenant school records
- **User** - All platform users with role-based access
- **Student** - Student profiles and enrollment
- **Teacher** - Staff records and assignments
- **Class** - Class organization (JSS1-SSS3)
- **Subject** - Subject catalog
- **Result** - Academic results and grades
- **Exam** - CBT examination system
- **Subscription** - Billing and plans
- **AuditLog** - Security and compliance tracking

---

## 🚢 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   - Import project to Vercel
   - Connect your Git repository

2. **Configure Environment Variables**

   Backend:
   ```
   DATABASE_URL=<your-neon-postgres-url>
   JWT_SECRET=<your-jwt-secret>
   JWT_REFRESH_SECRET=<your-refresh-secret>
   NODE_ENV=production
   ```

   Frontend:
   ```
   VITE_API_URL=<your-backend-url>
   VITE_APP_NAME=Skoolar
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Database Hosting
- **Recommended**: [Neon](https://neon.tech) - Serverless PostgreSQL
- **Alternative**: Railway, Supabase, or any PostgreSQL provider

---

## 📈 Roadmap

### Phase 1: Core Platform ✅
- [x] Multi-tenant architecture
- [x] User authentication & authorization
- [x] School registration workflow
- [x] Basic student management

### Phase 2: Academic Features ✅
- [x] Result management system
- [x] Grading and report cards
- [x] Class and subject management

### Phase 3: Examination System 🚧
- [x] CBT infrastructure
- [ ] Question bank management
- [ ] Exam scheduling
- [ ] Proctoring features

### Phase 4: Communication 📋
- [ ] Email notifications
- [ ] SMS integration
- [ ] Parent portal
- [ ] Announcement system

### Phase 5: Advanced Features 📋
- [ ] Mobile app (React Native)
- [ ] Attendance tracking
- [ ] Fee management
- [ ] Library management
- [ ] Timetable generation

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📞 Support

- **Email**: support@skoolar.com
- **Documentation**: [Coming Soon]
- **Issues**: GitHub Issues

---

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for Nigerian secondary schools
- Focused on security, scalability, and user experience

---

**Made with ❤️ for Nigerian Education**
