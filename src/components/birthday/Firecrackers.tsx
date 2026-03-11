
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
      // Audio setup for fireworks
      if (!audioRef.current) {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      }
      audioRef.current.volume = 0.4;

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
          x: 5 + Math.random() * 90, // %
          y: 5 + Math.random() * 60, // %
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 0.8 + Math.random() * 1.5
        };

        setExplosions(prev => [...prev, newExplosion]);
        
        // Play sound with slight variation
        if (audioRef.current) {
          const clone = audioRef.current.cloneNode() as HTMLAudioElement;
          clone.volume = 0.2 + Math.random() * 0.2;
          clone.play().catch(() => {});
        }

        setTimeout(() => {
          setExplosions(prev => prev.filter(e => e.id !== id));
        }, 2000);
      };

      // Create a grand initial burst
      for(let i=0; i<6; i++) {
        setTimeout(createExplosion, i * 150);
      }

      // Continuous fireworks sequence
      const interval = setInterval(createExplosion, 450);

      // Stop after 10 seconds of celebration
      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {/* Full screen glow on burst */}
      <div className="absolute inset-0 bg-primary/5 animate-pulse mix-blend-overlay" />
      
      {explosions.map((exp) => (
        <div
          key={exp.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${exp.x}%`, top: `${exp.y}%`, scale: exp.size }}
        >
          <div className="relative">
            {/* Core Flash */}
            <div className="w-8 h-8 bg-white rounded-full animate-ping opacity-90 blur-sm" />
            
            {/* Firework Particles - High Particle Count for Premium Feel */}
            {[...Array(32)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full animate-firework-particle"
                style={{
                  backgroundColor: exp.color,
                  boxShadow: `0 0 12px ${exp.color}, 0 0 4px white`,
                  transform: `rotate(${i * (360/32)}deg) translateY(-40px)`,
                  animationDelay: `${Math.random() * 0.05}s`,
                  animationDuration: `${0.8 + Math.random() * 0.8}s`
                }}
              />
            ))}
            
            {/* Sparkling Trails */}
            {[...Array(16)].map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute w-0.5 h-0.5 bg-white rounded-full animate-sparkle"
                style={{
                  left: `${(Math.random() - 0.5) * 150}px`,
                  top: `${(Math.random() - 0.5) * 150}px`,
                  animationDelay: `${Math.random()}s`,
                  boxShadow: '0 0 4px white'
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
