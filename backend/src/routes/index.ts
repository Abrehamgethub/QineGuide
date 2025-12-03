import { Router } from 'express';
import roadmapRoutes from './roadmap';
import tutorRoutes from './tutor';
import opportunitiesRoutes from './opportunities';
import skillsRoutes from './skills';
import profileRoutes from './profile';

const router = Router();

// API Routes
router.use('/roadmap', roadmapRoutes);
router.use('/explain', tutorRoutes);
router.use('/opportunities', opportunitiesRoutes);
router.use('/skills-eval', skillsRoutes);
router.use('/profile', profileRoutes);

export default router;
