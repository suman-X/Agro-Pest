import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('3001'),
    GEMINI_API_KEY: z.string(),
    POSTGRESQL_URL: z.string().optional(),
    JWT_SECRET_KEY: z.string().optional(),
    SUPABASE_APIKEY_ANON_PUBLIC: z.string().optional(),
    OPENWEATHER_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
