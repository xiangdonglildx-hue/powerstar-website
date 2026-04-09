#!/usr/bin/env node
/**
 * History Cleanup Script
 *
 * Removes history files older than the retention period (90 days):
 * - GSC history files: data/history/gsc-YYYY-MM-DD.json
 * - GEO history files: data/history/ai-responses/YYYY-MM-DD.json
 *
 * This script is designed to run after the daily GSC collection in GitHub Actions.
 */

import { config } from './lib/config.js';
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
 * Cleanup result summary
 */
interface CleanupResult {
  gscFilesRemoved: number;
  geoFilesRemoved: number;
  errors: string[];
}

/**
 * Parse date from filename (YYYY-MM-DD format)
 */
function parseDateFromFilename(filename: string): Date | null {
  // Extract date portion from filename
  // Patterns: gsc-YYYY-MM-DD.json, YYYY-MM-DD.json
  const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})/);
  if (!dateMatch) return null;

  const date = new Date(dateMatch[1]);
  if (isNaN(date.getTime())) return null;

  return date;
}

/**
 * Cleanup history files in a directory
 */
async function cleanupDirectory(
  directory: string,
  filePattern: RegExp,
  cutoffDate: Date,
  retentionDays: number
): Promise<{ removed: number; errors: string[] }> {
  const result = { removed: 0, errors: [] as string[] };

  try {
    // Ensure directory exists
    await fs.ensureDir(directory);

    const files = await fs.readdir(directory);

    for (const file of files) {
      // Skip non-matching files and special files
      if (!filePattern.test(file) || file === '.gitkeep') {
        continue;
      }

      const fileDate = parseDateFromFilename(file);
      if (!fileDate) {
        // Invalid date format, skip
        continue;
      }

      // Check if file is older than cutoff
      if (fileDate < cutoffDate) {
        const filePath = path.join(directory, file);
        try {
          await fs.remove(filePath);
          log(`  Removed: ${file} (from ${fileDate.toISOString().split('T')[0]})`, 'yellow');
          result.removed++;
        } catch (error: any) {
          result.errors.push(`Failed to remove ${file}: ${error.message}`);
          log(`  Error removing ${file}: ${error.message}`, 'red');
        }
      }
    }
  } catch (error: any) {
    result.errors.push(`Directory error: ${error.message}`);
    log(`  Directory error: ${error.message}`, 'red');
  }

  return result;
}

/**
 * Main cleanup function
 */
async function cleanupHistory(): Promise<CleanupResult> {
  const result: CleanupResult = {
    gscFilesRemoved: 0,
    geoFilesRemoved: 0,
    errors: [],
  };

  const retentionDays = config.retentionDays;
  const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];

  log(`Retention period: ${retentionDays} days`, 'reset');
  log(`Cutoff date: ${cutoffStr} (files older than this will be removed)`, 'reset');
  log('');

  // Cleanup GSC history files (directly in history folder)
  log('Cleaning GSC history files...', 'cyan');
  const gscResult = await cleanupDirectory(
    config.output.historyPath,
    /^gsc-\d{4}-\d{2}-\d{2}\.json$/,
    cutoffDate,
    retentionDays
  );
  result.gscFilesRemoved = gscResult.removed;
  result.errors.push(...gscResult.errors);

  log('');

  // Cleanup GEO/AI response history files (in ai-responses subfolder)
  log('Cleaning GEO/AI response history files...', 'cyan');
  const geoPath = path.join(config.output.historyPath, 'ai-responses');
  const geoResult = await cleanupDirectory(
    geoPath,
    /^\d{4}-\d{2}-\d{2}\.json$/,
    cutoffDate,
    retentionDays
  );
  result.geoFilesRemoved = geoResult.removed;
  result.errors.push(...geoResult.errors);

  return result;
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const startTime = Date.now();
  log('\n========================================', 'cyan');
  log('  History Cleanup Starting', 'cyan');
  log('========================================\n', 'cyan');

  // Step 1: Run cleanup
  log('Step 1: Scanning history directories...\n', 'cyan');
  const result = await cleanupHistory();

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  log('\n========================================', result.errors.length > 0 ? 'red' : 'green');
  log('  History Cleanup Complete!', result.errors.length > 0 ? 'red' : 'green');
  log('========================================', result.errors.length > 0 ? 'red' : 'green');
  log(`\nSummary:`, 'cyan');
  log(`  Duration: ${duration}s`, 'reset');
  log(`  GSC files removed: ${result.gscFilesRemoved}`, result.gscFilesRemoved > 0 ? 'yellow' : 'green');
  log(`  GEO files removed: ${result.geoFilesRemoved}`, result.geoFilesRemoved > 0 ? 'yellow' : 'green');

  if (result.errors.length > 0) {
    log(`\nErrors:`, 'red');
    result.errors.forEach((e, i) => {
      log(`  ${i + 1}. ${e}`, 'red');
    });
  }

  log('');
}

// Run cleanup
main().catch((error) => {
  log(`\nHistory Cleanup failed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});