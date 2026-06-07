import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, CirclePlay, Headphones, Mic, Pause, RotateCcw, ShieldCheck, Sparkles, Square, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { brand } from '../config/brand';
import { buildInitialQueue, chooseNextQuestion } from '../data/adaptivePlacement';
import { placementApi } from '../services/placementApi';
import '../styles/placement-experience.css';

const resumeKey = 'taxo_placement_session';

function Logo() {
  return <Link className="placement-brand" to="/"><img src={brand.logoSymbolPath || brand.logoPath} alt="" /><span><strong>ENGLISH TAXO</strong><small>Placement Portal</small></span></Link>;
}

function Shell({ student, progress, children }) {
  return <main className="placement-shell"><header className="placement-topbar"><Logo />{student && <div className="placement-student"><span>{student.name}</span><small>{student.courseLabel}</small></div>}</header>{progress && <div className="placement-progress" aria-label="Test progress"><div className="placement-progress-copy"><span>Question {progress.current}</span><span>{progress.label}</span></div><div className="placement-progress-rail"><i style={{ width: `${progress.percent}%` }} /></div></div>}<div className="placement-stage">{children}</div></main>;
}

function Intro({ onNext }) {
  return <Shell><section className="placement-card placement-intro"><Logo /><p className="placement-kicker">Before you begin</p><h1>A calm space helps your real English shine.</h1><div className="placement-tips"><p><Headphones /> Find a quiet, calm space.</p><p><Mic /> Speak naturally in your own words.</p><p><Pause /> Take your time. There is no rush.</p><p><Sparkles /> Mistakes are welcome here.</p></div><button className="placement-primary" onClick={onNext}>I'm ready - enter my code <ChevronRight /></button></section></Shell>;
}

function CodeEntry({ onVerified }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setError('');
    const normalized = code.trim().toUpperCase();
    if (!/^PT-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(normalized)) return setError('Please check your private access code and try again.');
    setLoading(true);
    try { onVerified(await placementApi.verifyCode(normalized)); }
    catch (requestError) { setError(requestError.code === 'CODE_UNAVAILABLE' ? 'This code cannot be used. Please contact English Taxo.' : 'We could not verify this code. Please try again.'); }
    finally { setLoading(false); }
  }
  return <Shell><section className="placement-card placement-code-card"><Logo /><span className="placement-icon"><Volume2 /></span><h1>Your voice tells us everything.</h1><p>Speak naturally and we'll find the level that fits you perfectly.</p><form onSubmit={submit}><label htmlFor="placement-code">Private access code</label><input id="placement-code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="PT-8F4K-29QZ" autoComplete="one-time-code" />{error && <div className="placement-error" role="alert">{error}</div>}<button className="placement-primary" disabled={loading}>{loading ? 'Checking securely...' : 'Begin my test'} <ChevronRight /></button></form></section></Shell>;
}

function Confirmation({ student, onBack, onConfirm }) {
  const fields = [['Student', student.name], ['Course requested', student.courseLabel], ['Age', student.age], ['Parent phone', student.parentPhone], ['Country', student.country || 'Not provided']];
  return <Shell student={student}><section className="placement-card"><p className="placement-kicker">Student confirmation</p><h1>Is this you?</h1><div className="placement-confirm-grid">{fields.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><button className="placement-primary" onClick={onConfirm}>Yes, that's me - let's begin <ChevronRight /></button><button className="placement-secondary" onClick={onBack}><ArrowLeft /> Not me - go back</button></section></Shell>;
}

function Instructions({ student, videoUrl, onStart }) {
  const general = student.course === 'general';
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);
  async function start() {
    setError(''); setStarting(true);
    try { await onStart(); }
    catch { setError('We could not start your test. Please check your connection and try again.'); }
    finally { setStarting(false); }
  }
  return <Shell student={student}><section className="placement-card placement-instructions"><p className="placement-kicker">How your test works</p><h1>{general ? 'General English Speaking Placement Test' : 'Listen, speak, and do your best.'}</h1>{videoUrl ? <div className="placement-video"><video controls preload="metadata" src={videoUrl} /></div> : <div className="placement-video-placeholder"><CirclePlay /><span>Instructional video</span></div>}<div className="placement-notice"><ShieldCheck /><p>Your access code is private. Answer naturally by voice and do not prepare or read written answers. Your test adapts to your responses.</p></div>{general && <p dir="rtl" className="placement-arabic">هذا اختبار مبدئي لتحديد مستواك في مهارة التحدث قبل الانضمام إلى كورس General English. أجب بشكل طبيعي في التسجيل الصوتي، ولا تكتب أو تحضر الإجابات مسبقاً.</p>}{error && <div className="placement-error" role="alert">{error}</div>}<button className="placement-primary" disabled={starting} onClick={start}>{starting ? 'Starting securely...' : 'Start placement test'} <ChevronRight /></button></section></Shell>;
}

function Recorder({ onReady }) {
  const recorderRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);
  const [state, setState] = useState('idle');
  const [seconds, setSeconds] = useState(0);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  useEffect(() => () => { clearInterval(timerRef.current); if (url) URL.revokeObjectURL(url); }, [url]);
  async function start() {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => event.data.size && chunksRef.current.push(event.data);
      recorder.onstop = () => {
        clearInterval(timerRef.current);
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const nextUrl = URL.createObjectURL(blob);
        setUrl(nextUrl); setState('ready'); onReady(blob);
      };
      recorder.start(); setSeconds(0); setState('recording');
      timerRef.current = setInterval(() => setSeconds((value) => value + 1), 1000);
    } catch { setError('Microphone access is needed. Please allow it and try again.'); }
  }
  function stop() { if (recorderRef.current?.state === 'recording') recorderRef.current.stop(); }
  function reset() { if (url) URL.revokeObjectURL(url); setUrl(''); setSeconds(0); setState('idle'); onReady(null); }
  return <div className="placement-recorder">{state === 'idle' && <button className="placement-record" onClick={start}><Mic /> Start recording</button>}{state === 'recording' && <button className="placement-stop" onClick={stop}><Square /> Stop recording <span>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span></button>}{state === 'ready' && <div className="placement-playback"><audio controls src={url} /><button onClick={reset}><RotateCcw /> Re-record</button></div>}{error && <div className="placement-error" role="alert">{error}</div>}</div>;
}

function Question({ student, question, position, queueLength, onSubmit }) {
  const [choice, setChoice] = useState('');
  const [blob, setBlob] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const canSubmit = question.type === 'choice' ? Boolean(choice) : Boolean(blob);
  async function next() {
    if (!canSubmit) return;
    setError(''); setSaving(true);
    try { await onSubmit({ question, choice, blob }); }
    catch { setError('Your answer was not uploaded. Please try again; your recording is still here.'); }
    finally { setSaving(false); }
  }
  const percent = Math.min(92, ((position + 1) / Math.max(queueLength, position + 2)) * 100);
  return <Shell student={student} progress={{ current: position + 1, label: 'Adaptive test', percent }}><section className="placement-card placement-question-card"><div className="placement-question-chip">Question {position + 1}</div><p className="placement-instruction">{question.instruction}</p><h1 className="placement-prompt">{question.prompt}</h1>{question.type === 'choice' ? <div className="placement-options">{question.options.map((option) => <button className={choice === option ? 'selected' : ''} key={option} onClick={() => setChoice(option)}><span>{choice === option && <Check />}</span>{option}</button>)}</div> : <Recorder onReady={setBlob} />}{error && <div className="placement-error" role="alert">{error}</div>}<button className="placement-primary" disabled={!canSubmit || saving} onClick={next}>{saving ? 'Saving your answer...' : 'Save and continue'} <ChevronRight /></button></section></Shell>;
}

function Encouragement({ onContinue }) {
  useEffect(() => { const timer = setTimeout(onContinue, 1300); return () => clearTimeout(timer); }, [onContinue]);
  return <Shell><section className="placement-card placement-success"><span><Sparkles /></span><h1>Great job!</h1><p>Your answer is saved. Keep speaking naturally.</p></section></Shell>;
}

function Complete({ showResult, result }) {
  return <Shell><section className="placement-card placement-complete"><span className="placement-complete-icon"><Check /></span><p className="placement-kicker">Submitted securely</p><h1>Thank you! Your placement test has been submitted.</h1><p>English Taxo will review your result and contact you soon.</p>{showResult && result && <div className="placement-result"><span>Recommended level</span><strong>{result}</strong></div>}<Link className="placement-primary" to="/">Back to home</Link></section></Shell>;
}

export function PlacementExperience() {
  const [screen, setScreen] = useState('intro');
  const [session, setSession] = useState(null);
  const [queue, setQueue] = useState([]);
  const [position, setPosition] = useState(0);
  const [answers, setAnswers] = useState([]);
  const current = queue[position];
  useEffect(() => {
    const saved = localStorage.getItem(resumeKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed?.sessionToken && parsed?.student && !parsed.completed) { setSession(parsed); setQueue(parsed.queue || buildInitialQueue(parsed.student.course)); setPosition(parsed.position || 0); setAnswers(parsed.answers || []); setScreen('question'); }
    } catch { localStorage.removeItem(resumeKey); }
  }, []);
  const student = session?.student;
  const course = student?.course;
  const persisted = useMemo(() => ({ ...session, queue, position, answers }), [session, queue, position, answers]);
  useEffect(() => { if (session?.sessionToken && screen !== 'complete') localStorage.setItem(resumeKey, JSON.stringify(persisted)); }, [persisted, screen, session]);
  async function startTest() {
    const started = await placementApi.start(session.sessionToken);
    setQueue(started.queue?.length ? started.queue : buildInitialQueue(course)); setPosition(started.position || 0); setAnswers(started.answers || []); setScreen('question');
  }
  async function submitAnswer({ question, choice, blob }) {
    let recording;
    if (blob) recording = await placementApi.uploadRecording(session.sessionToken, question.id, blob);
    const payload = await placementApi.saveAnswer(session.sessionToken, { questionId: question.id, selectedAnswer: choice || null, recordingId: recording?.recordingId || null });
    const nextAnswers = [...answers, payload.answer];
    setAnswers(nextAnswers);
    if (payload.stop || (question.id === 'phonics-gateway' && choice === 'No')) {
      await placementApi.complete(session.sessionToken); localStorage.removeItem(resumeKey); setSession((value) => ({ ...value, result: payload.result, showResult: payload.showResult })); setScreen('complete'); return;
    }
    const next = payload.nextQuestion || chooseNextQuestion({ course, queue, answers: nextAnswers, latestAssessment: payload.assessment });
    if (!next) {
      const completed = await placementApi.complete(session.sessionToken); localStorage.removeItem(resumeKey); setSession((value) => ({ ...value, result: completed.result, showResult: completed.showResult })); setScreen('complete'); return;
    }
    if (!queue.some((item) => item.id === next.id)) setQueue((items) => [...items, next]);
    setPosition((value) => value + 1); setScreen(nextAnswers.length % 3 === 0 ? 'encouragement' : 'question');
  }
  if (screen === 'intro') return <Intro onNext={() => setScreen('code')} />;
  if (screen === 'code') return <CodeEntry onVerified={(verified) => { setSession(verified); setScreen('confirmation'); }} />;
  if (screen === 'confirmation') return <Confirmation student={student} onBack={() => { setSession(null); setScreen('code'); }} onConfirm={() => setScreen('instructions')} />;
  if (screen === 'instructions') return <Instructions student={student} videoUrl={session.videoUrl} onStart={startTest} />;
  if (screen === 'encouragement') return <Encouragement onContinue={() => setScreen('question')} />;
  if (screen === 'complete') return <Complete showResult={session.showResult} result={session.result} />;
  if (!current) return <Complete />;
  return <Question key={current.id} student={student} question={current} position={position} queueLength={queue.length} onSubmit={submitAnswer} />;
}
