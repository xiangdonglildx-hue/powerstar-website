import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs-extra';

// Load .env from scripts directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  gsc: {
    credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || './credentials.json',
    siteUrl: process.env.GSC_SITE_URL || 'https://powerstarapps.com',
  },
  output: {
    dataPath: path.resolve(process.env.DATA_OUTPUT_PATH || '../data/seo-metrics.json'),
    historyPath: path.resolve(process.env.HISTORY_OUTPUT_PATH || '../data/history'),
  },
  retentionDays: 90,
};

// Validate credentials file exists
export async function validateConfig(): Promise<void> {
  const credsPath = path.resolve(config.gsc.credentialsPath);
  if (!await fs.pathExists(credsPath)) {
    throw new Error(`Credentials file not found: ${credsPath}. Run GCP-SA-SETUP.md first.`);
  }
}

// Get date range for GSC queries
export function getDateRange(daysBack: number): { startDate: string; endDate: string } {
  const today = new Date();
  const endDate = today.toISOString().split('T')[0];
  const startDate = new Date(today.getTime() - daysBack * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  return { startDate, endDate };
}