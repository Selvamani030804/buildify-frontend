import React, { useEffect, useRef, useState } from 'react';
import { connectToLiveAPI } from '../services/geminiService';

export const VoiceConsultant: React.FC = () => {
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  
  // Refs for audio handling
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const liveClientRef = useRef<{ sendAudio: (d: Float32Array) => void; close: () => void } | null>(null);
  
  const visualizerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  // Simple visualizer effect
  useEffect(() => {
    if (!active || !visualizerRef.current) return;
    let animId: number;
    const animate = () => {
        if(visualizerRef.current) {
            const scale = 1 + (volume * 2);
            visualizerRef.current.style.transform = `scale(${Math.min(scale, 1.5)})`;
            visualizerRef.current.style.opacity = `${0.5 + (volume * 2)}`;
        }
        animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
  }, [active, volume]);

  const startSession = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = ctx;
      
      // Setup Input processing
      const source = ctx.createMediaStreamSource(stream);
      inputSourceRef.current = source;
      
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        // Calculate volume for visualizer
        let sum = 0;
        for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
        setVolume(Math.sqrt(sum / inputData.length));

        // Send to Live API
        if (liveClientRef.current) {
          liveClientRef.current.sendAudio(inputData);
        }
      };

      source.connect(processor);
      processor.connect(ctx.destination);

      // Connect to Gemini
      liveClientRef.current = await connectToLiveAPI(
        (audioBuffer) => { /* Audio played by service logic */ },
        () => stopSession()
      );

      setActive(true);
      
    } catch (e) {
      console.error(e);
      setError("Could not access microphone or connect to API.");
    }
  };

  const stopSession = () => {
    if (liveClientRef.current) {
      liveClientRef.current.close();
      liveClientRef.current = null;
    }
    if (inputSourceRef.current) {
        inputSourceRef.current.disconnect();
        inputSourceRef.current = null;
    }
    if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
    }
    if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
    setActive(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center p-8 bg-slate-900/50 text-white rounded-3xl relative overflow-hidden border border-slate-800 shadow-2xl backdrop-blur-sm">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 text-center space-y-12">
        <div className="space-y-4">
           <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">AI Strategy Consultant</h2>
           <p className="text-indigo-200 text-lg">Have a real-time voice conversation to brainstorm ideas.</p>
        </div>

        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
            {/* Visualizer Circle */}
            <div 
                ref={visualizerRef}
                className={`absolute inset-0 rounded-full bg-indigo-500 blur-xl transition-all duration-75 ${active ? 'opacity-60' : 'opacity-0'}`}
            ></div>
            
            <button
                onClick={active ? stopSession : startSession}
                className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all hover:scale-105 ${
                    active ? 'bg-red-500 hover:bg-red-600 border-4 border-red-400/30' : 'bg-white hover:bg-indigo-50 border-4 border-white/20'
                }`}
            >
                <span className="text-4xl">
                    {active ? '⏹️' : '🎙️'}
                </span>
            </button>
        </div>

        <div className="h-8">
            {active ? (
                <div className="flex items-center justify-center gap-1.5">
                    <span className="block w-1.5 h-3 bg-indigo-400 animate-pulse rounded-full"></span>
                    <span className="block w-1.5 h-5 bg-indigo-400 animate-pulse rounded-full" style={{animationDelay: '0.1s'}}></span>
                    <span className="block w-1.5 h-3 bg-indigo-400 animate-pulse rounded-full" style={{animationDelay: '0.2s'}}></span>
                    <span className="text-base font-mono text-indigo-300 ml-3 tracking-widest uppercase">Listening...</span>
                </div>
            ) : (
                <span className="text-sm text-slate-500 font-medium tracking-wide uppercase">Click microphone to start</span>
            )}
        </div>

        {error && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-6 py-3 rounded-xl text-sm max-w-md mx-auto backdrop-blur-md">
                {error}
            </div>
        )}
      </div>
    </div>
  );
};