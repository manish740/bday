
'use client';

import React, { useEffect, useState, useRef } from 'react';

interface FirecrackersProps {
  active: boolean;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

export function Firecrackers({ active }: FirecrackersProps) {
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (active) {
      // Audio setup
      if (!audioRef.current) {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      }
      audioRef.current.volume = 0.5;

      const colors = [
        '#D4AF37', // Gold
        '#FF3B3F', // Red
        '#A020F0', // Purple
        '#1E90FF', // Blue
        '#F9EDF1'  // Sparkle White
      ];

      const createExplosion = () => {
        const id = Date.now() + Math.random();
        const newExplosion = {
          id,
          x: 10 + Math.random() * 80, // %
          y: 10 + Math.random() * 50, // %
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 1 + Math.random() * 2
        };

        setExplosions(prev => [...prev, newExplosion]);
        
        // Play sound with slight variation
        if (audioRef.current) {
          const clone = audioRef.current.cloneNode() as HTMLAudioElement;
          clone.volume = 0.3;
          clone.play().catch(() => {});
        }

        setTimeout(() => {
          setExplosions(prev => prev.filter(e => e.id !== id));
        }, 1500);
      };

      // Initial burst
      for(let i=0; i<3; i++) setTimeout(createExplosion, i * 200);

      // Continuous fireworks
      const interval = setInterval(createExplosion, 600);

      // Stop after 8 seconds
      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 8000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {explosions.map((exp) => (
        <div
          key={exp.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${exp.x}%`, top: `${exp.y}%`, scale: exp.size }}
        >
          <div className="relative">
            {/* Core Flash */}
            <div className="w-6 h-6 bg-white rounded-full animate-ping opacity-75" />
            
            {/* Firework Particles */}
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full animate-firework-particle"
                style={{
                  backgroundColor: exp.color,
                  boxShadow: `0 0 15px ${exp.color}`,
                  transform: `rotate(${i * 15}deg) translateY(-30px)`,
                  animationDelay: `${Math.random() * 0.1}s`,
                  animationDuration: `${1 + Math.random() * 0.5}s`
                }}
              />
            ))}
            
            {/* Secondary Glitter */}
            {[...Array(12)].map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full animate-sparkle"
                style={{
                  left: `${(Math.random() - 0.5) * 100}px`,
                  top: `${(Math.random() - 0.5) * 100}px`,
                  animationDelay: `${Math.random()}s`
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
