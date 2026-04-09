# Phase 6: GSC Integration

**Goal:** 真实的 Google Search Console SEO 指标被收集并存储到 JSON

**Requirements:** GSC-01, GSC-02, GSC-03, GSC-04, GSC-05, GSC-06, AUTO-06

---

<decisions>

## GSC API 认证
- **方式**: Service Account（服务账号）
- **流程**:
  1. 在 Google Cloud Console 创建 Service Account
  2. 下载 JSON key 文件（安全存储，不入库）
  3. 将 Service Account 邮箱添加到 GSC property 用户
  4. 使用 `googleapis` npm 包进行认证

## 脚本位置
- **目录**: `/scripts/`（项目根目录下）
- **主要文件**: `gsc-collector.ts`
- **依赖管理**: `package.json` 在 scripts 目录下
- **不入库**: `node_modules/` 和 `.env`（包含 API key）

## 数据更新策略
- **主文件**: `/data/seo-metrics.json`（每次运行覆盖）
- **历史快照**: `/data/history/gsc-YYYY-MM-DD.json`（每日保留）
- **保留期限**: 90 天
- **清理脚本**: 自动删除 90 天前的历史文件

## 数据采集频率
- **每日检查**: 收录数、Top 10 关键词快照、异常标记
- **每周完整**: Top 50 关键词、页面级指标、趋势分析

## 从 Phase 5 继承的约束
- JSON Schema 已定义（GSC + GEO + Alerts）
- Dashboard 仅本地开发
- 历史数据目录已创建：`/data/history/`

</decisions>

<specifics>

## 技术栈
- **Node.js**: 运行环境
- **TypeScript**: 脚本语言
- **googleapis**: Google API 客户端库
- **dotenv**: 环境变量管理

## GSC API 端点
- `searchanalytics.query` — 获取搜索指标（impressions, clicks, CTR, position）
- `urlinspections.index.inspect` — 检查 URL 收录状态
- `sitemaps.list` — 获取 sitemap 信息

</specifics>

<deferred>

## 后续 Phase 处理
- Phase 7: Dashboard 渲染逻辑（读取 GSC 数据展示）
- Phase 8: GEO/AI 引用追踪
- Phase 9: GitHub Actions 自动化调度

</deferred>

<canonical_refs>

## 参考文档
- `.planning/PROJECT.md` — 项目约束
- `.planning/REQUIREMENTS.md` — 需求定义（GSC-01~06, AUTO-06）
- `.planning/research/STACK.md` — 技术栈研究（googleapis 库）
- `.planning/research/SUMMARY.md` — 研究总结
- `.planning/phases/05-data-infrastructure-foundation/05-CONTEXT.md` — Phase 5 决策

</canonical_refs>

---

*Context created: 2026-04-08*