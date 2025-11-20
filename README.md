# 🌾 Smart Pest Detection & Early Warning System

An AI-powered agricultural solution that helps farmers identify crop pests and diseases using image analysis, providing instant diagnosis, treatment recommendations, and weather-based risk alerts.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

## 🚀 Features

- **🔍 AI-Powered Image Analysis** - Upload leaf images for instant pest/disease detection using Google Gemini AI
- **📊 Detailed Diagnosis** - Get confidence scores, severity levels, and visible symptoms
- **💊 Treatment Recommendations** - Receive both organic and chemical treatment options with dosages
- **🌤️ Weather Risk Assessment** - Real-time weather-based risk alerts for pest outbreaks
- **📈 Alternative Diagnoses** - Top 3 alternative possibilities with probability scores
- **🛡️ Long-term Prevention** - Actionable prevention strategies for sustainable farming

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Gemini API Key** - [Get it here](https://makersuite.google.com/app/apikey)
- **npm** or **yarn** package manager

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (React 18)
- **Styling**: TailwindCSS + Shadcn UI
- **State Management**: TanStack Query
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **AI Model**: Google Gemini 2.5/2.0 Flash
- **Database**: PostgreSQL
- **File Upload**: Multer
- **Job Queue**: BullMQ (optional)
- **Validation**: Zod

## 📦 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/farmer-pest.git
cd Farmer-Pest
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure your `.env` file:**

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# PostgreSQL Database
POSTGRESQL_URL=postgresql://username:password@localhost:5432/pest_detection

# Weather API (optional)
WEATHER_API_KEY=your_weather_api_key
```

**Initialize Database:**

```bash
# Create database
createdb pest_detection

# Run migrations (if you have schema files)
npm run migrate
```

**Start Backend Server:**

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

Backend will run on `http://localhost:3001`

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🎯 Usage

1. **Open the Application** - Navigate to `http://localhost:3000`
2. **Go to Analysis Page** - Click "Analyze" or navigate to `/analyze`
3. **Upload Image** - Select a clear photo of an affected leaf
4. **Enter Details** - Provide crop type and location (optional but recommended)
5. **Get Results** - View instant diagnosis with:
   - Disease/pest identification
   - Confidence score and severity level
   - Treatment recommendations (organic & chemical)
   - Weather-based risk assessment
   - Prevention strategies

## 📁 Project Structure

```
Farmer-Pest/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   │   └── env.ts       # Environment variables
│   │   ├── controllers/     # Request handlers
│   │   │   └── analyze.controller.ts
│   │   ├── services/        # Business logic
│   │   │   ├── gemini.service.ts
│   │   │   └── weather.service.ts
│   │   ├── routes/          # API routes
│   │   │   └── analyze.routes.ts
│   │   ├── db/              # Database configuration
│   │   │   └── index.ts
│   │   └── server.ts        # Entry point
│   ├── uploads/             # Uploaded images
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   │   ├── page.tsx     # Home page
│   │   │   ├── layout.tsx   # Root layout
│   │   │   └── analyze/     # Analysis page
│   │   │       └── page.tsx
│   │   ├── components/      # React components
│   │   │   ├── analyze-form.tsx
│   │   │   ├── analysis-result.tsx
│   │   │   └── ui/          # Shadcn UI components
│   │   └── lib/             # Utilities
│   ├── public/              # Static assets
│   ├── package.json
│   └── next.config.js
│
└── README.md

```

## 🔌 API Endpoints

### POST `/api/analyze`

Analyze uploaded crop image for pest/disease detection.

**Request:**
```bash
curl -X POST http://localhost:3001/api/analyze \
  -F "image=@/path/to/leaf.jpg" \
  -F "crop_type=Tomato" \
  -F "location=California"
```

**Response:**
```json
{
  "label": "Early Blight",
  "confidence": 87,
  "severity": 65,
  "symptoms": ["Dark spots on leaves", "Yellowing around spots"],
  "alternatives": [
    {"label": "Septoria Leaf Spot", "prob": 0.08},
    {"label": "Bacterial Spot", "prob": 0.03}
  ],
  "treatment": {
    "summary": "Remove infected leaves and apply fungicide",
    "steps": ["Isolate affected plants", "Remove infected leaves"],
    "chemical_options": [
      {"name": "Chlorothalonil", "dosage": "2 tbsp/gallon"}
    ],
    "organic_options": ["Neem oil spray", "Copper fungicide"],
    "prevention": ["Proper spacing", "Crop rotation"]
  },
  "weather_risk": {
    "risk_level": "High",
    "alert": "High humidity detected - increased fungal risk",
    "forecast": {"temp": 24, "humidity": 85}
  }
}
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚢 Deployment

### Backend Deployment

```bash
cd backend
npm run build
# Deploy dist/ folder to your hosting service
```

### Frontend Deployment

```bash
cd frontend
npm run build
# Deploy .next/ folder or use Vercel
```

**Recommended Platforms:**
- **Frontend**: Vercel, Netlify, AWS Amplify
- **Backend**: Railway, Render, AWS EC2, DigitalOcean
- **Database**: Supabase, Railway, AWS RDS

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

**Issue: "GEMINI_API_KEY not found"**
- Ensure `.env` file exists in backend directory
- Verify API key is correctly set

**Issue: Database connection error**
- Check PostgreSQL is running: `pg_isready`
- Verify `POSTGRESQL_URL` in `.env`

**Issue: Frontend can't connect to backend**
- Ensure backend is running on port 3001
- Check CORS settings in backend

**Issue: Image upload fails**
- Verify `uploads/` directory exists and has write permissions
- Check file size limits in multer configuration

## 📧 Support

For issues and questions:
- Open an issue on [GitHub Issues](https://github.com/yourusername/farmer-pest/issues)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Google Gemini AI for powerful image analysis
- Shadcn UI for beautiful components
- The open-source community

---

Made with 💚 for farmers worldwide
