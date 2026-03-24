export interface Destination {
  path: string;
  label: string;
  status: 'active' | 'coming_soon' | 'hidden';
  fallbackMessage?: string;
}

export const DESTINATION_MAP: Record<string, Destination> = {
  'nav.dashboard': { path: '/dashboard', label: 'Dashboard', status: 'active' },
  'nav.marketplace': { path: '/marketplace', label: 'Marketplace', status: 'active' },
  'nav.workers': { path: '/workers', label: 'Workers', status: 'active' },
  'nav.builder': { path: '/builder', label: 'Builder', status: 'active' },
  'nav.briefings': { path: '/briefings', label: 'Briefings', status: 'active' },
  'nav.results': { path: '/dashboard/results', label: 'Results', status: 'active' },
  'nav.pricing': { 
    path: '#', 
    label: 'Pricing', 
    status: 'coming_soon',
    fallbackMessage: 'Enterprise billing is currently in gated pilot. Contact control for access.'
  },
  'nav.settings': { 
    path: '#', 
    label: 'Settings', 
    status: 'coming_soon',
    fallbackMessage: 'System configurations are locked during autonomous calibration.'
  },
  'nav.team': { 
    path: '#', 
    label: 'Team Workspace', 
    status: 'coming_soon',
    fallbackMessage: 'Federated team sync is coming in Phase 68.'
  }
};

export const Destination = {} as any;
