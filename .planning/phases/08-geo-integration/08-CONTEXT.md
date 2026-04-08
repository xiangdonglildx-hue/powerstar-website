# Phase 8: GEO Integration

**Goal:** 用户可以追踪 ChatGPT、Perplexity、Claude 对产品内容的引用状态

**Requirements:** GEO-01, GEO-02, GEO-03, GEO-04, GEO-05, GEO-06, VIS-06

---

<decisions>

## AI 系统追踪

**追踪 2 个 AI 系统：**
- **ChatGPT** — CodeX 反代 API（自定义 base URL）
- **Gemini** — Google AI API（官方 SDK）

**不追踪：**
- **Claude** — 无 API key 可用
- **Perplexity** — API 可用性不确定

**ChatGPT 配置（CodeX 反代）：**
- Base URL: `http://192.168.0.213:8080/v1`
- 使用 OpenAI SDK 配置 `baseURL` 参数

## 查询方式

**用户问题模式：** 向 AI 提问用户真实会问的问题

**问题数量：** 15 个扩展问题（每产品 2-3 个变体）

**问题示例：**
| 产品 | 问题 |
|------|------|
| Thermometer | "best thermometer app for Android", "room temperature app", "indoor thermometer app" |
| Microphone | "best microphone app for Android", "voice recorder app" |
| Voice Changer | "voice changer app for Android", "best voice modulator app" |
| Lumiwall | "HD wallpapers for Android", "best wallpaper app" |
| AI Photo | "AI photo filter app", "photo editing app with AI effects", "cartoon photo filter" |

## 引用检测

**方式：** 关键词匹配

**检测关键词：**
- `powerstarapps.com`
- `Power Star Apps`
- `PowerStar`

**逻辑：** AI 响应中包含任一关键词 → 标记为 cited: true

## API 密钥管理

**存储位置：** `scripts/.env` 文件（不入库）

**环境变量：**
```
OPENAI_API_KEY=sk-711449fc0d3a37d3629fa8a7d5766072487fb2331930d2bc7d6ab7247a97e363
OPENAI_BASE_URL=http://192.168.0.213:8080/v1
GOOGLE_AI_API_KEY=...
```

**注意：** ChatGPT 使用 CodeX 反代，需配置自定义 base URL

## 数据存储

**主文件：** `/data/seo-metrics.json` → `geo` 字段

**结构：**
```json
{
  "geo": {
    "chatgpt": {
      "cited": true,
      "lastCheck": "2026-04-08",
      "citations": ["best thermometer app", "room temperature app"],
      "response": "..."
    },
    "gemini": { ... }
  }
}
```

**历史响应：** 存储到 `/data/history/ai-responses/` 目录

## 查询频率

**每月一次：** 每月 1 日运行 GEO 查询脚本

## 从 Prior Phases 继承的约束

- 脚本位于 `/scripts/` 目录
- 使用 TypeScript + tsx 运行
- 环境变量通过 dotenv 加载
- JSON 数据输出到 `/data/`
- Dashboard 已有 GEO Status 展示区域（Phase 5）

</decisions>

<specifics>

## 技术实现

**脚本文件：** `scripts/geo-query.ts`

**依赖：**
- `openai` — ChatGPT API（配置 baseURL）
- `@google/generative-ai` — Gemini API

**主要函数：**
```typescript
async function queryAI(
  platform: 'chatgpt' | 'gemini',
  question: string
): Promise<{ response: string; cited: boolean }>

async function detectCitation(response: string): Promise<boolean>
```

**ChatGPT 配置示例：**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL, // CodeX 反代
});
```

## 问题列表（15 个）

```typescript
const QUESTIONS = [
  // Thermometer (3)
  "best thermometer app for Android",
  "room temperature app for phone",
  "indoor thermometer app",
  // Microphone (2)
  "best microphone app for Android",
  "voice recorder app for phone",
  // Voice Changer (2)
  "voice changer app for Android",
  "best voice modulator app",
  // Lumiwall (3)
  "HD wallpapers for Android",
  "best wallpaper app for phone",
  "live wallpaper app",
  // AI Photo (5)
  "AI photo filter app",
  "photo editing app with AI effects",
  "cartoon photo filter app",
  "anime photo filter",
  "vintage photo editor app"
];
```

</specifics>

<deferred>

## 后续优化

- **响应差异分析：** 比较 3 个 AI 对同一问题的响应差异
- **趋势追踪：** 分析引用率随时间的变化
- **竞争对手对比：** 查询 AI 是否引用竞品

</deferred>

<canonical_refs>

## 参考文档
- `.planning/PROJECT.md` — 项目约束
- `.planning/REQUIREMENTS.md` — 需求定义（GEO-01~06）
- `.planning/research/STACK.md` — 技术栈研究（Vercel AI SDK）
- `.planning/research/SUMMARY.md` — 研究总结
- `.planning/phases/05-data-infrastructure-foundation/05-CONTEXT.md` — Dashboard 结构
- `dashboard.html` — 现有 GEO Status 展示区域
- `data/seo-metrics.json` — 现有 geo 字段结构

</canonical_refs>

---

*Context created: 2026-04-08*