import { create } from 'zustand';
import type { CivilBridgeRecord } from '@/types/civilBridge';
import { createCivilBridgeRecord } from '@/lib/world/civilMarketBridge';
import { getMarketSnapshot } from '@/lib/autobots-market';
import { useSecurityReplayStore } from '@/stores/securityReplayStore';

type CivilMarketBridgeState = {
  records: CivilBridgeRecord[];
  lastSyncAt: string | null;
};

type CivilMarketBridgeActions = {
  syncBridge: () => CivilBridgeRecord[];
};

type CivilMarketBridgeStore = CivilMarketBridgeState & CivilMarketBridgeActions;

export const useCivilMarketBridgeStore = create<CivilMarketBridgeStore>((set, get) => ({
  records: [],
  lastSyncAt: null,

  syncBridge: () => {
    const market = getMarketSnapshot();
    const created: CivilBridgeRecord[] = [];

    for (const listing of market.listings.slice(0, 10)) {
      created.push(
        createCivilBridgeRecord({
          sourceDomain: 'market',
          targetDomain: 'kernel',
          objectId: listing.id,
          objectType: 'listing',
        })
      );
    }

    set({
      records: [...created, ...get().records],
      lastSyncAt: new Date().toISOString(),
    });

    useSecurityReplayStore.getState().logEvent({
      domain: 'fabric',
      type: 'civil_bridge_sync',
      payload: {
        count: created.length,
      },
    });

    return created;
  },
}));