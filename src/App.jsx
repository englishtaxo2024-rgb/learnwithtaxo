import { useMemo, useRef, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  Award,
  Banknote,
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  Database,
  FileText,
  Gauge,
  GraduationCap,
  Mail,
  MessageCircle,
  Mic,
  ShieldCheck,
  Star,
  Trophy,
  UploadCloud,
  UserCog,
  UserRound,
  Users,
  Wallet,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BrandLogo } from './components/ui/BrandLogo';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { SafeImage } from './components/ui/SafeImage';
import { SoundToggle } from './components/ui/SoundToggle';
import { DataTable } from './components/dashboards/DataTable';
import { visualAssets, getCourseVisual } from './data/visualAssets';
import { PlatformDataPage } from './pages/shared/PlatformDataPage';
import { platformApi } from './services/platformApi';
import { recordsApi } from './services/recordsApi';
import { useTranslation } from './hooks/useTranslation';

const teachers = [];
const students = [];
const groups = [];
const payments = [];

const priceRows = [
  { course: 'Phonics', monthly: '2000 EGP', twoMonths: '3600 EGP', threeMonths: '5200 EGP' },
  { course: 'Kids / General English', monthly: '1800 EGP', twoMonths: '3200 EGP', threeMonths: '4600 EGP' },
  { course: 'Private', monthly: '4000 EGP', twoMonths: '-', threeMonths: '10000 EGP' }
];

const placementRows = [];

function useAuthSession() {
  const [user, setUserState] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    recordsApi.me()
      .then((data) => { if (mounted) setUserState(data.user); })
      .catch(() => { if (mounted) setUserState(null); });
    return () => { mounted = false; };
  }, []);

  async function setUser(next) {
    if (!next) {
      await recordsApi.logout().catch(() => {});
      setUserState(null);
      return;
    }
    setUserState(next.user || next);
  }

  return [user, setUser];
}

function LanguageToggle() {
  const { lang, setLang } = useTranslation();
  return (
    <button className="language-toggle" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} type="button">
      {lang === 'en' ? 'AR' : 'EN'}
    </button>
  );
}

function ActionLink({ to, variant = 'primary', children }) {
  return <Link to={to} className={`btn btn-${variant}`}>{children}</Link>;
}

function PublicHeader({ user, setUser }) {
  const { t } = useTranslation();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <BrandLogo role={user?.role} />
        <nav className="public-nav" aria-label="Primary navigation">
          <Link to="/">{t.nav.home}</Link>
          <Link to="/pricing">{t.nav.pricing}</Link>
          <Link to="/how-it-works">{t.nav.howItWorks}</Link>
          <Link to="/login">{t.actions.login}</Link>
        </nav>
        <div className="header-tools">
          <LanguageToggle />
          <SoundToggle />
          {user ? <Button variant="secondary" onClick={() => setUser(null)}>{t.actions.logout}</Button> : <ActionLink to="/login" variant="gold">{t.actions.login}</ActionLink>}
        </div>
      </div>
    </header>
  );
}

function HomePage({ user, setUser }) {
  const { t, lang } = useTranslation();
  const serviceCards = [
    { key: 'placement', icon: ClipboardList, to: '/student/placement', image: visualAssets.landing.services.placement },
    { key: 'general', icon: BookOpen, to: '/student/booking?course=general', image: visualAssets.landing.services.general },
    { key: 'kids', icon: Users, to: '/student/booking?course=kids', image: visualAssets.landing.services.kids },
    { key: 'phonics', icon: Mic, to: '/student/booking?course=phonics', image: visualAssets.landing.services.phonics },
    { key: 'private', icon: UserRound, to: '/student/booking?course=private', image: visualAssets.landing.services.private }
  ];
  const steps = lang === 'ar'
    ? ['تحديد المستوى', 'اختيار الكورس', 'الحجز', 'تأكيد الدفع', 'بداية التعلم']
    : ['Placement', 'Course choice', 'Booking', 'Payment', 'Start learning'];
  const kidsVisuals = [
    ['Speaking practice', visualAssets.kidsCourse.speakingLesson],
    ['Numbers and counting', visualAssets.kidsCourse.countingLesson],
    ['Colors and shapes', visualAssets.kidsCourse.colorsShapes],
    ['Storytime reading', visualAssets.kidsCourse.storytimeReading],
    ['Greetings and confidence', visualAssets.kidsCourse.greetingsSpeaking],
    ['Sentence building', visualAssets.kidsCourse.sentenceBuilding],
    ['Animals and vocabulary', visualAssets.kidsCourse.animalsNature],
    ['Live online classes', visualAssets.kidsCourse.onlineClass],
    ['Games and rewards', visualAssets.kidsCourse.teamGame],
    ['Certificates and success', visualAssets.kidsCourse.achievementCertificates]
  ];
  const phonicsVisuals = [
    ['Family phonics start', visualAssets.kidsPhonics.familyTable],
    ['ABC recognition', visualAssets.kidsPhonics.abcTablet],
    ['Tracing letters', visualAssets.kidsPhonics.tracingTablet],
    ['CVC word building', visualAssets.kidsPhonics.cvcTiles],
    ['Reading practice', visualAssets.kidsPhonics.readingCorner],
    ['Online phonics class', visualAssets.kidsPhonics.onlineClass],
    ['Parent support', visualAssets.kidsPhonics.parentChild],
    ['Progress and confidence', visualAssets.kidsPhonics.progressSuccess],
    ['Sound pronunciation', visualAssets.kidsPhonics.pronunciation],
    ['Phonics games', visualAssets.kidsPhonics.gameBoard]
  ];

  return (
    <main>
      <PublicHeader user={user} setUser={setUser} />
      <section className="hero-section">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="container hero-grid">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <p className="eyebrow">Learn with Taxo</p>
            <h1 className="hero-title">{t.home.title}</h1>
            <p className="hero-subtitle">{t.home.subtitle}</p>
            <div className="hero-actions">
              <ActionLink to="/student/placement" variant="gold">{t.actions.startPlacement}</ActionLink>
              <a className="btn btn-secondary" href="#services">{t.actions.exploreCourses}</a>
              <ActionLink to="/login" variant="secondary">{t.actions.login}</ActionLink>
            </div>
          </motion.div>
          <Card className="hero-logo-card">
            <div className="hero-logo-inner">
              <SafeImage src={visualAssets.landing.hero.src} alt={visualAssets.landing.hero.alt} fallbackLabel="Hero image missing" hideFallback={!import.meta.env.DEV} />
            </div>
          </Card>
        </div>
      </section>

      <section id="services" className="section section-white">
        <div className="container">
          <SectionHeading title={t.home.services} subtitle={t.home.servicesAr} />
          <div className="services-grid">
            {serviceCards.map((item) => <ServiceCard key={item.key} item={item} />)}
          </div>
        </div>
      </section>

      <section className="section section-pale">
        <div className="container split-section">
          <div>
            <SectionHeading title={t.home.paths} subtitle={t.home.pathsAr} />
            <p className="section-copy">{t.home.trust}</p>
            <div className="mini-steps">
              {steps.map((step, index) => <span key={step}>{index + 1}. {step}</span>)}
            </div>
          </div>
          <SafeImage src={visualAssets.landing.learningPath.src} alt={visualAssets.landing.learningPath.alt} className="feature-image" />
        </div>
      </section>

      <section className="section section-white">
        <div className="container course-showcase">
          <VisualCourse image={visualAssets.landing.courses.liveOnline} title="Live Online Learning" titleAr="تعلم مباشر أونلاين" text="Friendly classes, clear schedules, and progress that families can follow." />
          <VisualCourse image={visualAssets.landing.courses.kidsEnglish} title="Kids English" titleAr="إنجليزي الأطفال" text="Stories, speaking, vocabulary, games, and confidence in every level." />
          <VisualCourse image={visualAssets.landing.courses.phonics} title="Phonics" titleAr="فونكس" text="Letters, sounds, blending, reading aloud, and pronunciation foundations." />
        </div>
      </section>
      <section className="section section-pale">
        <div className="container">
          <SectionHeading title="Kids English moments" subtitle="صور من رحلة الأطفال" />
          <div className="visual-gallery">
            {kidsVisuals.map(([title, image]) => (
              <Card key={title} className="visual-tile">
                <SafeImage src={image.src} alt={image.alt} />
                <h3>{title}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="section section-white">
        <div className="container">
          <SectionHeading title="Phonics learning path" subtitle="رحلة الفونكس" />
          <div className="visual-gallery">
            {phonicsVisuals.map(([title, image]) => (
              <Card key={title} className="visual-tile">
                <SafeImage src={image.src} alt={image.alt} />
                <h3>{title}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function SectionHeading({ title, subtitle }) {
  return (
    <div className="section-heading">
      <p>{subtitle}</p>
      <h2>{title}</h2>
    </div>
  );
}

function ServiceCard({ item }) {
  const { t } = useTranslation();
  const Icon = item.icon;
  const [title, text] = t.services[item.key];
  return (
    <Link to={item.to} className="service-card">
      <div className="service-image">
        <SafeImage src={item.image.src} alt={item.image.alt} fallbackIcon={Icon} fallbackLabel={title} />
      </div>
      <div className="service-content">
        <span className="service-icon"><Icon size={22} /></span>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </Link>
  );
}

function VisualCourse({ image, title, titleAr, text }) {
  return (
    <Card className="visual-course">
      <SafeImage src={image.src} alt={image.alt} />
      <div>
        <h3>{title}</h3>
        <h4 dir="rtl">{titleAr}</h4>
        <p>{text}</p>
      </div>
    </Card>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <BrandLogo compact />
        <p>LEARN WITH TAXO - Learn to Lead - اتعلم اليوم... واسبق بكره</p>
      </div>
    </footer>
  );
}

function LoginPage({ setUser, initialRole = 'student' }) {
  const navigate = useNavigate();
  const [role, setRole] = useState(initialRole);
  const [identifier, setIdentifier] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const labels = {
    admin: ['Admin Login', 'دخول الإدارة'],
    teacher: ['Teacher Login', 'دخول المعلم'],
    student: ['Student Login', 'دخول الطالب']
  };

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await recordsApi.login({ identifier, accessCode, requestedRole: role });
      await setUser(data);
      navigate(data.redirectPath || `/${data.role}`, { replace: true });
    } catch (err) {
      setError(err.message || 'This account was not found. Please check your details or contact support.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <PublicHeader />
      <section className="section section-pale login-section">
        <div className="container">
          <SectionHeading title="Secure Portal Login" subtitle="تسجيل دخول آمن" />
          <Card className="login-card secure-login-card">
            <div className="button-row">
              {Object.entries(labels).map(([key, [en, ar]]) => (
                <Button key={key} type="button" variant={role === key ? 'gold' : 'secondary'} onClick={() => setRole(key)}>
                  {en}<br /><span dir="rtl">{ar}</span>
                </Button>
              ))}
            </div>
            <form className="form-grid" onSubmit={submit}>
              <label className="form-span">
                {role === 'student' ? 'Email, phone, or student code' : 'Email or teacher code'}
                <span dir="rtl"> {role === 'student' ? 'رقم الهاتف أو كود الطالب' : 'البريد الإلكتروني أو الكود'}</span>
                <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="username" required />
              </label>
              <label className="form-span">
                Access code / Password <span dir="rtl">كود الدخول / كلمة المرور</span>
                <input value={accessCode} onChange={(event) => setAccessCode(event.target.value)} type="password" autoComplete="current-password" required />
              </label>
              {error && <p className="form-span error-text">{error}<br /><span dir="rtl">لم يتم العثور على هذا الحساب أو كود الدخول غير صحيح.</span></p>}
              <Button className="form-span" disabled={busy}>{busy ? 'Checking...' : `Open ${labels[role][0]}`}</Button>
            </form>
          </Card>
        </div>
      </section>
    </main>
  );
}

function Protected({ user, role, children }) {
  if (user === undefined) return <main className="section section-pale"><div className="container"><Card>Checking secure session...</Card></div></main>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return children;
}

function PortalLayout({ user, setUser, role, links, children }) {
  const { t } = useTranslation();
  return (
    <div className="portal-shell">
      <header className="site-header portal-header">
        <div className="container header-inner">
          <BrandLogo role={role} />
          <div className="header-tools">
            <LanguageToggle />
            <SoundToggle />
            <Button variant="secondary" onClick={() => setUser(null)}>{t.actions.logout}</Button>
          </div>
        </div>
      </header>
      <div className="portal-grid container">
        <aside className="portal-sidebar">
          {links.map((link) => {
            const LinkIcon = link.icon;
            return <Link key={link.to} to={link.to}><LinkIcon size={18} /> {link.label}</Link>;
          })}
        </aside>
        <main className="portal-main">{children}</main>
      </div>
    </div>
  );
}

function Dashboard({ role }) {
  const { t } = useTranslation();
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const config = role === 'admin'
    ? { title: t.dashboards.adminTitle, text: t.dashboards.adminText, image: visualAssets.general.adminDashboardManagement }
    : role === 'teacher'
      ? { title: t.dashboards.teacherTitle, text: t.dashboards.teacherText, image: visualAssets.teacherPortal.dashboard }
      : { title: t.dashboards.studentTitle, text: t.dashboards.studentText, image: visualAssets.studentPortal.dashboard };

  useEffect(() => {
    let active = true;
    platformApi.dashboard()
      .then((data) => {
        if (active) setStats(data.stats || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [role]);

  return (
    <div className="page-stack">
      <HeroPanel title={config.title} text={config.text} image={config.image} />
      {error && <Card className="error-state"><strong>Secure data connection</strong><p>{error}</p></Card>}
      {loading && <Card><p>Loading secure dashboard data...</p></Card>}
      <div className="stats-grid">
        {stats.map(({ label, value }) => <Card key={label} className="stat-card"><span>{label}</span><strong>{value}</strong></Card>)}
      </div>
      <div className="dashboard-cards">
        <FeaturePanel icon={ClipboardList} title="Placement" text="Level, teacher, group, and next steps are easy to follow." />
        <FeaturePanel icon={CreditCard} title="Payment" text="Receipts and transaction references stay organized for review." />
        <FeaturePanel icon={BookOpen} title="Learning" text="Homework, feedback, reports, and certificates are in one place." />
      </div>
    </div>
  );
}

function HeroPanel({ title, text, image }) {
  return (
    <Card className="portal-hero">
      <div>
        <p className="eyebrow">Learn with Taxo</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      <SafeImage src={image.src} alt={image.alt} className="portal-hero-image" />
    </Card>
  );
}

function FeaturePanel({ icon: Icon, title, text }) {
  return (
    <Card className="feature-panel">
      <span><Icon size={22} /></span>
      <h3>{title}</h3>
      <p>{text}</p>
    </Card>
  );
}

function PricingPage() {
  return (
    <main>
      <PublicHeader />
      <section className="section section-pale">
        <div className="container page-stack">
          <SectionHeading title="Pricing" subtitle="الأسعار" />
          <DataTable rows={priceRows} columns={[
            { key: 'course', label: 'Course' },
            { key: 'monthly', label: 'Monthly' },
            { key: 'twoMonths', label: '2 Months' },
            { key: 'threeMonths', label: '3 Months' }
          ]} />
        </div>
      </section>
    </main>
  );
}

function HowItWorksPage() {
  const steps = ['Start placement test', 'Receive your level', 'Choose course and teacher', 'Confirm payment', 'Start learning'];
  return (
    <main>
      <PublicHeader />
      <section className="section section-white">
        <div className="container">
          <SectionHeading title="How it works" subtitle="طريقة العمل" />
          <div className="steps-grid">{steps.map((step, index) => <Card key={step}><strong>{index + 1}</strong><h3>{step}</h3></Card>)}</div>
        </div>
      </section>
    </main>
  );
}

function PublicCoursePage({ course, titleAr }) {
  const visual = getCourseVisual(course);
  return (
    <main>
      <PublicHeader />
      <section className="section section-white">
        <div className="container page-stack">
          <HeroPanel title={course} text="Explore the course, complete placement, then choose the right schedule and learning plan." image={visual} />
          <SectionHeading title="Start your learning path" subtitle={titleAr} />
          <div className="button-row">
            <ActionLink to="/placement-test" variant="gold">Placement Test</ActionLink>
            <ActionLink to="/pricing" variant="secondary">View Pricing</ActionLink>
          </div>
        </div>
      </section>
    </main>
  );
}

function PlacementPage({ admin = false, teacher = false }) {
  const { t, lang } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [placementLanguage, setPlacementLanguage] = useState(() => localStorage.getItem('placementTestLanguage') || lang || 'en');
  const [accessCode, setPlacementAccessCode] = useState('');
  const [accessSession, setAccessSession] = useState(null);
  const [accessError, setAccessError] = useState('');
  const [profile, setProfile] = useState({
    student_name: '',
    parent_phone: '',
    age: '',
    country: '',
    course: 'General English',
    notes: ''
  });
  const [recordings, setRecordings] = useState({});
  const [recordingQuestion, setRecordingQuestion] = useState(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micError, setMicError] = useState('');
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const recordingSecondsRef = useRef(0);
  const questions = [
    { id: 'alphabet', type: 'text', text: t.placement.alphabet, helper: 'Answer yes or no, then add any letters you know.' },
    { id: 'grammar-1', type: 'text', text: 'Choose the correct sentence: She ___ to school every day.', helper: 'Write the missing word.' },
    { id: 'reading-1', type: 'text', text: 'Read this short paragraph and choose the main idea.', helper: 'Write the main idea in one sentence.' },
    { id: 'writing-1', type: 'text', text: 'Write 3 sentences about your favorite activity.', helper: 'Use complete sentences.' },
    { id: 'speaking-1', type: 'audio', text: 'What is your name, and where are you from?', helper: 'Listen, then record your answer.' },
    { id: 'speaking-2', type: 'audio', text: 'What do you usually do every day at home or school?', helper: 'Record a natural answer. Do not read from a prepared script.' },
    { id: 'speaking-3', type: 'audio', text: 'What do you eat for breakfast, and what food do you like?', helper: 'Give a natural answer with details.' },
    { id: 'speaking-4', type: 'audio', text: 'What is your favorite shop or place in town, and what do you buy there?', helper: 'Speak in complete sentences.' },
    { id: 'speaking-5', type: 'audio', text: 'What do people usually do at the airport, and what do you do before a trip?', helper: 'Try to explain the steps clearly.' },
    { id: 'speaking-6', type: 'audio', text: 'What foods do you like to eat when you go to restaurants, and why?', helper: 'Give reasons for your answer.' },
    { id: 'speaking-7', type: 'audio', text: 'What do you usually do on your vacations, and who do you spend them with?', helper: 'Talk naturally for 30 to 60 seconds.' },
    { id: 'speaking-8', type: 'audio', text: 'Tell me about a movie, story, or book you like. What happened in it?', helper: 'Try to speak for 30 to 60 seconds.' },
    { id: 'speaking-9', type: 'audio', text: 'What are your plans for the future, and what would you like to learn?', helper: 'Use future language if you can.' },
    { id: 'speaking-10', type: 'audio', text: 'What do you think makes a good teacher or a good student?', helper: 'Explain your opinion.' },
    { id: 'speaking-11', type: 'audio', text: 'Describe a problem you had before and how you solved it.', helper: 'Use past tense if you can.' },
    { id: 'speaking-12', type: 'audio', text: 'If you could change one thing about your city or school, what would you change and why?', helper: 'Give your idea and your reason.' }
  ];
  const currentQuestion = questions[step];

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const listenToQuestion = (text) => {
    if (!('speechSynthesis' in window)) {
      setMicError(t.placement.audioUnsupported);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async (questionId) => {
    setMicError('');
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setMicError(t.placement.micUnsupported);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordings((previous) => ({
          ...previous,
          [questionId]: { url, blob, seconds: recordingSecondsRef.current || 1, question: questions.find((item) => item.id === questionId)?.text }
        }));
        stream.getTracks().forEach((track) => track.stop());
        setRecordingQuestion(null);
        stopTimer();
      };
      setRecordingSeconds(0);
      recordingSecondsRef.current = 0;
      setRecordingQuestion(questionId);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((seconds) => {
          recordingSecondsRef.current = Math.min(seconds + 1, 90);
          if (seconds >= 89) {
            recorder.stop();
            return 90;
          }
          return seconds + 1;
        });
      }, 1000);
      recorder.start();
    } catch (error) {
      setMicError(t.placement.micBlocked);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
  };

  const choosePlacementLanguage = (nextLanguage) => {
    setPlacementLanguage(nextLanguage);
    localStorage.setItem('placementTestLanguage', nextLanguage);
  };

  const verifyPlacementCode = async (event) => {
    event.preventDefault();
    setAccessError('');
    try {
      const result = await platformApi.post('/api/placement/verify', {
        code: accessCode,
        language: placementLanguage
      });
      setAccessSession(result);
    } catch (error) {
      setAccessError(error.message);
    }
  };

  const submitPlacementAttempt = async () => {
    setSubmitting(true);
    setAccessError('');
    try {
      const audioUrls = [];
      for (const [questionId, recording] of Object.entries(recordings)) {
        if (!recording?.blob) continue;
        const form = new FormData();
        form.append('audio', recording.blob, `${questionId}.webm`);
        form.append('codeId', accessSession.codeId);
        form.append('attemptToken', accessSession.attemptToken);
        form.append('questionId', questionId);
        const uploaded = await platformApi.upload('/api/placement/audio', form);
        audioUrls.push({ question_id: questionId, url: uploaded.url, file_id: uploaded.fileId });
      }
      await platformApi.post('/api/placement/submit', {
        codeId: accessSession.codeId,
        attemptToken: accessSession.attemptToken,
        ...profile,
        language: placementLanguage,
        audio_urls: audioUrls,
        answers: questions.map((question) => ({
          question_id: question.id,
          type: question.type,
          answer: answers[question.id] || '',
          has_audio: Boolean(recordings[question.id])
        }))
      });
      setSubmitted(true);
    } catch (error) {
      setAccessError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (admin || teacher) {
    const rows = teacher ? placementRows.filter((item) => item.teacher === teachers[0].name) : placementRows;
    return (
      <div className="page-stack">
        <HeroPanel title={teacher ? 'Assigned Placement Tests' : 'Placement Test Review'} text={teacher ? 'Review only placement tests assigned to you.' : 'Review submissions, assign levels, teachers, and groups.'} image={teacher ? visualAssets.teacherPortal.assignedMaterial : visualAssets.studentPortal.placementTest} />
        <DataTable rows={rows} columns={[
          { key: 'id', label: 'ID' },
          { key: 'student', label: 'Student' },
          { key: 'type', label: 'Type' },
          { key: 'status', label: 'Status' },
          { key: 'level', label: 'Level' },
          { key: 'teacher', label: 'Teacher' }
        ]} />
        <Card>
          <h2>Review tools</h2>
          <div className="form-grid">
            <select><option>Under Review</option><option>Level Assigned</option><option>Contacted</option></select>
            <input placeholder="Estimated level" />
            <input placeholder="Assigned teacher" />
            <input placeholder="Assigned group" />
            <textarea className="form-span" placeholder={teacher ? 'Teacher feedback' : 'Admin notes'} />
            <Button className="form-span">{t.actions.save}</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!accessSession) {
    return (
      <div className="page-stack">
        <HeroPanel title={placementLanguage === 'ar' ? 'اختبار تحديد المستوى' : t.placement.title} text={placementLanguage === 'ar' ? 'اختر لغة الاختبار ثم أدخل كود الدخول الخاص.' : 'Choose your test language, then enter your private access code.'} image={visualAssets.studentPortal.placementTest} />
        <Card>
          <form className="form-grid" onSubmit={verifyPlacementCode}>
            <div className="form-span button-row">
              <Button type="button" variant={placementLanguage === 'en' ? 'gold' : 'secondary'} onClick={() => choosePlacementLanguage('en')}>English</Button>
              <Button type="button" variant={placementLanguage === 'ar' ? 'gold' : 'secondary'} onClick={() => choosePlacementLanguage('ar')}>العربية</Button>
            </div>
            <label className="form-span">
              {placementLanguage === 'ar' ? 'كود الدخول الخاص' : 'Private access code'}
              <input
                value={accessCode}
                onChange={(event) => setPlacementAccessCode(event.target.value)}
                autoComplete="one-time-code"
                required
              />
            </label>
            {accessError && <p className="form-span form-error">{accessError}</p>}
            <Button className="form-span" variant="gold">
              {placementLanguage === 'ar' ? 'ابدأ الاختبار' : 'Begin my test'}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="page-stack">
        <Card className="success-card">
          <SafeImage src={visualAssets.studentPortal.certificate.src} alt={visualAssets.studentPortal.certificate.alt} />
          <h1>{t.placement.success}</h1>
          <div className="hero-actions">
            <ActionLink to="/student" variant="gold">Go to Student Portal</ActionLink>
            <ActionLink to="/login" variant="secondary">Contact Support</ActionLink>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <HeroPanel title={t.placement.title} text={t.placement.intro} image={visualAssets.studentPortal.placementTest} />
      <Card>
        <form className="form-grid" onSubmit={(event) => { event.preventDefault(); }}>
          <input value={profile.student_name} onChange={(event) => setProfile((current) => ({ ...current, student_name: event.target.value }))} placeholder="Student full name" required />
          <input value={profile.parent_phone} onChange={(event) => setProfile((current) => ({ ...current, parent_phone: event.target.value }))} placeholder="Parent WhatsApp number" required />
          <input value={profile.age} onChange={(event) => setProfile((current) => ({ ...current, age: event.target.value }))} placeholder="Student age" required />
          <input value={profile.country} onChange={(event) => setProfile((current) => ({ ...current, country: event.target.value }))} placeholder="Country" />
          <select value={profile.course} onChange={(event) => setProfile((current) => ({ ...current, course: event.target.value }))}><option>General English</option><option>Kids English</option><option>Phonics</option><option>Grammar</option><option>Speaking</option></select>
          <input value={accessSession.codeId} readOnly aria-label="Verified placement code" />
          <textarea value={profile.notes} onChange={(event) => setProfile((current) => ({ ...current, notes: event.target.value }))} className="form-span" placeholder="Notes" />
        </form>
      </Card>
      <Card className="placement-card">
        <p className="eyebrow">Question {step + 1} / {questions.length}</p>
        <h2>{currentQuestion.text}</h2>
        <p className="question-helper">{currentQuestion.helper}</p>
        <div className="placement-controls">
          <Button variant="secondary" onClick={() => listenToQuestion(currentQuestion.text)}>{t.placement.listen}</Button>
          {currentQuestion.type === 'audio' && (
            recordingQuestion === currentQuestion.id ? (
              <Button variant="gold" className="recording-pulse" onClick={stopRecording}>{t.placement.stop} {recordingSeconds}s</Button>
            ) : (
              <Button onClick={() => startRecording(currentQuestion.id)}>{recordings[currentQuestion.id] ? t.placement.rerecord : t.placement.record}</Button>
            )
          )}
          {recordings[currentQuestion.id]?.url && (
            <audio controls src={recordings[currentQuestion.id].url} />
          )}
        </div>
        {micError && <p className="form-error">{micError}</p>}
        {currentQuestion.type === 'text' ? (
          <textarea
            placeholder="Your answer"
            value={answers[currentQuestion.id] || ''}
            onChange={(event) => setAnswers((previous) => ({ ...previous, [currentQuestion.id]: event.target.value }))}
          />
        ) : (
          <div className="speaking-note">
            <Mic size={24} />
            <span>{t.placement.voiceLinked}</span>
          </div>
        )}
        <div className="button-row">
          <Button variant="secondary" onClick={() => setStep(Math.max(0, step - 1))}>{t.actions.previous}</Button>
          <Button variant="secondary" onClick={() => setStep(Math.min(questions.length - 1, step + 1))}>{t.actions.skip}</Button>
          {step < questions.length - 1 ? <Button onClick={() => setStep(step + 1)}>{t.actions.next}</Button> : <Button variant="gold" disabled={submitting || !profile.student_name || !profile.parent_phone || !profile.age} onClick={submitPlacementAttempt}>{submitting ? 'Submitting...' : t.actions.submit}</Button>}
        </div>
        {accessError && <p className="form-error">{accessError}</p>}
      </Card>
    </div>
  );
}

function BookingPage() {
  const { t } = useTranslation();
  return (
    <div className="page-stack">
      <HeroPanel title={t.nav.booking} text={t.pages.booking} image={visualAssets.studentPortal.booking} />
      <div className="cards-grid">
        {['General English', 'Kids English', 'Phonics', 'Private Classes'].map((course) => (
          <Card key={course}>
            <SafeImage src={getCourseVisual(course).src} alt={course} />
            <h3>{course}</h3>
            <p>{course === 'Private Classes' ? 'One-to-one lessons with a personalized plan.' : 'Group and private options are separated by level, teacher, age, and capacity.'}</p>
            <ActionLink to="/student/payment" variant="gold">Choose plan</ActionLink>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PaymentPage({ admin = false }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submitPayment(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus('');
    try {
      const form = new FormData(event.currentTarget);
      await platformApi.post('/api/payments', Object.fromEntries(form.entries()));
      event.currentTarget.reset();
      setStatus('Your payment request was submitted for review.');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (admin) {
    return (
      <div className="page-stack">
        <HeroPanel title="Payment Approvals" text="Review submitted receipts, transaction references, and booking details." image={visualAssets.general.paymentConfirmation} />
        <div className="filters-row"><input placeholder="Filter by group" /><input placeholder="Filter by teacher" /><select><option>All statuses</option><option>Paid</option><option>Pending Review</option><option>Rejected</option></select></div>
        <DataTable rows={payments} columns={[
          { key: 'student_name', label: 'Student' },
          { key: 'student_id', label: 'Student ID' },
          { key: 'group_name', label: 'Group' },
          { key: 'teacher_name', label: 'Teacher' },
          { key: 'amount', label: 'Amount' },
          { key: 'payment_method', label: 'Method' },
          { key: 'status', label: 'Status' }
        ]} />
        <Card><div className="button-row"><Button variant="gold">{t.actions.approve}</Button><Button variant="danger">{t.actions.reject}</Button><Button>{t.actions.pending}</Button></div></Card>
      </div>
    );
  }
  return (
    <div className="page-stack">
      <HeroPanel title={t.payment.title} text={t.payment.intro} image={visualAssets.studentPortal.payment} />
      <div className="payment-flow">{t.payment.flow.map((item) => <span key={item}>{item}</span>)}</div>
      <DataTable rows={priceRows} columns={[{ key: 'course', label: 'Course' }, { key: 'monthly', label: 'Monthly' }, { key: 'twoMonths', label: '2 Months' }, { key: 'threeMonths', label: '3 Months' }]} />
      <Card>
        <h2>{t.actions.uploadProof}</h2>
        <p>Vodafone Cash: 01099394756. Bank: NBE - Mansoura Army street branch. IBAN: EG640003046030116261476000150.</p>
        <form className="form-grid" onSubmit={submitPayment}>
          <select name="plan" required><option value="monthly">Monthly</option><option value="2-months">2 Months</option><option value="3-months">3 Months</option></select>
          <select name="method" required><option>EasyKash</option><option>Vodafone Cash</option><option>Bank transfer</option><option>InstaPay</option><option>Exchange office transfer</option><option>STC transfer</option></select>
          <input name="transaction_reference" placeholder={t.actions.transactionReference} required />
          <input name="proof_url" type="url" placeholder="Protected receipt link (optional)" />
          {status && <p className="form-span">{status}</p>}
          <Button className="form-span" variant="gold" disabled={submitting}>{submitting ? 'Submitting...' : t.actions.uploadProof}</Button>
        </form>
      </Card>
    </div>
  );
}

function StudentProfilePage() {
  const student = students[0];
  const tabs = ['Overview', 'Placement Result', 'Schedule', 'Payment', 'Attendance', 'Homework', 'Session Scores', 'Feedback', 'Final Test', 'Reports', 'Certificates', 'Chat'];
  return (
    <div className="page-stack">
      <HeroPanel title={student.name} text={`${student.course} - ${student.level} - ${student.group}`} image={visualAssets.studentPortal.profile} />
      <div className="tabs-grid">{tabs.map((tab) => <Card key={tab}><h3>{tab}</h3><p>{profileText(tab, student)}</p></Card>)}</div>
    </div>
  );
}

function profileText(tab, student) {
  const map = {
    Overview: `${student.id} - Parent: ${student.parent} - Phone: ${student.phone}`,
    'Placement Result': `${student.cefr} - recommended ${student.course}`,
    Schedule: `${student.next} - ${student.link}`,
    Payment: student.payment,
    Attendance: student.attendance,
    Homework: student.homework,
    'Session Scores': 'Homework 5/5, participation 5/5, camera full session: yes',
    Feedback: 'Latest session feedback is ready after each class.',
    'Final Test': 'Opens after the final attended session.',
    Reports: 'Parent reports appear here.',
    Certificates: 'Certificates appear here when eligible.',
    Chat: 'Internal group chat for your group only.'
  };
  return map[tab] || 'Ready';
}

function StudentFeedbackPage() {
  const { t } = useTranslation();
  return (
    <div className="page-stack">
      <HeroPanel title={t.nav.feedback} text={t.pages.studentFeedback} image={visualAssets.studentPortal.feedback} />
      <Card>
        <div className="form-grid">
          {['Overall rate', 'Teacher internet stability', 'Teacher voice clarity', 'Camera quality', 'Lighting quality', 'Dress code', 'Used games', 'Everyone read', 'Everyone wrote', 'Everyone spoke', 'Equal treatment', 'Session was fun'].map((label) => <select key={label}><option>{label}: 5</option><option>{label}: 4</option><option>{label}: 3</option></select>)}
          <textarea className="form-span" placeholder="Comment" />
          <Button className="form-span">{t.actions.submit}</Button>
        </div>
      </Card>
    </div>
  );
}

function TeacherFeedbackPage() {
  const { t } = useTranslation();
  return (
    <div className="page-stack">
      <HeroPanel title={t.nav.feedback} text={t.pages.teacherFeedback} image={visualAssets.teacherPortal.feedback} />
      <div className="dashboard-cards">
        <FeaturePanel icon={Star} title="Rating summary" text="Average 4.8 from assigned students." />
        <FeaturePanel icon={MessageCircle} title="Session comments" text="Students mentioned clear voice and fun activities." />
        <FeaturePanel icon={ShieldCheck} title="Quality notes" text="Strong engagement, stable internet, and balanced participation." />
      </div>
    </div>
  );
}

function TeacherProfilesPage({ admin = false, image }) {
  return (
    <div className="page-stack">
      <HeroPanel title={admin ? 'Teachers' : 'Teacher Profiles'} text="Approved teacher profiles with levels, age groups, availability, ratings, and public visibility." image={image || (admin ? visualAssets.teacherPortal.students : visualAssets.studentPortal.chooseTeacher)} />
      <div className="teacher-grid">{teachers.map((teacher) => <Card key={teacher.id} className="teacher-card"><SafeImage src={teacher.photo} alt={teacher.name} /><h3>{teacher.name}</h3><p>{teacher.bio}</p><p><b>Email:</b> {teacher.email}</p><p><b>Courses:</b> {teacher.courses}</p><p><b>Levels:</b> {teacher.levels}</p><p><b>Ages:</b> {teacher.ageGroups}</p><p><b>Rating:</b> {teacher.rating}</p><span className="status-pill">{teacher.status} - {teacher.visibility}</span></Card>)}</div>
    </div>
  );
}

function MaterialsPage({ role }) {
  return (
    <div className="page-stack">
      <HeroPanel title={role === 'admin' ? 'Material Management' : role === 'teacher' ? 'Assigned Material' : 'Course Material'} text={role === 'admin' ? 'Upload and organize lessons, slide images, audio, notes, and course files.' : 'View the lessons assigned to your course and group.'} image={role === 'teacher' ? visualAssets.teacherPortal.assignedMaterial : visualAssets.general.materialsLibrary} />
      {role === 'admin' && <Card><h2>Upload material</h2><form className="form-grid"><input placeholder="Course" /><input placeholder="Level" /><input placeholder="Session" /><input type="file" multiple accept="image/*,.pdf,.ppt,.pptx,audio/*" /><textarea className="form-span" placeholder="Teacher notes" /><Button className="form-span">Upload material</Button></form></Card>}
      <Card className="material-viewer"><aside>{['Session 1', 'Session 2', 'Session 3'].map((session) => <button key={session}>{session}</button>)}</aside><main><SafeImage src={role === 'teacher' ? visualAssets.kidsPhonics.onlineClass.src : visualAssets.general.materialsLibrary.src} alt="Course material viewer" /><p>Watermarked lesson viewer</p></main></Card>
    </div>
  );
}

function AssetManagerPage() {
  const [assets, setAssets] = useState([]);
  return (
    <div className="page-stack">
      <HeroPanel title="Asset Manager" text="Upload, preview, tag, and approve website assets." image={visualAssets.general.materialsLibrary} />
      <Card>
        <form className="form-grid" onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const file = form.get('file');
          if (file?.name) setAssets((current) => [...current, { name: file.name, type: form.get('type'), date: new Date().toLocaleString(), status: 'Pending approval' }]);
          event.currentTarget.reset();
        }}>
          <select name="type"><option>logo</option><option>teacher_photo</option><option>material_slide</option><option>certificate</option><option>report</option><option>teacher_video</option></select>
          <input name="file" type="file" accept="image/*,video/*,.pdf" />
          <Button className="form-span">Upload asset</Button>
        </form>
      </Card>
      <DataTable rows={assets} columns={[{ key: 'name', label: 'File' }, { key: 'type', label: 'Type' }, { key: 'date', label: 'Uploaded' }, { key: 'status', label: 'Status' }]} />
    </div>
  );
}

function DataSourcesPage() {
  const { t } = useTranslation();
  const rows = [
    { source: 'Curriculum sheet', status: 'Ready', last: 'Today', imported: 128, review: 3 },
    { source: 'Schedule sheet', status: 'Ready', last: 'Today', imported: 42, review: 5 },
    { source: 'New Applications sheet', status: t.pages.dataSourcesNote, last: '-', imported: 0, review: 0 }
  ];
  return (
    <div className="page-stack">
      <HeroPanel title="Data Sources" text="Review connection status and import activity." image={visualAssets.general.adminDashboardManagement} />
      <div className="button-row"><Button>Sync Curriculum</Button><Button>Sync Schedule</Button><Button>Sync New Applications</Button><Button variant="gold">Sync All</Button></div>
      <DataTable rows={rows} columns={[{ key: 'source', label: 'Source' }, { key: 'status', label: 'Status' }, { key: 'last', label: 'Last sync' }, { key: 'imported', label: 'Rows imported' }, { key: 'review', label: 'Needs review' }]} />
    </div>
  );
}

function CodeManagerPage({ type = 'placement' }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setResult(null);
    try {
      const values = Object.fromEntries(new FormData(event.currentTarget).entries());
      const payload = type === 'placement'
        ? await platformApi.post('/api/placement/admin/codes', values)
        : await platformApi.post('/api/admin/auth-codes/generate', values);
      setResult(payload);
      event.currentTarget.reset();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-stack">
      <HeroPanel
        title={type === 'placement' ? 'Placement Access Codes' : 'Portal Access Codes'}
        text="Generate a private one-time code. The plain code is shown only in this response; only its hash is stored."
        image={visualAssets.general.adminDashboardManagement}
      />
      <Card>
        <form className="form-grid" onSubmit={submit}>
          {type === 'placement' ? (
            <>
              <input name="student_id" placeholder="Student ID (optional)" />
              <input name="student_name" placeholder="Student name (optional)" />
              <input name="expires_at" type="datetime-local" />
            </>
          ) : (
            <>
              <select name="role" required><option value="teacher">Teacher</option><option value="student">Student</option><option value="admin">Admin</option></select>
              <input name="userId" placeholder="Teacher ID, Student ID, or admin-saga" required />
            </>
          )}
          <Button className="form-span" disabled={saving}>{saving ? 'Generating...' : 'Generate private code'}</Button>
        </form>
        {error && <p className="form-error">{error}</p>}
        {result?.code && <p><strong>Private code:</strong> <code>{result.code}</code></p>}
        {result?.accessCode && <p><strong>Private code:</strong> <code>{result.accessCode}</code></p>}
      </Card>
    </div>
  );
}

function StudentsPage({ teacher = false }) {
  const rows = teacher ? students.filter((student) => student.teacher === teachers[0].name) : students;
  return (
    <div className="page-stack">
      <HeroPanel title={teacher ? 'My Students' : 'Students'} text="Student profiles, groups, levels, attendance, homework, and payment status." image={teacher ? visualAssets.teacherPortal.students : visualAssets.general.familyScheduleGroup} />
      <DataTable rows={rows} columns={[{ key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }, { key: 'course', label: 'Course' }, { key: 'level', label: 'Level' }, { key: 'teacher', label: 'Teacher' }, { key: 'payment', label: 'Payment' }]} />
    </div>
  );
}

function GroupsPage({ teacher = false }) {
  const rows = teacher ? groups.filter((group) => group.teacher === teachers[0].name) : groups;
  return (
    <div className="page-stack">
      <HeroPanel title="Groups and schedules" text="Group capacity, course, teacher, days, time, material, and students." image={teacher ? visualAssets.teacherPortal.schedule : visualAssets.general.familyScheduleGroup} />
      <DataTable rows={rows} columns={[{ key: 'name', label: 'Group' }, { key: 'teacher', label: 'Teacher' }, { key: 'course', label: 'Course' }, { key: 'days', label: 'Days' }, { key: 'time', label: 'Time' }, { key: 'students', label: 'Students' }, { key: 'capacity', label: 'Capacity' }]} />
    </div>
  );
}

function AttendancePage() {
  return (
    <div className="page-stack">
      <HeroPanel title="Attendance" text="Mark present, absent, late, homework score, participation, camera status, and notes." image={visualAssets.teacherPortal.attendance} />
      <DataTable rows={students.filter((student) => student.teacher === teachers[0].name)} columns={[{ key: 'name', label: 'Student' }, { key: 'group', label: 'Group' }, { key: 'attendance', label: 'Attendance' }, { key: 'homework', label: 'Homework' }]} />
      <Card><div className="form-grid"><select><option>Present</option><option>Absent</option><option>Late</option></select><select><option>Homework 5</option><option>Homework 4</option><option>Homework 3</option></select><select><option>Participation 5</option><option>Participation 4</option></select><select><option>Camera full session: Yes</option><option>Camera full session: No</option></select><textarea className="form-span" placeholder="Notes" /><Button className="form-span">Save attendance</Button></div></Card>
    </div>
  );
}

function PricingManager() {
  return (
    <div className="page-stack">
      <HeroPanel title="Prices and Discounts" text="Edit course prices and sibling or friends discounts." image={visualAssets.general.paymentConfirmation} />
      <DataTable rows={priceRows} columns={[{ key: 'course', label: 'Course' }, { key: 'monthly', label: 'Monthly' }, { key: 'twoMonths', label: '2 Months' }, { key: 'threeMonths', label: '3 Months' }]} />
    </div>
  );
}

function GenericPage({ title, text, icon: Icon = FileText, image = visualAssets.general.englishStudyProgress }) {
  return (
    <div className="page-stack">
      <HeroPanel title={title} text={text || 'Everything you need for this step is organized here.'} image={image} />
      <div className="cards-grid">
        <FeaturePanel icon={Icon} title="Current status" text="Ready and organized for this portal area." />
        <FeaturePanel icon={Bell} title="Next step" text="Follow the highlighted action or check with support." />
        <FeaturePanel icon={ShieldCheck} title="Access" text="This page is shown only to the correct role." />
      </div>
    </div>
  );
}

function RoleRoutes({ user, setUser, role, links }) {
  const { t } = useTranslation();
  const wrap = (node) => <Protected user={user} role={role}><PortalLayout user={user} setUser={setUser} role={role} links={links}>{node}</PortalLayout></Protected>;
  if (role === 'student') {
    return (
      <>
        <Route path="/student" element={wrap(<Dashboard role="student" />)} />
        <Route path="/student/guide" element={wrap(<GenericPage title={t.nav.guide} text={t.pages.studentGuide} icon={ClipboardCheck} image={visualAssets.studentPortal.guide} />)} />
        <Route path="/student/placement" element={wrap(<PlacementPage />)} />
        <Route path="/student/booking" element={wrap(<BookingPage />)} />
        <Route path="/student/teachers" element={wrap(<PlatformDataPage title="Eligible Teachers" titleAr="المعلمون المتاحون" description="Active teachers matching your course and level." descriptionAr="المعلمون النشطون المناسبون للكورس والمستوى." endpoint="/api/teachers/eligible" />)} />
        <Route path="/student/payment" element={wrap(<PaymentPage />)} />
        <Route path="/student/profile" element={wrap(<PlatformDataPage title="My Profile" titleAr="ملفي الشخصي" description="Your secure account, course, level, group, and teacher details." descriptionAr="بيانات حسابك والكورس والمستوى والجروب والمعلم." endpoint="/api/profile/me" />)} />
        <Route path="/student/schedule" element={wrap(<PlatformDataPage title="My Schedule" titleAr="جدولي" description="Your assigned classes from the secure Sheets system." descriptionAr="حصصك المخصصة من نظام Google Sheets الآمن." endpoint="/api/schedule/me" />)} />
        <Route path="/student/materials" element={wrap(<PlatformDataPage title="My Materials" titleAr="المواد التعليمية" description="PDFs and study files assigned to your active course and level." descriptionAr="ملفات PDF والمواد المخصصة للكورس والمستوى الحالي." endpoint="/api/materials/me" />)} />
        <Route path="/student/homework" element={wrap(<PlatformDataPage title="My Homework" titleAr="الواجب" description="Assignments for your course, level, and group." descriptionAr="الواجبات المخصصة للكورس والمستوى والجروب." endpoint="/api/homework/me" />)} />
        <Route path="/student/results" element={wrap(<PlatformDataPage title="My Results" titleAr="نتائجي" description="Test results, certificates, and language reports." descriptionAr="نتائج الاختبارات والشهادات وتقارير مستوى اللغة." endpoint="/api/students/me/results" />)} />
        <Route path="/student/games" element={wrap(<PlatformDataPage title="Practice Games" titleAr="ألعاب تدريبية" description="Games assigned to your account or group." descriptionAr="الألعاب المخصصة لحسابك أو الجروب." endpoint="/api/games/me" />)} />
        <Route path="/student/practice" element={wrap(<PlatformDataPage title="Recommended Practice" titleAr="تدريبات مقترحة" description="Extra practice based on your current weak points." descriptionAr="تدريبات إضافية مبنية على نقاط الضعف الحالية." endpoint="/api/practice/me" />)} />
        <Route path="/student/feedback" element={wrap(<StudentFeedbackPage />)} />
        <Route path="/student/final-test" element={wrap(<GenericPage title={t.nav.finalTest} text={t.pages.finalTest} icon={Award} image={visualAssets.studentPortal.finalTest} />)} />
        <Route path="/student/reports" element={wrap(<PlatformDataPage title="Language Reports" titleAr="تقارير مستوى اللغة" description="Your generated language reports and recommendations." descriptionAr="تقارير مستواك والتوصيات الخاصة بك." endpoint="/api/students/me/results" />)} />
        <Route path="/student/certificate" element={wrap(<PlatformDataPage title="Certificates" titleAr="الشهادات" description="Certificates issued for your completed levels." descriptionAr="الشهادات الصادرة للمستويات التي أكملتها." endpoint="/api/students/me/results" />)} />
        <Route path="/student/chat" element={wrap(<GenericPage title={t.nav.chat} text={t.pages.chat} icon={MessageCircle} image={visualAssets.studentPortal.chat} />)} />
      </>
    );
  }
  if (role === 'teacher') {
    return (
      <>
        <Route path="/teacher" element={wrap(<Dashboard role="teacher" />)} />
        <Route path="/teacher/profile" element={wrap(<PlatformDataPage title="My Profile" titleAr="ملفي الشخصي" description="Your secure teacher account and assignments." descriptionAr="حساب المعلم والمهام المخصصة." endpoint="/api/profile/me" />)} />
        <Route path="/teacher/availability" element={wrap(<PlatformDataPage title="Teacher Availability" titleAr="مواعيد المعلم" description="Set and review your available teaching slots." descriptionAr="حددي وراجعي مواعيدك المتاحة للتدريس." endpoint="/api/availability/me" availabilityForm />)} />
        <Route path="/teacher/schedule" element={wrap(<PlatformDataPage title="My Schedule" titleAr="الجدول" description="Your assigned groups and sessions." descriptionAr="الجروبات والحصص المخصصة لك." endpoint="/api/schedule/me" />)} />
        <Route path="/teacher/material" element={wrap(<PlatformDataPage title="Assigned Materials" titleAr="المواد التعليمية" description="Teacher-only materials assigned to your sessions." descriptionAr="المواد المخصصة للحصص الخاصة بك." endpoint="/api/materials/me" />)} />
        <Route path="/teacher/materials" element={wrap(<PlatformDataPage title="Assigned Materials" titleAr="المواد التعليمية" description="Teacher-only materials assigned to your sessions." descriptionAr="المواد المخصصة للحصص الخاصة بك." endpoint="/api/materials/me" />)} />
        <Route path="/teacher/attendance" element={wrap(<PlatformDataPage title="Attendance" titleAr="الحضور" description="Attendance records for your assigned students." descriptionAr="سجلات حضور الطلاب المخصصين لك." endpoint="/api/attendance/me" />)} />
        <Route path="/teacher/homework" element={wrap(<PlatformDataPage title="Homework Submissions" titleAr="تسليمات الواجب" description="Submissions from students assigned to your groups." descriptionAr="تسليمات الطلاب المخصصين لجروباتك." endpoint="/api/teachers/me/homework" />)} />
        <Route path="/teacher/results" element={wrap(<PlatformDataPage title="Student Results" titleAr="نتائج الطلاب" description="Results for your assigned students only." descriptionAr="نتائج الطلاب المخصصين لك فقط." endpoint="/api/teachers/me/results" />)} />
        <Route path="/teacher/curriculum/temporary" element={wrap(<PlatformDataPage title="Temporary Curriculum" titleAr="المنهج المؤقت" description="Current curriculum from our Google Sheets system." descriptionAr="المنهج الحالي من نظام Google Sheets الخاص بنا." endpoint="/api/curriculum/temporary/me" />)} />
        <Route path="/teacher/games" element={wrap(<PlatformDataPage title="Session Games" titleAr="ألعاب الحصة" description="Games generated for your assigned sessions." descriptionAr="الألعاب المنشأة للحصص المخصصة لك." endpoint="/api/games/me" />)} />
        <Route path="/teacher/revision-quizzes" element={wrap(<PlatformDataPage title="Revision Quizzes" titleAr="اختبارات المراجعة" description="Two-to-three minute session warm-up quizzes." descriptionAr="اختبارات مراجعة سريعة لمدة دقيقتين إلى ثلاث دقائق." endpoint="/api/revision-quizzes/me" />)} />
        <Route path="/teacher/feedback" element={wrap(<TeacherFeedbackPage />)} />
        <Route path="/teacher/students" element={wrap(<PlatformDataPage title="My Students" titleAr="طلابي" description="Students assigned to your groups only." descriptionAr="الطلاب المخصصون لجروباتك فقط." endpoint="/api/teachers/me/students" />)} />
        <Route path="/teacher/student/:id" element={wrap(<PlatformDataPage title="Student Profile" titleAr="ملف الطالب" description="Assigned student information is available through the student list." descriptionAr="بيانات الطالب المخصص متاحة من قائمة الطلاب." endpoint="/api/teachers/me/students" />)} />
        <Route path="/teacher/salary" element={wrap(<GenericPage title={t.nav.salary} icon={Wallet} image={visualAssets.teacherPortal.salary} />)} />
        <Route path="/teacher/chat" element={wrap(<GenericPage title={t.nav.chat} icon={MessageCircle} image={visualAssets.teacherPortal.chat} />)} />
        <Route path="/teacher/vacation" element={wrap(<GenericPage title={t.nav.vacation} icon={CalendarDays} image={visualAssets.teacherPortal.vacation} />)} />
        <Route path="/teacher/placement-tests" element={wrap(<PlatformDataPage title="Assigned Placement Tests" titleAr="اختبارات تحديد المستوى" description="Placement results for students assigned to you." descriptionAr="نتائج تحديد المستوى للطلاب المخصصين لك." endpoint="/api/placement/teacher/results" />)} />
        <Route path="/teacher/placement-tests/:id" element={wrap(<PlatformDataPage title="Assigned Placement Tests" titleAr="اختبارات تحديد المستوى" description="Placement results for students assigned to you." descriptionAr="نتائج تحديد المستوى للطلاب المخصصين لك." endpoint="/api/placement/teacher/results" />)} />
      </>
    );
  }
  return (
    <>
      <Route path="/admin" element={wrap(<Dashboard role="admin" />)} />
      <Route path="/admin/students" element={wrap(<PlatformDataPage title="Students" titleAr="الطلاب" description="Active student directory from Google Sheets." descriptionAr="دليل الطلاب النشطين من Google Sheets." endpoint="/api/admin/students" />)} />
      <Route path="/admin/student/:id" element={wrap(<PlatformDataPage title="Students" titleAr="الطلاب" description="Use the secure student directory to locate this record." descriptionAr="استخدم دليل الطلاب الآمن للوصول إلى السجل." endpoint="/api/admin/students" />)} />
      <Route path="/admin/manual-student-add" element={wrap(<GenericPage title={t.nav.manualAdd} icon={UserRound} />)} />
      <Route path="/admin/placement-codes" element={wrap(<CodeManagerPage type="placement" />)} />
      <Route path="/admin/auth-codes" element={wrap(<CodeManagerPage type="auth" />)} />
      <Route path="/admin/teachers" element={wrap(<PlatformDataPage title="Teachers" titleAr="المعلمون" description="Active teacher directory from Google Sheets." descriptionAr="دليل المعلمين النشطين من Google Sheets." endpoint="/api/admin/teachers" />)} />
      <Route path="/admin/teacher/:id" element={wrap(<PlatformDataPage title="Teachers" titleAr="المعلمون" description="Use the secure teacher directory to locate this record." descriptionAr="استخدم دليل المعلمين الآمن للوصول إلى السجل." endpoint="/api/admin/teachers" />)} />
      <Route path="/admin/schedules" element={wrap(<PlatformDataPage title="Schedules" titleAr="الجداول" description="All schedule rows from the configured Google Sheet." descriptionAr="كل صفوف الجدول من Google Sheet المربوط." endpoint="/api/schedule/me" />)} />
      <Route path="/admin/current-sessions" element={wrap(<GenericPage title={t.nav.currentSessions} icon={Gauge} />)} />
      <Route path="/admin/payments" element={wrap(<PlatformDataPage title="Payments" titleAr="المدفوعات" description="Website payment requests synchronized with the financial workflow." descriptionAr="طلبات الدفع من الموقع والمتزامنة مع النظام المالي." endpoint="/api/admin/payments" />)} />
      <Route path="/admin/finance" element={wrap(<GenericPage title={t.nav.finance} icon={Banknote} />)} />
      <Route path="/admin/prices" element={wrap(<PricingManager />)} />
      <Route path="/admin/material" element={wrap(<PlatformDataPage title="Materials Management" titleAr="إدارة المواد التعليمية" description="Protected material index from Google Sheets and Drive." descriptionAr="فهرس المواد الآمن من Google Sheets وGoogle Drive." endpoint="/api/materials/me" />)} />
      <Route path="/admin/materials" element={wrap(<PlatformDataPage title="Materials Management" titleAr="إدارة المواد التعليمية" description="Protected material index from Google Sheets and Drive." descriptionAr="فهرس المواد الآمن من Google Sheets وGoogle Drive." endpoint="/api/materials/me" />)} />
      <Route path="/admin/tests" element={wrap(<GenericPage title={t.nav.tests} icon={Award} />)} />
      <Route path="/admin/homework" element={wrap(<PlatformDataPage title="Homework Management" titleAr="إدارة الواجب" description="Assignments, submissions, scores, and review flags." descriptionAr="الواجبات والتسليمات والدرجات وحالات المراجعة." endpoint="/api/admin/homework" />)} />
      <Route path="/admin/results" element={wrap(<PlatformDataPage title="Results" titleAr="النتائج" description="All test results from website and Forms synchronization." descriptionAr="كل نتائج الاختبارات من الموقع ومزامنة Google Forms." endpoint="/api/admin/results" />)} />
      <Route path="/admin/reports" element={wrap(<PlatformDataPage title="Language Reports" titleAr="تقارير مستوى اللغة" description="Generated language reports and review status." descriptionAr="تقارير مستوى اللغة وحالة المراجعة." endpoint="/api/admin/results" />)} />
      <Route path="/admin/certificates" element={wrap(<PlatformDataPage title="Certificates" titleAr="الشهادات" description="Certificate generation and verification records." descriptionAr="سجلات إنشاء الشهادات والتحقق منها." endpoint="/api/admin/results" />)} />
      <Route path="/admin/curriculum/temporary" element={wrap(<PlatformDataPage title="Temporary Curriculum" titleAr="المنهج المؤقت" description="All current curriculum rows from Google Sheets." descriptionAr="كل صفوف المنهج الحالي من Google Sheets." endpoint="/api/curriculum/temporary" />)} />
      <Route path="/admin/curriculum/new" element={wrap(<PlatformDataPage title="New Curriculum" titleAr="المنهج الجديد" description="Reserved for the original curriculum system." descriptionAr="محجوز لنظام المنهج الأصلي الجديد." endpoint="/api/curriculum/new" />)} />
      <Route path="/admin/games" element={wrap(<PlatformDataPage title="Games Generator" titleAr="مولّد الألعاب" description="Generated ESL games and approval state." descriptionAr="ألعاب اللغة الإنجليزية المنشأة وحالة اعتمادها." endpoint="/api/games/me" />)} />
      <Route path="/admin/revision-quizzes" element={wrap(<PlatformDataPage title="Revision Quiz Generator" titleAr="مولّد اختبارات المراجعة" description="Revision quizzes generated for all sessions." descriptionAr="اختبارات المراجعة المنشأة لكل الحصص." endpoint="/api/revision-quizzes/me" />)} />
      <Route path="/admin/availability" element={wrap(<PlatformDataPage title="Teacher Availability" titleAr="مواعيد المعلمين" description="All teacher availability and capacity records." descriptionAr="كل مواعيد المعلمين وسعة الحصص." endpoint="/api/admin/availability" />)} />
      <Route path="/admin/salary" element={wrap(<GenericPage title="Salary Management" icon={Wallet} />)} />
      <Route path="/admin/teacher-of-month" element={wrap(<GenericPage title="Teacher of the Month" icon={Trophy} />)} />
      <Route path="/admin/student-of-month" element={wrap(<GenericPage title="Student of the Month" icon={Award} />)} />
      <Route path="/admin/roles" element={wrap(<GenericPage title={t.nav.roles} icon={UserCog} />)} />
      <Route path="/admin/blocked-users" element={wrap(<GenericPage title={t.nav.blocked} icon={XCircle} />)} />
      <Route path="/admin/automation" element={wrap(<GenericPage title={t.nav.automation} icon={Mail} />)} />
      <Route path="/admin/audit-log" element={wrap(<GenericPage title={t.nav.audit} icon={ShieldCheck} />)} />
      <Route path="/admin/data-sources" element={wrap(<DataSourcesPage />)} />
      <Route path="/admin/assets" element={wrap(<AssetManagerPage />)} />
      <Route path="/admin/placement-tests" element={wrap(<PlatformDataPage title="Placement Test Review" titleAr="مراجعة تحديد المستوى" description="All submitted placement results." descriptionAr="كل نتائج اختبارات تحديد المستوى." endpoint="/api/placement/admin/results" />)} />
      <Route path="/admin/placement-tests/:id" element={wrap(<PlatformDataPage title="Placement Test Review" titleAr="مراجعة تحديد المستوى" description="All submitted placement results." descriptionAr="كل نتائج اختبارات تحديد المستوى." endpoint="/api/placement/admin/results" />)} />
      <Route path="/admin/placement-tests/settings" element={wrap(<GenericPage title="Placement Settings" icon={UserCog} />)} />
    </>
  );
}

function App() {
  const [user, setUser] = useAuthSession();
  const { t } = useTranslation();

  const studentLinks = useMemo(() => [
    { to: '/student', label: t.nav.dashboard, icon: Gauge },
    { to: '/student/guide', label: t.nav.guide, icon: ClipboardCheck },
    { to: '/student/placement', label: t.nav.placement, icon: ClipboardList },
    { to: '/student/booking', label: t.nav.booking, icon: CalendarDays },
    { to: '/student/teachers', label: t.nav.teachers, icon: GraduationCap },
    { to: '/student/payment', label: t.nav.payment, icon: CreditCard },
    { to: '/student/profile', label: t.nav.profile, icon: UserRound },
    { to: '/student/schedule', label: t.nav.schedule, icon: CalendarDays },
    { to: '/student/materials', label: t.nav.material, icon: BookOpen },
    { to: '/student/homework', label: t.nav.homework, icon: FileText },
    { to: '/student/results', label: 'My Results', icon: Award },
    { to: '/student/games', label: 'Practice Games', icon: Trophy },
    { to: '/student/practice', label: 'Recommended Practice', icon: ClipboardCheck },
    { to: '/student/feedback', label: t.nav.feedback, icon: Star },
    { to: '/student/final-test', label: t.nav.finalTest, icon: Award },
    { to: '/student/reports', label: t.nav.reports, icon: FileText },
    { to: '/student/certificate', label: t.nav.certificate, icon: Award },
    { to: '/student/chat', label: t.nav.chat, icon: MessageCircle }
  ], [t]);

  const teacherLinks = useMemo(() => [
    { to: '/teacher', label: t.nav.dashboard, icon: Gauge },
    { to: '/teacher/profile', label: t.nav.profile, icon: UserRound },
    { to: '/teacher/availability', label: t.nav.availability, icon: CalendarDays },
    { to: '/teacher/schedule', label: t.nav.schedule, icon: CalendarDays },
    { to: '/teacher/material', label: t.nav.material, icon: BookOpen },
    { to: '/teacher/attendance', label: t.nav.attendance, icon: ClipboardCheck },
    { to: '/teacher/homework', label: t.nav.homework, icon: FileText },
    { to: '/teacher/results', label: 'Student Results', icon: Award },
    { to: '/teacher/curriculum/temporary', label: 'Temporary Curriculum', icon: BookOpen },
    { to: '/teacher/games', label: 'Session Games', icon: Trophy },
    { to: '/teacher/revision-quizzes', label: 'Revision Quizzes', icon: ClipboardCheck },
    { to: '/teacher/feedback', label: t.nav.feedback, icon: Star },
    { to: '/teacher/students', label: t.nav.students, icon: Users },
    { to: '/teacher/salary', label: t.nav.salary, icon: Wallet },
    { to: '/teacher/chat', label: t.nav.chat, icon: MessageCircle },
    { to: '/teacher/vacation', label: t.nav.vacation, icon: CalendarDays }
  ], [t]);

  const adminLinks = useMemo(() => [
    { to: '/admin', label: t.nav.dashboard, icon: Gauge },
    { to: '/admin/students', label: t.nav.students, icon: Users },
    { to: '/admin/manual-student-add', label: t.nav.manualAdd, icon: UserRound },
    { to: '/admin/placement-codes', label: t.nav.placementCodes, icon: ClipboardList },
    { to: '/admin/teachers', label: t.nav.teachers, icon: GraduationCap },
    { to: '/admin/schedules', label: t.nav.schedule, icon: CalendarDays },
    { to: '/admin/current-sessions', label: t.nav.currentSessions, icon: Gauge },
    { to: '/admin/payments', label: t.nav.payment, icon: CreditCard },
    { to: '/admin/availability', label: 'Teacher Availability', icon: CalendarDays },
    { to: '/admin/finance', label: t.nav.finance, icon: Banknote },
    { to: '/admin/prices', label: t.nav.prices, icon: Wallet },
    { to: '/admin/material', label: t.nav.material, icon: BookOpen },
    { to: '/admin/curriculum/temporary', label: 'Temporary Curriculum', icon: BookOpen },
    { to: '/admin/curriculum/new', label: 'New Curriculum', icon: BookOpen },
    { to: '/admin/tests', label: t.nav.tests, icon: Award },
    { to: '/admin/results', label: 'Results', icon: Award },
    { to: '/admin/homework', label: t.nav.homework, icon: FileText },
    { to: '/admin/games', label: 'Games Generator', icon: Trophy },
    { to: '/admin/revision-quizzes', label: 'Revision Quizzes', icon: ClipboardCheck },
    { to: '/admin/reports', label: t.nav.reports, icon: FileText },
    { to: '/admin/certificates', label: t.nav.certificate, icon: Award },
    { to: '/admin/salary', label: t.nav.salary, icon: Wallet },
    { to: '/admin/teacher-of-month', label: 'Teacher of Month', icon: Trophy },
    { to: '/admin/student-of-month', label: 'Student of Month', icon: Award },
    { to: '/admin/roles', label: t.nav.roles, icon: UserCog },
    { to: '/admin/blocked-users', label: t.nav.blocked, icon: XCircle },
    { to: '/admin/automation', label: t.nav.automation, icon: Mail },
    { to: '/admin/audit-log', label: t.nav.audit, icon: ShieldCheck },
    { to: '/admin/data-sources', label: t.nav.dataSources, icon: Database },
    { to: '/admin/assets', label: t.nav.assets, icon: UploadCloud }
  ], [t]);

  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} setUser={setUser} />} />
      <Route path="/login" element={<LoginPage setUser={setUser} />} />
      <Route path="/student-login" element={<LoginPage setUser={setUser} initialRole="student" />} />
      <Route path="/teacher-login" element={<LoginPage setUser={setUser} initialRole="teacher" />} />
      <Route path="/admin-login" element={<LoginPage setUser={setUser} initialRole="admin" />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/placement-test" element={<main><PublicHeader /><section className="section section-pale"><div className="container"><PlacementPage /></div></section></main>} />
      <Route path="/courses/general-english" element={<PublicCoursePage course="General English" titleAr="الإنجليزية العامة" />} />
      <Route path="/courses/kids-english" element={<PublicCoursePage course="Kids English" titleAr="إنجليزي الأطفال" />} />
      <Route path="/courses/phonics" element={<PublicCoursePage course="Phonics" titleAr="الفونكس" />} />
      <Route path="/courses/private-classes" element={<PublicCoursePage course="Private Classes" titleAr="الحصص الخاصة" />} />
      {RoleRoutes({ user, setUser, role: 'student', links: studentLinks })}
      {RoleRoutes({ user, setUser, role: 'teacher', links: teacherLinks })}
      {RoleRoutes({ user, setUser, role: 'admin', links: adminLinks })}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

