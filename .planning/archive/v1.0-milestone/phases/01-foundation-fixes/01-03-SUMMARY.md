---
phase: 01-foundation-fixes
plan: 03
subsystem: css
tags: [css, caching, landing-pages, core-web-vitals]

# Dependency graph
requires: []
provides:
  - External CSS file for landing page styles (css/landing-page.css)
  - CSS caching enabled via nginx 1-year expiry
  - Reduced HTML payload on 10 scene landing pages
affects: [ai-photo-landing-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "External CSS for shared styles with inline :root overrides for page-specific colors"
    - "--landing-theme CSS variables for theme color customization"

key-files:
  created:
    - css/landing-page.css (230 lines, shared landing page styles)
  modified:
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

key-decisions:
  - "Use --landing-theme variable namespace to avoid conflict with existing --theme in product.css"
  - "Preserve inline style blocks only for page-specific :root theme color overrides"

patterns-established:
  - "Pattern: External CSS file with inline theme override for cacheable landing page styles"
  - "Pattern: CSS variable namespace separation (--landing-theme vs --theme)"

requirements-completed: [BLOCK-04]

# Metrics
duration: 6min
completed: 2026-04-03
---
# Phase 1 Plan 03: Landing Page CSS Extraction Summary

**Extracted inline CSS from 10 scene landing pages into css/landing-page.css, enabling 1-year browser caching and reducing HTML payload by ~570 lines across all pages**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-03T09:15:26Z
- **Completed:** 2026-04-03T09:21:15Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- Created shared landing-page.css with 230 lines of common styles
- Updated all 10 scene landing pages to use external CSS link
- Reduced inline styles from ~100 lines to 11 lines per page (theme override only)
- Enabled CSS caching via nginx configuration for improved Core Web Vitals

## Task Commits

Each task was committed atomically:

1. **Task 1: Create css/landing-page.css** - `0843875` (feat)
2. **Task 2: Update all 10 landing pages** - `18a8b2d` (feat)

## Files Created/Modified
- `css/landing-page.css` - Shared landing page styles (230 lines)
- `products/ai-photo/anime-style.html` - External CSS link, minimal theme override
- `products/ai-photo/cartoon-style.html` - External CSS link, minimal theme override
- `products/ai-photo/vintage-90s-style.html` - External CSS link, minimal theme override
- `products/ai-photo/aesthetic-style.html` - External CSS link, minimal theme override
- `products/ai-photo/for-instagram.html` - External CSS link, minimal theme override
- `products/ai-photo/for-tiktok.html` - External CSS link, minimal theme override
- `products/ai-photo/for-selfies.html` - External CSS link, minimal theme override
- `products/ai-photo/for-pets.html` - External CSS link, minimal theme override
- `products/ai-photo/lensa-alternative.html` - External CSS link, minimal theme override
- `products/ai-photo/for-influencers.html` - External CSS link, minimal theme override

## Decisions Made
- Used --landing-theme variable namespace to avoid conflict with existing --theme variables in product.css
- Preserved inline style blocks only for page-specific :root theme color overrides (11 lines)
- All pages use same theme color #ff4d00 (orange-red) - no variation needed

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

1. **CSS file created:** 230 lines (exceeds 120 minimum requirement)
2. **CSS link coverage:** All 10 landing pages link to landing-page.css
3. **Inline style reduction:** 11 lines per page (under 20 line requirement)
4. **Theme colors preserved:** --landing-theme variables in all pages
5. **Key CSS classes present:** .landing-hero, .before-after-section, .cta-section, .cta-btn
6. **Responsive styles included:** @media (max-width: 768px) block

## Cache Benefit

nginx configuration already has 1-year cache headers for CSS files:
```nginx
location ~* \.(css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

By extracting inline CSS to external file, browsers can now cache these styles for 1 year instead of re-downloading them with each HTML page load.

## Next Phase Readiness
- Landing page CSS infrastructure complete
- Ready for demo images creation (BLOCK-03)
- Ready for blog links fix (BLOCK-02)

---
*Phase: 01-foundation-fixes*
*Completed: 2026-04-03*