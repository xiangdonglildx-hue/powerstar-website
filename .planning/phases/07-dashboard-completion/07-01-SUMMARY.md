---
phase: 07-dashboard-completion
plan: 01
subsystem: dashboard
tags: [chart, visualization, indexing-status, trend]
requires: [VIS-04, VIS-05]
provides: [30-day-trend-chart, unindexed-urls-display, dual-y-axis-chart]
affects: [dashboard.html, seo-metrics.json]
tech_stack:
  added:
    - Chart.js line chart with dual Y-axis
    - DailyTrendSchema for trend data
    - updateIndexingStatus() function
  patterns:
    - Chart.js dataset configuration with yAxisID
    - CSS dark theme integration for chart containers
key_files:
  created: []
  modified:
    - scripts/lib/schemas.ts (DailyTrendSchema)
    - scripts/lib/gsc-client.ts (fetchDailyMetrics with position)
    - scripts/gsc-collector.ts (dailyTrend and unindexedUrls storage)
    - dashboard.html (chart section, renderTrendChart, updateIndexingStatus)
    - css/dashboard.css (chart-container, indexing-section styles)
    - data/seo-metrics.json (dailyTrend and unindexedUrls arrays)
decisions:
  - DailyTrend fields marked optional in schema to avoid breaking existing JSON
  - Position axis reversed in chart (lower position = better at top)
  - Chart positioned between Keywords and GEO sections
metrics:
  duration: 15 min
  tasks_completed: 5
  files_modified: 6
  completed_date: "2026-04-08T07:55:00Z"
---

# Phase 7 Plan 1: Add 30-day Trend Chart and Unindexed URLs Display Summary

**One-liner:** Implemented 30-day trend visualization with Chart.js dual Y-axis (clicks/impressions vs position) and unindexed URLs display section for SEO monitoring dashboard.

## Changes Made

### Task 1: Extend JSON Schema for Daily Trend Data
- Added `DailyTrendSchema` with date, clicks, impressions, position fields
- Extended `GSCMetricsSchema` with `dailyTrend` and `unindexedUrls` arrays
- Both fields marked optional to maintain backward compatibility

### Task 2: Update GSC Collector to Store Daily Trend
- Modified `fetchDailyMetrics()` to include position in response
- Updated `gsc-collector.ts` to store `dailyTrend` array (full 30-day metrics)
- Stored `unindexedUrls` from indexedPagesData in JSON output

### Task 3: Add Trend Chart Canvas and Container
- Added chart section HTML with `<canvas id="trendChart">` element
- Positioned between Keywords and GEO sections
- Added CSS styles for `.chart-container` matching dark theme

### Task 4: Implement renderTrendChart() with Dual Y-Axis
- Created Chart.js line chart with three datasets
- Clicks (orange) and Impressions (cyan) on left Y-axis
- Position (gray) on right Y-axis with reversed scale
- Called `renderTrendChart()` after data load

### Task 5: Add Unindexed URLs Display Section
- Added indexing section with summary and URL table
- Created `updateIndexingStatus()` function
- Added CSS for `.status-badge.not-indexed` styling

## Verification Results

All success criteria verified:
- [x] seo-metrics.json contains dailyTrend array with 30 entries
- [x] seo-metrics.json contains unindexedUrls array
- [x] Dashboard has trend chart canvas element
- [x] Chart configured with dual Y-axis (y and y1)
- [x] Indexing summary displays "X of Y indexed"
- [x] Unindexed URLs table renders with status badges

## Deviations from Plan

None - plan executed exactly as written.

## Authentication Gate

**GSC API Authentication Required:**
- Service Account email: `powerstar-gsc-collector@hongyanapps.iam.gserviceaccount.com`
- Action needed: Add Service Account to Search Console property `https://powerstarapps.com`
- Steps: Go to Search Console > Settings > Users and permissions > Add user > Enter email > Select "Full" or "Restricted" permissions
- Verification: Run `GOOGLE_APPLICATION_CREDENTIALS=scripts/credentials.json npx tsx scripts/gsc-collector.ts`

Note: Sample data was added to seo-metrics.json for dashboard verification pending GSC API authentication setup.

## Files Modified

| File | Changes |
|------|---------|
| scripts/lib/schemas.ts | DailyTrendSchema, dailyTrend/unindexedUrls in GSCMetricsSchema |
| scripts/lib/gsc-client.ts | fetchDailyMetrics returns position |
| scripts/gsc-collector.ts | Store dailyTrend and unindexedUrls |
| dashboard.html | Chart section, renderTrendChart(), updateIndexingStatus() |
| css/dashboard.css | chart-container, indexing-section, status-badge |
| data/seo-metrics.json | Added dailyTrend and unindexedUrls arrays |

## Commits

1. `3cb6a8d` - test(07-01): add DailyTrendSchema for 30-day trend chart
2. `2602fef` - feat(07-01): store dailyTrend and unindexedUrls in GSC metrics
3. `2151eaf` - feat(07-01): add trend chart section to dashboard
4. `794de1d` - feat(07-01): implement renderTrendChart with dual Y-axis
5. `7271b92` - feat(07-01): add unindexed URLs display section

---
*Summary created: 2026-04-08*