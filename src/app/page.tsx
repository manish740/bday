
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Heart, Sparkles, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Left Column: Visual/Marketing */}
      <div className="hidden md:flex flex-1 relative bg-accent overflow-hidden">
        <Image 
          src="https://picsum.photos/seed/natalhero/1000/1200" 
          alt="Birthday Celebration" 
          fill 
          className="object-cover opacity-40 mix-blend-overlay"
          priority
          data-ai-hint="birthday celebration"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-accent via-accent/50 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white space-y-6">
          <div className="flex items-center gap-2">
            <Gift className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-headline font-bold">Natal Reminders</h1>
          </div>
          <h2 className="text-5xl font-headline font-bold leading-tight">Celebrate every milestone with heart.</h2>
          <div className="space-y-4 text-accent-foreground">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-primary" />
              <span>Intelligent tracking for all your contacts</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-primary" />
              <span>AI-powered personalized birthday wishes</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-primary" />
              <span>Thoughtful reminders for special moments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background relative">
        <div className="absolute top-8 left-8 md:hidden flex items-center gap-2">
          <Gift className="w-6 h-6 text-primary" />
          <span className="font-headline text-xl font-bold text-accent">Natal Reminders</span>
        </div>
        
        <div className="w-full max-w-sm space-y-8 animate-fade-in">
          <div className="text-center md:text-left space-y-2">
            <h3 className="text-3xl font-headline font-bold text-accent">Welcome Back</h3>
            <p className="text-muted-foreground">Log in to manage your birthday list.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input 
                type="email" 
                placeholder="hello@example.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="rounded-xl border-primary/20"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Password</label>
                <button type="button" className="text-xs text-primary hover:underline">Forgot?</button>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="rounded-xl border-primary/20"
              />
            </div>
            <Button type="submit" className="w-full bg-accent text-accent-foreground rounded-xl h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all">
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="rounded-xl border-primary/20">Google</Button>
            <Button variant="outline" className="rounded-xl border-primary/20">Apple</Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <button className="text-primary font-bold hover:underline">Sign up for free</button>
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-8 right-8 opacity-20 hidden lg:block">
          <Heart className="w-24 h-24 text-primary" />
        </div>
        <div className="absolute top-20 right-20 opacity-10 hidden lg:block">
          <Sparkles className="w-16 h-16 text-accent" />
        </div>
      </div>
    </div>
  );
}
