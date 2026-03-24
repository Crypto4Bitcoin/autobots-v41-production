export interface VoiceOutput {
  text: string;
  audioUri: string;
}

export class VoiceWorker {
  /**
   * Converts speech (audio) to text.
   * Shell for OpenAI Whisper or similar.
   */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async speechToText(audioBlob: unknown): Promise<string> {
    console.log("[VoiceWorker] Processing speech audio...");
    // Mock transcription logic
    return "Nova, what is the status of my research workflow?";
  }

  /**
   * Converts text to speech (audio).
   * Shell for OpenAI TTS or ElevenLabs.
   */
  static async textToSpeech(text: string): Promise<VoiceOutput> {
    console.log(`[VoiceWorker] Generating speech for: "${text}"`);
    // Mock TTS logic
    return {
      text,
      audioUri: `storage://voice/output-${Date.now()}.mp3`
    };
  }
}
