
export interface BirthdayContact {
  id: string;
  name: string;
  birthDate: string; // ISO string YYYY-MM-DD
  relationship: string;
}

export type RelationshipType = 'friend' | 'family' | 'colleague' | 'spouse' | 'sibling' | 'parent' | 'other';

export type WishTone = 'humorous' | 'heartfelt' | 'formal' | 'casual' | 'inspirational';
