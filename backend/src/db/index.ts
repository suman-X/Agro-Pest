import { Pool } from 'pg';
import { env } from '../config/env';
import dns from 'dns';

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

    // Basic host reachability check to avoid long DNS failures
    try {
        const host = new URL(env.POSTGRESQL_URL).hostname;
        await new Promise((resolve, reject) => {
            dns.lookup(host, (err) => (err ? reject(err) : resolve(null)));
        });
    } catch (e) {
        console.warn('Database host not resolvable, starting without DB:', (e as any).message);
        pool = null; // disable further queries
        return;
    }

    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await pool!.query('SELECT 1');
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
            return;
        } catch (err) {
            console.error(`DB init attempt ${attempt} failed`, err);
            if (attempt === maxRetries) {
                console.error('Giving up on DB initialization; continuing without DB');
                pool = null;
                return;
            }
            await new Promise(r => setTimeout(r, attempt * 1000)); // backoff
        }
    }
};
