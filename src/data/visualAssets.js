const generalPath = '/assets/visuals/general';
const kidsPhonicsPath = '/assets/visuals/kids-phonics';
const kidsCoursePath = '/assets/visuals/kids-course';

const asset = (src, alt) => ({ src, alt });

export const visualAssets = {
  general: {
    heroStudentLearning: asset(`${generalPath}/hero-student-learning.png`, 'Premium Learn with Taxo online English learning journey'),
    placementSpeakingTest: asset(`${generalPath}/placement-speaking-test.png`, 'Online placement speaking test with advisor support'),
    onlineTeacherClass: asset(`${generalPath}/online-teacher-class.png`, 'Live online English class with teacher and student'),
    adminDashboardManagement: asset(`${generalPath}/admin-dashboard-management.png`, 'Premium admin dashboard for school management'),
    paymentConfirmation: asset(`${generalPath}/payment-confirmation.png`, 'Secure payment confirmation'),
    materialsLibrary: asset(`${generalPath}/materials-library.png`, 'Digital learning materials library'),
    familyScheduleGroup: asset(`${generalPath}/family-schedule-group.png`, 'Family schedule and group placement portal'),
    supportAdvisor: asset(`${generalPath}/support-advisor.png`, 'Student support advisor for learning journey'),
    englishStudyProgress: asset(`${generalPath}/english-study-progress.png`, 'English study progress dashboard'),
    studentAchievement: asset(`${generalPath}/student-achievement.png`, 'Student achievement and certificate success')
  },
  kidsPhonics: {
    familyTable: asset(`${kidsPhonicsPath}/phonics-family-table.png`, 'Family phonics learning at home'),
    abcTablet: asset(`${kidsPhonicsPath}/phonics-abc-tablet.png`, 'Phonics alphabet recognition on tablet'),
    tracingTablet: asset(`${kidsPhonicsPath}/phonics-tracing-tablet.png`, 'Child tracing phonics letters on tablet'),
    cvcTiles: asset(`${kidsPhonicsPath}/phonics-cvc-tiles.png`, 'CVC word tiles for phonics blending'),
    readingCorner: asset(`${kidsPhonicsPath}/phonics-reading-corner.png`, 'Phonics reading practice corner'),
    onlineClass: asset(`${kidsPhonicsPath}/phonics-online-class.png`, 'Live online phonics class'),
    parentChild: asset(`${kidsPhonicsPath}/phonics-parent-child.png`, 'Parent supporting child phonics practice'),
    progressSuccess: asset(`${kidsPhonicsPath}/phonics-progress-success.png`, 'Phonics progress and success dashboard'),
    pronunciation: asset(`${kidsPhonicsPath}/phonics-pronunciation.png`, 'Phonics pronunciation and sound practice'),
    gameBoard: asset(`${kidsPhonicsPath}/phonics-game-board.png`, 'Phonics game board for word building')
  },
  kidsCourse: {
    speakingLesson: asset(`${kidsCoursePath}/kids-speaking-lesson.png`, 'Kids English speaking lesson'),
    countingLesson: asset(`${kidsCoursePath}/kids-counting-lesson.png`, 'Kids English counting lesson'),
    colorsShapes: asset(`${kidsCoursePath}/kids-colors-shapes.png`, 'Kids English colors and shapes lesson'),
    storytimeReading: asset(`${kidsCoursePath}/kids-storytime-reading.png`, 'Kids English storytime reading lesson'),
    greetingsSpeaking: asset(`${kidsCoursePath}/kids-greetings-speaking.png`, 'Kids English greetings and speaking practice'),
    sentenceBuilding: asset(`${kidsCoursePath}/kids-sentence-building.png`, 'Kids English sentence building practice'),
    animalsNature: asset(`${kidsCoursePath}/kids-animals-nature.png`, 'Kids English animals and nature vocabulary'),
    onlineClass: asset(`${kidsCoursePath}/kids-online-class.png`, 'Kids English live online class'),
    teamGame: asset(`${kidsCoursePath}/kids-team-game.png`, 'Kids English team game and rewards'),
    achievementCertificates: asset(`${kidsCoursePath}/kids-achievement-certificates.png`, 'Kids English achievement certificates')
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
  if (value.includes('kids') || value.includes('a0') || value.includes('a1') || value.includes('a2')) return visualAssets.kidsCourse.achievementCertificates;
  if (value.includes('general') || value.includes('adult') || value.includes('speaking') || value.includes('grammar')) return visualAssets.general.englishStudyProgress;
  return visualAssets.general.heroStudentLearning;
}
