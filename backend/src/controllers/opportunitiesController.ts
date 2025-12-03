import { Response } from 'express';
import { geminiService } from '../services/gemini';
import { firestoreService } from '../services/firestore';
import { logger } from '../services/logger';
import { AuthenticatedRequest, OpportunitiesRequest, Opportunity } from '../types';

export const opportunitiesController = {
  /**
   * Generate opportunity recommendations
   */
  async generate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { careerGoal, skillLevel, category } = req.body as OpportunitiesRequest;
      const uid = req.user?.uid;

      logger.info(`Generating opportunities for: ${careerGoal}`, { uid, skillLevel, category });

      // Generate opportunities using Gemini
      const opportunities = await geminiService.generateOpportunities(
        careerGoal,
        skillLevel,
        category
      );

      res.status(200).json({
        success: true,
        data: {
          opportunities,
          careerGoal,
        },
        message: 'Opportunities generated successfully',
      });
    } catch (error) {
      logger.error('Error generating opportunities:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate opportunities',
      });
    }
  },

  /**
   * Save/bookmark an opportunity
   */
  async save(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const uid = req.user?.uid;

      if (!uid) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const opportunityData = req.body as Omit<Opportunity, 'id' | 'createdAt'>;

      const savedOpportunity = await firestoreService.saveOpportunity(uid, opportunityData);

      res.status(201).json({
        success: true,
        data: savedOpportunity,
        message: 'Opportunity saved successfully',
      });
    } catch (error) {
      logger.error('Error saving opportunity:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to save opportunity',
      });
    }
  },

  /**
   * Get user's saved opportunities
   */
  async getSaved(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const uid = req.user?.uid;

      if (!uid) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const opportunities = await firestoreService.getUserOpportunities(uid);

      res.status(200).json({
        success: true,
        data: opportunities,
      });
    } catch (error) {
      logger.error('Error fetching saved opportunities:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch saved opportunities',
      });
    }
  },

  /**
   * Delete a saved opportunity
   */
  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const uid = req.user?.uid;
      const { opportunityId } = req.params;

      if (!uid) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      await firestoreService.deleteOpportunity(uid, opportunityId);

      res.status(200).json({
        success: true,
        message: 'Opportunity deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting opportunity:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete opportunity',
      });
    }
  },
};

export default opportunitiesController;
