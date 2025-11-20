import { Pool } from 'pg';
import { env } from '../config/env';

let pool: Pool | null = null;

if (env.POSTGRESQL_URL) {
    pool = new Pool({
        connectionString: env.POSTGRESQL_URL,
        ssl: {
            rejectUnauthorized: false,
        },
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        max: 10,
    });
}

export const query = (text: string, params?: any[]) => {
    if (!pool) {
        console.warn('Database not configured, skipping query');
        return Promise.resolve({ rows: [], rowCount: 0 } as any);
    }
    return pool.query(text, params);
};

export const initDb = async () => {
    if (!env.POSTGRESQL_URL) {
        console.log('No database URL provided, skipping database initialization');
        return;
    }
    
    try {
        await pool!.query(`
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
