const HOSTINGER_IMAGE_BASE = '/assets/landing-uploaded/';

const uploaded = (file, alt) => ({
  src: `${HOSTINGER_IMAGE_BASE}${file}`,
  alt
});

export const visualAssets = {
  general: {
    heroStudentLearning: uploaded('hero-learn-with-taxo-premium.png', 'Premium Learn with Taxo online English learning journey'),
    placementSpeakingTest: uploaded('student-placement-test.png', 'Online placement test'),
    onlineTeacherClass: uploaded('live-online-learning.png', 'Live online English class'),
    adminDashboardManagement: uploaded('teacher-dashboard-main.png', 'Teacher dashboard management'),
    paymentConfirmation: uploaded('student-payment.png', 'Secure payment confirmation'),
    materialsLibrary: uploaded('teacher-assigned-material.png', 'Digital learning materials library'),
    familyScheduleGroup: uploaded('choose-your-learning-path.png', 'Choose your learning path'),
    supportAdvisor: uploaded('student-chat.png', 'Student support and community chat'),
    englishStudyProgress: uploaded('student-reports.png', 'English study progress report'),
    studentAchievement: uploaded('student-certificate.png', 'Student achievement certificate'),
    generalEnglishTeens: uploaded('general-english-teens.jpg', 'General English for teens'),
    englishKidsCourses: uploaded('english-kids-courses.jpg', 'English courses for kids'),
    privateSpeakingCourse: uploaded('private-speaking-course.jpg', 'Private speaking course for adults'),
    phonicsCourses: uploaded('phonics-courses.jpg', 'Phonics courses for children'),
    onlineCourses: uploaded('learn-english-online-courses.jpg', 'Learn English online courses')
  },
  studentPortal: {
    dashboard: uploaded('student-dashboard-main.png', 'Student dashboard'),
    guide: uploaded('student-guide.png', 'Student guide'),
    placementTest: uploaded('student-placement-test.png', 'Student placement test'),
    booking: uploaded('student-booking.png', 'Student course booking'),
    chooseTeacher: uploaded('student-choose-teacher.png', 'Choose a teacher'),
    payment: uploaded('student-payment.png', 'Student payment'),
    profile: uploaded('student-my-profile.png', 'Student profile'),
    homework: uploaded('student-homework.png', 'Student homework'),
    feedback: uploaded('student-feedback.png', 'Student feedback'),
    finalTest: uploaded('student-final-test.png', 'Student final test'),
    certificate: uploaded('student-certificate.png', 'Student certificate'),
    reports: uploaded('student-reports.png', 'Student reports'),
    chat: uploaded('student-chat.png', 'Student chat')
  },
  teacherPortal: {
    dashboard: uploaded('teacher-dashboard-main.png', 'Teacher dashboard'),
    profile: uploaded('teacher-my-profile.png', 'Teacher profile'),
    schedule: uploaded('teacher-schedule.png', 'Teacher schedule'),
    assignedMaterial: uploaded('teacher-assigned-material.png', 'Teacher assigned material'),
    availability: uploaded('teacher-availability.png', 'Teacher availability'),
    attendance: uploaded('teacher-attendance.png', 'Teacher attendance'),
    homeworkSubmissions: uploaded('teacher-homework-submissions.png', 'Teacher homework submissions'),
    feedback: uploaded('teacher-feedback.png', 'Teacher feedback'),
    students: uploaded('teacher-students.png', 'Teacher students'),
    salary: uploaded('teacher-salary.png', 'Teacher salary'),
    chat: uploaded('teacher-chat.png', 'Teacher chat'),
    vacation: uploaded('teacher-vacation.png', 'Teacher vacation request')
  },
  kidsPhonics: {
    familyTable: uploaded('phonics-family-start.png', 'Family phonics learning at home'),
    abcTablet: uploaded('phonics-abc-recognition.png', 'Phonics alphabet recognition'),
    tracingTablet: uploaded('phonics-tracing-letters.png', 'Tracing phonics letters'),
    cvcTiles: uploaded('phonics-cvc-word-building.png', 'CVC word building'),
    readingCorner: uploaded('phonics-reading-practice.png', 'Phonics reading practice'),
    onlineClass: uploaded('phonics-online-class.png', 'Live online phonics class'),
    parentChild: uploaded('phonics-parent-support.png', 'Parent supporting phonics practice'),
    progressSuccess: uploaded('phonics-progress-confidence.png', 'Phonics progress and confidence'),
    pronunciation: uploaded('phonics-sound-pronunciation.png', 'Phonics sound pronunciation'),
    gameBoard: uploaded('phonics-games.png', 'Phonics learning games'),
    foundations: uploaded('phonics-online-foundations.png', 'Online phonics foundations')
  },
  kidsCourse: {
    speakingLesson: uploaded('kids-speaking-practice.png', 'Kids English speaking practice'),
    countingLesson: uploaded('kids-numbers-counting.png', 'Kids numbers and counting'),
    colorsShapes: uploaded('kids-colors-shapes.png', 'Kids colors and shapes'),
    storytimeReading: uploaded('kids-storytime-reading.png', 'Kids storytime reading'),
    greetingsSpeaking: uploaded('kids-greetings-confidence.png', 'Kids greetings and confidence'),
    sentenceBuilding: uploaded('kids-sentence-building.png', 'Kids sentence building'),
    animalsNature: uploaded('kids-animals-vocabulary.png', 'Kids animals vocabulary'),
    onlineClass: uploaded('kids-live-online-classes.png', 'Kids live online classes'),
    teamGame: uploaded('kids-games-rewards.png', 'Kids games and rewards'),
    achievementCertificates: uploaded('kids-certificates-success.png', 'Kids certificates and success'),
    storyLearning: uploaded('kids-english-story-learning.png', 'Kids English story learning')
  }
};

export const learningPathVisuals = [
  {
    key: 'general',
    title: 'General English',
    titleAr: 'الإنجليزي العام',
    description: 'Structured progress from placement to certificate with speaking, writing, reading, and listening.',
    descriptionAr: 'تقدم منظم من تحديد المستوى حتى الشهادة مع المحادثة والكتابة والقراءة والاستماع.',
    to: '/student/booking?course=general',
    image: visualAssets.general.generalEnglishTeens
  },
  {
    key: 'kids',
    title: 'Kids English',
    titleAr: 'إنجليزي الأطفال',
    description: 'Friendly lessons for vocabulary, grammar, stories, speaking, games, and confidence.',
    descriptionAr: 'حصص مناسبة للأطفال للمفردات والقواعد والقصص والمحادثة والألعاب والثقة.',
    to: '/student/booking?course=kids',
    image: visualAssets.general.englishKidsCourses
  },
  {
    key: 'phonics',
    title: 'Phonics',
    titleAr: 'فونكس',
    description: 'Letter sounds, tracing, blending, CVC words, reading aloud, and pronunciation.',
    descriptionAr: 'أصوات الحروف والتتبع والدمج وكلمات CVC والقراءة والنطق.',
    to: '/student/booking?course=phonics',
    image: visualAssets.general.phonicsCourses
  },
  {
    key: 'placement',
    title: 'Placement Test',
    titleAr: 'اختبار تحديد المستوى',
    description: 'A guided placement flow with writing, speaking, audio, and careful review.',
    descriptionAr: 'اختبار منظم للكتابة والمحادثة والصوت مع مراجعة دقيقة.',
    to: '/student/placement',
    image: visualAssets.studentPortal.placementTest
  }
];

export function getCourseVisual(courseName = '') {
  const value = String(courseName).toLowerCase();
  if (value.includes('phonics')) return visualAssets.general.phonicsCourses;
  if (value.includes('kids') || value.includes('a0') || value.includes('a1') || value.includes('a2')) return visualAssets.general.englishKidsCourses;
  if (value.includes('speaking')) return visualAssets.general.privateSpeakingCourse;
  if (value.includes('general') || value.includes('adult') || value.includes('grammar')) return visualAssets.general.generalEnglishTeens;
  return visualAssets.general.onlineCourses;
}

export { HOSTINGER_IMAGE_BASE };
