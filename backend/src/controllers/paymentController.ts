import { Request, Response } from 'express';
import { paymentService } from '../services/paymentService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const paymentController = {

  // POST /api/payments/create — Initiate Razorpay checkout session
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
      console.error('[paymentController] createPayment error:', error?.message);
      return res.status(500).json({ success: false, message: error.message || 'Unable to initiate payment.' });
    }
  },

  // POST /api/payments/verify — Verify Razorpay signature & hold escrow
  async verifyPayment(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.'
        });
      }

      const result = await paymentService.verifyPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        'buyer'
      );

      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      console.error('[paymentController] verifyPayment error:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while verifying payment.' });
    }
  },

  // POST /api/payments/webhook — Raw body handler for Razorpay webhooks
  async webhook(req: Request, res: Response) {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      // req.body here is a raw Buffer (set up in server.ts for this route only)
      const result = await paymentService.processWebhook(req.body as Buffer, signature);
      return res.status(200).json(result);
    } catch (error) {
      console.error('[paymentController] webhook error:', error);
      return res.status(200).json({ success: false, message: 'Webhook processing error.' });
      // Always return 200 to Razorpay — otherwise it will retry indefinitely
    }
  },

  // GET /api/payments/:orderId — Payment details + escrow timeline
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
      console.error('[paymentController] getPaymentByOrder error:', error);
      return res.status(500).json({ success: false, message: 'Unable to fetch payment details.' });
    }
  },

  // POST /api/payments/:orderId/release — Release escrow to farmer
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
      console.error('[paymentController] releaseEscrow error:', error);
      return res.status(500).json({ success: false, message: 'Unable to release escrow funds.' });
    }
  },

  // POST /api/payments/:orderId/refund — Refund via Razorpay
  async refundPayment(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }
      const orderId = req.params.orderId as string;
      const { reason } = req.body;
      if (!reason) {
        return res.status(400).json({ success: false, message: 'Refund reason is required.' });
      }
      const result = await paymentService.refundPayment(orderId, reason, req.user.id, req.user.role);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      console.error('[paymentController] refundPayment error:', error);
      return res.status(500).json({ success: false, message: 'Unable to process refund.' });
    }
  }
};
