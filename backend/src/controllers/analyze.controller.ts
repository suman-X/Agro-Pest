import { Request, Response } from 'express';
import { analyzeImage } from '../services/gemini.service';
import { getWeatherRisk } from '../services/weather.service';
import { query } from '../db';

export const analyzeController = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const { crop_type, location } = req.body;
        const imagePath = req.file.path;

        // 1. Analyze with Gemini
        const analysisResult = await analyzeImage(imagePath, crop_type || 'Unknown', location || 'Unknown');

        // 2. Get Weather Risk
        const weatherRisk = await getWeatherRisk(location);

        // 3. Combine Results
        const finalResult = {
            ...analysisResult,
            weather_risk: weatherRisk
        };

        // 4. Save to DB (non-blocking - don't fail if DB is down)
        try {
            await query(
                'INSERT INTO analyses (image_url, crop_type, location, result) VALUES ($1, $2, $3, $4)',
                [imagePath, crop_type, location, finalResult]
            );
            console.log('Analysis saved to database');
        } catch (dbError) {
            console.error('Failed to save to database (continuing anyway):', dbError);
        }

        res.json(finalResult);

    } catch (error: any) {
        console.error('Analysis Error:', error);

        // Provide more specific error messages
        let errorMessage = 'Analysis failed. Please try again.';

        if (error.message?.includes('GEMINI') || error.message?.includes('API')) {
            errorMessage = 'Failed to analyze image. Please check your API configuration.';
        } else if (error.message?.includes('weather')) {
            errorMessage = 'Failed to fetch weather data. Analysis may be incomplete.';
        } else if (error.code === 'ENOENT') {
            errorMessage = 'Image file not found. Please try uploading again.';
        }

        res.status(500).json({
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
