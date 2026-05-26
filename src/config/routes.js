import {
  Award, Banknote, Bell, BookOpen, CalendarDays, Camera, ClipboardCheck,
  ClipboardList, CreditCard, Eye, FileText, Gauge, GraduationCap, Home,
  Lock, Mail, MessageCircle, ShieldCheck, SlidersHorizontal, Star, Trophy,
  UploadCloud, UserCog, UserRound, Wallet, XCircle
} from 'lucide-react';
import { ROLES } from './roles';

export const routeGroups = {
  public: [
    { path: '/', label: 'Home', icon: Home },
    { path: '/login', label: 'Login', icon: Lock },
    { path: '/student-login', label: 'Student Login', icon: UserRound },
    { path: '/teacher-login', label: 'Teacher Login', icon: UserRound },
    { path: '/admin-login', label: 'Admin Login', icon: ShieldCheck }
  ],
  student: [
    { path: '/student', label: 'Dashboard', icon: Gauge },
    { path: '/student/guide', label: 'Student Guide', icon: BookOpen },
    { path: '/student/placement', label: 'Placement Test', icon: ClipboardList },
    { path: '/student/booking', label: 'Booking', icon: CalendarDays },
    { path: '/student/teachers', label: 'Teachers', icon: GraduationCap },
    { path: '/student/payment', label: 'Payment', icon: CreditCard },
    { path: '/student/profile', label: 'My Profile', icon: UserRound },
    { path: '/student/homework', label: 'Homework', icon: FileText },
    { path: '/student/feedback', label: 'Session Feedback', icon: Star },
    { path: '/student/final-test', label: 'Final Test', icon: Award },
    { path: '/student/reports', label: 'Reports', icon: FileText },
    { path: '/student/certificate', label: 'Certificate', icon: Award },
    { path: '/student/chat', label: 'Group Chat', icon: MessageCircle }
  ],
  teacher: [
    { path: '/teacher', label: 'Dashboard', icon: Gauge },
    { path: '/teacher/profile', label: 'My Profile', icon: Camera },
    { path: '/teacher/availability', label: 'Availability', icon: CalendarDays },
    { path: '/teacher/schedule', label: 'Schedule', icon: ClipboardList },
    { path: '/teacher/material', label: 'Assigned Material', icon: BookOpen },
    { path: '/teacher/attendance', label: 'Attendance', icon: ClipboardCheck },
    { path: '/teacher/homework', label: 'Homework', icon: FileText },
    { path: '/teacher/feedback', label: 'Feedback Summary', icon: MessageCircle },
    { path: '/teacher/students', label: 'My Students', icon: UserRound },
    { path: '/teacher/salary', label: 'Salary', icon: Banknote },
    { path: '/teacher/chat', label: 'Group Chat', icon: MessageCircle },
    { path: '/teacher/vacation', label: 'Vacation', icon: CalendarDays }
  ],
  admin: [
    { path: '/admin', label: 'Command Center', icon: Gauge },
    { path: '/admin/students', label: 'Students', icon: UserRound },
    { path: '/admin/manual-student-add', label: 'Manual Student Add', icon: UserCog },
    { path: '/admin/placement-codes', label: 'Placement Codes', icon: ClipboardList },
    { path: '/admin/teachers', label: 'Teachers', icon: GraduationCap },
    { path: '/admin/schedules', label: 'Schedules', icon: CalendarDays },
    { path: '/admin/current-sessions', label: 'Current Sessions', icon: SlidersHorizontal },
    { path: '/admin/payments', label: 'Payment Approvals', icon: Wallet },
    { path: '/admin/finance', label: 'Finance', icon: Banknote },
    { path: '/admin/prices', label: 'Prices', icon: CreditCard },
    { path: '/admin/material', label: 'Material', icon: BookOpen },
    { path: '/admin/tests', label: 'End-Level Tests', icon: Award },
    { path: '/admin/homework', label: 'Homework', icon: FileText },
    { path: '/admin/reports', label: 'Reports', icon: FileText },
    { path: '/admin/certificates', label: 'Certificates', icon: Award },
    { path: '/admin/salary', label: 'Teacher Salary', icon: Banknote },
    { path: '/admin/teacher-of-month', label: 'Teacher of Month', icon: Trophy },
    { path: '/admin/student-of-month', label: 'Student of Month', icon: Star },
    { path: '/admin/roles', label: 'Roles', icon: UserCog },
    { path: '/admin/blocked-users', label: 'Blocked Users', icon: XCircle },
    { path: '/admin/automation', label: 'Email Automation', icon: Bell },
    { path: '/admin/audit-log', label: 'Audit Log', icon: ShieldCheck },
    { path: '/admin/data-sources', label: 'Data Sources', icon: UploadCloud },
    { path: '/admin/assets', label: 'Assets', icon: Eye }
  ]
};

export const routePermissions = {
  student: [ROLES.STUDENT],
  teacher: [ROLES.TEACHER],
  admin: [ROLES.ADMIN, ROLES.OWNER]
};
