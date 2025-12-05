import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { geminiService, AIError, AI_ERROR_CODES } from '../services/gemini';
import { firestoreService } from '../services/firestore';
import { logger } from '../services/logger';
import { AuthenticatedRequest, ExplainRequest, Language } from '../types';

// Helper to map AI errors to structured responses
const mapAIError = (error: unknown): { message: string; code: string; status: number } => {
  if (error instanceof AIError) {
    const statusMap: Record<string, number> = {
      [AI_ERROR_CODES.AI_TIMEOUT]: 504,
      [AI_ERROR_CODES.AI_QUOTA]: 429,
      [AI_ERROR_CODES.AI_API_KEY_MISSING]: 503,
      [AI_ERROR_CODES.AI_NO_ANSWER]: 500,
      [AI_ERROR_CODES.AI_MALFORMED_RESPONSE]: 500,
      [AI_ERROR_CODES.LLM_ERROR]: 500,
    };
    return {
      message: error.message,
      code: error.code,
      status: statusMap[error.code] || 500,
    };
  }
  return {
    message: 'An unexpected error occurred',
    code: AI_ERROR_CODES.LLM_ERROR,
    status: 500,
  };
};

export const tutorController = {
  /**
   * Explain a concept in the specified language
   */
  async explain(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { concept, language, context } = req.body as ExplainRequest;
      const uid = req.user?.uid;

      logger.info(`Explaining concept: ${concept.substring(0, 50)}...`, {
        uid,
        language,
      });

      // Generate explanation using Gemini
      const explanation = await geminiService.explainConcept(concept, language, context);

      // Save to chat history if user is authenticated
      if (uid) {
        const historyId = uuidv4();
        
        // Save user question
        await firestoreService.saveChatMessage(uid, historyId, {
          role: 'user',
          content: concept,
          language,
        });

        // Save AI response
        await firestoreService.saveChatMessage(uid, historyId, {
          role: 'assistant',
          content: explanation,
          language,
        });
      }

      res.status(200).json({
        success: true,
        data: {
          explanation,
          language,
        },
        message: 'Concept explained successfully',
      });
    } catch (error) {
      logger.error('Error explaining concept:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate explanation',
      });
    }
  },

  /**
   * Chat with AI tutor
   */
  async chat(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { message, language = 'en', historyId } = req.body as {
        message: string;
        language?: Language;
        historyId?: string;
      };
      const uid = req.user?.uid;

      // Validate input
      if (!message || message.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Message cannot be empty',
          code: 'INVALID_INPUT',
        });
        return;
      }

      logger.info(`Chat message received`, { uid, language, messageLength: message.length });

      // Generate response using Gemini
      const response = await geminiService.chat(message.trim(), language);

      // Save to chat history if user is authenticated
      if (uid) {
        const chatHistoryId = historyId || uuidv4();

        // Save user message - using correct Firestore path
        await firestoreService.saveChatMessage(uid, chatHistoryId, {
          role: 'user',
          content: message.trim(),
          language,
        });

        // Save AI response
        await firestoreService.saveChatMessage(uid, chatHistoryId, {
          role: 'assistant',
          content: response,
          language,
        });

        res.status(200).json({
          success: true,
          data: {
            response,
            historyId: chatHistoryId,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          response,
        },
      });
    } catch (error) {
      logger.error('Error in chat:', error);
      const errorInfo = mapAIError(error);
      res.status(errorInfo.status).json({
        success: false,
        error: errorInfo.message,
        code: errorInfo.code,
      });
    }
  },

  /**
   * Get chat history
   */
  async getHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const uid = req.user?.uid;
      const { historyId } = req.params;

      if (!uid) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      if (historyId) {
        const history = await firestoreService.getChatHistory(uid, historyId);
        // Return messages array sorted by timestamp for proper chat rendering
        const messages = history?.messages || [];
        messages.sort((a, b) => {
          const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
          const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
          return timeA - timeB;
        });
        res.status(200).json({
          success: true,
          data: messages,
        });
      } else {
        const histories = await firestoreService.getAllChatHistories(uid);
        res.status(200).json({
          success: true,
          data: histories,
        });
      }
    } catch (error) {
      logger.error('Error fetching chat history:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch chat history',
      });
    }
  },
};

export default tutorController;
