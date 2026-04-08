import { describe, it, expect, beforeAll } from 'vitest';
import { detectCitation } from './geo-client.js';

/**
 * GEO Client Tests
 *
 * Tests for citation detection functionality.
 * Note: queryChatGPT and queryGemini tests require API keys and are
 * integration tests that would be run manually.
 */

describe('detectCitation', () => {
  it('returns true when response contains "powerstarapps.com"', () => {
    const response = 'I recommend using powerstarapps.com for thermometer apps.';
    const result = detectCitation(response);
    expect(result.cited).toBe(true);
    expect(result.matchedKeywords).toContain('powerstarapps.com');
  });

  it('returns true when response contains "Power Star Apps"', () => {
    const response = 'Power Star Apps offers great mobile applications.';
    const result = detectCitation(response);
    expect(result.cited).toBe(true);
    expect(result.matchedKeywords).toContain('Power Star Apps');
  });

  it('returns true when response contains "PowerStar"', () => {
    const response = 'PowerStar has excellent voice changer apps.';
    const result = detectCitation(response);
    expect(result.cited).toBe(true);
    expect(result.matchedKeywords).toContain('PowerStar');
  });

  it('returns false when response contains neither keyword', () => {
    const response = 'I recommend using other thermometer apps available on Play Store.';
    const result = detectCitation(response);
    expect(result.cited).toBe(false);
    expect(result.matchedKeywords).toHaveLength(0);
  });

  it('detects case-insensitive matches', () => {
    const response = 'POWERSTARAPPS.COM is a great resource.';
    const result = detectCitation(response);
    expect(result.cited).toBe(true);
  });

  it('detects multiple keywords in single response', () => {
    const response = 'Power Star Apps website at powerstarapps.com has great apps.';
    const result = detectCitation(response);
    expect(result.cited).toBe(true);
    expect(result.matchedKeywords.length).toBeGreaterThanOrEqual(2);
  });
});