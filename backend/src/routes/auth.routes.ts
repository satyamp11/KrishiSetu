import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const authRouter = Router();

// POST /api/auth/send-otp - Request 6-digit OTP
authRouter.post('/send-otp', authController.sendOtp);

// POST /api/auth/verify-otp - Verify OTP and Authenticate User
authRouter.post('/verify-otp', authController.verifyOtp);

// POST /api/auth/register - User Registration (Legacy / Direct)
authRouter.post('/register', authController.register);

// POST /api/auth/login - User Login (Legacy / Direct)
authRouter.post('/login', authController.login);

// GET /api/auth/me - Fetch authenticated user profile
authRouter.get('/me', requireAuth, authController.getCurrentUser);

// POST /api/auth/logout - Logout user
authRouter.post('/logout', authController.logout);
