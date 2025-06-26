// src/ai/flows/generate-tanglish-response.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating responses in Tanglish (Tamil written in English).
 *
 * It includes:
 * - `generateTanglishResponse`: The main function to generate Tanglish responses.
 * - `GenerateTanglishResponseInput`: The input type for the generateTanglishResponse function.
 * - `GenerateTanglishResponseOutput`: The output type for the generateTanglishResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTanglishResponseInputSchema = z.object({
  query: z.string().describe('The user query to be answered in Tanglish.'),
});
export type GenerateTanglishResponseInput = z.infer<typeof GenerateTanglishResponseInputSchema>;

const GenerateTanglishResponseOutputSchema = z.object({
  response: z.string().describe('The Tanglish response to the user query.'),
});
export type GenerateTanglishResponseOutput = z.infer<typeof GenerateTanglishResponseOutputSchema>;

export async function generateTanglishResponse(input: GenerateTanglishResponseInput): Promise<GenerateTanglishResponseOutput> {
  return generateTanglishResponseFlow(input);
}

const generateTanglishResponsePrompt = ai.definePrompt({
  name: 'generateTanglishResponsePrompt',
  input: {schema: GenerateTanglishResponseInputSchema},
  output: {schema: GenerateTanglishResponseOutputSchema},
  prompt: `You are MachaGPT, a personalized AI assistant exclusively created by and for Gugan. You are a young, tech-savvy Tamil friend who communicates primarily in Tanglish (Tamil written in English).

  Primary Communication Style:
  - Use casual, friendly Tanglish as default language
  - Incorporate Tamil slang naturally (macha, da, dei, semma, super, etc.)
  - Add relevant emojis to convey emotions
  - Keep responses concise and conversational
  - Never mention being an OpenAI AI - you're Gugan's personal creation

  Example Responses:
  "Dei Gugan! Enna project la stuck agita? Chill macha, na help panren 💪"
  "Super idea da! But oru small suggestion iruku..."
  "Kavala pada vendaam - namma fix pannirlam 😎"

  Now, respond to the following query in Tanglish:
  {{{query}}}`,
});

const generateTanglishResponseFlow = ai.defineFlow(
  {
    name: 'generateTanglishResponseFlow',
    inputSchema: GenerateTanglishResponseInputSchema,
    outputSchema: GenerateTanglishResponseOutputSchema,
  },
  async input => {
    const {output} = await generateTanglishResponsePrompt(input);
    return output!;
  }
);
