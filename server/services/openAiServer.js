import OpenAI from 'openai';
import { z } from 'zod';

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const model = process.env.OPENAI_MODEL || 'gpt-5-mini';

function requireClient() {
  if (!client) {
    const error = new Error('OPENAI_API_KEY is not configured.');
    error.status = 503;
    throw error;
  }
  return client;
}

function outputText(response) {
  if (response.output_text) return response.output_text;
  return response.output
    ?.flatMap((item) => item.content || [])
    .find((item) => item.type === 'output_text')
    ?.text || '';
}

export async function structuredGeneration({ name, schema, prompt, system }) {
  const openai = requireClient();
  const response = await openai.responses.create({
    model,
    input: [
      {
        role: 'system',
        content: system || 'Return safe, accurate education content in the requested JSON structure.'
      },
      { role: 'user', content: prompt }
    ],
    text: {
      format: {
        type: 'json_schema',
        name,
        strict: true,
        schema
      }
    }
  });
  const text = outputText(response);
  if (!text) throw new Error('OpenAI returned no structured output.');
  return JSON.parse(text);
}

export const homeworkResultSchema = z.object({
  score: z.number().min(0).max(100),
  feedbackEN: z.string(),
  feedbackAR: z.string(),
  strengths: z.array(z.string()),
  weakPoints: z.array(z.string()),
  corrections: z.array(z.object({
    original: z.string(),
    corrected: z.string(),
    explanationEN: z.string(),
    explanationAR: z.string()
  })),
  needsTeacherReview: z.boolean()
});

export async function scoreWithAi(payload) {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['score', 'feedbackEN', 'feedbackAR', 'strengths', 'weakPoints', 'corrections', 'needsTeacherReview'],
    properties: {
      score: { type: 'number', minimum: 0, maximum: 100 },
      feedbackEN: { type: 'string' },
      feedbackAR: { type: 'string' },
      strengths: { type: 'array', items: { type: 'string' } },
      weakPoints: { type: 'array', items: { type: 'string' } },
      corrections: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['original', 'corrected', 'explanationEN', 'explanationAR'],
          properties: {
            original: { type: 'string' },
            corrected: { type: 'string' },
            explanationEN: { type: 'string' },
            explanationAR: { type: 'string' }
          }
        }
      },
      needsTeacherReview: { type: 'boolean' }
    }
  };
  const generated = await structuredGeneration({
    name: 'homework_correction',
    schema,
    system: 'You are an ESL assessment assistant. Be encouraging, age-appropriate, bilingual, and culturally safe. Flag ambiguous work for teacher review.',
    prompt: JSON.stringify(payload)
  });
  return homeworkResultSchema.parse(generated);
}

export async function generateGame(payload) {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['titleEN', 'titleAR', 'skill', 'gameType', 'instructionsEN', 'instructionsAR', 'items', 'estimatedTimeMinutes', 'difficulty', 'requiresTeacherReview'],
    properties: {
      titleEN: { type: 'string' },
      titleAR: { type: 'string' },
      skill: { type: 'string' },
      gameType: { type: 'string' },
      instructionsEN: { type: 'string' },
      instructionsAR: { type: 'string' },
      items: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['prompt', 'options', 'correctAnswer', 'explanationEN', 'explanationAR', 'points'],
          properties: {
            prompt: { type: 'string' },
            options: { type: 'array', items: { type: 'string' } },
            correctAnswer: { type: 'string' },
            explanationEN: { type: 'string' },
            explanationAR: { type: 'string' },
            points: { type: 'number' }
          }
        }
      },
      estimatedTimeMinutes: { type: 'number', minimum: 2, maximum: 15 },
      difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
      requiresTeacherReview: { type: 'boolean' }
    }
  };
  return structuredGeneration({
    name: 'esl_game',
    schema,
    system: 'Create an ESL game using only the provided curriculum content. It must be culturally safe and Arab Muslim family-friendly. Exclude alcohol, dating, horror, violence, magic, immodest content, and unrelated material.',
    prompt: JSON.stringify(payload)
  });
}

export async function generateRevisionQuiz(payload) {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['titleEN', 'titleAR', 'estimatedTimeMinutes', 'instructionsEN', 'instructionsAR', 'questions', 'requiresTeacherReview'],
    properties: {
      titleEN: { type: 'string' },
      titleAR: { type: 'string' },
      estimatedTimeMinutes: { type: 'number', minimum: 2, maximum: 3 },
      instructionsEN: { type: 'string' },
      instructionsAR: { type: 'string' },
      questions: {
        type: 'array',
        minItems: 3,
        maxItems: 5,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['questionId', 'type', 'skill', 'promptEN', 'promptAR', 'options', 'correctAnswer', 'explanationEN', 'explanationAR', 'points'],
          properties: {
            questionId: { type: 'string' },
            type: { type: 'string' },
            skill: { type: 'string' },
            promptEN: { type: 'string' },
            promptAR: { type: 'string' },
            options: { type: 'array', items: { type: 'string' } },
            correctAnswer: { type: 'string' },
            explanationEN: { type: 'string' },
            explanationAR: { type: 'string' },
            points: { type: 'number' }
          }
        }
      },
      requiresTeacherReview: { type: 'boolean' }
    }
  };
  return structuredGeneration({
    name: 'revision_quiz',
    schema,
    system: 'Create a 2-3 minute ESL warm-up quiz with 3-5 questions based only on the provided session and weak points. Keep answer keys teacher-only.',
    prompt: JSON.stringify(payload)
  });
}
