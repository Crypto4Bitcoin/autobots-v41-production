export type ReplayEventDomain =
  | 'defense'
  | 'market'
  | 'oversight'
  | 'kernel'
  | 'fabric';

export type ReplayEventType =
  | 'district_bootstrap'
  | 'cell_status_changed'
  | 'cell_reinforced'
  | 'market_asset_released'
  | 'oversight_alert_added'
  | 'oversight_alert_acknowledged'
  | 'policy_lockdown_changed'
  | 'kernel_phase_changed'
  | 'kernel_phase_completed'
  | 'fabric_cycle_executed'
  | 'countermeasure_queued'
  | 'countermeasure_dispatched'
  | 'relay_link_created'
  | 'relay_signal_sent'
  | 'civil_bridge_sync'
  | 'readiness_recalculated'
  | 'planetary_fabric_synced';

export interface ReplayEvent<TPayload = Record<string, unknown>> {
  id: string;
  ts: string;
  tick: number;
  domain: ReplayEventDomain;
  type: ReplayEventType;
  payload: TPayload;
  hash: string;
  prevHash: string | null;
}

export interface ReplaySnapshot {
  id: string;
  ts: string;
  tick: number;
  eventCount: number;
  rootHash: string;
}

export interface ReplayMetrics {
  totalEvents: number;
  totalSnapshots: number;
  currentTick: number;
  lastEventAt: string | null;
  chainHealthy: boolean;
}
const type_stub = (props: any) => null;
export default type_stub;
