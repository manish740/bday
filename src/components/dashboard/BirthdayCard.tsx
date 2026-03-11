
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BirthdayContact } from '@/lib/types';
import { format, differenceInDays, addYears, isBefore, startOfDay } from 'date-fns';
import { Cake, Sparkles, Trash2, Edit2, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BirthdayCardProps {
  contact: BirthdayContact;
  onGenerateWish: (contact: BirthdayContact) => void;
  onDelete: (id: string) => void;
  onEdit: (contact: BirthdayContact) => void;
}

export function BirthdayCard({ contact, onGenerateWish, onDelete, onEdit }: BirthdayCardProps) {
  const today = startOfDay(new Date());
  const birthDate = new Date(contact.birthDate);
  
  // Calculate next occurrence
  let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (isBefore(nextBirthday, today)) {
    nextBirthday = addYears(nextBirthday, 1);
  }
  
  const daysUntil = differenceInDays(nextBirthday, today);
  const isToday = daysUntil === 0;

  return (
    <Card className="group relative overflow-hidden border-none shadow-md transition-all hover:shadow-lg bg-card animate-slide-up">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <h3 className="text-xl font-headline font-bold text-foreground leading-none">
              {contact.name}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize text-[10px] px-2 py-0">
                {contact.relationship}
              </Badge>
              <div className="flex items-center text-muted-foreground text-sm">
                <Calendar className="w-3 h-3 mr-1" />
                {format(birthDate, 'MMM do')}
              </div>
            </div>
          </div>
          
          {isToday ? (
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary animate-pulse">
              <Cake className="w-6 h-6" />
            </div>
          ) : (
            <div className="text-right">
              <div className="text-2xl font-headline font-bold text-accent">{daysUntil}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Days Left</div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-accent"
              onClick={() => onEdit(contact)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(contact.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={() => onGenerateWish(contact)}
            size="sm" 
            className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium gap-2 shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            Wishes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
