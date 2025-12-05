import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import config from '../config';
import { logger } from './logger';
import { PROMPTS } from '../config/prompts';
import {
  Language,
  RoadmapStage,
  Opportunity,
  GeminiRoadmapResponse,
  GeminiOpportunitiesResponse,
  GeminiSkillsResponse,
} from '../types';

// Error codes for frontend handling
export const AI_ERROR_CODES = {
  AI_NO_ANSWER: 'AI_NO_ANSWER',
  AI_QUOTA: 'AI_QUOTA',
  AI_TIMEOUT: 'AI_TIMEOUT',
  AI_MALFORMED_RESPONSE: 'AI_MALFORMED_RESPONSE',
  AI_API_KEY_MISSING: 'AI_API_KEY_MISSING',
  LLM_ERROR: 'LLM_ERROR',
} as const;

export class AIError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = 'AIError';
  }
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private readonly MAX_RETRIES = 3;
  private readonly REQUEST_TIMEOUT = 20000; // 20 seconds

  constructor() {
    if (!config.gemini.apiKey) {
      logger.error('Gemini API key is missing!');
    }
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey || '');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  /**
   * Execute with retry and exponential backoff
   */
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        // Add timeout wrapper
        const result = await Promise.race([
          operation(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new AIError('Request timed out', AI_ERROR_CODES.AI_TIMEOUT)), this.REQUEST_TIMEOUT)
          ),
        ]);
        return result;
      } catch (error: unknown) {
        lastError = error as Error;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        logger.warn(`${operationName} attempt ${attempt}/${this.MAX_RETRIES} failed:`, errorMessage);
        
        // Check for quota errors
        if (errorMessage.includes('quota') || errorMessage.includes('429')) {
          throw new AIError('AI service quota exceeded. Please try again later.', AI_ERROR_CODES.AI_QUOTA);
        }
        
        // Don't retry on timeout - throw immediately
        if (error instanceof AIError && error.code === AI_ERROR_CODES.AI_TIMEOUT) {
          throw error;
        }
        
        // Exponential backoff before retry
        if (attempt < this.MAX_RETRIES) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          logger.info(`Retrying ${operationName} in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError || new AIError('Operation failed after retries', AI_ERROR_CODES.LLM_ERROR);
  }

  /**
   * Parse JSON from Gemini response, handling markdown code blocks
   */
  private parseJsonResponse<T>(text: string): T {
    // Remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    try {
      return JSON.parse(cleanedText) as T;
    } catch (error) {
      logger.error('Failed to parse Gemini JSON response:', { text: cleanedText, error });
      throw new AIError('Failed to parse AI response', AI_ERROR_CODES.AI_MALFORMED_RESPONSE);
    }
  }

  /**
   * Generate a career roadmap with retry and timeout
   */
  async generateRoadmap(
    careerGoal: string,
    skillLevel?: string,
    options?: { age?: number; gender?: string; language?: Language }
  ): Promise<RoadmapStage[]> {
    // Validate API key
    if (!config.gemini.apiKey) {
      throw new AIError('AI service not configured', AI_ERROR_CODES.AI_API_KEY_MISSING);
    }

    return this.executeWithRetry(async () => {
      const languageNames: Record<Language, string> = {
        en: 'English',
        am: 'Amharic',
        om: 'Afan Oromo',
        tg: 'Tigrigna',
        so: 'Somali',
      };
      
      const lang = options?.language || 'en';
      const languageName = languageNames[lang] || 'English';
      
      // Enhanced prompt with demographic info
      let prompt = PROMPTS.roadmap(careerGoal, skillLevel);
      if (options?.age || options?.gender || options?.language) {
        prompt = `${prompt}\n\nAdditional context:
        ${options.age ? `- User age: ${options.age}` : ''}
        ${options.gender ? `- User gender: ${options.gender}` : ''}
        - Respond in ${languageName}
        - Consider cultural context relevant to Ethiopian youth.`;
      }
      
      logger.info('Generating roadmap for:', { careerGoal, skillLevel, options });
      
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new AIError('AI returned empty response', AI_ERROR_CODES.AI_NO_ANSWER);
      }

      logger.debug('Gemini roadmap response received', { length: text.length });

      const parsed = this.parseJsonResponse<GeminiRoadmapResponse>(text);
      
      if (!parsed.stages || !Array.isArray(parsed.stages) || parsed.stages.length === 0) {
        throw new AIError('Invalid roadmap structure from AI', AI_ERROR_CODES.AI_MALFORMED_RESPONSE);
      }
      
      return parsed.stages;
    }, 'generateRoadmap');
  }

  /**
   * Explain a concept in the specified language
   */
  async explainConcept(
    concept: string,
    language: Language,
    context?: string
  ): Promise<string> {
    try {
      const prompt = PROMPTS.explain(concept, language, context);
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      logger.debug('Gemini explain response:', { language, concept: concept.substring(0, 50) });

      return text;
    } catch (error) {
      logger.error('Error explaining concept:', error);
      throw new Error('Failed to generate explanation');
    }
  }

  /**
   * Generate opportunity recommendations
   */
  async generateOpportunities(
    careerGoal: string,
    skillLevel?: string,
    category?: string
  ): Promise<Omit<Opportunity, 'id' | 'createdAt'>[]> {
    try {
      const prompt = PROMPTS.opportunities(careerGoal, skillLevel, category);
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      logger.debug('Gemini opportunities response:', { text });

      const parsed = this.parseJsonResponse<GeminiOpportunitiesResponse>(text);
      return parsed.opportunities;
    } catch (error) {
      logger.error('Error generating opportunities:', error);
      throw new Error('Failed to generate opportunities');
    }
  }

  /**
   * Evaluate skills and provide recommendations
   */
  async evaluateSkills(
    careerGoal: string,
    currentSkills: string[],
    experience?: string
  ): Promise<GeminiSkillsResponse & { assessment: string }> {
    try {
      const prompt = PROMPTS.skillsEval(careerGoal, currentSkills, experience);
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      logger.debug('Gemini skills eval response:', { text });

      const parsed = this.parseJsonResponse<GeminiSkillsResponse & { assessment: string }>(text);
      return parsed;
    } catch (error) {
      logger.error('Error evaluating skills:', error);
      throw new Error('Failed to evaluate skills');
    }
  }

  /**
   * General chat completion for the AI tutor with retry and error handling
   */
  async chat(message: string, language: Language = 'en'): Promise<string> {
    // Validate API key
    if (!config.gemini.apiKey) {
      throw new AIError('AI service not configured', AI_ERROR_CODES.AI_API_KEY_MISSING);
    }
    
    // Validate input
    if (!message || message.trim().length === 0) {
      throw new AIError('Message cannot be empty', AI_ERROR_CODES.AI_NO_ANSWER);
    }

    return this.executeWithRetry(async () => {
      const languageNames: Record<Language, string> = {
        en: 'English',
        am: 'Amharic',
        om: 'Afan Oromo',
        tg: 'Tigrigna',
        so: 'Somali',
      };
      const languageName = languageNames[language] || 'English';
      
      const systemPrompt = `You are QineGuide AI Tutor, a friendly and knowledgeable AI mentor helping Ethiopian youth learn and grow in their careers. 
      You MUST respond in ${languageName}.
      Be encouraging, patient, and provide practical advice relevant to the Ethiopian context.
      Keep responses concise but helpful.`;

      const result = await this.model.generateContent(`${systemPrompt}\n\nUser: ${message}`);
      const response = result.response;
      const text = response.text();
      
      if (!text || text.trim().length === 0) {
        throw new AIError('AI returned empty response', AI_ERROR_CODES.AI_NO_ANSWER);
      }
      
      return text;
    }, 'chat');
  }

  /**
   * Generate simple text response
   */
  async generateText(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      logger.error('Error generating text:', error);
      throw new Error('Failed to generate text');
    }
  }

  /**
   * Detect language from text
   */
  async detectLanguage(text: string): Promise<Language> {
    try {
      const prompt = `Detect the language of this text and respond with only one of: "en", "am", or "om".
      Text: "${text}"
      
      Respond with only the language code, nothing else.`;
      
      const result = await this.model.generateContent(prompt);
      const detected = result.response.text().trim().toLowerCase();
      
      if (detected === 'am' || detected === 'amharic') return 'am';
      if (detected === 'om' || detected === 'oromo' || detected === 'afan oromo') return 'om';
      return 'en';
    } catch (error) {
      logger.error('Error detecting language:', error);
      return 'en';
    }
  }

  /**
   * Generate daily learning tasks - ALWAYS 60 minutes total
   */
  async generateDailyPlan(
    careerGoal: string,
    completedTopics: string[],
    skillLevel: string,
    language: Language = 'en'
  ): Promise<{
    tasks: DailyTask[];
    quizQuestions: QuizQuestion[];
    estimatedMinutesPerDay: number;
  }> {
    try {
      const languageNames: Record<Language, string> = {
        en: 'English',
        am: 'Amharic',
        om: 'Afan Oromo',
        tg: 'Tigrigna',
        so: 'Somali',
      };
      const languageName = languageNames[language] || 'English';
      
      const prompt = `Generate a personalized daily learning plan for someone pursuing ${careerGoal}.
      Their current skill level: ${skillLevel}
      Topics they've already completed: ${completedTopics.join(', ') || 'None yet'}
      
      IMPORTANT: The total estimated time for ALL tasks combined MUST equal exactly 60 minutes.
      Respond in ${languageName}.
      
      Return a JSON object with this exact structure:
      {
        "tasks": [
          {
            "id": "task_1",
            "title": "Task title",
            "description": "Brief description",
            "estimatedTime": 15,
            "type": "learn|practice|review",
            "priority": "high|medium|low",
            "resources": ["resource link or name"],
            "completed": false
          }
        ],
        "quizQuestions": [
          {
            "id": "q_1",
            "question": "Question text?",
            "type": "multiple_choice",
            "options": ["A", "B", "C", "D"],
            "correctAnswer": "A",
            "explanation": "Why this is correct"
          }
        ]
      }
      
      Generate 4-6 tasks that add up to EXACTLY 60 minutes total. Include 3-5 quiz questions.`;

      const result = await this.model.generateContent(prompt);
      const parsed = this.parseJsonResponse<{ tasks: DailyTask[]; quizQuestions: QuizQuestion[] }>(
        result.response.text()
      );
      
      // Ensure tasks have completed field and normalize to 60 minutes
      const tasks = parsed.tasks.map(task => ({
        ...task,
        completed: task.completed ?? false,
      }));
      
      // Force total time to 60 minutes by adjusting task times proportionally
      const currentTotal = tasks.reduce((sum, t) => sum + t.estimatedTime, 0);
      if (currentTotal !== 60 && currentTotal > 0) {
        const ratio = 60 / currentTotal;
        tasks.forEach(task => {
          task.estimatedTime = Math.round(task.estimatedTime * ratio);
        });
        // Adjust last task to ensure exactly 60
        const adjustedTotal = tasks.reduce((sum, t) => sum + t.estimatedTime, 0);
        if (adjustedTotal !== 60 && tasks.length > 0) {
          tasks[tasks.length - 1].estimatedTime += (60 - adjustedTotal);
        }
      }
      
      return {
        tasks,
        quizQuestions: parsed.quizQuestions,
        estimatedMinutesPerDay: 60, // Always 60 minutes
      };
    } catch (error) {
      logger.error('Error generating daily plan:', error);
      throw new Error('Failed to generate daily plan');
    }
  }

  /**
   * Generate quiz questions for a topic
   */
  async generateQuiz(
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number = 5,
    language: Language = 'en'
  ): Promise<QuizQuestion[]> {
    try {
      const languageName = language === 'am' ? 'Amharic' : language === 'om' ? 'Afan Oromo' : 'English';
      
      const prompt = `Generate ${count} ${difficulty} quiz questions about "${topic}".
      Respond in ${languageName}.
      
      Return a JSON array with this structure:
      [
        {
          "id": "q_1",
          "question": "Question text?",
          "type": "multiple_choice",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option A",
          "explanation": "Explanation of why this is correct",
          "difficulty": "${difficulty}",
          "category": "${topic}"
        }
      ]
      
      Mix multiple choice and short answer questions. Ensure questions test understanding, not just memorization.`;

      const result = await this.model.generateContent(prompt);
      return this.parseJsonResponse<QuizQuestion[]>(result.response.text());
    } catch (error) {
      logger.error('Error generating quiz:', error);
      throw new Error('Failed to generate quiz');
    }
  }

  /**
   * Grade quiz answers
   */
  async gradeQuiz(
    questions: QuizQuestion[],
    answers: Record<string, string>,
    language: Language = 'en'
  ): Promise<QuizGradeResult> {
    try {
      const languageName = language === 'am' ? 'Amharic' : language === 'om' ? 'Afan Oromo' : 'English';
      
      const questionsWithAnswers = questions.map(q => ({
        question: q.question,
        correctAnswer: q.correctAnswer,
        userAnswer: answers[q.id] || 'No answer provided',
        type: q.type,
      }));

      const prompt = `Grade these quiz answers and provide feedback.
      Respond in ${languageName}.
      
      Questions and Answers:
      ${JSON.stringify(questionsWithAnswers, null, 2)}
      
      Return a JSON object:
      {
        "score": number (correct answers count),
        "totalQuestions": ${questions.length},
        "percentage": number,
        "feedback": [
          {
            "questionId": "q_1",
            "isCorrect": boolean,
            "feedback": "Specific feedback for this answer"
          }
        ],
        "overallFeedback": "Encouraging overall assessment",
        "areasToImprove": ["area1", "area2"],
        "strengths": ["strength1"]
      }`;

      const result = await this.model.generateContent(prompt);
      return this.parseJsonResponse<QuizGradeResult>(result.response.text());
    } catch (error) {
      logger.error('Error grading quiz:', error);
      throw new Error('Failed to grade quiz');
    }
  }

  /**
   * Explain concept with optional image description
   */
  async explainWithImage(
    concept: string,
    language: Language = 'en'
  ): Promise<{ explanation: string; shortExplanation: string; imageDescription: string }> {
    try {
      const languageName = language === 'am' ? 'Amharic' : language === 'om' ? 'Afan Oromo' : 'English';
      
      const prompt = `Explain the concept "${concept}" in ${languageName}.
      
      Return a JSON object:
      {
        "explanation": "Detailed explanation (3-4 paragraphs)",
        "shortExplanation": "Brief explanation (2-3 sentences, suitable for text-to-speech)",
        "imageDescription": "Detailed description of a diagram that would help visualize this concept. Be specific about shapes, labels, arrows, and layout."
      }`;

      const result = await this.model.generateContent(prompt);
      return this.parseJsonResponse<{
        explanation: string;
        shortExplanation: string;
        imageDescription: string;
      }>(result.response.text());
    } catch (error) {
      logger.error('Error explaining concept:', error);
      throw new Error('Failed to explain concept');
    }
  }
}

// Types for new features
export interface DailyTask {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  type: 'learn' | 'practice' | 'review';
  priority: 'high' | 'medium' | 'low';
  resources: string[];
  completed?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'short_answer';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty?: string;
  category?: string;
}

export interface QuizGradeResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  feedback: Array<{
    questionId: string;
    isCorrect: boolean;
    feedback: string;
  }>;
  overallFeedback: string;
  areasToImprove: string[];
  strengths: string[];
}

// Export singleton instance
export const geminiService = new GeminiService();
export default geminiService;
