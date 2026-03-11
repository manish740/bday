'use server';
/**
 * @fileOverview A Genkit flow for generating personalized birthday wishes.
 *
 * - generateBirthdayWish - A function that handles the generation of a birthday wish.
 * - GenerateBirthdayWishInput - The input type for the generateBirthdayWish function.
 * - GenerateBirthdayWishOutput - The return type for the generateBirthdayWish function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBirthdayWishInputSchema = z.object({
  contactName: z.string().describe('The name of the person celebrating their birthday.'),
  relationshipType: z
    .string()
    .describe(
      'The type of relationship with the person (e.g., friend, family, colleague, spouse, sibling, parent).' 
    ),
  tone: z
    .string()
    .describe(
      'The desired tone for the birthday wish (e.g., humorous, heartfelt, formal, casual, inspirational).' 
    ),
});
export type GenerateBirthdayWishInput = z.infer<typeof GenerateBirthdayWishInputSchema>;

const GenerateBirthdayWishOutputSchema = z.object({
  wish: z.string().describe('The generated personalized birthday wish.'),
});
export type GenerateBirthdayWishOutput = z.infer<typeof GenerateBirthdayWishOutputSchema>;

export async function generateBirthdayWish(
  input: GenerateBirthdayWishInput
): Promise<GenerateBirthdayWishOutput> {
  return generateBirthdayWishFlow(input);
}

const birthdayWishPrompt = ai.definePrompt({
  name: 'birthdayWishPrompt',
  input: {schema: GenerateBirthdayWishInputSchema},
  output: {schema: GenerateBirthdayWishOutputSchema},
  prompt: `You are an AI assistant specialized in crafting personalized birthday wishes.

Generate a unique and thoughtful birthday wish for {{{contactName}}}.

Consider the following details:
- Relationship Type: {{{relationshipType}}}
- Desired Tone: {{{tone}}}

Make sure the wish is appropriate for the relationship and tone specified. The wish should be heartfelt and well-worded.

Generate ONLY the birthday wish and ensure it fits the requested format. Do not include any other conversational text or greetings outside of the wish itself.`,
});

const generateBirthdayWishFlow = ai.defineFlow(
  {
    name: 'generateBirthdayWishFlow',
    inputSchema: GenerateBirthdayWishInputSchema,
    outputSchema: GenerateBirthdayWishOutputSchema,
  },
  async input => {
    const {output} = await birthdayWishPrompt(input);
    return output!;
  }
);
