import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authenticateUser, authorizeRole, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

export const authRouter = Router();


const keyGenerator = (req: any) => {
  return req.body.identifier || req.body.emailOrPhone || req.body.phone || 'unknown';
};

const otpLimiter10Min = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  keyGenerator,
  validate: { ip: false }, // Prevent IPv6 validation warnings
  message: { success: false, message: 'Too many OTP requests. Please wait 10 minutes before trying again.' }
});


const otpLimiter1Hour = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  keyGenerator,
  validate: { ip: false },
  message: { success: false, message: 'Hourly OTP limit reached. Please try again later.' }
});


authRouter.post('/send-otp', otpLimiter10Min, otpLimiter1Hour, authController.sendOtp);

authRouter.post('/verify-otp', authController.verifyOtp);

authRouter.post('/register', authController.register);


authRouter.post('/login', authController.login);


authRouter.get('/me', authenticateUser, authController.getCurrentUser);

authRouter.post('/logout', authController.logout);


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
