import { create } from 'zustand';
import type { RelayLink, RelaySignal } from '@/types/relay';
import { createRelayLink, createRelaySignal } from '@/lib/world/districtRelay';
import { useSecurityReplayStore } from '@/stores/securityReplayStore';

type DistrictRelayState = {
  links: RelayLink[];
  signals: RelaySignal[];
};

type DistrictRelayActions = {
  bootstrapRelayMesh: () => void;
  sendSignal: (input: {
    linkId: string;
    signalType: RelaySignal['signalType'];
    payloadSummary: string;
  }) => RelaySignal | null;
};

type DistrictRelayStore = DistrictRelayState & DistrictRelayActions;

export const useDistrictRelayStore = create<DistrictRelayStore>((set, get) => ({
  links: [],
  signals: [],

  bootstrapRelayMesh: () => {
    if (get().links.length > 0) return;

    const links = [
      createRelayLink({
        fromDistrictId: 'DISTRICT-NET-001',
        toDistrictId: 'CITADEL-META-001',
      }),
      createRelayLink({
        fromDistrictId: 'DISTRICT-NET-001',
        toDistrictId: 'MARKET-DISTRICT-001',
      }),
      createRelayLink({
        fromDistrictId: 'CITADEL-META-001',
        toDistrictId: 'WORLD-KERNEL-001',
      }),
    ];

    set({ links });

    for (const link of links) {
      useSecurityReplayStore.getState().logEvent({
        domain: 'fabric',
        type: 'relay_link_created',
        payload: {
          linkId: link.id,
          fromDistrictId: link.fromDistrictId,
          toDistrictId: link.toDistrictId,
        },
      });
    }
  },

  sendSignal: ({ linkId, signalType, payloadSummary }) => {
    const link = get().links.find((item) => item.id === linkId) ?? null;
    if (!link || link.status !== 'active') return null;

    const signal = createRelaySignal({
      linkId,
      signalType,
      payloadSummary,
    });

    const nextLinks = get().links.map((item) =>
      item.id === linkId ? { ...item, lastSignalAt: signal.createdAt } : item
    );

    set({
      links: nextLinks,
      signals: [signal, ...get().signals],
    });

    useSecurityReplayStore.getState().logEvent({
      domain: 'fabric',
      type: 'relay_signal_sent',
      payload: {
        linkId,
        signalType,
      },
    });

    return signal;
  },
}));