/**
 * Alert Configuration Module
 *
 * Defines thresholds for SEO anomaly detection.
 *
 * NOTE: These thresholds require 2-4 weeks of baseline data for proper tuning.
 * Adjust based on your site's historical patterns after collecting sufficient data.
 */

// Anomaly severity levels
export type Severity = 'P1' | 'P2';

// Anomaly types
export type AnomalyType = 'traffic_drop' | 'indexing_drop' | 'position_drop';

/**
 * Anomaly detection result
 */
export interface Anomaly {
  type: AnomalyType;
  severity: Severity;
  metric: string;
  change: number; // Percent change or position drop count
  threshold: number;
  details: string;
  detectedAt: string;
}

/**
 * Alert threshold configuration
 *
 * Thresholds based on SEO monitoring best practices:
 * - P1: Critical issues requiring immediate attention
 * - P2: Notable changes worth monitoring
 */
export const ALERT_THRESHOLDS = {
  /**
   * Traffic drop threshold (percentage)
   * Triggers when clicks decrease by more than this percentage vs previous day
   * P1 severity - significant traffic loss impacts business
   */
  TRAFFIC_DROP_THRESHOLD: 30,

  /**
   * Indexing drop threshold (percentage)
   * Triggers when indexed pages decrease by more than this percentage vs sitemap
   * P1 severity - indexing issues affect visibility
   */
  INDEXING_DROP_THRESHOLD: 20,

  /**
   * Position drop threshold (positions)
   * Triggers when top keyword position drops by more than this many positions
   * P2 severity - ranking changes need attention but less urgent
   */
  POSITION_DROP_THRESHOLD: 5,
} as const;

/**
 * Helper function to calculate percentage change
 */
export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100; // Handle division by zero
  }
  return ((previous - current) / previous) * 100;
}

/**
 * Helper function to calculate position change
 * Note: Higher position number = worse ranking, so a drop is positive change
 */
export function calculatePositionDrop(currentPosition: number, previousPosition: number): number {
  return currentPosition - previousPosition; // Positive = drop (worse), Negative = improvement
}

/**
 * Create an anomaly object
 */
export function createAnomaly(
  type: AnomalyType,
  severity: Severity,
  metric: string,
  change: number,
  threshold: number,
  details: string
): Anomaly {
  return {
    type,
    severity,
    metric,
    change,
    threshold,
    details,
    detectedAt: new Date().toISOString(),
  };
}