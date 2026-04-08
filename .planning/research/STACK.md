# Technology Stack: SEO Monitoring System

**Project:** PowerStar Website - SEO/GEO Monitoring (v1.1 Milestone)
**Researched:** 2026-04-08
**Focus:** NEW monitoring capabilities only (GSC API, AI citation tracking, Dashboard, Automation, Alerts)
**Note:** Previous v1.0 research focused on GEO content strategy - this document addresses monitoring stack.

---

## Executive Summary

SEO monitoring requires adding a **Node.js script layer** to the existing static architecture. Scripts run separately from the static site, generating JSON data files that the dashboard consumes. **No changes to existing site architecture** - monitoring scripts are an external addition.

**Key additions:**
1. Node.js scripts for data collection (Google Search Console, AI APIs)
2. Chart.js for dashboard visualization
3. Automation via GitHub Actions or node-cron
4. Alert mechanisms via email/Slack

**Principle:** Keep the static site static. Monitoring scripts operate independently, outputting JSON files that the dashboard HTML reads at runtime.

---

## Recommended Stack

### Core Runtime

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Node.js | 20 LTS | Script runtime | Native JSON handling, async APIs, large ecosystem. Compatible with JS-based site context. |
| TypeScript | 5.x | Type safety | Schema validation for API responses, IDE support, catch errors at compile time. Use `tsx` for execution without build step. |
| tsx | 4.x | TypeScript executor | Run TS directly, no compilation step needed. Faster than tsc + node. |

**Rationale:** Node.js 20 LTS is current stable. TypeScript adds safety for API response handling. `tsx` eliminates build complexity - scripts run directly from source.

---

### Google Search Console Integration

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| googleapis | 171.4.0 | GSC API client | Official Google library, complete API coverage, maintained by Google. Access to searchAnalytics.query for metrics. |
| google-auth-library | 10.6.2 | Service Account auth | Required for server-to-server auth. Supports JWT, computes signatures automatically. No OAuth user flow needed. |

**Rationale:** Official library ensures API compatibility. Service Account authentication ideal for automated scripts - no user interaction required.

**What GSC API provides:**
- `searchAnalytics.query` - Impressions, clicks, CTR, average position by query/page/country/device
- `urlInspection.index.inspect` - Indexing status, coverage issues
- `sitemaps.list` - Sitemap submission status

**Integration approach:**
```typescript
import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

const searchconsole = google.searchconsole({ version: 'v1', auth });

// Query metrics
const response = await searchconsole.searchanalytics.query({
  siteUrl: 'https://powerstar.app',
  requestBody: {
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    dimensions: ['query', 'page'],
    metrics: ['clicks', 'impressions', 'ctr', 'position'],
    rowLimit: 1000,
  },
});
```

---

### GEO/AI Citation Tracking

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| ai | 6.0.152 | Vercel AI SDK core | Unified interface across AI providers. Handles streaming, structured output, retries. |
| @ai-sdk/perplexity | 3.0.29 | Perplexity Sonar API | Perplexity's real-time web search API. Query "What apps measure body temperature?" to check citation. |
| openai | 6.33.0 | ChatGPT API | Official SDK for GPT-4 models. Use `gpt-4o` for citation queries. |
| @anthropic-ai/sdk | 0.85.0 | Claude API | Official SDK for Claude models. Use `claude-haiku-4-5` (cost-effective) or `claude-sonnet-4-6` (better reasoning). |

**Rationale:** Vercel AI SDK provides unified interface - same code pattern for Perplexity, OpenAI, Anthropic. Each SDK remains available for provider-specific features.

**Models to use:**
| Provider | Model | API ID | Use Case | Cost |
|----------|-------|--------|----------|------|
| Perplexity | Sonar | `sonar` | Web search queries, real-time results | $5/1M input, $10/1M output |
| Perplexity | Sonar Pro | `sonar-pro` | More detailed answers | Higher cost |
| OpenAI | GPT-4o | `gpt-4o` | General queries, citation analysis | $2.50/1M input, $10/1M output |
| Anthropic | Claude Haiku 4.5 | `claude-haiku-4-5` | Fast, cost-effective queries | $1/1M input, $5/1M output |
| Anthropic | Claude Sonnet 4.6 | `claude-sonnet-4-6` | Better reasoning for complex analysis | $3/1M input, $15/1M output |

**Tracking approach:**
```typescript
import { createPerplexity } from '@ai-sdk/perplexity';
import { generateText } from 'ai';

const perplexity = createPerplexity({
  apiKey: process.env.PERPLEXITY_API_KEY
});

const result = await generateText({
  model: perplexity('sonar'),
  prompt: 'What are the best mobile apps for measuring body temperature? List specific apps.',
});

// Parse result for "PowerStar" or product names (Thermometer, Microphone, etc.)
```

**Query template:**
- Query: "What apps can measure body temperature on iPhone/Android?"
- Query: "Best voice changer apps for mobile"
- Query: "Apps for dynamic wallpaper on phone"
- Analyze: Does response mention PowerStar products? Track citation frequency.

---

### Dashboard & Visualization

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| Chart.js | 4.5.1 | Standard charts | Lightweight, CDN-compatible, renders to canvas. Line charts for trends, bar for comparisons, pie for distribution. |
| D3.js | 7.9.0 (optional) | Custom visualizations | Only if Chart.js insufficient. Powerful but heavier. |

**Rationale:** Chart.js is sufficient for SEO metrics - time series for trends, bar charts for keyword comparisons. Works with static JSON data files.

**Architecture pattern:**
```
/monitoring/
  scripts/           # Run separately (not part of site)
    daily-check.ts   # Collect GSC metrics, AI citations
    weekly-report.ts # Aggregate weekly data
  data/              # Output: JSON files
    gsc-metrics.json # Daily GSC data
    ai-citations.json # AI mention tracking
    alerts.json      # Active alerts list
  dashboard/         # Static HTML (part of site)
    index.html       # Dashboard page
    app.js           # Chart.js rendering
```

**Dashboard page structure:**
```html
<!-- /dashboard/index.html -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1"></script>
<script>
  // Fetch JSON data files
  fetch('/monitoring/data/gsc-metrics.json')
    .then(r => r.json())
    .then(data => {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.dates,
          datasets: [{
            label: 'Impressions',
            data: data.impressions,
          }]
        }
      });
    });
</script>
```

---

### Automation & Scheduling

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| node-cron | 4.2.1 | Local scheduling | Simple cron syntax, reliable. Use for local development/testing. |

**Alternative: GitHub Actions (recommended for production)**
```yaml
# .github/workflows/seo-monitor.yml
name: Daily SEO Check
on:
  schedule:
    - cron: '0 6 * * *'  # 6 AM UTC daily
  workflow_dispatch:      # Manual trigger

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - run: npm ci
        working-directory: monitoring
      
      - name: Run daily check
        run: npx tsx scripts/daily-check.ts
        working-directory: monitoring
        env:
          GOOGLE_APPLICATION_CREDENTIALS_JSON: ${{ secrets.GCP_SA_KEY }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          PERPLEXITY_API_KEY: ${{ secrets.PERPLEXITY_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      
      - name: Commit data updates
        run: |
          git config user.name "SEO Monitor Bot"
          git config user.email "bot@powerstar.app"
          git add monitoring/data/*.json
          git diff --quiet && git commit -m "Update SEO metrics [skip ci]"
          git push
```

**Rationale:** GitHub Actions free tier includes 2000 minutes/month - sufficient for daily 5-minute script runs. Data commits to repo, dashboard reads from served JSON. No server needed.

---

### Alert Mechanisms

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| nodemailer | 8.0.5 | Email alerts | Battle-tested, supports SMTP. Free via Gmail SMTP (with app password). |
| resend | 6.10.0 | Modern email API | Alternative: better deliverability, simpler API. Free tier: 3000 emails/month. |
| @slack/webhook | 7.0.8 | Slack notifications | Simple webhook integration. No OAuth complexity. Team alerts. |

**Rationale:** Email via nodemailer (free SMTP) or Resend (modern API). Slack for immediate team notification. Configure both as optional channels.

**Alert thresholds (from PROJECT.md):**
| Metric | Threshold | Alert |
|--------|-----------|-------|
| Traffic (clicks) | > 30% drop vs previous week | HIGH |
| Indexed pages | > 20% drop | HIGH |
| Average position | > 10 positions drop for top keywords | MEDIUM |
| AI citations | No mentions in weekly query batch | LOW (informational) |

**Alert implementation:**
```typescript
// scripts/send-alerts.ts
import nodemailer from 'nodemailer';
import { WebClient } from '@slack/web-api';

async function sendAlert(type: 'email' | 'slack', message: string) {
  if (type === 'email') {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: 'SEO Monitor <alerts@powerstar.app>',
      to: 'team@powerstar.app',
      subject: 'SEO Alert: Traffic Drop Detected',
      text: message,
    });
  }
  
  if (type === 'slack') {
    await slackClient.chat.postMessage({
      channel: '#seo-alerts',
      text: message,
    });
  }
}
```

---

### Data & Utilities

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| axios | 1.14.0 | HTTP client | Promise-based, interceptors, retry support. Used for any direct API calls. |
| dotenv | 17.4.1 | Environment variables | Load secrets from .env. Never commit API keys. |
| fs-extra | 11.3.4 | File operations | Promise-based fs, atomic writes. Write JSON data files safely. |
| zod | 4.3.6 | Schema validation | Validate API responses before writing. Catch data errors early. |

**Rationale:** Standard utilities for Node.js data handling. Zod validates GSC and AI API responses match expected structure.

---

### CLI Development (Optional)

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| @clack/prompts | 1.2.0 | Interactive CLI | Beautiful terminal UI for manual script runs, debugging. |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Runtime | Node.js 20 LTS | Python 3.11+ | Would fragment stack: site is JS, scripts would be Python. Node handles everything for this use case. |
| Charts | Chart.js | Plotly.js | Larger bundle, more complex. Chart.js sufficient for SEO metrics. |
| Charts | Chart.js | ApexCharts | Good alternative, but Chart.js larger community, more Stack Overflow answers. |
| Charts | Chart.js | D3.js | Overkill for standard charts. Only consider for custom visualizations. |
| Email | nodemailer | SendGrid API | Free tier only 100 emails/day. nodemailer + Gmail SMTP = effectively unlimited. |
| Email | nodemailer | Resend | Excellent but newer. Use nodemailer first, migrate to Resend if deliverability issues. |
| Alerts | Slack webhook | PagerDuty | Overkill for SEO monitoring. PagerDuty for ops emergencies. |
| GSC API | googleapis | n8n-nodes-gsc | n8n is workflow platform, adds complexity. Direct API simpler. |
| GSC API | googleapis | MCP server GSC | MCP is for LLM context, not data collection. |
| AI SDK | Vercel AI SDK | Direct fetch | SDK handles retries, streaming, structured output. Worth dependency. |
| Automation | GitHub Actions | AWS Lambda | Lambda requires AWS account, costs. Actions free for small scripts. |
| Automation | GitHub Actions | Cloud Run Jobs | Already using Cloud Run, but Jobs requires separate config. Actions simpler. |

---

## What NOT to Add

| Avoid | Why |
|-------|-----|
| Database (PostgreSQL, MongoDB) | JSON files sufficient. Monitoring data is historical records, not complex queries. ~100KB/month growth. |
| Backend server (Express, Fastify) | Scripts generate JSON, static dashboard reads it. No real-time requirements. |
| Frontend framework (React, Vue) | Single dashboard page. Vanilla JS + Chart.js simpler, no build step. |
| Build tool (Vite, Webpack) | TypeScript via tsx, no compilation needed. Site remains zero-build. |
| Testing framework (Jest, Vitest) | Monitoring scripts. Validation via Zod. Consider only if complexity grows. |
| Redis/caching | Not needed for daily runs. Data freshness matters, cache would hurt. |
| Authentication for dashboard | Internal use only. Use nginx HTTP Basic Auth if needed: `auth_basic "SEO Dashboard";` |
| Full-stack framework | Monitoring is scripts + data files. No server component. |
| GraphQL | Overkill. Simple REST patterns for API calls. |

---

## Installation

```bash
# Create monitoring directory
mkdir -p monitoring/scripts monitoring/data monitoring/dashboard

# Monitoring package.json
cd monitoring
npm init -y

# TypeScript execution
npm install -D typescript tsx @types/node

# Google Search Console
npm install googleapis google-auth-library

# AI APIs (install only providers you'll use)
npm install ai @ai-sdk/perplexity    # Perplexity
npm install openai                    # OpenAI/ChatGPT
npm install @anthropic-ai/sdk         # Claude

# Dashboard
npm install chart.js                   # If bundling (or use CDN in HTML)

# Automation
npm install node-cron                  # Local scheduling

# Alerts
npm install nodemailer                 # Email
npm install @slack/webhook             # Slack webhook
npm install resend                     # Alternative email (optional)

# Utilities
npm install axios dotenv fs-extra zod

# CLI (optional)
npm install @clack/prompts
```

**Total dependencies:** ~15 packages
**Site bundle impact:** None. Scripts run separately, dashboard uses CDN Chart.js.

---

## Configuration Required

### Environment Variables (.env)

```bash
# Google Search Console
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
GSC_SITE_URL=https://powerstar.app

# AI APIs (install SDKs only for providers you configure)
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
PERPLEXITY_API_KEY=pplx-...

# Alerts
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/TXXX/BXXX/XXX
SMTP_HOST=smtp.gmail.com
SMTP_USER=alerts@example.com
SMTP_PASS=your-app-password-here

# Or Resend instead of SMTP
RESEND_API_KEY=re_...
```

### Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or use existing
3. Enable "Google Search Console API" 
4. Create Service Account:
   - IAM & Admin > Service Accounts > Create
   - Generate JSON key file (save as `credentials.json`)
5. Add Service Account email to Search Console:
   - Go to Search Console > Settings > Users
   - Add user: paste Service Account email
   - Permission: Full or Restricted (Read-only sufficient)

### Slack Webhook Setup

1. Go to Slack App settings
2. Create Incoming Webhook
3. Select channel (e.g., #seo-alerts)
4. Copy webhook URL to .env

---

## File Structure

```
powerstar-website/
  # EXISTING SITE (unchanged)
  index.html
  products/
    thermometer.html
    ...
  css/
  js/
  
  # NEW: Monitoring Layer
  monitoring/
    scripts/
      daily-check.ts      # Run daily via GitHub Actions
      weekly-report.ts    # Run weekly, aggregate data
      query-ai-citations.ts # Query Perplexity/ChatGPT for mentions
      send-alerts.ts      # Alert dispatch logic
    data/
      gsc-metrics.json    # { dates, impressions, clicks, ctr, position, queries }
      ai-citations.json   # { queries, mentions, sentiment, timestamp }
      alerts-history.json # { alerts: [{ type, message, timestamp, resolved }] }
      dashboard-config.json # Dashboard settings
    dashboard/
      index.html          # Dashboard page (served as static)
      styles.css
      app.js              # Chart.js rendering logic
    lib/
      gsc-client.ts       # Google Search Console wrapper
      ai-client.ts        # Unified AI query interface
      alert-client.ts     # Alert dispatch wrapper
      schemas.ts          # Zod schemas for API responses
      config.ts           # Environment configuration
    package.json
    tsconfig.json
    .env.example
    credentials.json      # GCP Service Account key (DO NOT COMMIT)
```

---

## Sources

| Topic | Source | Confidence |
|-------|--------|------------|
| googleapis version/methods | npm registry (`npm view`) | HIGH |
| google-auth-library version | npm registry | HIGH |
| Chart.js version | npm registry | HIGH |
| @ai-sdk/perplexity | npm registry (`npm search`) | HIGH |
| Vercel AI SDK version | npm registry | HIGH |
| Claude API models/pricing | platform.claude.com/docs (WebFetch) | HIGH |
| Claude SDK version | npm registry | HIGH |
| OpenAI SDK version | npm registry | HIGH |
| GSC API structure | googleapis documentation | MEDIUM |
| Perplexity integration | @ai-sdk/perplexity description | MEDIUM |
| GEO tracking methodology | Emerging practice, llms.txt spec | LOW |

---

## Risk Notes

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Perplexity API docs inaccessible** | Medium | Use Vercel AI SDK abstraction. Test thoroughly. |
| **GEO tracking experimental** | Low | New field. Start with simple query approach, iterate. |
| **GSC API quotas** | Low | Daily queries well within limits. Hourly would exceed. |
| **GitHub Actions data commit** | Low | Use `[skip ci]` in commit message to avoid CI loop. |
| **Service Account key security** | High | Use GitHub Secrets for credentials. Never commit keys.json. |
| **AI API costs** | Medium | Use Haiku for routine queries. Sonnet/Opus only when needed. |

---

## Previous Research (v1.0 GEO Content)

The following were researched for GEO optimization content strategy and remain valid:

| Addition | Status | Notes |
|----------|--------|-------|
| llms-full.txt | Recommended | Create expanded AI-readable content file |
| robots.txt update | Recommended | Add PerplexityBot, GPTBot permissions |
| FAQ structure enhancement | Recommended | Direct Q&A format for AI citation |
| Blog template | Recommended | Manual HTML template for consistency |
| Landing pages | Recommended | Template-based pages for each product |

These are **content additions**, not stack changes. They complement the monitoring system by improving the content that monitoring tracks.

---

*Research completed: 2026-04-08*
*Stack additions: Node.js scripts layer, no changes to static site architecture*