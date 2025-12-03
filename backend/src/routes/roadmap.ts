import { Router } from 'express';
import { roadmapController } from '../controllers/roadmapController';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// POST /api/roadmap - Generate a new roadmap (auth optional, saves if authenticated)
router.post(
  '/',
  optionalAuthMiddleware,
  validate('roadmap'),
  roadmapController.generate
);

// GET /api/roadmap - Get user's saved roadmaps (auth required)
router.get('/', authMiddleware, roadmapController.getUserRoadmaps);

// GET /api/roadmap/:roadmapId - Get a specific roadmap (auth required)
router.get('/:roadmapId', authMiddleware, roadmapController.getRoadmap);

// DELETE /api/roadmap/:roadmapId - Delete a roadmap (auth required)
router.delete('/:roadmapId', authMiddleware, roadmapController.deleteRoadmap);

export default router;
