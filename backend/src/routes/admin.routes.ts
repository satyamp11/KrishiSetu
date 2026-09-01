import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';

export const adminRouter = Router();

// Protect all admin routes with authentication & admin role authorization
adminRouter.use(authenticateUser, authorizeRole('admin'));

// GET /api/admin/metrics
adminRouter.get('/metrics', adminController.getMetrics);

// GET /api/admin/farmers
adminRouter.get('/farmers', adminController.getFarmers);

// PUT /api/admin/farmers/:id/verify
adminRouter.put('/farmers/:id/verify', adminController.verifyFarmer);

export default adminRouter;
