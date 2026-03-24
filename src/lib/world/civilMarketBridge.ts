import type { CivilBridgeRecord } from '@/types/civilBridge';

function now() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

export function createCivilBridgeRecord(params: {
  sourceDomain: CivilBridgeRecord['sourceDomain'];
  targetDomain: CivilBridgeRecord['targetDomain'];
  objectId: string;
  objectType: string;
}): CivilBridgeRecord {
  return {
    id: makeId('CBR'),
    sourceDomain: params.sourceDomain,
    targetDomain: params.targetDomain,
    objectId: params.objectId,
    objectType: params.objectType,
    syncedAt: now(),
  };
}