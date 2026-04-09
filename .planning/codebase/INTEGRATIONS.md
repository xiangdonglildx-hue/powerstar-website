# External Integrations

**Analysis Date:** 2026-04-03

## APIs & External Services

**Analytics:**
- Google Analytics 4 (GA4)
  - Measurement ID: `G-HRVN6H8K26`
  - Implementation: Inline script in all HTML `<head>` sections
  - Script: `https://www.googletagmanager.com/gtag/js?id=G-HRVN6H8K26`
  - Files: All `.html` files include tracking code

**Typography:**
- Google Fonts API
  - Fonts: Bebas Neue, Work Sans (weights: 300, 400, 500, 600, 700)
  - Preconnect: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`
  - CSS: `https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Work+Sans:wght@300;400;500;600;700&display=swap`

**Animation Library:**
- GSAP (GreenSock Animation Platform)
  - Version: 3.12.5
  - Source: cdnjs (Cloudflare CDN)
  - Core: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
  - ScrollTrigger: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`

## Data Storage

**Databases:**
- None - Static site, no database

**File Storage:**
- Local filesystem only (static files)
- No cloud storage integration

**Caching:**
- Browser caching via nginx Cache-Control headers
- CDN: Implicit via Cloud Run

## Authentication & Identity

**Auth Provider:**
- None - No authentication required
- Public static website

## External Links & Integrations

**Google Play Store:**
- Developer Page: `https://play.google.com/store/apps/dev?id=PowerStarApps`
- App links in product pages:
  - Thermometer: `com.firefly.thermometer`
  - Microphone: `com.microphone.bbmic.lite`
  - Voice Changer: `com.lixiangdong.voicechange`
  - Lumiwall: `com.lixiangdong.lumiwall`
  - AI Photo: `com.lixiangdong.aiphoto`

**Contact Integration:**
- Email links: `xiangdong.li.ldx@gmail.com`, `moreapps.service@gmail.com`
- Support: `support@powerstarapps.com`

## Monitoring & Observability

**Error Tracking:**
- None - No error tracking service

**Logs:**
- nginx access/error logs (standard)
- Cloud Run logging (platform level)

## CI/CD & Deployment

**Hosting:**
- Google Cloud Run
  - Region: `us-west1`
  - Image Registry: `us-west1-docker.pkg.dev/${PROJECT_ID}/cloud-run-source-deploy/powerstar-website`
  - Public access (unauthenticated)

**CI Pipeline:**
- Google Cloud Build
  - Config: `/cloudbuild.yaml`
  - Build steps:
    1. Docker build
    2. Push to Artifact Registry
    3. Deploy to Cloud Run
  - Timeout: 600s
  - Logs: `gs://${PROJECT_ID}_cloudbuild_logs`

**Build Artifacts:**
- Docker image tagged with `${SHORT_SHA}` (git commit SHA)

## Environment Configuration

**Required env vars:**
- None for application (static site)
- Cloud Build: `PROJECT_ID` (injected by Cloud Build)
- Cloud Run: `PORT` (default 8080)

**Secrets location:**
- None - No secrets management required
- No `.env` files present

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## SEO & Metadata

**Structured Data (Schema.org):**
- Organization schema on homepage
- WebSite schema with SearchAction
- MobileApplication schema on product pages
- FAQPage schema on FAQ pages

**Social Media:**
- Open Graph meta tags (og:type, og:url, og:title, og:description, og:image)
- Twitter Card meta tags (summary_large_image)

**Sitemap:**
- XML sitemap at `/sitemap.xml`
- Registered in `/robots.txt`

## Content Delivery

**CDN:**
- Implicit via Google Cloud Run
- Static asset caching configured in nginx:
  ```nginx
  location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
  }
  ```

**Gzip Compression:**
- Enabled in nginx for: text/plain, text/css, application/json, application/javascript, text/xml, application/xml, image/svg+xml

## Third-Party Content

**External Resources:**
| Resource | Source | Purpose |
|----------|--------|---------|
| Google Fonts | fonts.googleapis.com | Typography |
| GSAP Library | cdnjs.cloudflare.com | Animations |
| Google Analytics | googletagmanager.com | Analytics |

**Privacy Considerations:**
- Google Analytics collects user data
- No cookie consent banner currently implemented (has `/cookies.html` policy page)
- No GDPR/CCPA compliance implementation detected

## LLM Integration

**llms.txt:**
- File: `/llms.txt`
- Format: llms.txt v0.2
- Purpose: Machine-readable content for AI systems
- Contains: Company info, product details, FAQs, contact information

---

*Integration audit: 2026-04-03*