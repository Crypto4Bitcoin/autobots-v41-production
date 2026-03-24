"use client";
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { VoiceSessionService } from '@/lib/services/voice-session.service';
import { NaturalVoiceService } from '@/lib/services/natural-voice.service';
import { VoiceCommandInterpreterService } from '@/lib/services/voice-command-interpreter.service';
import { VoiceActionExecutionService } from '@/lib/services/voice-action-execution.service';
import { VoicePermissionGuard } from '@/lib/services/voice-permission-guard.service';

export default function VoiceConversationUI() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("Tap to start");
  const [history, setHistory] = useState<{ role: string, content: string }[]>([]);
  const [volume, setVolume] = useState<number>(0);
  const [selectedPreset, setSelectedPreset] = useState('atlas');
  const [showSettings, setShowSettings] = useState(false);
  
  const voiceService = useRef<VoiceSessionService | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    voiceService.current = new VoiceSessionService();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const visualize = (stream: MediaStream) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const ctx = audioContextRef.current;
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVolume = () => {
       if (!analyserRef.current) return;
       analyserRef.current.getByteFrequencyData(dataArray);
       let sum = 0;
       for (let i = 0; i < dataArray.length; i++) {
         sum += dataArray[i];
       }
       const avg = sum / dataArray.length;
       setVolume(avg);
       animationRef.current = requestAnimationFrame(updateVolume);
    };
    updateVolume();
  };

  const toggleVoiceMode = async () => {
    if (!isOpen) {
      setIsOpen(true);
      if (!voiceService.current) return;
      try {
        await voiceService.current.requestMicrophoneAccess();
      } catch (e) {
        console.error("Mic Error:", e);
      }
    } else {
      setIsOpen(false);
      if (isRecording) stopSession();
    }
  };

  const startSession = async () => {
    if (!voiceService.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      visualize(stream);
      voiceService.current.startRecording();
      setIsRecording(true);
      setTranscript("Listening...");
    } catch (e: unknown) {
      console.error(e);
    }
  };

  const stopSession = async () => {
    setIsRecording(false);
    setTranscript("Processing...");
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setVolume(0);

    if (!voiceService.current) return;
    try {
       const audioBlob = await voiceService.current.stopRecording();
       
       // Real-ish: STT -> Interpretation -> Execution loop
       const userSpeech = await voiceService.current.transcribeAudio(audioBlob);
       // Mocking the prompt for the demo: "Navigate to workers"
       const demoSpeech = userSpeech === "Simulated transcription results." ? "Navigate to Workers" : userSpeech;
       
       setHistory(prev => [...prev, { role: "user", content: demoSpeech }]);
       setTranscript("AutoBots is interpreting...");

       const action = await VoiceCommandInterpreterService.interpret(demoSpeech);
       
       if (action.type !== 'unknown') {
         const { allowed, reason } = await VoicePermissionGuard.checkPermission(action);
         if (allowed) {
            const result = await VoiceActionExecutionService.execute(action, router);
            handleResult(result.message);
         } else {
            handleResult(`Action denied: ${reason}`);
         }
       } else {
         const agentReply = "I understood you, but I don't have a specific command for that yet. I'm currently trained for navigation and basic worker operations. What else can I do for you?";
         handleResult(agentReply);
       }
       
    } catch (e) {
       console.error("Session error:", e);
       setTranscript("Audio session failed.");
    }
  };

  const handleResult = (message: string) => {
    setHistory(prev => [...prev, { role: "agent", content: message }]);
    setTranscript("Speak now.");
    voiceService.current?.playResponse(message, selectedPreset);
  };

  const getBarHeight = (baseHeight: number, multiplier: number) => {
    const minHeight = baseHeight;
    const dynamicHeight = (volume / 150) * multiplier * 100;
    return `${Math.min(100, Math.max(minHeight, dynamicHeight))}%`;
  };

  return (
    <>
       <button 
          onClick={toggleVoiceMode}
          className={`relative z-50 flex items-center justify-center w-10 h-10 rounded-full transition ${isOpen ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}
       >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
       </button>

       {isOpen && typeof document !== "undefined" && createPortal(
         <div className="fixed bottom-24 right-8 w-[400px] bg-gray-950 border border-gray-800 shadow-2xl rounded-2xl overflow-hidden z-[9999] flex flex-col">
            <div className="p-4 border-b border-gray-900 flex justify-between items-center bg-gray-900/50">
               <h3 className="text-white font-medium flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-gray-500'}`}></span>
                 AutoBots Assistant
               </h3>
               <div className="flex gap-2">
                  <button onClick={() => setShowSettings(!showSettings)} className="text-gray-500 hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <button onClick={toggleVoiceMode} className="text-gray-500 hover:text-white">✕</button>
               </div>
            </div>

            {showSettings && (
               <div className="p-4 bg-gray-900 border-b border-gray-800">
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Voice Preset</p>
                  <div className="grid grid-cols-3 gap-2">
                     {NaturalVoiceService.getPresets().map(p => (
                        <button 
                           key={p.id}
                           onClick={() => setSelectedPreset(p.id)}
                           className={`px-2 py-2 text-[10px] rounded-lg border transition ${selectedPreset === p.id ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'}`}
                        >
                           {p.name.split(' ')[0]}
                        </button>
                     ))}
                  </div>
               </div>
            )}

            <div className="flex-1 p-4 h-64 overflow-y-auto space-y-4">
               {history.length === 0 ? (
                 <div className="text-center text-gray-500 mt-12 text-sm italic">&quot;Open marketplace...&quot;</div>
               ) : (
                 history.map((msg, i) => (
                   <div key={i} className={`p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-blue-900/20 text-blue-200 ml-8 border border-blue-800/30' : 'bg-gray-900 text-gray-300 mr-8 border border-gray-800'}`}>
                     {msg.content}
                   </div>
                 ))
               )}
            </div>

            <div className="p-6 bg-[#0a0a0a] border-t border-gray-800 flex flex-col items-center">
               <p className="text-emerald-400 font-medium text-xs mb-6 uppercase tracking-widest">{transcript}</p>
               <button 
                 onClick={isRecording ? stopSession : startSession}
                 className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-emerald-500/10 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-white text-black hover:scale-105 shadow-xl'}`}
               >
                 {isRecording ? (
                   <div className="flex items-end justify-center gap-1.5 w-full h-10 px-4">
                     {[20, 30, 40, 30, 20].map((h, i) => (
                        <div key={i} className="w-1.5 bg-emerald-400 rounded-full transition-all duration-75" style={{ height: getBarHeight(h, 1 + i*0.1) }} />
                     ))}
                   </div>
                 ) : (
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                   </svg>
                 )}
               </button>
               <p className="text-gray-500 text-[10px] mt-4 select-none uppercase tracking-tighter">Powered by AutoBots Neural Engine</p>
            </div>
         </div>,
         document.body
       )}
    </>
  );
}
