export class SpeechFormattingService {
  /**
   * Formats long text into smaller, natural spoken chunks.
   * Adds pauses and emphasis indicators where appropriate.
   */
  static formatForSpeech(text: string): string[] {
    // Basic sentence splitting for now
    // In a real system, this would use NLP to find natural pauses
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0).map(s => s.trim() + ".");
  }

  /**
   * Simplifies dense text for voice-first delivery.
   */
  static simplifyForVoice(text: string): string {
    // Remove technical jargon or long numbers typically unreadable by voice
    return text
      .replace(/https?:\/\/\S+/g, 'the link')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }
}
