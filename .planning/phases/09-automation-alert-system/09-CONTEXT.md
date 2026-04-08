# Phase 9: Automation + Alert System

**Goal:** 用户通过自动化调度接收 SEO 异常告警

**Requirements:** ALERT-01, ALERT-02, ALERT-03, ALERT-04, ALERT-05, ALERT-06, AUTO-01, AUTO-02, AUTO-03, AUTO-04, AUTO-05, AUTO-06, AUTO-07

---

<decisions>

## 调度平台

**选择：GitHub Actions**

**原因：**
- 项目已有 GitHub remote (xiangdonglildx-hue/powerstar-website)
- 无需额外服务器
- 支持定时触发 (cron)
- 免费额度足够

**工作流文件位置：** `.github/workflows/`

## 调度频率

| 脚本 | 频率 | Cron | 目的 |
|------|------|------|------|
| gsc-collector.ts | 每日 6:00 UTC | `0 6 * * *` | 快速检查 |
| gsc-collector.ts (full) | 每周一 8:00 UTC | `0 8 * * 1` | 完整数据 |
| geo-query.ts | 每月 1 日 6:00 UTC | `0 6 1 * *` | GEO 引用检查 |

## 异常检测阈值

| 指标 | 阈值 | 优先级 | 说明 |
|------|------|--------|------|
| 流量下降 | >30% vs 前一天 | P1 | 点击数对比 |
| 收录下降 | >20% vs sitemap | P1 | 页面收录数 |
| 排名下降 | >5 位 | P2 | Top 关键词位置 |

**配置方式：** 阈值写入 `scripts/lib/alert-config.ts`，可调整

## 告警展示

**Dashboard Banner：**
- 红色背景横幅，显示异常摘要
- 位于 Dashboard 顶部（标题下方）
- 可点击查看详情

**指标高亮：**
- 异常指标行红色背景
- 显示变化幅度（如 "↓35%"）

**通知方式：** 仅 Dashboard 展示（不做邮件/Slack，遵循 REQUIREMENTS）

## 历史数据管理

**保留策略：** 90 天

**清理方式：**
- `scripts/cleanup-history.ts` 脚本
- 在 GitHub Actions 每日任务后执行
- 删除超过 90 天的历史文件

**数据文件位置：**
- `/data/history/gsc/` - GSC 历史数据
- `/data/history/ai-responses/` - GEO 历史数据

## 从 Prior Phases 继承的约束

- 脚本位于 `/scripts/` 目录
- 使用 TypeScript + tsx 运行
- 环境变量通过 dotenv 加载（`scripts/.env`）
- JSON 数据输出到 `/data/`
- Dashboard 仅本地开发（不部署生产）
- Service Account 认证（GSC API）

</decisions>

<specifics>

## 技术实现

### GitHub Actions 工作流

**文件：** `.github/workflows/seo-monitor.yml`

```yaml
name: SEO Monitor

on:
  schedule:
    - cron: '0 6 * * *'      # Daily at 6 AM UTC
    - cron: '0 8 * * 1'      # Weekly Monday 8 AM UTC
    - cron: '0 6 1 * *'      # Monthly 1st at 6 AM UTC
  workflow_dispatch:          # Manual trigger

jobs:
  daily-check:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 6 * * *'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd scripts && npm ci
      - run: cd scripts && npm run gsc
      - run: cd scripts && npm run detect-anomalies
      - run: cd scripts && npm run cleanup

  weekly-full:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 8 * * 1'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd scripts && npm ci
      - run: cd scripts && npm run gsc -- --full

  monthly-geo:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 6 1 * *'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd scripts && npm ci
      - run: cd scripts && npm run geo
```

### 异常检测脚本

**文件：** `scripts/detect-anomalies.ts`

**主要函数：**
```typescript
interface Anomaly {
  type: 'traffic_drop' | 'indexing_drop' | 'position_drop';
  severity: 'P1' | 'P2';
  metric: string;
  change: number;
  threshold: number;
  details: string;
}

async function detectAnomalies(current: SEOMetrics, previous: SEOMetrics): Promise<Anomaly[]>
```

### Dashboard 告警组件

**位置：** `dashboard.html` 顶部

```html
<!-- Alert Banner -->
<div id="alertBanner" class="alert-banner hidden">
    <div class="alert-icon">⚠️</div>
    <div class="alert-content">
        <span id="alertCount">0</span> anomalies detected
    </div>
    <button class="alert-dismiss" onclick="dismissAlert()">×</button>
</div>
```

**CSS：**
```css
.alert-banner {
    background: linear-gradient(90deg, #ff4444, #cc0000);
    color: white;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: pulse 2s infinite;
}
```

### NPM Scripts (package.json)

```json
{
  "scripts": {
    "gsc": "tsx gsc-collector.ts",
    "geo": "tsx geo-query.ts",
    "detect-anomalies": "tsx detect-anomalies.ts",
    "cleanup": "tsx cleanup-history.ts"
  }
}
```

</specifics>

<deferred>

## 延后到后续 Milestone

- **阈值自动调优** — 需 2-4 周基线数据
- **邮件/Slack 通知** — 外部服务集成
- **告警历史记录** — 异常事件追踪
- **多维度异常检测** — 复合指标分析

</deferred>

<canonical_refs>

## 参考文档

- `.planning/PROJECT.md` — 项目约束
- `.planning/REQUIREMENTS.md` — 需求定义（ALERT-01~06, AUTO-01~07）
- `.planning/STATE.md` — 项目状态
- `scripts/gsc-collector.ts` — GSC 数据收集器
- `scripts/geo-query.ts` — GEO 查询脚本
- `scripts/.env` — API 配置
- `data/seo-metrics.json` — 数据存储
- `dashboard.html` — 可视化

</canonical_refs>

---

*Context created: 2026-04-08*