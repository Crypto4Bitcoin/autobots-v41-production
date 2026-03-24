export type VoiceActionType = 
  | 'navigate'
  | 'pause_worker'
  | 'resume_worker'
  | 'install_pack'
  | 'run_workflow'
  | 'create_briefing'
  | 'ask_confirmation'
  | 'unknown';

export interface VoiceCommandAction {
  type: VoiceActionType;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Record<string, any>;
  confidence: number;
}

export const VOICE_COMMAND_SCHEMA = {
  navigate: {
    description: "Navigate to a specific page or dashboard section.",
    params: { destination: "string (e.g. workers, marketplace, dashboard)" }
  },
  pause_worker: {
    description: "Pause a specific AI worker by name or ID.",
    params: { workerName: "string" }
  },
  resume_worker: {
    description: "Resume a specific AI worker by name or ID.",
    params: { workerName: "string" }
  },
  install_pack: {
    description: "Install a capability pack from the marketplace.",
    params: { packName: "string" }
  }
};

export const VoiceCommandAction = {} as any;
