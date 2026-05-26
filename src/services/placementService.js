export async function scorePlacement(answers) {
  const knowsAlphabet = answers.knowsAlphabet === 'yes';
  return {
    course: knowsAlphabet ? 'Kids English' : 'Phonics',
    cefr: knowsAlphabet ? 'A1' : 'Pre-A1',
    level: knowsAlphabet ? 'A1 Level 1' : 'Phonics Level 1',
    strengths: ['Listening comprehension', 'Classroom participation'],
    weaknesses: ['Writing accuracy'],
    recommendations: ['Book a suitable group after payment approval', 'Practice 10 minutes daily']
  };
}
