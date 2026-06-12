import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { teacherNames } from '../../src/config/teachers.js';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const STUDENTS_CSV_PATH = path.join(process.cwd(), 'taxo_students.csv');
const GROUPS_CSV_PATH = path.join(process.cwd(), 'taxo_teachers_groups.csv');

const defaultPlacementSettings = {
  confetti: true,
  allowSkip: true,
  allowResume: true,
  maxRecordingSeconds: 90,
  successMessageEn: 'Your placement test has been submitted successfully. Our team will contact you soon.',
  successMessageAr: 'تم إرسال اختبار تحديد المستوى بنجاح. سيتواصل معك فريقنا قريبًا.',
  testTypes: [
    {
      id: 'general-english',
      name: 'General English',
      instructionsEn: 'Answer what you can. This test is for level assessment only.',
      instructionsAr: 'أجب عما تعرفه فقط. هذا الاختبار لتحديد المستوى فقط.',
      questions: [
        { id: 'ge-grammar-1', type: 'mcq', textEn: 'Choose the correct sentence.', textAr: 'اختر الجملة الصحيحة.', choices: ['She go to school.', 'She goes to school.', 'She going school.'], answer: 'She goes to school.', points: 1 },
        { id: 'ge-reading-1', type: 'text', textEn: 'Read: Sara studies English every day. What does Sara study?', textAr: 'اقرأ: تدرس سارة الإنجليزية كل يوم. ماذا تدرس سارة؟', points: 1 },
        { id: 'ge-writing-1', type: 'text', textEn: 'Write 3 sentences about your daily routine.', textAr: 'اكتب 3 جمل عن روتينك اليومي.', points: 3 }
      ]
    },
    {
      id: 'kids-english',
      name: 'Kids English',
      instructionsEn: 'Friendly kids level check with simple words and sentences.',
      instructionsAr: 'اختبار بسيط للأطفال بالكلمات والجمل السهلة.',
      questions: [
        { id: 'kids-vocab-1', type: 'mcq', textEn: 'Which word is an animal?', textAr: 'أي كلمة تعبر عن حيوان؟', choices: ['cat', 'book', 'chair'], answer: 'cat', points: 1 },
        { id: 'kids-speaking-1', type: 'audio', textEn: 'Say three colors you know.', textAr: 'قل ثلاثة ألوان تعرفها.', points: 2 }
      ]
    },
    {
      id: 'phonics',
      name: 'Phonics',
      instructionsEn: 'Check letter sounds, blending, and reading aloud.',
      instructionsAr: 'اختبار أصوات الحروف والدمج والقراءة بصوت عال.',
      questions: [
        { id: 'phonics-sound-1', type: 'audio', textEn: 'Say the sound of letter B, then read: bat.', textAr: 'قل صوت حرف B ثم اقرأ: bat.', points: 2 },
        { id: 'phonics-cvc-1', type: 'mcq', textEn: 'Choose the CVC word.', textAr: 'اختر كلمة CVC.', choices: ['sun', 'school', 'beautiful'], answer: 'sun', points: 1 }
      ]
    },
    {
      id: 'grammar',
      name: 'Grammar',
      instructionsEn: 'Grammar multiple choice and sentence correction.',
      instructionsAr: 'اختيار من متعدد وتصحيح جمل في القواعد.',
      questions: [
        { id: 'grammar-1', type: 'mcq', textEn: 'I ____ English now.', textAr: 'اختر الإجابة الصحيحة.', choices: ['study', 'am studying', 'studied'], answer: 'am studying', points: 1 },
        { id: 'grammar-2', type: 'text', textEn: 'Correct this sentence: He don’t like tea.', textAr: 'صحح الجملة: He don’t like tea.', points: 1 }
      ]
    },
    {
      id: 'speaking',
      name: 'Speaking',
      instructionsEn: 'Do not prepare written answers or read from a script. Answer naturally.',
      instructionsAr: 'هذا الاختبار مبدئي لتحديد مستواك في مهارة التحدث للانضمام لكورس General English. لا تشارك هذا الاختبار مع أحد حتى لا تفسد صلاحية استخدامه لتحديد مستوى الآخرين. يمكنك أن تجيب عن الأسئلة التي تعرفها فقط. لمساعدتنا على تحديد مستواك بدقة، لا تقم بتحضير الإجابات وكتابتها ثم القراءة والتسجيل، حيث إن الاختبار لن يكون دقيقًا بالمرة.',
      questions: [
        'What is your name, and where are you from?',
        'What do you usually do every day at home or school?',
        'What do you eat for breakfast, and what food do you like?',
        'What is your favorite shop or place in town, and what do you buy there?',
        'What do people usually do at the airport, and what do you do before a trip?',
        'What foods do you like to eat when you go to restaurants, and why?',
        'What do you usually do on your vacations, and who do you spend them with?',
        'Tell me about a movie, story, or book you like. What happened in it?',
        'What are your plans for the future, and what would you like to learn?',
        'What do you think makes a good teacher or a good student?',
        'Describe a problem you had before and how you solved it.',
        'If you could change one thing about your city or school, what would you change and why?'
      ].map((textEn, index) => ({ id: `speaking-${index + 1}`, type: 'audio', textEn, textAr: '', points: 2, required: index < 4 }))
    }
  ],
  levelRules: [
    { min: 0, max: 30, level: 'Beginner / Pre-A1' },
    { min: 31, max: 55, level: 'A1' },
    { min: 56, max: 75, level: 'A2' },
    { min: 76, max: 100, level: 'B1+' }
  ]
};

const seedTeachers = teacherNames.map((name, index) => ({
  id: `teacher-${index + 1}`,
  role: 'teacher',
  name,
  email: `${name.toLowerCase().replace(/ms\. |\s+/g, '.')}@learnwithtaxo.com`,
  courses: index % 3 === 0 ? ['Phonics'] : index % 3 === 1 ? ['Kids English'] : ['General English', 'Private'],
  levels: index % 2 === 0 ? ['Pre-A1', 'A1'] : ['A1', 'A2', 'B1'],
  ageGroups: index % 3 === 0 ? '4-10 years' : index % 3 === 1 ? '5-10 years' : '11-16 years; adults private only',
  availability: ['Sat 5:00 PM', 'Mon 6:00 PM', 'Wed 7:00 PM', 'Thu 5:30 PM'],
  approved: index % 5 !== 0,
  visible: index % 5 !== 0,
  blocked: false,
  rating: Number((4.5 + (index % 5) / 10).toFixed(1)),
  bio: `${name} teaches interactive English with clear goals, warm class control, and progress-focused feedback.`,
  media: []
}));

const initialDb = {
  users: [],
  admins: [{ id: 'admin-saga', role: 'admin', name: 'Learn with Taxo Admin', email: 'sagafinearts@gmail.com', active: true }],
  authCodes: [],
  sessions: {},
  students: [
    {
      id: 'ET-2026-123456',
      name: 'Ahmed Ali',
      parentEmail: '',
      phone: '201000000000',
      age: 8,
      course: 'Kids English',
      level: 'A1 Level 1',
      cefr: 'A1',
      teacherId: 'teacher-1',
      teacher: 'Ms. Aya El Dawoudy',
      groupId: 'group-1',
      groupName: 'Kids A1 - Level 1',
      type: 'Group',
      currentSession: 4,
      nextSession: 'Sat 5:00 PM',
      paymentStatus: 'Approved',
      placementResult: 'Kids English A1 Level 1',
      materialKeys: ['Kids English|A1 Level 1|S1'],
      attendance: [],
      homework: [],
      feedback: [],
      finalTests: []
    }
  ],
  teachers: seedTeachers,
  groups: [
    { id: 'group-1', teacherId: 'teacher-1', teacher: 'Ms. Aya El Dawoudy', name: 'Kids A1 - Level 1', course: 'Kids English', level: 'A1 Level 1', days: 'Sat-Mon-Wed', time: '5:00 PM', capacity: 6, studentIds: ['ET-2026-123456'], currentSession: 4, materialKeys: ['Kids English|A1 Level 1|S1'] }
  ],
  placementTests: [
    { id: 'placement-phonics', course: 'Phonics', title: 'Phonics Placement', sections: ['Alphabet recognition', 'Listening sounds', 'Reading CVC words', 'Speaking review'], active: true },
    { id: 'placement-kids', course: 'Kids English', title: 'Kids English Placement', sections: ['Alphabet question', 'Adaptive MCQ', 'Reading', 'Listening', 'Writing'], active: true },
    { id: 'placement-general', course: 'General English', title: 'General English Placement', sections: ['Grammar MCQ', 'Reading', 'Listening', 'Writing', 'Speaking'], active: true }
  ],
  finalTests: [
    { id: 'final-phonics', course: 'Phonics', levels: '0-8', opensAfter: 'final_session', expiresDays: 7, active: true },
    { id: 'final-kids', course: 'Kids English', levels: 'A1-A2', opensAfter: 'final_session', expiresDays: 7, active: true },
    { id: 'final-general', course: 'General English', levels: 'A1-B1', opensAfter: 'final_session', expiresDays: 7, active: true }
  ],
    materials: [],
    payments: [],
    paymentSettings: {
      instructionsEn: process.env.PAYMENT_INSTRUCTIONS_EN || 'Upload your payment proof from your student dashboard. Admin will review and confirm your booking.',
      instructionsAr: process.env.PAYMENT_INSTRUCTIONS_AR || 'ارفع صورة إثبات الدفع من لوحة الطالب. ستقوم الإدارة بالمراجعة وتأكيد الحجز.'
    },
    placementSettings: defaultPlacementSettings,
    placementSubmissions: [],
    uploads: [],
    audit: []
  };

export async function loadDb() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const existing = JSON.parse(await fs.readFile(DB_PATH, 'utf8'));
    if ((existing.students?.length || 0) <= 1 && await csvFilesExist()) {
      const seeded = await seedFromTaxoCsvFiles();
      await saveDb(seeded);
      return seeded;
    }
    return migrateDb(existing);
  } catch {
    const db = await seedFromTaxoCsvFiles().catch(() => structuredClone(initialDb));
    await saveDb(db);
    return db;
  }
}

function migrateDb(db) {
  db.users = [];
  db.admins = [{ id: 'admin-saga', role: 'admin', name: 'Learn with Taxo Admin', email: 'sagafinearts@gmail.com', active: true }];
  db.authCodes ||= [];
  db.sessions ||= {};
  db.students ||= [];
  db.teachers ||= seedTeachers;
  db.groups ||= [];
  db.materials ||= [];
  db.payments ||= [];
  db.paymentSettings ||= {
    instructionsEn: process.env.PAYMENT_INSTRUCTIONS_EN || 'Upload your payment proof from your student dashboard. Admin will review and confirm your booking.',
    instructionsAr: process.env.PAYMENT_INSTRUCTIONS_AR || 'ارفع صورة إثبات الدفع من لوحة الطالب. ستقوم الإدارة بالمراجعة وتأكيد الحجز.'
  };
  db.placementSettings ||= defaultPlacementSettings;
  db.placementSubmissions ||= [];
  db.uploads ||= [];
  db.audit ||= [];
  return db;
}

export async function saveDb(db) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export async function mutateDb(mutator) {
  const db = await loadDb();
  const result = await mutator(db);
  await saveDb(db);
  return result;
}

export function createToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function publicUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

export async function getUserFromToken(token) {
  if (!token) return null;
  const db = await loadDb();
  const session = db.sessions[token];
  if (!session) return null;
  return db.users.find((user) => user.id === session.userId) || null;
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(cell.trim());
      cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  const [headers = [], ...body] = rows;
  return body.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])));
}

async function csvFilesExist() {
  try {
    await Promise.all([fs.access(STUDENTS_CSV_PATH), fs.access(GROUPS_CSV_PATH)]);
    return true;
  } catch {
    return false;
  }
}

function teacherIdFor(name) {
  const index = seedTeachers.findIndex((teacher) => teacher.name === name);
  return index >= 0 ? seedTeachers[index].id : undefined;
}

function clean(value, fallback = '') {
  return String(value || fallback).trim();
}

function inferCourse(material = '', groupName = '') {
  const text = `${material} ${groupName}`.toLowerCase();
  if (text.includes('phonics')) return 'Phonics';
  if (text.includes('kids')) return 'Kids English';
  if (text.includes('private')) return 'Private';
  return 'General English';
}

function inferLevel(material = '', groupName = '') {
  const text = clean(material || groupName);
  const cefr = text.match(/\b(pre-a1|a1|a2|b1|b2|c1|c2)\b/i)?.[0];
  const level = text.match(/level\s*\(?\s*(\d+)\s*\)?/i)?.[1];
  if (cefr && level) return `${cefr.toUpperCase()} Level ${level}`;
  if (cefr) return cefr.toUpperCase();
  if (level) return `Level ${level}`;
  return text || 'Pending';
}

function inferCefr(material = '', level = '') {
  return `${material} ${level}`.match(/\b(pre-a1|a1|a2|b1|b2|c1|c2)\b/i)?.[0]?.toUpperCase() || 'Pending';
}

function inferCapacity(course, groupName = '') {
  if (/private/i.test(groupName)) return 1;
  if (course === 'Phonics') return 5;
  return 6;
}

function materialKey(course, level, session = 1) {
  return `${course}|${level}|S${session}`;
}

export function studentFromTaxoRow(row) {
  const material = clean(row.material);
  const groupName = clean(row.group_name);
  const course = inferCourse(material, groupName);
  const level = inferLevel(material, groupName);
  const teacherId = teacherIdFor(clean(row.teacher));
  return {
    id: clean(row.student_id, `ET-CSV-${crypto.randomUUID().slice(0, 8)}`),
    name: clean(row.student_name, 'Unnamed student'),
    email: clean(row.email),
    parentEmail: clean(row.parent_email),
    phone: clean(row.phone),
    active: clean(row.active, 'true').toLowerCase() !== 'false',
    authEligible: true,
    age: clean(row.age),
    course,
    level,
    cefr: inferCefr(material, level),
    teacherId,
    teacher: clean(row.teacher),
    groupId: clean(row.group_key),
    groupName,
    type: /private/i.test(groupName) ? 'Private' : 'Group',
    currentSession: Number(clean(row.current_session, 1)) || 1,
    nextSession: `${clean(row.days)} ${clean(row.time)}`.trim(),
    paymentStatus: clean(row.payment_status, 'Current paid student'),
    placementResult: clean(row.placement_result, `${course} ${level}`),
    materialKeys: [materialKey(course, level, 1)],
    attendance: [],
    homework: [],
    feedback: [],
    finalTests: [],
    source: 'taxo_students.csv',
    sourceRow: clean(row.source_row)
  };
}

export function groupFromTaxoRow(row, studentRows = []) {
  const material = clean(row.material);
  const groupName = clean(row.group_name);
  const course = inferCourse(material, groupName);
  const level = inferLevel(material, groupName);
  const studentIds = clean(row.student_ids)
    ? clean(row.student_ids).split(/[;,]/).map((item) => item.trim()).filter(Boolean)
    : studentRows.filter((student) => clean(student.group_key) === clean(row.group_key)).map((student) => clean(student.student_id)).filter(Boolean);
  return {
    id: clean(row.group_key, crypto.randomUUID()),
    teacherId: teacherIdFor(clean(row.teacher)),
    teacher: clean(row.teacher),
    name: groupName || clean(row.batch_context, 'Unnamed group'),
    course,
    level,
    days: clean(row.days),
    time: clean(row.time),
    startDate: clean(row.start_date),
    endDate: clean(row.end_date),
    numberOfSessions: Number(clean(row.number_of_sessions, 10)) || 10,
    capacity: inferCapacity(course, groupName),
    studentIds,
    currentSession: 1,
    materialKeys: [materialKey(course, level, 1)],
    source: 'taxo_teachers_groups.csv',
    sourceRow: clean(row.source_row)
  };
}

export function buildTaxoDb(studentRows, groupRows) {
  const students = studentRows.map(studentFromTaxoRow);
  const groups = groupRows.map((row) => groupFromTaxoRow(row, studentRows));
  const groupsByTeacher = new Map();
  const studentsByTeacher = new Map();
  groups.forEach((group) => {
    if (!group.teacherId) return;
    groupsByTeacher.set(group.teacherId, [...(groupsByTeacher.get(group.teacherId) || []), group]);
  });
  students.forEach((student) => {
    if (!student.teacherId) return;
    studentsByTeacher.set(student.teacherId, [...(studentsByTeacher.get(student.teacherId) || []), student]);
  });

  const teachers = seedTeachers.map((teacher) => {
    const teacherGroups = groupsByTeacher.get(teacher.id) || [];
    const teacherStudents = studentsByTeacher.get(teacher.id) || [];
    const courses = [...new Set(teacherGroups.map((group) => group.course).filter(Boolean))];
    const levels = [...new Set(teacherGroups.map((group) => group.level).filter(Boolean))];
    return {
      ...teacher,
      courses: courses.length ? courses : teacher.courses,
      levels: levels.length ? levels : teacher.levels,
      availability: [...new Set(teacherGroups.map((group) => `${group.days} ${group.time}`.trim()).filter(Boolean))].slice(0, 10),
      currentSchedule: teacherGroups.map((group) => ({ groupId: group.id, groupName: group.name, days: group.days, time: group.time, students: group.studentIds.length })),
      currentGroups: teacherGroups.map((group) => group.name),
      currentStudentCount: teacherStudents.length,
      approved: true,
      visible: true
    };
  });

  const firstStudent = students[0];
  return {
    ...structuredClone(initialDb),
    users: [],
    students,
    teachers,
    groups,
    audit: [{
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      by: 'system',
      role: 'system',
      action: 'csv.seed.current-taxo-data',
      meta: { students: students.length, groups: groups.length }
    }]
  };
}

async function seedFromTaxoCsvFiles() {
  const [studentsText, groupsText] = await Promise.all([
    fs.readFile(STUDENTS_CSV_PATH, 'utf8'),
    fs.readFile(GROUPS_CSV_PATH, 'utf8')
  ]);
  const studentRows = parseCsv(studentsText);
  const groupRows = parseCsv(groupsText);
  if (!studentRows.length || !groupRows.length) return structuredClone(initialDb);
  return buildTaxoDb(studentRows, groupRows);
}

export function audit(db, user, action, meta = {}) {
  db.audit.unshift({ id: crypto.randomUUID(), at: new Date().toISOString(), by: user?.email || 'system', role: user?.role || 'system', action, meta });
}
