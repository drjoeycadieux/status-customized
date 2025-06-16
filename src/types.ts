/**
 * Service status types and interfaces
 */

export interface Service {
  id: string;
  name: string;
  url: string;
  status: ServiceStatus;
  uptime: number;
  responseTime: number;
  lastChecked: Date;
  description?: string;
}

export const ServiceStatus = {
  OPERATIONAL: 'operational',
  DEGRADED: 'degraded',
  OUTAGE: 'outage',
  MAINTENANCE: 'maintenance',
  UNKNOWN: 'unknown'
} as const;

export type ServiceStatus = typeof ServiceStatus[keyof typeof ServiceStatus];

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  affectedServices: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  updates: IncidentUpdate[];
}

export const IncidentStatus = {
  INVESTIGATING: 'investigating',
  IDENTIFIED: 'identified',
  MONITORING: 'monitoring',
  RESOLVED: 'resolved'
} as const;

export type IncidentStatus = typeof IncidentStatus[keyof typeof IncidentStatus];

export const IncidentSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

export type IncidentSeverity = typeof IncidentSeverity[keyof typeof IncidentSeverity];

export interface IncidentUpdate {
  id: string;
  message: string;
  status: IncidentStatus;
  timestamp: Date;
}

export interface StatusPageConfig {
  siteName: string;
  description: string;
  services: Service[];
  incidents: Incident[];
  refreshInterval: number;
  theme: 'light' | 'dark' | 'auto';
}

export interface HealthCheckResult {
  serviceId: string;
  status: ServiceStatus;
  responseTime: number;
  timestamp: Date;
  error?: string;
}
