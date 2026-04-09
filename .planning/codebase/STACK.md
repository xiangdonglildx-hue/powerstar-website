# Technology Stack

**Analysis Date:** 2026-04-03

## Languages

**Primary:**
- HTML5 - Static markup for all pages
- CSS3 - Custom styling with CSS variables
- JavaScript (ES6+) - Client-side animations and interactions

**Secondary:**
- None - Pure static site, no backend languages

## Runtime

**Environment:**
- Static files served via nginx
- No server-side runtime required
- Browser-only execution

**Package Manager:**
- Not applicable - No package.json or dependency management
- All external libraries loaded via CDN

## Frameworks

**Core:**
- None - Vanilla HTML/CSS/JS architecture

**Animation Library:**
- GSAP 3.12.5 - Animation platform
  - Loaded from cdnjs: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
  - ScrollTrigger plugin: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`
  - Used in `/js/gsap-animations.js`, `/js/gsap-animations-enhanced.js`, `/js/animations.js`

**Typography:**
- Google Fonts
  - Bebas Neue (display/headings)
  - Work Sans (body text)

## Key Dependencies

**External CDN Libraries:**
- GSAP 3.12.5 - Animation library
- Google Fonts (Bebas Neue, Work Sans) - Typography

**Infrastructure:**
- nginx:alpine - Docker web server
- Google Cloud Run - Hosting platform
- Google Cloud Build - CI/CD pipeline

## Configuration

**Environment:**
- No environment variables required
- Static configuration embedded in HTML files
- Google Analytics ID: G-HRVN6H8K26 (hardcoded in all HTML files)

**Build:**
- No build step required
- Direct file serving via nginx
- Docker configuration in `/Dockerfile`
- nginx configuration in `/nginx.conf` and `/default.conf`

## Platform Requirements

**Development:**
- Any static file server (Python http.server, Live Server, etc.)
- No build tools or compilation required
- Direct HTML file editing

**Production:**
- Docker container runtime
- Google Cloud Run (us-west1 region)
- Artifact Registry for Docker images

## File Structure Summary

```
powerstar-website/
├── index.html              # Homepage
├── about.html              # About page
├── blog.html               # Blog listing
├── help.html               # Help center
├── faq.html                # FAQ page
├── privacy.html            # Privacy policy
├── terms.html              # Terms of service
├── cookies.html            # Cookie policy
├── sitemap.xml             # XML sitemap
├── robots.txt              # Search engine directives
├── llms.txt                # AI/LLM readable content
├── css/
│   ├── style.css           # Base styles
│   ├── enhanced.css        # Enhanced component styles
│   ├── hero-new.css        # Hero section styles
│   ├── product.css         # Product page styles
│   ├── product-enhanced.css # Enhanced product styles
│   └── banners.css         # Banner styles
├── js/
│   ├── animations.js       # GSAP animations
│   ├── gsap-animations.js  # Full GSAP implementation
│   └── gsap-animations-enhanced.js # Enhanced animations
├── images/                 # Static images
├── products/               # Product pages
│   ├── thermometer.html
│   ├── microphone.html
│   ├── voice-changer.html
│   ├── lumiwall.html
│   ├── ai-photo.html
│   └── ai-photo/          # AI Photo subpages (10 pages)
├── blog/                   # Blog articles (5 articles)
└── seo/                    # SEO documentation
```

## CSS Architecture

**Variables (CSS Custom Properties):**
Defined in `/css/style.css`:
```css
:root {
    --black: #000000;
    --black-elevated: #0a0a0a;
    --black-card: #111111;
    --orange: #ff4d00;
    --orange-glow: rgba(255, 77, 0, 0.4);
    --cyan: #00fff0;
    --white: #ffffff;
    --gray: #666666;
    --radius: 12px;
    --shadow: 0 4px 24px rgba(0,0,0,0.08);
}
```

**Typography Scale:**
- h1: `clamp(3rem, 8vw, 5rem)`
- h2: `clamp(2rem, 5vw, 3rem)`
- h3: `clamp(1.25rem, 3vw, 1.75rem)`

## JavaScript Architecture

**Animation Files:**
- `/js/animations.js` - Base animations (v2.1.0)
- `/js/gsap-animations.js` - Premium animations (v3.0.0)
- `/js/gsap-animations-enhanced.js` - Enhanced animations

**Animation Features:**
- Hero section animations with parallax
- Stats counter with scroll trigger
- Product card hover effects
- Staggered entrance animations
- Reduced motion support (`prefers-reduced-motion`)

## Deployment Configuration

**Dockerfile:**
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
RUN rm -f /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

**nginx Configuration:**
- Port: 8080 (Cloud Run requirement)
- Gzip compression enabled
- Static asset caching: 1 year (images, CSS, JS, fonts)
- HTML no-cache policy

---

*Stack analysis: 2026-04-03*