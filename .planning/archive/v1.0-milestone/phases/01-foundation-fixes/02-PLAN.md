---
phase: 01-foundation-fixes
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - blog.html
autonomous: true
requirements_addressed: [BLOCK-02]
must_haves:
  truths:
    - "Blog card titled 'How AI is Changing Photo Editing' links to blog/ai-photo-filters-guide.html"
    - "Blog card titled 'Fun Ways to Use Voice Changer' links to blog/best-voice-changer-apps-for-android.html"
    - "Blog card titled 'Why Room Temperature Matters' links to blog/how-to-use-barometer-for-fishing.html"
    - "Blog card titled 'Best Wallpaper Trends of 2026' links to blog/4k-wallpapers-for-android.html"
    - "Blog card titled 'Best Practices for Voice Recording' links to blog/microphone-app-for-presentations.html"
    - "Clicking any blog card navigates to actual article (no href='#' links remain)"
  artifacts:
    - path: "blog.html"
      provides: "Blog listing page with functional links"
      contains: "href=\"blog/*.html\""
      pattern: "href=\"blog/[a-z-]+\\.html\""
  key_links:
    - from: "blog.html blog cards"
      to: "blog/*.html articles"
      via: "href attribute"
      count: "5+ links"
---

# Phase 1: Foundation Fixes - Blog Links

## Objective

Fix broken blog card links in blog.html that currently use `href="#"` placeholder values. Map the 5 existing blog articles in the `blog/` directory to their corresponding card titles in blog.html, enabling users to actually navigate to blog articles.

**Purpose:** Broken links are a user journey blocker and SEO negative signal. Users clicking blog cards expect to read articles, not stay on the same page.

**Output:** Modified blog.html with functional href attributes linking to actual blog articles.

## Context

@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
@.planning/phases/01-foundation-fixes/01-RESEARCH.md

<interfaces>
<!-- Existing blog articles that must be linked -->

Blog article files in blog/ directory:
- blog/ai-photo-filters-guide.html
- blog/microphone-app-for-presentations.html  
- blog/best-voice-changer-apps-for-android.html
- blog/how-to-use-barometer-for-fishing.html
- blog/4k-wallpapers-for-android.html

Blog.html card structure (from file read):
```html
<!-- Featured section -->
<a href="#" class="featured-main">
    <h2>5 Tips for Better Voice Recordings</h2>
</a>

<!-- Sidebar cards -->
<a href="#" class="sidebar-card">
    <h3>How AI is Changing Photo Editing</h3>
</a>
<a href="#" class="sidebar-card">
    <h3>Fun Ways to Use Voice Changer</h3>
</a>
<a href="#" class="sidebar-card">
    <h3>Why Room Temperature Matters</h3>
</a>

<!-- Blog grid cards (9 cards total) -->
<a href="#" class="blog-card-enhanced">
    <h3>How AI is Changing Photo Editing</h3>  <!-- matches ai-photo-filters-guide.html -->
</a>
<a href="#" class="blog-card-enhanced">
    <h3>Fun Ways to Use Voice Changer</h3>  <!-- matches best-voice-changer-apps-for-android.html -->
</a>
<a href="#" class="blog-card-enhanced">
    <h3>Why Room Temperature Matters</h3>  <!-- matches how-to-use-barometer-for-fishing.html -->
</a>
<a href="#" class="blog-card-enhanced">
    <h3>Best Practices for Voice Recording</h3>  <!-- matches microphone-app-for-presentations.html -->
</a>
<a href="#" class="blog-card-enhanced">
    <h3>Best Wallpaper Trends of 2026</h3>  <!-- matches 4k-wallpapers-for-android.html -->
</a>
```
</interfaces>

## Tasks

### Task 1: Map blog card titles to existing article files and update hrefs

<read_first>
- blog.html
- blog/ai-photo-filters-guide.html
- blog/microphone-app-for-presentations.html
- blog/best-voice-changer-apps-for-android.html
- blog/how-to-use-barometer-for-fishing.html
- blog/4k-wallpapers-for-android.html
</read_first>

<action>
Update blog.html by replacing `href="#"` with actual article URLs based on title matching:

**Exact mappings (card title → article file):**

1. **"How AI is Changing Photo Editing"** → `blog/ai-photo-filters-guide.html`
   - Appears in: sidebar card (line ~472-477), blog grid card (line ~507-520)
   - Change: `href="#"` → `href="blog/ai-photo-filters-guide.html"`

2. **"Fun Ways to Use Voice Changer"** → `blog/best-voice-changer-apps-for-android.html`
   - Appears in: sidebar card (line ~479-485), blog grid card (line ~522-535)
   - Change: `href="#"` → `href="blog/best-voice-changer-apps-for-android.html"`

3. **"Why Room Temperature Matters"** → `blog/how-to-use-barometer-for-fishing.html`
   - Appears in: sidebar card (line ~487-492), blog grid card (line ~537-550)
   - Change: `href="#"` → `href="blog/how-to-use-barometer-for-fishing.html"`

4. **"Best Practices for Voice Recording"** → `blog/microphone-app-for-presentations.html`
   - Appears in: blog grid card (line ~552-565)
   - Change: `href="#"` → `href="blog/microphone-app-for-presentations.html"`

5. **"Best Wallpaper Trends of 2026"** → `blog/4k-wallpapers-for-android.html`
   - Appears in: blog grid card (line ~567-580)
   - Change: `href="#"` → `href="blog/4k-wallpapers-for-android.html"`

**Additional mappings for remaining cards:**

6. **"5 Tips for Better Voice Recordings"** (featured main card, line ~462) → `blog/microphone-app-for-presentations.html`
   - This is the featured article, link to microphone presentation guide

7. **"Getting Started with AI Filters"** (line ~582-595) → `blog/ai-photo-filters-guide.html`

8. **"Monitoring Health with Temperature Apps"** (line ~597-610) → `blog/how-to-use-barometer-for-fishing.html`

9. **"Setting Up Bluetooth Microphone"** (line ~612-625) → Keep `href="#"` for now (no matching article, Phase 2 will create)

10. **"Voice Effects for Gaming Streams"** (line ~627-640) → Keep `href="#"` for now (no matching article, Phase 2 will create)

**Summary: 8 href="#" replaced, 2 remain for Phase 2**

Execute all replacements in one pass through blog.html. Use exact href values: `href="blog/[filename].html"`
</action>

<acceptance_criteria>
- grep shows `href="blog/ai-photo-filters-guide.html"` in blog.html (at least 2 occurrences - sidebar + grid)
- grep shows `href="blog/best-voice-changer-apps-for-android.html"` in blog.html (at least 2 occurrences)
- grep shows `href="blog/how-to-use-barometer-for-fishing.html"` in blog.html (at least 2 occurrences)
- grep shows `href="blog/microphone-app-for-presentations.html"` in blog.html (at least 2 occurrences)
- grep shows `href="blog/4k-wallpapers-for-android.html"` in blog.html (at least 1 occurrence)
- grep shows exactly 2 remaining `href="#"` in blog cards section (for unmatched articles)
- Total count: 8 functional blog links, 2 placeholder links remaining
</acceptance_criteria>

## Verification

After task completion, verify:

1. **Link count verification:**
```bash
grep -c 'href="blog/' blog.html
# Expected: 8 or more

grep -c 'href="#"' blog.html  
# Expected: 2 (in blog cards section only, not counting navigation dropdown toggles)
```

2. **Specific link verification:**
```bash
grep -n 'ai-photo-filters-guide' blog.html
grep -n 'best-voice-changer-apps' blog.html
grep -n 'how-to-use-barometer' blog.html
grep -n 'microphone-app-for-presentations' blog.html
grep -n '4k-wallpapers' blog.html
```

3. **Manual click test** (note for user verification):
- Open blog.html in browser
- Click each blog card
- Verify 8 cards navigate to articles
- Verify 2 cards (Bluetooth Microphone, Gaming Streams) still show href="#" placeholder

## Must Haves

**Observable truths when complete:**
- User can click "How AI is Changing Photo Editing" card and reach blog/ai-photo-filters-guide.html
- User can click "Fun Ways to Use Voice Changer" card and reach blog/best-voice-changer-apps-for-android.html
- User can click "Why Room Temperature Matters" card and reach blog/how-to-use-barometer-for-fishing.html
- User can click "Best Practices for Voice Recording" card and reach blog/microphone-app-for-presentations.html
- User can click "Best Wallpaper Trends of 2026" card and reach blog/4k-wallpapers-for-android.html

**Required artifacts:**
- Modified `blog.html` with 8 functional href attributes
- 2 href="#" remain for cards without matching articles (Phase 2 scope)

**Key links:**
- Featured card → blog/microphone-app-for-presentations.html
- Sidebar cards → 3 article links
- Blog grid cards → 5+ article links

## Success Criteria

- [ ] blog.html has 8 href="blog/*.html" links replacing href="#"
- [ ] All 5 existing blog articles are linked at least once
- [ ] Featured "5 Tips for Better Voice Recordings" links to microphone article
- [ ] 2 href="#" remain for unmapped cards (documented for Phase 2)
- [ ] No broken links introduced (all href targets exist as files)
- [ ] Changes committed to git

## Output

After completion, create `.planning/phases/01-foundation-fixes/01-02-SUMMARY.md` documenting:
- Links replaced (8 functional, 2 placeholder)
- Title-to-file mappings used
- Remaining href="#" cards for Phase 2 attention