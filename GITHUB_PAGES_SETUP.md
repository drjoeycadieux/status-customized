# GitHub Actions and Pages Setup Guide

## GitHub Repository Settings Configuration

### 1. Enable GitHub Pages
1. Go to your repository: https://github.com/drjoeycadieux/status-customized
2. Click on **Settings** tab
3. Scroll down to **Pages** section (in the left sidebar)
4. Under **Source**, select: **Deploy from a branch**
5. Under **Branch**, select: **gh-pages** (this will be created automatically by the workflow)
6. Click **Save**

### 2. Configure Actions Permissions
1. In repository **Settings**
2. Go to **Actions** → **General** (in left sidebar)
3. Under **Actions permissions**, ensure one of these is selected:
   - **Allow all actions and reusable workflows** (recommended)
   - **Allow select actions and reusable workflows** (then allow peaceiris/actions-gh-pages)

### 3. Workflow Permissions
1. Still in **Actions** → **General**
2. Scroll down to **Workflow permissions**
3. Select: **Read and write permissions**
4. Check: **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

### 4. Repository Secrets (if needed)
If you need additional permissions:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `GH_PAT` (if you create a Personal Access Token)
4. Value: Your personal access token with repo permissions

## Fixed Issues in Workflow

### Permission Errors Fixed:
1. **Added global permissions block** at workflow level
2. **Added job-specific permissions** for build-and-deploy job
3. **Updated to peaceiris/actions-gh-pages@v4** (latest version)
4. **Added force_orphan: true** to handle branch creation
5. **Added explicit token to checkout** actions

### Updated Workflow Features:
- ✅ Proper GitHub Pages deployment permissions
- ✅ Service monitoring with real URLs
- ✅ Automatic status updates
- ✅ Security audits and type checking
- ✅ Error handling for missing features

## Verification Steps

### 1. Check Workflow Status
- Go to **Actions** tab in your repository
- Verify latest workflow run completes successfully
- Check that "Deploy to GitHub Pages" step succeeds

### 2. Verify GitHub Pages Deployment
- Wait 2-3 minutes after successful workflow
- Visit: https://drjoeycadieux.github.io/status-customized
- Should show your status page with real services

### 3. Check Service Monitoring
- Workflow runs every 5 minutes to check service status
- Updates are committed to `public/data/` directory
- Check recent commits for automatic status updates

## Troubleshooting

### If GitHub Pages URL doesn't work:
1. Check **Settings** → **Pages** shows correct source branch
2. Verify workflow created `gh-pages` branch successfully
3. Check Actions tab for any deployment errors

### If still getting permission errors:
1. Create Personal Access Token:
   - Go to GitHub Settings (your profile) → Developer settings → Personal access tokens
   - Generate token with **repo** permissions
   - Add as repository secret named `GH_PAT`
2. Update workflow to use: `github_token: ${{ secrets.GH_PAT }}`

### If services aren't updating:
1. Check scheduled workflow runs in Actions tab
2. Verify `public/config/services.json` contains your services
3. Check recent commits for automatic status updates

## Custom Domain Setup (Optional)

If you want to use a custom domain:
1. Add your domain to `public/CNAME` file (already done: joeycadieux.dev)
2. In **Settings** → **Pages**, add custom domain
3. Configure DNS A records to point to GitHub Pages IPs:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153

The workflow should now deploy successfully to GitHub Pages!
