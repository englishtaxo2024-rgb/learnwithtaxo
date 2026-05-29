const asset = (_src, alt) => ({ src: '', alt });

export const visualAssets = {
  general: {
    heroStudentLearning: asset('', 'Premium Learn with Taxo online English learning journey'),
    placementSpeakingTest: asset('', 'Online placement speaking test with advisor support'),
    onlineTeacherClass: asset('', 'Live online English class with teacher and student'),
    adminDashboardManagement: asset('', 'Premium admin dashboard for school management'),
    paymentConfirmation: asset('', 'Secure payment confirmation'),
    materialsLibrary: asset('', 'Digital learning materials library'),
    familyScheduleGroup: asset('', 'Family schedule and group placement portal'),
    supportAdvisor: asset('', 'Student support advisor for learning journey'),
    englishStudyProgress: asset('', 'English study progress dashboard'),
    studentAchievement: asset('', 'Student achievement and certificate success')
  },
  kidsPhonics: {
    familyTable: asset('', 'Family phonics learning at home'),
    abcTablet: asset('', 'Phonics alphabet recognition on tablet'),
    tracingTablet: asset('', 'Child tracing phonics letters on tablet'),
    cvcTiles: asset('', 'CVC word tiles for phonics blending'),
    readingCorner: asset('', 'Phonics reading practice corner'),
    onlineClass: asset('', 'Live online phonics class'),
    parentChild: asset('', 'Parent supporting child phonics practice'),
    progressSuccess: asset('', 'Phonics progress and success dashboard'),
    pronunciation: asset('', 'Phonics pronunciation and sound practice'),
    gameBoard: asset('', 'Phonics game board for word building')
  },
  kidsCourse: {
    speakingLesson: asset('', 'Kids English speaking lesson'),
    countingLesson: asset('', 'Kids English counting lesson'),
    colorsShapes: asset('', 'Kids English colors and shapes lesson'),
    storytimeReading: asset('', 'Kids English storytime reading lesson'),
    greetingsSpeaking: asset('', 'Kids English greetings and speaking practice'),
    sentenceBuilding: asset('', 'Kids English sentence building practice'),
    animalsNature: asset('', 'Kids English animals and nature vocabulary'),
    onlineClass: asset('', 'Kids English live online class'),
    teamGame: asset('', 'Kids English team game and rewards'),
    achievementCertificates: asset('', 'Kids English achievement certificates')
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
