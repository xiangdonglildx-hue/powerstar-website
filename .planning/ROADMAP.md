# Roadmap: PowerStar Website v1.0 SEO/GEO 优化迭代

**Milestone:** v1.0 SEO/GEO 优化迭代
**Created:** 2026-04-03
**Granularity:** Standard

---

## Core Value

提升产品在搜索引擎中的可见度，通过 SEO 优化吸引目标用户访问产品页面并转化为下载。

---

## Phases

- [ ] **Phase 1: Foundation Fixes** — 修复关键 UX 和技术问题，确保所有后续 SEO 工作有效
- [ ] **Phase 2: Content Infrastructure** — 建立可复用模板和内容模式，为扩展提供基础
- [ ] **Phase 3: Structured Data Enhancement** — 为所有页面添加 Schema.org markup，最大化搜索可见度
- [ ] **Phase 4: Content Expansion** — 使用模板规模化创建内容，覆盖更多搜索意图

---

## Phase Details

### Phase 1: Foundation Fixes

**Goal:** 用户可在任何设备上完整访问和使用网站，所有基础功能正常工作

**Depends on:** Nothing (first phase)

**Requirements:** BLOCK-01, BLOCK-02, BLOCK-03, BLOCK-04, BLOCK-05

**Success Criteria** (what must be TRUE):
1. User can navigate all pages on mobile devices (below 768px) via hamburger menu
2. Blog cards link to actual blog articles (no broken href="#" links)
3. Scene landing pages show real before/after demo images (no placeholder.com fallbacks)
4. Scene landing page CSS is cacheable for 1 year (extracted from inline to external file)
5. All existing Schema.org JSON-LD passes Google Rich Results Test validation

**Plans:** 4/6 plans executed

Plans:
- [x] 01-PLAN.md — Mobile Navigation CSS/JS Infrastructure (Wave 1) ✓ 2026-04-03
- [ ] 02-PLAN.md — Blog Links Fix (Wave 1)
- [ ] 03-PLAN.md — Landing Page CSS Extraction (Wave 1)
- [ ] 04-PLAN.md — Demo Images Creation (Wave 1)
- [ ] 05-PLAN.md — Mobile Navigation HTML Updates (Wave 2)
- [ ] 06-PLAN.md — Schema.org Validation (Wave 3)

---

### Phase 2: Content Infrastructure

**Goal:** 内容创建流程标准化，新页面可高效产出且结构一致

**Depends on:** Phase 1

**Requirements:** INFRA-01, INFRA-02, INFRA-03, INFRA-04

**Success Criteria** (what must be TRUE):
1. New blog articles can be created by copying template and filling content (nav, footer, Article schema, OG tags included)
2. AI crawlers can discover FAQ content, product details, and blog summaries via enhanced llms.txt
3. Existing 5 blog articles have full HTML structure with Article schema and proper metadata
4. FAQ content follows AI-citable format (40-60 word answers, clear Q&A structure)

**Plans:** TBD

---

### Phase 3: Structured Data Enhancement

**Goal:** 所有页面具备完整的 Schema.org 结构化数据，最大化富媒体搜索结果展示

**Depends on:** Phase 2

**Requirements:** SCHEMA-01, SCHEMA-02, SCHEMA-03, SCHEMA-04, SCHEMA-05

**Success Criteria** (what must be TRUE):
1. All scene landing pages display FAQ rich results in Google search (FAQPage schema validated)
2. All blog articles display article rich results in Google search (Article schema validated)
3. All pages show breadcrumb navigation in Google search results (BreadcrumbList schema validated)
4. Product pages have expanded FAQ sections with FAQPage schema
5. All new schema markup passes Google Rich Results Test without errors

**Plans:** TBD

---

### Phase 4: Content Expansion

**Goal:** 全产品线覆盖更多搜索意图，AI 平台可发现和引用网站内容

**Depends on:** Phase 3

**Requirements:** CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04, CONTENT-05, CONTENT-06, CONTENT-07, CONTENT-08

**Success Criteria** (what must be TRUE):
1. Each of the 4 remaining products has 10-15 scene landing pages targeting specific search intents
2. Each product has 3-5 tutorial/comparison blog articles establishing topical authority
3. sitemap.xml includes all new pages for search engine discovery
4. AI crawlers (PerplexityBot, GPTBot, ChatGPT-User) are explicitly allowed via robots.txt
5. llms-full.txt provides comprehensive AI-readable content for ChatGPT/Perplexity citation

**Plans:** TBD

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation Fixes | 4/6 | In Progress|  |
| 2. Content Infrastructure | 0/4 | Not started | - |
| 3. Structured Data Enhancement | 0/5 | Not started | - |
| 4. Content Expansion | 0/8 | Not started | - |

---

## Coverage

All v1 requirements mapped to phases:

| Category | Requirements | Phase |
|----------|--------------|-------|
| BLOCK | BLOCK-01, BLOCK-02, BLOCK-03, BLOCK-04, BLOCK-05 | Phase 1 |
| INFRA | INFRA-01, INFRA-02, INFRA-03, INFRA-04 | Phase 2 |
| SCHEMA | SCHEMA-01, SCHEMA-02, SCHEMA-03, SCHEMA-04, SCHEMA-05 | Phase 3 |
| CONTENT | CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04, CONTENT-05, CONTENT-06, CONTENT-07, CONTENT-08 | Phase 4 |

**Total:** 22 requirements, 22 mapped, 0 orphaned

---

*Roadmap created: 2026-04-03*
*Last updated: 2026-04-03 - Plan 01 completed (mobile nav CSS/JS infrastructure)*