import './style.css';
import type { Service, Incident, StatusPageConfig } from './types';
import { ServiceStatus, IncidentStatus, IncidentSeverity } from './types';
import { StatusMonitor } from './monitor';
import { StatusPageUI } from './ui';
import { ThemeManager } from './theme';

/**
 * Main application class for the Status Page
 */
class StatusPageApp {
  private config: StatusPageConfig;
  private monitor: StatusMonitor;
  private ui: StatusPageUI;
  private themeManager: ThemeManager;

  constructor() {
    // Initialize theme manager first
    this.themeManager = new ThemeManager();
    // Initialize with empty configuration that will be loaded
    this.config = {
      siteName: 'Service Status Dashboard',
      description: 'Real-time status monitoring for our services',
      services: [],
      incidents: [],
      refreshInterval: 60000,
      theme: 'auto'
    };
    
    this.monitor = new StatusMonitor(this.config.services, this.config.refreshInterval);
    this.ui = new StatusPageUI(document.querySelector<HTMLDivElement>('#app')!);
    
    this.init();
  }

  /**
   * Initialize the application
   */
  private async init(): Promise<void> {
    // Load configuration from services.json
    await this.loadConfiguration();
    
    // Render initial UI
    this.ui.render(this.config.services, this.config.incidents);

    // Start monitoring services
    this.monitor.startMonitoring();

    // Set up periodic UI updates
    this.setupPeriodicUpdates();

    // Perform initial health check
    await this.updateServiceStatuses();
    
    // Log theme manager status
    console.log('🎨 Theme manager initialized, current theme:', this.themeManager.getCurrentTheme());
  }

  /**
   * Load configuration from services.json file
   */
  private async loadConfiguration(): Promise<void> {
    try {
      // Try to load from config/services.json
      const response = await fetch('./config/services.json');
      if (!response.ok) {
        throw new Error(`Failed to load services configuration: ${response.status}`);
      }
      
      const configData = await response.json();
      
      // Convert config format to internal format
      this.config.services = configData.services.map((service: any) => ({
        id: service.id,
        name: service.name,
        url: service.url,
        status: ServiceStatus.UNKNOWN,
        uptime: 0.999,
        responseTime: 0,
        lastChecked: new Date(),
        description: service.description
      }));
      
      // Update monitor with new services
      this.monitor = new StatusMonitor(this.config.services, this.config.refreshInterval);
      
      console.log('✅ Configuration loaded successfully:', this.config.services.length, 'services');
    } catch (error) {
      console.error('❌ Failed to load configuration, using sample data:', error);
      // Fallback to sample configuration
      this.config = this.createSampleConfig();
    }
  }

  /**
   * Create sample configuration for demonstration
   */
  private createSampleConfig(): StatusPageConfig {
    const services: Service[] = [
      {
        id: 'web-app',
        name: 'Web Application',
        url: 'https://example.com',
        status: ServiceStatus.OPERATIONAL,
        uptime: 0.9995,
        responseTime: 245,
        lastChecked: new Date(),
        description: 'Main web application and dashboard'
      },
      {
        id: 'api',
        name: 'API Server',
        url: 'https://api.example.com',
        status: ServiceStatus.OPERATIONAL,
        uptime: 0.9998,
        responseTime: 123,
        lastChecked: new Date(),
        description: 'REST API for mobile and web applications'
      },
      {
        id: 'database',
        name: 'Database',
        url: 'https://db.example.com/health',
        status: ServiceStatus.OPERATIONAL,
        uptime: 0.9999,
        responseTime: 56,
        lastChecked: new Date(),
        description: 'Primary database cluster'
      },
      {
        id: 'cdn',
        name: 'CDN',
        url: 'https://cdn.example.com',
        status: ServiceStatus.OPERATIONAL,
        uptime: 0.9997,
        responseTime: 89,
        lastChecked: new Date(),
        description: 'Content delivery network for static assets'
      },
      {
        id: 'auth',
        name: 'Authentication',
        url: 'https://auth.example.com',
        status: ServiceStatus.DEGRADED,
        uptime: 0.9985,
        responseTime: 567,
        lastChecked: new Date(),
        description: 'User authentication and authorization service'
      }
    ];

    const incidents: Incident[] = [
      {
        id: 'inc-001',
        title: 'Increased Authentication Response Times',
        description: 'Users may experience slower login times due to increased traffic. We are investigating the issue.',
        status: IncidentStatus.MONITORING,
        severity: IncidentSeverity.MEDIUM,
        affectedServices: ['Authentication'],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        updates: [
          {
            id: 'upd-001',
            message: 'We have identified the root cause and are implementing a fix.',
            status: IncidentStatus.IDENTIFIED,
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
          },
          {
            id: 'upd-002',
            message: 'Initial investigation started. We are monitoring the authentication service.',
            status: IncidentStatus.INVESTIGATING,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
          }
        ]
      }
    ];

    return {
      siteName: 'Service Status Dashboard',
      description: 'Real-time status monitoring for our services',
      services,
      incidents,
      refreshInterval: 60000, // 1 minute
      theme: 'auto'
    };
  }

  /**
   * Set up periodic updates for the UI
   */
  private setupPeriodicUpdates(): void {
    setInterval(async () => {
      await this.updateServiceStatuses();
      this.ui.render(this.config.services, this.config.incidents);
    }, this.config.refreshInterval);
  }

  /**
   * Update service statuses by running health checks
   */
  private async updateServiceStatuses(): Promise<void> {
    try {
      const results = await this.monitor.checkAllServices();
      
      results.forEach(result => {
        this.monitor.updateService(result.serviceId, result);
      });

      // Update UI with fresh data
      this.ui.render(this.config.services, this.config.incidents);
      
      console.log('Service statuses updated:', results);
    } catch (error) {
      console.error('Failed to update service statuses:', error);
    }
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new StatusPageApp();
});
