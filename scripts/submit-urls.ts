#!/usr/bin/env node
/**
 * URL Submitter - Batch submit URLs to Google Indexing API
 *
 * This script requests indexing for URLs that are not yet indexed.
 * Uses Google Indexing API with service account authentication.
 *
 * Usage:
 *   npx tsx submit-urls.ts [--dry-run] [--limit N]
 */

import { google } from 'googleapis';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const CONFIG = {
  credentialsPath: path.join(__dirname, 'credentials.json'),
  siteUrl: 'sc-domain:powerstarapps.com',
  sitemapPath: path.join(__dirname, '../sitemap.xml'),
 seoMetricsPath: path.join(__dirname, '../data/seo-metrics.json'),
  batchSize: 100, // Indexing API allows up to 100 URLs per batch
  delayBetweenBatches: 1000, // 1 second between batches
};

// Console colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

interface UrlStatus {
  url: string;
  status: 'pending' | 'submitted' | 'error';
  message?: string;
}

/**
 * Get authenticated Google API client with Indexing API scope
 */
async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CONFIG.credentialsPath,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });
  return auth;
}

/**
 * Get Indexing API client
 */
async function getIndexingClient() {
  const auth = await getAuthClient();
  return google.indexing({ version: 'v3', auth });
}

/**
 * Parse sitemap to extract URLs
 */
async function getUrlsFromSitemap(): Promise<string[]> {
  try {
    const sitemapContent = await fs.readFile(CONFIG.sitemapPath, 'utf-8');
    const urls: string[] = [];

    // Simple regex extraction of URLs from sitemap
    const urlMatches = sitemapContent.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g);
    for (const match of urlMatches) {
      urls.push(match[1]);
    }

    return urls;
  } catch (error: any) {
    throw new Error(`Failed to parse sitemap: ${error.message}`);
  }
}

/**
 * Get unindexed URLs from seo-metrics.json, or fallback to sitemap
 */
async function getUnindexedUrls(): Promise<string[]> {
  try {
    const metrics = await fs.readJson(CONFIG.seoMetricsPath);
    const unindexed = metrics.gsc?.unindexedUrls || [];

    // If unindexed URLs exist, use them; otherwise use sitemap
    if (unindexed.length > 0) {
      return unindexed;
    }

    log('No unindexed URLs in metrics, using sitemap...', 'yellow');
    return getUrlsFromSitemap();
  } catch (error: any) {
    log(`Warning: Could not read seo-metrics.json, using sitemap URLs`, 'yellow');
    return getUrlsFromSitemap();
  }
}

/**
 * Submit a single URL for indexing
 */
async function submitUrl(
  client: any,
  url: string,
  dryRun: boolean
): Promise<UrlStatus> {
  if (dryRun) {
    return { url, status: 'pending', message: 'Dry run - not submitted' };
  }

  try {
    const response = await client.urlNotifications.publish({
      requestBody: {
        url: url,
        type: 'URL_UPDATED',
      },
    });

    return {
      url,
      status: 'submitted',
      message: response.data?.urlNotificationMetadata?.notifyTime || 'Success',
    };
  } catch (error: any) {
    return {
      url,
      status: 'error',
      message: error.message || 'Unknown error',
    };
  }
}

/**
 * Submit URLs in batches with rate limiting
 */
async function submitUrlsBatch(
  client: any,
  urls: string[],
  dryRun: boolean,
  limit?: number
): Promise<UrlStatus[]> {
  const urlsToSubmit = limit ? urls.slice(0, limit) : urls;
  const results: UrlStatus[] = [];

  log(`\nSubmitting ${urlsToSubmit.length} URLs...`, 'cyan');

  for (let i = 0; i < urlsToSubmit.length; i += CONFIG.batchSize) {
    const batch = urlsToSubmit.slice(i, i + CONFIG.batchSize);
    const batchNum = Math.floor(i / CONFIG.batchSize) + 1;
    const totalBatches = Math.ceil(urlsToSubmit.length / CONFIG.batchSize);

    log(`\nBatch ${batchNum}/${totalBatches} (${batch.length} URLs)`, 'dim');

    for (const url of batch) {
      const result = await submitUrl(client, url, dryRun);
      results.push(result);

      const statusIcon = result.status === 'submitted' ? '✓' :
                        result.status === 'pending' ? '○' : '✗';
      const statusColor = result.status === 'submitted' ? 'green' :
                         result.status === 'pending' ? 'yellow' : 'red';

      log(`  ${statusIcon} ${url}`, statusColor);
    }

    // Delay between batches
    if (i + CONFIG.batchSize < urlsToSubmit.length) {
      await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenBatches));
    }
  }

  return results;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const useSitemap = args.includes('--sitemap');
  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined;

  log('\n========================================', 'cyan');
  log('  URL Indexing Submitter', 'cyan');
  log('========================================\n', 'cyan');

  if (dryRun) {
    log('🔍 DRY RUN MODE - No actual submissions', 'yellow');
  }

  try {
    // Check credentials
    if (!await fs.pathExists(CONFIG.credentialsPath)) {
      throw new Error(`Credentials not found at ${CONFIG.credentialsPath}`);
    }

    // Get URLs to submit
    log('📋 Fetching URLs...', 'cyan');
    const urls = useSitemap ? await getUrlsFromSitemap() : await getUnindexedUrls();

    if (urls.length === 0) {
      log('✅ No unindexed URLs found!', 'green');
      return;
    }

    log(`Found ${urls.length} unindexed URLs`, 'yellow');

    // Get Indexing API client
    const client = await getIndexingClient();

    // Submit URLs
    const results = await submitUrlsBatch(client, urls, dryRun, limit);

    // Summary
    log('\n========================================', 'cyan');
    log('  Summary', 'cyan');
    log('========================================', 'cyan');

    const submitted = results.filter(r => r.status === 'submitted').length;
    const pending = results.filter(r => r.status === 'pending').length;
    const errors = results.filter(r => r.status === 'error').length;

    log(`\n  Submitted: ${submitted}`, 'green');
    log(`  Pending: ${pending}`, 'yellow');
    log(`  Errors: ${errors}`, errors > 0 ? 'red' : 'dim');

    if (dryRun) {
      log('\n  This was a dry run. Remove --dry-run to actually submit.', 'yellow');
    } else if (submitted > 0) {
      log('\n  URLs submitted successfully! Check GSC in 24-48 hours for updates.', 'green');
    }

    // Show errors if any
    if (errors > 0) {
      log('\n  Errors:', 'red');
      results
        .filter(r => r.status === 'error')
        .forEach(r => log(`    - ${r.url}: ${r.message}`, 'red'));
    }

  } catch (error: any) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();