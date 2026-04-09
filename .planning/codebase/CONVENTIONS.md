# Coding Conventions

**Analysis Date:** 2026-04-03

## Project Type

**Static HTML/CSS/JS Website**
- No build system or package manager
- Pure static files served directly
- External CDN dependencies (GSAP, Google Fonts)

## Naming Patterns

**CSS Class Names:**
- Use kebab-case throughout: `.product-card`, `.hero-content`, `.btn-download`
- Component-based naming pattern: `[component]-[element]`
  - Example: `.product-card-content`, `.product-card-image`, `.product-card-cta`
- State classes use adjectives: `.active`, `.scrolled`, `.hover`
- Data attributes for configuration: `data-product="thermometer"`

**JavaScript Variables:**
- camelCase for all variables and functions
- Functions: `initHeroAnimations()`, `initProductCards()`, `showSlideKenBurns()`
- Variables: `currentSlide`, `autoSlideInterval`, `prefersReducedMotion`
- Global window properties: `window.currentSlide`, `window.goToSlide`

**File Names:**
- kebab-case: `gsap-animations.js`, `product-enhanced.css`, `ai-photo-filters-guide.html`
- Multiple CSS files split by purpose

**HTML IDs:**
- Rarely used; prefer classes
- Found: `id="products"` for anchor links

## Code Style

**CSS Formatting:**
- 4-space indentation
- Section headers use block comments with separators:
```css
/* ===== Section Name ===== */
/* ========================================
   POWER STAR APPS - SECTION DESCRIPTION
   ======================================== */
```
- One property per line
- Space after colon: `color: var(--orange);`
- Blank lines between rule sets
- Alphabetical ordering not enforced; grouped by logical relationship

**JavaScript Formatting:**
- 4-space indentation
- Section headers with decorative separators:
```javascript
// ========================================
// SECTION NAME
// ========================================
```
- Semicolons used consistently
- Single quotes for strings (some double quotes present)
- Arrow functions for callbacks
- Function declarations (not expressions) for main functions

**HTML Formatting:**
- 4-space indentation
- Attributes on separate lines for long elements
- Consistent quote style (double quotes)

## CSS Architecture

**Variable System:**
- CSS custom properties in `:root`
- Semantic naming for colors:
```css
:root {
    --black: #000000;
    --orange: #ff4d00;
    --orange-glow: rgba(255, 77, 0, 0.4);
    --gray: #666666;
    --radius: 12px;
    --shadow: 0 4px 24px rgba(0,0,0,0.08);
}
```
- Theme-specific overrides in product pages:
```css
:root {
    --theme: #ff4d00;
    --theme-glow: rgba(255, 77, 0, 0.4);
    --theme-light: rgba(255, 77, 0, 0.1);
}
```

**File Organization:**
- `css/style.css` - Main light theme, global styles, typography, navigation
- `css/product.css` - Dark theme for product pages
- `css/enhanced.css` - Enhanced components, section styles, animations
- `css/product-enhanced.css` - Product-specific enhancements
- `css/hero-new.css` - Hero section animations and layout

**Responsive Approach:**
- Desktop-first design with mobile breakpoints
- Breakpoint at 768px for mobile
- Additional breakpoint at 480px for small screens
- Uses `clamp()` for fluid typography:
```css
h1 { font-size: clamp(3rem, 8vw, 5rem); }
```

**Component Pattern:**
Cards follow consistent structure:
```html
<div class="product-card-enhanced" data-product="ai-photo">
    <div class="product-card-image-wrapper">
        <img class="product-card-image">
    </div>
    <div class="product-card-content">
        <img class="product-card-icon">
        <h3>Title</h3>
        <p>Description</p>
        <div class="product-tags">...</div>
        <div class="product-stats">...</div>
        <div class="product-card-cta">...</div>
    </div>
</div>
```

## Import Organization

**CSS Imports:**
- Google Fonts imported via `@import url()` at top of file
- Multiple CSS files linked in HTML head in order:
```html
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/enhanced.css">
<link rel="stylesheet" href="css/hero-new.css">
```

**JavaScript Loading:**
- External CDN scripts in head (GSAP library):
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```
- Custom scripts loaded at end of body:
```html
<script src="js/gsap-animations-enhanced.js"></script>
```
- Inline scripts for page-specific initialization after external scripts

**Path References:**
- Relative paths throughout: `../css/product.css`, `../../images/favicon.png`
- Canonical URLs use absolute: `https://powerstarapps.com/products/ai-photo.html`

## Error Handling

**JavaScript Patterns:**
- Defensive element checking before manipulation:
```javascript
const hero = document.querySelector('.hero');
if (!hero) return;
```
- Library availability check:
```javascript
if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded');
    return;
}
```
- Image fallback with onerror:
```html
<img onerror="this.src='https://via.placeholder.com/300x400?text=Placeholder'">
```

**Accessibility:**
- Respects `prefers-reduced-motion` media query:
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
    initMinimalAnimations();
}
```

## Logging

**Console Usage:**
- Initialization confirmation:
```javascript
console.log('✅ PowerStar Premium Animations v3.0 initialized');
console.log('🔄 PowerStar animations refreshed');
```
- Warning messages for missing dependencies:
```javascript
console.warn('GSAP not loaded');
console.log('Reduced motion preference detected - animations minimized');
```

## Comments

**Section Headers:**
Major sections use prominent block comments:
```css
/* ========================================
   POWER STAR APPS - LIGHT HOME DESIGN
   ======================================== */

/* ===== Navigation ===== */
/* ===== Hero Section ===== */
```

```javascript
// ========================================
// 1. HERO ANIMATIONS
// ========================================

// ===== Utility =====
```

**Inline Comments:**
- Brief explanations for complex logic
- Todo/status indicators not present (clean production code)

**Documentation Headers:**
Files include version and feature documentation at top:
```javascript
/**
 * PowerStar Website - GSAP Animations
 * Version: 3.0.0 - Premium Animations
 * 
 * Features:
 * - Hero: Banner transitions with text animations
 * - Product Cards: 3D tilt hover, image zoom
 */
```

## Function Design

**Structure:**
- Initialization functions called from DOMContentLoaded:
```javascript
document.addEventListener('DOMContentLoaded', () => {
    initPremiumAnimations();
});

function initPremiumAnimations() {
    initHeroAnimations();
    initBannerSlider();
    initStatsCounter();
}
```
- Each function handles one feature area
- Early return pattern for missing elements

**Event Handlers:**
- Named functions for event listeners
- Mouse event handlers for interactive elements:
```javascript
card.addEventListener('mousemove', (e) => { ... });
card.addEventListener('mouseleave', () => { ... });
```

**Global Functions:**
- Utility functions attached to window for cross-file access:
```javascript
window.refreshPowerStarAnimations = function() { ... };
window.goToSlide = function(index) { ... };
```

## Module Design

**No Module System:**
- Plain script files, no ES modules or CommonJS
- Global scope used for shared state
- Script order matters (GSAP must load before custom scripts)

**File Separation:**
- Separate files for different animation complexity levels:
  - `gsap-animations.js` - Core animations
  - `gsap-animations-enhanced.js` - Premium effects
- Product pages reuse same scripts with relative paths

## HTML Structure Patterns

**Head Section:**
Every page includes consistent head structure:
```html
<head>
    <!-- Google Analytics 4 -->
    <script async src="..."></script>
    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>...</title>
    <meta name="description" content="...">
    <meta name="keywords" content="...">
    <link rel="canonical" href="...">
    
    <!-- Open Graph -->
    <meta property="og:type" content="...">
    ...
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="...">
    ...
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="...">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="...">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="...">
    
    <!-- GSAP -->
    <script src="..."></script>
    
    <!-- Schema.org -->
    <script type="application/ld+json">...</script>
</head>
```

**Navigation Pattern:**
Fixed navbar with dropdown menu:
```html
<nav class="navbar">
    <div class="container">
        <a href="index.html" class="logo">
            <span class="logo-star">★</span> Power Star Apps
        </a>
        <ul class="nav-links">
            <li class="dropdown">
                <a href="#" class="dropdown-toggle">Products ▾</a>
                <ul class="dropdown-menu">
                    <li><a href="products/thermometer.html">Thermometer</a></li>
                    ...
                </ul>
            </li>
        </ul>
    </div>
</nav>
```

**Footer Pattern:**
Consistent footer across pages:
```html
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-brand">...</div>
            <div class="footer-links">
                <div class="footer-column">...</div>
            </div>
        </div>
        <div class="footer-bottom">...</div>
    </div>
</footer>
```

---

*Convention analysis: 2026-04-03*