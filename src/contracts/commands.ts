export type CommandType = 
  | 'GOVERNANCE_PRERATIFY_ACCORD'
  | 'ECONOMY_ALLOCATE_FUNDS'
  | 'CONTROL_TRIGGER_INTERRUPT'
  | 'REHEARSAL_INITIATE_SIM'
  | 'CULTURE_SYNTHESIZE_LEGACY'
  | 'ASSET_LIQUIDATE_POSITION'
  | 'SYSTEM_SYNC_GLOBAL';

export interface DomainCommand<T = any> {
  id: string;
  type: CommandType;
  source: string;
  target: string;
  payload: T;
  timestamp: string;
  status: 'pending' | 'executing' | 'success' | 'failed';
}

export type CommandHandler = (command: DomainCommand) => Promise<void> | void;
