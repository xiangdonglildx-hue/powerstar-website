import gplay from 'google-play-scraper';
import * as fs from 'fs-extra';
import * as path from 'path';

const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'reviews');

const APPS = [
  { name: 'thermometer', appId: 'com.firefly.thermometer' },
  { name: 'microphone', appId: 'com.microphone.bbmic.lite' },
  { name: 'voice-changer', appId: 'com.lixiangdong.voicechange' },
  { name: 'lumiwall', appId: 'com.lixiangdong.lumiwall' },
  { name: 'ai-photo', appId: 'com.lixiangdong.aiphoto' },
];

interface ReviewData {
  id: string;
  userName: string;
  text: string;
  score: number;
  date: string;
  version: string;
  thumbsUp: number;
  replyText: string;
  replyDate: string;
}

interface AppInfo {
  title: string;
  description: string;
  summary: string;
  score: number;
  ratings: number;
  reviews: number;
  installs: string;
  genre: string;
  free: boolean;
  containsAds: boolean;
  released: string;
  updated: string;
  version: string;
  developer: string;
}

async function fetchAppInfo(appId: string): Promise<AppInfo | null> {
  try {
    const info = await gplay.app({ appId });
    return {
      title: info.title,
      description: info.description,
      summary: info.summary,
      score: info.score,
      ratings: info.ratings,
      reviews: info.reviews,
      installs: info.installs,
      genre: info.genre,
      free: info.free,
      containsAds: info.containsAds,
      released: info.released,
      updated: info.updated,
      version: info.version,
      developer: info.developer,
    };
  } catch (error: any) {
    console.error(`Error fetching app info for ${appId}:`, error.message);
    return null;
  }
}

async function fetchReviews(appId: string): Promise<ReviewData[]> {
  try {
    const reviews = await gplay.reviews({
      appId,
      sort: gplay.sort.NEWEST,
      num: 100, // Fetch 100 reviews
      lang: 'en',
      country: 'us',
    });

    return reviews.data.map((review: any) => ({
      id: review.id,
      userName: review.userName,
      text: review.text,
      score: review.score,
      date: review.date,
      version: review.version,
      thumbsUp: review.thumbsUp,
      replyText: review.replyText || '',
      replyDate: review.replyDate || '',
    }));
  } catch (error: any) {
    console.error(`Error fetching reviews for ${appId}:`, error.message);
    return [];
  }
}

async function main() {
  console.log('Fetching Google Play app data and reviews...\n');

  await fs.ensureDir(OUTPUT_DIR);

  const allData: Record<string, { info: AppInfo | null; reviews: ReviewData[] }> = {};

  for (const app of APPS) {
    console.log(`\nFetching data for ${app.name} (${app.appId})...`);

    // Fetch app info and reviews in parallel
    const [info, reviews] = await Promise.all([
      fetchAppInfo(app.appId),
      fetchReviews(app.appId),
    ]);

    allData[app.name] = { info, reviews };

    // Save individual app data
    const outputPath = path.join(OUTPUT_DIR, `${app.name}-data.json`);
    await fs.writeJson(outputPath, { info, reviews }, { spaces: 2 });
    console.log(`  Saved to ${outputPath}`);
    console.log(`  Info: ${info ? `${info.title}, ${info.score}★, ${info.installs}` : 'Not found'}`);
    console.log(`  Reviews: ${reviews.length} fetched`);
  }

  // Save combined data
  const combinedPath = path.join(OUTPUT_DIR, 'all-apps-data.json');
  await fs.writeJson(combinedPath, allData, { spaces: 2 });
  console.log(`\nAll data saved to ${combinedPath}`);

  // Print summary
  console.log('\n=== Summary ===');
  for (const app of APPS) {
    const data = allData[app.name];
    if (data.info) {
      const avgScore = data.reviews.length > 0
        ? (data.reviews.reduce((sum, r) => sum + r.score, 0) / data.reviews.length).toFixed(1)
        : 'N/A';
      console.log(`\n${app.name}:`);
      console.log(`  Title: ${data.info.title}`);
      console.log(`  Rating: ${data.info.score}★ (${data.info.ratings} ratings)`);
      console.log(`  Installs: ${data.info.installs}`);
      console.log(`  Reviews fetched: ${data.reviews.length}`);
      console.log(`  Avg from fetched: ${avgScore}★`);
    } else {
      console.log(`\n${app.name}: App not found`);
    }
  }
}

main().catch(console.error);
