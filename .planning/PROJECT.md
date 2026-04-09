# PowerStar Website

## What This Is

PowerStar 是一个静态营销展示网站，推广 5 个移动应用产品：Thermometer（体温计）、Microphone（麦克风）、Voice Changer（变声器）、Lumiwall（动态壁纸）、AI Photo（AI 照片滤镜）。网站采用纯 HTML/CSS/JS 架构，通过 GSAP 动画增强交互体验，部署在 Google Cloud Run。

## Core Value

提升产品在搜索引擎中的可见度，通过 SEO 优化吸引目标用户访问产品页面并转化为下载。

## Current Milestone: v1.1 SEO 监控体系

**Goal:** 建立 SEO/GEO 监控闭环，追踪收录、排名、AI 引用，自动告警异常变化。

**Target features:**
- Google Search Console API 集成（收录、关键词、CTR、Impressions）
- GEO/AI 引用追踪（主动查询 ChatGPT/Perplexity + 被动 llms.txt 标记）
- 监控 Dashboard（静态 HTML + JSON 数据文件）
- 高频监控脚本（每日检查 + 每周完整报告）
- 异常告警（流量下降 >30%、收录减少 >20%、排名下跌 → Dashboard 显示）

**Key context:**
- v1.0 已完成 SEO 基础优化，现在需要量化追踪效果
- 纯静态架构 → 监控脚本生成 JSON，Dashboard 读取展示
- Google Search Console API 需要认证配置

## Requirements

### Validated

<!-- 从现有代码推断的已实现功能 -->

- ✓ Homepage 展示 5 个产品卡片，含快速特性介绍和下载链接
- ✓ 每个产品独立页面（thermometer, microphone, voice-changer, lumiwall, ai-photo）
- ✓ AI Photo 产品 10 个场景落地页（anime-style, cartoon-style, vintage-90s-style 等）
- ✓ Schema.org JSON-LD 结构化数据（Product, FAQPage, Organization）
- ✓ Open Graph 和 Twitter Card 元标签
- ✓ sitemap.xml 和 robots.txt SEO 文件
- ✓ Google Analytics 4 (G-HRVN6H8K26) 追踪
- ✓ 响应式设计（桌面优先，移动端适配部分）
- ✓ GSAP ScrollTrigger 滚动动画
- ✓ Docker/nginx 容器化部署

### Active

<!-- 当前里程碑目标 - v1.1 SEO 监控体系 -->

- [ ] Google Search Console API 集成（收录、关键词、CTR）
- [ ] GEO/AI 引用追踪系统
- [ ] 监控 Dashboard 页面
- [ ] 高频监控脚本（每日检查 + 每周报告）
- [ ] 异常告警机制

### Out of Scope

<!-- 明确排除 -->

- 用户登录/注册系统 — 纯静态展示站
- 后端 API 服务 — 无服务器端处理
- 电子商务功能 — 不直接销售产品
- 实时聊天功能 — 高复杂度非核心价值

## Context

**技术环境:**
- 纯静态 HTML/CSS/JS，无构建工具
- GSAP 3.12.5 CDN 加载
- Google Fonts (Bebas Neue, Work Sans)
- nginx:alpine Docker 容器
- Google Cloud Run (us-west1)

**SEO 现状:**
- 已有 Schema.org 结构化数据
- 已有 10 个 AI Photo 场景落地页（程序化 SEO）
- 已有 llms.txt 供 AI/LLM 读取
- 缺少实际 demo 图片（images/demo/ 目录不存在）
- 缺少移动端导航菜单
- CSS 冗余（4 个文件约 3347 行）

**已知问题（来自 codebase 分析）:**
- Missing demo images: 所有场景落地页的 before/after 图片 fallback 到 placeholder.com
- CSS duplication: 多个文件重复定义样式
- Inline styles: 场景落地页含大量内联 CSS（不可缓存）
- Blog placeholder links: blog.html 卡片链接到 `href="#"`
- Mobile navigation: 移动端隐藏导航无替代方案
- Hardcoded year: 版权年份硬编码需每年手动更新

## Constraints

- **Tech stack**: 纯静态 HTML/CSS/JS — 保持简单，无构建工具依赖
- **Hosting**: Google Cloud Run — 必须兼容容器化部署
- **SEO**: Schema.org + meta tags — 需符合搜索引擎最佳实践
- **Performance**: 静态资源缓存 — nginx 配置已优化

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 纯静态架构 | 降低维护成本，无需后端 | ✓ 简单可靠 |
| GSAP CDN 加载 | 快速集成动画库 | ⚠️ CDN 依赖风险 |
| 场景落地页程序化 SEO | 覆盖更多搜索意图 | ✓ 流量入口扩展 |
| Docker/nginx 部署 | 标准化容器交付 | ✓ CI/CD 友好 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-08 after milestone v1.1 definition*