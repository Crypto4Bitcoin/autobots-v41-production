import type { ReplayEvent, ReplaySnapshot, ReplayMetrics } from '@/types/replay';

function now() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`;
}

function simpleHash(input: string): string {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }

  return `H${Math.abs(hash).toString(16).toUpperCase()}`;
}

export function createReplayEvent(params: {
  tick: number;
  domain: ReplayEvent['domain'];
  type: ReplayEvent['type'];
  payload: Record<string, unknown>;
  prevHash: string | null;
}): ReplayEvent {
  const ts = now();
  const raw = stableStringify({
    ts,
    tick: params.tick,
    domain: params.domain,
    type: params.type,
    payload: params.payload,
    prevHash: params.prevHash,
  });

  return {
    id: makeId('EVT'),
    ts,
    tick: params.tick,
    domain: params.domain,
    type: params.type,
    payload: params.payload,
    prevHash: params.prevHash,
    hash: simpleHash(raw),
  };
}

export function createReplaySnapshot(params: {
  tick: number;
  eventCount: number;
  rootHash: string;
}): ReplaySnapshot {
  return {
    id: makeId('SNP'),
    ts: now(),
    tick: params.tick,
    eventCount: params.eventCount,
    rootHash: params.rootHash,
  };
}

export function validateReplayChain(events: ReplayEvent[]): boolean {
  if (events.length === 0) return true;

  for (let i = 0; i < events.length; i++) {
    const current = events[i];
    const expectedPrev = i === 0 ? null : events[i - 1].hash;

    if (current.prevHash !== expectedPrev) {
      return false;
    }

    const raw = stableStringify({
      ts: current.ts,
      tick: current.tick,
      domain: current.domain,
      type: current.type,
      payload: current.payload,
      prevHash: current.prevHash,
    });

    const expectedHash = simpleHash(raw);
    if (current.hash !== expectedHash) {
      return false;
    }
  }

  return true;
}

export function buildReplayMetrics(
  events: ReplayEvent[],
  snapshots: ReplaySnapshot[]
): ReplayMetrics {
  return {
    totalEvents: events.length,
    totalSnapshots: snapshots.length,
    currentTick: events.at(-1)?.tick ?? 0,
    lastEventAt: events.at(-1)?.ts ?? null,
    chainHealthy: validateReplayChain(events),
  };
}

export function replayState(events: ReplayEvent[]) {
  const state = {
    districtBootstrapped: false,
    breachedCells: 0,
    fortifiedCells: 0,
    releasedAssets: 0,
    alerts: 0,
    lockdown: false,
    completedPhases: [] as number[],
    cyclesExecuted: 0,
    relaysCreated: 0,
    relaySignals: 0,
    bridgeSyncs: 0,
    readinessRecalcs: 0,
    planetaryFabricSyncs: 0,
    countermeasuresQueued: 0,
    countermeasuresDispatched: 0,
  };

  for (const event of events) {
    switch (event.type) {
      case 'district_bootstrap':
        state.districtBootstrapped = true;
        break;
      case 'cell_status_changed': {
        const nextStatus = String(event.payload.status ?? '');
        const prevStatus = String(event.payload.prevStatus ?? '');
        if (prevStatus === 'breach' && nextStatus !== 'breach') state.breachedCells = Math.max(0, state.breachedCells - 1);
        if (prevStatus === 'fortified' && nextStatus !== 'fortified') state.fortifiedCells = Math.max(0, state.fortifiedCells - 1);
        if (nextStatus === 'breach' && prevStatus !== 'breach') state.breachedCells += 1;
        if (nextStatus === 'fortified' && prevStatus !== 'fortified') state.fortifiedCells += 1;
        break;
      }
      case 'cell_reinforced':
        state.fortifiedCells += 1;
        break;
      case 'market_asset_released':
        state.releasedAssets += Number(event.payload.count ?? 1);
        break;
      case 'oversight_alert_added':
        state.alerts += 1;
        break;
      case 'oversight_alert_acknowledged':
        state.alerts = Math.max(0, state.alerts - 1);
        break;
      case 'policy_lockdown_changed':
        state.lockdown = Boolean(event.payload.value);
        break;
      case 'kernel_phase_completed':
        state.completedPhases.push(Number(event.payload.phase));
        break;
      case 'fabric_cycle_executed':
        state.cyclesExecuted += 1;
        break;
      case 'countermeasure_queued':
        state.countermeasuresQueued += 1;
        break;
      case 'countermeasure_dispatched':
        state.countermeasuresDispatched += 1;
        break;
      case 'relay_link_created':
        state.relaysCreated += 1;
        break;
      case 'relay_signal_sent':
        state.relaySignals += 1;
        break;
      case 'civil_bridge_sync':
        state.bridgeSyncs += 1;
        break;
      case 'readiness_recalculated':
        state.readinessRecalcs += 1;
        break;
      case 'planetary_fabric_synced':
        state.planetaryFabricSyncs += 1;
        break;
      default:
        break;
    }
  }

  return state;
}