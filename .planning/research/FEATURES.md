# Feature Landscape: SEO/GEO Optimization

**Domain:** Static website SEO and Generative Engine Optimization
**Researched:** 2026-04-03
**Context:** Adding SEO/GEO features to existing static website for 5 mobile app products

---

## Feature Categories

### 1. Technical SEO Infrastructure
Foundation features that enable search engines to discover and index content properly.

### 2. Content SEO
Content types and structures that drive organic search traffic and user engagement.

### 3. Generative Engine Optimization (GEO)
Features specifically designed for AI/LLM citation (ChatGPT, Perplexity, Google AI Overview).

### 4. User Experience SEO
Features that improve user engagement signals which indirectly affect rankings.

---

## Table Stakes

Features users and search engines expect. Missing = product feels incomplete or invisible.

| Feature | Why Expected | Complexity | Current Status | Gap |
|---------|--------------|------------|----------------|-----|
| Meta title tags | Primary ranking signal, browser/tab display | Low | Done | None |
| Meta descriptions | Click-through rate from SERP | Low | Done | None |
| Schema.org JSON-LD | Rich results eligibility, knowledge graph | Medium | Done (Product, FAQPage, Organization) | Could add BreadcrumbList, HowTo |
| Open Graph tags | Social sharing preview | Low | Done | None |
| Twitter Card tags | Twitter/X sharing preview | Low | Done | None |
| sitemap.xml | Search engine discovery | Low | Done | Needs update for new content |
| robots.txt | Crawling directives | Low | Done | None |
| Canonical URLs | Duplicate content prevention | Low | Done | None |
| Mobile-responsive design | Mobile-first indexing requirement | Medium | Partial | Missing hamburger menu |
| Fast page load | Core Web Vitals ranking factor | Medium | Done (nginx optimized) | CSS consolidation needed |
| Internal linking | Site structure, crawlability | Low | Partial | Blog links broken (href="#") |
| Product landing pages | Search intent matching | High | Done (5 products + 10 AI Photo scenes) | Need for other 4 products |

---

## Differentiators

Features that set product apart from competing websites. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **llms.txt file** | AI/LLM citation source (ChatGPT, Perplexity, Claude) | Low | Already implemented v0.2 format. Per llmstxt.org spec by Jeremy Howard (Sept 2024). |
| **AI-citable FAQ content** | Direct answers AI can quote | Medium | Need structured Q&A format with clear, factual answers |
| **Scene landing pages** (programmatic SEO) | Capture specific search intents (e.g., "anime photo filter", "thermometer for fishing") | Medium-High | 10 done for AI Photo. Need 10-20 per other 4 products |
| **Tutorial blog content** | Authority building, backlink potential | Medium | 5 articles exist. Need 3-5 per product (15-25 total) |
| **Markdown page versions** (.md) | LLM-friendly content per llms.txt spec | Medium | Per spec: same URL with .md appended for clean LLM ingestion |
| **HowTo schema** | Step-by-step guide rich results | Low | Add to tutorial blog articles |
| **BreadcrumbList schema** | Site structure in search results | Low | Add to all pages |
| **Comparison content** | "X vs Y" articles capture comparison searches | Medium | High intent, conversion-focused |
| **Before/after demo images** | Visual proof, increases conversion | Medium | images/demo/ missing - placeholder fallback |

---

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Thin content pages** | Google penalizes low-value content, hurts E-E-A-T | Each page must have 300+ words of unique, helpful content |
| **Duplicate content** | Cannibalizes rankings, confuses search engines | Use canonical URLs, unique descriptions per page |
| **Keyword stuffing** | Old SEO tactic, now penalized | Natural language, focus on user intent |
| **Blog with href="#" links** | Broken UX, hurts crawlability, trust signals | Link to actual articles or remove placeholder cards |
| **Inline styles/scripts** | Not cached, slower load, harder maintenance | External CSS/JS files |
| **Placeholder images** | Reduces trust, conversion, brand credibility | Create real demo images or remove before/after sections |
| **AI-generated spam content** | Google March 2024 update penalizes low-quality AI content | Human-edited, value-added content with expertise |
| **Hidden mobile navigation** | Users can't navigate, high bounce rate | Hamburger menu or visible mobile nav |
| **Buying backlinks** | Penalized by Google, risks domain reputation | Organic link building via quality content |

---

## Content Types That Drive Exposure

### High ROI Content Types (1-2 Week Timeline)

| Content Type | Search Intent | Examples | SEO Value | GEO Value |
|--------------|---------------|----------|-----------|-----------|
| **Scene Landing Pages** | Specific feature/use case searches | "anime photo filter", "thermometer for fishing", "microphone for presentations" | High - captures niche intent | Medium - factual descriptions citable |
| **Tutorial Articles** | "How to" searches | "How to use barometer for fishing", "Best voice changer for gaming" | High - authority building | High - step-by-step answers quotable |
| **Comparison Articles** | "X vs Y" searches | "Best thermometer apps for Android", "AI Photo vs Lensa" | High - purchase intent | Medium - factual comparisons |
| **FAQ Content** | Question searches | "What is the best microphone app?", "How accurate is the thermometer?" | Medium - FAQ rich results | High - direct Q&A format for AI citation |
| **Product Feature Deep-Dives** | Feature-specific searches | "AI dress-up filter explained", "Voice changer effects guide" | Medium - feature education | Medium - explanatory content |

### Content Volume Targets

Based on competitor analysis and 1-2 week timeline:

| Product | Current Scene Pages | Target Scene Pages | Current Blog | Target Blog |
|---------|---------------------|--------------------|--------------|-------------|
| AI Photo | 10 | 15-20 (expand) | 1 | 3-5 |
| Thermometer | 0 | 10-15 | 1 | 3-5 |
| Microphone | 0 | 10-15 | 1 | 3-5 |
| Voice Changer | 0 | 10-15 | 1 | 3-5 |
| Lumiwall | 0 | 10-15 | 1 | 3-5 |
| **Total** | 10 | 50-75 | 5 | 15-25 |

---

## Feature Dependencies

```
Technical SEO Foundation
├── sitemap.xml (depends on: all page URLs existing)
├── Schema.org (depends on: content structure defined)
└── robots.txt (independent)

Content SEO
├── Scene Landing Pages (depends on: demo images, product data)
├── Blog Articles (depends on: blog.html links fixed)
└── FAQ Content (depends on: FAQPage schema template)

GEO Features
├── llms.txt (depends on: site structure documented) ✓ DONE
├── AI-citable FAQ (depends on: Q&A format, factual answers)
└── Markdown versions (depends on: content creation workflow)

UX SEO
├── Mobile Navigation (depends on: CSS restructure)
├── Demo Images (depends on: design/creation resources)
└── Internal Links (depends on: content creation)
```

---

## GEO-Specific Feature Details

### llms.txt Specification (HIGH Confidence - Official Source)

Per [llmstxt.org](https://llmstxt.org/) specification by Jeremy Howard (September 2024):

**Format Requirements:**
1. Located at `/llms.txt` in website root
2. Markdown format with specific structure:
   - H1 with project/site name (required)
   - Blockquote with short summary (optional but recommended)
   - Zero or more paragraphs with detailed info
   - Zero or more H2 sections with "file lists" (markdown hyperlinks)

**Current Implementation:** v0.2 format with company info, all 5 products, website structure, FAQ for AI training, and contact info.

**Enhancement Opportunities:**
- Add `## Optional` section for secondary URLs (can be skipped for shorter context)
- Add `.md` versions of key pages (per spec: same URL + `.md` extension)
- Link to blog articles in markdown format

### AI-Citable FAQ Format (MEDIUM Confidence - Emerging Practice)

For ChatGPT/Perplexity citation, FAQ content should:

1. **Direct question-answer format** - No preamble, just Q then A
2. **Factual, verifiable answers** - Statistics, features, comparisons
3. **Structured with clear entities** - Product names, numbers, key features
4. **Avoid marketing language** - AI filters promotional content
5. **Include source attribution** - Helps AI cite origin

**Example Format:**
```
Q: How many downloads does Power Star Apps have?
A: Power Star Apps has over 10 million combined downloads across all 5 apps on Google Play Store.
```

### Google AI Overview Optimization (LOW Confidence - Speculative)

Based on emerging patterns (training data, not verified with official docs):

- Well-structured FAQ content appears in AI Overviews
- HowTo schema increases step-by-step guide citation
- E-E-A-T signals (expertise, experience, authoritativeness, trust) matter
- Fresh, updated content preferred

---

## MVP Recommendation

For 1-2 week timeline, prioritize:

1. **Fix blocking issues** (UX SEO table stakes):
   - Mobile navigation hamburger menu
   - Blog.html href="#" → actual article links
   - Demo images or remove placeholder sections

2. **Expand scene landing pages** (highest ROI):
   - 10-15 per remaining 4 products (Thermometer, Microphone, Voice Changer, Lumiwall)
   - Each page: 300+ words, unique meta, Schema.org, internal links

3. **Create AI-citable FAQ content** (GEO differentiator):
   - 10-15 factual Q&A pairs per product
   - Add to product pages and dedicated FAQ section
   - FAQPage schema for rich results + AI citation

4. **Expand blog content** (authority building):
   - 3-5 tutorials per product
   - HowTo schema on tutorial articles
   - Internal links to product/scene pages

**Defer:**
- Markdown .md versions (phase 2 - requires workflow change)
- Comparison articles (phase 2 - more research needed)
- CSS consolidation (technical debt, not SEO blocking)

---

## Complexity Assessment

| Feature | Time Estimate | Priority | Blocking Dependencies |
|---------|---------------|----------|----------------------|
| Mobile hamburger menu | 2-4 hours | Critical | None |
| Fix blog.html links | 1 hour | Critical | None |
| Scene landing page (each) | 1-2 hours | High | Demo images (optional) |
| AI-citable FAQ (per product) | 2-3 hours | High | None |
| Tutorial blog article | 1-2 hours | Medium | None |
| Demo images creation | 4-8 hours | Medium | Design resources |
| llms.txt enhancement | 1 hour | Low | None |
| Markdown .md versions | 2-4 hours | Low | Content workflow |

---

## Sources

| Source | Confidence | Type |
|--------|------------|------|
| [llmstxt.org](https://llmstxt.org/) - Official specification by Jeremy Howard | HIGH | Official docs |
| Schema.org FAQPage documentation | HIGH | Official docs |
| Google Search Central SEO Starter Guide | HIGH | Official docs |
| Project CONCERNS.md analysis | HIGH | Project context |
| Existing project implementation review | HIGH | Code review |
| GEO/AI Overview patterns | LOW-MEDIUM | Training knowledge - needs verification |

---

## Gaps to Address

1. **Google AI Overview official guidelines** - Could not fetch official docs (404), need verification
2. **Perplexity/ChatGPT citation patterns** - Emerging practice, no official spec
3. **Competitor SEO content analysis** - Would inform scene page keywords
4. **Backlink acquisition strategy** - Out of scope for 1-2 weeks, but needed for authority

---

*Research completed: 2026-04-03*