import { Router } from 'express';
import { tutorController } from '../controllers/tutorController';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// POST /api/explain - Explain a concept (auth optional, saves history if authenticated)
router.post(
  '/',
  optionalAuthMiddleware,
  validate('explain'),
  tutorController.explain
);

// POST /api/explain/chat - Chat with AI tutor (auth optional)
router.post(
  '/chat',
  optionalAuthMiddleware,
  validate('chat'),
  tutorController.chat
);

// GET /api/explain/history - Get all chat histories (auth required)
router.get('/history', authMiddleware, tutorController.getHistory);

// GET /api/explain/history/:historyId - Get specific chat history (auth required)
router.get('/history/:historyId', authMiddleware, tutorController.getHistory);

export default router;
