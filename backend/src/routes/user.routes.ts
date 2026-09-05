import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const userRouter = Router();

// GET /api/users/profile - Get authenticated user profile
userRouter.get('/profile', requireAuth, userController.getProfile);

// PUT /api/users/profile - Update authenticated user profile
userRouter.put('/profile', requireAuth, userController.updateProfile);
