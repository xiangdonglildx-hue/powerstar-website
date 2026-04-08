import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Citation detection keywords per CONTEXT.md decision D-03
const CITATION_KEYWORDS = [
  'powerstarapps.com',
  'Power Star Apps',
  'PowerStar'
];

// ChatGPT client with CodeX proxy per CONTEXT.md decision D-01
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL, // http://192.168.0.213:8080/v1
});

// Gemini client per CONTEXT.md decision D-02
const geminiApiKey = process.env.GOOGLE_AI_API_KEY;
const gemini = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

/**
 * Query ChatGPT via CodeX proxy
 */
export async function queryChatGPT(question: string): Promise<{ response: string; model: string }> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: question }],
    max_tokens: 1000,
  });

  return {
    response: completion.choices[0]?.message?.content || '',
    model: 'gpt-4o'
  };
}

/**
 * Query Gemini via Google AI API
 */
export async function queryGemini(question: string): Promise<{ response: string; model: string }> {
  if (!gemini) {
    throw new Error('Google AI API key not configured. Set GOOGLE_AI_API_KEY in .env');
  }

  const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(question);

  return {
    response: result.response.text(),
    model: 'gemini-2.0-flash'
  };
}

/**
 * Detect if response contains citations (domain/brand mentions)
 */
export function detectCitation(response: string): { cited: boolean; matchedKeywords: string[] } {
  const matchedKeywords = CITATION_KEYWORDS.filter(kw =>
    response.toLowerCase().includes(kw.toLowerCase())
  );

  return {
    cited: matchedKeywords.length > 0,
    matchedKeywords
  };
}

// Type exports
export type AIPlatform = 'chatgpt' | 'gemini';

export type QueryResult = {
  platform: AIPlatform;
  question: string;
  response: string;
  cited: boolean;
  matchedKeywords: string[];
  timestamp: string;
};