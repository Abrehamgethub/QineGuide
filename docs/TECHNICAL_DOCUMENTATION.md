# QineGuide Technical Documentation

> Comprehensive technical documentation for the QineGuide AI-powered learning platform

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintainers**: QineGuide Team

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Backend Architecture](#3-backend-architecture)
4. [Database Schema](#4-database-schema)
5. [Authentication & Security](#5-authentication--security)
6. [AI Integration](#6-ai-integration)
7. [Multi-Language Support](#7-multi-language-support)
8. [API Specifications](#8-api-specifications)
9. [Error Handling](#9-error-handling)
10. [Performance Optimizations](#10-performance-optimizations)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment Architecture](#12-deployment-architecture)
13. [Monitoring & Logging](#13-monitoring--logging)
14. [Troubleshooting Guide](#14-troubleshooting-guide)

---

## 1. Architecture Overview

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Web App   │  │   Mobile    │  │   Tablet    │  │   Desktop   │    │
│  │  (React)    │  │  (PWA)      │  │  (PWA)      │  │  (Browser)  │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
└─────────┼────────────────┼────────────────┼────────────────┼────────────┘
          │                │                │                │
          └────────────────┴────────────────┴────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         FIREBASE HOSTING (CDN)                           │
│                    https://qineguide-app.web.app                        │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         GOOGLE CLOUD RUN                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    EXPRESS.JS BACKEND API                        │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │   │
│  │  │ Roadmap  │  │  Tutor   │  │   Quiz   │  │  Daily   │        │   │
│  │  │Controller│  │Controller│  │Controller│  │Controller│        │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │   │
│  │       │             │             │             │               │   │
│  │       └─────────────┴─────────────┴─────────────┘               │   │
│  │                           │                                      │   │
│  │  ┌────────────────────────┴────────────────────────┐            │   │
│  │  │              GEMINI SERVICE (AI)                 │            │   │
│  │  └────────────────────────┬────────────────────────┘            │   │
│  └───────────────────────────┼──────────────────────────────────────┘   │
└──────────────────────────────┼──────────────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  CLOUD FIRESTORE │  │  GOOGLE GEMINI   │  │ FIREBASE AUTH    │
│    (Database)    │  │     AI API       │  │ (Identity)       │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

### Technology Stack Summary

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, React Router v6 |
| **Backend** | Node.js 20, Express.js, TypeScript, Zod |
| **AI/ML** | Google Gemini 1.5 Flash, Google Cloud TTS/STT |
| **Database** | Cloud Firestore (NoSQL) |
| **Auth** | Firebase Authentication (Email/Password, Google OAuth) |
| **Hosting** | Firebase Hosting (Frontend), Cloud Run (Backend) |
| **CI/CD** | GitHub Actions, Google Cloud Build |

---

## 2. Frontend Architecture

### Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── LanguageProvider (Context)
│       └── BrowserRouter
│           ├── PublicRoutes
│           │   ├── Landing
│           │   ├── Login
│           │   └── Register
│           └── ProtectedRoutes
│               └── Layout
│                   ├── Sidebar (Navigation)
│                   └── Main Content
│                       ├── Dashboard
│                       ├── Tutor (AI Chat)
│                       ├── CareerGoal (Roadmap)
│                       ├── DailyCoach
│                       ├── Quiz
│                       ├── Opportunities
│                       ├── Mentors
│                       ├── Analytics
│                       ├── Profile
│                       └── Help
```

### State Management

QineGuide uses **React Context** for global state management:

#### AuthContext
```typescript
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}
```

#### LanguageContext
```typescript
type Language = 'en' | 'am' | 'om' | 'tg' | 'so';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Record<string, string>;
}
```

### Key Components

#### Layout.tsx
The main application shell with:
- Responsive sidebar navigation
- Header with language selector
- Mobile-friendly hamburger menu
- Protected route wrapper

#### ExternalLink.tsx
Safe external link handler that:
- Sanitizes malformed URLs (e.g., `/https://` → `https://`)
- Adds `target="_blank"` and `rel="noopener noreferrer"`
- Prevents React Router from intercepting external navigations

```typescript
export function fixURL(url: string | null): string {
  if (!url) return '';
  let cleaned = url.trim();
  cleaned = cleaned.replace(/^\/+(https?:\/\/)/i, '$1');
  if (!/^https?:\/\//i.test(cleaned) && cleaned.includes('.')) {
    cleaned = 'https://' + cleaned;
  }
  return cleaned;
}
```

#### QuizModal.tsx
Interactive quiz component with:
- Question navigation
- Answer tracking
- Progress indicator
- Grading integration
- Results display with feedback

### Routing Structure

```typescript
// Public Routes
/                   → Landing
/login              → Login
/register           → Register

// Protected Routes (require authentication)
/dashboard          → Dashboard
/tutor              → AI Tutor Chat
/career             → Career Roadmap Generator
/roadmap            → Saved Roadmaps
/daily              → Daily Learning Coach
/quiz               → Quiz Practice
/opportunities      → Opportunity Discovery
/mentors            → Mentor Network
/analytics          → Learning Analytics
/profile            → User Profile
/help               → Help & FAQ
/membership         → Membership Plans
```

### Styling System

TailwindCSS with custom design tokens:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF4FF',
          100: '#D9E6FF',
          500: '#4A8EF0',
          600: '#3B7DD8',
          700: '#2C6DC0',
        },
        accent: {
          300: '#6DD3A8',
          400: '#4DC995',
          500: '#2DB882',
        },
        surface: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
        },
        text: {
          primary: '#1E293B',
          secondary: '#64748B',
          muted: '#94A3B8',
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07)',
        'soft-lg': '0 10px 40px -15px rgba(0, 0, 0, 0.1)',
      }
    }
  }
}
```

---

## 3. Backend Architecture

### Express Application Structure

```
backend/src/
├── index.ts                 # Application entry point
├── config/
│   ├── firebase.ts          # Firebase Admin initialization
│   └── prompts.ts           # AI prompt templates
├── controllers/
│   ├── roadmapController.ts # Roadmap CRUD operations
│   ├── tutorController.ts   # AI chat handling
│   ├── quizController.ts    # Quiz generation & grading
│   ├── dailyPlanController.ts
│   ├── opportunitiesController.ts
│   ├── profileController.ts
│   └── analyticsController.ts
├── middleware/
│   ├── auth.ts              # Firebase JWT verification
│   ├── validation.ts        # Zod schema validation
│   ├── errorHandler.ts      # Global error handling
│   └── rateLimiter.ts       # Rate limiting
├── routes/
│   ├── index.ts             # Route aggregator
│   ├── roadmap.ts
│   ├── tutor.ts
│   ├── quiz.ts
│   └── ...
├── services/
│   ├── gemini.ts            # Google Gemini AI service
│   ├── analytics.ts         # User analytics tracking
│   └── logger.ts            # Winston logging
└── types/
    └── index.ts             # TypeScript interfaces
```

### Middleware Stack

```typescript
// Middleware execution order
app.use(helmet());           // Security headers
app.use(cors(corsOptions));  // CORS handling
app.use(morgan('combined')); // Request logging
app.use(express.json());     // JSON parsing
app.use(rateLimiter);        // Rate limiting
app.use('/api', routes);     // API routes
app.use(errorHandler);       // Error handling
```

### Authentication Middleware

```typescript
// middleware/auth.ts
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await admin.auth().verifyIdToken(token);
  req.user = decodedToken;
  next();
};

// Optional auth - doesn't fail if no token
export const optionalAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split('Bearer ')[1];
      req.user = await admin.auth().verifyIdToken(token);
    } catch (e) {
      // Continue without auth
    }
  }
  next();
};
```

### Validation Middleware

Using Zod for request validation:

```typescript
// middleware/validation.ts
import { z } from 'zod';

export const roadmapRequestSchema = z.object({
  careerGoal: z.string().min(3, 'Career goal must be at least 3 characters'),
  language: z.enum(['en', 'am', 'om', 'tg', 'so']).optional().default('en'),
  user: z.object({
    age: z.number().optional(),
    gender: z.string().optional(),
  }).optional(),
});

export const quizGradeSchema = z.object({
  answers: z.record(z.string()),
  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    options: z.array(z.string()).optional(),
    type: z.enum(['multiple_choice', 'short_answer']),
  })).optional(),
  sessionId: z.string().optional(),
  language: z.string().optional(),
});
```

---

## 4. Database Schema

### Firestore Collections

#### Users Collection
```
users/{userId}
├── name: string
├── email: string
├── languagePreference: 'en' | 'am' | 'om' | 'tg' | 'so'
├── careerGoals: string[]
├── gender: string
├── dateOfBirth: timestamp
├── createdAt: timestamp
├── updatedAt: timestamp
│
├── /roadmaps/{roadmapId}
│   ├── id: string
│   ├── careerGoal: string
│   ├── stages: Stage[]
│   ├── createdAt: timestamp
│   └── progress: number
│
├── /conversations/{conversationId}
│   ├── id: string
│   ├── title: string
│   ├── messages: Message[]
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
├── /quizSessions/{sessionId}
│   ├── id: string
│   ├── topic: string
│   ├── difficulty: 'easy' | 'medium' | 'hard'
│   ├── questions: QuizQuestion[]
│   ├── status: 'active' | 'completed'
│   └── createdAt: timestamp
│
├── /quizHistory/{historyId}
│   ├── id: string
│   ├── sessionId: string
│   ├── score: number
│   ├── totalQuestions: number
│   ├── percentage: number
│   ├── feedback: QuestionFeedback[]
│   └── createdAt: timestamp
│
├── /dailyPlans/{planId}
│   ├── id: string
│   ├── date: timestamp
│   ├── tasks: DailyTask[]
│   ├── quizQuestions: QuizQuestion[]
│   └── streak: number
│
├── /savedOpportunities/{opportunityId}
│   ├── id: string
│   ├── title: string
│   ├── provider: string
│   ├── url: string
│   ├── category: string
│   └── savedAt: timestamp
│
└── /analytics/{analyticsId}
    ├── date: timestamp
    ├── tasksCompleted: number
    ├── quizzesTaken: number
    ├── conceptsLearned: number
    └── timeSpent: number
```

### TypeScript Interfaces

```typescript
interface Stage {
  title: string;
  description: string;
  duration: string;
  resources: string[];
  skills: string[];
  milestones: string[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'short_answer';
  options?: string[];
  correctAnswer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface DailyTask {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  type: 'learn' | 'practice' | 'review';
  priority: 'high' | 'medium' | 'low';
  resources: string[];
  completed: boolean;
}
```

---

## 5. Authentication & Security

### Firebase Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  Firebase   │────▶│   Backend   │
│  (React)    │     │    Auth     │     │  (Express)  │
└─────────────┘     └─────────────┘     └─────────────┘
      │                    │                   │
      │  1. Sign In        │                   │
      │───────────────────▶│                   │
      │                    │                   │
      │  2. ID Token       │                   │
      │◀───────────────────│                   │
      │                    │                   │
      │  3. API Request + Token                │
      │────────────────────────────────────────▶
      │                    │                   │
      │                    │  4. Verify Token  │
      │                    │◀──────────────────│
      │                    │                   │
      │                    │  5. Token Valid   │
      │                    │──────────────────▶│
      │                    │                   │
      │  6. API Response                       │
      │◀───────────────────────────────────────│
```

### Security Measures

1. **Helmet.js** - HTTP security headers
2. **CORS** - Origin validation
3. **Rate Limiting** - Request throttling
4. **Input Validation** - Zod schema validation
5. **JWT Verification** - Firebase token validation
6. **Environment Variables** - Secrets management

### Security Headers (Helmet)

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
```

---

## 6. AI Integration

### Gemini Service Architecture

```typescript
// services/gemini.ts
class GeminiService {
  private model: GenerativeModel;
  
  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });
  }

  async generateRoadmap(goal: string, language: Language): Promise<Roadmap>;
  async explainConcept(concept: string, language: Language): Promise<Explanation>;
  async chatResponse(messages: Message[], language: Language): Promise<string>;
  async generateQuiz(topic: string, difficulty: string, count: number): Promise<QuizQuestion[]>;
  async gradeQuiz(questions: QuizQuestion[], answers: Record<string, string>): Promise<GradeResult>;
  async generateDailyPlan(userContext: UserContext): Promise<DailyPlan>;
}
```

### Prompt Engineering

Prompts are designed for Ethiopian context:

```typescript
// config/prompts.ts
export const ROADMAP_PROMPT = `
You are an Ethiopian career guidance counselor. Generate a detailed learning roadmap 
for someone who wants to become a {goal}.

Consider:
- Ethiopian education system context
- Available resources in Ethiopia
- Local job market requirements
- Internet connectivity constraints

Respond in {language}.

Return JSON format:
{
  "careerGoal": "string",
  "stages": [
    {
      "title": "string",
      "description": "string",
      "duration": "string",
      "resources": ["string"],
      "skills": ["string"],
      "milestones": ["string"]
    }
  ]
}
`;
```

### Language-Aware Responses

```typescript
const languageNames: Record<Language, string> = {
  en: 'English',
  am: 'Amharic (አማርኛ)',
  om: 'Afaan Oromoo',
  tg: 'Tigrinya (ትግርኛ)',
  so: 'Somali (Soomaali)',
};

async generateResponse(prompt: string, language: Language) {
  const languageName = languageNames[language];
  const fullPrompt = `${prompt}\n\nRespond entirely in ${languageName}.`;
  return this.model.generateContent(fullPrompt);
}
```

---

## 7. Multi-Language Support

### Translation System

The `LanguageContext` contains all UI translations:

```typescript
// context/LanguageContext.tsx
const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.tutor': 'AI Tutor',
    'nav.roadmap': 'Career Roadmap',
    'dailyCoach.title': 'Your Daily Plan',
    // ... 200+ keys
  },
  am: {
    'nav.dashboard': 'ዳሽቦርድ',
    'nav.tutor': 'AI አስተማሪ',
    'nav.roadmap': 'የሙያ መንገድ ካርታ',
    'dailyCoach.title': 'የዛሬ እቅድዎ',
    // ... 200+ keys
  },
  om: {
    'nav.dashboard': 'Daashboordii',
    'nav.tutor': 'Barsiisaa AI',
    // ...
  },
  // tg, so...
};
```

### Translation Hook Usage

```tsx
const { t, language, setLanguage } = useLanguage();

// In components
<h1>{t('nav.dashboard')}</h1>
<button onClick={() => setLanguage('am')}>አማርኛ</button>
```

### Supported Languages

| Code | Language | Native Name | Script |
|------|----------|-------------|--------|
| `en` | English | English | Latin |
| `am` | Amharic | አማርኛ | Ge'ez (ፊደል) |
| `om` | Oromo | Afaan Oromoo | Latin |
| `tg` | Tigrinya | ትግርኛ | Ge'ez (ፊደል) |
| `so` | Somali | Soomaali | Latin |

---

## 8. API Specifications

### Roadmap API

#### POST /api/roadmap
Generate AI career roadmap.

**Request:**
```json
{
  "careerGoal": "Software Engineer",
  "language": "am",
  "user": {
    "age": 22,
    "gender": "female"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "roadmap": {
      "id": "roadmap_abc123",
      "careerGoal": "Software Engineer",
      "stages": [
        {
          "title": "Foundation Phase",
          "description": "Learn programming basics...",
          "duration": "3 months",
          "resources": ["freeCodeCamp", "CS50"],
          "skills": ["Python", "Git"],
          "milestones": ["Complete 10 projects"]
        }
      ]
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "careerGoal_missing_or_invalid",
  "message": "A clear careerGoal string (min 3 chars) is required."
}
```

### Quiz API

#### POST /api/quiz/grade
Grade quiz answers.

**Request:**
```json
{
  "answers": {
    "q_0": "Machine Learning",
    "q_1": "Python"
  },
  "questions": [
    {
      "id": "q_0",
      "question": "What is AI?",
      "type": "short_answer"
    }
  ],
  "language": "en"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "score": 2,
    "totalQuestions": 2,
    "percentage": 100,
    "feedback": [
      {
        "questionId": "q_0",
        "isCorrect": true,
        "feedback": "Excellent! Your understanding of AI is accurate."
      }
    ],
    "overallFeedback": "Great job! You demonstrate strong understanding.",
    "areasToImprove": [],
    "strengths": ["AI fundamentals"]
  }
}
```

---

## 9. Error Handling

### Error Response Format

All errors follow a consistent structure:

```json
{
  "success": false,
  "error": "error_code",
  "message": "Human-readable error message"
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `unauthorized` | 401 | Missing or invalid auth token |
| `forbidden` | 403 | Insufficient permissions |
| `not_found` | 404 | Resource not found |
| `validation_error` | 400 | Invalid request body |
| `careerGoal_missing_or_invalid` | 400 | Invalid career goal |
| `invalid_quiz_payload` | 400 | Invalid quiz submission |
| `rate_limit_exceeded` | 429 | Too many requests |
| `internal_error` | 500 | Server error |
| `ai_generation_failed` | 500 | AI service failure |

### Global Error Handler

```typescript
// middleware/errorHandler.ts
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Unhandled error:', err);
  
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'validation_error',
      message: err.errors[0]?.message || 'Invalid request',
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'internal_error',
    message: 'An unexpected error occurred',
  });
};
```

---

## 10. Performance Optimizations

### Frontend Optimizations

1. **Code Splitting**
   - Route-based lazy loading
   - Dynamic imports for heavy components

2. **Asset Optimization**
   - SVG icons (Lucide)
   - WebP images
   - Gzip compression

3. **Caching**
   - Service Worker for offline support
   - Browser caching headers

### Backend Optimizations

1. **Database**
   - Firestore indexes for common queries
   - Batch operations for bulk writes

2. **AI Responses**
   - Response streaming (where supported)
   - Prompt caching

3. **Rate Limiting**
   ```typescript
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // requests per window
   });
   ```

---

## 11. Testing Strategy

### Test Types

| Type | Tools | Coverage |
|------|-------|----------|
| Unit Tests | Jest, Vitest | Services, Utils |
| Integration Tests | Supertest | API Endpoints |
| E2E Tests | Playwright | User Flows |

### Running Tests

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test

# E2E tests
npm run test:e2e
```

### Test Examples

```typescript
// Backend unit test
describe('quizController.grade', () => {
  it('returns 400 for empty answers', async () => {
    const res = await request(app)
      .post('/api/quiz/grade')
      .send({});
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalid_quiz_payload');
  });
});
```

---

## 12. Deployment Architecture

### Production Infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│                    GOOGLE CLOUD PLATFORM                     │
│                                                              │
│  ┌──────────────────┐    ┌──────────────────┐              │
│  │  Cloud Build     │───▶│  Container       │              │
│  │  (CI/CD)         │    │  Registry        │              │
│  └──────────────────┘    └────────┬─────────┘              │
│                                   │                         │
│                                   ▼                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              CLOUD RUN (Auto-scaling)                 │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐              │  │
│  │  │Instance │  │Instance │  │Instance │  ← Scales    │  │
│  │  │   1     │  │   2     │  │   N     │    0-100     │  │
│  │  └─────────┘  └─────────┘  └─────────┘              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       FIREBASE                               │
│                                                              │
│  ┌──────────────────┐    ┌──────────────────┐              │
│  │  Firebase        │    │  Cloud           │              │
│  │  Hosting (CDN)   │    │  Firestore       │              │
│  └──────────────────┘    └──────────────────┘              │
│                                                              │
│  ┌──────────────────┐                                       │
│  │  Firebase Auth   │                                       │
│  └──────────────────┘                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Environment Configuration

**Production:**
- `NODE_ENV=production`
- HTTPS only
- Strict CORS
- Production Firebase project

**Staging:**
- `NODE_ENV=staging`
- Separate Firebase project
- Full logging

**Development:**
- `NODE_ENV=development`
- Local Firebase emulator
- Debug logging

---

## 13. Monitoring & Logging

### Logging Configuration

```typescript
// services/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    // Cloud Logging in production
  ],
});
```

### Log Levels

| Level | Usage |
|-------|-------|
| `error` | Critical failures |
| `warn` | Potential issues |
| `info` | Normal operations |
| `debug` | Development details |

### Health Check

```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
});
```

---

## 14. Troubleshooting Guide

### Common Issues

#### Issue: "Failed to grade quiz"
**Cause**: Invalid payload structure  
**Solution**: Ensure `answers` object and `questions` array are provided

```bash
# Valid request
curl -X POST /api/quiz/grade \
  -H "Content-Type: application/json" \
  -d '{"answers":{"q_0":"A"},"questions":[...]}'
```

#### Issue: External links redirect to app
**Cause**: React Router intercepting navigation  
**Solution**: Use `ExternalLink` component or `fixURL()` utility

```tsx
import { fixURL } from '../components/ExternalLink';

<a href={fixURL(url)} target="_blank" rel="noopener noreferrer">
```

#### Issue: Translations not loading
**Cause**: Language context not initialized  
**Solution**: Ensure `LanguageProvider` wraps your components

#### Issue: 401 Unauthorized
**Cause**: Missing or expired Firebase token  
**Solution**: Re-authenticate and include fresh token

```typescript
const token = await auth.currentUser?.getIdToken(true);
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### Debug Commands

```bash
# Check backend health
curl https://YOUR_API/health

# Test roadmap endpoint
curl -X POST https://YOUR_API/api/roadmap \
  -H "Content-Type: application/json" \
  -d '{"careerGoal":"Developer"}'

# View Cloud Run logs
gcloud run logs read qineguide-backend --limit=50
```

---

## Appendix

### A. API Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/roadmap` | 10 | 15 min |
| `/api/tutor/chat` | 30 | 15 min |
| `/api/quiz/*` | 20 | 15 min |
| Default | 100 | 15 min |

### B. Supported Browsers

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

### C. Useful Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Gemini API](https://ai.google.dev/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [React Router v6](https://reactrouter.com/en/main)

---

*Documentation generated for QineGuide v1.0.0*
