#!/usr/bin/env node
/**
 * GSC Collector - Main script for collecting Google Search Console data
 *
 * This script fetches:
 * - Indexed pages count (via URL inspection)
 * - Top keywords with clicks, impressions, CTR, position
 * - Search metrics (totals for 7-day and 30-day periods)
 * - Daily trends
 * - Coverage errors (low-performing pages)
 *
 * Output:
 * - Updates /data/seo-metrics.json with current GSC data
 * - Creates historical snapshot in /data/history/gsc-YYYY-MM-DD.json
 * - Cleans up history files older than 90 days
 */

import { config, validateConfig, getDateRange } from './lib/config.js';
import {
  fetchIndexedPages,
  fetchTopKeywords,
  fetchSearchMetrics,
  fetchCoverageErrors,
  fetchDailyMetrics,
} from './lib/gsc-client.js';
import { GSCMetricsSchema, type SeoMetrics, type DailyTrend } from './lib/schemas.js';
import fs from 'fs-extra';
import path from 'path';

// Console colors for better output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Clean up history files older than retention period
 */
async function cleanupHistory(): Promise<void> {
  const historyPath = config.output.historyPath;
  const retentionDays = config.retentionDays;
  const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

  try {
    // Ensure history directory exists
    await fs.ensureDir(historyPath);

    const files = await fs.readdir(historyPath);
    let removedCount = 0;

    for (const file of files) {
      if (file.startsWith('gsc-') && file.endsWith('.json')) {
        const dateStr = file.replace('gsc-', '').replace('.json', '');
        const fileDate = new Date(dateStr);

        if (isNaN(fileDate.getTime())) {
          // Invalid date format, skip
          continue;
        }

        if (fileDate < cutoffDate) {
          const filePath = path.join(historyPath, file);
          await fs.remove(filePath);
          log(`  Removed old history file: ${file}`, 'yellow');
          removedCount++;
        }
      }
    }

    if (removedCount > 0) {
      log(`Cleaned up ${removedCount} history files older than ${retentionDays} days`, 'cyan');
    }
  } catch (error: any) {
    log(`Warning: Could not cleanup history: ${error.message}`, 'yellow');
  }
}

/**
 * Main collector function
 */
async function main(): Promise<void> {
  const startTime = Date.now();
  log('\n========================================', 'cyan');
  log('  GSC Collector Starting', 'cyan');
  log('========================================\n', 'cyan');

  // Step 1: Validate configuration
  log('Step 1: Validating configuration...', 'cyan');
  try {
    await validateConfig();
    log('  Configuration valid', 'green');
    log(`  Site URL: ${config.gsc.siteUrl}`, 'reset');
    log(`  Output: ${config.output.dataPath}`, 'reset');
    log(`  History: ${config.output.historyPath}`, 'reset');
  } catch (error: any) {
    log(`Configuration error: ${error.message}`, 'red');
    process.exit(1);
  }

  // Step 2: Calculate date ranges
  log('\nStep 2: Calculating date ranges...', 'cyan');
  const today = new Date();
  const endDate = today.toISOString().split('T')[0];

  const range7d = getDateRange(7);
  const range30d = getDateRange(30);

  log(`  End date: ${endDate}`, 'reset');
  log(`  7-day range: ${range7d.startDate} to ${range7d.endDate}`, 'reset');
  log(`  30-day range: ${range30d.startDate} to ${range30d.endDate}`, 'reset');

  // Step 3: Fetch indexed pages
  log('\nStep 3: Fetching indexed pages...', 'cyan');
  let indexedPagesData;
  try {
    indexedPagesData = await fetchIndexedPages(config.gsc.siteUrl);
    log(`  Indexed: ${indexedPagesData.indexedCount} of ${indexedPagesData.totalSubmitted} submitted`, 'green');
    if (indexedPagesData.unindexedUrls.length > 0) {
      log(`  Unindexed URLs (sample): ${indexedPagesData.unindexedUrls.slice(0, 3).join(', ')}`, 'yellow');
    }
  } catch (error: any) {
    log(`  Error fetching indexed pages: ${error.message}`, 'red');
    indexedPagesData = { indexedCount: 0, totalSubmitted: 0, unindexedUrls: [] };
  }

  // Step 4: Fetch top keywords
  log('\nStep 4: Fetching top keywords...', 'cyan');
  let topKeywords = [];
  try {
    topKeywords = await fetchTopKeywords(config.gsc.siteUrl, range30d.startDate, range30d.endDate, 50);
    log(`  Found ${topKeywords.length} keywords`, 'green');
    if (topKeywords.length > 0) {
      log(`  Top 3 keywords:`, 'reset');
      topKeywords.slice(0, 3).forEach((kw, i) => {
        log(`    ${i + 1}. "${kw.query}" - ${kw.clicks} clicks, pos ${kw.position.toFixed(1)}`, 'reset');
      });
    }
  } catch (error: any) {
    log(`  Error fetching keywords: ${error.message}`, 'red');
  }

  // Step 5: Fetch search metrics
  log('\nStep 5: Fetching search metrics...', 'cyan');
  let metrics7d, metrics30d;
  try {
    metrics7d = await fetchSearchMetrics(config.gsc.siteUrl, range7d.startDate, range7d.endDate);
    log(`  7-day: ${metrics7d.totalClicks} clicks, ${metrics7d.totalImpressions} impressions`, 'green');

    metrics30d = await fetchSearchMetrics(config.gsc.siteUrl, range30d.startDate, range30d.endDate);
    log(`  30-day: ${metrics30d.totalClicks} clicks, ${metrics30d.totalImpressions} impressions`, 'green');
  } catch (error: any) {
    log(`  Error fetching search metrics: ${error.message}`, 'red');
    metrics7d = { totalClicks: 0, totalImpressions: 0, avgCTR: 0, avgPosition: 0 };
    metrics30d = { totalClicks: 0, totalImpressions: 0, avgCTR: 0, avgPosition: 0 };
  }

  // Step 6: Fetch daily metrics for trends
  log('\nStep 6: Fetching daily metrics for trends...', 'cyan');
  let dailyMetrics = [];
  try {
    dailyMetrics = await fetchDailyMetrics(config.gsc.siteUrl, range30d.startDate, range30d.endDate);
    log(`  Retrieved ${dailyMetrics.length} days of data`, 'green');
  } catch (error: any) {
    log(`  Error fetching daily metrics: ${error.message}`, 'yellow');
  }

  // Step 7: Fetch coverage errors
  log('\nStep 7: Fetching coverage errors...', 'cyan');
  let coverageErrors = [];
  try {
    coverageErrors = await fetchCoverageErrors(config.gsc.siteUrl, range30d.startDate, range30d.endDate);
    log(`  Found ${coverageErrors.length} pages with potential issues`, coverageErrors.length > 0 ? 'yellow' : 'green');
  } catch (error: any) {
    log(`  Error fetching coverage errors: ${error.message}`, 'yellow');
  }

  // Step 8: Build GSC data object
  log('\nStep 8: Building GSC data object...', 'cyan');
  const gscData = {
    indexedPages: indexedPagesData.indexedCount,
    totalSubmitted: indexedPagesData.totalSubmitted,
    unindexedUrls: indexedPagesData.unindexedUrls,
    topKeywords: topKeywords,
    clicks: {
      last7Days: metrics7d.totalClicks,
      last30Days: metrics30d.totalClicks,
      trend: dailyMetrics.map(d => d.clicks),
    },
    impressions: {
      last7Days: metrics7d.totalImpressions,
      last30Days: metrics30d.totalImpressions,
      trend: dailyMetrics.map(d => d.impressions),
    },
    dailyTrend: dailyMetrics,
    avgPosition: metrics30d.avgPosition,
    avgCTR: metrics30d.avgCTR,
    coverageErrors: coverageErrors,
  };

  // Validate with Zod schema
  try {
    GSCMetricsSchema.parse(gscData);
    log('  Data validation passed', 'green');
  } catch (error: any) {
    log(`  Validation warning: ${error.message}`, 'yellow');
  }

  // Step 9: Read existing data and merge
  log('\nStep 9: Merging with existing data...', 'cyan');
  let existingData: SeoMetrics;
  try {
    existingData = await fs.readJson(config.output.dataPath);
    log(`  Read existing data from ${config.output.dataPath}`, 'green');
  } catch {
    log('  No existing data found, creating new structure', 'yellow');
    existingData = {
      lastUpdated: new Date().toISOString(),
      gsc: gscData,
      geo: {
        chatgpt: { cited: false, lastCheck: null, response: '' },
        perplexity: { cited: false, lastCheck: null, response: '' },
        claude: { cited: false, lastCheck: null, response: '' },
      },
      alerts: [],
    };
  }

  const updatedData: SeoMetrics = {
    ...existingData,
    lastUpdated: new Date().toISOString(),
    gsc: gscData,
  };

  // Step 10: Write main data file
  log('\nStep 10: Writing data files...', 'cyan');
  try {
    await fs.ensureDir(path.dirname(config.output.dataPath));
    await fs.writeJson(config.output.dataPath, updatedData, { spaces: 2 });
    log(`  Updated ${config.output.dataPath}`, 'green');
  } catch (error: any) {
    log(`  Error writing main data file: ${error.message}`, 'red');
    process.exit(1);
  }

  // Step 11: Create historical snapshot
  const historyFilename = `gsc-${endDate}.json`;
  const historyPath = path.join(config.output.historyPath, historyFilename);

  try {
    await fs.ensureDir(config.output.historyPath);
    await fs.writeJson(historyPath, {
      snapshotDate: endDate,
      collectedAt: new Date().toISOString(),
      gsc: gscData,
    }, { spaces: 2 });
    log(`  Created history snapshot: ${historyFilename}`, 'green');
  } catch (error: any) {
    log(`  Warning: Could not create history snapshot: ${error.message}`, 'yellow');
  }

  // Step 12: Cleanup old history files
  log('\nStep 12: Cleaning up old history files...', 'cyan');
  await cleanupHistory();

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  log('\n========================================', 'green');
  log('  GSC Collector Complete!', 'green');
  log('========================================', 'green');
  log(`\nSummary:`, 'cyan');
  log(`  Duration: ${duration}s`, 'reset');
  log(`  Indexed pages: ${gscData.indexedPages}`, 'reset');
  log(`  Total submitted: ${gscData.totalSubmitted}`, 'reset');
  log(`  Keywords found: ${gscData.topKeywords.length}`, 'reset');
  log(`  7-day clicks: ${gscData.clicks.last7Days}`, 'reset');
  log(`  30-day clicks: ${gscData.clicks.last30Days}`, 'reset');
  log(`  7-day impressions: ${gscData.impressions.last7Days}`, 'reset');
  log(`  30-day impressions: ${gscData.impressions.last30Days}`, 'reset');
  log(`  Coverage issues: ${gscData.coverageErrors.length}`, 'reset');
  log(`\nOutput files:`, 'cyan');
  log(`  Main: ${config.output.dataPath}`, 'reset');
  log(`  History: ${historyPath}`, 'reset');
  log('');
}

// Run the collector
main().catch((error) => {
  log(`\nGSC Collector failed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});