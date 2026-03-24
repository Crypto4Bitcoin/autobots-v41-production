import { VoiceCommandAction } from '../registry/voice-command.registry';

export interface VoiceSessionContext {
  lastAction?: VoiceCommandAction;
  lastResult?: { success: boolean; message: string };
  turnCount: number;
  pendingConfirmation?: VoiceCommandAction;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  contextEntities: Record<string, any>;
}

export class VoiceSessionStateService {
  private static sessions: Record<string, VoiceSessionContext> = {};

  static getSession(sessionId: string): VoiceSessionContext {
    if (!this.sessions[sessionId]) {
      this.sessions[sessionId] = {
        turnCount: 0,
        contextEntities: {}
      };
    }
    return this.sessions[sessionId];
  }

  static updateSession(sessionId: string, patch: Partial<VoiceSessionContext>): void {
    const session = this.getSession(sessionId);
    Object.assign(session, patch);
  }

  static clearSession(sessionId: string): void {
    delete this.sessions[sessionId];
  }
}
