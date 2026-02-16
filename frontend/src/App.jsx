import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PortalConnect from './pages/PortalConnect';
import UserLogin from './pages/UserLogin';
import DirectLogin from './pages/DirectLogin';
import SchoolRegistration from './pages/SchoolRegistration';
import PendingVerification from './pages/PendingVerification';
import Pricing from './pages/Pricing';
import ContactSales from './pages/ContactSales';
import Features from './pages/Features';
import RequestDemo from './pages/RequestDemo';
import Support from './pages/Support';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Unauthorized from './pages/Unauthorized';
import ManufacturerLogin from './pages/ManufacturerLogin';
import ManufacturerDashboard from './pages/ManufacturerDashboard';
import SchoolRegistrations from './pages/SchoolRegistrations';
import PlanSelection from './pages/PlanSelection';
import AdminDashboard from './pages/AdminDashboard';
import StudentManagement from './pages/StudentManagement';
import ResultApproval from './pages/ResultApproval';
import TeacherLedger from './pages/TeacherLedger';
import ExamHall from './pages/ExamHall';
import ParentDashboard from './pages/ParentDashboard';
import ReportCard from './pages/ReportCard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PortalConnect />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/login/direct" element={<DirectLogin />} />
        <Route path="/register" element={<SchoolRegistration />} />
        <Route path="/pending-verification" element={<PendingVerification />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact-sales" element={<ContactSales />} />
        <Route path="/features" element={<Features />} />
        <Route path="/request-demo" element={<RequestDemo />} />
        <Route path="/support" element={<Support />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/manufacturer/login" element={<ManufacturerLogin />} />
        <Route path="/manufacturer/dashboard" element={
          <ProtectedRoute allowedRoles={['MANUFACTURER']}>
            <ManufacturerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/manufacturer/registrations" element={
          <ProtectedRoute allowedRoles={['MANUFACTURER']}>
            <SchoolRegistrations />
          </ProtectedRoute>
        } />

        <Route path="/plan-selection" element={<PlanSelection />} />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['SCHOOL_ADMIN', 'ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/students" element={
          <ProtectedRoute allowedRoles={['SCHOOL_ADMIN', 'ADMIN']}>
            <StudentManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/approvals" element={
          <ProtectedRoute allowedRoles={['SCHOOL_ADMIN', 'ADMIN', 'HOD']}>
            <ResultApproval />
          </ProtectedRoute>
        } />
        <Route path="/teacher" element={
          <ProtectedRoute allowedRoles={['TEACHER', 'HOD']}>
            <TeacherLedger />
          </ProtectedRoute>
        } />
        <Route path="/exam" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <ExamHall />
          </ProtectedRoute>
        } />
        <Route path="/parent" element={
          <ProtectedRoute allowedRoles={['PARENT']}>
            <ParentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/report-card" element={
          <ProtectedRoute allowedRoles={['PARENT', 'STUDENT']}>
            <ReportCard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
