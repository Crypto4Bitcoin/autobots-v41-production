import { VoiceCommandAction } from '../registry/voice-command.registry';

export class VoiceActionExecutionService {
  /**
   * Executes a structured voice command.
   * Maps commands to router navigation, API calls, or state updates.
   */
  static async execute(action: VoiceCommandAction, router: unknown): Promise<{ success: boolean; message: string }> {
    console.log(`[VoiceActionExecution] Executing ${action.type}`, action.params);

    switch (action.type) {
      case 'navigate': {
        const dest = action.params.destination?.toLowerCase();
        if (dest.includes('worker')) {
          router.push('/workers');
          return { success: true, message: "Navigating to Workers." };
        } else if (dest.includes('marketplace')) {
          router.push('/marketplace');
          return { success: true, message: "Opening Marketplace." };
        } else if (dest.includes('dashboard')) {
          router.push('/dashboard');
          return { success: true, message: "Returning to Dashboard." };
        } else if (dest.includes('builder')) {
          router.push('/builder');
          return { success: true, message: "Opening Workflow Builder." };
        }
        return { success: false, message: `Unknown destination: ${dest}` };
      }

      case 'pause_worker': {
        // Mock API call to pause worker
        console.log(`[API] Pausing worker: ${action.params.workerName}`);
        return { success: true, message: `Worker ${action.params.workerName} has been paused.` };
      }

      case 'resume_worker': {
        // Mock API call to resume worker
        console.log(`[API] Resuming worker: ${action.params.workerName}`);
        return { success: true, message: `Worker ${action.params.workerName} is now active.` };
      }

      case 'install_pack': {
        // Mock API call to install pack
        console.log(`[API] Installing pack: ${action.params.packName}`);
        return { success: true, message: `Pack ${action.params.packName} is being installed.` };
      }

      default:
        return { success: false, message: "Unsupported action." };
    }
  }
}
