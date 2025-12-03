import { Response } from 'express';
import { geminiService } from '../services/gemini';
import { logger } from '../services/logger';
import { AuthenticatedRequest, SkillsEvalRequest } from '../types';

export const skillsController = {
  /**
   * Evaluate user skills and provide recommendations
   */
  async evaluate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { careerGoal, currentSkills, experience } = req.body as SkillsEvalRequest;
      const uid = req.user?.uid;

      logger.info(`Evaluating skills for: ${careerGoal}`, {
        uid,
        skillsCount: currentSkills.length,
      });

      // Evaluate skills using Gemini
      const evaluation = await geminiService.evaluateSkills(
        careerGoal,
        currentSkills,
        experience
      );

      res.status(200).json({
        success: true,
        data: {
          careerGoal,
          currentSkills,
          ...evaluation,
        },
        message: 'Skills evaluated successfully',
      });
    } catch (error) {
      logger.error('Error evaluating skills:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to evaluate skills',
      });
    }
  },
};

export default skillsController;
