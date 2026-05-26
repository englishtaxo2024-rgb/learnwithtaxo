import { Navigate, Route, Routes } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { RoleGuard } from './components/layout/RoleGuard';
import { HomePage } from './pages/public/HomePage';
import { LoginPage } from './pages/public/LoginPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { PlacementPage } from './pages/student/PlacementPage';
import { PaymentPage } from './pages/student/PaymentPage';
import { StudentSimplePage } from './pages/student/StudentSimplePage';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherProfilePage } from './pages/teacher/TeacherProfilePage';
import { TeacherMaterialPage } from './pages/teacher/TeacherMaterialPage';
import { AttendancePage } from './pages/teacher/AttendancePage';
import { TeacherFeedbackPage } from './pages/teacher/TeacherFeedbackPage';
import { TeacherSimplePage } from './pages/teacher/TeacherSimplePage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentsPage } from './pages/admin/StudentsPage';
import { TeachersPage } from './pages/admin/TeachersPage';
import { PaymentsAdminPage } from './pages/admin/PaymentsAdminPage';
import { DataSourcesPage } from './pages/admin/DataSourcesPage';
import { AssetsPage } from './pages/admin/AssetsPage';
import { AdminSimplePage } from './pages/admin/AdminSimplePage';
import { demoUsers } from './config/roles';

const studentTitles = {
  '/student/guide': 'Student Guide',
  '/student/booking': 'Booking',
  '/student/teachers': 'Teacher Profiles Filtered by Level',
  '/student/homework': 'Homework',
  '/student/final-test': 'Final Test',
  '/student/reports': 'Reports',
  '/student/certificate': 'Certificate',
  '/student/chat': 'Internal Group Chat'
};

const teacherTitles = {
  '/teacher/availability': 'My Availability',
  '/teacher/schedule': 'My Group and Private Schedule',
  '/teacher/homework': 'Homework Submissions',
  '/teacher/students': 'My Students',
  '/teacher/salary': 'My Salary Status',
  '/teacher/chat': 'My Group Chat',
  '/teacher/vacation': 'Vacation / Off Request'
};

const adminTitles = {
  '/admin/manual-student-add': 'Manual Student Add',
  '/admin/placement-codes': 'Placement Codes',
  '/admin/schedules': 'Teacher Schedules',
  '/admin/current-sessions': 'Current Session Control',
  '/admin/finance': 'Finance Sheet',
  '/admin/prices': 'Prices and Discounts Editor',
  '/admin/material': 'Material Management',
  '/admin/tests': 'End-Level Test Banks',
  '/admin/homework': 'Homework Management',
  '/admin/reports': 'Reports',
  '/admin/certificates': 'Certificates',
  '/admin/salary': 'Teacher Salary',
  '/admin/teacher-of-month': 'Teacher of the Month',
  '/admin/student-of-month': 'Student of the Month',
  '/admin/roles': 'Roles and Permissions',
  '/admin/blocked-users': 'Blocked Users',
  '/admin/automation': 'Email Automation',
  '/admin/audit-log': 'Audit Log'
};

function ShellRoute({ user, area, language, setLanguage, children }) {
  return (
    <RoleGuard user={user} area={area}>
      <AppShell user={user} area={area} language={language} setLanguage={setLanguage}>{children}</AppShell>
    </RoleGuard>
  );
}

export default function App() {
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState(null);

  const studentRoutes = useMemo(() => Object.entries(studentTitles), []);
  const teacherRoutes = useMemo(() => Object.entries(teacherTitles), []);
  const adminRoutes = useMemo(() => Object.entries(adminTitles), []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage setUser={setUser} mode="student" />} />
      <Route path="/student-login" element={<LoginPage setUser={setUser} mode="student" />} />
      <Route path="/teacher-login" element={<LoginPage setUser={setUser} mode="teacher" />} />
      <Route path="/admin-login" element={<LoginPage setUser={setUser} mode="admin" />} />

      <Route path="/student" element={<ShellRoute user={user} area="student" language={language} setLanguage={setLanguage}><StudentDashboard /></ShellRoute>} />
      <Route path="/student/placement" element={<ShellRoute user={user} area="student" language={language} setLanguage={setLanguage}><PlacementPage /></ShellRoute>} />
      <Route path="/student/payment" element={<ShellRoute user={user} area="student" language={language} setLanguage={setLanguage}><PaymentPage /></ShellRoute>} />
      <Route path="/student/profile" element={<ShellRoute user={user} area="student" language={language} setLanguage={setLanguage}><StudentProfilePage /></ShellRoute>} />
      <Route path="/student/feedback" element={<ShellRoute user={user} area="student" language={language} setLanguage={setLanguage}><StudentSimplePage title="Session Feedback" type="feedback" /></ShellRoute>} />
      {studentRoutes.map(([path, title]) => <Route key={path} path={path} element={<ShellRoute user={user} area="student" language={language} setLanguage={setLanguage}><StudentSimplePage title={title} /></ShellRoute>} />)}

      <Route path="/teacher" element={<ShellRoute user={user} area="teacher" language={language} setLanguage={setLanguage}><TeacherDashboard /></ShellRoute>} />
      <Route path="/teacher/profile" element={<ShellRoute user={user} area="teacher" language={language} setLanguage={setLanguage}><TeacherProfilePage /></ShellRoute>} />
      <Route path="/teacher/material" element={<ShellRoute user={user} area="teacher" language={language} setLanguage={setLanguage}><TeacherMaterialPage /></ShellRoute>} />
      <Route path="/teacher/attendance" element={<ShellRoute user={user} area="teacher" language={language} setLanguage={setLanguage}><AttendancePage /></ShellRoute>} />
      <Route path="/teacher/feedback" element={<ShellRoute user={user} area="teacher" language={language} setLanguage={setLanguage}><TeacherFeedbackPage /></ShellRoute>} />
      <Route path="/teacher/student/:id" element={<ShellRoute user={user} area="teacher" language={language} setLanguage={setLanguage}><StudentProfilePage /></ShellRoute>} />
      {teacherRoutes.map(([path, title]) => <Route key={path} path={path} element={<ShellRoute user={user} area="teacher" language={language} setLanguage={setLanguage}><TeacherSimplePage title={title} /></ShellRoute>} />)}

      <Route path="/admin" element={<ShellRoute user={user} area="admin" language={language} setLanguage={setLanguage}><AdminDashboard /></ShellRoute>} />
      <Route path="/admin/students" element={<ShellRoute user={user} area="admin" language={language} setLanguage={setLanguage}><StudentsPage /></ShellRoute>} />
      <Route path="/admin/student/:id" element={<ShellRoute user={user} area="admin" language={language} setLanguage={setLanguage}><StudentProfilePage admin /></ShellRoute>} />
      <Route path="/admin/teachers" element={<ShellRoute user={user} area="admin" language={language} setLanguage={setLanguage}><TeachersPage /></ShellRoute>} />
      <Route path="/admin/teacher/:id" element={<ShellRoute user={user} area="admin" language={language} setLanguage={setLanguage}><TeacherProfilePage /></ShellRoute>} />
      <Route path="/admin/payments" element={<ShellRoute user={user} area="admin" language={language} setLanguage={setLanguage}><PaymentsAdminPage /></ShellRoute>} />
      <Route path="/admin/data-sources" element={<ShellRoute user={user} area="admin" language={language} setLanguage={setLanguage}><DataSourcesPage /></ShellRoute>} />
      <Route path="/admin/assets" element={<ShellRoute user={user} area="admin" language={language} setLanguage={setLanguage}><AssetsPage /></ShellRoute>} />
      {adminRoutes.map(([path, title]) => <Route key={path} path={path} element={<ShellRoute user={user} area="admin" language={language} setLanguage={setLanguage}><AdminSimplePage title={title} /></ShellRoute>} />)}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
