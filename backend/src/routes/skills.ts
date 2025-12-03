import { Router } from 'express';
import { skillsController } from '../controllers/skillsController';
import { optionalAuthMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// POST /api/skills-eval - Evaluate user skills (auth optional)
router.post(
  '/',
  optionalAuthMiddleware,
  validate('skillsEval'),
  skillsController.evaluate
);

export default router;
