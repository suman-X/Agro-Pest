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
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-flash'];
    const MAX_RETRIES = 3;

    let lastError: Error | null = null;

    for (const modelName of modelsToTry) {
        // Try each model with retries
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                console.log(`[Attempt ${attempt}/${MAX_RETRIES}] Using model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const imageBuffer = fs.readFileSync(imagePath);
                const imageBase64 = imageBuffer.toString('base64');

                const prompt = PEST_DETECTION_PROMPT(cropType, location);

                // Generate content with timeout
                const result = await Promise.race([
                    model.generateContent([
                        prompt,
                        {
                            inlineData: {
                                data: imageBase64,
                                mimeType: 'image/jpeg',
                            },
                        },
                    ]),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Request timeout')), 30000)
                    )
                ]) as any;

                const response = await result.response;
                const text = response.text();

                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    throw new Error('Failed to parse JSON from Gemini response');
                }

                const detectionResult = JSON.parse(jsonMatch[0]);

                // Treatment generation with retry
                const treatmentPrompt = TREATMENT_PROMPT(
                    detectionResult.label,
                    cropType,
                    detectionResult.severity,
                    location
                );

                const treatmentResult = await Promise.race([
                    model.generateContent(treatmentPrompt),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Treatment request timeout')), 30000)
                    )
                ]) as any;

                const treatmentResponse = await treatmentResult.response;
                const treatmentText = treatmentResponse.text();

                const treatmentJsonMatch = treatmentText.match(/\{[\s\S]*\}/);
                const treatmentData = treatmentJsonMatch ? JSON.parse(treatmentJsonMatch[0]) : {
                    summary: "Treatment recommendations unavailable",
                    steps: ["Consult with a local agricultural expert"],
                    chemical_options: [],
                    organic_options: [],
                    prevention: []
                };

                console.log(`✅ Analysis successful with ${modelName}`);
                return {
                    ...detectionResult,
                    treatment: treatmentData
                };

            } catch (error: any) {
                lastError = error;
                console.error(`❌ Attempt ${attempt} failed with ${modelName}:`, error.message);

                // If not the last attempt, wait before retrying (exponential backoff)
                if (attempt < MAX_RETRIES) {
                    const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                    console.log(`⏳ Waiting ${waitTime}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                } else if (modelName !== modelsToTry[modelsToTry.length - 1]) {
                    console.log(`🔄 Trying next model...`);
                }
            }
        }
    }

    // If all models and retries failed, throw the last error
    console.error('❌ All models and retries exhausted');
    throw lastError || new Error('Analysis failed after all retry attempts');
};
