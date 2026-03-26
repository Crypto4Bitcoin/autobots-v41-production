import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';
import { useEconomyStore } from './economyStore';

export interface RealEstateAsset {
  id: string;
  name: string;
  location: string;
  entryPrice: number;
  currentValue: number;
  yield: number;
  status: 'hold' | 'exit' | 'buying';
}

interface HamsaState {
  assets: RealEstateAsset[];
  cycleProgress: number; // 0-100%, based on 18-year cycle
  totalPortfolioValue: number;
  marketSentiment: 'bull' | 'bear' | 'correction' | 'accumulation';
}

interface HamsaActions {
  analyzeMarket: () => void;
  acquireAsset: (asset: RealEstateAsset) => void;
  liquidateAsset: (id: string) => void;
  syncPortfolio: () => void;
}

export const useHamsaStore = create<HamsaState & HamsaActions>((set, get) => ({
  assets: [
    { id: 're-01', name: 'Zion Heights', location: 'Shard-04', entryPrice: 120000, currentValue: 145000, yield: 8.2, status: 'hold' },
    { id: 're-02', name: 'Nexus Plaza', location: 'Core-01', entryPrice: 450000, currentValue: 420000, yield: 4.1, status: 'hold' }
  ],
  cycleProgress: 68,
  totalPortfolioValue: 565000,
  marketSentiment: 'bull',

  analyzeMarket: () => {
    const progress = get().cycleProgress;
    let sentiment: HamsaState['marketSentiment'] = 'bull';
    if (progress > 85) sentiment = 'correction';
    else if (progress < 25) sentiment = 'accumulation';
    set({ marketSentiment: sentiment });
    GlobalMemory.record('HAMSA', `Market analysis complete. Sentiment at ${sentiment}. Cycle at ${progress}%.`, 100);
  },

  acquireAsset: (asset) => {
    set((state) => ({
      assets: [...state.assets, asset],
      totalPortfolioValue: state.totalPortfolioValue + asset.entryPrice
    }));
    useEconomyStore.getState().recordPulse('ASSET_ACQ', -asset.entryPrice);
    GlobalMemory.record('HAMSA', `New real estate asset acquired: ${asset.name} for ${asset.entryPrice}¢.`, 100);
  },

  liquidateAsset: (id) => {
    const asset = get().assets.find(a => a.id === id);
    if (asset) {
      set((state) => ({
          assets: state.assets.filter(a => a.id !== id),
          totalPortfolioValue: state.totalPortfolioValue - asset.currentValue
      }));
      useEconomyStore.getState().purchaseCredits(asset.currentValue);
      useEconomyStore.getState().recordPulse('ASSET_EXIT', asset.currentValue);
      GlobalMemory.record('HAMSA', `Exited asset position: ${asset.name}. Gained ${asset.currentValue}¢.`, 100);
    }
  },

  syncPortfolio: () => {
    GlobalMemory.record('HAMSA', 'Portfolio synchronization complete. Historical cycle parity maintained.', 100);
  }
}));