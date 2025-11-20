import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import fs from 'fs';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const PEST_DETECTION_PROMPT = (crop_type: string, location: string) => `
You are an expert agronomist + entomologist.
Given the attached image of a plant leaf:

CROP_TYPE: ${crop_type}
LOCATION: ${location}

TASK:
1. Identify pest/disease (primary diagnosis).
2. Provide confidence (0-100%).
3. Estimate severity (0-100).
4. List visible symptoms.
5. Provide top 3 alternative possibilities with probability.
6. Return strictly in JSON:

{
  "label": "...",
  "confidence": 0-100,
  "severity": 0-100,
  "symptoms": [...],
  "alternatives": [
    {"label": "...", "prob": ...},
    {"label": "...", "prob": ...},
    {"label": "...", "prob": ...}
  ]
}
`;

const TREATMENT_PROMPT = (label: string, crop_type: string, severity: number, climate: string) => `
You are an agronomy specialist generating safe and actionable treatment steps.

INPUT:
pest_label: ${label}
crop_type: ${crop_type}
severity: ${severity}
location_climate: ${climate}
farmer_pref: organic_only or standard

TASK:
1. Give 3 high-impact actions.
2. Provide chemical dosage ONLY if severity > 35 AND farmer_pref != organic.
3. Provide organic alternatives always.
4. Provide long-term prevention.
5. Output in JSON:

{
  "summary": "...",
  "steps": [...],
  "chemical_options": [...],
  "organic_options": [...],
  "prevention": [...]
}
`;

export const analyzeImage = async (imagePath: string, cropType: string, location: string) => {
    // Use the current stable model that supports images
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-flash'];

    for (const modelName of modelsToTry) {
        try {
            console.log(`Attempting analysis with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const imageBuffer = fs.readFileSync(imagePath);
            const imageBase64 = imageBuffer.toString('base64');

            const prompt = PEST_DETECTION_PROMPT(cropType, location);

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: imageBase64,
                        mimeType: 'image/jpeg',
                    },
                },
            ]);

            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('Failed to parse JSON from Gemini response');

            const detectionResult = JSON.parse(jsonMatch[0]);

            // Treatment generation
            const treatmentPrompt = TREATMENT_PROMPT(detectionResult.label, cropType, detectionResult.severity, location);
            const treatmentResult = await model.generateContent(treatmentPrompt);
            const treatmentResponse = await treatmentResult.response;
            const treatmentText = treatmentResponse.text();

            const treatmentJsonMatch = treatmentText.match(/\{[\s\S]*\}/);
            const treatmentData = treatmentJsonMatch ? JSON.parse(treatmentJsonMatch[0]) : {};

            return {
                ...detectionResult,
                treatment: treatmentData
            };

        } catch (error: any) {
            console.error(`Failed with model ${modelName}:`, error.message);
            // If this was the last model, throw the error
            if (modelName === modelsToTry[modelsToTry.length - 1]) {
                throw error;
            }
            // Otherwise continue to next model
            console.log('Trying next model...');
        }
    }
};
