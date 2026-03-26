import { useGovernanceStore } from '../stores/governanceStore';
import { useEconomyStore } from '../stores/economyStore';
import { useControlStore } from '../stores/controlStore';
import { useCultureStore } from '../stores/cultureStore';
import { useRehearsalStore } from '../stores/rehearsalStore';

import { toGovernanceContract } from './governanceContract';
import { toEconomyContract } from './economyContract';
import { toControlContract } from './controlContract';
import { toCultureContract } from './cultureContract';
import { toRehearsalContract } from './rehearsalContract';
import { DomainContract } from './types';

export const domainRegistry: Record<string, () => DomainContract> = {
  governance: () => toGovernanceContract(useGovernanceStore.getState()),
  economy: () => toEconomyContract(useEconomyStore.getState()),
  control: () => toControlContract(useControlStore.getState()),
  culture: () => toCultureContract(useCultureStore.getState()),
  rehearsal: () => toRehearsalContract(useRehearsalStore.getState()),
};

export function getDomainContract(domainId: string): DomainContract | null {
  const resolver = domainRegistry[domainId];
  return resolver ? resolver() : null;
}
