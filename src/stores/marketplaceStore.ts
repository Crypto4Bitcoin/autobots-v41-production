import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';

interface MarketplacePack {
  id: string;
  name: string;
  category: 'logistics' | 'intelligence' | 'security';
  price: number;
  installs: number;
  rating: number;
}

interface MarketplaceState {
  packs: MarketplacePack[];
  sovereignCredits: number;
  isPurchasing: boolean;
}

interface MarketplaceActions {
  purchasePack: (id: string) => void;
  publishPack: (pack: Omit<MarketplacePack, 'id' | 'installs' | 'rating'>) => void;
  optimizeEconomy: () => void;
  syncMarketplace: () => void;
}

export type MarketplaceStoreType = MarketplaceState & MarketplaceActions;

export const useMarketplaceStore = create<MarketplaceStoreType>((set, get) => ({
  packs: [
    { id: 'pack-01', name: 'Neural Overlink', category: 'intelligence', price: 5000, installs: 1200, rating: 4.9 },
    { id: 'pack-02', name: 'Shard Shield', category: 'security', price: 3000, installs: 850, rating: 4.7 },
    { id: 'pack-03', name: 'Quantum Courier', category: 'logistics', price: 2000, installs: 2100, rating: 4.6 }
  ],
  sovereignCredits: 500000,
  isPurchasing: false,

  purchasePack: (id) => {
    set({ isPurchasing: true });
    setTimeout(() => {
        const pack = get().packs.find(p => p.id === id);
        if (pack && get().sovereignCredits >= pack.price) {
            set((state) => ({ 
                sovereignCredits: state.sovereignCredits - pack.price,
                isPurchasing: false
            }));
            GlobalMemory.record("MARKETPLACE", `Pack ${pack.name} acquired. Resource parity maintained.`, 100);
        } else {
            set({ isPurchasing: false });
        }
    }, 2000);
  },

  publishPack: (packData) => {
    const id = "pack-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    set((state) => ({ 
        packs: [...state.packs, { ...packData, id, installs: 0, rating: 5.0 }].slice(0, 20)
    }));
    GlobalMemory.record("MARKETPLACE", `New construct published: ${packData.name}. Universal availability initialized.`, 100);
  },

  optimizeEconomy: () => {
    set((state) => ({ sovereignCredits: state.sovereignCredits + 10000 }));
    GlobalMemory.record("MARKETPLACE", "Omniversal economy optimized. Credits recalibrated to post-scarcity baseline.", 100);
  },

  syncMarketplace: () => {
    GlobalMemory.record("MARKETPLACE", "Omniversal marketplace synchronized. All commercial models aligned.", 100);
  }
}));
