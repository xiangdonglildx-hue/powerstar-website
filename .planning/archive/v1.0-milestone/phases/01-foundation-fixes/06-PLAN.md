---
phase: 01-foundation-fixes
plan: 06
type: execute
wave: 3
depends_on: [05-PLAN]
files_modified: []
autonomous: true
requirements_addressed: [BLOCK-05]
must_haves:
  truths:
    - "All product pages pass Google Rich Results Test for MobileApplication schema"
    - "All product pages pass Google Rich Results Test for FAQPage schema (if present)"
    - "index.html passes Google Rich Results Test for Organization schema"
    - "index.html passes Google Rich Results Test for WebSite schema"
    - "No Schema.org validation errors detected"
    - "All schema required fields are present (name, operatingSystem, applicationCategory)"
  artifacts:
    - path: "products/ai-photo.html"
      schema_types: ["MobileApplication", "FAQPage"]
      validation: "passes Rich Results Test"
    - path: "index.html"
      schema_types: ["Organization", "WebSite"]
      validation: "passes Rich Results Test"
  key_links:
    - from: "Schema.org JSON-LD"
      to: "Google Rich Results Test"
      via: "URL submission"
      tool: "https://search.google.com/test/rich-results"
---

# Phase 1: Foundation Fixes - Schema.org Validation

## Objective

Validate all existing Schema.org JSON-LD structured data on the website using Google Rich Results Test. Ensure all schemas pass validation without errors. Document any warnings and fix critical issues.

**Purpose:** Invalid structured data means no rich results in Google search. This validation ensures the SEO investment in Schema.org markup actually delivers rich result eligibility.

**Output:** Validation report documenting all pages tested, results, and any fixes applied.

## Context

@.planning/REQUIREMENTS.md
@.planning/ROADMAP.md
@.planning/phases/01-foundation-fixes/01-RESEARCH.md

<interfaces>
<!-- Pages to validate and their schema types -->

Pages with Schema.org JSON-LD:
| Page | Schema Types | Location |
|------|--------------|----------|
| index.html | Organization, WebSite | lines 52-82 |
| products/thermometer.html | MobileApplication, FAQPage | in <head> |
| products/microphone.html | MobileApplication, FAQPage | in <head> |
| products/voice-changer.html | MobileApplication, FAQPage | in <head> |
| products/lumiwall.html | MobileApplication, FAQPage | in <head> |
| products/ai-photo.html | MobileApplication, FAQPage | in <head> |
| products/ai-photo/anime-style.html | MobileApplication | lines 150-163 |
| products/ai-photo/cartoon-style.html | MobileApplication | in <head> |
| (other 8 landing pages) | MobileApplication | in <head> |

Required fields for MobileApplication:
- name (string)
- operatingSystem (string, e.g., "Android")
- applicationCategory (string, e.g., "PhotographyApplication")
- offers.price (number)
- offers.priceCurrency (string, e.g., "USD")

Required fields for FAQPage:
- mainEntity (array of Question objects)
- Each Question: name (string), acceptedAnswer (Answer object)
- Each Answer: text (string)

Validation tool URL: https://search.google.com/test/rich-results
</interfaces>

## Tasks

### Task 1: Validate all pages with Google Rich Results Test

<read_first>
- index.html
- products/ai-photo.html
- products/ai-photo/anime-style.html
</read_first>

<action>
Use Google Rich Results Test to validate Schema.org markup on all pages.

**Validation Procedure:**

For each page, perform:
1. Open https://search.google.com/test/rich-results
2. Enter the page URL (e.g., https://powerstarapps.com/products/ai-photo.html)
   - If deployed: use live URL
   - If not deployed: use "Code" tab to paste HTML content
3. Click "Test URL" or "Test Code"
4. Review results for each schema type detected
5. Document: schema type, status (pass/error/warning), issues

**Pages to validate (priority order):**

1. **index.html** (Organization + WebSite schemas)
   - Expected: Organization schema passes
   - Expected: WebSite schema passes
   - Check: name, url, logo fields present

2. **products/ai-photo.html** (MobileApplication + FAQPage)
   - Expected: MobileApplication passes
   - Expected: FAQPage passes (if present)
   - Check: name, operatingSystem, applicationCategory, offers

3. **products/thermometer.html** (MobileApplication + FAQPage)
4. **products/microphone.html** (MobileApplication + FAQPage)
5. **products/voice-changer.html** (MobileApplication + FAQPage)
6. **products/lumiwall.html** (MobileApplication + FAQPage)

7. **products/ai-photo/anime-style.html** (MobileApplication only)
8. **products/ai-photo/cartoon-style.html** (MobileApplication)
9. **products/ai-photo/vintage-90s-style.html** (MobileApplication)
10. **products/ai-photo/aesthetic-style.html** (MobileApplication)
11. **products/ai-photo/for-instagram.html** (MobileApplication)
12. **products/ai-photo/for-tiktok.html** (MobileApplication)
13. **products/ai-photo/for-selfies.html** (MobileApplication)
14. **products/ai-photo/for-pets.html** (MobileApplication)
15. **products/ai-photo/lensa-alternative.html** (MobileApplication)
16. **products/ai-photo/for-influencers.html** (MobileApplication)

**If site not deployed:** Use the "Code" tab in Rich Results Test to paste HTML content from each file.

**Create validation report:**
```markdown
## Schema.org Validation Report

### Summary
- Pages validated: X
- Schemas passing: X
- Schemas with errors: X
- Schemas with warnings: X

### Detailed Results

| Page | Schema Type | Status | Issues |
|------|-------------|--------|--------|
| index.html | Organization | Pass | None |
| index.html | WebSite | Pass | None |
| products/ai-photo.html | MobileApplication | Pass | None |
| products/ai-photo.html | FAQPage | Pass | None |
| ... | ... | ... | ... |

### Errors Found (if any)
[List specific errors and recommended fixes]

### Warnings Found (if any)
[List warnings - these don't block rich results but should be addressed]
```
</action>

<acceptance_criteria>
- Validation report created documenting all 16+ pages tested
- All MobileApplication schemas pass validation
- All FAQPage schemas pass validation (where present)
- Organization and WebSite schemas on index.html pass
- No critical errors blocking rich results
- Required fields confirmed present: name, operatingSystem, applicationCategory
- Report saved to .planning/phases/01-foundation-fixes/SCHEMA-VALIDATION-REPORT.md
</acceptance_criteria>

### Task 2: Fix any Schema.org validation errors found

<read_first>
- Any file with validation errors from Task 1
</read_first>

<action>
If validation reveals errors, fix them in the appropriate HTML files:

**Common Schema.org errors and fixes:**

1. **Missing `applicationCategory`**:
   - Add: `"applicationCategory": "PhotographyApplication"` (for AI Photo)
   - Add: `"applicationCategory": "UtilityApplication"` (for Thermometer)
   - Add: `"applicationCategory": "EntertainmentApplication"` (for Voice Changer)
   - Add: `"applicationCategory": "PersonalizationApplication"` (for Lumiwall)

2. **Missing `operatingSystem`**:
   - Add: `"operatingSystem": "Android"`

3. **Missing `offers.priceCurrency`**:
   - Add: `"priceCurrency": "USD"` when price is "0"

4. **FAQPage `mainEntity` not array**:
   - Ensure: `"mainEntity": [{"@type": "Question", ...}]`
   - Not: `"mainEntity": {"@type": "Question", ...}` (single object)

5. **Missing Question `acceptedAnswer`**:
   - Each Question must have: `"acceptedAnswer": {"@type": "Answer", "text": "..."}`

**Fix procedure:**
1. Read the file with error
2. Locate the JSON-LD script block
3. Fix the specific issue
4. Re-validate with Rich Results Test
5. Confirm fix resolved the error

If no errors found, document: "All schemas pass validation - no fixes required."
</action>

<acceptance_criteria>
- If errors existed, grep shows fixes applied to affected files
- Re-validation shows all schemas passing
- No remaining validation errors
- All fixes documented in validation report
</acceptance_criteria>

## Verification

After tasks complete, verify:

1. **Validation report exists:**
```bash
ls .planning/phases/01-foundation-fixes/SCHEMA-VALIDATION-REPORT.md
```

2. **Report shows pass status:**
```bash
grep -c "Pass" .planning/phases/01-foundation-fixes/SCHEMA-VALIDATION-REPORT.md
# Expected: multiple (one per schema type)
```

3. **No errors in report:**
```bash
grep -c "Error" .planning/phases/01-foundation-fixes/SCHEMA-VALIDATION-REPORT.md
# Expected: 0 (or count of fixed errors with resolution noted)
```

4. **Schema files valid JSON:**
```bash
# Extract and validate JSON-LD from a sample file
grep -A 50 'application/ld+json' products/ai-photo.html | head -20
# Should show valid JSON structure
```

5. **Manual verification** (executor note):
- Open Rich Results Test for each critical page
- Confirm "Page is eligible for rich results" message
- Check detected schema types match expected

## Must Haves

**Observable truths when complete:**
- All product pages pass Rich Results Test for MobileApplication
- index.html passes for Organization and WebSite
- FAQPage schemas pass where present
- Validation report documents all results
- No blocking errors remain

**Required artifacts:**
- `.planning/phases/01-foundation-fixes/SCHEMA-VALIDATION-REPORT.md`
- All tested pages have passing validation status
- Any fixes applied are documented

**Key links:**
- Schema.org JSON-LD → Rich Results Test validation
- Validation report → phase completion documentation
- Google Search → rich results eligibility confirmed

## Success Criteria

- [ ] All 16+ pages validated with Rich Results Test
- [ ] All MobileApplication schemas pass
- [ ] All FAQPage schemas pass
- [ ] Organization and WebSite schemas pass
- [ ] Validation report created
- [ ] Any errors found are fixed
- [ ] No blocking validation issues remain
- [ ] Report committed to .planning/

## Output

After completion, create `.planning/phases/01-foundation-fixes/01-06-SUMMARY.md` documenting:
- Total pages validated
- Schema types tested
- Pass/fail counts
- Any fixes applied
- Rich results eligibility confirmed