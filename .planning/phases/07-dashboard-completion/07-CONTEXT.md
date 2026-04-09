# Phase 7: Dashboard Completion

**Goal:** 用户可以在 Dashboard 上可视化查看 SEO 指标、图表和表格

**Requirements:** VIS-02, VIS-03, VIS-04, VIS-05, VIS-07

---

<decisions>

## 已完成功能 (Phase 5)

Dashboard 基础架构已在 Phase 5 实现：
- **Summary Cards**: 收录数、点击、展示、GEO 引用计数
- **Top Keywords 表格**: 展示 Top 50 关键词及指标
- **GEO Status 卡片**: ChatGPT/Perplexity/Claude 引用状态
- **Alerts 区域**: 异常告警显示
- **JSON fetch()**: 从 `/data/seo-metrics.json` 加载数据

## Phase 7 核心任务

### 30天趋势图 (VIS-04)
- **图表类型**: 三线折线图
- **数据线**:
  1. 点击量 (Clicks) — 橙色
  2. 展示量 (Impressions) — 青色
  3. 平均排名 (Position) — 灰色/白色
- **X轴**: 日期（最近 30 天）
- **库**: Chart.js (已在 HTML 中 CDN 加载)

### 产品级分析 (VIS-07) — 延后

**决策**: 当前网站无流量，产品级分析延后执行

**原因**: 用户原话 "当前是处于什么流量都没有的状态，先把流量做起来再考虑细分的事情吧"

**后续**: 当流量增长后再添加按产品（Thermometer, Microphone, Voice Changer, Lumiwall, AI Photo）的独立指标展示

## 从 Prior Phases 继承的约束

- **Dashboard 仅本地开发** (Phase 5)
- **JSON 数据位置**: `/data/seo-metrics.json` (Phase 5)
- **CSS 主题继承**: 复用 `--black`, `--orange`, `--cyan` 变量 (Phase 5)
- **数据收集**: GSC Collector 已在 Phase 6 实现

## 数据结构

当前 `seo-metrics.json` 已有的趋势数据：
```json
{
  "gsc": {
    "clicks": {
      "last7Days": 5,
      "last30Days": 5,
      "trend": [0, 0, 1, 0, 3, 0, 1]
    },
    "impressions": {
      "last7Days": 120,
      "last30Days": 124,
      "trend": [0, 4, 8, 12, 21, 19, 60]
    },
    "avgPosition": 11
  }
}
```

**需扩展**: GSC Collector 需要收集 30 天逐日数据（而非仅 7 天）

</decisions>

<specifics>

## 实现要点

1. **扩展数据收集** (GSC Collector)
   - 修改 `scripts/gsc-collector.ts`
   - 获取 30 天逐日的 clicks/impressions/position 数据
   - 更新 JSON schema 添加 `dailyTrend[]` 数组

2. **添加 Chart.js 渲染**
   - 在 `dashboard.html` 中添加 `<canvas>` 元素
   - 实现 `renderTrendChart()` 函数
   - 配置 Chart.js 选项（双 Y 轴：点击/展示 vs 排名）

3. **样式调整**
   - 图表容器使用 `css/dashboard.css` 已定义的变量
   - 响应式设计（移动端适配）

</specifics>

<deferred>

## 延后到后续 Milestone

- **VIS-07 产品级分析**: 按 5 个产品分别展示 SEO 指标
- **实时刷新**: 当前仅手动运行 collector 后刷新页面
- **数据导出**: CSV/Excel 导出功能

</deferred>

<canonical_refs>

## 参考文档
- `.planning/PROJECT.md` — 项目约束
- `.planning/REQUIREMENTS.md` — 需求定义（VIS-02~07）
- `.planning/phases/05-data-infrastructure-foundation/05-CONTEXT.md` — Phase 5 决策
- `.planning/phases/06-gsc-integration/06-CONTEXT.md` — Phase 6 决策
- `dashboard.html` — 现有 Dashboard 结构
- `css/dashboard.css` — 现有 Dashboard 样式
- `data/seo-metrics.json` — 数据结构
- `scripts/gsc-collector.ts` — GSC 数据收集器

</canonical_refs>

---

*Context created: 2026-04-08*