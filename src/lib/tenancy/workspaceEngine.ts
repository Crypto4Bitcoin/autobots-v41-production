export interface Workspace { id: string; name: string; quota: number; used: number }
export function createWorkspace(id: string, name: string): Workspace {
  // Phase 241: Multi-tenant workspace initialization
  return { id, name, quota: 1000, used: 0 };
}
