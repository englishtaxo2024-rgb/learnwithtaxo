export const phonicsQuestions = [
  { id: 'phonics-gateway', path: 'phonics', stage: 'gateway', type: 'choice', instruction: 'Can you recognize and read English letters?', prompt: 'Choose the answer that feels true for you.', options: ['Yes', 'No', 'Not sure'] },
  { id: 'phonics-letters-1', path: 'phonics', stage: 'letters', type: 'recording', instruction: 'Read each letter aloud', prompt: 'P  Z  R  I  Y', difficulty: 1 },
  { id: 'phonics-letters-confused', path: 'phonics', stage: 'letters', type: 'recording', instruction: 'Read each letter aloud', prompt: 'b  d  p  q  m  n  i  l  u  v', difficulty: 2 },
  { id: 'phonics-sounds', path: 'phonics', stage: 'sounds', type: 'recording', instruction: 'Say the sound of each letter', prompt: 's  m  t  p  a', difficulty: 2 },
  { id: 'phonics-cvc', path: 'phonics', stage: 'cvc', type: 'recording', instruction: 'Read these words aloud', prompt: 'cat  pin  hop  sun  bed', difficulty: 3 },
  { id: 'phonics-blends', path: 'phonics', stage: 'blends', type: 'recording', instruction: 'Read these words aloud', prompt: 'ship  chin  clap  frog  train  light', difficulty: 4 },
  { id: 'phonics-sentence', path: 'phonics', stage: 'sentence', type: 'recording', instruction: 'Read this sentence aloud', prompt: 'The frog jumps in the pond.', difficulty: 5 },
];

const kidsSpeaking = [
  ['kids-1', 1, 'What is your name, and how old are you?'],
  ['kids-2', 1, 'What is your favorite color?'],
  ['kids-3', 1, 'What fruit or animal do you like?'],
  ['kids-6', 2, 'What do you like to play with your friends?'],
  ['kids-8', 2, 'What can you see in your bedroom?'],
  ['kids-11', 3, 'What do you do on weekends?'],
  ['kids-14', 3, 'What can you see at the beach?'],
  ['kids-16', 4, 'What do you do before school?'],
  ['kids-19', 4, 'What do you do during holidays?'],
  ['kids-21', 5, 'What do you do when you are happy?'],
  ['kids-25', 5, 'What healthy habits do you follow?'],
].map(([id, difficulty, prompt]) => ({ id, path: 'kids', stage: 'speaking', type: 'recording', instruction: 'Answer naturally in English', prompt, difficulty }));

const generalSpeaking = [
  ['general-1', 1, 'What is your name, and where are you from?'],
  ['general-2', 1, 'What do you usually do every day at home, school, or work?'],
  ['general-3', 1, 'What do you eat for breakfast, and what food do you like?'],
  ['general-5', 2, 'What do people usually do at the airport?'],
  ['general-7', 2, 'What do you usually do on vacations?'],
  ['general-9', 3, 'What is your opinion about art or beauty?'],
  ['general-10', 3, 'What healthy habits do you follow, and why are they important?'],
  ['general-11', 3, 'What makes a good friend, and why?'],
  ['general-13', 4, 'What problems does social media create, and how can people use it better?'],
  ['general-15', 4, 'What problems does smartphone addiction cause, and how can people stop it?'],
  ['general-16', 4, 'What global problem is most urgent, and how should people solve it?'],
].map(([id, difficulty, prompt]) => ({ id, path: 'general', stage: 'speaking', type: 'recording', instruction: 'Answer naturally in English', prompt, difficulty }));

export const kidsReadingGateway = [
  { ...phonicsQuestions[1], id: 'kids-letter-check', path: 'kids', gateway: true },
  { ...phonicsQuestions[4], id: 'kids-cvc-check', path: 'kids', gateway: true },
  { id: 'kids-sentence-check', path: 'kids', stage: 'sentence', type: 'recording', instruction: 'Read this sentence aloud', prompt: 'I can see a big ship.', difficulty: 3, gateway: true },
];

export function buildInitialQueue(course) {
  if (course === 'phonics') return phonicsQuestions.slice(0, 2);
  if (course === 'kids') return [...kidsReadingGateway, ...kidsSpeaking.slice(0, 3)];
  return generalSpeaking.slice(0, 4);
}

export function chooseNextQuestion({ course, queue, answers, latestAssessment }) {
  const currentIds = new Set(queue.map((question) => question.id));
  const source = course === 'phonics' ? phonicsQuestions : course === 'kids' ? kidsSpeaking : generalSpeaking;
  const unanswered = source.filter((question) => !currentIds.has(question.id));
  if (!unanswered.length) return null;

  const completed = answers.length;
  const confidence = latestAssessment?.confidence ?? 0.5;
  const performance = latestAssessment?.performance ?? 0.5;
  if (completed >= 3 && confidence >= 0.86) return null;
  if (completed >= 3 && performance < 0.25) return null;
  if (completed >= 8) return null;

  const lastDifficulty = queue.at(-1)?.difficulty || 1;
  const targetDifficulty = performance >= 0.72 ? lastDifficulty + 1 : performance < 0.4 ? Math.max(1, lastDifficulty - 1) : lastDifficulty;
  return unanswered.find((question) => question.difficulty >= targetDifficulty) || unanswered[0];
}
