import { Request } from 'express';

// Language types for multilingual support (5 languages)
export type Language = 'en' | 'am' | 'om' | 'tg' | 'so';

// User Profile
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  languagePreference: Language;
  careerGoals?: string[];
  completedStages?: string[];
}

// Roadmap types
export interface RoadmapStage {
  title: string;
  description: string;
  resources: string[];
  duration?: string;
  skills?: string[];
}

export interface Roadmap {
  id: string;
  userId: string;
  careerGoal: string;
  stages: RoadmapStage[];
  createdAt: Date;
  updatedAt: Date;
}

// Opportunity types
export interface Opportunity {
  id: string;
  title: string;
  provider: string;
  url: string;
  category: string;
  skillLevel: string;
  description?: string;
  deadline?: string;
  createdAt: Date;
}

// Chat/History types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  language: Language;
  timestamp: Date;
}

export interface ChatHistory {
  id: string;
  userId: string;
  messages: ChatMessage[];
  topic?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Skills Evaluation
export interface SkillsEvaluation {
  id: string;
  userId: string;
  careerGoal: string;
  currentSkills: string[];
  skillGaps: string[];
  recommendations: string[];
  evaluatedAt: Date;
}

// API Request types
export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

export interface RoadmapRequest {
  careerGoal: string;
  currentSkillLevel?: string;
  preferredLanguage?: Language;
}

export interface ExplainRequest {
  concept: string;
  language: Language;
  context?: string;
}

export interface OpportunitiesRequest {
  careerGoal: string;
  skillLevel?: string;
  category?: string;
}

export interface SkillsEvalRequest {
  careerGoal: string;
  currentSkills: string[];
  experience?: string;
}

export interface SaveProfileRequest {
  name?: string;
  languagePreference?: Language;
  careerGoals?: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Gemini response parsing
export interface GeminiRoadmapResponse {
  stages: RoadmapStage[];
}

export interface GeminiOpportunitiesResponse {
  opportunities: Omit<Opportunity, 'id' | 'createdAt'>[];
}

export interface GeminiSkillsResponse {
  skillGaps: string[];
  recommendations: string[];
}
