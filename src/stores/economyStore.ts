import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface EconomyState {
  tiers: PricingTier[];
  sovereignCredits: number;
  marketValue: number;
}

interface EconomyActions {
  purchaseCredits: (amount: number) => void;
  upgradeTier: (id: string) => void;
  syncEconomy: () => void;
}

export type EconomyStoreType = EconomyState & EconomyActions;

export const useEconomyStore = create<EconomyStoreType>((set, get) => ({
  tiers: [
    { id: 'tier-01', name: 'Planetary', price: 0, features: ['Basic Shard Access', 'Standard Relay', 'Public Ledger'] },
    { id: 'tier-02', name: 'Sovereign', price: 99, features: ['Private Shard Hosting', 'Advanced Relay', 'Sovereign ID'] },
    { id: 'tier-03', name: 'Aethelgard', price: 999, features: ['Omniversal Access', 'Unlimited Shards', 'Eternal Governance'] }
  ],
  sovereignCredits: 50000,
  marketValue: 124.5,

  purchaseCredits: (amount) => {
    set((state) => ({ sovereignCredits: state.sovereignCredits + amount }));
    GlobalMemory.record("ECONOMY", `${amount} credits injected into the regional shard. Universal value increased.`, 100);
  },

  upgradeTier: (id) => {
    const tier = get().tiers.find(t => t.id === id);
    if (tier) {
        GlobalMemory.record("ECONOMY", `Civilizational upgrade detected: ${tier.name}. New economic parity baseline established.`, 100);
    }
  },

  syncEconomy: () => {
    GlobalMemory.record("ECONOMY", "Omniversal economy synchronized. All value models aligned.", 100);
  }
}));
