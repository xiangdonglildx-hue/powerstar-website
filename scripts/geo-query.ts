import { queryChatGPT, queryGemini, detectCitation, type AIPlatform, type QueryResult } from './lib/geo-client.js';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// ES module path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 15 Questions per CONTEXT.md decision D-04
const QUESTIONS = [
  // Thermometer (3)
  "best thermometer app for Android",
  "room temperature app for phone",
  "indoor thermometer app",
  // Microphone (2)
  "best microphone app for Android",
  "voice recorder app for phone",
  // Voice Changer (2)
  "voice changer app for Android",
  "best voice modulator app",
  // Lumiwall (3)
  "HD wallpapers for Android",
  "best wallpaper app for phone",
  "live wallpaper app",
  // AI Photo (5)
  "AI photo filter app",
  "photo editing app with AI effects",
  "cartoon photo filter app",
  "anime photo filter",
  "vintage photo editor app"
];

// Data paths
const DATA_PATH = path.resolve(__dirname, '../data/seo-metrics.json');
const HISTORY_PATH = path.resolve(__dirname, '../data/history/ai-responses');

/**
 * Query a platform with all questions
 */
async function queryPlatform(platform: AIPlatform, questions: string[]): Promise<QueryResult[]> {
  const results: QueryResult[] = [];
  const queryFn = platform === 'chatgpt' ? queryChatGPT : queryGemini;

  for (const question of questions) {
    try {
      const { response, model } = await queryFn(question);
      const { cited, matchedKeywords } = detectCitation(response);

      results.push({
        platform,
        question,
        response,
        cited,
        matchedKeywords,
        timestamp: new Date().toISOString()
      });

      console.log(`  [${platform}] "${question}" -> cited: ${cited}`);
    } catch (error: any) {
      console.error(`  [${platform}] Error querying "${question}": ${error.message}`);
      results.push({
        platform,
        question,
        response: `Error: ${error.message}`,
        cited: false,
        matchedKeywords: [],
        timestamp: new Date().toISOString()
      });
    }
  }

  return results;
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  const startTime = Date.now();
  console.log('\n========================================');
  console.log('  GEO Query Script Starting');
  console.log('========================================\n');

  // Step 1: Query ChatGPT
  console.log('Step 1: Querying ChatGPT...');
  const chatgptResults = await queryPlatform('chatgpt', QUESTIONS);

  // Step 2: Query Gemini
  console.log('\nStep 2: Querying Gemini...');
  const geminiResults = await queryPlatform('gemini', QUESTIONS);

  // Step 3: Aggregate results
  console.log('\nStep 3: Aggregating results...');
  const chatgptCitations = chatgptResults.filter(r => r.cited).map(r => r.question);
  const geminiCitations = geminiResults.filter(r => r.cited).map(r => r.question);

  const geoData = {
    chatgpt: {
      cited: chatgptCitations.length > 0,
      lastCheck: new Date().toISOString().split('T')[0],
      citations: chatgptCitations,
      response: chatgptResults.map(r => `[Q: ${r.question}] ${r.response.slice(0, 200)}...`).join('\n\n').slice(0, 5000),
      model: 'gpt-4o'
    },
    gemini: {
      cited: geminiCitations.length > 0,
      lastCheck: new Date().toISOString().split('T')[0],
      citations: geminiCitations,
      response: geminiResults.map(r => `[Q: ${r.question}] ${r.response.slice(0, 200)}...`).join('\n\n').slice(0, 5000),
      model: 'gemini-pro'
    }
  };

  // Step 4: Read existing data and merge
  console.log('\nStep 4: Merging with existing data...');
  let existingData;
  try {
    existingData = await fs.readJson(DATA_PATH);
  } catch {
    existingData = { lastUpdated: new Date().toISOString(), gsc: {}, geo: {}, alerts: [] };
  }

  const updatedData = {
    ...existingData,
    lastUpdated: new Date().toISOString(),
    geo: geoData
  };

  // Step 5: Write main data file
  console.log('\nStep 5: Writing data files...');
  await fs.writeJson(DATA_PATH, updatedData, { spaces: 2 });
  console.log(`  Updated ${DATA_PATH}`);

  // Step 6: Save history
  const today = new Date().toISOString().split('T')[0];
  await fs.ensureDir(HISTORY_PATH);
  await fs.writeJson(
    path.join(HISTORY_PATH, `geo-${today}.json`),
    { date: today, chatgpt: chatgptResults, gemini: geminiResults },
    { spaces: 2 }
  );
  console.log(`  Created history: geo-${today}.json`);

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n========================================');
  console.log('  GEO Query Complete!');
  console.log('========================================');
  console.log(`\nSummary:`);
  console.log(`  Duration: ${duration}s`);
  console.log(`  ChatGPT citations: ${chatgptCitations.length}/${QUESTIONS.length}`);
  console.log(`  Gemini citations: ${geminiCitations.length}/${QUESTIONS.length}`);
  console.log(`  Total questions: ${QUESTIONS.length}`);
  console.log('');
}

main().catch((error) => {
  console.error('GEO Query failed:', error);
  process.exit(1);
});