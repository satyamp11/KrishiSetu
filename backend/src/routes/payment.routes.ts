import { Router } from 'express';
import { paymentController } from '../controllers/paymentController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import express from 'express';

export const paymentRouter = Router();

// ⚠️ WEBHOOK ROUTE MUST COME BEFORE express.json() middleware is applied
// Raw body is required for Razorpay webhook signature verification
// This is handled in server.ts by applying express.raw() only to this route
paymentRouter.post('/webhook', express.raw({ type: 'application/json' }), paymentController.webhook);

// POST /api/payments/create — Create Razorpay order + local Payment record
paymentRouter.post('/create', authenticateUser, paymentController.createPayment);

// POST /api/payments/verify — Verify Razorpay signature & move to HELD_FOR_ORDER
paymentRouter.post('/verify', authenticateUser, paymentController.verifyPayment);

// GET /api/payments/:orderId — Payment details & escrow timeline
paymentRouter.get('/:orderId', authenticateUser, paymentController.getPaymentByOrder);

// POST /api/payments/:orderId/release — Confirm delivery & release escrow to farmer
paymentRouter.post('/:orderId/release', authenticateUser, paymentController.releaseEscrow);

// POST /api/payments/:orderId/refund — Refund via Razorpay (buyer/admin)
paymentRouter.post('/:orderId/refund', authenticateUser, paymentController.refundPayment);

export default paymentRouter;
