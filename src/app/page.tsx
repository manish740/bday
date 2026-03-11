
'use client';

import { useState, useEffect, useRef } from 'react';
import { ScratchCard } from '@/components/birthday/ScratchCard';
import { FloatingElements } from '@/components/birthday/FloatingElements';
import { BirthdayCake } from '@/components/birthday/BirthdayCake';
import { Firecrackers } from '@/components/birthday/Firecrackers';
import { Button } from '@/components/ui/button';
import { Gift, Music, VolumeX, Volume2, Heart, Share2, MessageCircle, Sparkles } from 'lucide-react';
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
        <section className="text-center space-y-10 animate-fade-in relative">
          {/* Light Rays Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square light-rays opacity-30 pointer-events-none z-[-1]" />
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary animate-sparkle">
              <Gift className="w-5 h-5" />
              <span className="text-sm font-medium tracking-[0.2em] uppercase font-headline">Premium Milestone</span>
            </div>
            
            <div className="relative group">
              <h1 className="text-7xl md:text-9xl font-headline font-black gold-3d-text leading-[1.1] gold-shimmer pb-4">
                Happy Birthday
              </h1>
              {/* Floating gold particles around heading */}
              <div className="absolute -top-4 -left-4 animate-sparkle text-primary opacity-50"><Sparkles size={24} /></div>
              <div className="absolute -bottom-4 -right-4 animate-sparkle text-primary opacity-50 delay-700"><Sparkles size={20} /></div>
            </div>

            <div className="max-w-2xl mx-auto space-y-6 pt-4">
              <p className="text-lg md:text-xl font-headline italic tracking-wide text-primary/90 gold-text-glow gold-shimmer px-4">
                "May your special day be filled with happiness, laughter, and unforgettable moments. 
                May the year ahead bring you success, joy, and beautiful memories. 
                Wishing you a truly wonderful birthday."
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/50" />
                <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground/60">
                  Scratch below for a surprise
                </p>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/50" />
              </div>
            </div>
          </div>
        </section>

        {/* Scratch Card Section */}
        <section className="w-full flex flex-col items-center gap-12">
          <ScratchCard 
            onReveal={handleReveal}
            message="Wishing you a day filled with love, laughter, happiness, and unforgettable memories. May this year bring you success and endless joy. Happy Birthday!"
          />
          
          <div className={`transition-all duration-1000 ${isRevealed ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
            <BirthdayCake isLit={isRevealed} />
          </div>
        </section>

        {/* Photo Section */}
        <section className="w-full space-y-8 text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-4xl font-headline text-accent tracking-widest">Cherished Moments</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>

          <div className="relative p-6 luxury-border rounded-[2.5rem] gold-glow max-w-2xl mx-auto bg-card/30 backdrop-blur-sm">
            <Carousel className="w-full">
              <CarouselContent>
                {PlaceHolderImages.filter(img => img.id.startsWith('birthday-')).map((img, idx) => (
                  <CarouselItem key={idx}>
                    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden group">
                      <Image 
                        src={img.imageUrl} 
                        alt={img.description} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        data-ai-hint={img.imageHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="bg-background/80 border-primary/30 text-primary -left-16 hover:bg-primary hover:text-primary-foreground transition-all" />
                <CarouselNext className="bg-background/80 border-primary/30 text-primary -right-16 hover:bg-primary hover:text-primary-foreground transition-all" />
              </div>
            </Carousel>
          </div>
        </section>

        {/* Actions */}
        <section className="flex flex-wrap justify-center gap-6 py-10">
          <Button 
            onClick={shareWishes}
            className="rounded-full px-10 h-16 bg-accent text-accent-foreground font-headline text-xl gap-3 gold-glow hover:scale-105 active:scale-95 transition-all gold-shimmer"
          >
            <MessageCircle className="w-6 h-6" />
            Send Birthday Wishes
          </Button>
          <Button 
            variant="outline"
            className="rounded-full px-10 h-16 border-primary/30 text-primary font-headline text-xl gap-3 hover:bg-primary/10 active:scale-95 transition-all"
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
            <div className="flex items-center gap-3 text-primary">
              <Heart className="w-6 h-6 fill-primary animate-pulse" />
              <span className="font-headline text-xl italic tracking-widest gold-text-glow">
                Made with ❤️ for someone special
              </span>
              <Heart className="w-6 h-6 fill-primary animate-pulse" />
            </div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground opacity-40">
              © 2024 Premium Natal Celebrations • Luxury Edition
            </p>
          </div>
        </footer>
      </main>

      {/* Decorative Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
    </div>
  );
}
