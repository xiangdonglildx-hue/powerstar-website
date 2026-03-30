# Power Star Apps Website

A modern, responsive website for Power Star Apps product showcase.

## Site Structure

```
powerstar-website/
├── index.html              # Homepage
├── about.html              # About Us page
├── help.html               # Help Center
├── blog.html               # Blog listing
├── faq.html                # FAQ page
├── css/
│   └── style.css           # Styles
├── images/                 # Product images (add your own)
├── products/
│   ├── thermometer.html    # Thermometer product page
│   ├── microphone.html     # Microphone product page
│   ├── voice-changer.html  # Voice Changer product page
│   ├── lumiwall.html       # Lumiwall product page
│   └── ai-photo.html       # AI Photo & Video Filters page
└── README.md
```

## Pages Overview

| Page | URL | Description |
|------|-----|-------------|
| Homepage | `/index.html` | Product overview, stats, download links |
| About Us | `/about.html` | Company mission, values |
| Help Center | `/help.html` | Help categories, contact support |
| Blog | `/blog.html` | Blog posts listing |
| FAQ | `/faq.html` | Frequently asked questions |
| Product Pages | `/products/*.html` | Individual product details |

## Navigation Structure

```
Products ▾           About Us    Help Center    Blog    FAQ
├── Thermometer
├── Microphone
├── Voice Changer
├── Lumiwall
└── AI Photo & Video Filters
```

## Products

| Product | Package Name | Link |
|---------|--------------|------|
| Thermometer | com.firefly.thermometer | [Google Play](https://play.google.com/store/apps/details?id=com.firefly.thermometer) |
| Microphone | com.microphone.bbmic.lite | [Google Play](https://play.google.com/store/apps/details?id=com.microphone.bbmic.lite) |
| Voice Changer | com.lixiangdong.voicechange | [Google Play](https://play.google.com/store/apps/details?id=com.lixiangdong.voicechange) |
| Lumiwall | com.lixiangdong.lumiwall | [Google Play](https://play.google.com/store/apps/details?id=com.lixiangdong.lumiwall) |
| AI Photo & Video Filters | com.lixiangdong.aiphoto | [Google Play](https://play.google.com/store/apps/details?id=com.lixiangdong.aiphoto) |

## Preview

```bash
# Option 1: Open directly
open index.html

# Option 2: Start local server
python3 -m http.server 8000
# Visit http://localhost:8000
```

## Deployment

### Cloudflare Pages

1. Push this folder to GitHub
2. Cloudflare Dashboard → Pages → Create project
3. Connect GitHub repo
4. Deploy

### Manual Upload

1. Cloudflare Dashboard → Pages → Direct Upload
2. Drag and drop the `powerstar-website` folder

## Customization

### Colors
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary: #6366f1;
    --secondary: #0ea5e9;
    --accent: #f59e0b;
}
```

### Add Screenshots
1. Add images to `images/` folder
2. Update HTML with `<img>` tags

### Update Content
- Edit HTML files directly
- All content is static HTML

## Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dropdown navigation menu
- ✅ Product pages with download links
- ✅ About, Help, Blog, FAQ pages
- ✅ Dark theme
- ✅ No framework dependencies
- ✅ Fast loading

---

Created: 2026-03-25
Last Updated: 2026-03-25