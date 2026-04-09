#!/usr/bin/env node
/**
 * Anomaly Detection Script
 *
 * Detects SEO anomalies by comparing current metrics against previous day data:
 * - Traffic drop: >30% decrease in clicks (P1 severity)
 * - Indexing drop: >20% gap in indexed pages vs submitted (P1 severity)
 * - Position drop: >5 positions for top keywords (P2 severity)
 *
 * Output:
 * - Creates /data/anomalies.json with detected anomalies
 * - Updates /data/seo-metrics.json alerts array
 */

import { config } from './lib/config.js';
import {
  ALERT_THRESHOLDS,
  calculatePercentChange,
  calculatePositionDrop,
  createAnomaly,
  type Anomaly,
} from './lib/alert-config.js';
import { type SeoMetrics, type Keyword, type GSCMetrics } from './lib/schemas.js';
import fs from 'fs-extra';
import path from 'path';

// Console colors
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
 * Load current SEO metrics from main data file
 */
async function loadCurrentMetrics(): Promise<SeoMetrics> {
  try {
    const data = await fs.readJson(config.output.dataPath);
    return data as SeoMetrics;
  } catch {
    log(`No current metrics found at ${config.output.dataPath}`, 'yellow');
    throw new Error('Current metrics file not found. Run gsc-collector first.');
  }
}

/**
 * Load previous day metrics from history file
 * Looks for the most recent file matching gsc-YYYY-MM-DD.json pattern
 */
async function loadPreviousMetrics(): Promise<GSCMetrics | null> {
  const historyPath = config.output.historyPath;

  try {
    // Ensure history directory exists
    await fs.ensureDir(historyPath);

    // Get all GSC history files
    const files = await fs.readdir(historyPath);
    const gscFiles = files
      .filter(f => f.startsWith('gsc-') && f.endsWith('.json'))
      .sort()
      .reverse(); // Most recent first

    if (gscFiles.length === 0) {
      log('No history files found', 'yellow');
      return null;
    }

    // Skip today's file, use the previous one
    const today = new Date().toISOString().split('T')[0];
    const todayFile = `gsc-${today}.json`;

    let previousFile = gscFiles[0];
    if (previousFile === todayFile && gscFiles.length > 1) {
      previousFile = gscFiles[1];
    }

    const filePath = path.join(historyPath, previousFile);
    const historyData = await fs.readJson(filePath);

    log(`Loaded previous metrics from ${previousFile}`, 'green');
    return historyData.gsc as GSCMetrics;
  } catch (error: any) {
    log(`Error loading previous metrics: ${error.message}`, 'yellow');
    return null;
  }
}

/**
 * Detect traffic drop anomaly
 * Compares clicks.last7Days between current and previous
 */
function detectTrafficDrop(current: GSCMetrics, previous: GSCMetrics | null): Anomaly | null {
  if (!previous) {
    log('Skipping traffic drop detection - no previous data', 'yellow');
    return null;
  }

  const currentClicks = current.clicks.last7Days;
  const previousClicks = previous.clicks.last7Days;

  // Calculate percent change (positive = drop)
  const percentChange = calculatePercentChange(currentClicks, previousClicks);

  log(`Traffic check: current=${currentClicks}, previous=${previousClicks}, change=${percentChange.toFixed(1)}%`, 'reset');

  if (percentChange > ALERT_THRESHOLDS.TRAFFIC_DROP_THRESHOLD) {
    const anomaly = createAnomaly(
      'traffic_drop',
      'P1',
      'clicks.last7Days',
      percentChange,
      ALERT_THRESHOLDS.TRAFFIC_DROP_THRESHOLD,
      `Clicks dropped ${percentChange.toFixed(1)}% (from ${previousClicks} to ${currentClicks})`
    );
    log(`  TRAFFIC DROP DETECTED: ${percentChange.toFixed(1)}% decrease`, 'red');
    return anomaly;
  }

  log(`  Traffic change within threshold (${percentChange.toFixed(1)}% <= ${ALERT_THRESHOLDS.TRAFFIC_DROP_THRESHOLD}%)`, 'green');
  return null;
}

/**
 * Detect indexing drop anomaly
 * Compares indexed pages count vs total submitted pages
 */
function detectIndexingDrop(current: GSCMetrics): Anomaly | null {
  const indexedPages = current.indexedPages;
  const totalSubmitted = current.totalSubmitted;

  // Calculate unindexed percentage (gap)
  const unindexedGap = totalSubmitted > 0
    ? ((totalSubmitted - indexedPages) / totalSubmitted) * 100
    : 0;

  log(`Indexing check: indexed=${indexedPages}, submitted=${totalSubmitted}, gap=${unindexedGap.toFixed(1)}%`, 'reset');

  if (unindexedGap > ALERT_THRESHOLDS.INDEXING_DROP_THRESHOLD) {
    const anomaly = createAnomaly(
      'indexing_drop',
      'P1',
      'indexedPages',
      unindexedGap,
      ALERT_THRESHOLDS.INDEXING_DROP_THRESHOLD,
      `Indexing gap: only ${indexedPages} of ${totalSubmitted} pages indexed (${unindexedGap.toFixed(1)}% unindexed)`
    );
    log(`  INDEXING GAP DETECTED: ${unindexedGap.toFixed(1)}% of pages not indexed`, 'red');
    return anomaly;
  }

  log(`  Indexing gap within threshold (${unindexedGap.toFixed(1)}% <= ${ALERT_THRESHOLDS.INDEXING_DROP_THRESHOLD}%)`, 'green');
  return null;
}

/**
 * Detect position drop anomaly
 * Compares top keywords positions between current and previous
 */
function detectPositionDrop(current: GSCMetrics, previous: GSCMetrics | null): Anomaly[] {
  const anomalies: Anomaly[] = [];

  if (!previous) {
    log('Skipping position drop detection - no previous data', 'yellow');
    return anomalies;
  }

  // Create keyword position map from previous data
  const previousPositions = new Map<string, number>();
  previous.topKeywords.forEach(kw => {
    previousPositions.set(kw.query, kw.position);
  });

  log(`Position check: comparing ${current.topKeywords.length} keywords`, 'reset');

  // Check each top keyword for position changes
  const significantDrops: { query: string; change: number; current: number; previous: number }[] = [];

  current.topKeywords.forEach(kw => {
    const prevPos = previousPositions.get(kw.query);
    if (prevPos !== undefined) {
      const positionDrop = calculatePositionDrop(kw.position, prevPos);

      if (positionDrop > ALERT_THRESHOLDS.POSITION_DROP_THRESHOLD) {
        significantDrops.push({
          query: kw.query,
          change: positionDrop,
          current: kw.position,
          previous: prevPos,
        });
      }
    }
  });

  if (significantDrops.length > 0) {
    // Create anomaly for most significant drop or aggregate
    const worstDrop = significantDrops.sort((a, b) => b.change - a.change)[0];
    const anomaly = createAnomaly(
      'position_drop',
      'P2',
      `topKeywords.${worstDrop.query}`,
      worstDrop.change,
      ALERT_THRESHOLDS.POSITION_DROP_THRESHOLD,
      `${significantDrops.length} keywords dropped >${ALERT_THRESHOLDS.POSITION_DROP_THRESHOLD} positions. Worst: "${worstDrop.query}" from ${worstDrop.previous.toFixed(1)} to ${worstDrop.current.toFixed(1)}`
    );
    anomalies.push(anomaly);
    log(`  POSITION DROP DETECTED: ${significantDrops.length} keywords affected`, 'red');
    significantDrops.forEach(d => {
      log(`    "${d.query}": ${d.previous.toFixed(1)} -> ${d.current.toFixed(1)} (down ${d.change.toFixed(1)})`, 'red');
    });
  } else {
    log(`  No significant position drops detected`, 'green');
  }

  return anomalies;
}

/**
 * Main anomaly detection function
 */
async function main(): Promise<void> {
  const startTime = Date.now();
  log('\n========================================', 'cyan');
  log('  Anomaly Detection Starting', 'cyan');
  log('========================================\n', 'cyan');

  // Step 1: Load current metrics
  log('Step 1: Loading current metrics...', 'cyan');
  let currentMetrics: SeoMetrics;
  try {
    currentMetrics = await loadCurrentMetrics();
    log(`  Loaded metrics from ${config.output.dataPath}`, 'green');
    log(`  Last updated: ${currentMetrics.lastUpdated}`, 'reset');
  } catch (error: any) {
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }

  // Step 2: Load previous day metrics
  log('\nStep 2: Loading previous day metrics...', 'cyan');
  const previousMetrics = await loadPreviousMetrics();

  // Step 3: Run anomaly detection
  log('\nStep 3: Running anomaly detection...', 'cyan');
  const anomalies: Anomaly[] = [];

  // Detect traffic drop
  const trafficAnomaly = detectTrafficDrop(currentMetrics.gsc, previousMetrics);
  if (trafficAnomaly) anomalies.push(trafficAnomaly);

  // Detect indexing drop
  const indexingAnomaly = detectIndexingDrop(currentMetrics.gsc);
  if (indexingAnomaly) anomalies.push(indexingAnomaly);

  // Detect position drops
  const positionAnomalies = detectPositionDrop(currentMetrics.gsc, previousMetrics);
  anomalies.push(...positionAnomalies);

  // Step 4: Output results
  log('\nStep 4: Writing anomaly results...', 'cyan');

  // Write anomalies.json
  const anomaliesPath = path.resolve(path.dirname(config.output.dataPath), 'anomalies.json');
  try {
    await fs.ensureDir(path.dirname(anomaliesPath));
    await fs.writeJson(anomaliesPath, {
      detectedAt: new Date().toISOString(),
      totalAnomalies: anomalies.length,
      anomalies: anomalies,
      thresholds: ALERT_THRESHOLDS,
    }, { spaces: 2 });
    log(`  Written ${anomaliesPath}`, 'green');
  } catch (error: any) {
    log(`  Error writing anomalies.json: ${error.message}`, 'red');
  }

  // Update seo-metrics.json alerts array
  try {
    const updatedMetrics = {
      ...currentMetrics,
      alerts: anomalies,
    };
    await fs.writeJson(config.output.dataPath, updatedMetrics, { spaces: 2 });
    log(`  Updated alerts in ${config.output.dataPath}`, 'green');
  } catch (error: any) {
    log(`  Error updating seo-metrics.json: ${error.message}`, 'red');
  }

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  log('\n========================================', anomalies.length > 0 ? 'red' : 'green');
  log('  Anomaly Detection Complete!', anomalies.length > 0 ? 'red' : 'green');
  log('========================================', anomalies.length > 0 ? 'red' : 'green');
  log(`\nSummary:`, 'cyan');
  log(`  Duration: ${duration}s`, 'reset');
  log(`  Anomalies detected: ${anomalies.length}`, anomalies.length > 0 ? 'red' : 'green');

  if (anomalies.length > 0) {
    log(`\nDetected anomalies:`, 'red');
    anomalies.forEach((a, i) => {
      log(`  ${i + 1}. [${a.severity}] ${a.type}: ${a.details}`, 'red');
    });
  } else {
    log(`\nAll metrics within normal thresholds`, 'green');
  }

  log('');
}

// Run the detection
main().catch((error) => {
  log(`\nAnomaly Detection failed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});