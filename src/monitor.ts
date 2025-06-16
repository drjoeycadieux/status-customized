import type { Service, HealthCheckResult } from './types';
import { ServiceStatus } from './types';

/**
 * Service monitoring and health check utilities
 */
export class StatusMonitor {
  private services: Service[] = [];
  private checkInterval: number = 60000; // 1 minute
  private intervalId: number | null = null;

  constructor(services: Service[], checkInterval: number = 60000) {
    this.services = services;
    this.checkInterval = checkInterval;
  }

  /**
   * Start monitoring all services
   */
  startMonitoring(): void {
    this.stopMonitoring(); // Stop any existing monitoring
    this.checkAllServices(); // Initial check
    
    this.intervalId = window.setInterval(() => {
      this.checkAllServices();
    }, this.checkInterval);
  }

  /**
   * Stop monitoring services
   */
  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Check all services health
   */
  async checkAllServices(): Promise<HealthCheckResult[]> {
    const results = await Promise.allSettled(
      this.services.map(service => this.checkService(service))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          serviceId: this.services[index].id,
          status: ServiceStatus.OUTAGE,
          responseTime: 0,
          timestamp: new Date(),
          error: result.reason?.message || 'Unknown error'
        };
      }
    });
  }

  /**
   * Check individual service health
   */
  async checkService(service: Service): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Use a simple fetch to check if the service is responding
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(service.url)}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      const responseTime = Date.now() - startTime;
      
      let status: ServiceStatus;
      if (response.ok) {
        if (responseTime < 1000) {
          status = ServiceStatus.OPERATIONAL;
        } else if (responseTime < 3000) {
          status = ServiceStatus.DEGRADED;
        } else {
          status = ServiceStatus.DEGRADED;
        }
      } else {
        status = ServiceStatus.OUTAGE;
      }

      return {
        serviceId: service.id,
        status,
        responseTime,
        timestamp: new Date()
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        serviceId: service.id,
        status: ServiceStatus.OUTAGE,
        responseTime,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  /**
   * Update service status
   */
  updateService(serviceId: string, result: HealthCheckResult): void {
    const service = this.services.find(s => s.id === serviceId);
    if (service) {
      service.status = result.status;
      service.responseTime = result.responseTime;
      service.lastChecked = result.timestamp;
    }
  }

  /**
   * Get all services
   */
  getServices(): Service[] {
    return this.services;
  }

  /**
   * Add a new service to monitor
   */
  addService(service: Service): void {
    this.services.push(service);
  }

  /**
   * Remove a service from monitoring
   */
  removeService(serviceId: string): void {
    this.services = this.services.filter(s => s.id !== serviceId);
  }
}
