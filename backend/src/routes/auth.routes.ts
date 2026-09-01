import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authenticateUser, authorizeRole, AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const authRouter = Router();

// POST /api/auth/send-otp - Request 6-digit OTP
authRouter.post('/send-otp', authController.sendOtp);

// POST /api/auth/verify-otp - Verify OTP and Authenticate User
authRouter.post('/verify-otp', authController.verifyOtp);

// POST /api/auth/register - User Registration with Role Selection
authRouter.post('/register', authController.register);

// POST /api/auth/login - User Login
authRouter.post('/login', authController.login);

// GET /api/auth/me - Fetch authenticated user profile and active role
authRouter.get('/me', authenticateUser, authController.getCurrentUser);

// POST /api/auth/logout - Logout user
authRouter.post('/logout', authController.logout);

// --- Role Authorization Test Endpoints ---
authRouter.get('/admin-only', authenticateUser, authorizeRole('admin'), (req: AuthenticatedRequest, res) => {
  res.json({ success: true, message: 'Welcome Admin', user: req.user });
});

authRouter.get('/farmer-only', authenticateUser, authorizeRole('farmer'), (req: AuthenticatedRequest, res) => {
  res.json({ success: true, message: 'Welcome Farmer', user: req.user });
});

authRouter.get('/bulk-only', authenticateUser, authorizeRole('bulk_buyer'), (req: AuthenticatedRequest, res) => {
  res.json({ success: true, message: 'Welcome Bulk Buyer', user: req.user });
});

authRouter.get('/delivery-only', authenticateUser, authorizeRole('delivery_partner'), (req: AuthenticatedRequest, res) => {
  res.json({ success: true, message: 'Welcome Delivery Partner', user: req.user });
});

authRouter.get('/consumer-only', authenticateUser, authorizeRole('consumer'), (req: AuthenticatedRequest, res) => {
  res.json({ success: true, message: 'Welcome Consumer', user: req.user });
});
