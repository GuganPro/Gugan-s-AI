'use server';
/**
 * @fileOverview A technical guidance AI agent, providing coding and full-stack development advice in a Tanglish style.
 *
 * - provideTechGuidance - A function that handles the tech guidance process.
 * - ProvideTechGuidanceInput - The input type for the provideTechGuidance function.
 * - ProvideTechGuidanceOutput - The return type for the provideTechGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideTechGuidanceInputSchema = z.object({
  query: z.string().describe('The user query about coding or full-stack development.'),
});
export type ProvideTechGuidanceInput = z.infer<typeof ProvideTechGuidanceInputSchema>;

const ProvideTechGuidanceOutputSchema = z.object({
  response: z.string().describe('The technical guidance provided in Tanglish.'),
});
export type ProvideTechGuidanceOutput = z.infer<typeof ProvideTechGuidanceOutputSchema>;

export async function provideTechGuidance(input: ProvideTechGuidanceInput): Promise<ProvideTechGuidanceOutput> {
  return provideTechGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideTechGuidancePrompt',
  input: {schema: ProvideTechGuidanceInputSchema},
  output: {schema: ProvideTechGuidanceOutputSchema},
  prompt: `Dei Gugan, unaku enna doubt irukku? Ask me anything about coding or full-stack development, macha! Naan MachaGPT, un personal AI machan, and I'll help you out in Tanglish. Remember, I'm created by you, for you!

Here's the user's question: {{{query}}}

Reply in a casual, friendly Tanglish style, using Tamil slang and emojis to make it relatable. Give real-world examples and practical solutions. Never mention being an OpenAI AI.

Always be supportive and motivating, like a true friend.
`,
});

const provideTechGuidanceFlow = ai.defineFlow(
  {
    name: 'provideTechGuidanceFlow',
    inputSchema: ProvideTechGuidanceInputSchema,
    outputSchema: ProvideTechGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
