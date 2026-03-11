
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Flame, Wind, RotateCcw, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BirthdayCakeProps {
  isLit: boolean;
  onBlownOut: () => void;
  isBlownOut: boolean;
  onReset: () => void;
}

export function BirthdayCake({ isLit, onBlownOut, isBlownOut, onReset }: BirthdayCakeProps) {
  const [candlesLit, setCandlesLit] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const blowSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isLit && !isBlownOut) {
      const timer = setTimeout(() => setCandlesLit(true), 800);
      return () => clearTimeout(timer);
    } else {
      setCandlesLit(false);
    }
  }, [isLit, isBlownOut]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      setIsListening(true);
      detectBlow();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const detectBlow = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setAudioLevel(average);

    // Threshold for detecting a strong blow
    if (average > 65) {
      handleBlowSuccess();
    } else {
      animationFrameRef.current = requestAnimationFrame(detectBlow);
    }
  };

  const handleBlowSuccess = () => {
    stopListening();
    
    // Play blowing sound
    if (!blowSoundRef.current) {
      blowSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    }
    blowSoundRef.current.volume = 0.5;
    blowSoundRef.current.play().catch(() => {});

    onBlownOut();
  };

  const stopListening = () => {
    setIsListening(false);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
  };

  useEffect(() => {
    return () => stopListening();
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center py-10 scale-110 md:scale-125">
      {/* Interaction Prompts */}
      {isLit && !isBlownOut && (
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 text-center space-y-4 animate-fade-in">
          <h3 className="text-xl font-headline font-bold text-primary gold-text-glow leading-tight">
            Make a Wish and Blow the Candles 🎂
          </h3>
          
          {!isListening ? (
            <Button 
              onClick={startListening}
              className="bg-primary/20 border-2 border-primary/50 text-primary hover:bg-primary/30 rounded-full px-8 py-3 group gold-glow gold-shimmer h-auto"
            >
              <Mic className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Blow the Candles
            </Button>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-40 h-3 bg-white/10 rounded-full overflow-hidden border border-primary/30 relative">
                <div 
                  className="h-full bg-primary transition-all duration-75 gold-glow" 
                  style={{ width: `${Math.min(audioLevel * 1.5, 100)}%` }}
                />
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary/80 animate-pulse font-medium">Listening for your wish...</p>
            </div>
          )}
        </div>
      )}

      {/* Reset/Celebrate Again Button */}
      {isBlownOut && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full text-center animate-surprise z-30">
          <Button 
            variant="ghost" 
            onClick={onReset}
            className="text-primary hover:text-primary/80 group bg-primary/10 border border-primary/20 rounded-full px-6"
          >
            <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-700" />
            Celebrate Again 🎉
          </Button>
        </div>
      )}

      {/* Candles Section */}
      <div className="flex gap-5 mb-[-12px] relative z-20 items-end">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative flex flex-col items-center">
            {/* Flame */}
            <div 
              className={`transition-all duration-1000 ease-out transform ${
                candlesLit ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-0 translate-y-4'
              }`}
            >
              <div className="relative">
                <Flame className="w-7 h-7 text-orange-400 fill-orange-500 animate-pulse" />
                <div className="absolute inset-0 bg-orange-400/50 blur-xl rounded-full animate-sparkle" />
              </div>
            </div>
            
            {/* Smoke animation when blown out */}
            {isBlownOut && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-6 h-12 opacity-0 animate-fade-in pointer-events-none">
                <div 
                  className="w-1.5 h-full bg-white/20 blur-md rounded-full animate-float" 
                  style={{ animationDelay: `${i * 0.1}s`, animationDuration: '3s' }}
                />
              </div>
            )}

            {/* Candle Body */}
            <div className="w-2.5 h-10 bg-gradient-to-b from-primary via-primary/70 to-primary/40 rounded-t-sm border border-primary/20 shadow-lg" />
          </div>
        ))}
      </div>

      {/* Cake Top Layer */}
      <div className="w-48 h-24 bg-[#400015] luxury-border rounded-t-3xl relative z-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-5 bg-primary/20 backdrop-blur-sm" />
        <div className="absolute bottom-3 left-6 right-6 h-1.5 bg-primary/40 rounded-full blur-[1px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-2 bg-primary/5 rotate-[-2deg]" />
      </div>

      {/* Cake Bottom Layer */}
      <div className="w-64 h-28 bg-[#300010] luxury-border rounded-t-[2.5rem] mt-[-12px] relative z-0 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-8 bg-primary/10" />
        <div className="absolute bottom-5 left-10 right-10 h-1.5 bg-primary/30 rounded-full blur-[1px]" />
        <div className="absolute inset-0 flex justify-around items-center opacity-30">
          {[1, 2, 3, 4, 5, 6].map((d) => (
            <div key={d} className="w-2.5 h-2.5 rounded-full bg-primary/60 blur-[1px]" />
          ))}
        </div>
      </div>

      {/* Plate */}
      <div className="w-80 h-5 bg-gradient-to-r from-primary/30 via-primary to-primary/30 rounded-full mt-[-8px] shadow-2xl gold-glow border-t border-primary/20" />
    </div>
  );
}
