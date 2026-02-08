import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PortalConnect from './pages/PortalConnect';
import UserLogin from './pages/UserLogin';
import DirectLogin from './pages/DirectLogin';
import SchoolRegistration from './pages/SchoolRegistration';
import Pricing from './pages/Pricing';
import ContactSales from './pages/ContactSales';
import Unauthorized from './pages/Unauthorized';
import ManufacturerLogin from './pages/ManufacturerLogin';
import ManufacturerDashboard from './pages/ManufacturerDashboard';
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PortalConnect />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/login/direct" element={<DirectLogin />} />
        <Route path="/register" element={<SchoolRegistration />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact-sales" element={<ContactSales />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/manufacturer/login" element={<ManufacturerLogin />} />
        <Route path="/manufacturer/dashboard" element={<ManufacturerDashboard />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<StudentManagement />} />
        <Route path="/admin/approvals" element={<ResultApproval />} />
        <Route path="/teacher" element={<TeacherLedger />} />
        <Route path="/exam" element={<ExamHall />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/report-card" element={<ReportCard />} />

        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
