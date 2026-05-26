export async function scoreWithAi(payload) {
  if (!process.env.OPENAI_API_KEY) {
    return { score: null, message: 'OPENAI_API_KEY missing. AI feature placeholder returned.' };
  }
  return { score: 86, message: 'AI integration stub ready for Responses API implementation.', payload };
}
