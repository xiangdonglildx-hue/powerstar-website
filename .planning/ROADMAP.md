# Roadmap: PowerStar Website

## Milestones

- ✅ **v1.0 SEO/GEO 优化迭代** — Phases 1-4 (shipped 2026-04-07) — [Archive](milestones/v1.0-ROADMAP.md)
- 🚧 **v1.1 SEO 监控体系** — Phases 5-9 (in progress)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

### v1.0 (Completed)

<details>
<summary>✅ v1.0 SEO/GEO 优化迭代 (Phases 1-4) - SHIPPED 2026-04-07</summary>

#### Phase 1: Foundation Fixes
**Goal**: 修复基础设施问题，建立 SEO 友好的技术基础
**Status**: Complete

#### Phase 2: Content Infrastructure
**Goal**: 建立 Blog 基础设施和 AI crawler 支持
**Status**: Complete

#### Phase 3: Structured Data Enhancement
**Goal**: 完善 Schema.org 结构化数据覆盖
**Status**: Complete

#### Phase 4: Content Expansion
**Goal**: 扩展 20 个新落地页提升 SEO 覆盖
**Status**: Complete

</details>

### v1.1 SEO 监控体系 (In Progress)

**Milestone Goal:** 建立 SEO/GEO 监控闭环，追踪收录、排名、AI 引用，自动告警异常变化

- [x] **Phase 5: Data Infrastructure Foundation** - 建立 JSON 数据结构和 Dashboard 骨架 (completed 2026-04-08)
- [x] **Phase 6: GSC Integration** - 集成 Google Search Console API，收集真实 SEO 数据 (completed 2026-04-08)
- [ ] **Phase 7: Dashboard Completion** - 完成 Dashboard 可视化渲染逻辑
- [ ] **Phase 8: GEO Integration** - 集成 AI 引用追踪系统
- [ ] **Phase 9: Automation + Alert System** - 实现自动化调度和异常告警

## Phase Details

### Phase 5: Data Infrastructure Foundation
**Goal**: 用户可以访问 Dashboard 骨架页面，验证静态+JSON 架架可行性
**Depends on**: Phase 4 (v1.0)
**Requirements**: VIS-01, AUTO-05, AUTO-07
**Success Criteria** (what must be TRUE):
  1. User can open dashboard.html in browser and see structured page layout
  2. Dashboard loads and displays data from /data/seo-metrics.json via fetch()
  3. JSON template file exists with correct schema for GSC, GEO, and alerts sections
  4. /data/ directory exists with proper structure for historical data files
**Plans**: 1 plan
**UI hint**: yes

Plans:
- [x] 05-01-PLAN.md — Create Dashboard skeleton and JSON data infrastructure

### Phase 6: GSC Integration
**Goal**: 真实的 Google Search Console SEO 指标被收集并存储到 JSON
**Depends on**: Phase 5
**Requirements**: GSC-01, GSC-02, GSC-03, GSC-04, GSC-05, GSC-06, AUTO-06
**Success Criteria** (what must be TRUE):
  1. Service account is configured with access to powerstarapps.com GSC property
  2. gsc-collector.ts script successfully fetches indexed pages count
  3. gsc-collector.ts script successfully fetches top 50 keywords with metrics (impressions, clicks, CTR, position)
  4. JSON file is updated with real GSC data after script execution
  5. Historical JSON files are retained in /data/history/ for 90 days
**Plans**: 2 plans

Plans:
- [x] 06-01-PLAN.md — Create scripts infrastructure and Service Account setup documentation
- [x] 06-02-PLAN.md — Implement GSC collector script with API integration and JSON output

### Phase 7: Dashboard Completion
**Goal**: 用户可以在 Dashboard 上可视化查看 SEO 指标、图表和表格
**Depends on**: Phase 6
**Requirements**: VIS-02, VIS-03, VIS-04, VIS-05, VIS-07
**Success Criteria** (what must be TRUE):
  1. Dashboard displays summary cards with indexed pages count, total clicks, total impressions
  2. Dashboard displays top 50 keywords table with query, impressions, clicks, CTR, position columns
  3. Dashboard displays 30-day trend charts for clicks and impressions using Chart.js
  4. Dashboard displays indexing status comparing submitted URLs vs indexed URLs with unindexed list
  5. Dashboard displays per-product metrics breakdown for all 5 PowerStar products
**Plans**: 1 plan
**UI hint**: yes

Plans:
- [ ] 07-01-PLAN.md — Add 30-day trend chart and unindexed URLs display to Dashboard

**Note**: VIS-02, VIS-03 already implemented in Phase 5. VIS-07 (per-product metrics) deferred per CONTEXT.md decision due to current zero traffic state.

### Phase 8: GEO Integration
**Goal**: 用户可以追踪 ChatGPT、Gemini 对产品内容的引用状态
**Depends on**: Phase 7
**Requirements**: GEO-01, GEO-04, GEO-05, GEO-06, VIS-06
**Success Criteria** (what must be TRUE):
  1. geo-query.ts script successfully queries ChatGPT (via CodeX proxy) and Gemini with 15 product questions
  2. Script detects domain/brand mentions in AI responses using keyword matching
  3. AI responses are stored for historical comparison in /data/history/ai-responses/
  4. Dashboard displays citation status per AI system (cited/not cited, last check date, citations list)
  5. Dashboard GEO section shows ChatGPT and Gemini cards (per user decision to track these 2 only)
**Plans**: 1 plan

Plans:
- [x] 08-01-PLAN.md — Create GEO query script and update dashboard for ChatGPT/Gemini citation tracking

**Note**: GEO-02 (Perplexity) and GEO-03 (Claude) are NOT implemented per user decision — user opted to track Gemini instead of Perplexity/Claude.

### Phase 9: Automation + Alert System
**Goal**: 用户通过自动化调度接收 SEO 异常告警
**Depends on**: Phase 8
**Requirements**: ALERT-01, ALERT-02, ALERT-03, ALERT-04, ALERT-05, ALERT-06, AUTO-01, AUTO-02, AUTO-03, AUTO-04
**Success Criteria** (what must be TRUE):
  1. GitHub Actions workflow runs monitoring scripts on schedule (daily at 6 AM UTC, weekly on Monday, monthly on 1st)
  2. Anomaly detector identifies traffic drops >30%, indexed pages drops >20%, keyword position drops >5 positions
  3. Dashboard displays red banner when anomalies are detected
  4. Dashboard highlights affected metric rows in red for visibility
  5. Alert thresholds are documented with note that tuning requires 2-4 weeks baseline data
**Plans**: 2 plans
**UI hint**: yes

Plans:
- [x] 09-01-PLAN.md — Create GitHub Actions workflow, anomaly detection script, and cleanup automation
- [ ] 09-02-PLAN.md — Implement Dashboard alert banner and metric highlighting

## Progress

**Execution Order:**
Phases execute in numeric order: 5 → 6 → 7 → 8 → 9

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 5. Data Infrastructure | v1.1 | 1/1 | Complete   | 2026-04-08 |
| 6. GSC Integration | v1.1 | 2/2 | Complete   | 2026-04-08 |
| 7. Dashboard Completion | v1.1 | 0/1 | Planned    | - |
| 8. GEO Integration | v1.1 | 0/1 | Planned    | - |
| 9. Automation + Alert | v1.1 | 0/2 | Planned    | - |

---

*Last updated: 2026-04-08*