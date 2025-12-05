<div align="center">
  <img src="frontend/public/favicon.svg" alt="QineGuide Logo" width="80" height="80">
  
  # QineGuide
  
  ### *Where Understanding Meets Purpose, Guidance Becomes Possibility*
  
  [![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-qineguide--app.web.app-4A8EF0?style=for-the-badge)](https://qineguide-app.web.app)
  [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
  [![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  
  **AI-powered personalized learning and career navigation platform for Ethiopian youth**
  
  [Features](#-features) • [Demo](#-live-demo) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)
</div>

---

## 🌟 Overview

QineGuide is a comprehensive AI-powered educational platform designed specifically for Ethiopian youth. It combines personalized career roadmaps, multilingual AI tutoring, daily learning plans, and curated opportunities to help young Ethiopians navigate their educational and career journeys.

### Why QineGuide?

- **🇪🇹 Built for Ethiopia**: Native support for Amharic (አማርኛ), Afaan Oromoo, Tigrinya (ትግርኛ), Somali, and English
- **🤖 AI-Powered**: Leverages Google Gemini AI for personalized learning experiences
- **📱 Mobile-First**: Beautiful, responsive design that works on any device
- **🎯 Career-Focused**: Tailored roadmaps for Ethiopian career opportunities
- **🔒 Secure**: Firebase Authentication with Google Sign-In support

---

## ✨ Features

### 🗺️ Personalized Career Roadmaps
AI-generated step-by-step learning paths tailored to your career goals, with progress tracking, resources, and milestones.

### 🎓 AI Tutor (Tena)
Interactive chat-based AI tutor that explains concepts in your preferred language with:
- Text-to-Speech (TTS) for audio responses
- Speech-to-Text (STT) for voice input
- Conversation history and context awareness
- Visual explanations and examples

### 📅 Daily Learning Coach
Personalized daily learning tasks with:
- Smart task prioritization
- Progress tracking and streaks
- Integrated knowledge quizzes
- Resource recommendations

### 🧠 Interactive Quizzes
AI-generated quizzes to test your knowledge:
- Multiple choice and short answer questions
- Detailed feedback and explanations
- Performance tracking and analytics

### 🔍 Opportunity Discovery
Find scholarships, internships, bootcamps, and educational programs:
- Filtered by category, skill level, and location
- Save and track interesting opportunities
- Direct links to application pages

### 👥 Mentor Network
Connect with Ethiopian tech leaders and industry professionals:
- Curated mentor profiles
- LinkedIn integration
- Filter by expertise and scope

### 📊 Learning Analytics
Track your progress with:
- Skills development charts
- Learning time tracking
- Achievement milestones
- Progress visualizations

### 🌍 Multi-Language Support
Full UI and content support for:
| Language | Native Name | Code |
|----------|-------------|------|
| English | English | `en` |
| Amharic | አማርኛ | `am` |
| Afaan Oromoo | Afaan Oromoo | `om` |
| Tigrinya | ትግርኛ | `tg` |
| Somali | Soomaali | `so` |

---

## 🚀 Live Demo

**🌐 Production**: [https://qineguide-app.web.app](https://qineguide-app.web.app)

### Demo Credentials
You can sign up with your email or use Google Sign-In to explore all features.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript 5.3 | Type Safety |
| Vite | Build Tool |
| TailwindCSS | Styling |
| React Router v6 | Navigation |
| Firebase Auth | Authentication |
| Axios | API Client |
| Recharts | Data Visualization |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 20 | Runtime |
| Express.js | Web Framework |
| TypeScript | Type Safety |
| Google Gemini AI | AI/ML |
| Firebase Admin | Database & Auth |
| Cloud Firestore | NoSQL Database |
| Google Cloud TTS | Text-to-Speech |
| Google Cloud STT | Speech-to-Text |
| Zod | Validation |
| Winston | Logging |
| Helmet | Security |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Firebase Hosting | Frontend CDN |
| Google Cloud Run | Backend Container |
| Cloud Firestore | Database |
| Firebase Auth | Authentication |

---

## 📁 Project Structure

```
qineguide/
├── frontend/                    # React Frontend Application
│   ├── public/                  # Static assets (favicon, manifest)
│   ├── src/
│   │   ├── api/                 # API client with typed endpoints
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ExternalLink.tsx # Safe external link handler
│   │   │   ├── Layout.tsx       # App shell with navigation
│   │   │   ├── QuizModal.tsx    # Interactive quiz component
│   │   │   └── ...
│   │   ├── context/             # React Context providers
│   │   │   ├── AuthContext.tsx  # Firebase auth state
│   │   │   └── LanguageContext.tsx # i18n translations
│   │   ├── pages/               # Route page components
│   │   │   ├── Dashboard.tsx    # Main dashboard
│   │   │   ├── Tutor.tsx        # AI chat interface
│   │   │   ├── CareerGoal.tsx   # Roadmap generator
│   │   │   ├── DailyCoach.tsx   # Daily learning tasks
│   │   │   └── ...
│   │   └── config/              # Firebase config
│   ├── index.html               # HTML entry point
│   ├── tailwind.config.js       # Tailwind configuration
│   └── package.json
│
├── backend/                     # Express Backend API
│   ├── src/
│   │   ├── config/              # Firebase & prompts config
│   │   ├── controllers/         # Request handlers
│   │   │   ├── roadmapController.ts
│   │   │   ├── tutorController.ts
│   │   │   ├── quizController.ts
│   │   │   └── ...
│   │   ├── middleware/          # Express middleware
│   │   │   ├── auth.ts          # JWT verification
│   │   │   ├── validation.ts    # Zod schemas
│   │   │   └── errorHandler.ts  # Error handling
│   │   ├── routes/              # API route definitions
│   │   ├── services/            # Business logic
│   │   │   ├── gemini.ts        # AI service
│   │   │   ├── analytics.ts     # User analytics
│   │   │   └── logger.ts        # Winston logger
│   │   └── types/               # TypeScript interfaces
│   ├── Dockerfile               # Container config
│   └── package.json
│
├── infrastructure/              # Deployment configs
│   ├── cloudrun-deploy.yaml     # Cloud Run config
│   └── README_DEPLOY.md         # Deployment guide
│
├── docs/                        # Documentation
│   └── TECHNICAL_DOCUMENTATION.md
│
└── README.md                    # This file
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js 20+** ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Firebase Project** ([Create one](https://console.firebase.google.com/))
- **Google Cloud Account** with Gemini API enabled

### 1. Clone the Repository

```bash
git clone https://github.com/Abrehamgethub/TenaAI.git
cd TenaAI
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
# Required
GEMINI_API_KEY=your-gemini-api-key

# Firebase (choose one)
FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json
# OR
FIREBASE_SERVICE_ACCOUNT_BASE64=base64-encoded-service-account

# Optional
PORT=8080
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:8080/api
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Start development server:
```bash
npm run dev
```

### 4. Open in Browser

Navigate to **http://localhost:5173** 🎉

---

## 📚 API Reference

### Authentication
All protected endpoints require a Firebase ID token in the `Authorization` header:
```
Authorization: Bearer <firebase-id-token>
```

### Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| **Roadmap** |
| `/api/roadmap` | POST | Optional | Generate AI career roadmap |
| `/api/roadmap` | GET | Required | Get user's saved roadmaps |
| `/api/roadmap/:id` | DELETE | Required | Delete a roadmap |
| **Tutor** |
| `/api/tutor/explain` | POST | Optional | Get concept explanation |
| `/api/tutor/chat` | POST | Optional | Chat with AI tutor |
| `/api/tutor/history` | GET | Required | Get chat history |
| **Quiz** |
| `/api/quiz/generate` | POST | Optional | Generate quiz questions |
| `/api/quiz/grade` | POST | Optional | Grade quiz answers |
| `/api/quiz/history` | GET | Required | Get quiz history |
| **Daily Plan** |
| `/api/daily-plan` | GET | Required | Get today's learning tasks |
| `/api/daily-plan/toggle` | POST | Required | Toggle task completion |
| **Opportunities** |
| `/api/opportunities` | POST | Optional | Generate opportunities |
| `/api/opportunities/save` | POST | Required | Save opportunity |
| `/api/opportunities/saved` | GET | Required | Get saved opportunities |
| **Profile** |
| `/api/profile/save` | POST | Required | Save user profile |
| `/api/profile/get` | GET | Required | Get user profile |
| **Analytics** |
| `/api/analytics` | GET | Required | Get user analytics |
| `/api/analytics/activity` | POST | Required | Record activity |
| **Voice** |
| `/api/tts` | POST | Optional | Text-to-Speech |
| `/api/stt` | POST | Optional | Speech-to-Text |

### Example Requests

**Generate Roadmap:**
```bash
curl -X POST https://api.qineguide.com/api/roadmap \
  -H "Content-Type: application/json" \
  -d '{
    "careerGoal": "Full Stack Developer",
    "language": "en",
    "user": { "age": 22, "gender": "male" }
  }'
```

**Chat with Tutor:**
```bash
curl -X POST https://api.qineguide.com/api/tutor/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "message": "Explain machine learning in simple terms",
    "language": "am",
    "conversationId": "conv_123"
  }'
```

---

## 🚢 Deployment

### Frontend (Firebase Hosting)

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### Backend (Google Cloud Run)

```bash
cd backend

# Build container
gcloud builds submit --tag gcr.io/PROJECT_ID/qineguide-backend

# Deploy to Cloud Run
gcloud run deploy qineguide-backend \
  --image gcr.io/PROJECT_ID/qineguide-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=xxx,CORS_ORIGIN=https://qineguide-app.web.app"
```

See [infrastructure/README_DEPLOY.md](infrastructure/README_DEPLOY.md) for detailed deployment instructions.

---

## 🔧 Configuration

### Environment Variables

#### Backend
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ | - | Google Gemini API key |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | ⚠️ | - | Path to service account JSON |
| `FIREBASE_SERVICE_ACCOUNT_BASE64` | ⚠️ | - | Base64 encoded service account |
| `FIREBASE_PROJECT_ID` | ❌ | Auto-detect | Firebase project ID |
| `PORT` | ❌ | `8080` | Server port |
| `CORS_ORIGIN` | ❌ | `*` | Allowed CORS origin |
| `NODE_ENV` | ❌ | `development` | Environment mode |

⚠️ One of `FIREBASE_SERVICE_ACCOUNT_PATH` or `FIREBASE_SERVICE_ACCOUNT_BASE64` is required

#### Frontend
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend API URL |
| `VITE_FIREBASE_API_KEY` | ✅ | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | ✅ | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | ✅ | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | ✅ | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | ✅ | Firebase app ID |

---

## 📖 Documentation

- **[Technical Documentation](docs/TECHNICAL_DOCUMENTATION.md)** - Architecture, API details, and implementation notes
- **[Deployment Guide](infrastructure/README_DEPLOY.md)** - Step-by-step deployment instructions

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Google Gemini AI](https://deepmind.google/technologies/gemini/)** - AI/ML capabilities
- **[Firebase](https://firebase.google.com/)** - Authentication & database
- **[TailwindCSS](https://tailwindcss.com/)** - Beautiful styling
- **[Lucide](https://lucide.dev/)** - Modern icons
- **Ethiopian Tech Community** - Inspiration and support

---

<div align="center">
  <p>Built with ❤️ for Ethiopian Youth</p>
  <p>
    <a href="https://qineguide-app.web.app">Live Demo</a> •
    <a href="https://github.com/Abrehamgethub/TenaAI/issues">Report Bug</a> •
    <a href="https://github.com/Abrehamgethub/TenaAI/issues">Request Feature</a>
  </p>
</div>
