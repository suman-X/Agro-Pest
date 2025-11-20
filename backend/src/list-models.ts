import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log('🔍 Fetching available models...\n');

        // Try to list models
        const models = await genAI.listModels();

        console.log('✅ Available models:');
        console.log('='.repeat(50));

        for await (const model of models) {
            console.log(`\n📦 ${model.name}`);
            console.log(`   Display Name: ${model.displayName}`);
            console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        }

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    }
}

listModels();
