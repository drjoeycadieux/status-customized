# Netlify Deployment Guide

## 🚀 Quick Deploy to Netlify

### Method 1: Git-based Deployment (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - Click "New site from Git"
   - Choose your repository
   - Use these settings:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
     - **Node version:** `18`

3. **Deploy:**
   - Click "Deploy site"
   - Netlify will automatically build and deploy

### Method 2: Manual Deployment

1. **Build locally:**
   ```bash
   npm run deploy:netlify
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder to Netlify

## 🌐 Custom Domain Setup

### Option 1: Netlify Subdomain
Your site is already available at: `https://website-stats.netlify.app`

### Option 2: Custom Domain (status.joeycadieux.dev)

1. **In Netlify Dashboard:**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Enter: `status.joeycadieux.dev`

2. **Update DNS:**   Add a CNAME record in your DNS provider:
   ```
   CNAME: status.joeycadieux.dev → website-stats.netlify.app
   ```

3. **Enable HTTPS:**
   - Netlify will automatically provision SSL certificate
   - Force HTTPS redirect

## ⚙️ Environment Variables (if needed)

In Netlify Dashboard → Site settings → Environment variables:
```
NODE_VERSION = 18
```

## 🔄 Continuous Deployment

With Git-based deployment:
- ✅ Automatic builds on every push to main branch
- ✅ Preview deployments for pull requests
- ✅ Branch deployments for testing

## 📊 Monitoring Integration

### GitHub Actions + Netlify
Your GitHub Actions can trigger Netlify rebuilds:

1. **Add Netlify Build Hook:**
   - Netlify Dashboard → Site settings → Build & deploy
   - Add build hook URL

2. **Update GitHub Actions:**
   ```yaml
   - name: Trigger Netlify rebuild
     run: |
       curl -X POST -d {} https://api.netlify.com/build_hooks/YOUR_HOOK_ID
   ```

## 🚨 Troubleshooting

### Build Issues:
- Check Node.js version (use 18+)
- Verify `npm install` works locally
- Check build logs in Netlify dashboard

### CORS Issues:
- Use the Netlify function for health checks
- Available at: `/.netlify/functions/health-check?url=https://example.com`

### Custom Domain Issues:
- Verify DNS propagation (use dig or nslookup)
- Check SSL certificate status
- Ensure CNAME points to Netlify

## 📋 Checklist

- [ ] Code pushed to GitHub
- [ ] Netlify site created and connected
- [ ] Build succeeds (green checkmark)
- [ ] Site loads correctly
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Service monitoring working

## 🎯 Next Steps

1. **Set up custom domain**
2. **Configure GitHub Actions for monitoring**
3. **Test all functionality**
4. **Share your status page URL!**

Your status page will be live at:
- Netlify URL: `https://website-stats.netlify.app`
- Custom URL: `https://status.joeycadieux.dev` (after DNS setup)
