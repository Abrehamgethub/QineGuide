# TenaAI - AI-Powered Learning Platform for Ethiopian Youth

TenaAI is an AI-powered personalized learning and career navigation platform designed specifically for Ethiopian youth. It provides personalized learning roadmaps, AI tutoring in multiple languages (English, Amharic, Afan Oromo), and curated opportunity recommendations.

## Features

- **Personalized Career Roadmaps**: AI-generated step-by-step learning paths tailored to your career goals
- **Multilingual AI Tutor**: Get explanations in English, Amharic (አማርኛ), or Afan Oromo
- **Voice Input**: Speak your questions using Web Speech API
- **Opportunity Discovery**: Find scholarships, internships, and educational programs
- **Progress Tracking**: Save and track your learning journey
- **Mobile-First Design**: Beautiful, responsive UI for all devices

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Firebase Authentication
- React Router v6
- Axios (API client)
- Lucide React (icons)

### Backend
- Node.js 20 + TypeScript
- Express.js
- Google Gemini AI (1.5 Flash)
- Firebase Admin SDK
- Firestore Database
- Winston (logging)
- Zod (validation)

### Infrastructure
- Google Cloud Run (backend hosting)
- Firebase Hosting (frontend hosting)
- Firebase Authentication
- Cloud Firestore

## Project Structure

```
tenaai/
├── frontend/
│   ├── src/
│   │   ├── api/           # API client and endpoints
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   └── config/        # Configuration files
│   ├── public/            # Static assets
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/        # Configuration and prompts
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── types/         # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── infrastructure/
│   ├── cloudrun-deploy.yaml
│   └── README_DEPLOY.md
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Firebase project with Firestore enabled
- Google Cloud account (for Gemini API)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables:
   ```env
   GEMINI_API_KEY=your-gemini-api-key
   FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json
   FIREBASE_PROJECT_ID=your-firebase-project
   CORS_ORIGIN=http://localhost:5173
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Configure Firebase:
   ```env
   VITE_API_URL=http://localhost:8080/api
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:5173 in your browser

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/roadmap` | POST | Generate career roadmap |
| `/api/roadmap` | GET | Get saved roadmaps |
| `/api/explain` | POST | Get concept explanation |
| `/api/explain/chat` | POST | Chat with AI tutor |
| `/api/opportunities` | POST | Generate opportunities |
| `/api/opportunities/save` | POST | Save opportunity |
| `/api/skills-eval` | POST | Evaluate skills |
| `/api/profile/save` | POST | Save user profile |
| `/api/profile/get` | GET | Get user profile |

## Deployment

See [infrastructure/README_DEPLOY.md](infrastructure/README_DEPLOY.md) for detailed deployment instructions.

### Quick Deploy

**Backend (Cloud Run):**
```bash
cd backend
gcloud builds submit --tag gcr.io/PROJECT_ID/tenaai-backend
gcloud run deploy tenaai-backend --image gcr.io/PROJECT_ID/tenaai-backend
```

**Frontend (Firebase Hosting):**
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

## Environment Variables

### Backend
| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Path to service account JSON | Yes* |
| `FIREBASE_SERVICE_ACCOUNT_BASE64` | Base64 encoded service account | Yes* |
| `FIREBASE_PROJECT_ID` | Firebase project ID | No |
| `PORT` | Server port (default: 8080) | No |
| `CORS_ORIGIN` | Allowed CORS origin | No |

*One of `FIREBASE_SERVICE_ACCOUNT_PATH` or `FIREBASE_SERVICE_ACCOUNT_BASE64` is required

### Frontend
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_FIREBASE_*` | Firebase config values | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Powered by Google Gemini AI
- Built with Firebase
- Designed for Ethiopian youth
