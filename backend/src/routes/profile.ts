import { Router } from 'express';
import { profileController } from '../controllers/profileController';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// POST /api/profile/save - Save/update user profile (auth required)
router.post('/save', authMiddleware, validate('saveProfile'), profileController.save);

// GET /api/profile/get - Get user profile with related data (auth required)
router.get('/get', authMiddleware, profileController.get);

// PUT /api/profile/language - Update language preference (auth required)
router.put('/language', authMiddleware, profileController.updateLanguage);

export default router;
