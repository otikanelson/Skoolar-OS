import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PortalConnect from './pages/PortalConnect';
import UserLogin from './pages/UserLogin';
import DirectLogin from './pages/DirectLogin';
import Pricing from './pages/Pricing';
import AdminDashboard from './pages/AdminDashboard';
import StudentManagement from './pages/StudentManagement';
import TeacherLedger from './pages/TeacherLedger';
import ExamHall from './pages/ExamHall';
import ParentDashboard from './pages/ParentDashboard';
import ReportCard from './pages/ReportCard';
import ResultApproval from './pages/ResultApproval';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PortalConnect />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/login/direct" element={<DirectLogin />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<StudentManagement />} />
        <Route path="/admin/approvals" element={<ResultApproval />} />
        <Route path="/teacher" element={<TeacherLedger />} />
        <Route path="/exam" element={<ExamHall />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/report-card" element={<ReportCard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;