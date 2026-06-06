import fs from 'node:fs';

function replaceOnce(source, before, after, label) {
  if (!source.includes(before)) throw new Error(`Missing expected source for ${label}`);
  return source.replace(before, after);
}

const visualPath = 'src/data/visualAssets.js';
let visual = fs.readFileSync(visualPath, 'utf8');

const visualReplacements = [
  ["placementSpeakingTest: uploaded('learn-english-online-courses.jpg', 'Learn English online course')", "placementSpeakingTest: uploaded('student-placement-test.png', 'Student placement test')"],
  ["adminDashboardManagement: asset(visuals.admin, 'Premium admin dashboard for school management')", "adminDashboardManagement: uploaded('teacher-dashboard-main.png', 'Learning management dashboard')"],
  ["paymentConfirmation: asset(visuals.payment, 'Secure payment confirmation')", "paymentConfirmation: uploaded('student-payment.png', 'Student payment confirmation')"],
  ["materialsLibrary: asset(visuals.materials, 'Digital learning materials library')", "materialsLibrary: uploaded('teacher-assigned-material.png', 'Assigned learning material')"],
  ["familyScheduleGroup: asset(visuals.family, 'Family schedule and group placement portal')", "familyScheduleGroup: uploaded('student-booking.png', 'Student course booking')"],
  ["supportAdvisor: asset(visuals.support, 'Student support advisor for learning journey')", "supportAdvisor: uploaded('student-chat.png', 'Student support chat')"],
  ["studentAchievement: asset(visuals.achievement, 'Student achievement and certificate success')", "studentAchievement: uploaded('student-certificate.png', 'Student certificate achievement')"]
];

for (const [before, after] of visualReplacements) {
  visual = replaceOnce(visual, before, after, before);
}

const visualAnchor = `    teacherDashboard: uploaded('teacher-dashboard-main.png', 'Teacher dashboard overview'),
    studentDashboard: uploaded('student-dashboard-main.png', 'Student dashboard overview')
  }
};`;
const visualPortalConfig = `    teacherDashboard: uploaded('teacher-dashboard-main.png', 'Teacher dashboard overview'),
    studentDashboard: uploaded('student-dashboard-main.png', 'Student dashboard overview')
  },
  studentPortal: {
    dashboard: uploaded('student-dashboard-main.png', 'Student dashboard overview'),
    guide: uploaded('student-guide.png', 'Student guide'),
    placementTest: uploaded('student-placement-test.png', 'Student placement test'),
    booking: uploaded('student-booking.png', 'Student course booking'),
    chooseTeacher: uploaded('student-choose-teacher.png', 'Student choosing a teacher'),
    payment: uploaded('student-payment.png', 'Student payment'),
    profile: uploaded('student-my-profile.png', 'Student profile'),
    homework: uploaded('student-homework.png', 'Student homework'),
    feedback: uploaded('student-feedback.png', 'Student feedback'),
    finalTest: uploaded('student-final-test.png', 'Student final test'),
    reports: uploaded('student-reports.png', 'Student reports'),
    certificate: uploaded('student-certificate.png', 'Student certificate'),
    chat: uploaded('student-chat.png', 'Student chat')
  },
  teacherPortal: {
    dashboard: uploaded('teacher-dashboard-main.png', 'Teacher dashboard overview'),
    profile: uploaded('teacher-my-profile.png', 'Teacher profile'),
    availability: uploaded('teacher-availability.png', 'Teacher availability'),
    schedule: uploaded('teacher-schedule.png', 'Teacher schedule'),
    assignedMaterial: uploaded('teacher-assigned-material.png', 'Teacher assigned material'),
    attendance: uploaded('teacher-attendance.png', 'Teacher attendance'),
    homeworkSubmissions: uploaded('teacher-homework-submissions.png', 'Teacher homework submissions'),
    feedback: uploaded('teacher-feedback.png', 'Teacher feedback'),
    students: uploaded('teacher-students.png', 'Teacher students'),
    salary: uploaded('teacher-salary.png', 'Teacher salary'),
    chat: uploaded('teacher-chat.png', 'Teacher chat'),
    vacation: uploaded('teacher-vacation.png', 'Teacher vacation')
  }
};`;
visual = replaceOnce(visual, visualAnchor, visualPortalConfig, 'portal image registry');
fs.writeFileSync(visualPath, visual);

const appPath = 'src/App.jsx';
let app = fs.readFileSync(appPath, 'utf8');
const appReplacements = [
  ["image: visualAssets.landing.teacherDashboard", "image: visualAssets.teacherPortal.dashboard"],
  ["image: visualAssets.landing.studentDashboard", "image: visualAssets.studentPortal.dashboard"],
  ["image={visualAssets.general.placementSpeakingTest} />", "image={teacher ? visualAssets.teacherPortal.assignedMaterial : visualAssets.studentPortal.placementTest} />"],
  ["src={visualAssets.general.studentAchievement.src} alt={visualAssets.general.studentAchievement.alt}", "src={visualAssets.studentPortal.certificate.src} alt={visualAssets.studentPortal.certificate.alt}"],
  ["image={visualAssets.general.placementSpeakingTest} />", "image={visualAssets.studentPortal.placementTest} />"],
  ["image={visualAssets.general.familyScheduleGroup} />", "image={visualAssets.studentPortal.booking} />"],
  ["image={visualAssets.general.paymentConfirmation} />", "image={visualAssets.studentPortal.payment} />"],
  ["image={getCourseVisual(student.course)} />", "image={visualAssets.studentPortal.profile} />"],
  ["image={visualAssets.general.supportAdvisor} />", "image={visualAssets.studentPortal.feedback} />"],
  ["image={visualAssets.general.onlineTeacherClass} />", "image={visualAssets.teacherPortal.feedback} />"],
  ["function TeacherProfilesPage({ admin = false })", "function TeacherProfilesPage({ admin = false, image })"],
  ["image={visualAssets.general.onlineTeacherClass} />\n      <div className=\"teacher-grid\">", "image={image || (admin ? visualAssets.teacherPortal.students : visualAssets.studentPortal.chooseTeacher)} />\n      <div className=\"teacher-grid\">"],
  ["image={visualAssets.general.materialsLibrary} />\n      {role === 'admin'", "image={role === 'teacher' ? visualAssets.teacherPortal.assignedMaterial : visualAssets.general.materialsLibrary} />\n      {role === 'admin'"],
  ["image={visualAssets.general.familyScheduleGroup} />\n      <DataTable rows={rows}", "image={teacher ? visualAssets.teacherPortal.students : visualAssets.general.familyScheduleGroup} />\n      <DataTable rows={rows}"],
  ["image={visualAssets.general.familyScheduleGroup} />\n      <DataTable rows={rows} columns={[{ key: 'name', label: 'Group' }", "image={teacher ? visualAssets.teacherPortal.schedule : visualAssets.general.familyScheduleGroup} />\n      <DataTable rows={rows} columns={[{ key: 'name', label: 'Group' }"],
  ["image={visualAssets.general.onlineTeacherClass} />\n      <DataTable rows={students.filter", "image={visualAssets.teacherPortal.attendance} />\n      <DataTable rows={students.filter"],
  ["image={visualAssets.general.supportAdvisor} />)} />", "image={visualAssets.studentPortal.guide} />)} />"],
  ["image={visualAssets.general.materialsLibrary} />)} />", "image={visualAssets.studentPortal.homework} />)} />"],
  ["image={visualAssets.general.studentAchievement} />)} />", "image={visualAssets.studentPortal.finalTest} />)} />"],
  ["image={visualAssets.general.englishStudyProgress} />)} />", "image={visualAssets.studentPortal.reports} />)} />"],
  ["image={visualAssets.kidsCourse.achievementCertificates} />)} />", "image={visualAssets.studentPortal.certificate} />)} />"],
  ["image={visualAssets.general.supportAdvisor} />)} />", "image={visualAssets.studentPortal.chat} />)} />"],
  ["<TeacherProfilesPage />)} />\n        <Route path=\"/teacher/availability\"", "<TeacherProfilesPage image={visualAssets.teacherPortal.profile} />)} />\n        <Route path=\"/teacher/availability\""],
  ["title={t.nav.availability} icon={CalendarDays} />", "title={t.nav.availability} icon={CalendarDays} image={visualAssets.teacherPortal.availability} />"],
  ["title=\"Homework Submissions\" icon={FileText} />", "title=\"Homework Submissions\" icon={FileText} image={visualAssets.teacherPortal.homeworkSubmissions} />"],
  ["title={t.nav.salary} icon={Wallet} />", "title={t.nav.salary} icon={Wallet} image={visualAssets.teacherPortal.salary} />"],
  ["title={t.nav.chat} icon={MessageCircle} />", "title={t.nav.chat} icon={MessageCircle} image={visualAssets.teacherPortal.chat} />"],
  ["title={t.nav.vacation} icon={CalendarDays} />", "title={t.nav.vacation} icon={CalendarDays} image={visualAssets.teacherPortal.vacation} />"]
];

for (const [before, after] of appReplacements) {
  app = replaceOnce(app, before, after, before);
}
fs.writeFileSync(appPath, app);

const filenames = [...visual.matchAll(/uploaded\('([^']+)'/g)].map((match) => match[1]);
const unique = new Set(filenames);
if (unique.size !== 55) throw new Error(`Expected 55 Hostinger image filenames, found ${unique.size}`);
if ([...unique].some((name) => !name.endsWith('.png') && !name.endsWith('.jpg'))) throw new Error('Unexpected image extension');
console.log(`Configured ${unique.size} Hostinger-hosted images.`);
