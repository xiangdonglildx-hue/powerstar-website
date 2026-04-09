---
phase: 01-foundation-fixes
plan: 05
type: execute
wave: 2
depends_on: [01-PLAN, 02-PLAN, 03-PLAN]
files_modified:
  - index.html
  - blog.html
  - products/thermometer.html
  - products/microphone.html
  - products/voice-changer.html
  - products/lumiwall.html
  - products/ai-photo.html
  - products/ai-photo/anime-style.html
  - products/ai-photo/cartoon-style.html
  - products/ai-photo/vintage-90s-style.html
  - products/ai-photo/aesthetic-style.html
  - products/ai-photo/for-instagram.html
  - products/ai-photo/for-tiktok.html
  - products/ai-photo/for-selfies.html
  - products/ai-photo/for-pets.html
  - products/ai-photo/lensa-alternative.html
  - products/ai-photo/for-influencers.html
  - about.html
  - help.html
  - faq.html
autonomous: true
requirements_addressed: [BLOCK-01]
must_haves:
  truths:
    - "Hamburger button appears in navbar at viewport width below 768px"
    - "Clicking hamburger opens mobile menu overlay with navigation links"
    - "Mobile menu contains Products dropdown expanded as list items"
    - "Clicking navigation link closes mobile menu and navigates to page"
    - "Escape key closes mobile menu"
    - "ARIA attributes (aria-expanded, aria-hidden) update correctly"
  artifacts:
    - path: "index.html"
      contains: "class=\"hamburger\""
      contains: "class=\"mobile-menu\""
      pattern: "<button class=\"hamburger\""
    - path: "products/ai-photo.html"
      contains: "js/mobile-nav.js"
    - path: "products/ai-photo/anime-style.html"
      contains: "js/mobile-nav.js"
  key_links:
    - from: ".hamburger button"
      to: ".mobile-menu"
      via: "click event -> classList.toggle('active')"
    - from: ".mobile-nav-links"
      to: "page navigation"
      via: "href links matching desktop nav"
---

# Phase 1: Foundation Fixes - Mobile Navigation HTML Updates

## Objective

Add hamburger button HTML and mobile menu overlay HTML to all pages of the website. This enables the CSS and JS infrastructure (created in Plan 01) to function. Also incorporates the blog.html updates from Plan 02 to avoid file conflicts.

**Purpose:** Without HTML elements, the CSS/JS infrastructure cannot provide mobile navigation. All ~20 pages need hamburger button and mobile menu HTML added.

**Output:** All HTML pages modified to include hamburger button, mobile menu overlay, and mobile-nav.js script reference.

## Context

@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
@.planning/phases/01-foundation-fixes/01-RESEARCH.md
@.planning/phases/01-foundation-fixes/01-PLAN.md (CSS/JS infrastructure)

<interfaces>
<!-- Hamburger HTML structure to add -->

Hamburger button (add after logo, before nav-links):
```html
<button class="hamburger" aria-label="Open navigation menu" aria-expanded="false">
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
</button>
```

Mobile menu overlay (add after navbar, before first section):
```html
<!-- Mobile Menu Overlay -->
<div class="mobile-menu-overlay"></div>
<div class="mobile-menu" aria-hidden="true">
    <ul class="mobile-nav-links">
        <li class="mobile-dropdown">
            <a href="#">Products</a>
            <ul class="dropdown-menu">
                <li><a href="products/thermometer.html">Thermometer</a></li>
                <li><a href="products/microphone.html">Microphone</a></li>
                <li><a href="products/voice-changer.html">Voice Changer</a></li>
                <li><a href="products/lumiwall.html">Lumiwall</a></li>
                <li><a href="products/ai-photo.html">AI Photo Filters</a></li>
            </ul>
        </li>
        <li><a href="about.html">About Us</a></li>
        <li><a href="help.html">Help Center</a></li>
        <li><a href="blog.html">Blog</a></li>
        <li><a href="faq.html">FAQ</a></li>
    </ul>
</div>
```

Mobile-nav.js script (add after other JS, before closing body):
```html
<script src="js/mobile-nav.js"></script>
```

For landing pages with relative paths (products/ai-photo/*.html):
```html
<script src="../../js/mobile-nav.js"></script>
```

CSS link for mobile-nav.css (add in head after existing CSS):
```html
<link rel="stylesheet" href="css/mobile-nav.css">
```

For landing pages:
```html
<link rel="stylesheet" href="../../css/mobile-nav.css">
```
</interfaces>

## Tasks

### Task 1: Add hamburger and mobile menu HTML to index.html and blog.html

<read_first>
- index.html
- blog.html
- css/mobile-nav.css (verify it exists from Plan 01)
- js/mobile-nav.js (verify it exists from Plan 01)
</read_first>

<action>
Modify index.html and blog.html to add mobile navigation elements:

**For index.html:**

1. **Add CSS link in `<head>`** (after existing CSS links, around line 40):
```html
<link rel="stylesheet" href="css/mobile-nav.css">
```

2. **Add hamburger button in navbar** (after logo link, before nav-links ul, around line 93):
```html
<button class="hamburger" aria-label="Open navigation menu" aria-expanded="false">
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
</button>
```

3. **Add mobile menu overlay** (after navbar closing `</nav>`, around line 112):
```html
<!-- Mobile Navigation -->
<div class="mobile-menu-overlay"></div>
<div class="mobile-menu" aria-hidden="true">
    <ul class="mobile-nav-links">
        <li class="mobile-dropdown">
            <a href="#">Products</a>
            <ul class="dropdown-menu">
                <li><a href="products/thermometer.html">Thermometer</a></li>
                <li><a href="products/microphone.html">Microphone</a></li>
                <li><a href="products/voice-changer.html">Voice Changer</a></li>
                <li><a href="products/lumiwall.html">Lumiwall</a></li>
                <li><a href="products/ai-photo.html">AI Photo & Video Filters</a></li>
            </ul>
        </li>
        <li><a href="about.html">About Us</a></li>
        <li><a href="help.html">Help Center</a></li>
        <li><a href="blog.html">Blog</a></li>
        <li><a href="faq.html">FAQ</a></li>
    </ul>
</div>
```

4. **Add JS script reference** (after gsap-animations-enhanced.js, before `</body>`):
```html
<script src="js/mobile-nav.js"></script>
```

**For blog.html:**

Perform the same modifications:
1. Add CSS link: `<link rel="stylesheet" href="css/mobile-nav.css">` (after line 27)
2. Add hamburger button in navbar (after logo, around line 417)
3. Add mobile menu overlay with same navigation links (after navbar, around line 435)
4. Add JS script: `<script src="js/mobile-nav.js"></script>` (after gsap-animations-enhanced.js)

Note: blog.html should already have functional blog links from Plan 02. Do not modify href values in blog cards.
</action>

<acceptance_criteria>
- grep shows `<link rel="stylesheet" href="css/mobile-nav.css">` in index.html
- grep shows `<link rel="stylesheet" href="css/mobile-nav.css">` in blog.html
- grep shows `<button class="hamburger"` in index.html
- grep shows `<button class="hamburger"` in blog.html
- grep shows `class="mobile-menu"` in index.html
- grep shows `class="mobile-menu"` in blog.html
- grep shows `<script src="js/mobile-nav.js">` in index.html
- grep shows `<script src="js/mobile-nav.js">` in blog.html
- Each file has 3 `hamburger-line` spans inside hamburger button
- Mobile menu contains all navigation links (Products, About, Help, Blog, FAQ)
</acceptance_criteria>

### Task 2: Add hamburger HTML to product pages (5 files)

<read_first>
- products/thermometer.html
- products/microphone.html
- products/voice-changer.html
- products/lumiwall.html
- products/ai-photo.html
</read_first>

<action>
Modify each of the 5 product pages to add mobile navigation:

**For each product page (thermometer.html, microphone.html, voice-changer.html, lumiwall.html, ai-photo.html):**

1. **Add CSS link in `<head>`** (after product-enhanced.css):
```html
<link rel="stylesheet" href="../css/mobile-nav.css">
```
Note: Use `../css/` path because product pages are in products/ directory.

2. **Add hamburger button in navbar** (after logo, before nav-links):
```html
<button class="hamburger" aria-label="Open navigation menu" aria-expanded="false">
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
</button>
```

3. **Add mobile menu overlay** (after navbar):
```html
<!-- Mobile Navigation -->
<div class="mobile-menu-overlay"></div>
<div class="mobile-menu" aria-hidden="true">
    <ul class="mobile-nav-links">
        <li class="mobile-dropdown">
            <a href="#">Products</a>
            <ul class="dropdown-menu">
                <li><a href="thermometer.html">Thermometer</a></li>
                <li><a href="microphone.html">Microphone</a></li>
                <li><a href="voice-changer.html">Voice Changer</a></li>
                <li><a href="lumiwall.html">Lumiwall</a></li>
                <li><a href="ai-photo.html">AI Photo Filters</a></li>
            </ul>
        </li>
        <li><a href="../about.html">About Us</a></li>
        <li><a href="../help.html">Help Center</a></li>
        <li><a href="../blog.html">Blog</a></li>
        <li><a href="../faq.html">FAQ</a></li>
    </ul>
</div>
```
Note: Use `../` prefix for non-product links (about, help, blog, faq) because pages are in products/ directory. Product links within dropdown use relative paths without `../`.

4. **Add JS script** (before `</body>`):
```html
<script src="../js/mobile-nav.js"></script>
```

Process all 5 product pages with appropriate path adjustments.
</action>

<acceptance_criteria>
- grep shows `mobile-nav.css` in all 5 product pages
- grep shows `class="hamburger"` in all 5 product pages  
- grep shows `class="mobile-menu"` in all 5 product pages
- grep shows `mobile-nav.js` in all 5 product pages
- Product pages use `../css/mobile-nav.css` path
- Product pages use `../js/mobile-nav.js` path
- Mobile menu links to other pages use `../` prefix correctly
- Mobile menu links to product pages use relative paths correctly
</acceptance_criteria>

### Task 3: Add hamburger HTML to landing pages and other pages

<read_first>
- products/ai-photo/anime-style.html
- products/ai-photo/cartoon-style.html
- about.html
- help.html
- faq.html
</read_first>

<action>
Modify the 10 landing pages and 3 other pages (about, help, faq):

**For landing pages (products/ai-photo/*.html):**

1. **Add CSS link in `<head>`** (after landing-page.css or product-enhanced.css):
```html
<link rel="stylesheet" href="../../css/mobile-nav.css">
```
Note: Use `../../css/` because landing pages are in products/ai-photo/ directory.

2. **Add hamburger button** (after logo in navbar):
```html
<button class="hamburger" aria-label="Open navigation menu" aria-expanded="false">
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
</button>
```

3. **Add mobile menu overlay** (after navbar):
```html
<!-- Mobile Navigation -->
<div class="mobile-menu-overlay"></div>
<div class="mobile-menu" aria-hidden="true">
    <ul class="mobile-nav-links">
        <li><a href="../../products/ai-photo.html">AI Photo Filters</a></li>
        <li><a href="../../about.html">About Us</a></li>
        <li><a href="../../help.html">Help Center</a></li>
    </ul>
</div>
```
Note: Landing pages have simpler navigation (no full Products dropdown needed). Use `../../` path prefix.

4. **Add JS script** (before `</body>`):
```html
<script src="../../js/mobile-nav.js"></script>
```

Process all 10 landing pages: anime-style, cartoon-style, vintage-90s-style, aesthetic-style, for-instagram, for-tiktok, for-selfies, for-pets, lensa-alternative, for-influencers.

**For about.html, help.html, faq.html:**

Same pattern as index.html:
1. CSS link: `<link rel="stylesheet" href="css/mobile-nav.css">`
2. Hamburger button in navbar
3. Mobile menu overlay with full navigation
4. JS script: `<script src="js/mobile-nav.js"></script>`
</action>

<acceptance_criteria>
- grep shows `mobile-nav.css` in all 10 landing pages
- grep shows `class="hamburger"` in all 10 landing pages
- grep shows `class="mobile-menu"` in all 10 landing pages
- grep shows `mobile-nav.js` in all 10 landing pages
- Landing pages use `../../css/mobile-nav.css` path
- Landing pages use `../../js/mobile-nav.js` path
- grep shows `mobile-nav.css` in about.html, help.html, faq.html
- grep shows `class="hamburger"` in about.html, help.html, faq.html
- All pages have 3 hamburger-line spans
- All mobile menus have aria-hidden="true" attribute
</acceptance_criteria>

## Verification

After all tasks complete, verify:

1. **Total file count with hamburger:**
```bash
grep -l "class=\"hamburger\"" *.html products/*.html products/ai-photo/*.html | wc -l
# Expected: ~18 files (index, blog, 5 products, 10 landing pages, 3 other pages)
```

2. **CSS link verification:**
```bash
grep -l "mobile-nav.css" *.html products/*.html products/ai-photo/*.html | wc -l
# Expected: same count
```

3. **JS script verification:**
```bash
grep -l "mobile-nav.js" *.html products/*.html products/ai-photo/*.html | wc -l
# Expected: same count
```

4. **Mobile menu structure:**
```bash
grep -l "class=\"mobile-menu\"" *.html products/*.html products/ai-photo/*.html | wc -l
# Expected: same count
```

5. **Manual browser test** (executor note for user):
- Load index.html at 768px viewport
- Click hamburger button
- Verify mobile menu slides in
- Click navigation link
- Verify menu closes and page navigates
- Test Escape key closes menu

## Must Haves

**Observable truths when complete:**
- Hamburger button visible at 768px viewport on all pages
- Mobile menu opens when hamburger clicked
- All navigation links accessible in mobile menu
- Products dropdown expanded as flat list in mobile menu
- Menu closes on link click or Escape key
- ARIA attributes update correctly (aria-expanded toggles)

**Required artifacts:**
- All ~18 HTML pages have hamburger button HTML
- All pages have mobile menu overlay HTML
- All pages link to mobile-nav.css and mobile-nav.js
- Correct path prefixes based on directory depth (../, ../../)

**Key links:**
- Hamburger button → mobile-nav.js click handler
- Mobile menu → navigation pages via href links
- CSS → mobile-nav.css for styling
- JS → mobile-nav.js for toggle functionality

## Success Criteria

- [ ] index.html has hamburger, mobile menu, CSS link, JS script
- [ ] blog.html has hamburger, mobile menu, CSS link, JS script
- [ ] All 5 product pages have hamburger with ../ paths
- [ ] All 10 landing pages have hamburger with ../../ paths
- [ ] about.html, help.html, faq.html have hamburger
- [ ] All pages have aria-label and aria-expanded on hamburger
- [ ] All pages have aria-hidden on mobile-menu
- [ ] Mobile menus contain correct navigation links for page type
- [ ] Files committed to git

## Output

After completion, create `.planning/phases/01-foundation-fixes/01-05-SUMMARY.md` documenting:
- Files modified count
- Path patterns used (/, ../, ../../)
- Navigation link structure per page type
- Verification of hamburger functionality at 768px