
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ScratchCardProps {
  onReveal: () => void;
  message: string;
  name?: string;
}

export function ScratchCard({ onReveal, message, name }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        fillCanvas();
      }
    };

    const fillCanvas = () => {
      // Create a luxury gold metallic gradient for the scratch layer
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#D4AF37'); // Gold
      gradient.addColorStop(0.3, '#F9F295'); // Light gold
      gradient.addColorStop(0.5, '#E0AA3E'); // Deep gold
      gradient.addColorStop(0.7, '#F9F295'); // Light gold
      gradient.addColorStop(1, '#B8860B'); // Darker gold
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add glitter particles
      for (let i = 0; i < 2000; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4})`;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
      }

      ctx.fillStyle = '#6D2680';
      ctx.font = 'bold 22px Belleza';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;
      ctx.fillText('SCRATCH TO REVEAL', canvas.width / 2, canvas.height / 2);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const getPointerPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const scratch = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!isDrawing || isRevealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getPointerPos(e);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();

    checkReveal();
  };

  const checkReveal = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] < 128) transparentPixels++;
    }

    const percent = (transparentPixels / (pixels.length / 4)) * 100;
    // Reveal at 65% as per requirements
    if (percent > 65 && !isRevealed) {
      setIsRevealed(true);
      onReveal();
      canvas.style.transition = 'opacity 1.2s ease';
      canvas.style.opacity = '0';
      setTimeout(() => {
        if (canvas) canvas.style.display = 'none';
      }, 1200);
    }
  };

  return (
    <div className="relative w-full max-w-md aspect-[4/3] luxury-border rounded-3xl overflow-hidden gold-glow group bg-card">
      {/* Revealed Content */}
      <div className="absolute inset-0 flex items-center justify-center p-10 text-center overflow-auto bg-[#300010]">
        <div className="space-y-6">
          <Sparkles className="w-8 h-8 text-primary mx-auto animate-sparkle" />
          <div className="space-y-4">
            <p className="text-xl md:text-2xl font-body italic leading-relaxed text-foreground opacity-90">
              {message}
            </p>
            <div className="pt-2">
              <p className="text-5xl md:text-6xl font-cursive text-primary gold-text-glow animate-fade-in px-4 leading-tight">
                Happy Birthday Pooja
              </p>
            </div>
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair touch-none z-10"
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseMove={scratch}
        onTouchStart={() => setIsDrawing(true)}
        onTouchEnd={() => setIsDrawing(false)}
        onTouchMove={scratch}
      />
    </div>
  );
}
