export function enforceConstitutionalGuard(action: string, stability: number): boolean {
  // Phase 303: AutoBots Constitution
  if (stability < 20 && action.includes('EXPLOSIVE')) return false;
  return true;
}
