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
      'An array of photo data URIs, each including a MIME type and using Base64 encoding. Expected format: [\