import { Router } from 'express';
import { opportunitiesController } from '../controllers/opportunitiesController';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// POST /api/opportunities - Generate opportunity recommendations (auth optional)
router.post(
  '/',
  optionalAuthMiddleware,
  validate('opportunities'),
  opportunitiesController.generate
);

// POST /api/opportunities/save - Save/bookmark an opportunity (auth required)
router.post(
  '/save',
  authMiddleware,
  validate('saveOpportunity'),
  opportunitiesController.save
);

// GET /api/opportunities/saved - Get saved opportunities (auth required)
router.get('/saved', authMiddleware, opportunitiesController.getSaved);

// DELETE /api/opportunities/:opportunityId - Delete saved opportunity (auth required)
router.delete('/:opportunityId', authMiddleware, opportunitiesController.delete);

export default router;
