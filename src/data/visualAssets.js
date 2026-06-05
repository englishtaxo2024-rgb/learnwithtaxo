function svgDataUri(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function makeVisual(title, accent = '#123F6D', icon = 'book') {
  const initial = icon.slice(0, 1).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="${title}">
    <defs>
      <linearGradient id="bg" x1="0" x2="1"><stop stop-color="#061B30"/><stop offset=".55" stop-color="${accent}"/><stop offset="1" stop-color="#EAF6FC"/></linearGradient>
      <radialGradient id="g" cx="72%" cy="38%" r="48%"><stop stop-color="#D4AF37" stop-opacity=".55"/><stop offset="1" stop-color="#D4AF37" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#bg)"/><rect width="1200" height="675" fill="url(#g)"/>
    <path d="M92 540 C310 405 500 405 704 532 S1020 575 1120 420" fill="none" stroke="#D4AF37" stroke-width="8" opacity=".5"/>
    <rect x="92" y="96" width="486" height="380" rx="36" fill="#fff" opacity=".13" stroke="#D4AF37"/>
    <text x="132" y="196" font-family="Inter,Arial,sans-serif" font-size="52" font-weight="900" fill="#fff">${title}</text>
    <text x="132" y="272" font-family="Inter,Arial,sans-serif" font-size="30" font-weight="850" fill="#C3E1F5">Learn with Taxo</text>
    <text x="132" y="324" font-family="Tahoma,Arial,sans-serif" font-size="25" font-weight="750" fill="#fff">اتعلم اليوم... واسبق بكره</text>
    <rect x="132" y="382" width="96" height="10" rx="5" fill="#D4AF37"/><rect x="248" y="382" width="166" height="10" rx="5" fill="#D4AF37" opacity=".5"/>
    <rect x="674" y="126" width="370" height="318" rx="38" fill="#fff" opacity=".94"/><rect x="710" y="166" width="298" height="202" rx="26" fill="#EAF6FC"/>
    <circle cx="792" cy="267" r="62" fill="#123F6D" opacity=".92"/><text x="792" y="289" text-anchor="middle" font-family="Arial,sans-serif" font-size="48" font-weight="900" fill="#D4AF37">${initial}</text>
    <circle cx="760" cy="420" r="20" fill="#D4AF37"/><rect x="805" y="405" width="150" height="30" rx="15" fill="#123F6D" opacity=".82"/>
    <text x="132" y="522" font-family="Inter,Arial,sans-serif" font-size="23" font-weight="850" fill="#fff">Clear steps, friendly teachers, trusted progress.</text>
  </svg>`;
  return svgDataUri(svg);
}

const asset = (src, alt) => ({ src, alt });

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
    heroStudentLearning: asset(visuals.generalHero, 'Premium Learn with Taxo online English learning journey'),
    placementSpeakingTest: asset(visuals.placement, 'Online placement speaking test with advisor support'),
    onlineTeacherClass: asset(visuals.online, 'Live online English class with teacher and student'),
    adminDashboardManagement: asset(visuals.admin, 'Premium admin dashboard for school management'),
    paymentConfirmation: asset(visuals.payment, 'Secure payment confirmation'),
    materialsLibrary: asset(visuals.materials, 'Digital learning materials library'),
    familyScheduleGroup: asset(visuals.family, 'Family schedule and group placement portal'),
    supportAdvisor: asset(visuals.support, 'Student support advisor for learning journey'),
    englishStudyProgress: asset(visuals.progress, 'English study progress dashboard'),
    studentAchievement: asset(visuals.achievement, 'Student achievement and certificate success')
  },
  kidsPhonics: {
    familyTable: asset(visuals.phonicsFamily, 'Family phonics learning at home'),
    abcTablet: asset(visuals.phonicsFamily, 'Phonics alphabet recognition on tablet'),
    tracingTablet: asset(visuals.phonicsTracing, 'Child tracing phonics letters on tablet'),
    cvcTiles: asset(visuals.phonicsCvc, 'CVC word tiles for phonics blending'),
    readingCorner: asset(visuals.phonicsReading, 'Phonics reading practice corner'),
    onlineClass: asset(visuals.phonicsOnline, 'Live online phonics class'),
    parentChild: asset(visuals.phonicsFamily, 'Parent supporting child phonics practice'),
    progressSuccess: asset(visuals.achievement, 'Phonics progress and success dashboard'),
    pronunciation: asset(visuals.placement, 'Phonics pronunciation and sound practice'),
    gameBoard: asset(visuals.phonicsCvc, 'Phonics game board for word building')
  },
  kidsCourse: {
    speakingLesson: asset(visuals.kidsSpeaking, 'Kids English speaking lesson'),
    countingLesson: asset(visuals.kidsCounting, 'Kids English counting lesson'),
    colorsShapes: asset(visuals.kidsColors, 'Kids English colors and shapes lesson'),
    storytimeReading: asset(visuals.kidsStory, 'Kids English storytime reading lesson'),
    greetingsSpeaking: asset(visuals.kidsSpeaking, 'Kids English greetings and speaking practice'),
    sentenceBuilding: asset(visuals.materials, 'Kids English sentence building practice'),
    animalsNature: asset(visuals.family, 'Kids English animals and nature vocabulary'),
    onlineClass: asset(visuals.online, 'Kids English live online class'),
    teamGame: asset(visuals.kidsColors, 'Kids English team game and rewards'),
    achievementCertificates: asset(visuals.kidsCertificate, 'Kids English achievement certificates')
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
