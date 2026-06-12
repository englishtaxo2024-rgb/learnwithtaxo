function svgDataUri(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function makeVisual(title, accent = '#123F6D', icon = 'book') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="${title}">
    <defs><linearGradient id="bg" x1="0" x2="1"><stop stop-color="#061B30"/><stop offset=".55" stop-color="${accent}"/><stop offset="1" stop-color="#EAF6FC"/></linearGradient><radialGradient id="g" cx="72%" cy="38%" r="48%"><stop stop-color="#D4AF37" stop-opacity=".55"/><stop offset="1" stop-color="#D4AF37" stop-opacity="0"/></radialGradient></defs>
    <rect width="1200" height="675" fill="url(#bg)"/><rect width="1200" height="675" fill="url(#g)"/>
    <path d="M92 540 C310 405 500 405 704 532 S1020 575 1120 420" fill="none" stroke="#D4AF37" stroke-width="8" opacity=".5"/>
    <rect x="92" y="96" width="486" height="380" rx="36" fill="#fff" opacity=".13" stroke="#D4AF37"/>
    <text x="132" y="200" font-family="Inter,Arial,sans-serif" font-size="54" font-weight="900" fill="#fff">${title}</text>
    <text x="132" y="278" font-family="Inter,Arial,sans-serif" font-size="30" font-weight="850" fill="#C3E1F5">Learn with Taxo</text>
    <text x="132" y="330" font-family="Tahoma,Arial,sans-serif" font-size="25" font-weight="750" fill="#fff">اتعلم اليوم... واسبق بكره</text>
    <rect x="132" y="382" width="96" height="10" rx="5" fill="#D4AF37"/><rect x="248" y="382" width="166" height="10" rx="5" fill="#D4AF37" opacity=".5"/>
    <rect x="674" y="126" width="370" height="318" rx="38" fill="#fff" opacity=".94"/><rect x="710" y="166" width="298" height="202" rx="26" fill="#EAF6FC"/>
    <circle cx="792" cy="267" r="62" fill="#123F6D" opacity=".92"/><text x="792" y="289" text-anchor="middle" font-family="Arial,sans-serif" font-size="48" font-weight="900" fill="#D4AF37">${icon.slice(0, 1).toUpperCase()}</text>
    <circle cx="760" cy="420" r="20" fill="#D4AF37"/><rect x="805" y="405" width="150" height="30" rx="15" fill="#123F6D" opacity=".82"/>
    <text x="132" y="522" font-family="Inter,Arial,sans-serif" font-size="23" font-weight="850" fill="#fff">Clear steps, friendly teachers, trusted progress.</text>
  </svg>`;
  return svgDataUri(svg);
}

const asset = (src, alt) => ({ src, alt });
const uploaded = (file, alt) => asset(`/assets/landing-uploaded/${file}`, alt);

const visuals = {
  generalHero: makeVisual('Student learning progress', '#123F6D', 'progress'),
  placement: makeVisual('Placement speaking test', '#245F97', 'mic'),
  online: makeVisual('Live online class', '#0B2A4A', 'video'),
  admin: makeVisual('Admin management', '#061B30', 'chart'),
  payment: makeVisual('Payment confirmation', '#123F6D', 'card'),
  materials: makeVisual('Materials library', '#245F97', 'book'),
  family: makeVisual('Family schedule', '#0B2A4A', 'calendar'),
  support: makeVisual('Support advisor', '#123F6D', 'chat'),
  progress: makeVisual('English progress', '#061B30', 'growth'),
  achievement: makeVisual('Student achievement', '#123F6D', 'award'),
  kidsSpeaking: makeVisual('Kids speaking lesson', '#245F97', 'speak'),
  kidsCounting: makeVisual('Kids counting lesson', '#123F6D', 'five'),
  kidsColors: makeVisual('Colors and shapes', '#0B2A4A', 'shape'),
  kidsStory: makeVisual('Storytime reading', '#061B30', 'story'),
  kidsCertificate: makeVisual('Kids certificates', '#123F6D', 'star'),
  phonicsFamily: makeVisual('Phonics family start', '#245F97', 'abc'),
  phonicsTracing: makeVisual('Tracing letters', '#123F6D', 'trace'),
  phonicsCvc: makeVisual('CVC word building', '#0B2A4A', 'tiles'),
  phonicsReading: makeVisual('Reading practice', '#061B30', 'read'),
  phonicsOnline: makeVisual('Online phonics class', '#123F6D', 'sound')
};

export const visualAssets = {
  general: {
    heroStudentLearning: uploaded('choose-your-learning-path.png', 'Choose your learning path steps'),
    placementSpeakingTest: uploaded('student-placement-test.png', 'Student placement test'),
    onlineTeacherClass: uploaded('live-online-learning.png', 'Live online learning class'),
    adminDashboardManagement: uploaded('teacher-dashboard-main.png', 'Learning management dashboard'),
    paymentConfirmation: uploaded('student-payment.png', 'Student payment confirmation'),
    materialsLibrary: uploaded('teacher-assigned-material.png', 'Assigned learning material'),
    familyScheduleGroup: uploaded('student-booking.png', 'Student course booking'),
    supportAdvisor: uploaded('student-chat.png', 'Student support chat'),
    englishStudyProgress: uploaded('general-english-teens.jpg', 'General English for teens'),
    studentAchievement: uploaded('student-certificate.png', 'Student certificate achievement')
  },
  kidsPhonics: {
    familyTable: uploaded('phonics-family-start.png', 'Family phonics start'),
    abcTablet: uploaded('phonics-abc-recognition.png', 'ABC recognition phonics'),
    tracingTablet: uploaded('phonics-tracing-letters.png', 'Tracing letters phonics'),
    cvcTiles: uploaded('phonics-cvc-word-building.png', 'CVC word building'),
    readingCorner: uploaded('phonics-reading-practice.png', 'Reading practice phonics'),
    onlineClass: uploaded('phonics-online-class.png', 'Online phonics class'),
    parentChild: uploaded('phonics-parent-support.png', 'Parent support phonics'),
    progressSuccess: uploaded('phonics-progress-confidence.png', 'Progress and confidence phonics'),
    pronunciation: uploaded('phonics-sound-pronunciation.png', 'Sound pronunciation phonics'),
    gameBoard: uploaded('phonics-games.png', 'Phonics games')
  },
  kidsCourse: {
    speakingLesson: uploaded('kids-speaking-practice.png', 'Kids speaking practice'),
    countingLesson: uploaded('kids-numbers-counting.png', 'Kids numbers and counting'),
    colorsShapes: uploaded('kids-colors-shapes.png', 'Kids colors and shapes'),
    storytimeReading: uploaded('kids-storytime-reading.png', 'Kids storytime reading'),
    greetingsSpeaking: uploaded('kids-greetings-confidence.png', 'Kids greetings and confidence'),
    sentenceBuilding: uploaded('kids-sentence-building.png', 'Kids sentence building'),
    animalsNature: uploaded('kids-animals-vocabulary.png', 'Kids animals and vocabulary'),
    onlineClass: uploaded('kids-live-online-classes.png', 'Kids live online classes'),
    teamGame: uploaded('kids-games-rewards.png', 'Kids games and rewards'),
    achievementCertificates: uploaded('kids-certificates-success.png', 'Kids certificates and success')
  },
  landing: {
    hero: uploaded('hero-learn-with-taxo-premium.png', 'Learn with Taxo premium English learning'),
    learningPath: uploaded('choose-your-learning-path.png', 'Choose your learning path steps'),
    services: {
      placement: uploaded('learn-english-online-courses.jpg', 'Learn English online course'),
      general: uploaded('general-english-teens.jpg', 'General English for teens'),
      kids: uploaded('english-kids-courses.jpg', 'English kids course'),
      phonics: uploaded('phonics-courses.jpg', 'Phonics course'),
      private: uploaded('private-speaking-course.jpg', 'Private speaking course')
    },
    courses: {
      liveOnline: uploaded('live-online-learning.png', 'Live online learning class'),
      kidsEnglish: uploaded('kids-english-story-learning.png', 'Kids English story learning'),
      phonics: uploaded('phonics-online-foundations.png', 'Phonics online learning foundations')
    },
    teacherDashboard: uploaded('teacher-dashboard-main.png', 'Teacher dashboard overview'),
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
};

export const learningPathVisuals = [
  {
    key: 'general',
    title: 'General English',
    titleAr: 'الإنجليزي العام',
    description: 'Structured progress from placement to certificate with speaking, writing, reading, and listening.',
    descriptionAr: 'تقدم منظم من تحديد المستوى حتى الشهادة مع المحادثة والكتابة والقراءة والاستماع.',
    to: '/student/booking?course=general',
    image: visualAssets.general.englishStudyProgress
  },
  {
    key: 'kids',
    title: 'Kids English',
    titleAr: 'إنجليزي الأطفال',
    description: 'Friendly lessons for vocabulary, grammar, stories, speaking, games, and confidence.',
    descriptionAr: 'حصص مناسبة للأطفال للمفردات والقواعد والقصص والمحادثة والألعاب والثقة.',
    to: '/student/booking?course=kids',
    image: visualAssets.kidsCourse.speakingLesson
  },
  {
    key: 'phonics',
    title: 'Phonics',
    titleAr: 'فونكس',
    description: 'Letter sounds, tracing, blending, CVC words, reading aloud, and pronunciation.',
    descriptionAr: 'أصوات الحروف والتتبع والدمج وكلمات CVC والقراءة والنطق.',
    to: '/student/booking?course=phonics',
    image: visualAssets.kidsPhonics.tracingTablet
  },
  {
    key: 'placement',
    title: 'Placement Test',
    titleAr: 'اختبار تحديد المستوى',
    description: 'A guided placement flow with writing, speaking, audio, and careful review.',
    descriptionAr: 'اختبار منظم للكتابة والمحادثة والصوت مع مراجعة دقيقة.',
    to: '/student/placement',
    image: visualAssets.general.placementSpeakingTest
  }
];

export function getCourseVisual(courseName = '') {
  const value = String(courseName).toLowerCase();
  if (value.includes('phonics')) return visualAssets.kidsPhonics.progressSuccess;
  if (value.includes('kids') || value.includes('a0') || value.includes('a1') || value.includes('a2')) {
    return visualAssets.kidsCourse.achievementCertificates;
  }
  if (value.includes('general') || value.includes('adult') || value.includes('speaking') || value.includes('grammar')) {
    return visualAssets.general.englishStudyProgress;
  }
  return visualAssets.general.heroStudentLearning;
}
