# Google Cloud Platform Service Account Setup Guide

This guide walks you through setting up a Google Cloud Platform (GCP) Service Account for authenticating with the Google Search Console API.

## Prerequisites

- A Google account with access to the PowerStar GCP project
- Owner or Editor access to the Google Search Console property for powerstarapps.com
- Approximately 15-20 minutes

---

## Section 1: Create or Select Google Cloud Project

If you already have a GCP project for PowerStar, skip to Section 2.

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Sign in with your Google account
3. Click the project selector at the top of the page (next to "Google Cloud")
4. Click **New Project**
5. Enter project details:
   - **Project name**: `powerstar-seo-monitoring` (or your preferred name)
   - **Organization**: Leave as default or select your organization
6. Click **Create**
7. Wait for the project to be created (usually 30 seconds)
8. Select the new project from the project selector

**Note the Project ID** - you'll need it later. It looks like `powerstar-seo-monitoring-123456`.

---

## Section 2: Enable Google Search Console API

1. In the Cloud Console, navigate to **APIs & Services** > **Library**
   - Or use the search bar at the top and type "API Library"
2. In the search box, type **"Google Search Console API"**
3. Click on **Google Search Console API** from the results
4. Click **Enable**
5. Wait for the API to be enabled (usually 1-2 minutes)
6. You should see the API status change to "API enabled"

**Verification**: Go to **APIs & Services** > **Enabled APIs and services** and confirm "Google Search Console API" appears in the list.

---

## Section 3: Create Service Account

1. Navigate to **IAM & Admin** > **Service Accounts**
   - Or use the search bar and type "Service Accounts"
2. Click **Create Service Account** at the top
3. Fill in the service account details:
   - **Service account name**: `powerstar-gsc-collector`
   - **Service account ID**: This auto-fills based on the name
   - **Description**: `Service account for SEO monitoring scripts to access Google Search Console API`
4. Click **Create and Continue**
5. For role assignment:
   - This is optional for our use case
   - Click **Continue** without selecting any role
   - The API access is granted through Search Console, not IAM roles
6. For user access:
   - Click **Done** (no need to grant user access)

**Record the Service Account email** - it looks like:
```
powerstar-gsc-collector@your-project-id.iam.gserviceaccount.com
```

---

## Section 4: Generate JSON Key File

1. From the Service Accounts list, click on the email address of the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key** > **Create new key**
4. Select **JSON** as the key type
5. Click **Create**
6. The JSON key file will automatically download to your computer
7. **Rename** the downloaded file to `credentials.json`
8. **Move** the file to the `scripts/` directory of this project

**Security Warnings**:
- **Never commit this file to git** - it contains your private key
- **Store this file securely** - anyone with access can authenticate as your service account
- **If compromised** - delete the key in GCP Console and create a new one immediately

The `credentials.json` file contains:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "powerstar-gsc-collector@...iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

---

## Section 5: Add Service Account to Search Console

This step grants your Service Account access to read data from your Search Console property.

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property (e.g., `powerstarapps.com` or `sc-domain:powerstarapps.com`)
3. In the left sidebar, click **Settings** (gear icon at the bottom)
4. Click **Users and permissions**
5. Click **Add user**
6. Enter the Service Account email address:
   - Format: `powerstar-gsc-collector@your-project-id.iam.gserviceaccount.com`
   - You can find this email in your `credentials.json` file under the `client_email` field
7. Select permissions:
   - **Full**: Complete read/write access (recommended for simplicity)
   - **Restricted**: Limited access
     - For our monitoring scripts, "View" permission is sufficient
     - You can add the permission: "View" for `/properties/powerstarapps.com`
8. Click **Add**

**Verification**: The Service Account email should now appear in the users list.

---

## Section 6: Configure Environment and Test

### 6.1 Set Up Environment

1. Navigate to the scripts directory:
   ```bash
   cd /path/to/powerstar-website/scripts
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` if needed:
   - `GOOGLE_APPLICATION_CREDENTIALS` should point to your credentials file
   - `GSC_SITE_URL` should match your Search Console property exactly

### 6.2 Install Dependencies

```bash
npm ci --legacy-peer-deps
```

This installs the runtime used by the workflow, including:
- `googleapis` - Google API client
- `google-auth-library` - Authentication
- `dotenv` - Environment variables
- `fs-extra` - File operations
- `zod` - Schema validation

### 6.3 Test Authentication and Collector Access

First verify the service account can see the configured property:

```bash
npx tsx -e "import { verifySiteAccess } from './lib/gsc-client.js'; import { config } from './lib/config.js'; verifySiteAccess(config.gsc.siteUrl).then(() => console.log('Property access OK')).catch((error) => { console.error(error.message); process.exit(1); });"
```

Then run the same scripts the GitHub Actions workflow uses:

```bash
npm run gsc
npm run detect-anomalies
npm run cleanup
```

**Expected output**:
- `npm run gsc` prints `Search Console property access verified` before collecting data
- `npm run detect-anomalies` writes `data/anomalies.json`
- `npm run cleanup` completes without removing current snapshots

---

## Troubleshooting

### Error: 403 Permission Denied

**Symptoms**: `GaxiosError: User does not have permission to view this site`

**Causes**:
1. Service Account not added to Search Console property
2. Wrong property URL in GSC_SITE_URL

**Solutions**:
1. Verify Service Account email is in Search Console > Settings > Users
2. Check `GSC_SITE_URL` matches the exact property type shown in Search Console
   - Domain property: `sc-domain:powerstarapps.com`
   - URL-prefix property: `https://powerstarapps.com/`

### Error: 404 Not Found

**Symptoms**: `GaxiosError: Requested entity was not found`

**Causes**:
1. Wrong site URL format
2. API not enabled in GCP project

**Solutions**:
1. Use the exact URL from Search Console
2. Verify "Google Search Console API" is enabled in GCP Console > APIs & Services

### Error: Invalid Credentials

**Symptoms**: `Error: invalid_grant` or `Error: invalid_client`

**Causes**:
1. JSON key file path incorrect
2. JSON key file corrupted or truncated
3. Service Account deleted

**Solutions**:
1. Verify `GOOGLE_APPLICATION_CREDENTIALS` path in `.env`
2. Re-download the JSON key file from GCP Console
3. Ensure the file is valid JSON (open in text editor and check)

### Error: Cannot find module

**Symptoms**: `Error: Cannot find module 'googleapis'`

**Causes**: Dependencies not installed

**Solution**: Run `npm ci --legacy-peer-deps` in the scripts directory

### Error: ENOENT: no such file or directory

**Symptoms**: `Error: ENOENT: no such file or directory, open './credentials.json'`

**Causes**: Credentials file not in expected location

**Solution**:
1. Check the path in your `.env` file
2. Ensure `credentials.json` exists in the scripts directory
3. Use absolute path if relative path fails:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/credentials.json
   ```

### Error: Private Key Parse Error

**Symptoms**: `Error: error:0909006C:PEM routines:get_name:no start line`

**Causes**: Private key format issue

**Solution**:
1. Open `credentials.json` in a text editor
2. Ensure the `private_key` field has proper newline characters
3. Re-download the key file if corrupted

---

## Security Best Practices

1. **Never commit credentials**:
   - Both `.env` and `credentials.json` are in `.gitignore`
   - Double-check before pushing: `git status`

2. **Limit Service Account permissions**:
   - Only grant "View" permission in Search Console
   - No IAM roles needed in GCP for this use case

3. **Rotate keys periodically**:
   - Delete old keys in GCP Console
   - Generate new keys and update local files
   - Delete old `credentials.json` file securely

4. **Use GitHub Secrets for CI/CD**:
   - Store the base64-encoded JSON key as `GOOGLE_APPLICATION_CREDENTIALS_CONTENT`
   - Store the exact Search Console property identifier as `GSC_SITE_URL`
   - Reference them in GitHub Actions:
     ```yaml
     env:
       GOOGLE_APPLICATION_CREDENTIALS: ./credentials.json
       GSC_SITE_URL: ${{ secrets.GSC_SITE_URL }}
       GOOGLE_APPLICATION_CREDENTIALS_CONTENT: ${{ secrets.GOOGLE_APPLICATION_CREDENTIALS_CONTENT }}
     ```
   - Write the credentials file at runtime:
     ```yaml
     - name: Setup credentials
       run: echo "$GOOGLE_APPLICATION_CREDENTIALS_CONTENT" | base64 -d > credentials.json
     ```

5. **Monitor API usage**:
   - Check GCP Console > APIs & Services > Dashboard
   - Set up budget alerts if needed

---

## Quick Reference

| File | Purpose |
|------|---------|
| `.env.example` | Template for environment variables |
| `.env` | Your actual configuration (never commit) |
| `credentials.json` | GCP Service Account key (never commit) |
| `package.json` | Node.js dependencies |

| Environment Variable | Description |
|---------------------|-------------|
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Service Account JSON key |
| `GSC_SITE_URL` | Search Console property URL |
| `DATA_OUTPUT_PATH` | Output path for SEO metrics JSON |
| `HISTORY_OUTPUT_PATH` | Directory for historical snapshots |

| Command | Purpose |
|---------|---------|
| `cp .env.example .env` | Create local environment file |
| `npm ci --legacy-peer-deps` | Install workflow-compatible dependencies |
| `npx tsx -e "import { verifySiteAccess } from './lib/gsc-client.js'; import { config } from './lib/config.js'; verifySiteAccess(config.gsc.siteUrl).then(() => console.log('Property access OK')).catch((error) => { console.error(error.message); process.exit(1); });"` | Verify Search Console property access |
| `npm run gsc` | Run GSC data collector |
| `npm run detect-anomalies` | Detect SEO anomalies from collected data |
| `npm run cleanup` | Remove old history snapshots |

---

## Next Steps

After successful authentication test:

1. **Proceed to Plan 06-02** - Implement the GSC collector script
2. **Set up GitHub Actions** - Automate daily data collection
3. **Configure alerts** - Set up Slack/email notifications for anomalies

For questions or issues, refer to:
- [Google Search Console API Documentation](https://developers.google.com/webmaster-tools/search-console-api-original)
- [Google Auth Library Documentation](https://github.com/googleapis/google-auth-library-nodejs)
- [GCP Service Account Best Practices](https://cloud.google.com/iam/docs/best-practices-service-accounts)