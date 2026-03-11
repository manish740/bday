
'use client';

import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

interface BirthdayCakeProps {
  isLit: boolean;
}

export function BirthdayCake({ isLit }: BirthdayCakeProps) {
  const [candlesLit, setCandlesLit] = useState(false);

  useEffect(() => {
    if (isLit) {
      // Staggered lighting effect
      const timer = setTimeout(() => setCandlesLit(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isLit]);

  return (
    <div className="relative flex flex-col items-center justify-center py-10 scale-110 md:scale-125">
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
            {/* Candle Body */}
            <div className="w-2 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-t-sm luxury-border border-none shadow-sm" />
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
        {/* Decorations */}
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
