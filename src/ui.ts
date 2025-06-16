import type { Service, Incident } from './types';
import { ServiceStatus, IncidentStatus } from './types';

/**
 * UI components for the status page
 */

export class StatusPageUI {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /**
   * Render the complete status page
   */
  render(services: Service[], incidents: Incident[]): void {
    this.container.innerHTML = `      <header class="header">
        <div class="container">
          <h1 class="title">
            <span class="icon">🛡️</span>
            Service Status Dashboard
          </h1>
          <p class="description">Monitor the operational status of our services • Theme support enabled</p>
        </div>
      </header>

      <main class="main">
        <div class="container">
          ${this.renderOverallStatus(services)}
          ${this.renderServices(services)}
          ${this.renderIncidents(incidents)}
        </div>
      </main>

      <footer class="footer">
        <div class="container">
          <p>&copy; 2025 Service Status Dashboard - Last updated: ${new Date().toLocaleString()}</p>
        </div>
      </footer>
    `;
  }

  /**
   * Render overall system status
   */  private renderOverallStatus(services: Service[]): string {
    const operationalCount = services.filter(s => s.status === ServiceStatus.OPERATIONAL).length;
    const totalCount = services.length;
    
    let overallStatus: string = ServiceStatus.OPERATIONAL;
    let statusMessage = 'All systems operational';
    
    if (operationalCount === 0) {
      overallStatus = ServiceStatus.OUTAGE;
      statusMessage = 'Major service outage';
    } else if (operationalCount < totalCount) {
      overallStatus = ServiceStatus.DEGRADED;
      statusMessage = 'Some services experiencing issues';
    }

    return `
      <section class="overall-status ${overallStatus}">
        <div class="status-indicator">
          <span class="status-icon">${this.getStatusIcon(overallStatus)}</span>
          <div class="status-text">
            <h2>${statusMessage}</h2>
            <p>${operationalCount} of ${totalCount} services operational</p>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Render services list
   */
  private renderServices(services: Service[]): string {
    return `
      <section class="services">
        <h2>Services</h2>
        <div class="services-list">
          ${services.map(service => this.renderService(service)).join('')}
        </div>
      </section>
    `;
  }

  /**
   * Render individual service
   */
  private renderService(service: Service): string {
    const uptime = (service.uptime * 100).toFixed(2);
    const responseTime = service.responseTime;
    
    return `
      <div class="service-card ${service.status}">
        <div class="service-header">
          <h3 class="service-name">${service.name}</h3>
          <span class="service-status ${service.status}">
            ${this.getStatusIcon(service.status)}
            ${this.getStatusText(service.status)}
          </span>
        </div>
        
        ${service.description ? `<p class="service-description">${service.description}</p>` : ''}
        
        <div class="service-metrics">
          <div class="metric">
            <span class="metric-label">Uptime</span>
            <span class="metric-value">${uptime}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Response Time</span>
            <span class="metric-value">${responseTime}ms</span>
          </div>
          <div class="metric">
            <span class="metric-label">Last Checked</span>
            <span class="metric-value">${this.formatRelativeTime(service.lastChecked)}</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render incidents section
   */
  private renderIncidents(incidents: Incident[]): string {
    if (incidents.length === 0) {
      return `
        <section class="incidents">
          <h2>Incidents</h2>
          <div class="no-incidents">
            <span class="icon">✅</span>
            <p>No recent incidents to report</p>
          </div>
        </section>
      `;
    }

    return `
      <section class="incidents">
        <h2>Recent Incidents</h2>
        <div class="incidents-list">
          ${incidents.slice(0, 5).map(incident => this.renderIncident(incident)).join('')}
        </div>
      </section>
    `;
  }

  /**
   * Render individual incident
   */
  private renderIncident(incident: Incident): string {
    return `
      <div class="incident-card ${incident.severity}">
        <div class="incident-header">
          <h3 class="incident-title">${incident.title}</h3>
          <div class="incident-meta">
            <span class="incident-status ${incident.status}">${this.getIncidentStatusText(incident.status)}</span>
            <span class="incident-severity ${incident.severity}">${incident.severity.toUpperCase()}</span>
          </div>
        </div>
        
        <p class="incident-description">${incident.description}</p>
        
        <div class="incident-timeline">
          <div class="incident-time">
            <span class="time-label">Started:</span>
            <span class="time-value">${this.formatDate(incident.createdAt)}</span>
          </div>
          ${incident.resolvedAt ? `
            <div class="incident-time">
              <span class="time-label">Resolved:</span>
              <span class="time-value">${this.formatDate(incident.resolvedAt)}</span>
            </div>
          ` : ''}
        </div>
        
        ${incident.affectedServices.length > 0 ? `
          <div class="affected-services">
            <span class="label">Affected Services:</span>
            ${incident.affectedServices.map(service => `<span class="service-tag">${service}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Get status icon for service status
   */
  private getStatusIcon(status: string): string {
    switch (status) {
      case ServiceStatus.OPERATIONAL:
        return '🟢';
      case ServiceStatus.DEGRADED:
        return '🟡';
      case ServiceStatus.OUTAGE:
        return '🔴';
      case ServiceStatus.MAINTENANCE:
        return '🔧';
      default:
        return '⚪';
    }
  }

  /**
   * Get readable status text
   */
  private getStatusText(status: string): string {
    switch (status) {
      case ServiceStatus.OPERATIONAL:
        return 'Operational';
      case ServiceStatus.DEGRADED:
        return 'Degraded Performance';
      case ServiceStatus.OUTAGE:
        return 'Service Outage';
      case ServiceStatus.MAINTENANCE:
        return 'Under Maintenance';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get incident status text
   */
  private getIncidentStatusText(status: string): string {
    switch (status) {
      case IncidentStatus.INVESTIGATING:
        return 'Investigating';
      case IncidentStatus.IDENTIFIED:
        return 'Identified';
      case IncidentStatus.MONITORING:
        return 'Monitoring';
      case IncidentStatus.RESOLVED:
        return 'Resolved';
      default:
        return 'Unknown';
    }
  }

  /**
   * Format date for display
   */
  private formatDate(date: Date): string {
    return date.toLocaleString();
  }

  /**
   * Format relative time (e.g., "2 minutes ago")
   */
  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }
}
