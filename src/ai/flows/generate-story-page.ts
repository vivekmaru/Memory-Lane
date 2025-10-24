'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a story page with AI-generated captions and a cohesive narrative, given a set of photos and a theme.
 *
 * - generateStoryPage - A function that generates the story page.
 * - GenerateStoryPageInput - The input type for the generateStoryPage function.
 * - GenerateStoryPageOutput - The return type for the generateStoryPage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryPageInputSchema = z.object({
  photoDataUris: z
    .array(z.string())
    .describe(
      "An array of photo data URIs, each including a MIME type and using Base64 encoding. Expected format: ['data:image/jpeg;base64,...', ...]"
    ),
  theme: z.string().describe('The theme of the story.'),
});

export type GenerateStoryPageInput = z.infer<typeof GenerateStoryPageInputSchema>;

const GenerateStoryPageOutputSchema = z.object({
    title: z.string().describe('A creative and engaging title for the story.'),
    introduction: z.string().describe('A brief introduction that sets the scene and tone of the story.'),
    photos: z.array(z.object({
        caption: z.string().describe('A descriptive and narrative caption for the photo that fits into the overall story.'),
    })).describe('An array of objects, each containing an AI-generated caption for the corresponding photo.'),
    conclusion: z.string().describe('A concluding paragraph that wraps up the story.'),
});

export type GenerateStoryPageOutput = z.infer<typeof GenerateStoryPageOutputSchema>;

export async function generateStoryPage(input: GenerateStoryPageInput): Promise<GenerateStoryPageOutput> {
    return generateStoryPageFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateStoryPagePrompt',
    input: {schema: GenerateStoryPageInputSchema},
    output: {schema: GenerateStoryPageOutputSchema},
    prompt: `You are a creative storyteller. Given a series of photos and a theme, generate a cohesive story page.

Theme: {{{theme}}}

Photos:
{{#each photoDataUris}}
- Photo {{index}}: {{media url=this}}
{{/each}}

Based on the theme and the photos, create a compelling narrative with a title, introduction, a unique caption for each photo that ties into the story, and a conclusion.`,
});

const generateStoryPageFlow = ai.defineFlow(
    {
        name: 'generateStoryPageFlow',
        inputSchema: GenerateStoryPageInputSchema,
        outputSchema: GenerateStoryPageOutputSchema,
    },
    async input => {
        const {output} = await prompt(input);
        return output!;
    }
);
