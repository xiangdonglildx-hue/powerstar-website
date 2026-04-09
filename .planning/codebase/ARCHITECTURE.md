# Architecture

**Analysis Date:** 2026-04-03

## Pattern Overview

**Overall:** Static Multi-Page Website (Marketing/Product Showcase)

**Key Characteristics:**
- Pure static HTML/CSS/JS with no server-side processing
- Component-based CSS architecture with modular stylesheets
- Progressive enhancement with GSAP animations
- SEO-focused structure with Schema.org structured data
- Deployment via Docker/nginx container

## Layers

**Presentation Layer:**
- Purpose: Render marketing content and product information
- Location: `*.html` files at root and subdirectories
- Contains: HTML markup, inline styles, Schema.org JSON-LD
- Depends on: CSS files, JS libraries (GSAP), image assets
- Used by: End users via web browser

**Style Layer:**
- Purpose: Define visual design and responsive layouts
- Location: `css/` directory
- Contains: CSS stylesheets organized by page type
- Depends on: Google Fonts (Bebas Neue, Work Sans)
- Used by: All HTML pages via `<link>` references

**Interaction Layer:**
- Purpose: Provide animations and user interactions
- Location: `js/` directory
- Contains: GSAP animation scripts, ScrollTrigger configurations
- Depends on: GSAP library (CDN-loaded)
- Used by: HTML pages via `<script>` references

**Asset Layer:**
- Purpose: Store static media resources
- Location: `images/`, `picture/` directories
- Contains: Product mockups, icons, banners, screenshots
- Depends on: None
- Used by: HTML pages via `<img>` references

## Data Flow

**Page Load Flow:**

1. Browser requests HTML file (e.g., `index.html`)
2. HTML loads CSS from `css/` directory
3. HTML loads GSAP from CDN
4. HTML loads local JS from `js/` directory
5. GSAP animations initialize on DOMContentLoaded
6. ScrollTrigger activates animations as user scrolls
7. Images load from `images/` or `picture/` directories

**Navigation Flow:**

1. User clicks navigation link
2. Browser navigates to new HTML file
3. New page repeats load flow
4. Shared navigation component provides consistent UX

**State Management:**
- No application state (pure static site)
- Animation state managed by GSAP timeline objects
- UI state (dropdowns, FAQ toggles) managed via CSS classes and vanilla JS

## Key Abstractions

**Product Page Template:**
- Purpose: Standardized layout for each app product
- Examples: `products/thermometer.html`, `products/microphone.html`, `products/ai-photo.html`
- Pattern: Hero section -> Quick features -> Screenshots -> Features grid -> Use cases -> Specs -> Comparison -> Reviews -> FAQ -> Related products -> CTA

**Scene Landing Page Template:**
- Purpose: SEO-targeted pages for specific filter styles
- Examples: `products/ai-photo/anime-style.html`, `products/ai-photo/cartoon-style.html`
- Pattern: Landing hero -> Before/After section -> Feature tags -> CTA -> Simple FAQ

**Blog Page Template:**
- Purpose: Content marketing and tutorials
- Examples: `blog.html`, `blog/*.html`
- Pattern: Hero -> Categories -> Featured post -> Blog grid -> Tags -> Newsletter

**CSS Theme System:**
- Purpose: Product-specific color customization
- Examples: CSS variables in `css/product.css` and `css/product-enhanced.css`
- Pattern: `--theme`, `--theme-glow`, `--theme-light` variables set per product

## Entry Points

**Main Entry:**
- Location: `index.html`
- Triggers: Direct URL access, navigation from other pages
- Responsibilities: Homepage hero, product showcase grid, features, testimonials, blog preview, FAQ, CTA

**Product Entries:**
- Location: `products/*.html`
- Triggers: Navigation from homepage or dropdown menu
- Responsibilities: Product-specific marketing content

**SEO Landing Entries:**
- Location: `products/ai-photo/*.html`
- Triggers: Search engine crawlers, direct access
- Responsibilities: Targeted SEO content for specific filter styles

## Error Handling

**Strategy:** Graceful degradation for missing resources

**Patterns:**
- Image fallbacks with `onerror` attribute: `onerror="this.src='https://via.placeholder.com/...'"
- CSS fallbacks via browser-native property fallbacks
- GSAP initialization check: `if (typeof gsap === 'undefined') { console.warn('GSAP not loaded'); return; }`
- Reduced motion preference detection: `window.matchMedia('(prefers-reduced-motion: reduce)').matches`

## Cross-Cutting Concerns

**Logging:** 
- Console warnings for missing GSAP
- Console logs for animation initialization confirmation

**Validation:**
- HTML5 semantic markup
- Schema.org JSON-LD for SEO validation
- Open Graph/Twitter Card meta tags

**Authentication:**
- Not applicable (public static site)

**SEO:**
- Schema.org structured data on every page
- Canonical URLs
- Meta descriptions and keywords
- Open Graph and Twitter Card tags
- robots.txt at root

**Analytics:**
- Google Analytics 4 (GA4) tracking code
- Script: `gtag.js` with measurement ID `G-HRVN6H8K26`
- Loaded on every page via inline `<script>` in `<head>`

**Performance:**
- CDN-loaded libraries (GSAP, Google Fonts)
- nginx gzip compression for text assets
- Cache-Control headers for static assets (1 year for images/CSS/JS)
- No-cache headers for HTML files

---

*Architecture analysis: 2026-04-03*