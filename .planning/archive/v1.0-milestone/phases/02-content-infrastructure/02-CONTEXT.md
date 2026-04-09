# Phase 02 Context: Content Infrastructure

**Phase:** 02 - Content Infrastructure  
**Goal:** 内容创建流程标准化，新页面可高效产出且结构一致
**Created:** 2026-04-03

---

## Key Decisions

### 1. Blog Template Strategy

**Decision:** Create a single reusable template file that can be copied and filled in.

**Template location:** `/blog/template.html`

**Template includes:**
- Standard `<head>` with OG tag placeholders
- Article schema JSON-LD template (placeholders for title, date, author, image)
- Navigation header (same as other pages)
- Footer (same as other pages)
- Content section structure (intro, body, FAQ)
- Responsive CSS (reuse existing)

### 2. llms.txt Enhancement Approach

**Decision:** Expand existing llms.txt in sections, not rewrite.

**Sections to add:**
1. `## FAQs` - Top FAQs from each product
2. `## Blog Summaries` - Key points from each blog article  
3. `## Extended Product Details` - More features/use cases

**Format:** Markdown-style, AI-friendly (clear Q: / A: markers)

### 3. Blog Update Approach

**Decision:** Verify and patch existing blogs, not recreate.

**Process:**
1. Check each blog for Article schema
2. Check each blog for OG tags
3. Add missing elements only
4. Ensure nav/footer consistency

### 4. FAQ Format Standard

**Decision:** 40-60 word answers with clear question phrasing.

**Example format:**
```html
<div class="faq-item">
  <h3 class="faq-question">How does the barometer feature help with fishing?</h3>
  <p class="faq-answer">The barometer measures air pressure changes that indicate weather patterns. Falling pressure often means storms approaching, which affects fish behavior. Many anglers use barometer readings to predict optimal fishing times—fish tend to be more active during stable pressure conditions.</p>
</div>
```

**Schema:**
```json
{
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "How does the barometer feature help with fishing?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "..."
    }
  }]
}
```

---

## Constraints

- **Tech stack:** Pure static HTML/CSS/JS — no build tools
- **No server-side:** Cannot dynamically generate content
- **Consistent design:** Must match existing PowerStar website style
- **SEO compliance:** All schema must pass Rich Results Test

---

## Dependencies (from Phase 01)

- ✅ Mobile nav works
- ✅ Blog links functional
- ✅ Landing page CSS extracted
- ✅ Schema validation passing

---

## Next Steps

1. **Create blog template** (`template.html`)
2. **Expand llms.txt** (FAQs + blog summaries)
3. **Audit existing blogs** (schema + OG tags)
4. **Standardize FAQ format** (40-60 words)

---

*Context established: 2026-04-03*