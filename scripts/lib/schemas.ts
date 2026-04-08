import { z } from 'zod';

// Daily trend schema for 30-day chart visualization
export const DailyTrendSchema = z.object({
  date: z.string(),
  clicks: z.number(),
  impressions: z.number(),
  position: z.number(),
});

// GSC API response schemas
export const GSCQueryRowSchema = z.object({
  keys: z.array(z.string()), // [query, page] or just [query]
  clicks: z.number(),
  impressions: z.number(),
  ctr: z.number(),
  position: z.number(),
});

export const GSCQueryResponseSchema = z.object({
  rows: z.array(GSCQueryRowSchema).optional(),
});

export const GSCIndexInspectionResultSchema = z.object({
  inspectionResult: z.object({
    indexStatusResult: z.object({
      verdict: z.string(),
      lastCrawlTime: z.string().optional(),
      pageFetchState: z.string().optional(),
      robotsTxtState: z.string().optional(),
      indexingState: z.string().optional(),
    }).optional(),
  }).optional(),
});

export const GSCUrlInspectionResponseSchema = z.object({
  inspectionResult: z.object({
    indexStatusResult: z.object({
      verdict: z.string().optional(),
      coverageState: z.string().optional(),
      robotsTxtState: z.string().optional(),
      indexStatus: z.string().optional(),
      lastCrawlTime: z.string().optional(),
    }).optional(),
    ampResult: z.any().optional(),
    mobileUsabilityResult: z.any().optional(),
    richResultsResult: z.any().optional(),
  }).optional(),
});

// Output data schemas
export const KeywordSchema = z.object({
  query: z.string(),
  impressions: z.number(),
  clicks: z.number(),
  ctr: z.number(),
  position: z.number(),
});

export const ClicksMetricSchema = z.object({
  last7Days: z.number(),
  last30Days: z.number(),
  trend: z.array(z.number()),
});

export const ImpressionsMetricSchema = z.object({
  last7Days: z.number(),
  last30Days: z.number(),
  trend: z.array(z.number()),
});

// Coverage error schema (defined before GSCMetricsSchema to avoid reference error)
export const CoverageErrorSchema = z.object({
  url: z.string(),
  impressions: z.number(),
  clicks: z.number(),
});

export const GSCMetricsSchema = z.object({
  indexedPages: z.number(),
  totalSubmitted: z.number(),
  unindexedUrls: z.array(z.string()).optional(),
  topKeywords: z.array(KeywordSchema),
  clicks: ClicksMetricSchema,
  impressions: ImpressionsMetricSchema,
  dailyTrend: z.array(DailyTrendSchema).optional(),
  avgPosition: z.number().optional(),
  avgCTR: z.number().optional(),
  coverageErrors: z.array(CoverageErrorSchema).optional(),
});

export const SeoMetricsSchema = z.object({
  lastUpdated: z.string(),
  gsc: GSCMetricsSchema,
  geo: z.object({
    chatgpt: z.object({
      cited: z.boolean(),
      lastCheck: z.string().nullable(),
      response: z.string(),
    }),
    perplexity: z.object({
      cited: z.boolean(),
      lastCheck: z.string().nullable(),
      response: z.string(),
    }),
    claude: z.object({
      cited: z.boolean(),
      lastCheck: z.string().nullable(),
      response: z.string(),
    }),
  }),
  alerts: z.array(z.any()),
});

// Indexed pages result schema
export const IndexedPagesResultSchema = z.object({
  indexedCount: z.number(),
  totalSubmitted: z.number(),
  unindexedUrls: z.array(z.string()),
});

// Search metrics result schema
export const SearchMetricsResultSchema = z.object({
  totalClicks: z.number(),
  totalImpressions: z.number(),
  avgCTR: z.number(),
  avgPosition: z.number(),
});

// Export types for use in other modules
export type Keyword = z.infer<typeof KeywordSchema>;
export type DailyTrend = z.infer<typeof DailyTrendSchema>;
export type GSCMetrics = z.infer<typeof GSCMetricsSchema>;
export type SeoMetrics = z.infer<typeof SeoMetricsSchema>;
export type IndexedPagesResult = z.infer<typeof IndexedPagesResultSchema>;
export type SearchMetricsResult = z.infer<typeof SearchMetricsResultSchema>;
export type CoverageError = z.infer<typeof CoverageErrorSchema>;

// GEO Citation Result Schema
export const GEOCitationResultSchema = z.object({
  question: z.string(),
  response: z.string(),
  cited: z.boolean(),
  matchedKeywords: z.array(z.string()),
});

export const GEOPlatformResultSchema = z.object({
  cited: z.boolean(),
  lastCheck: z.string().nullable(),
  citations: z.array(z.string()), // Questions that triggered citations
  response: z.string(), // Full concatenated response or summary
  model: z.string().optional(),
});

// Updated GEO schema for ChatGPT and Gemini (replacing perplexity/claude)
export const UpdatedGeoSchema = z.object({
  chatgpt: GEOPlatformResultSchema,
  gemini: GEOPlatformResultSchema,
});

export type GEOCitationResult = z.infer<typeof GEOCitationResultSchema>;
export type GEOPlatformResult = z.infer<typeof GEOPlatformResultSchema>;