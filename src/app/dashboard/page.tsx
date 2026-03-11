
'use client';

import { useState, useEffect } from 'react';
import { BirthdayContact } from '@/lib/types';
import { BirthdayCard } from '@/components/dashboard/BirthdayCard';
import { AddBirthdayDialog } from '@/components/dashboard/AddBirthdayDialog';
import { WishGenerator } from '@/components/wish/WishGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, CalendarDays, LogOut, Gift } from 'lucide-react';
import { startOfDay, isBefore, addYears, differenceInDays } from 'date-fns';
import { useRouter } from 'next/navigation';

// Mock Initial Data
const INITIAL_BIRTHDAYS: BirthdayContact[] = [
  { id: '1', name: 'Sophia Miller', birthDate: '1995-12-15', relationship: 'sibling' },
  { id: '2', name: 'Liam Johnson', birthDate: '1988-03-24', relationship: 'friend' },
  { id: '3', name: 'Ava Brown', birthDate: '1992-07-02', relationship: 'colleague' },
  { id: '4', name: 'Ethan Davis', birthDate: '1990-11-20', relationship: 'friend' },
  { id: '5', name: 'Emma Wilson', birthDate: '1985-05-10', relationship: 'parent' },
];

export default function Dashboard() {
  const [contacts, setContacts] = useState<BirthdayContact[]>(INITIAL_BIRTHDAYS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isWishOpen, setIsWishOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<BirthdayContact | null>(null);
  const [wishContact, setWishContact] = useState<BirthdayContact | null>(null);
  const router = useRouter();

  const handleSaveContact = (data: Omit<BirthdayContact, 'id'> & { id?: string }) => {
    if (data.id) {
      setContacts(prev => prev.map(c => c.id === data.id ? { ...c, ...data } : c));
    } else {
      setContacts(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) } as BirthdayContact]);
    }
  };

  const handleDelete = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleEdit = (contact: BirthdayContact) => {
    setEditingContact(contact);
    setIsAddOpen(true);
  };

  const handleGenerateWish = (contact: BirthdayContact) => {
    setWishContact(contact);
    setIsWishOpen(true);
  };

  const getDaysUntil = (birthDateStr: string) => {
    const today = startOfDay(new Date());
    const birthDate = new Date(birthDateStr);
    let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (isBefore(nextBirthday, today)) {
      nextBirthday = addYears(nextBirthday, 1);
    }
    return differenceInDays(nextBirthday, today);
  };

  const filteredContacts = contacts
    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => getDaysUntil(a.birthDate) - getDaysUntil(b.birthDate));

  const upcomingBirthdays = filteredContacts.filter(c => getDaysUntil(c.birthDate) <= 30);
  const laterBirthdays = filteredContacts.filter(c => getDaysUntil(c.birthDate) > 30);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <span className="font-headline text-2xl font-bold text-accent tracking-tight">Natal Reminders</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="text-muted-foreground hover:text-accent">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button onClick={() => { setEditingContact(null); setIsAddOpen(true); }} size="sm" className="bg-primary text-primary-foreground rounded-full shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Header Section */}
        <section className="space-y-6 text-center max-w-2xl mx-auto py-4">
          <h1 className="text-4xl sm:text-5xl font-headline text-accent font-bold">Never miss a celebration.</h1>
          <p className="text-lg text-muted-foreground">Keep track of your loved ones' special days and craft the perfect message with AI.</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name..." 
              className="pl-10 rounded-full border-primary/20 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Dashboard Sections */}
        {upcomingBirthdays.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-accent">
              <CalendarDays className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-headline font-bold">Happening Soon (Next 30 Days)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {upcomingBirthdays.map(contact => (
                <BirthdayCard 
                  key={contact.id} 
                  contact={contact} 
                  onGenerateWish={handleGenerateWish}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </section>
        )}

        <section className="space-y-6">
          <div className="flex items-center gap-2 text-accent">
            <Gift className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-headline font-bold">Upcoming Birthdays</h2>
          </div>
          {filteredContacts.length === 0 ? (
            <div className="text-center py-20 bg-white/40 rounded-3xl border-2 border-dashed border-primary/20">
              <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground italic">No birthdays found matching your search.</p>
              <Button variant="link" className="text-primary mt-2" onClick={() => setIsAddOpen(true)}>Add your first contact</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {laterBirthdays.map(contact => (
                <BirthdayCard 
                  key={contact.id} 
                  contact={contact} 
                  onGenerateWish={handleGenerateWish}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <AddBirthdayDialog 
        open={isAddOpen} 
        onOpenChange={setIsAddOpen} 
        onSave={handleSaveContact}
        editingContact={editingContact}
      />

      <WishGenerator 
        open={isWishOpen} 
        onOpenChange={setIsWishOpen} 
        contact={wishContact}
      />
    </div>
  );
}
