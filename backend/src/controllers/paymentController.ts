import { Request, Response } from 'express';
import { paymentService } from '../services/paymentService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const paymentController = {
  // POST /api/payments/create
  async createPayment(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const { orderId } = req.body;
      if (!orderId) {
        return res.status(400).json({ success: false, message: 'orderId is required.' });
      }

      const result = await paymentService.createPayment(orderId, req.user.id);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in createPayment controller:', error);
      return res.status(500).json({ success: false, message: error.message || 'Unable to initiate payment.' });
    }
  },

  // POST /api/payments/verify (Never trusts frontend blindly)
  async verifyPayment(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const { transactionId, orderId, paymentSignature } = req.body;
      if (!transactionId || !orderId) {
        return res.status(400).json({ success: false, message: 'transactionId and orderId are required.' });
      }

      const result = await paymentService.verifyPayment(transactionId, orderId, paymentSignature, req.body);
      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in verifyPayment controller:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while verifying payment.' });
    }
  },

  // POST /api/payments/webhook (Signature verification architecture)
  async webhook(req: Request, res: Response) {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const result = await paymentService.processWebhook(req.body, signature);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in webhook controller:', error);
      return res.status(500).json({ success: false, message: 'Webhook processing error.' });
    }
  },

  // GET /api/payments/:orderId
  async getPaymentByOrder(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const orderId = req.params.orderId as string;
      const result = await paymentService.getPaymentByOrder(orderId, req.user.id);
      if (!result.success) {
        const statusCode = result.message?.includes('Forbidden') ? 403 : 404;
        return res.status(statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in getPaymentByOrder controller:', error);
      return res.status(500).json({ success: false, message: 'Unable to fetch payment details.' });
    }
  },

  // POST /api/payments/:orderId/release (Confirm Delivery & Release Escrow)
  async releaseEscrow(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const orderId = req.params.orderId as string;
      const result = await paymentService.releaseEscrowToFarmer(orderId, req.user.id, req.user.role);
      
      if (!result.success) {
        const statusCode = result.message?.includes('Forbidden') ? 403 : 400;
        return res.status(statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in releaseEscrow controller:', error);
      return res.status(500).json({ success: false, message: 'Unable to release escrow funds.' });
    }
  }
};
