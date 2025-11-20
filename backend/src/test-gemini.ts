import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env');
    process.exit(1);
}

console.log(`🔑 Found API Key: ${apiKey.substring(0, 5)}...`);

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName: string) {
    console.log(`\n🧪 Testing model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello, are you working?');
        const response = await result.response;
        console.log(`✅ Success! Response: ${response.text().substring(0, 50)}...`);
        return true;
    } catch (error: any) {
        console.error(`❌ Failed: ${error.message.substring(0, 200)}`);
        return false;
    }
}

async function run() {
    console.log('🚀 Starting Gemini API Diagnostic...');

    // Test 1.5 Flash (Current target)
    await testModel('gemini-1.5-flash');

    // Test 1.5 Pro (Alternative)
    await testModel('gemini-1.5-pro');

    // Test Pro Vision (Deprecated/Old)
    await testModel('gemini-pro-vision');

    // Test Pro (Text only fallback)
    await testModel('gemini-pro');
}

run();
