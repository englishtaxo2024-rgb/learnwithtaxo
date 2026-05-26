import { teacherNames } from '../config/teachers';

export const mockTeachers = teacherNames.map((name, index) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  name,
  email: `${name.toLowerCase().replace(/ms\. |\s+/g, '.')}@learnwithtaxo.com`,
  photo: '',
  introVideo: '',
  bio: `${name} teaches interactive English with clear goals, warm class control, and progress-focused feedback.`,
  courses: index % 3 === 0 ? ['Phonics'] : index % 3 === 1 ? ['Kids English'] : ['General English', 'Private'],
  levels: index % 2 === 0 ? ['A1', 'A2'] : ['Pre-A1', 'B1'],
  ageGroups: index % 3 === 0 ? '4-10 years' : index % 3 === 1 ? '5-10 years' : '11-16 years; adults private only',
  availability: ['Sat 5:00 PM', 'Mon 6:00 PM', 'Wed 7:00 PM', 'Thu 5:30 PM'],
  schedule: [`${index % 2 ? 'Kids' : 'General'} A1 - Level ${index % 4 + 1}`],
  groupPrivateStatus: index % 4 === 0 ? 'Private slots open' : 'Group slots open',
  rating: (4.5 + (index % 5) / 10).toFixed(1),
  comments: ['Patient and motivating.', 'The session was clear and fun.'],
  approvalStatus: index % 5 === 0 ? 'Pending media review' : 'Approved',
  visible: index % 5 !== 0,
  blocked: false
}));
