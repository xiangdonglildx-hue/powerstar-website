---
phase: 01-foundation-fixes
plan: 03
type: execute
wave: 1
depends_on: []
files_modified:
  - css/landing-page.css (new)
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
autonomous: true
requirements_addressed: [BLOCK-04]
must_haves:
  truths:
    - "Landing pages load css/landing-page.css via link tag (not inline styles)"
    - "css/landing-page.css is cacheable for 1 year via nginx configuration"
    - "Inline style blocks in landing pages are removed or reduced to page-specific overrides only"
    - "Landing pages render identically before and after CSS extraction"
  artifacts:
    - path: "css/landing-page.css"
      provides: "Shared landing page styles"
      min_lines: 100
      exports: ["landing-hero", "landing-content", "before-after-section", "cta-section"]
    - path: "products/ai-photo/anime-style.html"
      pattern: "link.*landing-page\\.css"
      contains: "<link rel=\"stylesheet\" href=\"../../css/landing-page.css\">"
  key_links:
    - from: "products/ai-photo/*.html"
      to: "css/landing-page.css"
      via: "link rel=stylesheet"
      count: "10 pages"
---

# Phase 1: Foundation Fixes - Landing Page CSS Extraction

## Objective

Extract inline CSS from the 10 scene landing pages (products/ai-photo/*.html) into a shared external CSS file (`css/landing-page.css`) that can be browser-cached for 1 year. This improves Core Web Vitals by reducing HTML payload and enabling CSS caching.

**Purpose:** Inline CSS cannot be cached, increases HTML size, and duplicates styles across 10 pages. nginx already has 1-year cache headers for CSS files - we just need to use them.

**Output:** New `css/landing-page.css` file and 10 modified landing pages with external CSS link instead of inline style blocks.

## Context

@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
@.planning/phases/01-foundation-fixes/01-RESEARCH.md
@products/ai-photo/anime-style.html

<interfaces>
<!-- Inline CSS pattern from anime-style.html (lines 46-147) -->

Current inline style block structure:
```html
<style>
    :root {
        --theme: #ff4d00;
        --theme-glow: rgba(255, 77, 0, 0.4);
        --theme-light: rgba(255, 77, 0, 0.1);
    }
    .landing-hero { min-height: 70vh; display: flex; align-items: center; ... }
    .landing-content { text-align: center; padding: 2rem; }
    .landing-title { font-size: 3rem; font-weight: 700; ... }
    .landing-desc { font-size: 1.2rem; line-height: 1.6; ... }
    .before-after-section { display: flex; justify-content: center; gap: 2rem; ... }
    .image-box { position: relative; width: 300px; border-radius: 12px; ... }
    .image-label { position: absolute; bottom: 10px; left: 10px; ... }
    .feature-tags { display: flex; justify-content: center; gap: 1rem; ... }
    .tag { background: var(--theme-light); border: 2px solid var(--theme); ... }
    .cta-section { text-align: center; padding: 3rem 2rem; ... }
    .cta-btn { display: inline-block; background: var(--theme); ... }
</style>
```

nginx caching config (from nginx.conf):
```nginx
location ~* \.(css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

Existing CSS link pattern from landing pages:
```html
<link rel="stylesheet" href="../../css/product.css">
<link rel="stylesheet" href="../../css/product-enhanced.css">
```
</interfaces>

## Tasks

### Task 1: Create css/landing-page.css with shared landing page styles

<read_first>
- products/ai-photo/anime-style.html
- products/ai-photo/cartoon-style.html
- css/product.css
</read_first>

<action>
Create `css/landing-page.css` containing the shared styles extracted from landing pages. The file should include:

1. **CSS header comment:**
```css
/**
 * Landing Page Shared Styles - Power Star Apps
 * Used by: products/ai-photo/*.html scene landing pages
 * 
 * Enables 1-year browser caching via nginx configuration.
 * Page-specific theme colors are set via inline :root overrides.
 */
```

2. **Root theme variables (default theme - pages override with inline style):**
```css
:root {
    --landing-theme: #ff4d00;
    --landing-theme-glow: rgba(255, 77, 0, 0.4);
    --landing-theme-light: rgba(255, 77, 0, 0.1);
}
```

3. **Landing hero section:**
```css
/* Landing Hero Section */
.landing-hero {
    min-height: 70vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, var(--landing-theme-light) 0%, transparent 50%);
}

.landing-content {
    text-align: center;
    padding: 2rem;
}

.landing-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--landing-theme);
    font-family: 'Bebas Neue', sans-serif;
}

.landing-desc {
    font-size: 1.2rem;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto 2rem;
    color: #666;
}

.landing-stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1.5rem;
}

.stat-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--landing-theme);
}

.stat-label {
    font-size: 0.85rem;
    color: #666;
}
```

4. **Before/After section:**
```css
/* Before/After Image Section */
.before-after-section {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    margin: 2rem auto;
    max-width: 800px;
    padding: 0 1rem;
}

.image-box {
    position: relative;
    width: 300px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.image-box img {
    width: 100%;
    display: block;
}

.image-label {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
}

.arrow-icon {
    font-size: 2rem;
    color: var(--landing-theme);
}
```

5. **Feature tags:**
```css
/* Feature Tags */
.feature-tags {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 2rem 0;
    flex-wrap: wrap;
}

.tag {
    background: var(--landing-theme-light);
    border: 2px solid var(--landing-theme);
    color: var(--landing-theme);
    padding: 0.5rem 1.5rem;
    border-radius: 30px;
    font-weight: 600;
}
```

6. **CTA section:**
```css
/* CTA Section */
.cta-section {
    text-align: center;
    padding: 3rem 2rem;
    background: var(--landing-theme-light);
    margin-top: 2rem;
}

.cta-btn {
    display: inline-block;
    background: var(--landing-theme);
    color: white;
    padding: 1rem 3rem;
    border-radius: 50px;
    font-size: 1.2rem;
    font-weight: 700;
    text-decoration: none;
    transition: transform 0.3s, box-shadow 0.3s;
}

.cta-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px var(--landing-theme-glow);
}

.cta-stats {
    margin-top: 1rem;
    color: #666;
}
```

7. **FAQ section:**
```css
/* FAQ Section */
.landing-faq {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
}

.landing-faq h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
}

.faq-item {
    background: #f5f5f5;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
}

.faq-item strong {
    color: #333;
}

.faq-item p {
    margin-top: 0.5rem;
    color: #666;
}
```

8. **Responsive styles:**
```css
/* Responsive Adjustments */
@media (max-width: 768px) {
    .before-after-section {
        flex-direction: column;
        gap: 1rem;
    }
    
    .image-box {
        width: 100%;
        max-width: 300px;
        margin: 0 auto;
    }
    
    .landing-title {
        font-size: 2rem;
    }
    
    .landing-desc {
        font-size: 1rem;
        padding: 0 1rem;
    }
    
    .arrow-icon {
        display: none;
    }
    
    .cta-btn {
        padding: 0.8rem 2rem;
        font-size: 1rem;
    }
    
    .landing-stats {
        flex-direction: column;
        gap: 1rem;
    }
}
```

Total file should be ~150 lines covering all landing page layout styles. Use `--landing-theme` variable names to avoid conflict with existing `--theme` in product.css.
</action>

<acceptance_criteria>
- File `css/landing-page.css` exists with at least 120 lines
- File contains `.landing-hero` class definition
- File contains `.before-after-section` class definition
- File contains `.cta-section` and `.cta-btn` class definitions
- File contains `.landing-theme` CSS variable
- File contains `@media (max-width: 768px)` responsive block
- File has header comment explaining purpose
- All styles use CSS variables or specific color values (no inherited ambiguity)
</acceptance_criteria>

### Task 2: Update all 10 landing pages to use external CSS and remove inline styles

<read_first>
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
</read_first>

<action>
For each of the 10 landing pages, perform these modifications:

1. **Add external CSS link** after the existing product CSS links:
   - Find: `<link rel="stylesheet" href="../../css/product-enhanced.css">`
   - Add after: `<link rel="stylesheet" href="../../css/landing-page.css">`

2. **Replace large inline style block** with minimal theme override:
   - Find the `<style>` block in `<head>` (approximately lines 46-147)
   - Replace entire block with:
   ```html
   <!-- Page-specific theme color -->
   <style>
       :root {
           --landing-theme: #ff4d00;
           --landing-theme-glow: rgba(255, 77, 0, 0.4);
           --landing-theme-light: rgba(255, 77, 0, 0.1);
       }
   </style>
   ```
   
   Note: Each landing page has a different theme color. Check the existing inline styles to get the correct color:
   - anime-style.html: #ff4d00 (orange-red)
   - cartoon-style.html: Check file for theme value
   - vintage-90s-style.html: Check file for theme value
   - aesthetic-style.html: Check file for theme value
   - for-instagram.html: Check file for theme value (likely gradient/pink)
   - for-tiktok.html: Check file for theme value
   - for-selfies.html: Check file for theme value
   - for-pets.html: Check file for theme value
   - lensa-alternative.html: Check file for theme value
   - for-influencers.html: Check file for theme value

3. **Remove inline styles from body elements** (if any exist outside the main style block):
   - Check for style attributes on sections like `style="text-align: center; color: #666"`
   - These should be handled by landing-page.css classes now

**Processing order:**
1. anime-style.html
2. cartoon-style.html
3. vintage-90s-style.html
4. aesthetic-style.html
5. for-instagram.html
6. for-tiktok.html
7. for-selfies.html
8. for-pets.html
9. lensa-alternative.html
10. for-influencers.html

For each file:
- Read the current inline `<style>` block
- Extract the `:root` theme color values
- Add landing-page.css link
- Replace inline block with minimal theme override only
- Verify no layout classes remain inline
</action>

<acceptance_criteria>
- grep shows `<link rel="stylesheet" href="../../css/landing-page.css">` in all 10 landing pages
- grep shows `:root { --landing-theme:` in all 10 landing pages (theme override preserved)
- No landing page has `.landing-hero`, `.before-after-section`, `.cta-section` in inline style block
- Each landing page's inline style block is under 20 lines (theme override only)
- grep count of inline `<style>` content shows reduction from ~100 lines to ~10 lines per file
- Landing pages still reference product.css and product-enhanced.css
</acceptance_criteria>

## Verification

After tasks complete, verify:

1. **File existence and size:**
```bash
ls -la css/landing-page.css
wc -l css/landing-page.css
# Expected: 120+ lines
```

2. **CSS link in all landing pages:**
```bash
grep -l "landing-page.css" products/ai-photo/*.html | wc -l
# Expected: 10
```

3. **Inline style reduction:**
```bash
for f in products/ai-photo/*.html; do
  echo "$f: $(grep -A 50 '<style>' "$f" | grep -c '.') inline style lines"
done
# Each should show minimal inline styles (under 20 lines)
```

4. **Theme colors preserved:**
```bash
grep -h "landing-theme" products/ai-photo/*.html | head -20
# Should show different theme colors per page
```

5. **Manual render test** (executor note for user):
- Load anime-style.html before and after changes
- Verify identical appearance
- Check DevTools Network tab shows landing-page.css loaded with cache headers

## Must Haves

**Observable truths when complete:**
- css/landing-page.css exists with shared landing page styles
- All 10 landing pages link to external CSS file
- Inline style blocks reduced to theme color overrides only
- Page rendering unchanged (visual verification needed)
- CSS file cacheable for 1 year via nginx config

**Required artifacts:**
- `css/landing-page.css` - 120+ lines of shared styles
- 10 modified landing pages with external CSS link
- Theme color overrides preserved per page

**Key links:**
- Landing pages → css/landing-page.css via `<link>`
- Theme variables → page-specific colors via inline :root
- nginx → CSS caching via expires 1y header

## Success Criteria

- [ ] css/landing-page.css created with all shared landing page styles
- [ ] All 10 landing pages have link to landing-page.css
- [ ] Inline style blocks reduced to under 20 lines (theme override only)
- [ ] Each page preserves its unique theme color
- [ ] No layout-breaking changes (styles properly extracted)
- [ ] CSS file min_lines >= 100
- [ ] Files committed to git

## Output

After completion, create `.planning/phases/01-foundation-fixes/01-03-SUMMARY.md` documenting:
- CSS file created and line count
- Landing pages modified
- Theme colors preserved per page
- Verification that pages render correctly
- Cache benefit achieved (external CSS vs inline)