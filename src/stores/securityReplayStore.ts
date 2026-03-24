import { create } from 'zustand';
import type { ReplayEvent, ReplaySnapshot } from '@/types/replay';
import {
  createReplayEvent,
  createReplaySnapshot,
  buildReplayMetrics,
  replayState,
} from '@/lib/world/securityReplay';

type SecurityReplayState = {
  events: ReplayEvent[];
  snapshots: ReplaySnapshot[];
};

type SecurityReplayActions = {
  logEvent: (input: {
    domain: ReplayEvent['domain'];
    type: ReplayEvent['type'];
    payload: Record<string, unknown>;
  }) => ReplayEvent;
  takeSnapshot: () => ReplaySnapshot | null;
  validateChain: () => boolean;
  getMetrics: () => ReturnType<typeof buildReplayMetrics>;
  replayCurrentState: () => ReturnType<typeof replayState>;
  resetReplay: () => void;
};

type SecurityReplayStore = SecurityReplayState & SecurityReplayActions;

export const useSecurityReplayStore = create<SecurityReplayStore>((set, get) => ({
  events: [],
  snapshots: [],

  logEvent: ({ domain, type, payload }) => {
    const prev = get().events.at(-1) ?? null;
    const nextTick = (prev?.tick ?? 0) + 1;

    const event = createReplayEvent({
      tick: nextTick,
      domain,
      type,
      payload,
      prevHash: prev?.hash ?? null,
    });

    set({
      events: [...get().events, event],
    });

    return event;
  },

  takeSnapshot: () => {
    const events = get().events;
    if (events.length === 0) return null;

    const last = events.at(-1)!;
    const snapshot = createReplaySnapshot({
      tick: last.tick,
      eventCount: events.length,
      rootHash: last.hash,
    });

    set({
      snapshots: [...get().snapshots, snapshot],
    });

    return snapshot;
  },

  validateChain: () => {
    return get().getMetrics().chainHealthy;
  },

  getMetrics: () => {
    return buildReplayMetrics(get().events, get().snapshots);
  },

  replayCurrentState: () => {
    return replayState(get().events);
  },

  resetReplay: () => {
    set({
      events: [],
      snapshots: [],
    });
  },
}));