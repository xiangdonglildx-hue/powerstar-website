import { google } from 'googleapis';
import * as fs from 'fs-extra';
import * as path from 'path';

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'reviews');

const APPS = [
  { name: 'thermometer', packageName: 'com.firefly.thermometer' },
  { name: 'microphone', packageName: 'com.microphone.bbmic.lite' },
  { name: 'voice-changer', packageName: 'com.lixiangdong.voicechange' },
  { name: 'lumiwall', packageName: 'com.lixiangdong.lumiwall' },
  { name: 'ai-photo', packageName: 'com.lixiangdong.aiphoto' },
];

async function getAuthToken() {
  const credentials = await fs.readJson(CREDENTIALS_PATH);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });
  return auth;
}

async function fetchReviews(auth: any, packageName: string, appName: string) {
  const androidpublisher = google.androidpublisher({ version: 'v3', auth });

  try {
    const reviews: any[] = [];
    let token: string | undefined;
    let pageCount = 0;
    const MAX_PAGES = 5; // Fetch up to 5 pages (250 reviews max per app)

    do {
      const response = await androidpublisher.reviews.list({
        packageName,
        maxResults: 50,
        startIndex: token ? parseInt(token) : 0,
      });

      if (response.data.reviews) {
        reviews.push(...response.data.reviews);
      }

      token = response.data.tokenPagination?.nextPageToken;
      pageCount++;
      console.log(`  Fetched page ${pageCount}: ${reviews.length} reviews so far for ${appName}`);
    } while (token && pageCount < MAX_PAGES);

    // Process and simplify review data
    const processedReviews = reviews.map((review: any) => {
      const comment = review.comments?.[0];
      const userComment = comment?.userComment;
      const developerComment = comment?.developerComment;

      return {
        reviewId: review.reviewId,
        authorName: review.authorName,
        text: userComment?.text || '',
        starRating: userComment?.starRating || 0,
        lastModified: userComment?.lastModified?.seconds
          ? new Date(parseInt(userComment.lastModified.seconds) * 1000).toISOString()
          : '',
        language: userComment?.reviewerLanguage || '',
        device: userComment?.device || '',
        androidVersion: userComment?.androidOsVersion || 0,
        appVersionCode: userComment?.appVersionCode || 0,
        appVersionName: userComment?.appVersionName || '',
        developerReply: developerComment?.text || '',
        developerReplyTime: developerComment?.lastModified?.seconds
          ? new Date(parseInt(developerComment.lastModified.seconds) * 1000).toISOString()
          : '',
      };
    });

    return processedReviews;
  } catch (error: any) {
    console.error(`Error fetching reviews for ${appName}:`, error.message);
    if (error.code === 403) {
      console.error('  → Permission denied. Service account needs Google Play Developer API access.');
    }
    return [];
  }
}

async function main() {
  console.log('Fetching Google Play reviews for all apps...\n');

  await fs.ensureDir(OUTPUT_DIR);
  const auth = await getAuthToken();

  const allReviews: Record<string, any[]> = {};

  for (const app of APPS) {
    console.log(`\nFetching reviews for ${app.name} (${app.packageName})...`);
    const reviews = await fetchReviews(auth, app.packageName, app.name);

    allReviews[app.name] = reviews;

    // Save individual app reviews
    const outputPath = path.join(OUTPUT_DIR, `${app.name}-reviews.json`);
    await fs.writeJson(outputPath, reviews, { spaces: 2 });
    console.log(`  Saved ${reviews.length} reviews to ${outputPath}`);
  }

  // Save combined reviews
  const combinedPath = path.join(OUTPUT_DIR, 'all-reviews.json');
  await fs.writeJson(combinedPath, allReviews, { spaces: 2 });
  console.log(`\nAll reviews saved to ${combinedPath}`);

  // Print summary
  console.log('\n=== Summary ===');
  for (const app of APPS) {
    const reviews = allReviews[app.name];
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum: number, r: any) => sum + r.starRating, 0) / reviews.length).toFixed(1)
      : 'N/A';
    console.log(`${app.name}: ${reviews.length} reviews, avg rating: ${avgRating}`);
  }
}

main().catch(console.error);
