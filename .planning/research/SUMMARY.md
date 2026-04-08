# Project Research Summary

**Project:** PowerStar Website - SEO/GEO Monitoring (v1.1 Milestone)
**Domain:** SEO monitoring system for static website
**Researched:** 2026-04-08
**Confidence:** MEDIUM-HIGH

## Executive Summary

This milestone adds SEO/GEO monitoring capabilities to an existing pure static HTML/CSS/JS website (PowerStar Apps). The critical architecture constraint is that the site must remain static - all monitoring must happen externally via Node.js scripts that generate JSON files, which a dashboard page reads client-side. This approach preserves the nginx/Docker/Cloud Run deployment model while adding monitoring visibility.

The recommended approach is an external script layer (Node.js + TypeScript) running via GitHub Actions scheduled workflows. Scripts authenticate with Google Search Console API via service account, fetch metrics daily, and output JSON files that the dashboard reads via `fetch()`. GEO tracking queries AI APIs (Perplexity, Claude) to test if content is cited, accepting the inherent variability of AI responses.

The key risk is the static/dynamic architecture conflict - making API calls client-side would expose OAuth credentials. The mitigation is strict separation: scripts run externally with secure credential storage, dashboard reads only pre-generated JSON. A broken monitoring script silently fails, leaving you blind to SEO issues, so comprehensive error logging and "last updated" timestamps are essential.

## Key Findings

### Recommended Stack

The monitoring system adds a Node.js script layer to the existing static architecture. Scripts run separately (not part of deployed site), generating JSON data files. Dashboard uses CDN-hosted Chart.js for visualization. No build tools needed - TypeScript runs via `tsx` directly.

**Core technologies:**
- **Node.js 20 LTS** — Script runtime — Native JSON handling, async APIs, compatible with JS-based site
- **TypeScript + tsx** — Type safety without build — Schema validation for API responses, catch errors at compile time
- **googleapis** — GSC API client — Official Google library, complete API coverage for searchAnalytics.query
- **Vercel AI SDK** — GEO tracking — Unified interface for Perplexity, OpenAI, Anthropic APIs
- **Chart.js 4.5.1** — Dashboard charts — Lightweight, CDN-compatible, sufficient for SEO metrics visualization
- **GitHub Actions** — Automation — Free tier covers daily script runs, integrates with repo, auto-commits JSON
- **nodemailer + Slack webhook** — Alerts — Email via free SMTP, Slack for immediate team notification
- **JSON files** — Data storage — ~8KB per day, no database needed, deployed as static files

**What NOT to add:** Database, backend server, frontend framework, build tool, authentication system, real-time updates.

### Expected Features

**Must have (table stakes):**
- Google Search Console metrics — Primary SEO data source for indexing, keywords, CTR
- Indexing status check — Compare sitemap URLs vs indexed URLs, flag unindexed pages
- Top keywords report — Top 50-100 queries with position data
- Traffic trend visualization — 7-day/30-day trends with line charts
- Scheduled data collection — Daily quick check, weekly full report
- Dashboard access — Static HTML reading JSON via fetch()
- Historical data retention — Daily snapshots, 90 days minimum
- Error/warning display — Clear visual indicators for anomalies

**Should have (competitive):**
- GEO/AI citation tracking — Track when ChatGPT/Perplexity/Claude cite content (monthly frequency)
- Anomaly alert system — Automatic detection: traffic drop >30%, indexing drop >20%
- llms.txt effectiveness tracking — Correlate llms.txt updates with AI citation rates
- Multi-product metrics dashboard — Separate metrics for 5 PowerStar products

**Defer (v2+):**
- AI citation tracking detailed implementation — High complexity, monthly frequency acceptable for v1.1
- Weekly full report generation — Can add after basic monitoring stable
- Competitor comparison — Requires competitor data access, out of scope
- Webhook notifications — Add after core monitoring stable
- Backlink monitoring — GSC API doesn't provide this, requires paid tools

### Architecture Approach

The architecture enforces strict separation between data collection (external scripts) and data consumption (static dashboard). Scripts authenticate with GSC API via service account JSON key (stored outside repo), fetch metrics, process data, and write JSON files to `/data/` directory. Dashboard HTML at `/dashboard.html` reads JSON via client-side `fetch()` and renders with Chart.js. No server-side processing, no real-time updates.

**Major components:**
1. **External monitoring scripts** (`/monitoring/scripts/`) — Node.js/TypeScript files that run via GitHub Actions, authenticate with GSC/AI APIs, fetch data, output JSON
2. **JSON data files** (`/data/seo-metrics.json`) — Generated daily, contains GSC metrics, GEO status, alerts, served as static file
3. **Dashboard HTML** (`/dashboard.html`) — Static page that fetches JSON, renders charts via Chart.js, displays alerts
4. **GSC API authentication flow** — Service account setup, JSON key storage, permission delegation to GSC property
5. **GEO query automation** — Claude/Perplexity API queries monthly, parse responses for domain mentions

### Critical Pitfalls

1. **GSC API Authentication Complexity** — Service account setup has multiple steps (create SA, enable API, generate key, add SA email to GSC property). Missing any step causes 403 errors. Prevention: Follow correct sequence, verify each step before proceeding.

2. **Rate Limiting Quota Exhaustion** — GSC API has strict limits (200 requests/100 seconds). Aggressive monitoring can exceed quotas. Prevention: Implement retry logic, batch requests, stagger checks throughout day.

3. **Static/Dynamic Architecture Conflict** — Client-side API calls would expose OAuth credentials. Prevention: External scripts generate JSON, dashboard reads JSON only. Never make API calls from browser.

4. **GEO Tracking Accuracy Problems** — AI responses vary by user, time, and model version. Cannot track precisely. Prevention: Accept GEO as directional (not precise), track trends over weeks, use multiple measurement approaches.

5. **Alert Threshold Tuning False Positives** — Inappropriate thresholds generate noise or miss real issues. Prevention: Establish 2-4 weeks baseline before setting thresholds, use multi-day alerts, tiered levels (warning/alert/critical).

## Implications for Roadmap

Based on research, suggested phase structure follows architectural dependencies - data infrastructure first, then GSC integration, then dashboard, then GEO, then automation. This ordering ensures each phase has the prerequisites from previous phases.

### Phase 1: Data Infrastructure Foundation
**Rationale:** Must define JSON structure and dashboard skeleton before scripts can output data. Test client-side fetch pattern early to validate architecture.
**Delivers:** `/data/` directory, JSON template structure, dashboard.html skeleton, css/dashboard.css, validated fetch pattern
**Addresses:** Dashboard access, historical data retention (table stakes)
**Avoids:** Static/dynamic architecture conflict (Pitfall 3) - proves pattern works before building scripts
**Needs research:** No - standard static site patterns, well-documented

### Phase 2: GSC Integration
**Rationale:** Core data source. Must have GSC working before dashboard can show real data. Service account setup is prerequisite for all GSC-dependent features.
**Delivers:** Service account setup, gsc-collector.ts script, real JSON data generation, indexed pages tracking
**Addresses:** Google Search Console metrics, indexing status check, top keywords report (table stakes)
**Uses:** googleapis, google-auth-library, tsx (from STACK.md)
**Implements:** GSC API authentication flow (from ARCHITECTURE.md)
**Avoids:** GSC API authentication complexity (Pitfall 1), rate limiting (Pitfall 2) - implement retry logic in first script
**Needs research:** Maybe - verify GSC API quota limits with official docs before implementation

### Phase 3: Dashboard Completion
**Rationale:** Dashboard skeleton from Phase 1 now has real data from Phase 2. Implement rendering logic and charts.
**Delivers:** Chart.js integration, dashboard rendering JS, alert display UI, product-level sections
**Addresses:** Traffic trend visualization, error/warning display (table stakes)
**Uses:** Chart.js CDN (from STACK.md)
**Implements:** Dashboard HTML with render functions (from ARCHITECTURE.md)
**Avoids:** Dashboard data staleness (Pitfall 7) - prominent "last updated" display, freshness indicators
**Needs research:** No - Chart.js is well-documented, standard client-side patterns

### Phase 4: GEO Integration
**Rationale:** Differentiator feature. GSC working, dashboard working, can now add GEO section. Monthly frequency means less urgency than daily GSC.
**Delivers:** Claude/Perplexity API setup, geo-query.ts script, GEO section in JSON, GEO status display
**Addresses:** GEO/AI citation tracking (differentiator)
**Uses:** Vercel AI SDK, @ai-sdk/perplexity, anthropic SDK (from STACK.md)
**Implements:** GEO query automation (from ARCHITECTURE.md)
**Avoids:** GEO tracking accuracy problems (Pitfall 4) - acknowledge limitations, use multiple approaches
**Needs research:** Yes - Perplexity API availability needs verification, llms.txt correlation is experimental

### Phase 5: Automation + Alert System
**Rationale:** Scripts exist, dashboard exists, now automate the pipeline. Alert system requires baseline data (2-4 weeks), so this phase comes after GSC has been running.
**Delivers:** GitHub Actions workflow, orchestrator.ts, anomaly-detector.ts, alert thresholds, weekly-report.ts
**Addresses:** Scheduled data collection, anomaly alert system (table stakes + differentiator)
**Uses:** GitHub Actions, nodemailer, Slack webhook (from STACK.md)
**Implements:** Monitoring orchestrator, scheduled execution (from ARCHITECTURE.md)
**Avoids:** Monitoring script silent failures (Pitfall 6), alert threshold tuning (Pitfall 5), missing initial data (Pitfall 8)
**Needs research:** No - GitHub Actions well-documented, alert patterns standard

### Phase Ordering Rationale

- **Foundation first:** JSON structure and dashboard skeleton must exist before scripts output data - prevents integration failures
- **GSC before GEO:** GSC is primary data source (daily), GEO is secondary (monthly) - prioritize based on frequency and impact
- **Dashboard before automation:** Dashboard validates data structure before automating production - catches JSON schema mismatches early
- **Automation last:** Scripts must be tested manually before automating - prevents silent failures in scheduled runs
- **Alerts after baseline:** Threshold tuning requires 2-4 weeks of data - setting thresholds too early causes false positives

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2:** GSC API quota limits - verify official limits, batch request patterns
- **Phase 4:** Perplexity API availability - check if Perplexity provides public API, llms.txt citation correlation is experimental field
- **Phase 4:** GEO tracking methodology - emerging practice, sparse documentation on AI citation tracking

Phases with standard patterns (skip research-phase):
- **Phase 1:** Static site + JSON data - well-documented, established pattern
- **Phase 3:** Chart.js dashboard - official docs comprehensive, many examples
- **Phase 5:** GitHub Actions automation - official docs, standard scheduled workflow pattern

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | npm registry verified versions, official Google/Anthropic/Perplexity SDKs documented |
| Features | HIGH | GSC API official docs comprehensive, MVP clearly defined from PROJECT.md |
| Architecture | HIGH | Static site + JSON data is standard pattern, service account auth is official Google pattern |
| Pitfalls | MEDIUM | Some API limits unverified (need official docs check), GEO accuracy is inherent limitation not documentation gap |

**Overall confidence:** MEDIUM-HIGH

Core architecture (static + external scripts + JSON) is HIGH confidence - established pattern. Stack choices HIGH confidence - verified versions. Feature set HIGH confidence - GSC API documented. Pitfalls MEDIUM confidence - some limits need verification, GEO limitations are inherent to the problem domain.

### Gaps to Address

- **Perplexity API availability:** Unverified. Handle during Phase 4 implementation - check Perplexity docs, fall back to Claude-only GEO tracking if Perplexity unavailable.
- **GSC API quota limits:** Approximate values from training knowledge. Verify with official Google Search Console API documentation before Phase 2 implementation.
- **GEO tracking correlation with llms.txt:** Experimental field with sparse data. Accept as directional only, track trends over 4+ weeks minimum, don't alert on small GEO changes.
- **Alert threshold baseline:** New site (v1.0 just completed) has limited historical data. Plan 2-4 weeks data collection before activating alerts in Phase 5.
- **Cost of AI API queries:** Monthly GEO queries cost estimate needed. Use Claude Haiku (cost-effective) for routine queries, reserve Sonnet for complex analysis.

## Sources

### Primary (HIGH confidence)
- npm registry — googleapis 171.4.0, @ai-sdk/perplexity 3.0.29, Chart.js 4.5.1, tsx 4.x versions verified
- Google Search Console API documentation — Authentication methods, API structure, endpoints
- Anthropic Claude API — platform.claude.com/docs — Models, pricing, SDK usage
- Project PROJECT.md — v1.1 milestone requirements, existing architecture context
- Project STACK.md (v1.0) — Existing static architecture, deployment model

### Secondary (MEDIUM confidence)
- Vercel AI SDK documentation — Unified AI provider interface patterns
- GitHub Actions documentation — Scheduled workflows, secrets management
- Static site + JSON data patterns — Industry standard architecture pattern
- Service account authentication patterns — Google Cloud IAM best practices

### Tertiary (LOW confidence)
- GSC API rate limits — Approximate values from training knowledge, needs official docs verification
- Perplexity API availability — Unverified, needs research during Phase 4
- GEO tracking methodology — Emerging practice, llms.txt citation correlation experimental
- Alert threshold formulas — Monitoring best practices, needs baseline data calibration

---
*Research completed: 2026-04-08*
*Ready for roadmap: yes*
