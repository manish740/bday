
'use client';

import React, { useEffect, useState, useRef } from 'react';

interface FirecrackersProps {
  active: boolean;
}

export function Firecrackers({ active }: FirecrackersProps) {
  const [explosions, setExplosions] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (active) {
      // Play sound
      if (!audioRef.current) {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      }
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(e => console.log('Audio play blocked', e));

      // Generate random explosions
      const interval = setInterval(() => {
        const id = Date.now();
        const colors = ['#D4AF37', '#F9EDF1', '#FFD700', '#FFA500'];
        const newExplosion = {
          id,
          x: 10 + Math.random() * 80, // %
          y: 20 + Math.random() * 60, // %
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        
        setExplosions(prev => [...prev.slice(-10), newExplosion]);
        
        // Cleanup after animation
        setTimeout(() => {
          setExplosions(prev => prev.filter(e => e.id !== id));
        }, 1000);
      }, 400);

      // Stop after 5 seconds
      setTimeout(() => clearInterval(interval), 5000);
      return () => clearInterval(interval);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {explosions.map((exp) => (
        <div
          key={exp.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${exp.x}%`, top: `${exp.y}%` }}
        >
          <div className="relative">
            {/* Center flash */}
            <div className="w-4 h-4 bg-white rounded-full animate-ping" />
            
            {/* Sparkles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full animate-firework-particle"
                style={{
                  backgroundColor: exp.color,
                  boxShadow: `0 0 10px ${exp.color}`,
                  transform: `rotate(${i * 30}deg) translateY(-20px)`,
                  animationDelay: `${Math.random() * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
