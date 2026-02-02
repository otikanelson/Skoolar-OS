import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public pages
import LandingPage from './pages/LandingPage';
import PortalConnect from './pages/PortalConnect';
import UserLogin from './pages/UserLogin';
import DirectLogin from './pages/DirectLogin';
import Pricing from './pages/Pricing';
import ContactSales from './pages/ContactSales';
import Unauthorized from './pages/Unauthorized';

// Protected pages
import AdminDashboard from './pages/AdminDashboard';
import StudentManagement from './pages/StudentManagement';
import ResultApproval from './pages/ResultApproval';
import TeacherLedger from './pages/TeacherLedger';
import ExamHall from './pages/ExamHall';
import ParentDashboard from './pages/ParentDashboard';
import ReportCard from './pages/ReportCard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PortalConnect />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/login/direct" element={<DirectLogin />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact-sales" element={<ContactSales />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Dashboard Routes - No Protection for Demo */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<StudentManagement />} />
        <Route path="/admin/approvals" element={<ResultApproval />} />
        <Route path="/teacher" element={<TeacherLedger />} />
        <Route path="/exam" element={<ExamHall />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/report-card" element={<ReportCard />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
