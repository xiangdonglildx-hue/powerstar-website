# Uncommitted Changes Archive

**Archive Date:** 2026-05-11
**Branch:** chore/backlink-docs-cleanup (已合并到 main)
**Context:** 工作区存在创建分支之前的未提交改动，需分类归档后决定处理方式

---

## Classification by Project Line

### 1. Website Line - 过时 SEO 草稿 ⚠️ 可丢弃

| 文件 | 改动量 | 状态 | 建议 |
|------|--------|------|------|
| products/thermometer.html | +227/-227 | 旧版 SEO 草稿 | **丢弃** — origin/main 已有更新版本 |
| products/microphone.html | 改动较小 | 旧版 SEO 草稿 | **丢弃** |
| products/voice-changer.html | 改动较小 | 旧版 SEO 草稿 | **丢弃** |
| products/lumiwall.html | 改动较小 | 旧版 SEO 草稿 | **丢弃** |
| products/ai-photo.html | 改动较小 | 旧版 SEO 草稿 | **丢弃** |
| products/*-landing/*.html (14 files) | ~1000行 | 旧版 landing 草稿 | **丢弃** — 已通过 PR #2-6 合并更新版本 |
| blog/how-to-set-4k-wallpaper-android.html | 小改动 | 不明确 | **丢弃** |

**判断依据：** 这些产品页改动是早期 SEO 改动草稿，title/description 写法与 origin/main 上已合并的 SEO 集群版本不同。origin/main 版本更清晰、角色更明确。

---

### 2. Website Line - UI 优化改动 🔶 需评估

| 文件 | 改动量 | 内容 | 建议 |
|------|--------|------|------|
| index.html | +57/-1 | 首页 hero proof points、products spotlight bar | **评估后决定** — UI 改动有意义但未记录意图 |
| css/enhanced.css | +168/-168 | 样式优化 | **评估后决定** |
| css/hero-new.css | +95/-95 | Hero 区域样式增强 | **评估后决定** |
| css/product-enhanced.css | +34/-34 | 产品区域样式增强 | **评估后决定** |
| css/style.css | +1/-1 | 小改动 | **丢弃** |
| js/gsap-animations-enhanced.js | +142/-142 | 动画优化 | **评估后决定** |

**内容描述：**
- `index.html`: 添加了 hero-proof-points（"5 focused Android tools" 等）和 products-spotlight-bar
- CSS: 样式精简和增强
- JS: 动画效果优化

**判断依据：** 这些是有效的 UI 优化改动，但缺乏意图文档。需要判断是否与已合并的 SEO 集群改动兼容。

---

### 3. Remotion-sidecar Line - OG 图片生成 🔶 需评估

| 文件 | 改动量 | 内容 | 建议 |
|------|--------|------|------|
| remotion/package.json | +3/-3 | 依赖更新 | **评估后决定** |
| remotion/src/Root.tsx | +30/-30 | Root 组件改动 | **评估后决定** |
| remotion/src/compositions/AIPhotoOg.tsx | +31/-243 | 大幅删减 | **评估后决定** |
| remotion/src/data/ai-photo.ts | +7/-7 | 数据改动 | **评估后决定** |

**判断依据：** Remotion 项目改动，可能是 OG 图片生成工作的一部分。需要判断是否与当前 OG 需求一致。

---

### 4. Remotion-sidecar Line - 新 OG 组件/资源 ✅ 可能保留

| 文件 | 类型 | 建议 |
|------|------|------|
| remotion/public/voice-changer/icon-voice-changer.png | OG 图片资源 | **保留** — Voice Changer OG 需要 |
| remotion/public/voice-changer/mockup-voice-changer-1.png | OG 图片资源 | **保留** |
| remotion/src/compositions/ProductOg.tsx | 新组件 | **评估** — 通用产品 OG 组件 |
| remotion/src/compositions/VoiceChangerOg.tsx | 新组件 | **保留** — Voice Changer OG 组件 |
| remotion/src/data/product-og.ts | 新数据文件 | **评估** |
| remotion/src/data/voice-changer.ts | 新数据文件 | **保留** |

---

### 5. SEO-data Line ✅ 保留

| 文件 | 改动量 | 内容 | 建议 |
|------|--------|------|------|
| data/anomalies.json | +19/-19 | 异常检测数据更新 | **保留** |
| data/seo-metrics.json | +273/-152 | SEO 监控数据更新 | **保留** |
| data/history/ai-responses/geo-2026-04-27.json | 新文件 | GEO 历史数据 | **保留** |
| data/history/gsc-2026-04-23.json | 新文件 | GSC 历史数据 | **保留** |
| data/history/gsc-2026-04-27.json | 新文件 | GSC 历史数据 | **保留** |

---

### 6. Automation/测试文件 🔶 需评估

| 文件 | 类型 | 建议 |
|------|------|------|
| remotion-sidecar.test.mjs | 测试文件 | **评估** — Remotion sidecar 测试？ |
| visible-polish.test.mjs | 测试文件 | **评估** — 不明确用途 |

---

### 7. Worktrees 目录 ⚠️ 应清理

| 文件 | 类型 | 建议 |
|------|------|------|
| .claude/worktrees/ | 目录 | **删除** — 旧的 agent worktrees 缓存，不再使用 |

---

### 8. Planning-docs Line - 工作板更新 🔶 需评估

| 文件 | 改动量 | 建议 |
|------|--------|------|
| .planning/CURRENT-WORKBOARD.md | 小改动 | **评估** — 可能是当前任务记录更新 |

---

## Summary by Project Line

| Project Line | 文件数 | 建议 |
|--------------|--------|------|
| website (过时 SEO 草稿) | 15 | **丢弃** |
| website (UI 优化) | 6 | **评估后决定** |
| remotion-sidecar (修改) | 4 | **评估后决定** |
| remotion-sidecar (新文件) | 6 | **大部分保留** |
| seo-data | 5 | **保留** |
| automation/测试 | 2 | **评估** |
| worktrees | 1 目录 | **删除** |
| planning-docs | 1 | **评估** |

---

## Recommended Actions

### 立即执行（低风险）

1. **丢弃过时 SEO 草稿** (15 files)
   ```bash
   git checkout origin/main -- products/*.html products/*-landing/*.html blog/how-to-set-4k-wallpaper-android.html
   ```

2. **删除 worktrees 缓存**
   ```bash
   rm -rf .claude/worktrees/
   ```

3. **保留 SEO 监控数据** (5 files)
   ```bash
   git add data/
   ```

### 需评估后决定

1. **UI 优化改动** (6 files) — 判断是否与 SEO 集群兼容
2. **Remotion 改动** (10 files) — 判断 OG 需求
3. **测试文件** (2 files) — 判断是否需要
4. **工作板更新** (1 file) — 判断是否记录当前任务

---

## Decision Matrix

| 改动类型 | 丢弃 | 保留 | 评估后决定 |
|----------|------|------|------------|
| 过时 SEO 草稿 | ✅ | | |
| SEO 监控数据 | | ✅ | |
| UI 优化改动 | | | ✅ |
| Remotion OG 资源 | | ✅ | |
| Remotion 代码改动 | | | ✅ |
| Worktrees 缓存 | ✅ | | |
| 测试文件 | | | ✅ |

---

**下一步：** 用户决定每类改动的处理方式后，执行对应的 git checkout / git add / rm 命令。