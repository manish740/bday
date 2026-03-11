
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Flame, Wind, RotateCcw } from 'lucide-react';
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

  useEffect(() => {
    if (isLit && !isBlownOut) {
      const timer = setTimeout(() => setCandlesLit(true), 500);
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

    // Calculate volume/intensity
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setAudioLevel(average);

    // Threshold for "blowing" sound (adjust based on testing)
    if (average > 60) {
      stopListening();
      onBlownOut();
    } else {
      animationFrameRef.current = requestAnimationFrame(detectBlow);
    }
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
      {isLit && !isBlownOut && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-full text-center space-y-4 animate-fade-in">
          <h3 className="text-xl font-headline font-bold text-primary gold-text-glow">
            Make a Wish and Blow the Candles 🎂
          </h3>
          {!isListening && (
            <Button 
              onClick={startListening}
              className="bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 rounded-full px-6 py-2 group gold-glow"
            >
              <Wind className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              Blow the Candles
            </Button>
          )}
          {isListening && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-32 h-2 bg-primary/10 rounded-full overflow-hidden border border-primary/20">
                <div 
                  className="h-full bg-primary transition-all duration-75" 
                  style={{ width: `${Math.min(audioLevel * 1.5, 100)}%` }}
                />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-primary/60">Blowing detected...</p>
            </div>
          )}
        </div>
      )}

      {isBlownOut && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full text-center animate-surprise">
          <Button 
            variant="ghost" 
            onClick={onReset}
            className="text-primary hover:text-primary/80 group"
          >
            <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Celebrate Again 🎉
          </Button>
        </div>
      )}

      {/* Candles */}
      <div className="flex gap-4 mb-[-8px] relative z-20">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative flex flex-col items-center">
            {/* Flame */}
            <div 
              className={`transition-all duration-700 ease-out transform ${
                candlesLit ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-0 translate-y-4'
              }`}
            >
              <div className="relative">
                <Flame className="w-6 h-6 text-orange-500 fill-orange-400 animate-pulse" />
                <div className="absolute inset-0 bg-orange-400/40 blur-md rounded-full animate-sparkle" />
              </div>
            </div>
            
            {/* Smoke animation when blown out */}
            {isBlownOut && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-4 h-8 opacity-0 animate-fade-in delay-100">
                <div className="w-1 h-full bg-white/20 blur-sm rounded-full animate-float" />
              </div>
            )}

            {/* Candle Body */}
            <div className="w-2 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-t-sm border-none shadow-sm" />
          </div>
        ))}
      </div>

      {/* Cake Top Layer */}
      <div className="w-40 h-20 bg-card luxury-border rounded-t-3xl relative z-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-4 bg-primary/20" />
        <div className="absolute bottom-2 left-4 right-4 h-1 bg-primary/30 rounded-full" />
      </div>

      {/* Cake Bottom Layer */}
      <div className="w-56 h-24 bg-card luxury-border rounded-t-[2rem] mt-[-10px] relative z-0 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-6 bg-primary/10" />
        <div className="absolute bottom-4 left-6 right-6 h-1 bg-primary/20 rounded-full" />
        <div className="absolute inset-0 flex justify-around items-center opacity-20">
          {[1, 2, 3, 4, 5].map((d) => (
            <div key={d} className="w-2 h-2 rounded-full bg-primary" />
          ))}
        </div>
      </div>

      {/* Plate */}
      <div className="w-72 h-4 bg-gradient-to-r from-primary/40 via-primary to-primary/40 rounded-full mt-[-5px] shadow-xl gold-glow" />
    </div>
  );
}
