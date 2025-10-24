'use server';
/**
 * @fileOverview An AI agent that automatically generates captions for uploaded photos based on image analysis.
 *
 * - generatePhotoCaption - A function that handles the photo caption generation process.
 * - GeneratePhotoCaptionInput - The input type for the generatePhotoCaption function.
 * - GeneratePhotoCaptionOutput - The return type for the generatePhotoCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePhotoCaptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to generate a caption for, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GeneratePhotoCaptionInput = z.infer<typeof GeneratePhotoCaptionInputSchema>;

const GeneratePhotoCaptionOutputSchema = z.object({
  caption: z.string().describe('The generated caption for the photo.'),
});
export type GeneratePhotoCaptionOutput = z.infer<typeof GeneratePhotoCaptionOutputSchema>;

export async function generatePhotoCaption(input: GeneratePhotoCaptionInput): Promise<GeneratePhotoCaptionOutput> {
  return generatePhotoCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePhotoCaptionPrompt',
  input: {schema: GeneratePhotoCaptionInputSchema},
  output: {schema: GeneratePhotoCaptionOutputSchema},
  prompt: `You are an AI assistant that generates captions for photos. Analyze the photo and create a concise and descriptive caption.

Photo: {{media url=photoDataUri}}

Caption:`,
});

const generatePhotoCaptionFlow = ai.defineFlow(
  {
    name: 'generatePhotoCaptionFlow',
    inputSchema: GeneratePhotoCaptionInputSchema,
    outputSchema: GeneratePhotoCaptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
