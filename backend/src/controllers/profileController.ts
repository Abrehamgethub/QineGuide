import { Response } from 'express';
import { firestoreService } from '../services/firestore';
import { logger } from '../services/logger';
import { AuthenticatedRequest, SaveProfileRequest } from '../types';

export const profileController = {
  /**
   * Save/update user profile
   */
  async save(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email;

      if (!uid) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const profileData = req.body as SaveProfileRequest;

      const profile = await firestoreService.upsertUserProfile(uid, {
        ...profileData,
        email,
      });

      logger.info(`Profile saved for user: ${uid}`);

      res.status(200).json({
        success: true,
        data: profile,
        message: 'Profile saved successfully',
      });
    } catch (error) {
      logger.error('Error saving profile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to save profile',
      });
    }
  },

  /**
   * Get user profile with all related data
   */
  async get(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const uid = req.user?.uid;

      if (!uid) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      // Get profile
      const profile = await firestoreService.getUserProfile(uid);

      if (!profile) {
        // Create empty profile if it doesn't exist
        const newProfile = await firestoreService.upsertUserProfile(uid, {
          email: req.user?.email,
          name: req.user?.name || '',
        });

        res.status(200).json({
          success: true,
          data: {
            profile: newProfile,
            roadmaps: [],
            savedOpportunities: [],
          },
        });
        return;
      }

      // Get related data
      const [roadmaps, savedOpportunities] = await Promise.all([
        firestoreService.getUserRoadmaps(uid),
        firestoreService.getUserOpportunities(uid),
      ]);

      res.status(200).json({
        success: true,
        data: {
          profile,
          roadmaps,
          savedOpportunities,
        },
      });
    } catch (error) {
      logger.error('Error fetching profile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch profile',
      });
    }
  },

  /**
   * Update language preference
   */
  async updateLanguage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const uid = req.user?.uid;
      const { languagePreference } = req.body;

      if (!uid) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      await firestoreService.updateLanguagePreference(uid, languagePreference);

      res.status(200).json({
        success: true,
        message: 'Language preference updated successfully',
      });
    } catch (error) {
      logger.error('Error updating language:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update language preference',
      });
    }
  },
};

export default profileController;
