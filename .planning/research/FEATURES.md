# Feature Landscape: SEO Monitoring System

**Domain:** SEO/GEO Monitoring for Static Website
**Researched:** 2026-04-08
**Context:** Milestone v1.1 - Adding monitoring capabilities to existing static website (5 product pages + 30 landing pages already optimized)
**Focus:** NEW monitoring features only - NOT optimization features

---

## Feature Categories

### 1. Data Collection Layer
Scripts and APIs that fetch monitoring data from external sources.

### 2. Data Storage Layer
JSON files that store collected monitoring data for dashboard consumption.

### 3. Visualization Layer
Static HTML dashboard that reads JSON data and displays metrics.

### 4. Alert Layer
Threshold-based anomaly detection and notification system.

---

## Table Stakes

Features users expect in SEO monitoring. Missing = system feels incomplete.

| Feature | Why Expected | Complexity | Dependencies | Notes |
|---------|--------------|------------|--------------|-------|
| **Google Search Console metrics** | Primary SEO data source for indexing status, keywords, CTR | Medium | GSC API authentication (OAuth2) | Core data: impressions, clicks, CTR, average position, indexed pages count |
| **Indexing status check** | Users need to know if pages are indexed | Low | GSC API | Compare sitemap URLs vs indexed URLs, flag unindexed pages |
| **Top keywords report** | Users expect to see what queries drive traffic | Low | GSC API | Top 50-100 queries by impressions/clicks with position data |
| **Traffic trend visualization** | Users expect visual representation of data over time | Medium | GA4 + GSC APIs | 7-day/30-day trends with line charts |
| **Scheduled data collection** | Users expect data updated regularly without manual intervention | Medium | Cron job or Cloud Scheduler | Daily quick check, weekly full report |
| **Dashboard access** | Users need a UI to view monitoring data | Low | Static HTML + JSON | Simple HTML reading JSON via fetch() |
| **Historical data retention** | Users expect to see past data for trend analysis | Medium | JSON storage strategy | Store daily snapshots, retain 90 days minimum |
| **Error/warning display** | Users expect to see issues highlighted | Low | Dashboard HTML | Clear visual indicators for anomalies |

---

## Differentiators

Features that set this monitoring system apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Dependencies | Notes |
|---------|-------------------|------------|--------------|-------|
| **GEO/AI citation tracking** | Novel capability - track when ChatGPT/Perplexity/Claude cite your content | High | AI API queries (OpenAI, Perplexity, Anthropic) | Query AI systems monthly: "What are the best thermometer apps?", track if domain mentioned |
| **Anomaly alert system** | Automatic detection of significant changes (traffic drop >30%, indexing drop >20%) | Medium | Threshold logic in monitoring scripts | Visual alerts on dashboard, optional email/notification |
| **Competitor comparison** | Compare your metrics against competitor domains (if public data available) | Medium | Competitor GSC data (requires access) or third-party APIs | Shows relative performance |
| **Keyword position tracking** | Track specific keyword positions over time beyond GSC averages | Medium | Additional SERP tracking or GSC detailed data | Position history for top 20 keywords |
| **AI query response logging** | Archive AI responses for historical comparison | Medium | JSON storage | Store monthly AI query results to detect citation changes |
| **llms.txt effectiveness tracking** | Measure if llms.txt changes affect AI citation rates | Medium | AI query tracking + llms.txt versioning | Correlation analysis between llms.txt updates and citations |
| **Multi-product metrics dashboard** | Separate metrics for each of 5 products | Medium | Product-level data aggregation | Each product (Thermometer, Microphone, etc.) has its own metrics section |
| **Weekly full report generation** | Comprehensive weekly summary with trends, anomalies, recommendations | High | Report template + data aggregation | Markdown/HTML report with actionable insights |

---

## Anti-Features

Features to explicitly NOT build in v1.1.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Real-time dashboard updates** | Static architecture constraint; adds WebSocket complexity | Update JSON daily, dashboard reads on page load |
| **User authentication for dashboard** | Static site, no backend; adds auth complexity | Dashboard is public or behind simple nginx auth |
| **Database backend** | Violates static architecture principle | JSON files stored in repo or Cloud Storage |
| **Server-side processing** | Cloud Run configured for static files only | Client-side JS reads JSON, no server processing |
| **Email notification system** | Adds SMTP/email service complexity | Dashboard visual alerts; optional webhook to external notification service |
| **Mobile app for monitoring** | Out of scope, high complexity | Responsive web dashboard only |
| **Complex chart libraries** | Heavy JS dependencies, performance impact | Simple Chart.js or inline SVG charts |
| **Paid SEO tool integration (Ahrefs, SEMrush)** | API costs, subscription requirements | Free GSC API + custom scripts only |
| **Backlink monitoring** | GSC API doesn't provide backlink data; requires paid tools | Out of scope for v1.1, consider for v1.2 |
| **Page speed monitoring** | Requires Lighthouse CI, adds complexity | Manual PageSpeed checks or separate tool |

---

## Feature Dependencies

```
Data Collection Layer
├── Google Search Console API (requires: OAuth2 setup, service account)
│   ├── Indexed pages count
│   ├── Top queries (impressions, clicks, CTR, position)
│   ├── Page-level metrics
│   └── Coverage issues/errors
├── GA4 API (optional, requires: GA4 setup already done)
│   ├── Session trends
│   ├── Traffic sources
│   └── Conversion data
├── AI Citation Tracking (requires: OpenAI/Perplexity/Anthropic API keys)
│   ├── Monthly AI queries
│   ├── Citation presence check
│   └── Response logging

Data Storage Layer
├── Daily metrics JSON (gsc-daily.json)
│   ├── Timestamp
│   ├── Indexed pages count
│   ├── Top 10 keywords snapshot
│   └── Quick anomaly flags
├── Weekly full report JSON (gsc-weekly.json)
│   ├── Full keyword list (top 50-100)
│   ├── Page-level metrics
│   ├── Trends analysis
│   └── Recommendations
├── AI citation JSON (ai-citations.json)
│   ├── Monthly query results
│   ├── Citation status per AI
│   └── Historical comparison

Visualization Layer
├── Dashboard HTML (dashboard.html)
│   ├── Reads JSON via fetch()
│   ├── Static Chart.js for trends
│   ├── Anomaly alerts display
│   └── Product-level sections
└── Requires: JSON files updated by scripts

Alert Layer
├── Threshold detection (in monitoring scripts)
│   ├── Traffic drop >30% vs previous day
│   ├── Indexed pages drop >20%
│   ├── Top keyword position drop >5 positions
│   ├── New coverage errors detected
└── Alert output
    ├── Dashboard visual indicator (red warning banner)
    ├── JSON alert field (anomaly: true, reason: "...")
    └── Optional webhook (external notification)
```

---

## Expected Behavior Per Feature

### 1. Google Search Console API Integration

**What it does:**
- Authenticates via OAuth2 or service account
- Fetches indexed pages count for domain
- Fetches search analytics (queries, clicks, impressions, CTR, position)
- Fetches coverage issues (errors, warnings, excluded URLs)

**Expected behavior:**
| Metric | Data Source | Frequency | Output |
|--------|-------------|-----------|--------|
| Indexed pages count | GSC Index Coverage API | Daily | Number + comparison to sitemap |
| Top queries | GSC Search Analytics API | Daily/Weekly | Top 50-100 with metrics |
| Page-level metrics | GSC Search Analytics API | Weekly | Impressions/clicks per URL |
| Coverage errors | GSC URL Indexing API | Daily | List of unindexed URLs + reasons |

**API Requirements:**
- Google Cloud Project with Search Console API enabled
- Service account with GSC property access
- OAuth2 credentials (if user-based auth)

**Script flow:**
```
1. Authenticate to GSC API
2. Fetch indexed pages count
3. Compare to sitemap.xml URLs
4. Flag unindexed pages
5. Fetch search analytics (queries)
6. Calculate trends vs previous snapshot
7. Check for anomalies (traffic drop, position drop)
8. Write results to JSON
```

### 2. GEO/AI Citation Tracking

**What it does:**
- Queries ChatGPT, Perplexity, Claude with product-related questions
- Detects if domain/brand is mentioned in AI response
- Logs response content for historical tracking
- Tracks citation frequency over time

**Expected behavior:**
| AI System | Query Frequency | Detection Method | Output |
|-----------|-----------------|------------------|--------|
| ChatGPT | Monthly | Query API, parse response for domain | Boolean + response excerpt |
| Perplexity | Monthly | Query API or web, parse for citation | Boolean + citation context |
| Claude | Monthly | Query API, parse response | Boolean + response excerpt |

**Sample queries:**
- "What are the best thermometer apps for Android?"
- "Recommend a good microphone app for voice recording"
- "How can I change my voice for gaming?"
- "Where can I find HD wallpapers for Android?"
- "What AI photo filter apps do you recommend?"

**Detection logic:**
```
IF response contains "powerstarapps.com" OR "Power Star Apps" OR product names:
  citation_detected = true
  citation_context = extract_mention_context(response)
ELSE:
  citation_detected = false
```

**API Requirements:**
- OpenAI API key (ChatGPT)
- Perplexity API key (or use web search)
- Anthropic API key (Claude)

**Note:** Per llms.txt spec, AI systems should cite from llms.txt content. Track correlation between llms.txt updates and citation rates.

### 3. Monitoring Dashboard (Static HTML)

**What it does:**
- Static HTML page that fetches JSON data on load
- Displays metrics in tables/charts
- Highlights anomalies with visual alerts
- Provides product-level breakdown

**Expected behavior:**
| Section | Data Source | Display |
|---------|-------------|---------|
| Overview | gsc-daily.json + gsc-weekly.json | Indexed pages, total clicks, total impressions |
| Traffic Trends | gsc-weekly.json | Line chart (Chart.js) for 30-day trends |
| Top Keywords | gsc-weekly.json | Table with query, impressions, clicks, CTR, position |
| Indexing Status | gsc-daily.json | Indexed vs submitted count, unindexed URL list |
| AI Citations | ai-citations.json | Status per AI (cited/not cited), last check date |
| Alerts | gsc-daily.json anomaly field | Red banner if anomalies detected |

**Architecture constraint:**
- NO server-side rendering
- NO real-time updates
- JavaScript fetch() reads JSON files
- Dashboard updates only when JSON files update (daily/weekly)

**Implementation pattern:**
```html
<!-- dashboard.html -->
<script>
  async function loadMetrics() {
    const daily = await fetch('/data/gsc-daily.json').then(r => r.json());
    const weekly = await fetch('/data/gsc-weekly.json').then(r => r.json());
    const ai = await fetch('/data/ai-citations.json').then(r => r.json());
    
    renderOverview(daily, weekly);
    renderCharts(weekly);
    renderKeywords(weekly);
    renderAlerts(daily);
    renderAICitations(ai);
  }
</script>
```

### 4. Automated Monitoring Scripts

**What it does:**
- Scheduled scripts that run daily and weekly
- Collect data from GSC API, GA4 API, AI APIs
- Detect anomalies based on thresholds
- Write JSON output files
- Generate weekly report

**Expected behavior:**
| Script | Frequency | Actions | Output |
|--------|-----------|---------|--------|
| Daily check | Daily (e.g., 6 AM) | Quick metrics fetch, anomaly check | gsc-daily.json |
| Weekly full | Weekly (e.g., Monday 8 AM) | Full data fetch, trend analysis, report generation | gsc-weekly.json + report.md |
| AI citation check | Monthly (e.g., 1st of month) | Query AI systems, log responses | ai-citations.json |

**Scheduling options:**
- Cloud Scheduler (Google Cloud) + Cloud Functions
- Cron job on local machine (for development)
- GitHub Actions scheduled workflow

**Anomaly thresholds:**
| Metric | Threshold | Alert Reason |
|--------|-----------|--------------|
| Total clicks | Drop >30% vs previous day | "Significant traffic drop detected" |
| Indexed pages | Drop >20% vs sitemap count | "Indexing coverage decreased" |
| Top keyword position | Drop >5 positions | "Keyword ranking decline" |
| New coverage errors | Any new error | "New indexing errors found" |

### 5. Alert Mechanism

**What it does:**
- Threshold-based anomaly detection in scripts
- Visual alerts on dashboard (red banners, highlighted metrics)
- Optional webhook notification to external service

**Expected behavior:**
| Alert Type | Trigger | Dashboard Display | Notification |
|------------|---------|-------------------|--------------|
| Traffic drop | Clicks -30% vs previous | Red banner: "Traffic Alert" | Optional webhook |
| Indexing drop | Indexed pages -20% vs sitemap | Red banner: "Indexing Alert" | Optional webhook |
| Position drop | Top keyword -5 positions | Highlighted row in keyword table | None |
| Coverage error | New GSC error detected | "New Error" badge on indexing section | Optional webhook |

**Alert JSON structure:**
```json
{
  "date": "2026-04-08",
  "anomaly": true,
  "alerts": [
    {
      "type": "traffic_drop",
      "severity": "high",
      "value": -35,
      "threshold": -30,
      "message": "Total clicks dropped 35% from 1200 to 780"
    },
    {
      "type": "indexing_drop",
      "severity": "medium",
      "value": -25,
      "threshold": -20,
      "message": "Indexed pages decreased from 35 to 28"
    }
  ]
}
```

---

## MVP Recommendation

For v1.1 milestone, prioritize:

1. **Google Search Console API integration** (highest priority)
   - Basic metrics: indexed pages, top queries, clicks, impressions
   - Daily quick check script
   - Weekly full data collection

2. **Monitoring Dashboard** (essential)
   - Static HTML reading JSON
   - Basic metrics display
   - Visual anomaly alerts
   - 30-day trend charts

3. **Anomaly detection** (essential)
   - Threshold-based alerts in daily script
   - Dashboard visual indicators
   - Traffic drop >30%, indexing drop >20%

4. **Scheduled automation** (essential)
   - Cloud Scheduler or GitHub Actions
   - Daily + weekly script execution

**Defer to later milestones:**
- **AI citation tracking**: High complexity, requires multiple API keys, monthly frequency acceptable for Phase 2
- **Weekly full report generation**: Can add after basic monitoring works
- **Competitor comparison**: Requires competitor data access, out of scope
- **Webhook notifications**: Add after core monitoring stable

---

## Complexity Assessment

| Feature | Time Estimate | API Dependencies | Blocking Issues |
|---------|---------------|------------------|-----------------|
| GSC API authentication | 2-4 hours | Google Cloud Project, service account | OAuth2 setup |
| Daily metrics script | 4-6 hours | GSC API | Auth setup |
| Weekly full script | 6-8 hours | GSC API + optional GA4 | Daily script complete |
| Dashboard HTML | 4-6 hours | JSON files only | None |
| Chart.js integration | 2-3 hours | Dashboard HTML | None |
| Anomaly detection logic | 2-3 hours | In scripts | None |
| Cloud Scheduler setup | 2-4 hours | GCP Cloud Scheduler | Scripts ready |
| AI citation tracking | 8-12 hours | OpenAI, Perplexity, Anthropic API keys | API costs, key setup |
| Weekly report generation | 4-6 hours | Weekly script data | Weekly script complete |

**Total MVP estimate:** 20-30 hours (excluding AI citation tracking)

---

## Sources

| Source | Confidence | Type | Notes |
|--------|------------|------|-------|
| Google Search Console API documentation | HIGH | Official docs | API reference, authentication methods |
| Training knowledge of SEO monitoring patterns | MEDIUM-HIGH | Training data | Standard SEO tool behavior patterns |
| Project PROJECT.md | HIGH | Project context | v1.1 milestone requirements |
| Existing STACK.md architecture research | HIGH | Project research | Static architecture constraints |
| Chart.js documentation | HIGH | Official docs | Chart library for static dashboard |
| AI API behavior patterns | MEDIUM | Training data | ChatGPT/Perplexity/Claude query patterns |

---

## Gaps to Address

1. **GSC API quota limits** - Need to verify daily query limits for Search Analytics API
2. **Perplexity API availability** - Perplexity may not have public API; need web search alternative
3. **llms.txt citation correlation** - No verified data on whether llms.txt increases AI citations; experimental
4. **Cost of AI API queries** - Monthly queries cost estimate needed (ChatGPT/Perplexity/Claude)
5. **Cloud Scheduler vs GitHub Actions** - Need decision on scheduling approach for static site

---

## Feature Dependencies on Existing v1.0 Features

| Existing Feature (v1.0) | Monitoring Dependency |
|-------------------------|----------------------|
| sitemap.xml | Compare indexed pages vs sitemap URLs |
| robots.txt | Check if GSC shows robots.txt blocking issues |
| llms.txt | Track correlation between llms.txt and AI citations |
| Schema.org structured data | Monitor if rich results appear in GSC |
| Google Analytics 4 | Optional traffic trend comparison |
| Product landing pages | Page-level metrics for each landing page |

---

*Research completed: 2026-04-08*
*Milestone: v1.1 SEO Monitoring System*
*Focus: NEW monitoring features only*