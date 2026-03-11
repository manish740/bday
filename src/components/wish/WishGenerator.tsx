
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BirthdayContact, WishTone } from '@/lib/types';
import { generateBirthdayWish } from '@/ai/flows/generate-birthday-wish-flow';
import { Sparkles, Copy, Check, Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

interface WishGeneratorProps {
  contact: BirthdayContact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tones: WishTone[] = ['heartfelt', 'humorous', 'formal', 'casual', 'inspirational'];

export function WishGenerator({ contact, open, onOpenChange }: WishGeneratorProps) {
  const [tone, setTone] = useState<WishTone>('heartfelt');
  const [generatedWish, setGeneratedWish] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!contact) return;
    setIsLoading(true);
    setGeneratedWish(null);
    try {
      const result = await generateBirthdayWish({
        contactName: contact.name,
        relationshipType: contact.relationship,
        tone: tone
      });
      setGeneratedWish(result.wish);
    } catch (error) {
      toast({
        title: "Error generating wish",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedWish) return;
    navigator.clipboard.writeText(generatedWish);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard!",
      description: "You can now paste the wish anywhere."
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-accent flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Wish Tool for {contact?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Select Tone</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {tones.map(t => (
                <Button
                  key={t}
                  variant={tone === t ? 'default' : 'outline'}
                  size="sm"
                  className={`capitalize text-xs rounded-full ${tone === t ? 'bg-primary border-primary' : ''}`}
                  onClick={() => setTone(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            className="w-full bg-accent text-accent-foreground gap-2 font-medium"
            onClick={handleGenerate}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate {tone} Wish
          </Button>

          {generatedWish && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="relative">
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <p className="text-lg leading-relaxed text-foreground italic whitespace-pre-wrap font-body">
                      "{generatedWish}"
                    </p>
                  </CardContent>
                </Card>
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/50 backdrop-blur shadow-sm hover:bg-white"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2 rounded-full" onClick={() => onOpenChange(false)}>
                  Done
                </Button>
                <Button className="flex-1 gap-2 bg-primary rounded-full" onClick={copyToClipboard}>
                  <Send className="h-4 w-4" />
                  Copy & Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
