// eslint-disable-next-line @typescript-eslint/no-unused-vars
﻿import { VoiceCommandAction, VOICE_COMMAND_SCHEMA } from '../registry/voice-command.registry';

export class VoiceCommandInterpreterService {
  /**
   * Interprets natural language into a structured VoiceCommandAction.
   * In production, this would use GPT-4/o1 to map intent to the VOICE_COMMAND_SCHEMA.
   */
  static async interpret(text: string): Promise<VoiceCommandAction> {
    const input = text.toLowerCase();
    console.log(`[VoiceCommandInterpreter] Analyzing: "${input}"`);

    // Simple heuristic-based mapping for the pilot
    if (input.includes('navigate to') || input.includes('go to') || input.includes('open')) {
      const dest = input.split('to').pop()?.trim() || input.split('open').pop()?.trim();
      return { type: 'navigate', params: { destination: dest }, confidence: 0.95 };
    }

    if (input.includes('pause')) {
      const name = input.split('pause').pop()?.trim();
      return { type: 'pause_worker', params: { workerName: name }, confidence: 0.9 };
    }

    if (input.includes('resume') || input.includes('start')) {
      const name = input.split('resume').pop()?.trim() || input.split('start').pop()?.trim();
      return { type: 'resume_worker', params: { workerName: name }, confidence: 0.9 };
    }

    if (input.includes('install')) {
      const name = input.split('install').pop()?.trim();
      return { type: 'install_pack', params: { packName: name }, confidence: 0.85 };
    }

    return { type: 'unknown', params: {}, confidence: 0 };
  }
}
