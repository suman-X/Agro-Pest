import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { env } from './config/env';
import { initDb } from './db';
import analyzeRoutes from './routes/analyze.routes';

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
}

// CORS configuration for production and development
const allowedOrigins = [
    'https://agro-pest.vercel.app',
    'http://localhost:3000',
    'http://localhost:3002',
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/analyze', analyzeRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Smart Pest Detection API',
        status: 'running',
        version: '1.0.0'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Global error handlers to prevent crashes
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Initialize DB and start server
const startServer = async () => {
    try {
        await initDb();
    } catch (err) {
        console.error('Database initialization failed:', err);
    }

    const PORT = process.env.PORT || env.PORT;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
};

startServer();
