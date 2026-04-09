# Codebase Structure

**Analysis Date:** 2026-04-03

## Directory Layout

```
powerstar-website/
├── css/                    # Stylesheets organized by page type
├── images/                 # Web-optimized images for site content
├── js/                     # JavaScript animation scripts
├── picture/                # Product screenshots and logos
├── products/               # Product-specific pages and landing pages
├── blog/                   # Blog article pages
├── seo/                    # SEO planning documents
├── prompts/                # Asset generation prompts
├── .planning/              # Project planning documents
├── *.html                  # Root-level pages (index, blog, about, etc.)
├── Dockerfile              # Docker container configuration
├── nginx.conf              # nginx server configuration
├── default.conf            # nginx site configuration
├── robots.txt              # Search engine directives
├── cloudbuild.yaml         # Cloud Build deployment config
└── start.sh                # Container startup script
```

## Directory Purposes

**`css/`:**
- Purpose: All website stylesheets
- Contains: CSS files for different page types and features
- Key files: 
  - `css/style.css` - Base styles for homepage and light theme
  - `css/product.css` - Product page base styles (dark theme)
  - `css/enhanced.css` - Enhanced homepage components
  - `css/product-enhanced.css` - Enhanced product page styles
  - `css/hero-new.css` - Hero section specific styles
  - `css/banners.css` - Banner/slider styles

**`images/`:**
- Purpose: Web-ready images for site content
- Contains: PNG images organized by purpose
- Key files:
  - `images/icons/` - Product app icons (64x64)
  - `images/products/` - Product mockup images
  - `images/blog/covers/` - Blog article cover images
  - `images/banners/` - Homepage hero banner images

**`js/`:**
- Purpose: JavaScript animation and interaction scripts
- Contains: GSAP animation configurations
- Key files:
  - `js/gsap-animations.js` - Core GSAP animation definitions
  - `js/gsap-animations-enhanced.js` - Enhanced animations
  - `js/animations.js` - Additional animation utilities

**`picture/`:**
- Purpose: Product-specific visual assets
- Contains: Screenshots, logos, and promotional images
- Key files:
  - `picture/logo/` - Product logo images
  - `picture/screen/` - App screenshot collections by product

**`products/`:**
- Purpose: Product marketing pages and SEO landing pages
- Contains: HTML pages for each product and filter style
- Key files:
  - `products/thermometer.html` - Thermometer app page
  - `products/microphone.html` - Microphone app page
  - `products/voice-changer.html` - Voice Changer app page
  - `products/lumiwall.html` - Lumiwall wallpapers page
  - `products/ai-photo.html` - AI Photo Filters main page
  - `products/ai-photo/*.html` - Scene landing pages (anime, cartoon, etc.)

**`blog/`:**
- Purpose: Blog article pages
- Contains: Individual blog post HTML files
- Key files:
  - `blog/ai-photo-filters-guide.html`
  - `blog/microphone-app-for-presentations.html`
  - `blog/best-voice-changer-apps-for-android.html`

**`seo/`:**
- Purpose: SEO planning and strategy documents
- Contains: Markdown documents for SEO planning
- Key files:
  - `seo/KEYWORDS.md` - Keyword research
  - `seo/COMPETITORS.md` - Competitor analysis
  - `seo/SUMMARY.md` - SEO strategy summary
  - `seo/SCHEMA.md` - Schema.org planning

## Key File Locations

**Entry Points:**
- `index.html`: Homepage with product showcase
- `products/*.html`: Product-specific marketing pages
- `products/ai-photo/*.html`: SEO landing pages for filter styles
- `blog.html`: Blog listing page
- `blog/*.html`: Individual blog articles

**Configuration:**
- `Dockerfile`: Docker image build configuration
- `nginx.conf`: nginx global server configuration
- `default.conf`: nginx site-specific configuration
- `cloudbuild.yaml`: Google Cloud Build deployment
- `robots.txt`: Search engine crawling directives

**Core Logic:**
- `js/gsap-animations.js`: Main animation definitions
- `js/gsap-animations-enhanced.js`: Enhanced animations with ScrollTrigger

**Stylesheets:**
- `css/style.css`: Base typography, layout, components
- `css/product.css`: Product page specific styles
- `css/enhanced.css`: Enhanced homepage components
- `css/product-enhanced.css`: Enhanced product components

## Naming Conventions

**Files:**
- HTML: Lowercase with hyphens, `.html` extension (e.g., `ai-photo.html`, `voice-changer.html`)
- CSS: Lowercase with hyphens, `.css` extension (e.g., `product-enhanced.css`, `hero-new.css`)
- JS: Lowercase with hyphens, `.js` extension (e.g., `gsap-animations.js`)
- Images: Lowercase with hyphens, PNG format (e.g., `icon-thermometer.png`, `mockup-microphone.png`)

**Directories:**
- Lowercase, single words preferred (e.g., `css/`, `images/`, `products/`)
- Multi-word: hyphen-separated (e.g., `ai-photo/` subdirectory)

**CSS Classes:**
- BEM-style naming with component-prefix approach
- Component class: `.product-card-enhanced`, `.feature-card-large`
- Modifier: `.dark`, `.active`, `.primary`
- Utility: `.container`, `.section-header`

**CSS Variables:**
- kebab-case with `--` prefix (e.g., `--theme`, `--theme-glow`, `--black-elevated`)

## Where to Add New Code

**New Product Page:**
- Primary code: Create `products/[product-name].html`
- Styles: Add product-specific CSS variables in `<style>` block or `css/product-enhanced.css`
- Images: Add icons to `images/icons/`, mockups to `images/products/[product-name]/`
- Screenshots: Add to `picture/screen/[product-name]/`
- Logo: Add to `picture/logo/`

**New SEO Landing Page:**
- Implementation: Create `products/[parent-product]/[landing-page-name].html`
- Follow pattern from existing landing pages (e.g., `products/ai-photo/anime-style.html`)
- Link to parent product page in navigation

**New Blog Article:**
- Implementation: Create `blog/[article-slug].html`
- Add cover image to `images/blog/covers/`
- Link from `blog.html` listing page

**New Stylesheet:**
- Implementation: Create `css/[component-name].css`
- Import fonts if needed: `@import url('https://fonts.googleapis.com/...')`
- Link in HTML: `<link rel="stylesheet" href="css/[component-name].css">`

**New Animation:**
- Implementation: Add function to `js/gsap-animations-enhanced.js`
- Register with ScrollTrigger if scroll-dependent
- Call from page-specific inline `<script>` or existing initialization

**New Image Assets:**
- Icons: `images/icons/` (64x64 PNG recommended)
- Mockups: `images/products/[product-name]/`
- Blog covers: `images/blog/covers/` (consistent aspect ratio)
- Screenshots: `picture/screen/[product-name]/`

## Special Directories

**`.planning/`:**
- Purpose: Project planning documents and codebase analysis
- Contains: Strategy documents, asset plans, SEO planning
- Generated: By GSD commands and planning tools
- Committed: Yes (part of repository)

**`seo/`:**
- Purpose: SEO strategy and research documents
- Contains: Keyword research, competitor analysis, schema planning
- Generated: Manual planning process
- Committed: Yes

**`prompts/`:**
- Purpose: AI image generation prompts for assets
- Contains: Prompt templates for mockup generation
- Generated: Manual planning
- Committed: Yes

**`images/` vs `picture/`:**
- `images/`: Web-optimized, compression-friendly, used in site layout
- `picture/`: Higher-quality product screenshots and promotional images
- Both committed to repository

## File Reference Patterns

**HTML CSS Imports:**
```html
<!-- Homepage -->
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/enhanced.css">
<link rel="stylesheet" href="css/hero-new.css">

<!-- Product pages -->
<link rel="stylesheet" href="../css/product.css">
<link rel="stylesheet" href="../css/product-enhanced.css">
```

**HTML JS Imports:**
```html
<!-- GSAP from CDN -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<!-- Local animations -->
<script src="js/gsap-animations-enhanced.js"></script>
```

**Image References:**
```html
<!-- From root page -->
<img src="images/icons/icon-thermometer.png" alt="...">

<!-- From product page -->
<img src="../picture/logo/thermometer.png" alt="...">

<!-- From landing page -->
<img src="../../images/demo/anime-before.jpg" alt="...">
```

---

*Structure analysis: 2026-04-03*