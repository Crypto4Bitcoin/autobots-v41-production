import { NaturalVoiceService } from './natural-voice.service';
import { SpeechFormattingService } from './speech-formatting.service';

export class VoiceSessionService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  
  /**
   * Requests microphone permissions from the browser.
   */
  async requestMicrophoneAccess(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      return true;
    } catch (err) {
      console.error("[VoiceSessionService] Microphone access denied.", err);
      return false;
    }
  }

  /**
   * Starts recording the user's voice for live transcription.
   */
  startRecording(onChunk?: (chunk: Blob) => void): void {
    if (!this.mediaRecorder) throw new Error("Microphone not initialized");
    
    // Interrupt any active assistant speech
    this.stopSpeaking();
    
    this.audioChunks = [];
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
        if (onChunk) onChunk(event.data);
      }
    };
    
    this.mediaRecorder.start(250); 
    this.isRecording = true;
    console.log("[VoiceSessionService] Recording started.");
  }

  /**
   * Stops recording and returns the full audio blob.
   */
  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) return reject("MediaRecorder not found");

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.isRecording = false;
        console.log("[VoiceSessionService] Recording stopped. Blob size:", audioBlob.size);
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Stops all active assistant speech immediately.
   */
  stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  /**
   * Mock STT pipeline
   */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    console.log("[VoiceSessionService] Transcribing audio...");
    await new Promise(r => setTimeout(r, 600));
    return "Simulated transcription results.";
  }

  /**
   * Natural TTS playback with chunked speech.
   */
  async playResponse(text: string, presetId: string = 'atlas'): Promise<void> {
    console.log(`[VoiceSessionService] Preparing response: "${text}"`);
    
    const simplifiedText = SpeechFormattingService.simplifyForVoice(text);
    const chunks = SpeechFormattingService.formatForSpeech(simplifiedText);
    
    // Mock neural synthesis for each chunk
    for (const chunk of chunks) {
      await NaturalVoiceService.synthesize(chunk, presetId);
      
      if ('speechSynthesis' in window) {
        await this.speakChunk(chunk);
      }
    }
  }

  private speakChunk(text: string): Promise<void> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      
      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };
      
      utterance.onerror = () => {
        this.currentUtterance = null;
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }
}
