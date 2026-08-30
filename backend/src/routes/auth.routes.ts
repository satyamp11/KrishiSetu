import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const authRouter = Router();

// POST /api/auth/register - User Registration
authRouter.post('/register', authController.register);

// POST /api/auth/login - User Login
authRouter.post('/login', authController.login);

// GET /api/auth/me - Fetch authenticated user profile
authRouter.get('/me', requireAuth, authController.getCurrentUser);

// POST /api/auth/logout - Logout user
authRouter.post('/logout', authController.logout);
