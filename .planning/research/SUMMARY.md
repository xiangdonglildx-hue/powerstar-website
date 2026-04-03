# Project Research Summary

**Project:** PowerStar Website SEO/GEO Optimization
**Domain:** Static marketing website SEO and Generative Engine Optimization
**Researched:** 2026-04-03
**Confidence:** HIGH

## Executive Summary

This is a static marketing website for 5 Android mobile apps that requires SEO and GEO (Generative Engine Optimization) enhancement. Experts build such sites with pure static HTML/CSS/JS served via nginx, leveraging structured data, llms.txt for AI discoverability, and programmatic landing pages for search intent coverage. The research confirms the current architecture is optimal—no build tools or frameworks needed.

**Recommended approach:** Enhance existing static architecture with content patterns rather than tooling additions. Priority is fixing critical UX gaps (missing mobile navigation, broken blog links), then scaling content through templates for landing pages and blog articles, and finally optimizing structured data for both traditional search and AI citation.

**Key risks and mitigation:**
- Over-optimization penalties—limit keyword density to 1-2%, validate all structured data with Google Rich Results Test
- Duplicate/thin content—ensure 500+ unique words per landing page, 60%+ unique FAQ questions per page
- Missing mobile navigation—implement hamburger menu as Phase 1 blocking fix before any SEO work

## Key Findings

### Recommended Stack

No major technology additions required. The existing zero-dependency static HTML/CSS/JS architecture is optimal for SEO/GEO. The research recommends preserving this simplicity rather than introducing build tools like 11ty or Hugo—the complexity cost outweighs benefits for 15-20 new pages.

**Core additions:**
- **llms-full.txt** — Comprehensive AI-readable content file following llms.txt v0.2 spec for ChatGPT/Perplexity citation
- **robots.txt update** — Add explicit allow directives for PerplexityBot, GPTBot, ChatGPT-User crawlers
- **FAQ content structure** — Clear Q&A format with 40-60 word answers, Schema.org FAQPage markup
- **Blog article template** — Standardized HTML template for copy-paste content creation (no SSG needed)
- **Landing page CSS extraction** — Move inline styles to `css/landing-page.css` for 1-year caching

### Expected Features

**Must have (table stakes):**
- Meta title/description tags — already done
- Schema.org JSON-LD (Product, FAQPage, Organization) — done, needs BreadcrumbList, HowTo additions
- sitemap.xml — done, needs update for new content
- Mobile-responsive design — **CRITICAL GAP: missing hamburger menu at 768px breakpoint**
- Fast page load — done (nginx optimized), CSS consolidation needed
- Internal linking — **CRITICAL GAP: blog.html href="#" placeholder links**
- Product landing pages — 10 done for AI Photo, need 10-15 each for other 4 products

**Should have (differentiators):**
- **llms.txt file** — Already implemented v0.2 format, enhance with FAQ section
- **Scene landing pages (programmatic SEO)** — Capture specific search intents; 10 done for AI Photo, need 40-60 more
- **AI-citable FAQ content** — Direct answers AI can quote; need structured Q&A format
- **Tutorial blog content** — Authority building; 5 articles exist but minimal HTML, need 15-25 total
- **HowTo/BreadcrumbList schema** — Rich results eligibility

**Defer (v2+):**
- Markdown .md versions of pages — requires workflow change
- Comparison articles — more research needed
- CSS architecture refactor — technical debt, not SEO blocking

### Architecture Approach

Preserve existing nginx/Docker static deployment on Google Cloud Run. All enhancements are file additions and modifications—no infrastructure changes. Integration strategy is "enhancement over addition": improve existing templates, extract inline CSS to cacheable files, establish content patterns for efficient scaling.

**Major components:**
1. **FAQ Content Sections** — AI-referenceable Q&A format with FAQPage Schema.org markup on product pages and landing pages
2. **Blog Article Template** — Standardized HTML with navigation, CSS, footer, Article schema, Open Graph tags
3. **Landing Page Shared CSS** — Extract ~150 lines of inline styles per page to `css/landing-page.css` for caching
4. **Enhanced llms.txt** — Add FAQ section with 10-15 Q&A pairs, blog article summaries, landing page directory
5. **Demo Images Directory** — Replace placeholder.com fallbacks with real before/after images in `images/demo/`

### Critical Pitfalls

1. **Over-optimization triggering search penalties** — Limit keyword density to 1-2%, validate ALL structured data with Rich Results Test before deployment, never repeat anchor text across pages
2. **Content duplication across landing pages** — Each page MUST have 60%+ unique FAQ content; use canonical tags correctly; audit existing pages for duplicates
3. **Structured data errors invalidating rich results** — Test EVERY JSON-LD block with Google Rich Results Test; required fields for MobileApplication (name, operatingSystem, applicationCategory), FAQPage (mainEntity with Question/Answer pairs)
4. **Missing mobile navigation** — Users cannot navigate on mobile; Google mobile-first indexing penalizes; implement hamburger menu as Phase 1 blocking fix
5. **Thin content on programmatic pages** — Minimum 500 words UNIQUE content per landing page; each page must answer different user intent; avoid doorway page classification

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation Fixes
**Rationale:** Critical UX and technical issues must be resolved before content expansion. Mobile navigation missing, blog links broken, placeholder images hurt credibility—these block SEO effectiveness.
**Delivers:** Functional mobile navigation, working blog links, real demo images, CSS caching, validated structured data
**Addresses:** Mobile nav (table stakes), blog href="#" fix (table stakes), demo images (anti-feature), CSS consolidation (performance)
**Avoids:** Mobile SEO penalty, broken UX, poor Core Web Vitals from inline CSS

### Phase 2: Content Infrastructure
**Rationale:** Establish templates and patterns before scaling content. Without templates, each new page requires duplicative effort and risks inconsistency.
**Delivers:** Blog article template, enhanced llms.txt with FAQ section, updated existing blog articles with proper HTML/schema
**Uses:** Content patterns from STACK.md (FAQ structure, blog template)
**Implements:** Blog article template from ARCHITECTURE.md, llms.txt enhancement

### Phase 3: Structured Data Enhancement
**Rationale:** With foundation solid and templates ready, enhance existing pages with Schema.org markup for maximum search visibility.
**Delivers:** FAQPage schema on all landing pages, Article schema on blog, BreadcrumbList schema, enhanced product page FAQs
**Uses:** FAQ content structure from STACK.md
**Implements:** Structured data templates from ARCHITECTURE.md

### Phase 4: Content Expansion
**Rationale:** Now scale content using established templates. Create landing pages for 4 remaining products, expand blog, update sitemap.
**Delivers:** 40-60 new landing pages (10-15 per product), 10-20 new blog articles, updated sitemap.xml
**Uses:** Landing page template pattern, blog article template
**Avoids:** Thin content pitfall by using 500+ word minimum and unique FAQs per page

### Phase Ordering Rationale

- **Foundation first** — Mobile navigation and broken links are blocking issues that reduce SEO effectiveness of all subsequent work
- **Templates before scale** — Creating 40-60 landing pages without templates leads to inconsistency; establish patterns first
- **Validation throughout** — Each phase includes Rich Results Test validation to catch structured data errors early
- **Content expansion last** — Sitemap updates, internal linking, and cross-promotion work best when templates are proven

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 4 (Content Expansion):** Keyword research for landing page targeting—need competitor analysis for specific search terms per product
- **Phase 2 (Content Infrastructure):** GEO citation patterns—llms.txt/AI citation behavior still emerging, may need adjustment based on actual AI responses

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation Fixes):** Well-documented hamburger menu implementation, CSS extraction, Rich Results Test validation
- **Phase 3 (Structured Data):** Schema.org documentation is comprehensive and well-established

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Official llms.txt spec, Perplexity documentation, existing architecture verified |
| Features | HIGH | SEO table stakes well-documented; GEO features based on emerging but clear patterns |
| Architecture | HIGH | Based on direct codebase analysis, nginx configuration verified, Cloud Run compatible |
| Pitfalls | HIGH | Google Search documentation, established SEO best practices, project CONCERNS.md analysis |

**Overall confidence:** HIGH

### Gaps to Address

- **Google AI Overview official guidelines** — Could not fetch official docs (404 error), need verification during implementation; currently using training knowledge
- **Perplexity/ChatGPT citation patterns** — Emerging practice, no official spec; test by asking AI about products after llms.txt deployment
- **Competitor SEO content analysis** — Would inform scene page keyword targeting; out of scope for research but needed for Phase 4 planning
- **Backlink acquisition strategy** — Out of scope for 1-2 week timeline but needed for authority building in v2+

## Sources

### Primary (HIGH confidence)
- llmstxt.org — Official specification by Jeremy Howard (Sept 2024) for AI-readable content files
- Google Search Central SEO Starter Guide — Table stakes features, structured data requirements
- Schema.org documentation — FAQPage, MobileApplication, Article schemas
- Project CONCERNS.md — Direct codebase analysis of gaps and issues
- Project existing codebase — Verified nginx config, Cloud Run deployment, static architecture

### Secondary (MEDIUM confidence)
- PerplexityBot crawler documentation — AI crawler permissions for robots.txt
- Google Rich Results Test — Structured data validation tool
- Programmatic SEO patterns — Community best practices for landing page generation

### Tertiary (LOW confidence)
- Google AI Overview optimization patterns — Training knowledge, no official docs verified
- ChatGPT citation behavior — Emerging practice, needs real-world testing

---
*Research completed: 2026-04-03*
*Ready for roadmap: yes*