import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/test', (_req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Server is working!' });
});

// Auth routes should NOT have authentication
router.use('/auth', authRoutes);

// API routes should have authentication
router.use('/api', authenticateToken, apiRoutes);

export default router;