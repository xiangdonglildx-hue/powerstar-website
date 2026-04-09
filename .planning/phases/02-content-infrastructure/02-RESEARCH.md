# Phase 02 Research: Content Infrastructure

**Phase:** 02 - Content Infrastructure
**Created:** 2026-04-03
**Depends on:** Phase 01 (COMPLETE)

---

## Current State Analysis

### Blog Articles (5 existing)

| File | Status | Has Schema? | Has OG Tags? |
|------|--------|-------------|--------------|
| how-to-use-barometer-for-fishing.html | Exists | Needs check | Needs check |
| best-voice-changer-apps-for-android.html | Exists | Needs check | Needs check |
| microphone-app-for-presentations.html | Exists | Needs check | Needs check |
| ai-photo-filters-guide.html | Exists | Needs check | Needs check |
| 4k-wallpapers-for-android.html | Exists | Needs check | Needs check |

### llms.txt Status

- **Location:** `/llms.txt`
- **Current Content:** Company overview + 5 product details
- **Missing:** FAQ content, blog summaries, deeper product details
- **Size:** ~150 lines (needs expansion)

### FAQ Structure

- **Current:** FAQ sections exist in product pages and landing pages
- **Format:** HTML accordion style
- **AI-citable:** Needs verification (40-60 word answers?)

---

## Requirements Breakdown

### INFRA-01: Blog Template

**What we need:**
- Reusable HTML template with:
  - Navigation header (consistent with site)
  - Footer with links
  - Article schema (JSON-LD)
  - Open Graph meta tags
  - Responsive CSS
  - FAQ section capability

**Template components:**
1. `<head>` section with OG tags template
2. Article schema template (author, date, title, image)
3. Breadcrumb nav
4. Content section markers
5. FAQ schema integration point

### INFRA-02: llms.txt Enhancement

**Additions needed:**
1. FAQ section (top 20 FAQs across products)
2. Blog summaries (5 articles with key points)
3. Extended product details (features, use cases)
4. AI-crawler hints (structured Q&A format)

**Target format:**
```
## FAQs

### Thermometer FAQs
Q: How does the barometer help with fishing?
A: [40-60 word answer]

## Blog Articles

### Barometer Fishing Guide
Summary: [2-3 sentence summary]
Key points: [bullet list]
```

### INFRA-03: Update Existing Blogs

**Tasks:**
1. Verify each blog has Article schema
2. Add missing OG tags
3. Ensure consistent nav/footer
4. Add FAQ sections if missing

### INFRA-04: AI-citable FAQ Format

**Requirements:**
- 40-60 word answers (not too short, not too long)
- Clear question phrasing (searchable)
- Structured HTML with schema markup
- Consistent formatting across all pages

---

## Gray Areas / Assumptions

| Assumption | Risk | Validation Method |
|------------|------|-------------------|
| Blogs already have basic schema | Medium | Check each file |
| llms.txt location is root | Low | Verified |
| FAQ answers are already 40-60 words | Medium | Sample check |
| Template can reuse existing CSS | Low | Existing styles work |

---

## Success Metrics

1. **Template test:** Create new blog using template in <5 minutes
2. **llms.txt coverage:** AI can answer 10 product FAQs from llms.txt alone
3. **Schema validation:** All blogs pass Rich Results Test
4. **FAQ quality:** All FAQ answers 40-60 words, clear Q&A structure

---

*Research completed: 2026-04-03*