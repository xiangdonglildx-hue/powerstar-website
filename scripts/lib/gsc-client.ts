import { google } from 'googleapis';
import { config } from './config.js';
import type { Keyword, IndexedPagesResult, SearchMetricsResult, CoverageError } from './schemas.js';
import fs from 'fs-extra';
import path from 'path';
import xml2js from 'xml2js';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Rate limiting
const URL_INSPECTION_BATCH_SIZE = 50;

/**
 * Get authenticated Google API client
 */
async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: config.gsc.credentialsPath,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  return auth;
}

/**
 * Get Search Console API client
 */
async function getSearchConsoleClient() {
  const auth = await getAuthClient();
  return google.searchconsole({ version: 'v1', auth });
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry wrapper for API calls with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  context: string,
  retries = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Handle specific error codes
      if (error.code === 403) {
        throw new Error(
          `Permission denied (403): Service Account not added to GSC property. ` +
          `Add ${await getServiceAccountEmail()} to Search Console property "${config.gsc.siteUrl}"`
        );
      }

      if (error.code === 404) {
        throw new Error(
          `Site URL not found (404): "${config.gsc.siteUrl}" not found in GSC. ` +
          `Verify the URL format matches your Search Console property.`
        );
      }

      if (error.code === 429) {
        console.log(`Rate limited. Waiting ${RETRY_DELAY_MS * attempt}ms before retry ${attempt}/${retries}...`);
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }

      // For network errors, retry
      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
        console.log(`Network error: ${error.code}. Retrying ${attempt}/${retries}...`);
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }

      // For other errors, throw immediately
      throw error;
    }
  }

  throw new Error(`${context} failed after ${retries} retries: ${lastError?.message}`);
}

/**
 * Get service account email from credentials
 */
async function getServiceAccountEmail(): Promise<string> {
  try {
    const creds = await fs.readJson(config.gsc.credentialsPath);
    return creds.client_email || 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Parse sitemap.xml to extract URLs
 */
async function parseSitemap(sitemapPath: string): Promise<string[]> {
  try {
    const sitemapContent = await fs.readFile(sitemapPath, 'utf-8');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(sitemapContent);

    const urls: string[] = [];
    if (result.urlset && result.urlset.url) {
      for (const urlEntry of result.urlset.url) {
        if (urlEntry.loc && urlEntry.loc[0]) {
          urls.push(urlEntry.loc[0]);
        }
      }
    }

    return urls;
  } catch (error: any) {
    console.warn(`Warning: Could not parse sitemap at ${sitemapPath}: ${error.message}`);
    return [];
  }
}

/**
 * Fetch indexed pages count using URL Inspection API
 * Note: GSC doesn't have a direct "count indexed pages" API,
 * so we inspect URLs from sitemap and count successful indexing
 */
export async function fetchIndexedPages(siteUrl: string): Promise<IndexedPagesResult> {
  console.log('Fetching indexed pages...');

  const searchconsole = await getSearchConsoleClient();

  // Try to find and parse sitemap
  const sitemapPath = path.resolve('../sitemap.xml');
  let submittedUrls: string[] = [];

  try {
    submittedUrls = await parseSitemap(sitemapPath);
    console.log(`Found ${submittedUrls.length} URLs in sitemap`);
  } catch {
    console.log('No sitemap found, using site URL only');
    submittedUrls = [siteUrl];
  }

  // Limit to first 50 URLs to avoid quota issues
  const urlsToInspect = submittedUrls.slice(0, URL_INSPECTION_BATCH_SIZE);
  let indexedCount = 0;
  const unindexedUrls: string[] = [];

  for (const url of urlsToInspect) {
    try {
      const response = await withRetry(
        () => searchconsole.urlInspection.index.inspect({
          siteUrl: siteUrl,
          inspectionUrl: url,
        }),
        `URL inspection for ${url}`
      );

      const verdict = response.data.inspectionResult?.indexStatusResult?.verdict;
      if (verdict === 'VERDICT_PASS' || verdict === 'PASS') {
        indexedCount++;
      } else {
        unindexedUrls.push(url);
      }

      // Small delay to avoid rate limiting
      await sleep(100);

    } catch (error: any) {
      console.warn(`Warning: Could not inspect URL ${url}: ${error.message}`);
      unindexedUrls.push(url);
    }
  }

  // If sitemap has more URLs than we inspected, estimate total submitted
  const totalSubmitted = submittedUrls.length;

  // Estimate total indexed based on sample ratio
  const estimatedIndexed = urlsToInspect.length > 0
    ? Math.round((indexedCount / urlsToInspect.length) * totalSubmitted)
    : 0;

  console.log(`Indexed pages: ~${estimatedIndexed} (inspected ${urlsToInspect.length} of ${totalSubmitted} URLs)`);

  return {
    indexedCount: estimatedIndexed,
    totalSubmitted,
    unindexedUrls: unindexedUrls.slice(0, 10), // Return first 10 unindexed for debugging
  };
}

/**
 * Fetch top keywords from GSC
 */
export async function fetchTopKeywords(
  siteUrl: string,
  startDate: string,
  endDate: string,
  limit: number = 50
): Promise<Keyword[]> {
  console.log(`Fetching top ${limit} keywords from ${startDate} to ${endDate}...`);

  const searchconsole = await getSearchConsoleClient();

  const response = await withRetry(
    () => searchconsole.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query'],
        metrics: ['clicks', 'impressions', 'ctr', 'position'],
        rowLimit: limit,
        orderBy: [
          { fieldName: 'clicks', sortOrder: 'DESCENDING' }
        ],
      },
    }),
    'Fetch top keywords'
  );

  const keywords: Keyword[] = [];

  if (response.data.rows && response.data.rows.length > 0) {
    for (const row of response.data.rows) {
      keywords.push({
        query: row.keys?.[0] || '(unknown)',
        impressions: row.impressions || 0,
        clicks: row.clicks || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
      });
    }
  }

  console.log(`Found ${keywords.length} keywords`);
  return keywords;
}

/**
 * Fetch aggregate search metrics (total clicks, impressions, etc.)
 */
export async function fetchSearchMetrics(
  siteUrl: string,
  startDate: string,
  endDate: string
): Promise<SearchMetricsResult> {
  console.log(`Fetching search metrics from ${startDate} to ${endDate}...`);

  const searchconsole = await getSearchConsoleClient();

  const response = await withRetry(
    () => searchconsole.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        startDate,
        endDate,
        // No dimensions = aggregate totals
        metrics: ['clicks', 'impressions', 'ctr', 'position'],
      },
    }),
    'Fetch search metrics'
  );

  if (response.data.rows && response.data.rows.length > 0) {
    const row = response.data.rows[0];
    return {
      totalClicks: row.clicks || 0,
      totalImpressions: row.impressions || 0,
      avgCTR: row.ctr || 0,
      avgPosition: row.position || 0,
    };
  }

  // Return zeros if no data
  return {
    totalClicks: 0,
    totalImpressions: 0,
    avgCTR: 0,
    avgPosition: 0,
  };
}

/**
 * Fetch pages with potential coverage issues
 * Pages with very low impressions might have indexing or quality issues
 */
export async function fetchCoverageErrors(
  siteUrl: string,
  startDate: string,
  endDate: string
): Promise<CoverageError[]> {
  console.log(`Fetching coverage issues from ${startDate} to ${endDate}...`);

  const searchconsole = await getSearchConsoleClient();

  // Get all pages and filter for low impressions locally
  const response = await withRetry(
    () => searchconsole.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['page'],
        metrics: ['clicks', 'impressions'],
        rowLimit: 100,
      },
    }),
    'Fetch coverage errors'
  );

  const coverageErrors: CoverageError[] = [];

  if (response.data.rows && response.data.rows.length > 0) {
    for (const row of response.data.rows) {
      // Filter locally for pages with low impressions (< 10)
      const impressions = row.impressions || 0;
      if (impressions < 10) {
        coverageErrors.push({
          url: row.keys?.[0] || '(unknown)',
          impressions: impressions,
          clicks: row.clicks || 0,
        });
      }
    }
  }

  console.log(`Found ${coverageErrors.length} pages with potential issues`);
  return coverageErrors;
}

/**
 * Fetch daily metrics for trend calculation
 */
export async function fetchDailyMetrics(
  siteUrl: string,
  startDate: string,
  endDate: string
): Promise<{ date: string; clicks: number; impressions: number }[]> {
  console.log(`Fetching daily metrics from ${startDate} to ${endDate}...`);

  const searchconsole = await getSearchConsoleClient();

  const response = await withRetry(
    () => searchconsole.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['date'],
        metrics: ['clicks', 'impressions'],
        rowLimit: 30,
      },
    }),
    'Fetch daily metrics'
  );

  const dailyMetrics: { date: string; clicks: number; impressions: number }[] = [];

  if (response.data.rows && response.data.rows.length > 0) {
    for (const row of response.data.rows) {
      dailyMetrics.push({
        date: row.keys?.[0] || '',
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
      });
    }
  }

  // Sort by date ascending
  dailyMetrics.sort((a, b) => a.date.localeCompare(b.date));

  return dailyMetrics;
}

// Export service account email getter for error messages
export { getServiceAccountEmail };