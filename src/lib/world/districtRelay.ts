import type { RelayLink, RelaySignal } from '@/types/relay';

function now() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

export function createRelayLink(params: {
  fromDistrictId: string;
  toDistrictId: string;
}): RelayLink {
  return {
    id: makeId('RLK'),
    fromDistrictId: params.fromDistrictId,
    toDistrictId: params.toDistrictId,
    status: 'active',
    bandwidthScore: 100,
    trustScore: 100,
    createdAt: now(),
    lastSignalAt: null,
  };
}

export function createRelaySignal(params: {
  linkId: string;
  signalType: RelaySignal['signalType'];
  payloadSummary: string;
}): RelaySignal {
  return {
    id: makeId('RSG'),
    linkId: params.linkId,
    signalType: params.signalType,
    payloadSummary: params.payloadSummary,
    createdAt: now(),
  };
}