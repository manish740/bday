'use client';

import { useState } from 'react';
import { ScratchCard } from '@/components/birthday/ScratchCard';
import { FloatingElements } from '@/components/birthday/FloatingElements';
import { BirthdayCake } from '@/components/birthday/BirthdayCake';
import { Firecrackers } from '@/components/birthday/Firecrackers';
import { Button } from '@/components/ui/button';
import { Gift, Heart, Sparkles, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BirthdayPage() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [showCelebrationBtn, setShowCelebrationBtn] = useState(false);
  const router = useRouter();

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleBlownOut = () => {
    setIsBlownOut(true);
    
    // Show final button after the grand fireworks celebration starts
    setTimeout(() => {
      setShowCelebrationBtn(true);
    }, 2500);
  };

  const handleReset = () => {
    setIsBlownOut(false);
    setShowCelebrationBtn(false);
  };

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center selection:bg-primary/20 overflow-x-hidden">
      <FloatingElements />
      <Firecrackers active={isBlownOut} />

      {/* Luxury Border Frame */}
      <div className="fixed inset-4 border-2 border-primary/20 pointer-events-none z-50 rounded-3xl" />
      <div className="fixed inset-6 border border-primary/10 pointer-events-none z-50 rounded-[2.5rem]" />

      <main className="relative z-10 w-full max-w-4xl px-6 py-20 flex flex-col items-center gap-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-10 animate-fade-in relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square light-rays opacity-30 pointer-events-none z-[-1]" />
          
          <div className="space-y-4">
            <div className="relative group">
              <h1 className="text-7xl md:text-9xl font-headline font-black gold-3d-text leading-[1.1] gold-shimmer pb-4">
                Happy Birthday
              </h1>
              <div className="absolute -top-4 -left-4 animate-sparkle text-primary opacity-50"><Sparkles size={24} /></div>
              <div className="absolute -bottom-4 -right-4 animate-sparkle text-primary opacity-50 delay-700"><Sparkles size={20} /></div>
            </div>

            <div className="max-w-2xl mx-auto space-y-6 pt-4">
              <p className="text-lg md:text-xl font-headline italic tracking-wide text-primary/90 gold-text-glow gold-shimmer px-4">
                "May your special day be filled with happiness, laughter, and unforgettable moments. 
                May the year ahead bring you success, joy, and beautiful memories. 
                Wishing you a truly wonderful birthday."
              </p>
              {!isRevealed && (
                <div className="flex items-center justify-center gap-4">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/50" />
                  <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground/60">
                    A surprise is waiting... Scratch below!
                  </p>
                  <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/50" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Interactive Content Section */}
        <section className="w-full flex flex-col items-center gap-48 md:gap-64">
          {/* Scratch Card Area */}
          <div className="relative w-full max-w-md">
            <ScratchCard 
              onReveal={handleReveal}
              message="Wishing you a day filled with love, laughter, happiness, and unforgettable memories. May this year bring you success and endless joy."
              name="Pooja"
            />
            
            {/* Surprise Reveal Overlay */}
            {isBlownOut && (
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-20 px-4">
                <h2 className="text-2xl md:text-4xl font-display font-bold gold-shimmer animate-surprise gold-text-glow leading-tight">
                  🎉 Happy Birthday! Your Wish Has Been Unlocked! 🎉
                </h2>
              </div>
            )}
          </div>
          
          {/* Birthday Cake Section - Appears after scratch reveal */}
          <div className={`transition-all duration-1000 ${isRevealed ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}>
            <BirthdayCake 
              isLit={isRevealed} 
              onBlownOut={handleBlownOut} 
              isBlownOut={isBlownOut}
              onReset={handleReset}
            />
          </div>

          {/* Celebration Dashboard Access */}
          {showCelebrationBtn && (
            <div className="animate-fade-in animate-float pt-10">
              <Button 
                onClick={() => router.push('/dashboard')}
                className="bg-primary text-primary-foreground rounded-full px-10 py-7 text-lg font-headline font-bold shadow-2xl gold-glow hover:scale-105 transition-transform group"
              >
                <LayoutDashboard className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                Manage All Birthdays
              </Button>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="pt-20 pb-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 text-primary">
              <Sparkles className="w-6 h-6 fill-primary animate-pulse" />
              <span className="font-cursive text-3xl italic tracking-wide gold-text-glow">
                Created and Designed by Manish
              </span>
              <Sparkles className="w-6 h-6 fill-primary animate-pulse" />
            </div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground opacity-40">
              © 2025 Premium Natal Celebrations • Luxury Edition
            </p>
          </div>
        </footer>
      </main>

      {/* Atmosphere Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
    </div>
  );
}
