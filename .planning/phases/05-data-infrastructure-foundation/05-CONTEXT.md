# Phase 5: Data Infrastructure Foundation

**Goal:** 用户可以访问 Dashboard 骨架页面，验证静态+JSON 架构可行性

**Requirements:** VIS-01, AUTO-05, AUTO-07

---

<decisions>

## Dashboard 定位
- **仅本地开发环境**：不部署到生产环境，只在本地查看 SEO 数据
- **用途**：SEO 监控看板，展示收录状态、关键词排名、流量趋势、AI 引用、异常告警

## 文件位置
- **Dashboard HTML**: `/dashboard.html`（根目录，与 index.html 同级）
- **JSON 数据文件**: `/data/seo-metrics.json`（单一文件包含所有数据）
- **Dashboard CSS**: 复用现有 `/css/style.css` + 新建 `/css/dashboard.css`

## 视觉风格
- **继承现有暗色主题**：复用 CSS 变量（--black, --orange, --cyan, --white）
- **保持与产品页面一致**：相同的配色、字体、组件风格
- **Chart.js CDN**：用于趋势图可视化

## 访问控制
- **仅本地开发**：Dashboard 不包含在生产环境部署中
- **验证方式**：本地运行 `python3 -m http.server 8080` 访问 http://localhost:8080/dashboard.html

## JSON Schema 结构
```json
{
  "lastUpdated": "2026-04-08T10:00:00Z",
  "gsc": {
    "indexedPages": 45,
    "totalSubmitted": 47,
    "topKeywords": [...],
    "clicks": {...},
    "impressions": {...}
  },
  "geo": {
    "chatgpt": {"cited": true, "lastCheck": "..."},
    "perplexity": {"cited": false, "lastCheck": "..."},
    "claude": {"cited": true, "lastCheck": "..."}
  },
  "alerts": [...]
}
```

</decisions>

<specifics>

## 用户原话
- "这个就不对外展示了，只需要我自己看到就行了"
- 选择仅本地开发模式

</specifics>

<deferred>

## 后续 Phase 处理
- Phase 6: GSC API 集成，生成真实 JSON 数据
- Phase 7: Dashboard 渲染逻辑，图表展示
- Phase 8: GEO/AI 引用追踪
- Phase 9: 自动化调度 + 异常告警

</deferred>

<canonical_refs>

## 参考文档
- `.planning/PROJECT.md` — 项目约束（纯静态架构）
- `.planning/REQUIREMENTS.md` — 需求定义（VIS-01, AUTO-05, AUTO-07）
- `.planning/research/SUMMARY.md` — 技术研究（静态+JSON 模式）
- `.planning/codebase/STACK.md` — 现有技术栈（CSS 变量、GSAP CDN）
- `.planning/codebase/ARCHITECTURE.md` — 现有架构（纯静态 HTML）

</canonical_refs>

---

*Context created: 2026-04-08*