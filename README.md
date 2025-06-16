# Service Status Dashboard

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/yourusername/status-page/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/yourusername/status-page/tree/main)
[![Netlify Status](https://api.netlify.com/api/v1/badges/website-stats/deploy-status)](https://app.netlify.com/sites/website-stats/deploys)

A modern, responsive status page built with Vite and TypeScript that monitors service uptime and displays real-time status information with automated CI/CD monitoring.

## 🚀 Features

- **Real-time Service Monitoring** - Monitor multiple services and APIs
- **Automated Health Checks** - GitHub Actions run health checks every 5 minutes
- **Responsive Design** - Works perfectly on desktop and mobile devices
- **Dark/Light Theme** - Automatic theme switching based on user preference
- **Historical Data** - Track uptime statistics and incident history
- **Modern UI** - Clean, professional interface with status indicators
- **Fast Performance** - Built with Vite for optimal loading speeds
- **TypeScript** - Full type safety and better developer experience

## 📊 Status Indicators

- 🟢 **Operational** - Service is running normally
- 🟡 **Degraded** - Service is experiencing performance issues
- 🔴 **Outage** - Service is completely down
- 🔧 **Maintenance** - Service is under scheduled maintenance

## 🛠️ Technologies Used

- **Frontend**: Vite + TypeScript + Vanilla JavaScript
- **Styling**: Modern CSS with CSS Variables
- **Automation**: GitHub Actions for monitoring and deployment
- **Deployment**: GitHub Pages (static hosting)
- **Monitoring**: Automated HTTP health checks

## 🏗️ Project Structure

```
status-page/
├── .github/
│   └── workflows/
│       └── status-page.yml      # GitHub Actions workflow
├── config/
│   └── services.json            # Service configuration
├── public/
│   └── data/                    # Generated status data
├── src/
│   ├── main.ts                  # Main application entry
│   ├── types.ts                 # TypeScript interfaces
│   ├── monitor.ts               # Service monitoring logic
│   ├── ui.ts                    # UI components
│   └── style.css                # Styles and themes
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd status-page
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure services**
   Edit `config/services.json` to add your services:
   ```json
   {
     "services": [
       {
         "id": "my-api",
         "name": "My API",
         "url": "https://api.example.com/health",
         "description": "Main API server"
       }
     ]
   }
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 📝 Configuration

### Service Configuration

Edit `config/services.json` to configure which services to monitor:

```json
{
  "services": [
    {
      "id": "unique-service-id",
      "name": "Service Display Name",
      "url": "https://service.example.com/health",
      "description": "Service description",
      "expectedStatus": 200
    }
  ],
  "settings": {
    "checkInterval": 300,     // Check interval in seconds
    "timeout": 10000,         // Request timeout in milliseconds
    "retries": 3,             // Number of retries on failure
    "degradedThreshold": 2000, // Response time threshold for degraded status
    "downThreshold": 10000    // Response time threshold for down status
  }
}
```

### GitHub Actions Setup

The project includes automated monitoring via GitHub Actions:

1. **Enable GitHub Actions** in your repository settings
2. **Set up GitHub Pages** for deployment:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages`
3. **Configure monitoring schedule** in `.github/workflows/status-page.yml`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run deploy` - Deploy to GitHub Pages

### Adding New Features

1. **Service Types**: Extend interfaces in `src/types.ts`
2. **Monitoring Logic**: Update `src/monitor.ts`
3. **UI Components**: Modify `src/ui.ts`
4. **Styling**: Edit `src/style.css`

## 🚀 Deployment

### Netlify (Recommended)

Deploy to Netlify for easy hosting and continuous deployment:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy to Netlify"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Visit [netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Build settings: `npm run build`, publish: `dist`

3. **Custom Domain:**
   - Set up `status.joeycadieux.dev` in Netlify dashboard
   - Update DNS CNAME to point to Netlify

📖 **Detailed guide:** [NETLIFY_DEPLOY.md](./NETLIFY_DEPLOY.md)

### CircleCI (Professional CI/CD)

For advanced CI/CD with automated monitoring and multiple deployment options:

1. **Connect to CircleCI:**
   - Sign up at [circleci.com](https://circleci.com)
   - Connect your GitHub repository
   - Configuration is already included

2. **Set Environment Variables:**
   ```
   NETLIFY_AUTH_TOKEN=your_token
   NETLIFY_SITE_ID=your_site_id
   ```

3. **Features:**
   - Automated testing and security scanning
   - Service monitoring every 5 minutes
   - Multiple deployment targets
   - Preview deployments

📖 **Detailed guide:** [CIRCLECI_SETUP.md](./CIRCLECI_SETUP.md)

### GitHub Pages

The project also supports GitHub Pages deployment:

1. **Enable GitHub Pages** in your repository settings
2. **Set branch to `gh-pages`** in GitHub Pages settings
3. **Push changes to main branch** to trigger deployment

## 📊 Monitoring

### Automated Health Checks

- Runs every 5 minutes via GitHub Actions
- Checks HTTP status codes and response times
- Updates status data automatically
- Commits results to the repository

### Status Calculation

- **Operational**: Response time < 1000ms and HTTP 200
- **Degraded**: Response time 1000-3000ms or HTTP 2xx
- **Outage**: Request timeout or HTTP error codes

## 🎨 Customization

### Themes

The status page supports automatic dark/light theme switching. Customize colors in `src/style.css`:

```css
:root {
  --primary-color: #2563eb;
  --success-color: #059669;
  --warning-color: #d97706;
  --error-color: #dc2626;
}
```

### Branding

- Update site title in `index.html`
- Modify header content in `src/ui.ts`
- Replace favicon in `public` directory

## 🔒 Security

- No sensitive data in client-side code
- CORS-compliant health checks
- Secure GitHub Actions workflows
- No API keys required for basic functionality

## 📈 Performance

- Optimized bundle size with Vite
- Lazy loading for better performance
- Efficient DOM updates
- Responsive images and assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🆘 Support

- Create an issue for bug reports
- Check existing issues before submitting
- Provide detailed reproduction steps
- Include browser and environment information

## 🔄 Roadmap

- [ ] Incident management system
- [ ] Email/Slack notifications
- [ ] Historical uptime charts
- [ ] Performance metrics dashboard
- [ ] Multi-region monitoring
- [ ] API for external integrations

---

**Built with ❤️ using Vite, TypeScript, and GitHub Actions**
