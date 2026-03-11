
'use client';

import { useState, useEffect, useRef } from 'react';
import { ScratchCard } from '@/components/birthday/ScratchCard';
import { FloatingElements } from '@/components/birthday/FloatingElements';
import { BirthdayCake } from '@/components/birthday/BirthdayCake';
import { Firecrackers } from '@/components/birthday/Firecrackers';
import { Button } from '@/components/ui/button';
import { Gift, Music, VolumeX, Volume2, Heart, Share2, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function BirthdayPage() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      audioRef.current.loop = true;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReveal = () => {
    setIsRevealed(true);
    // Auto-play music on first interaction if not already playing
    if (!isPlaying && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const shareWishes = () => {
    const text = encodeURIComponent("Wishing you a very Happy Birthday! Check out this special surprise I made for you: " + window.location.href);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center selection:bg-primary/20">
      <FloatingElements />
      <Firecrackers active={isRevealed} />

      {/* Luxury Border Frame */}
      <div className="fixed inset-4 border-2 border-primary/20 pointer-events-none z-50 rounded-3xl" />
      <div className="fixed inset-6 border border-primary/10 pointer-events-none z-50 rounded-[2.5rem]" />

      {/* Music Toggle */}
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleMusic}
        className="fixed top-8 right-8 z-[60] rounded-full bg-background/50 backdrop-blur-md border-primary/30 text-primary gold-glow"
      >
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </Button>

      <main className="relative z-10 w-full max-w-4xl px-6 py-20 flex flex-col items-center gap-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary animate-sparkle">
            <Gift className="w-5 h-5" />
            <span className="text-sm font-medium tracking-widest uppercase">Special Milestone</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-headline font-bold text-accent gold-text-glow leading-tight">
            🎉 Happy Birthday 🎂
          </h1>
          <p className="text-xl md:text-2xl font-body italic text-muted-foreground max-w-xl mx-auto">
            "A special surprise is waiting for you… Scratch below to reveal it!"
          </p>
        </section>

        {/* Scratch Card Section */}
        <section className="w-full flex flex-col items-center gap-12">
          <ScratchCard 
            onReveal={handleReveal}
            message="Wishing you a day filled with love, laughter, happiness, and unforgettable memories. May this year bring you success and endless joy. Happy Birthday!"
          />
          
          {/* Birthday Cake Section - Appears/Animates on reveal */}
          <div className={`transition-all duration-1000 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <BirthdayCake isLit={isRevealed} />
          </div>
        </section>

        {/* Photo Section */}
        <section className="w-full space-y-8 text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-3xl font-headline text-accent">Cherished Moments</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>

          <div className="relative p-4 luxury-border rounded-[2rem] gold-glow max-w-2xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {PlaceHolderImages.filter(img => img.id.startsWith('birthday-')).map((img, idx) => (
                  <CarouselItem key={idx}>
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                      <Image 
                        src={img.imageUrl} 
                        alt={img.description} 
                        fill 
                        className="object-cover"
                        data-ai-hint={img.imageHint}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="bg-background/50 border-primary/30 text-primary -left-12" />
                <CarouselNext className="bg-background/50 border-primary/30 text-primary -right-12" />
              </div>
            </Carousel>
          </div>
        </section>

        {/* Actions */}
        <section className="flex flex-wrap justify-center gap-4 py-10">
          <Button 
            onClick={shareWishes}
            className="rounded-full px-8 h-14 bg-accent text-accent-foreground font-headline text-xl gap-3 gold-glow hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-6 h-6" />
            Send Birthday Wishes
          </Button>
          <Button 
            variant="outline"
            className="rounded-full px-8 h-14 border-primary/30 text-primary font-headline text-xl gap-3 hover:bg-primary/10 transition-colors"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Happy Birthday!',
                  text: 'Check out this birthday card!',
                  url: window.location.href,
                });
              }
            }}
          >
            <Share2 className="w-6 h-6" />
            Share Page
          </Button>
        </section>

        {/* Footer */}
        <footer className="pt-20 pb-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-primary">
              <Heart className="w-5 h-5 fill-primary animate-sparkle" />
              <span className="font-body text-lg italic opacity-80">
                Made with love for someone special
              </span>
              <Heart className="w-5 h-5 fill-primary animate-sparkle" />
            </div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground opacity-50">
              © 2024 Premium Natal Celebrations
            </p>
          </div>
        </footer>
      </main>

      {/* Decorative Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
}
