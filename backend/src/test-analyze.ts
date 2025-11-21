import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

async function testAnalyze() {
    try {
        // Create a simple test image (1x1 pixel PNG)
        const testImagePath = path.join(__dirname, '../uploads/test.jpg');

        // Ensure uploads directory exists
        if (!fs.existsSync(path.join(__dirname, '../uploads'))) {
            fs.mkdirSync(path.join(__dirname, '../uploads'), { recursive: true });
        }

        // Create a minimal valid JPEG (this is a 1x1 red pixel JPEG in base64)
        const minimalJpeg = Buffer.from(
            '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA//2Q==',
            'base64'
        );

        fs.writeFileSync(testImagePath, minimalJpeg);

        const formData = new FormData();
        formData.append('image', fs.createReadStream(testImagePath));
        formData.append('crop_type', 'Tomato');
        formData.append('location', 'New York');

        console.log('🧪 Testing /analyze endpoint...\n');

        const response = await axios.post('http://localhost:3001/analyze', formData, {
            headers: formData.getHeaders(),
            timeout: 30000
        });

        console.log('✅ Success!');
        console.log('Response:', JSON.stringify(response.data, null, 2));

    } catch (error: any) {
        console.error('❌ Error occurred:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else if (error.request) {
            console.error('No response received');
            console.error('Request:', error.message);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testAnalyze();
