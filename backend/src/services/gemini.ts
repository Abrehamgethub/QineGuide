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

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
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
      throw new Error('Failed to parse AI response');
    }
  }

  /**
   * Generate a career roadmap
   */
  async generateRoadmap(
    careerGoal: string,
    skillLevel?: string
  ): Promise<RoadmapStage[]> {
    try {
      const prompt = PROMPTS.roadmap(careerGoal, skillLevel);
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      logger.debug('Gemini roadmap response:', { text });

      const parsed = this.parseJsonResponse<GeminiRoadmapResponse>(text);
      return parsed.stages;
    } catch (error) {
      logger.error('Error generating roadmap:', error);
      throw new Error('Failed to generate career roadmap');
    }
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
   * General chat completion for the AI tutor
   */
  async chat(message: string, language: Language = 'en'): Promise<string> {
    try {
      const systemPrompt = `You are TenaAI, a friendly AI tutor helping Ethiopian youth learn and grow in their careers. 
      Respond in ${language === 'am' ? 'Amharic' : language === 'om' ? 'Afan Oromo' : 'English'}.
      Be encouraging, patient, and provide practical advice relevant to the Ethiopian context.`;

      const result = await this.model.generateContent(`${systemPrompt}\n\nUser: ${message}`);
      const response = result.response;
      return response.text();
    } catch (error) {
      logger.error('Error in chat:', error);
      throw new Error('Failed to generate chat response');
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
export default geminiService;
