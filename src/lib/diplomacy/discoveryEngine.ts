import { ExternalWorld } from './diplomaticCore';
export function discoverWorlds(): ExternalWorld[] {
  // Phase 172: External civilization discovery
  const worlds = ['Nebula-9', 'X-Prime', 'Citadel-Beta'];
  return worlds.map(w => ({ id: w.toLowerCase(), name: w, stance: 'Neutral', lastDiscovery: Date.now() }));
}
