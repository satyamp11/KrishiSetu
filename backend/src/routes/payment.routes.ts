import { Router } from 'express';
import { paymentController } from '../controllers/paymentController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

export const paymentRouter = Router();

// POST /api/payments/create - Initiate Gateway Session
paymentRouter.post('/create', authenticateUser, paymentController.createPayment);

// POST /api/payments/verify - Verify Signature & Move State to HELD_FOR_ORDER
paymentRouter.post('/verify', authenticateUser, paymentController.verifyPayment);

// POST /api/payments/webhook - Gateway Webhook Endpoint
paymentRouter.post('/webhook', paymentController.webhook);

// GET /api/payments/:orderId - Payment Details & History
paymentRouter.get('/:orderId', authenticateUser, paymentController.getPaymentByOrder);

// POST /api/payments/:orderId/release - Confirm Delivery & Release Escrow to Farmer
paymentRouter.post('/:orderId/release', authenticateUser, paymentController.releaseEscrow);

export default paymentRouter;
