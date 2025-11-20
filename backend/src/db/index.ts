import { Pool } from 'pg';
import { env } from '../config/env';

const pool = new Pool({
    connectionString: env.POSTGRESQL_URL,
    ssl: {
        rejectUnauthorized: false, // Often needed for Supabase/Cloud DBs
    },
    connectionTimeoutMillis: 5000, // 5 second timeout
    idleTimeoutMillis: 30000, // 30 seconds
    max: 10, // Maximum pool size
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const initDb = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS analyses (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        crop_type TEXT,
        location TEXT,
        result JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Database initialized');
    } catch (err) {
        console.error('Error initializing database', err);
    }
};
