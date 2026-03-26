import { create } from 'zustand';
import { GlobalMemory } from '../lib/memory/globalMemory';
import { logDomainEvent } from '../lib/domainLogger';
import { dashboardRepository } from '../lib/data-access';
import { governanceRepository } from '../lib/governance-repository';
import { DashboardPayload } from '../lib/types';

export type GovernanceStatus = 'draft' | 'proposed' | 'ratified' | 'rejected' | 'enforced' | 'ratifying';
export type DataMode = "mock" | "live" | "fallback";

export interface GovernanceAccord {
  id: string;
  slug: string;
  title: string;
  status: GovernanceStatus;
  complianceRate: number;
  summary?: string;
  createdAt: string;
  updatedAt?: string;
}

interface GovernanceState {
  dataMode: DataMode;
  accords: GovernanceAccord[];
  cases: any[]; 
  metrics: Array<{ id: string; label: string; value: number | string; unit?: string }>;
  totalLegislation: number;
  isRatifying: boolean;
  isSyncing: boolean;
  error: string | null;
  lastUpdated: string | null;
}

interface GovernanceActions {
  proposeAccord: (title: string, summary?: string) => Promise<void>;
  ratifyAccord: (id: string) => Promise<void>;
  syncGovernance: () => Promise<void>;
}

export type GovernanceStoreType = GovernanceState & GovernanceActions;

// Mock Data for Fallback
const mockAccords: GovernanceAccord[] = [
    { id: 'acc-01', slug: 'peace-01', title: 'Universal Peace Accord', status: 'enforced', complianceRate: 100, createdAt: new Date().toISOString() },
    { id: 'acc-02', slug: 'shard-01', title: 'Shard Resource Parity', status: 'ratifying', complianceRate: 92, createdAt: new Date().toISOString() },
    { id: 'acc-03', slug: 'ethics-01', title: 'Neural Ethics Baseline', status: 'draft', complianceRate: 0, createdAt: new Date().toISOString() }
];

export const useGovernanceStore = create<GovernanceStoreType>((set, get) => ({
  dataMode: 'mock',
  accords: mockAccords,
  cases: [], 
  metrics: [
    { id: 'leg-01', label: 'Total Legislation', value: 42, unit: '§' }
  ],
  totalLegislation: 42,
  isRatifying: false,
  isSyncing: false,
  error: null,
  lastUpdated: null,

  proposeAccord: async (title, summary) => {
    set({ isSyncing: true, error: null });
    const slug = title.toLowerCase().replace(/\s+/g, '-').substring(0, 30);
    
    try {
        if (get().dataMode !== 'mock') {
            await governanceRepository.createAccord({ slug, title, summary });
        }

        logDomainEvent({
            domain: "governance",
            action: "create_accord",
            status: "success",
            payload: { slug, title }
        });

        // Always update local for instant UI feel if in mock mode
        if (get().dataMode === 'mock') {
            const id = "acc-" + Math.random().toString(36).substring(2, 7).toUpperCase();
            set(state => ({
                accords: [{ id, slug, title, status: 'draft', complianceRate: 0, summary, createdAt: new Date().toISOString() }, ...state.accords],
                totalLegislation: state.totalLegislation + 1
            }));
        } else {
            await get().syncGovernance();
        }
    } catch (err: any) {
        set({ error: err.message });
        logDomainEvent({
            domain: "governance",
            action: "create_accord",
            status: "failed",
            error: err.message
        });
    } finally {
        set({ isSyncing: false });
    }
  },

  ratifyAccord: async (id) => {
    set({ isRatifying: true, error: null });
    
    try {
        if (get().dataMode !== 'mock') {
            await governanceRepository.ratifyAccord(id);
        }

        logDomainEvent({
            domain: "governance",
            action: "ratify_accord",
            status: "success",
            payload: { id }
        });

        if (get().dataMode === 'mock') {
            set(state => ({
                accords: state.accords.map(a => a.id === id ? { ...a, status: 'ratifying' } : a)
            }));
        } else {
            await get().syncGovernance();
        }
    } catch (err: any) {
        set({ error: err.message });
        logDomainEvent({
            domain: "governance",
            action: "ratify_accord",
            status: "failed",
            error: err.message
        });
    } finally {
        set({ isRatifying: false });
    }
  },

  syncGovernance: async () => {
    set({ isSyncing: true, error: null });

    try {
      const dashboard = await dashboardRepository.getDashboard("governance");
      if (!dashboard || dashboard.dataMode === 'mock') {
          // If repository returns mock or null, we stay in mock mode but update lastUpdated
          set({ 
            dataMode: 'mock', 
            isSyncing: false, 
            lastUpdated: new Date().toISOString() 
          });
          return;
      }

      // Map Dashboard to Governance Accords
      const accords: GovernanceAccord[] = (dashboard.entities || []).map((e: any) => ({
        id: e.id,
        slug: e.metadata?.slug || e.id,
        title: e.name,
        status: (e.status === 'active' ? 'ratified' : e.status === 'draft' ? 'draft' : 'proposed') as GovernanceStatus,
        complianceRate: e.metadata?.compliance || 0,
        summary: e.description,
        createdAt: e.created_at || new Date().toISOString()
      }));

      // Map Cases for Contract Compatibility
      const cases = accords.map(a => ({
        id: a.id,
        title: a.title,
        status: a.status.toUpperCase(),
        createdAt: a.createdAt
      }));

      // Map Metrics
      const metrics = (dashboard.metrics || []).map((m: any, i: number) => ({
        id: `m-${i}`,
        label: m.title,
        value: m.value,
        unit: ''
      }));

      set({
        dataMode: "live",
        accords,
        cases,
        metrics,
        lastUpdated: new Date().toISOString(),
        isSyncing: false,
        error: null,
      });

    } catch (err) {
      const message = err instanceof Error ? err.message : "Governance sync failed";
      console.error(message);

      set((state) => ({
        dataMode: "fallback",
        isSyncing: false,
        error: message,
        // Fallback to existing or mock if empty
        accords: state.accords.length ? state.accords : mockAccords,
        lastUpdated: state.lastUpdated ?? new Date().toISOString(),
      }));
    }
  }
}));
