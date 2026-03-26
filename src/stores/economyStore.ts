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
  treasuryBalance: number;
  marketValue: number;
  irsPulses: any[]; // Legacy Support
}

interface EconomyActions {
  purchaseCredits: (amount: number) => void;
  upgradeTier: (id: string) => void;
  syncEconomy: () => void;
  removeIRSPulse: (id: string) => void;
  recordPulse: (type: string, value: number) => void;
}

export type EconomyStoreType = EconomyState & EconomyActions;

export const useEconomyStore = create<EconomyStoreType>((set, get) => ({
  tiers: [
    { id: 'tier-01', name: 'Planetary', price: 0, features: ['Basic Shard Access', 'Standard Relay', 'Public Ledger'] },
    { id: 'tier-02', name: 'Sovereign', price: 99, features: ['Private Shard Hosting', 'Advanced Relay', 'Sovereign ID'] },
    { id: 'tier-03', name: 'Aethelgard', price: 999, features: ['Omniversal Access', 'Unlimited Shards', 'Eternal Governance'] }
  ],
  sovereignCredits: 50000,
  treasuryBalance: 50000,
  marketValue: 124.5,
  irsPulses: [],

  purchaseCredits: (amount) => {
    set((state) => ({ 
        sovereignCredits: state.sovereignCredits + amount,
        treasuryBalance: state.sovereignCredits + amount 
    }));
    GlobalMemory.record('ECONOMY', `${amount} credits injected into the regional shard. Universal value increased.`, 100);
  },

  upgradeTier: (id) => {
    const tier = get().tiers.find(t => t.id === id);
    if (tier) {
        GlobalMemory.record('ECONOMY', `Civilizational upgrade detected: ${tier.name}. New economic parity baseline established.`, 100);
    }
  },

  syncEconomy: () => {
    GlobalMemory.record('ECONOMY', 'Omniversal economy synchronized. All value models aligned.', 100);
  },

  recordPulse: (type, value) => {
    const newPulse = {
      id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      value,
      timestamp: new Date().toISOString()
    };
    set((state) => ({ irsPulses: [newPulse, ...state.irsPulses].slice(0, 50) }));
    GlobalMemory.record('ECONOMY', `IRS Pulse Emitted: ${type} (+${value}). Value flow registered.`, 80);
  },

  removeIRSPulse: (id) => {
    set((state) => ({ irsPulses: state.irsPulses.filter(p => p.id !== id) }));
  }
}));