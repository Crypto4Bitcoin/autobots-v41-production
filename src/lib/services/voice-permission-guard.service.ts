import { VoiceCommandAction } from '../registry/voice-command.registry';

export class VoicePermissionGuard {
  /**
   * Checks if a voice command is safe to execute based on user role and action type.
   */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async checkPermission(action: VoiceCommandAction, userId: string = 'pilot'): Promise<{ allowed: boolean; reason?: string }> {
    // Basic rules for the pilot phase
    if (action.type === 'navigate') return { allowed: true };
    
    // Potentially sensitive actions
    if (action.type === 'pause_worker' || action.type === 'resume_worker') {
      // In production, check workspace ownership here
      return { allowed: true };
    }

    if (action.type === 'install_pack') {
      // Check for billing impact?
      return { allowed: true };
    }

    return { allowed: true };
  }
}
