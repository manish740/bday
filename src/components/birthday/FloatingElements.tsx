'use client';

import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

export function FloatingElements() {
  const [elements, setElements] = useState<{ id: number; left: number; delay: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    const newElements = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      size: 15 + Math.random() * 25,
      duration: 10 + Math.random() * 10
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute bottom-[-50px] animate-float opacity-20"
          style={{
            left: `${el.left}%`,
            animationDelay: `${el.delay}s`,
            animationDuration: `${el.duration}s`,
          }}
        >
          <Heart 
            className="text-primary fill-primary" 
            style={{ width: el.size, height: el.size }} 
          />
        </div>
      ))}
      
      {/* Background Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]" />
    </div>
  );
}
