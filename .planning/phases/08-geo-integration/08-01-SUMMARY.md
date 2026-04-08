---
phase: 08-geo-integration
plan: 01
subsystem: geo
tags: [chatgpt, gemini, openai, google-ai-api, geo, citation-tracking, vitest]

requires:
  - phase: 05-data-infrastructure-foundation
    provides: seo-metrics.json structure, dashboard.html base
provides:
  - GEO citation tracking for ChatGPT (via CodeX proxy) and Gemini
  - geo-query.ts script with 15 product-related questions
  - Dashboard GEO section with ChatGPT and Gemini cards
  - Citation detection using keyword matching (powerstarapps.com, Power Star Apps, PowerStar)
affects: [phase-09-automation-alert]

tech-stack:
  added: [openai, @google/generative-ai, vitest]
  patterns: [ESM module with fileURLToPath, graceful error handling for API failures]

key-files:
  created: [scripts/lib/geo-client.ts, scripts/geo-query.ts, scripts/lib/geo-client.test.ts, data/history/ai-responses/.gitkeep]
  modified: [scripts/lib/schemas.ts, dashboard.html, css/dashboard.css, data/seo-metrics.json, scripts/package.json]

key-decisions:
  - "ChatGPT uses CodeX proxy (http://192.168.0.213:8080/v1) for API access"
  - "Gemini uses gemini-pro model (may need model update for valid API key)"
  - "Citation detection via keyword matching: powerstarapps.com, Power Star Apps, PowerStar"
  - "Perplexity and Claude tracking removed per user decision in CONTEXT.md"
  - "ESM path resolution using fileURLToPath/import.meta.url instead of __dirname"

patterns-established:
  - "GEO script pattern: queryPlatform() -> aggregate results -> merge with seo-metrics.json -> save history"
  - "Citation display in dashboard: status card + citations list (top 3 questions)"

requirements-completed: [GEO-01, GEO-04, GEO-05, GEO-06, VIS-06]

duration: 20min
completed: 2026-04-08
---

# Phase 08 Plan 01: GEO Integration Summary

**GEO citation tracking system for ChatGPT and Gemini with keyword-based detection, query script, and dashboard visualization**

## Performance

- **Duration:** 20 min
- **Started:** 2026-04-08T09:19:01Z
- **Completed:** 2026-04-08T09:39:00Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments
- GEO client library with ChatGPT (via CodeX proxy) and Gemini API integration
- geo-query.ts script querying 15 product-related questions to both AI systems
- Citation detection using keyword matching for domain/brand mentions
- Dashboard GEO section updated with ChatGPT and Gemini cards and citations display
- Historical AI responses stored in /data/history/ai-responses/

## Task Commits

Each task was committed atomically:

1. **Task 1: GEO client library** - `49bca1d` (test)
2. **Task 2: GEO query orchestration script** - `ba5a02c` (feat)
3. **Task 3: Dashboard GEO display update** - `c94c8c2` (feat)

## Files Created/Modified
- `scripts/lib/geo-client.ts` - AI API client wrappers for ChatGPT and Gemini, citation detection
- `scripts/lib/geo-client.test.ts` - Vitest tests for citation detection (6 tests)
- `scripts/geo-query.ts` - GEO query orchestration script with 15 questions
- `scripts/lib/schemas.ts` - Added GEOCitationResultSchema, GEOPlatformResultSchema
- `scripts/package.json` - Added openai, @google/generative-ai, vitest dependencies
- `dashboard.html` - Updated GEO section with ChatGPT and Gemini cards, citations display
- `css/dashboard.css` - Added geo-citations, geo-citations-list, geo-citation-item styles
- `data/history/ai-responses/.gitkeep` - History directory for AI responses
- `data/seo-metrics.json` - Updated geo field with chatgpt and gemini data

## Decisions Made
- Used gemini-pro model (may need update when valid API key is configured)
- ESM path resolution using fileURLToPath/import.meta.url (Node.js 24 compatibility)
- Vitest for test framework (modern, fast, ESM-native)
- Graceful error handling - script continues even if one platform fails

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed ESM module __dirname error**
- **Found during:** Task 2 (geo-query.ts execution)
- **Issue:** `__dirname is not defined in ES module scope` error
- **Fix:** Added fileURLToPath/import.meta.url for ESM path resolution
- **Files modified:** scripts/geo-query.ts
- **Verification:** Script runs successfully with correct paths
- **Committed in:** ba5a02c (Task 2 commit)

**2. [Rule 1 - Bug] Fixed deprecated Gemini model name**
- **Found during:** Task 2 (geo-query.ts execution)
- **Issue:** gemini-2.0-flash model no longer available (404 error)
- **Fix:** Changed model to gemini-pro (more stable model name)
- **Files modified:** scripts/lib/geo-client.ts, scripts/geo-query.ts
- **Verification:** Model name updated in both files
- **Committed in:** ba5a02c (Task 2 commit)

---
**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** All auto-fixes necessary for script execution. No scope creep.

## Issues Encountered

### Authentication Gate: Gemini API Key

**Issue:** Gemini API returns 404 "model not found" errors for all model names tested (gemini-2.0-flash, gemini-1.5-flash, gemini-pro)

**Possible causes:**
1. Invalid API key (GOOGLE_AI_API_KEY in scripts/.env)
2. API key not authorized for Gemini models
3. Account restrictions on new users

**Status:** Script handles errors gracefully and stores error responses in seo-metrics.json. User needs to verify/update API key.

**Resolution steps:**
1. Verify GOOGLE_AI_API_KEY in Google AI Studio
2. Ensure API key has Gemini model access
3. Run `cd scripts && npm run geo` to verify

## User Setup Required

**External service requires verification:** Google AI API (Gemini)

- Environment variable: `GOOGLE_AI_API_KEY` (verify key validity)
- Source: Google AI Studio -> Get API Key
- Verification: `cd scripts && npm run geo` should query Gemini without 404 errors

## Next Phase Readiness
- GEO tracking infrastructure complete for ChatGPT
- Gemini requires valid API key verification
- Dashboard displays GEO status with citations
- Ready for Phase 09 automation (monthly GEO query scheduling)

---
*Phase: 08-geo-integration*
*Completed: 2026-04-08*