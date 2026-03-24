import { FailureTaxonomyEngine } from "./failure-taxonomy.service";

export interface IncidentAlert {
  alert_id: string;
  source: string;
  error_key: string;
  message: string;
  timestamp: string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;
}

export interface CorrelatedIncident {
  incident_id: string;
  main_cause: string;
  alerts: IncidentAlert[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  shared_context: Record<string, any>;
  status: 'new' | 'diagnosing' | 'repairing' | 'verified' | 'failed';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class RootCauseCorrelationEngine {
  private static activeIncidents: Map<string, CorrelatedIncident> = new Map();

  static correlate(alert: IncidentAlert): CorrelatedIncident {
    console.log(`[Correlation] Analyzing alert: ${alert.error_key} from ${alert.source}`);
    
    // Look for existing incidents with same trace_id or session_id
    const existing = Array.from(this.activeIncidents.values()).find(inc => 
      inc.shared_context.trace_id === alert.metadata.trace_id ||
      inc.shared_context.voice_session_id === alert.metadata.voice_session_id
    );

    if (existing) {
      existing.alerts.push(alert);
      console.log(`[Correlation] Alert grouped into incident: ${existing.incident_id}`);
      return existing;
    }

    // Create new incident
    const taxonomy = FailureTaxonomyEngine.classify(alert.error_key);
    const newIncident: CorrelatedIncident = {
      incident_id: "INC-" + Math.random().toString(36).substring(2, 9),
      main_cause: alert.error_key,
      alerts: [alert],
      shared_context: alert.metadata,
      status: 'new',
      severity: taxonomy.severity
    };

    this.activeIncidents.set(newIncident.incident_id, newIncident);
    console.log(`[Correlation] New correlated incident created: ${newIncident.incident_id}`);
    return newIncident;
  }

  static listIncidents(): CorrelatedIncident[] {
    return Array.from(this.activeIncidents.values());
  }
}
