# Architecture Research: SEO Monitoring System

**Project:** PowerStar Website v1.1 SEO Monitoring
**Milestone:** v1.1 - SEO/GEO Monitoring Infrastructure
**Researched:** 2026-04-08
**Mode:** Architecture Integration (Subsequent Milestone)
**Confidence:** MEDIUM-HIGH (based on established patterns + project context)

---

## Executive Summary

The v1.1 milestone adds SEO monitoring capabilities to an existing pure static HTML/CSS/JS website. The critical architecture constraint is that the site remains **static** - all monitoring must happen **outside** the deployed site, with results stored as static JSON files that the Dashboard reads client-side.

**Key Integration Insight:** Monitoring scripts are **external infrastructure** that generates data. The Dashboard is a **static HTML page** that reads pre-generated JSON via `fetch()`. This preserves the nginx/Docker/Cloud Run deployment model while adding monitoring visibility.

---

## Integration Architecture

### High-Level Architecture

```
                    EXTERNAL MONITORING INFRASTRUCTURE
                    ================================
                    
    +------------------+     +------------------+     +------------------+
    | GSC API Scripts  |     | GEO Query Scripts|     | Indexing Monitor |
    | (Node.js/Bash)   |     | (Claude API)     |     | (Curl/Requests)  |
    +--------+---------+     +--------+---------+     +--------+---------+
             |                        |                        |
             |                        |                        |
             v                        v                        v
    +----------------------------------------------------------------+
    |                    Monitoring Orchestrator                      |
    |                    (cron/scheduled runner)                      |
    |                                                                 |
    |  - Daily: GSC metrics collection                               |
    |  - Weekly: Full report generation                               |
    |  - Hourly: Anomaly detection alerts                             |
    +----------------------------------------------------------------+
                                |
                                | Generates JSON
                                v
    +----------------------------------------------------------------+
    |                    seo-metrics.json                             |
    |                    (Deployed as static file)                    |
    |                                                                 |
    |  {                                                              |
    |    "gsc": { clicks, impressions, ctr, position... },           |
    |    "geo": { chatgpt_mentions, perplexity_rankings... },        |
    |    "alerts": [...],                                             |
    |    "last_updated": "2026-04-08T..."                             |
    |  }                                                              |
    +----------------------------------------------------------------+
                                |
                                | Deployed to static site
                                v
                    
    STATIC WEBSITE (nginx/Docker/Cloud Run)
    =======================================
                    
    +------------------+     +------------------+
    | dashboard.html   |     | seo-metrics.json |
    | (Monitoring UI)  |---->| (Data source)    |
    +--------+---------+     +------------------+
             |  fetch()
             v
    +------------------+
    | Dashboard Render |
    | (Client-side JS) |
    +------------------+
```

### Key Architecture Decisions

| Decision | Rationale | Constraint Addressed |
|----------|-----------|---------------------|
| **External monitoring scripts** | Cannot run server-side on static site | Pure static architecture preserved |
| **JSON as static file** | Dashboard needs data without API calls | Same nginx caching/deployment |
| **Client-side fetch()** | No server-side rendering capability | Browser-executed only |
| **Service account for GSC** | Automated script access without OAuth flow | No user authentication needed |
| **Claude API for GEO** | Test AI visibility programmatically | LLM query capability |

---

## Component Architecture

### 1. Monitoring Scripts (External)

**Location:** Outside the static site repository (e.g., `/scripts/` or separate repo)

**Technology Stack:**
| Component | Technology | Purpose |
|-----------|------------|---------|
| Runtime | Node.js 18+ | Script execution environment |
| GSC API Client | googleapis npm package | Official Google API library |
| GEO Query | Anthropic Claude API (or Perplexity) | AI visibility testing |
| Authentication | Service account JSON key | Secure API access |
| Scheduler | cron (Linux) or Cloud Scheduler | Automated execution |

**Files Structure (External):**
```
monitoring-scripts/
+-- config/
|   +-- service-account.json    # GSC API credentials (NOT in repo)
|   +-- claude-api-key.txt      # Claude API key (NOT in repo)
|   +-- settings.json           # Site URLs, thresholds, schedules
+-- scripts/
|   +-- gsc-collector.js        # GSC API data collection
|   +-- geo-query.js            # GEO/AI visibility testing
|   +-- anomaly-detector.js     # Alert generation
|   +-- report-generator.js     # Weekly report compilation
|   +-- orchestrator.js         # Main runner (calls all scripts)
+-- output/
|   +-- seo-metrics.json        # Generated output (deployed to site)
+-- templates/
|   +-- dashboard-data.json     # JSON structure template
```

### 2. JSON Data File (Deployed to Static Site)

**Location:** `/data/seo-metrics.json` in static site repository

**Why this location:**
- Part of static site for nginx to serve
- Cacheable (with short TTL for updates)
- Dashboard HTML can fetch via relative path
- Included in Docker build/deployment

**JSON Structure:**
```json
{
  "meta": {
    "version": "1.0",
    "generated_at": "2026-04-08T10:30:00Z",
    "site": "powerstarapps.com",
    "next_update": "2026-04-09T10:30:00Z"
  },
  "gsc": {
    "overview": {
      "total_clicks": 1234,
      "total_impressions": 56789,
      "avg_ctr": 2.18,
      "avg_position": 15.3
    },
    "by_page": [
      {
        "page": "/products/ai-photo.html",
        "clicks": 450,
        "impressions": 12000,
        "ctr": 3.75,
        "position": 8.2
      }
    ],
    "top_queries": [
      {
        "query": "ai photo filter",
        "clicks": 320,
        "impressions": 8500,
        "ctr": 3.76,
        "position": 5.1
      }
    ],
    "trend": {
      "clicks_7d_change": 12.5,
      "impressions_7d_change": 8.3,
      "position_7d_change": -1.2
    }
  },
  "geo": {
    "chatgpt": {
      "mentioned": true,
      "last_checked": "2026-04-08T09:00:00Z",
      "response_snippet": "Power Star Apps offers...",
      "confidence": "high"
    },
    "perplexity": {
      "ranked": true,
      "position": 3,
      "last_checked": "2026-04-08T09:00:00Z",
      "query_used": "best thermometer apps for Android"
    },
    "google_ai_overview": {
      "appears": false,
      "last_checked": "2026-04-08T09:00:00Z"
    }
  },
  "indexing": {
    "indexed_pages": 25,
    "total_pages": 28,
    "coverage_ratio": 0.89,
    "last_crawl": "2026-04-07T...",
    "sitemap_status": "submitted",
    "errors": []
  },
  "alerts": [
    {
      "type": "traffic_drop",
      "severity": "high",
      "message": "Clicks dropped 35% compared to last week",
      "detected_at": "2026-04-08T08:00:00Z",
      "threshold": 30,
      "actual": 35
    }
  ],
  "weekly_report": {
    "generated": true,
    "date": "2026-04-07",
    "highlights": [
      "AI Photo landing pages gained 15% impressions",
      "New blog article indexed within 24 hours"
    ],
    "recommendations": [
      "Consider adding more thermometer scene pages",
      "Mobile navigation fix improved mobile traffic"
    ]
  }
}
```

### 3. Dashboard HTML (Static Site Page)

**Location:** `/dashboard.html` in static site repository

**Architecture Pattern:**
```
dashboard.html (Static HTML)
|
+-- <head>
|   +-- CSS imports (existing styles)
|   +-- Dashboard-specific CSS (css/dashboard.css)
|   +-- Chart library CDN (Chart.js recommended)
|
+-- <body>
|   +-- Navigation (shared navbar)
|   +-- Dashboard container
|   |   +-- Overview cards (clicks, impressions, CTR)
|   |   +-- Charts (trends, top queries)
|   |   +-- GEO status section
|   |   +-- Alerts panel (critical warnings)
|   |   +-- Weekly report summary
|   +-- Footer (shared)
|
+-- <script>
|   +-- fetch('/data/seo-metrics.json')
|   +-- Render functions (update charts, cards, alerts)
|   +-- Chart.js initialization
```

**Client-Side Data Loading Pattern:**
```javascript
// dashboard.html embedded script
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/data/seo-metrics.json');
    if (!response.ok) {
      throw new Error('Failed to load SEO metrics');
    }
    const data = await response.json();
    
    // Render overview cards
    renderOverviewCards(data.gsc.overview);
    
    // Render charts
    renderTrendChart(data.gsc.by_page);
    renderQueriesChart(data.gsc.top_queries);
    
    // Render GEO status
    renderGEOStatus(data.geo);
    
    // Render alerts
    renderAlerts(data.alerts);
    
    // Update last updated timestamp
    updateTimestamp(data.meta.generated_at);
    
  } catch (error) {
    console.error('Dashboard load error:', error);
    showErrorState();
  }
});
```

### 4. GSC API Authentication Flow

**Authentication Method:** Google Service Account

**Flow Diagram:**
```
1. SETUP (One-time)
   +-- Create GCP project (or use existing Cloud Run project)
   +-- Create Service Account in IAM
   +-- Generate JSON key file (download locally)
   +-- Enable Google Search Console API in GCP
   +-- Add Service Account email to GSC property (as user)
   
2. SCRIPT EXECUTION
   +-- Load service-account.json from secure location
   +-- Initialize google.auth.GoogleAuth with scopes
   +-- Obtain access token (automatic via library)
   +-- Call searchanalytics.query endpoint
   +-- Parse response and update JSON
```

**Required GSC API Scopes:**
```
https://www.googleapis.com/auth/webmasters.readonly
```

**Service Account Setup Steps (HIGH Confidence - Official Google Pattern):**

| Step | Action | Command/UI |
|------|--------|------------|
| 1 | Create service account | GCP Console > IAM > Service Accounts |
| 2 | Generate key | Download JSON key file |
| 3 | Enable API | GCP Console > APIs > Search Console API |
| 4 | Grant access | GSC Console > Settings > Users > Add service account email |
| 5 | Verify access | Test script execution |

**Script Implementation Pattern:**
```javascript
// gsc-collector.js
const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
  keyFile: './config/service-account.json',
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

async function collectGSCData(siteUrl) {
  const client = await auth.getClient();
  const searchconsole = google.searchconsole({ version: 'v1', auth: client });
  
  // Query search analytics
  const response = await searchconsole.searchanalytics.query({
    siteUrl: siteUrl,
    requestBody: {
      startDate: '2026-04-01',
      endDate: '2026-04-07',
      dimensions: ['page', 'query'],
      rowLimit: 100,
    },
  });
  
  return response.data.rows;
}
```

### 5. GEO Query Automation Approach

**Objective:** Test if AI systems (ChatGPT, Perplexity, Google AI Overview) mention or cite the site/products.

**Methods:**

| AI System | Query Method | API/Library | Feasibility |
|-----------|--------------|-------------|-------------|
| ChatGPT/GPT | Anthropic Claude API (similar) | anthropic npm package | HIGH - Official API |
| Perplexity | Perplexity API (if available) | HTTP requests | MEDIUM - API access needed |
| Google AI Overview | No direct API | Manual testing | LOW - No automation possible |

**Recommended GEO Testing Approach:**

1. **Claude API Testing (HIGH Confidence):**
   ```javascript
   // geo-query.js
   const Anthropic = require('@anthropic-ai/sdk');
   
   async function testChatGPTVisibility() {
     const anthropic = new Anthropic({
       apiKey: process.env.ANTHROPIC_API_KEY, // From secure config
     });
     
     const queries = [
       "What are the best thermometer apps for Android?",
       "How can I filter photos with anime style?",
       "Recommend a microphone app for presentations",
     ];
     
     const results = [];
     for (const query of queries) {
       const response = await anthropic.messages.create({
         model: 'claude-3-sonnet-20240229',
         max_tokens: 500,
         messages: [{ role: 'user', content: query }],
       });
       
       // Check if Power Star Apps is mentioned
       const mentioned = response.content.some(c => 
         c.text.toLowerCase().includes('power star') ||
         c.text.toLowerCase().includes('thermometer app') // etc.
       );
       
       results.push({
         query,
         mentioned,
         snippet: mentioned ? extractMention(response) : null,
       });
     }
     
     return results;
   }
   ```

2. **llms.txt Effectiveness Testing:**
   - Query AI with site-specific questions
   - Measure citation frequency
   - Track improvement over time

3. **Perplexity Testing (MEDIUM Confidence):**
   - Perplexity may have API access (check official docs)
   - Alternative: Use Perplexity browser automation (complex)

---

## Data Flow Architecture

### Daily Collection Flow

```
07:00 UTC - Scheduled Trigger
    |
    v
[orchestrator.js runs]
    |
    +---> [gsc-collector.js]
    |         |  Fetch last 7 days GSC data
    |         |  Parse metrics
    |         v
    |     Return GSC data object
    |
    +---> [geo-query.js]
    |         |  Query Claude API (3-5 test queries)
    |         |  Check mentions
    |         v
    |     Return GEO visibility data
    |
    +---> [anomaly-detector.js]
    |         |  Compare against thresholds
    |         |  Generate alerts if needed
    |         v
    |     Return alerts array
    |
    v
[Generate seo-metrics.json]
    |
    v
[Deploy JSON to static site]
    |  (Manual: copy to /data/)
    |  (Automated: git push + CI/CD)
    v
[Cloud Run redeploys with new JSON]
    |
    v
[Dashboard fetches fresh data]
```

### Weekly Report Flow

```
Sunday 10:00 UTC
    |
    v
[report-generator.js runs]
    |
    +-- Aggregate 7 days of data
    +-- Calculate week-over-week changes
    +-- Identify top gaining/losing pages
    +-- Generate recommendations
    +-- Update seo-metrics.json "weekly_report" section
    |
    v
[Deploy updated JSON]
```

---

## Integration Points with Existing Architecture

### Modified Components

| Component | Modification | Impact |
|-----------|--------------|--------|
| `sitemap.xml` | None (existing serves purpose) | GSC reads it |
| `robots.txt` | None (existing serves purpose) | Crawlers read it |
| `nginx.conf` | Add short cache for JSON (optional) | `/data/*.json` cache policy |
| `Dockerfile` | Include `/data/` directory | JSON file in container |
| `llms.txt` | None (already optimized) | GEO testing validates |

### New Components (Static Site)

| Component | Location | Purpose |
|-----------|----------|---------|
| `dashboard.html` | Root level | Monitoring UI page |
| `css/dashboard.css` | `/css/` | Dashboard-specific styles |
| `js/dashboard.js` | `/js/` | Dashboard rendering logic (or inline) |
| `data/seo-metrics.json` | `/data/` | Metrics data source |

### New Components (External - Monitoring Scripts)

| Component | Location | Purpose |
|-----------|----------|--------|
| Monitoring scripts repo | Separate (or `/scripts/` excluded from Docker) | Data collection |
| Service account JSON | Secure storage (NOT in repo) | GSC authentication |
| Claude API key | Secure storage (NOT in repo) | GEO testing |

---

## Deployment Architecture

### Static Site Deployment (Unchanged + New Files)

```dockerfile
# Dockerfile (add /data/ directory)
FROM nginx:alpine
COPY . /usr/share/nginx/html
# /data/seo-metrics.json will be included
RUN rm -f /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

### nginx Configuration Enhancement

```nginx
# default.conf (add JSON caching policy)
# Existing static asset caching...

# Add JSON data caching (short TTL for monitoring updates)
location ~* ^/data/.*\.json$ {
    expires 5m;  # 5 minute cache - balances freshness and performance
    add_header Cache-Control "public, must-revalidate";
    add_header Access-Control-Allow-Origin "*";  # Allow fetch from dashboard
}
```

### Monitoring Scripts Deployment

**Option A: Local Machine (Simple)**
- Run scripts on developer machine
- Copy JSON to static site repo
- Deploy via existing CI/CD

**Option B: Cloud Scheduler + Cloud Run Job**
- Deploy monitoring scripts as separate Cloud Run service
- Use Cloud Scheduler to trigger daily
- Output JSON to Cloud Storage
- Sync Cloud Storage to static site (or build step)

**Option C: GitHub Actions (CI/CD Integration)**
- Run monitoring scripts in GitHub Actions workflow
- Daily scheduled workflow
- Output JSON committed to repo
- Automatic deployment trigger

**Recommended: Option A for MVP (simplicity), Option C for automation**

---

## Security Architecture

### Credentials Storage

| Credential | Storage | Access |
|------------|---------|--------|
| GSC Service Account JSON | Local secure file (NOT in git) | Script runtime only |
| Claude API Key | Environment variable or secure file | Script runtime only |
| Site configuration | `config/settings.json` (can be in repo) | Public data OK |

### Dashboard Access

| Aspect | Recommendation |
|--------|----------------|
| Public visibility | Dashboard can be public (SEO metrics not sensitive) |
| Alternative | Add simple password protection (nginx basic auth) |
| Data sensitivity | Metrics are public (GSC data is site-level, not user-level) |

### JSON Data Protection

- SEO metrics are **site-level aggregate data** - not sensitive
- No user personal data in JSON
- Can be publicly accessible
- If more sensitive: Add nginx auth for `/data/` path

---

## Build Order Recommendation

Based on integration dependencies:

### Phase 1: Data Infrastructure (Day 1-2)

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create `/data/` directory structure | Low | None |
| Create JSON template structure | Low | None |
| Create dashboard.html skeleton | Medium | None |
| Create css/dashboard.css | Medium | None |
| Test JSON fetch from dashboard | Low | JSON structure defined |

### Phase 2: GSC Integration (Day 3-5)

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create GCP service account | Low | GCP project access |
| Generate service account JSON key | Low | Service account created |
| Grant GSC property access | Low | GSC Console access |
| Implement gsc-collector.js | Medium | Service account setup |
| Test GSC API queries | Medium | Script implemented |

### Phase 3: GEO Testing Integration (Day 6-7)

| Task | Effort | Dependencies |
|------|--------|--------------|
| Get Claude API key | Low | Anthropic account |
| Implement geo-query.js | Medium | API key |
| Test GEO visibility queries | Medium | Script implemented |

### Phase 4: Dashboard Completion (Day 8-10)

| Task | Effort | Dependencies |
|------|--------|--------------|
| Implement dashboard rendering JS | Medium | JSON structure defined |
| Add Chart.js integration | Medium | Dashboard skeleton |
| Implement alert display | Medium | Alert structure defined |
| Test full dashboard flow | Medium | All scripts working |

### Phase 5: Automation Setup (Day 11-14)

| Task | Effort | Dependencies |
|------|--------|--------------|
| Implement orchestrator.js | Medium | All scripts implemented |
| Set up cron/scheduler | Low | Orchestrator ready |
| Implement anomaly-detector.js | Medium | GSC data available |
| Implement weekly-report-generator.js | Medium | All data available |
| End-to-end testing | Medium | Full pipeline ready |

---

## Performance Considerations

### Dashboard Load Performance

| Metric | Target | Approach |
|--------|--------|----------|
| JSON fetch time | <100ms | Small file (~10-20KB), nginx cached |
| Dashboard render | <500ms | Client-side JS, Chart.js |
| Total load | <1s | CDN + nginx optimizations |

### JSON File Size Estimate

| Section | Estimated Size |
|---------|----------------|
| GSC overview | ~500 bytes |
| GSC by_page (10 pages) | ~2KB |
| GSC top_queries (20) | ~3KB |
| GEO data | ~1KB |
| Alerts | ~500 bytes |
| Weekly report | ~1KB |
| **Total** | **~8KB** |

Very small - excellent performance.

---

## Scalability Considerations

### At Current Scale (28 pages)

- JSON size: ~10KB
- Dashboard load: <1s
- GSC API calls: 1-2 per day
- GEO API calls: 3-5 per day

### At 100 Pages

- JSON size: ~30KB (still excellent)
- Dashboard load: <1.5s
- GSC API calls: Same (site-level query)
- GEO API calls: Same (fixed test queries)

### At 1000 Pages

- JSON size: Consider pagination or lazy loading
- Dashboard: Add pagination for page list
- GSC API: May need multiple queries (rowLimit 25000 max)
- GEO: No change

---

## Alternative Architectures Considered

| Approach | Why Not Recommended |
|----------|---------------------|
| **Server-side API endpoint** | Breaks static architecture; requires backend service |
| **Database + API** | Adds complexity, infrastructure cost |
| **SSG with build-time data** | Data would be stale until rebuild; not suitable for daily metrics |
| **Headless CMS** | Overkill for simple metrics display |

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Static integration pattern | HIGH | Standard pattern for static site + external data |
| GSC API authentication | HIGH | Official Google service account pattern |
| GEO automation (Claude) | HIGH | Official Anthropic API documented |
| GEO automation (Perplexity) | MEDIUM | API availability needs verification |
| GEO automation (Google AI Overview) | LOW | No API available; manual testing only |
| JSON structure | HIGH | Based on GSC API response structure |
| Dashboard rendering | HIGH | Standard client-side fetch pattern |

---

## Sources

| Source | Confidence | Type |
|--------|------------|------|
| Google Service Account authentication pattern | HIGH | Official Google docs (training knowledge) |
| Google Search Console API structure | HIGH | Official API docs (training knowledge) |
| Anthropic Claude API | HIGH | Official docs (training knowledge) |
| Static site + JSON data pattern | HIGH | Industry standard pattern |
| nginx caching configuration | HIGH | Official nginx docs |
| Perplexity API availability | MEDIUM | Unverified - needs research |
| Google AI Overview API | LOW | No known API - training knowledge says not available |

---

## Gaps to Address

1. **Perplexity API access** - Need to verify if Perplexity provides API for automated queries
2. **Google AI Overview testing** - Currently no automation possible; consider manual weekly check
3. **Monitoring scripts repository location** - Decide if separate repo or excluded directory
4. **Automated deployment pipeline** - Need to decide between manual copy vs GitHub Actions

---

## Recommendations for Phase Planning

### Phase 1: Foundation (Data + Dashboard Skeleton)
- Create `/data/` directory
- Define JSON structure
- Create dashboard.html template
- Test client-side fetch

### Phase 2: GSC Integration
- Set up service account
- Implement GSC collector script
- Generate real JSON data

### Phase 3: GEO Integration
- Set up Claude API access
- Implement GEO query script
- Add GEO section to JSON

### Phase 4: Dashboard Completion
- Implement rendering logic
- Add charts (Chart.js)
- Implement alert display

### Phase 5: Automation
- Implement orchestrator
- Set up scheduled execution
- Implement anomaly detection
- Implement weekly reports

---

*Architecture research completed: 2026-04-08*
*Milestone: v1.1 SEO Monitoring System*