import { GlobalMemory } from './memory/globalMemory';
import { GlobalLogEvent } from '../contracts/types';
import { useControlStore } from '../stores/controlStore';

export function logDomainEvent(event: Omit<GlobalLogEvent, 'id' | 'timestamp'>) {
  const fullEvent: GlobalLogEvent = {
    ...event,
    id: `ev-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date().toISOString(),
  };

  // 1. Log to the internal GlobalMemory
  GlobalMemory.record(
    fullEvent.domain.toUpperCase(), 
    `${fullEvent.action.toUpperCase()}: ${fullEvent.status.toUpperCase()} ${
        fullEvent.payload ? JSON.stringify(fullEvent.payload) : ''
    }`,
    100
  );

  // 2. Cross-domain update: Push to Control's specific ledger
  useControlStore.getState().addDecision({
    source_layer: fullEvent.domain.toUpperCase(),
    timestamp: fullEvent.timestamp,
    explanation: `${fullEvent.action.toUpperCase()}: ${fullEvent.status.toUpperCase()}`,
    intent_alignment: 1.0 // Normalized
  });

  console.log(`[DomainLogger] [${fullEvent.domain}] ${fullEvent.action}: ${fullEvent.status}`, fullEvent);
  
  return fullEvent;
}
