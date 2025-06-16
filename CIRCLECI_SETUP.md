# CircleCI Setup Guide

## 🔄 CircleCI Configuration

This project includes a comprehensive CircleCI pipeline for continuous integration and deployment.

## 🏗️ Pipeline Overview

### Jobs:
1. **Build** - Install dependencies, type check, and build
2. **Security Audit** - Run npm security audit
3. **Monitor Services** - Health check your configured services
4. **Deploy Netlify** - Deploy to Netlify (main/develop branches)
5. **Deploy GitHub Pages** - Alternative deployment option

### Workflows:
- **build-test-deploy** - Runs on every push
- **scheduled-monitoring** - Runs every 10 minutes for service monitoring

## 🚀 Setup Instructions

### 1. Connect Repository to CircleCI

1. **Sign up/Login to CircleCI:**
   - Go to [circleci.com](https://circleci.com)
   - Sign in with your GitHub account

2. **Add Project:**
   - Click "Set Up Project"
   - Select your status page repository
   - Choose "Fastest" setup option
   - CircleCI will automatically detect the `.circleci/config.yml`

### 2. Configure Environment Variables

In CircleCI Project Settings → Environment Variables, add:

#### For Netlify Deployment:
```
NETLIFY_AUTH_TOKEN=your_netlify_personal_access_token
NETLIFY_SITE_ID=your_netlify_site_id
```

#### For GitHub Pages Deployment (optional):
```
GITHUB_TOKEN=your_github_personal_access_token
```

#### How to get these tokens:

**Netlify Token:**
1. Go to Netlify → User settings → Personal access tokens
2. Generate new access token
3. Copy the token

**Netlify Site ID:**
1. Go to your Netlify site (website-stats) → Site settings → General
2. Copy the "Site ID"

**GitHub Token:**
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate token with `repo` and `pages` permissions

### 3. Enable Scheduled Workflows (Optional)

For automated service monitoring every 10 minutes:

1. Go to CircleCI Project Settings
2. Navigate to "Advanced Settings"
3. Enable "Enable build processing" 
4. The scheduled workflow will automatically run

## 📊 Pipeline Features

### ✅ **Continuous Integration:**
- Automated testing on every push
- TypeScript type checking
- Security vulnerability scanning
- Build verification

### 🔄 **Continuous Deployment:**
- Automatic deployment to Netlify on main branch
- Preview deployments for feature branches
- GitHub Pages deployment option

### 📈 **Service Monitoring:**
- Scheduled health checks every 10 minutes
- Updates service status data
- Automatic status page refresh

### 🛡️ **Security:**
- NPM audit on every build
- Dependency vulnerability scanning
- Secure token handling

## 🔧 Configuration Options

### Modify Monitoring Frequency:
Edit `.circleci/config.yml` line 135:
```yaml
cron: "0,10,20,30,40,50 * * * *"  # Every 10 minutes
# Change to:
cron: "0,15,30,45 * * * *"        # Every 15 minutes
cron: "0 * * * *"                 # Every hour
cron: "0 0,6,12,18 * * *"         # Every 6 hours
```

### Disable Scheduled Monitoring:
If you prefer manual monitoring only, comment out the scheduled workflow:
```yaml
# workflows:
#   scheduled-monitoring:
#     triggers:
#       - schedule:
#           cron: "0,10,20,30,40,50 * * * *"
#           filters:
#             branches:
#               only: main
#     jobs:
#       - monitor-services
```

### Alternative: GitHub Actions Integration
You can also use GitHub Actions for scheduled monitoring while keeping CircleCI for deployments:
```yaml
# In .github/workflows/status-page.yml
on:
  schedule:
    - cron: '*/5 * * * *'  # GitHub Actions supports */5 syntax
```

### Add More Services:
Update the services array in the `monitor-services` job:
```javascript
const services = [
  { name: 'Joey Cadieux Portfolio', url: 'https://joeycadieux.dev' },
  { name: 'Software Foundations', url: 'https://softwarefoundations.cloud' },
  { name: 'Your New Service', url: 'https://newservice.com' }
];
```

### Change Deployment Target:
- **Netlify Only:** Keep current configuration
- **GitHub Pages Only:** Comment out netlify job, uncomment github-pages job
- **Both:** Enable both deployment jobs

## 🚨 Troubleshooting

### Build Failures:
1. Check CircleCI build logs
2. Verify Node.js version compatibility
3. Ensure all dependencies are in package.json

### Deployment Issues:
1. Verify environment variables are set correctly
2. Check token permissions
3. Ensure branch filters match your setup

### Monitoring Issues:
1. Check if services are accessible
2. Verify URL formats
3. Review timeout settings (currently 10 seconds)

## 📋 Environment Variables Checklist

- [ ] `NETLIFY_AUTH_TOKEN` - Netlify personal access token
- [ ] `NETLIFY_SITE_ID` - Your Netlify site ID
- [ ] `GITHUB_TOKEN` - GitHub personal access token (if using GitHub Pages)

## 🎯 Next Steps

1. **Set up CircleCI account**
2. **Configure environment variables**
3. **Push to trigger first build**
4. **Monitor build status**
5. **Verify deployment**

## 📈 Benefits

- ✅ **Automated Testing** - Catch issues before deployment
- ✅ **Continuous Deployment** - Automatic updates on code changes
- ✅ **Service Monitoring** - Real-time status updates every 10 minutes
- ✅ **Security Scanning** - Automated vulnerability detection
- ✅ **Multiple Deployment Options** - Netlify and GitHub Pages support

Your status page will now have professional CI/CD with automated monitoring! 🚀
