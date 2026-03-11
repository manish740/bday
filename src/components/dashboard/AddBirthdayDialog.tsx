
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BirthdayContact, RelationshipType } from '@/lib/types';

interface AddBirthdayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (contact: Omit<BirthdayContact, 'id'> & { id?: string }) => void;
  editingContact: BirthdayContact | null;
}

const relationships: RelationshipType[] = ['friend', 'family', 'colleague', 'spouse', 'sibling', 'parent', 'other'];

export function AddBirthdayDialog({ open, onOpenChange, onSave, editingContact }: AddBirthdayDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    relationship: 'friend' as RelationshipType
  });

  useEffect(() => {
    if (editingContact) {
      setFormData({
        name: editingContact.name,
        birthDate: editingContact.birthDate,
        relationship: editingContact.relationship as RelationshipType
      });
    } else {
      setFormData({ name: '', birthDate: '', relationship: 'friend' });
    }
  }, [editingContact, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: editingContact?.id });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-accent">
            {editingContact ? 'Edit Birthday' : 'New Birthday Entry'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              placeholder="Who is the birthday for?" 
              value={formData.name} 
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Birth Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={formData.birthDate}
              onChange={e => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Select 
              value={formData.relationship} 
              onValueChange={(val: RelationshipType) => setFormData(prev => ({ ...prev, relationship: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {relationships.map(rel => (
                  <SelectItem key={rel} value={rel} className="capitalize">{rel}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              {editingContact ? 'Update Details' : 'Save Birthday'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
