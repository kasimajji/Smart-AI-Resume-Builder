import { z } from 'zod';

const envSchema = z.object({
  VITE_OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
});

export const env = envSchema.parse({
  VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
});