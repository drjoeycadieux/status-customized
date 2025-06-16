import './style.css';
import type { Service, Incident, StatusPageConfig } from './types';
import { ServiceStatus } from './types';
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
        console.warn('Could not load external config, using embedded configuration');
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
      console.error('❌ Failed to load external configuration, using embedded config:', error);
      // Use embedded configuration as fallback
      this.config = this.createEmbeddedConfig();
    }
  }

  /**
   * Create embedded configuration with your actual services
   */
  private createEmbeddedConfig(): StatusPageConfig {
    const services: Service[] = [
      {
        id: 'joeycadieux-website',
        name: 'Joey Cadieux Portfolio',
        url: 'https://joeycadieux.dev',
        status: ServiceStatus.UNKNOWN,
        uptime: 0.999,
        responseTime: 0,
        lastChecked: new Date(),
        description: 'Personal portfolio and blog website'
      },
      {
        id: 'softwarefoundations-website',
        name: 'Software Foundations',
        url: 'https://softwarefoundations.cloud',
        status: ServiceStatus.UNKNOWN,
        uptime: 0.999,
        responseTime: 0,
        lastChecked: new Date(),
        description: 'Software Foundations main website'
      }
    ];

    const incidents: Incident[] = [];

    return {
      siteName: 'Service Status Dashboard',
      description: 'Real-time status monitoring for our services',
      services,
      incidents,
      refreshInterval: 60000,
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
