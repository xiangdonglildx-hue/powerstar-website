---
phase: 01-foundation-fixes
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - css/mobile-nav.css (new)
  - js/mobile-nav.js (new)
  - css/style.css
  - css/enhanced.css
  - css/product.css
  - css/product-enhanced.css
autonomous: true
requirements_addressed: [BLOCK-01]
must_haves:
  truths:
    - "Hamburger button appears at 768px viewport width"
    - "Hamburger button toggles mobile menu visibility when clicked"
    - "Mobile menu slides in from left with smooth animation"
    - "Mobile menu contains all navigation links from desktop menu"
  artifacts:
    - path: "css/mobile-nav.css"
      provides: "Hamburger icon and mobile menu styles"
      min_lines: 50
    - path: "js/mobile-nav.js"
      provides: "Toggle functionality for mobile menu"
      exports: ["DOMContentLoaded handler"]
    - path: "css/style.css"
      contains: "@media (max-width: 768px)"
      pattern: ".hamburger.*display.*block"
  key_links:
    - from: "js/mobile-nav.js"
      to: ".hamburger class"
      via: "classList.toggle"
    - from: ".hamburger button"
      to: ".mobile-menu"
      via: "click event listener"
---

# Phase 1: Foundation Fixes - Mobile Navigation CSS/JS Infrastructure

## Objective

Create the CSS and JavaScript infrastructure for a hamburger menu navigation system that works on mobile devices (viewport width below 768px). This addresses the critical SEO blocking issue where users cannot navigate the site on mobile due to `display: none` on navigation links with no alternative menu.

**Purpose:** Mobile navigation is Google mobile-first indexing table stakes. Without it, the site receives SEO penalties and users cannot access content on mobile devices.

**Output:** Two new files (`css/mobile-nav.css`, `js/mobile-nav.js`) and modifications to 4 existing CSS files to show hamburger button at mobile breakpoint.

## Context

@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
@.planning/phases/01-foundation-fixes/01-RESEARCH.md

<interfaces>
<!-- Key CSS patterns from existing codebase that executor must follow -->

From css/style.css (lines 724-757):
```css
@media (max-width: 768px) {
    .nav-links { display: none; }
    /* Other mobile styles follow */
}
```

CSS Variables used throughout codebase:
```css
:root {
    --black: #000000;
    --white: #ffffff;
    --orange: #ff4d00;
    --gray-bg: #f5f5f7;
    --radius: 12px;
}
```

Navigation structure (from index.html):
```html
<nav class="navbar">
    <div class="container">
        <a href="index.html" class="logo">...</a>
        <ul class="nav-links">
            <li class="dropdown">...</li>
            <li><a href="about.html">About Us</a></li>
            ...
        </ul>
    </div>
</nav>
```
</interfaces>

## Tasks

### Task 1: Create mobile-nav.css with hamburger and mobile menu styles

<read_first>
- css/style.css
</read_first>

<action>
Create a new file `css/mobile-nav.css` containing:

1. **Hamburger button styles** (hidden on desktop, shown at 768px):
```css
/* Hamburger Menu Styles - Power Star Apps */
/* Used across all pages for mobile navigation */

.hamburger {
    display: none;
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    cursor: pointer;
    position: relative;
    z-index: 1001;
    padding: 4px;
}

.hamburger-line {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--black);
    margin: 5px auto;
    transition: all 0.3s ease;
    border-radius: 1px;
}

/* Show hamburger on mobile */
@media (max-width: 768px) {
    .hamburger {
        display: block;
        order: 2;
        margin-left: auto;
    }
}
```

2. **Mobile menu overlay styles**:
```css
/* Mobile menu overlay */
.mobile-menu {
    display: none;
    position: fixed;
    top: 0;
    left: -100%;
    width: 80%;
    max-width: 300px;
    height: 100vh;
    background: var(--white);
    z-index: 1000;
    transition: left 0.3s ease;
    padding: 80px 24px 24px;
    box-shadow: 4px 0 20px rgba(0,0,0,0.1);
    overflow-y: auto;
}

@media (max-width: 768px) {
    .mobile-menu {
        display: block;
    }
    
    .mobile-menu.active {
        left: 0;
    }
}

.mobile-nav-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
    margin: 0;
}

.mobile-nav-links li {
    border-bottom: 1px solid var(--gray-bg);
}

.mobile-nav-links a {
    font-size: 1.1rem;
    padding: 16px 0;
    display: block;
    color: var(--black);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
}

.mobile-nav-links a:hover {
    color: var(--orange);
}

/* Mobile dropdown handling */
.mobile-nav-links .dropdown-menu {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    background: var(--gray-bg);
    border-radius: var(--radius);
    margin: 8px 0 16px;
    padding: 8px 0;
}

.mobile-nav-links .dropdown-menu a {
    padding: 10px 16px;
    font-size: 0.95rem;
}
```

3. **Hamburger animation when active**:
```css
/* Hamburger animation when menu is open */
.hamburger.active .hamburger-line:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active .hamburger-line:nth-child(2) {
    opacity: 0;
}

.hamburger.active .hamburger-line:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
}

/* Overlay backdrop when menu is open */
.mobile-menu-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 999;
}

@media (max-width: 768px) {
    .mobile-menu-overlay.active {
        display: block;
    }
}
```

Use existing CSS variables (`--black`, `--white`, `--orange`, `--gray-bg`, `--radius`) to maintain consistency with codebase.
</action>

<acceptance_criteria>
- File `css/mobile-nav.css` exists with at least 80 lines of CSS
- File contains `.hamburger` class definition
- File contains `.mobile-menu` class definition
- File contains `@media (max-width: 768px)` breakpoint
- All CSS uses existing CSS variables (`var(--black)`, `var(--white)`, etc.)
- Hamburger has 3 `.hamburger-line` spans
- Mobile menu has `left: -100%` default position and `left: 0` when `.active`
</acceptance_criteria>

### Task 2: Create mobile-nav.js with toggle functionality

<read_first>
- js/gsap-animations-enhanced.js (to understand existing JS patterns)
</read_first>

<action>
Create a new file `js/mobile-nav.js` containing vanilla JavaScript for hamburger menu toggle:

```javascript
/**
 * Mobile Navigation Toggle - Power Star Apps
 * Vanilla JS hamburger menu functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    
    // Exit if elements don't exist
    if (!hamburger || !mobileMenu) {
        console.warn('Mobile nav elements not found');
        return;
    }
    
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
    });
    
    // Close menu on overlay click
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeMenu();
        });
    }
    
    // Close menu on link click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    function toggleMenu() {
        const isActive = hamburger.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    function openMenu() {
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        if (overlay) overlay.classList.add('active');
        
        // Update ARIA attributes
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        
        // Update ARIA attributes
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
});
```

The script must:
1. Use vanilla JavaScript (no jQuery, no GSAP dependency)
2. Handle DOMContentLoaded event
3. Toggle `.active` class on hamburger, mobile-menu, and overlay
4. Update ARIA attributes for accessibility (aria-expanded, aria-hidden)
5. Prevent body scroll when menu is open
6. Close menu on: overlay click, link click, Escape key press
7. Console warn if elements not found (graceful degradation)
</action>

<acceptance_criteria>
- File `js/mobile-nav.js` exists with at least 60 lines
- File contains `document.addEventListener('DOMContentLoaded'` 
- File contains `hamburger.addEventListener('click'`
- File contains `classList.toggle` or `classList.add/remove` for `.active`
- File sets `aria-expanded` attribute on hamburger
- File sets `aria-hidden` attribute on mobile-menu
- File handles Escape key to close menu
- File prevents body scroll when menu open (`document.body.style.overflow = 'hidden'`)
</acceptance_criteria>

### Task 3: Update 4 existing CSS files to show hamburger at 768px

<read_first>
- css/style.css
- css/enhanced.css
- css/product.css
- css/product-enhanced.css
</read_first>

<action>
Modify each of the 4 CSS files to update the 768px media query:

1. **css/style.css** (line ~724): Find the existing `@media (max-width: 768px)` block. Replace:
```css
.nav-links { display: none; }
```
With:
```css
.nav-links { display: none; }
.hamburger { display: block; order: 2; margin-left: auto; }
```

2. **css/enhanced.css**: Search for `@media (max-width: 768px)` block. Add the hamburger display rule if `.nav-links { display: none; }` exists. If no 768px block exists, add one at the end:
```css
@media (max-width: 768px) {
    .nav-links { display: none; }
    .hamburger { display: block; order: 2; margin-left: auto; }
}
```

3. **css/product.css** (line ~598): Same modification - ensure hamburger shows at 768px.

4. **css/product-enhanced.css**: Same modification.

For each file, the pattern is:
- Find: `.nav-links { display: none; }` inside `@media (max-width: 768px)`
- Add after it: `.hamburger { display: block; order: 2; margin-left: auto; }`

This ensures the hamburger button (defined in mobile-nav.css) becomes visible when nav-links are hidden.
</action>

<acceptance_criteria>
- grep output shows `.hamburger.*display.*block` in css/style.css within @media block
- grep output shows `.hamburger.*display.*block` in css/enhanced.css within @media block  
- grep output shows `.hamburger.*display.*block` in css/product.css within @media block
- grep output shows `.hamburger.*display.*block` in css/product-enhanced.css within @media block
- All 4 files still have `.nav-links.*display.*none` in the same @media block
- No duplicate hamburger definitions in the same file
</acceptance_criteria>

## Verification

After all tasks complete, verify:

1. **File existence:**
```bash
ls -la css/mobile-nav.css js/mobile-nav.js
```

2. **CSS integration:**
```bash
grep -n "hamburger" css/style.css css/enhanced.css css/product.css css/product-enhanced.css css/mobile-nav.css
```

3. **JS functionality check:**
```bash
grep -n "addEventListener" js/mobile-nav.js
grep -n "aria-expanded" js/mobile-nav.js
```

4. **Manual browser test** (executor should note for Wave 2 verification):
- Load index.html in browser
- Resize to 768px width
- Verify hamburger button appears
- Note: Full functionality testing requires HTML updates (Wave 2)

## Must Haves

**Observable truths when complete:**
- Hamburger button CSS exists and is ready to be added to HTML pages
- JavaScript toggle function exists and is ready to control menu visibility
- All 4 CSS files reference hamburger display at mobile breakpoint
- Files use existing CSS variables for consistency
- ARIA attributes support accessibility

**Required artifacts:**
- `css/mobile-nav.css` - 80+ lines of hamburger/mobile menu CSS
- `js/mobile-nav.js` - 60+ lines of vanilla JS toggle
- Modified `css/style.css`, `css/enhanced.css`, `css/product.css`, `css/product-enhanced.css`

**Key links established:**
- `.hamburger` button CSS defined in mobile-nav.css
- `.mobile-menu` overlay CSS defined in mobile-nav.css
- JS toggles `.active` class to show/hide menu
- ARIA attributes for screen reader compatibility

## Success Criteria

- [ ] css/mobile-nav.css created with hamburger styles, mobile-menu styles, animations
- [ ] js/mobile-nav.js created with toggle functionality, accessibility attributes
- [ ] All 4 CSS files have hamburger display rule in 768px media query
- [ ] CSS uses existing codebase variables (--black, --white, --orange, etc.)
- [ ] JS uses vanilla JavaScript (no jQuery dependency)
- [ ] JS includes ARIA attribute updates for accessibility
- [ ] Files committed to git

## Output

After completion, create `.planning/phases/01-foundation-fixes/01-01-SUMMARY.md` documenting:
- Files created and modified
- CSS classes defined
- JS functions created
- Integration notes for Wave 2 (HTML updates)