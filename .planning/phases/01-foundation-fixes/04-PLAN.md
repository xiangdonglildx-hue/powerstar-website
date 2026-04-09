---
phase: 01-foundation-fixes
plan: 04
type: execute
wave: 1
depends_on: []
files_modified:
  - images/demo/ (new directory)
  - images/demo/anime-before.jpg (new)
  - images/demo/anime-after.jpg (new)
  - images/demo/cartoon-before.jpg (new)
  - images/demo/cartoon-after.jpg (new)
  - images/demo/vintage-90s-before.jpg (new)
  - images/demo/vintage-90s-after.jpg (new)
  - images/demo/aesthetic-before.jpg (new)
  - images/demo/aesthetic-after.jpg (new)
  - images/demo/instagram-before.jpg (new)
  - images/demo/instagram-after.jpg (new)
  - images/demo/tiktok-before.jpg (new)
  - images/demo/tiktok-after.jpg (new)
  - images/demo/selfies-before.jpg (new)
  - images/demo/selfies-after.jpg (new)
  - images/demo/pets-before.jpg (new)
  - images/demo/pets-after.jpg (new)
  - images/demo/lensa-before.jpg (new)
  - images/demo/lensa-after.jpg (new)
  - images/demo/influencers-before.jpg (new)
  - images/demo/influencers-after.jpg (new)
autonomous: true
requirements_addressed: [BLOCK-03]
must_haves:
  truths:
    - "images/demo/ directory exists"
    - "20 image files exist in images/demo/ (10 before, 10 after)"
    - "Landing pages load demo images without triggering placeholder.com fallback"
    - "Image filenames match landing page src references exactly"
  artifacts:
    - path: "images/demo/"
      provides: "Demo transformation images"
      file_count: 20
      naming: "{scene}-before.jpg, {scene}-after.jpg"
    - path: "products/ai-photo/anime-style.html"
      pattern: "src=\"../../images/demo/anime-before.jpg\""
      onerror: "onerror fallback should not trigger if image exists"
  key_links:
    - from: "products/ai-photo/*.html"
      to: "images/demo/*.jpg"
      via: "img src attribute"
      count: "20 image references"
---

# Phase 1: Foundation Fixes - Demo Images

## Objective

Create the `images/demo/` directory and placeholder demonstration images for the 10 scene landing pages. Each landing page expects before/after transformation images that currently fall back to placeholder.com via `onerror` handlers.

**Purpose:** Landing pages without real demo images hurt conversion credibility. Users expect to see before/after examples of the AI photo transformations.

**Output:** 20 placeholder images (10 before, 10 after) in `images/demo/` directory matching the filenames referenced by landing pages.

## Context

@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
@.planning/phases/01-foundation-fixes/01-RESEARCH.md
@products/ai-photo/anime-style.html

<interfaces>
<!-- Image references from landing pages -->

Image src pattern from anime-style.html (lines 213-219):
```html
<img src="../../images/demo/anime-before.jpg" alt="Original selfie photo" 
     onerror="this.src='https://via.placeholder.com/300x400?text=Your+Photo'">
<img src="../../images/demo/anime-after.jpg" alt="Anime style result"
     onerror="this.src='https://via.placeholder.com/300x400?text=Anime+Style'">
```

Required image filenames (from RESEARCH.md):
| Landing Page | Before Image | After Image |
|--------------|--------------|-------------|
| anime-style.html | anime-before.jpg | anime-after.jpg |
| cartoon-style.html | cartoon-before.jpg | cartoon-after.jpg |
| vintage-90s-style.html | vintage-90s-before.jpg | vintage-90s-after.jpg |
| aesthetic-style.html | aesthetic-before.jpg | aesthetic-after.jpg |
| for-instagram.html | instagram-before.jpg | instagram-after.jpg |
| for-tiktok.html | tiktok-before.jpg | tiktok-after.jpg |
| for-selfies.html | selfies-before.jpg | selfies-after.jpg |
| for-pets.html | pets-before.jpg | pets-after.jpg |
| lensa-alternative.html | lensa-before.jpg | lensa-after.jpg |
| for-influencers.html | influencers-before.jpg | influencers-after.jpg |

Image dimensions: 300x400 (portrait aspect ratio for photo transformations)
</interfaces>

## Tasks

### Task 1: Create images/demo/ directory structure

<read_first>
- products/ai-photo/anime-style.html (to confirm image path expectations)
</read_first>

<action>
Create the demo images directory:

```bash
mkdir -p images/demo
```

Verify directory creation:
```bash
ls -la images/demo/
```

The directory should be empty initially, ready for image files.
</action>

<acceptance_criteria>
- Directory `images/demo/` exists
- `ls images/demo/` shows empty directory or confirms creation
- Directory has proper permissions for adding files
</acceptance_criteria>

### Task 2: Create placeholder demo images for all 10 landing pages

<read_first>
- products/ai-photo/anime-style.html
- products/ai-photo/cartoon-style.html
- products/ai-photo/vintage-90s-style.html
</read_first>

<action>
Create 20 placeholder images matching the exact filenames referenced by landing pages.

**Approach:** Use simple placeholder images with descriptive text. Since this is a static site without image generation tools, create minimal placeholder images or document the requirement for manual image creation.

**Option A - SVG placeholder approach** (if image generation tools available):

Create simple SVG placeholder images that can be converted to JPG:

```xml
<!-- Before image template -->
<svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f0f0f0"/>
  <text x="150" y="200" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#666">
    Original Photo
  </text>
  <text x="150" y="220" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#999">
    [Scene Name] Before
  </text>
</svg>
```

**Option B - Download placeholder images** (recommended for speed):

Use placeholder services to download images with correct dimensions:
```bash
# Download placeholder images for each scene
curl -o images/demo/anime-before.jpg "https://via.placeholder.com/300x400/f0f0f0/666666?text=Original+Photo"
curl -o images/demo/anime-after.jpg "https://via.placeholder.com/300x400/ff4d00/ffffff?text=Anime+Style"

curl -o images/demo/cartoon-before.jpg "https://via.placeholder.com/300x400/f0f0f0/666666?text=Original+Photo"
curl -o images/demo/cartoon-after.jpg "https://via.placeholder.com/300x400/00c4ff/ffffff?text=Cartoon+Style"

# Continue for all 10 scenes with appropriate theme colors for "after" images
```

**Theme colors for after images (matching landing page themes):**
- anime-after: #ff4d00 (orange)
- cartoon-after: #00c4ff (blue)
- vintage-90s-after: #9b59b6 (purple)
- aesthetic-after: #e91e63 (pink)
- instagram-after: #e1306c (instagram pink)
- tiktok-after: #00f2ea (tiktok cyan)
- selfies-after: #ff6b6b (coral)
- pets-after: #27ae60 (green)
- lensa-after: #8e44ad (violet)
- influencers-after: #f39c12 (gold)

**Option C - Create with Python** (if PIL available):

```python
from PIL import Image, ImageDraw, ImageFont

def create_placeholder(filename, width, height, bg_color, text, text_color):
    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    draw.text((width//2, height//2), text, fill=text_color, anchor='mm')
    img.save(filename)

# Create all 20 images...
```

**Execute:** Choose the fastest available method to create 20 placeholder JPG files (300x400 pixels) with correct filenames.

If no image creation tools are available, document this as a manual user action:
```markdown
## Manual Action Required

Create the following placeholder images manually or using an image editor:
- images/demo/anime-before.jpg (300x400, gray background, "Original Photo" text)
- images/demo/anime-after.jpg (300x400, #ff4d00 background, "Anime Style" text)
... (list all 20)
```
</action>

<acceptance_criteria>
- `ls images/demo/*.jpg | wc -l` returns 20
- All 20 expected filenames exist: anime-before.jpg, anime-after.jpg, cartoon-before.jpg, etc.
- Files are valid JPG images (can be opened/verified)
- Image dimensions are 300x400 (portrait orientation)
- Files have reasonable size (under 50KB for placeholders)
</acceptance_criteria>

## Verification

After tasks complete, verify:

1. **Directory and file count:**
```bash
ls -la images/demo/
ls images/demo/*.jpg | wc -l
# Expected: 20 files
```

2. **Filename verification:**
```bash
ls images/demo/ | sort
# Expected sorted output:
# aesthetic-after.jpg
# aesthetic-before.jpg
# anime-after.jpg
# anime-before.jpg
# cartoon-after.jpg
# cartoon-before.jpg
# influencers-after.jpg
# influencers-before.jpg
# instagram-after.jpg
# instagram-before.jpg
# lensa-after.jpg
# lensa-before.jpg
# pets-after.jpg
# pets-before.jpg
# selfies-after.jpg
# selfies-before.jpg
# tiktok-after.jpg
# tiktok-before.jpg
# vintage-90s-after.jpg
# vintage-90s-before.jpg
```

3. **Image validity check:**
```bash
file images/demo/*.jpg
# Each should show: "JPEG image data"
```

4. **Landing page integration test:**
```bash
# Verify landing pages reference correct paths
grep -h "images/demo" products/ai-photo/*.html | head -5
```

5. **Manual visual test** (executor note):
- Load anime-style.html in browser
- Verify before/after images load (no placeholder.com fallback)
- Check DevTools Network shows images/demo/anime-before.jpg loaded successfully

## Must Haves

**Observable truths when complete:**
- images/demo/ directory exists
- 20 JPG files exist with correct filenames
- Landing pages load images without triggering onerror fallback
- Images are portrait orientation (300x400)

**Required artifacts:**
- `images/demo/` directory
- 20 placeholder JPG images
- Correct filenames matching landing page references

**Key links:**
- Landing pages → images/demo/*.jpg via img src
- Image dimensions → 300x400 portrait
- onerror fallback → should not trigger when images exist

## Success Criteria

- [ ] images/demo/ directory created
- [ ] 20 placeholder images created with correct filenames
- [ ] All images are valid JPG files
- [ ] Images are 300x400 dimensions (portrait)
- [ ] Landing pages can load images without fallback
- [ ] Files committed to git

## Output

After completion, create `.planning/phases/01-foundation-fixes/01-04-SUMMARY.md` documenting:
- Directory creation
- Image creation method used
- File count and names
- Verification that landing pages load images correctly
- Note for future: Replace placeholders with real AI-generated transformations