import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { initDb } from './db';
import analyzeRoutes from './routes/analyze.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/analyze', analyzeRoutes);

app.get('/', (req, res) => {
    res.send('Smart Pest Detection API');
});

// Initialize DB and start server
initDb().then(() => {
    app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
    });
});
