
import mongoose from 'mongoose';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Payment, ExtendedPaymentState } from '../models/Payment.js';
import { Order } from '../models/Order.js';



export interface RazorpayOrderCreateParams {
  amount: number;     // in paise (INR × 100)
  currency: string;
  receipt: string;
  notes: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;        
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export interface RazorpayPaymentVerifyParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayRefundParams {
  payment_id: string;
  amount?: number;    // partial refund in paise; omit for full refund
  notes?: Record<string, string>;
}

export interface PaymentInitResponse {
  success: boolean;
  transactionId: string;
  orderId: string;
  orderNumber: string;
  amount: number;           // in INR (for display)
  amountInPaise: number;    // for Razorpay checkout
  currency: string;
  keyId: string;
  razorpayOrderId: string;  // pass to Razorpay checkout widget
  priceBreakdown: {
    consumerTotal: number;
    farmerEarnings: number;
    logisticsCost: number;
    platformFee: number;
    intermediarySavings: number;
  };
  message?: string;
}

// ─── Config (single source for env reads) ────────────────────────────────────

function getRazorpayConfig() {
  return {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || ''
  };
}

function getRazorpayClient(): Razorpay {
  const { keyId, keySecret } = getRazorpayConfig();
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// ─── Helper: Add entry to escrow timeline ────────────────────────────────────

function addTimelineEntry(
  paymentDoc: any,
  status: ExtendedPaymentState,
  note: string,
  triggeredBy: string = 'system'
) {
  paymentDoc.escrowTimeline.push({ status, timestamp: new Date(), note, triggeredBy });
  // Also push to legacy history for backward compatibility
  paymentDoc.history.push({ state: status, timestamp: new Date(), note });
}

// ─── Payment Service ─────────────────────────────────────────────────────────

export const paymentService = {

  // ── 1. Calculate Dynamic Price Breakdown ──────────────────────────────────
  calculateDynamicBreakdown(subtotalAmount: number, logisticsFee: number = 0) {
    const consumerTotal = subtotalAmount + logisticsFee;
    const farmerEarnings = Math.round(subtotalAmount * 0.82);
    const logisticsCost = logisticsFee + Math.round(subtotalAmount * 0.11);
    const platformFee = Math.round(subtotalAmount * 0.07);
    const intermediarySavings = Math.round(subtotalAmount * 0.35);
    return { consumerTotal, farmerEarnings, logisticsCost, platformFee, intermediarySavings };
  },

  // ── 2. Initiate Payment — Create Razorpay Order + local Payment record ────
  /**
   * POST /api/payments/create
   * Amount is ALWAYS sourced from the Order record in DB — never from frontend.
   */
  async createPayment(orderId: string, userId: string): Promise<PaymentInitResponse> {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error('Invalid order ID');
    }

    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');
    if (order.buyerId.toString() !== userId) {
      throw new Error('Forbidden: You are not the buyer of this order');
    }

    // Server-side amount computation — never trust frontend amount
    const breakdown = this.calculateDynamicBreakdown(order.subtotalAmount, order.logisticsFee);
    const amountInPaise = Math.round(order.totalAmount * 100); // Razorpay expects paise

    // Create Razorpay Order
    const rzp = getRazorpayClient();
    let razorpayOrder: RazorpayOrderResponse;
    try {
      razorpayOrder = await rzp.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `KS_${order.orderNumber}`,
        notes: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          buyerId: userId
        }
      }) as unknown as RazorpayOrderResponse;
    } catch (err: any) {
      console.error('[paymentService] Razorpay order creation failed:', err?.error || err?.message);
      throw new Error('Unable to initiate payment. Please try again.');
    }

    const transactionId = `PAY_TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // Create or reset Payment record
    let paymentDoc = await Payment.findOne({ orderId: order._id });
    if (paymentDoc) {
      // Reset if buyer retrying
      paymentDoc.paymentState = 'PENDING';
      paymentDoc.razorpayOrderId = razorpayOrder.id;
      paymentDoc.razorpayPaymentId = '';
      paymentDoc.razorpaySignature = '';
    } else {
      paymentDoc = new Payment({
        transactionId,
        orderId: order._id,
        orderNumber: order.orderNumber,
        buyerId: order.buyerId,
        farmerId: order.sellerId,
        totalAmount: order.totalAmount,
        farmerAmount: breakdown.farmerEarnings,
        logisticsAmount: breakdown.logisticsCost,
        platformFee: breakdown.platformFee,
        paymentState: 'PENDING',
        gatewayProvider: 'RAZORPAY_SANDBOX',
        razorpayOrderId: razorpayOrder.id,
        escrowTimeline: [],
        history: []
      });
    }

    addTimelineEntry(
      paymentDoc,
      'PENDING',
      `Razorpay order created (${razorpayOrder.id}). Buyer redirected to checkout. Amount: ₹${order.totalAmount}`,
      'buyer'
    );
    await paymentDoc.save();

    console.log(`[paymentService] ✅ Razorpay order created: ${razorpayOrder.id} for order ${order.orderNumber}`);

    return {
      success: true,
      transactionId: paymentDoc.transactionId,
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      amount: order.totalAmount,
      amountInPaise,
      currency: 'INR',
      keyId: getRazorpayConfig().keyId,
      razorpayOrderId: razorpayOrder.id,
      priceBreakdown: breakdown,
      message: 'Razorpay checkout session created. Complete payment on frontend.'
    };
  },

  // ── 3. Verify Payment Signature (CRITICAL security step) ──────────────────
  /**
   * POST /api/payments/verify
   * Verifies HMAC SHA256 signature using Key Secret.
   * MUST reject if invalid — this prevents payment tampering.
   */
  async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    triggeredBy: string = 'buyer'
  ): Promise<{ success: boolean; paymentState: ExtendedPaymentState; message?: string; escrowTimeline?: any[] }> {

    const { keySecret } = getRazorpayConfig();

    // ── HMAC Signature Verification ──
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      console.error(`[paymentService] ❌ Signature mismatch for order ${razorpayOrderId}`);
      // Mark payment as FAILED in DB
      const paymentDoc = await Payment.findOne({ razorpayOrderId });
      if (paymentDoc) {
        paymentDoc.paymentState = 'FAILED';
        addTimelineEntry(paymentDoc, 'FAILED', 'Signature verification failed — possible tampering detected.', triggeredBy);
        await paymentDoc.save();
      }
      return { success: false, paymentState: 'FAILED', message: 'Payment verification failed.' };
    }

    // ── Signature OK — hold funds in escrow ──
    return this.captureAndHoldEscrow(razorpayOrderId, razorpayPaymentId, razorpaySignature, triggeredBy);
  },

  // ── 4. Capture and Hold in Escrow ─────────────────────────────────────────
  async captureAndHoldEscrow(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    triggeredBy: string = 'system'
  ): Promise<{ success: boolean; paymentState: ExtendedPaymentState; message?: string; escrowTimeline?: any[] }> {

    const paymentDoc = await Payment.findOne({ razorpayOrderId });
    if (!paymentDoc) {
      console.error(`[paymentService] Payment not found for razorpayOrderId: ${razorpayOrderId}`);
      return { success: false, paymentState: 'FAILED', message: 'Payment record not found.' };
    }

    // Idempotency — skip if already held
    if (paymentDoc.paymentState === 'HELD_FOR_ORDER') {
      return { success: true, paymentState: 'HELD_FOR_ORDER', escrowTimeline: paymentDoc.escrowTimeline };
    }

    const order = await Order.findById(paymentDoc.orderId);
    if (!order) {
      return { success: false, paymentState: 'FAILED', message: 'Associated order not found.' };
    }

    // Update Payment record to HELD
    paymentDoc.paymentState = 'HELD_FOR_ORDER';
    paymentDoc.razorpayPaymentId = razorpayPaymentId;
    paymentDoc.razorpaySignature = razorpaySignature;
    paymentDoc.rawGatewayResponse = {
      razorpayOrderId,
      razorpayPaymentId,
      verifiedAt: new Date().toISOString()
    };

    addTimelineEntry(paymentDoc, 'PAID',
      `Payment of ₹${paymentDoc.totalAmount} received. Razorpay Payment ID: ${razorpayPaymentId}`,
      triggeredBy
    );
    addTimelineEntry(paymentDoc, 'HELD_FOR_ORDER',
      `Funds of ₹${paymentDoc.totalAmount} held securely in KrishiSetu escrow. Farmer will receive ₹${paymentDoc.farmerAmount} upon delivery.`,
      'system'
    );

    await paymentDoc.save();

    // Update Order — status to CONFIRMED + payment history
    order.paymentStatus = 'HELD_FOR_ORDER';
    order.orderStatus = 'CONFIRMED';
    order.paymentHistory.push({
      state: 'HELD_FOR_ORDER',
      transactionId: paymentDoc.transactionId,
      timestamp: new Date(),
      note: 'Payment verified and held in escrow. Order confirmed.'
    });
    order.statusHistory.push({
      status: 'CONFIRMED',
      updatedAt: new Date(),
      note: 'Auto-confirmed after payment captured in escrow.'
    });
    await order.save();

    console.log(`[paymentService] ✅ Escrow HELD for order ${order.orderNumber} | pay_id: ${razorpayPaymentId}`);

    return {
      success: true,
      paymentState: 'HELD_FOR_ORDER',
      message: `Payment verified! ₹${paymentDoc.totalAmount} held securely in escrow. Order confirmed.`,
      escrowTimeline: paymentDoc.escrowTimeline
    };
  },

  // ── 5. Release Escrow to Farmer (on DELIVERED) ────────────────────────────
  /**
   * POST /api/payments/:orderId/release
   * Also called automatically when order status changes to DELIVERED.
   */
  async releaseEscrowToFarmer(
    orderId: string,
    userId: string,
    userRole: string
  ): Promise<{ success: boolean; paymentState: ExtendedPaymentState; message?: string; escrowTimeline?: any[] }> {

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return { success: false, paymentState: 'FAILED', message: 'Invalid order ID' };
    }

    const order = await Order.findById(orderId);
    if (!order) return { success: false, paymentState: 'FAILED', message: 'Order not found' };

    const isBuyer = order.buyerId.toString() === userId;
    const isFarmer = order.sellerId.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isBuyer && !isFarmer && !isAdmin) {
      return { success: false, paymentState: order.paymentStatus, message: 'Forbidden' };
    }

    if (order.orderStatus !== 'DELIVERED') {
      return {
        success: false,
        paymentState: order.paymentStatus,
        message: 'Order must be DELIVERED before escrow can be released.'
      };
    }

    const paymentDoc = await Payment.findOne({ orderId: order._id });
    if (!paymentDoc) {
      return { success: false, paymentState: 'FAILED', message: 'Payment record not found.' };
    }

    if (paymentDoc.paymentState === 'RELEASED') {
      return { success: true, paymentState: 'RELEASED', message: 'Escrow already released.', escrowTimeline: paymentDoc.escrowTimeline };
    }

    // Compute final payout split from Order.priceBreakdown
    const farmerPayout = order.priceBreakdown.farmerEarnings;
    const platformFeeAmount = order.priceBreakdown.platformFee;

    // Update Payment
    paymentDoc.paymentState = 'RELEASED';
    paymentDoc.farmerPayoutAmount = farmerPayout;
    paymentDoc.platformFeeAmount = platformFeeAmount;

    const triggeredBy = isAdmin ? 'admin' : isBuyer ? 'buyer' : 'farmer';
    addTimelineEntry(paymentDoc, 'RELEASE_PENDING',
      `Delivery confirmed. Initiating escrow release. Farmer payout: ₹${farmerPayout}, Platform fee retained: ₹${platformFeeAmount}`,
      triggeredBy
    );
    addTimelineEntry(paymentDoc, 'RELEASED',
      `✅ ₹${farmerPayout} released to farmer (${order.sellerName}). Platform fee ₹${platformFeeAmount} retained. Order complete.`,
      'system'
    );
    await paymentDoc.save();

    // Update Order
    order.paymentStatus = 'RELEASED';
    order.paymentHistory.push({
      state: 'RELEASED',
      transactionId: paymentDoc.transactionId,
      timestamp: new Date(),
      note: `₹${farmerPayout} released to farmer upon delivery confirmation.`
    });
    await order.save();

    console.log(`[paymentService] ✅ Escrow RELEASED: ₹${farmerPayout} to farmer for order ${order.orderNumber}`);

    return {
      success: true,
      paymentState: 'RELEASED',
      message: `₹${farmerPayout} successfully released to ${order.sellerName}. Platform fee ₹${platformFeeAmount} retained.`,
      escrowTimeline: paymentDoc.escrowTimeline
    };
  },

  // ── 6. Refund Payment ─────────────────────────────────────────────────────
  /**
   * POST /api/payments/:orderId/refund
   * Calls Razorpay refund API. Admin or cancellation triggered.
   */
  async refundPayment(
    orderId: string,
    reason: string,
    userId: string,
    userRole: string
  ): Promise<{ success: boolean; paymentState: ExtendedPaymentState; message?: string; escrowTimeline?: any[] }> {

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return { success: false, paymentState: 'FAILED', message: 'Invalid order ID' };
    }

    const order = await Order.findById(orderId);
    if (!order) return { success: false, paymentState: 'FAILED', message: 'Order not found' };

    const isBuyer = order.buyerId.toString() === userId;
    const isAdmin = userRole === 'admin';
    if (!isBuyer && !isAdmin) {
      return { success: false, paymentState: order.paymentStatus, message: 'Forbidden' };
    }

    const paymentDoc = await Payment.findOne({ orderId: order._id });
    if (!paymentDoc) {
      return { success: false, paymentState: 'FAILED', message: 'Payment record not found.' };
    }

    if (paymentDoc.paymentState === 'REFUNDED') {
      return { success: true, paymentState: 'REFUNDED', message: 'Already refunded.', escrowTimeline: paymentDoc.escrowTimeline };
    }

    if (!paymentDoc.razorpayPaymentId) {
      return { success: false, paymentState: paymentDoc.paymentState, message: 'No captured payment to refund.' };
    }

    // Call Razorpay Refund API
    const rzp = getRazorpayClient();
    let refundId = '';
    try {
      const refund = await rzp.payments.refund(paymentDoc.razorpayPaymentId, {
        amount: Math.round(order.totalAmount * 100), // full refund in paise
        notes: { reason, orderId: orderId }
      }) as any;
      refundId = refund.id;
      console.log(`[paymentService] ✅ Razorpay refund initiated: ${refundId}`);
    } catch (err: any) {
      console.error('[paymentService] ❌ Razorpay refund failed:', err?.error || err?.message);
      return { success: false, paymentState: paymentDoc.paymentState, message: 'Unable to process refund. Try again.' };
    }

    const triggeredBy = isAdmin ? 'admin' : 'buyer';
    paymentDoc.paymentState = 'REFUNDED';
    paymentDoc.razorpayRefundId = refundId;

    addTimelineEntry(paymentDoc, 'REFUND_PENDING',
      `Refund initiated. Reason: ${reason}. Razorpay Refund ID: ${refundId}`,
      triggeredBy
    );
    addTimelineEntry(paymentDoc, 'REFUNDED',
      `✅ ₹${order.totalAmount} refunded to buyer. Refund ID: ${refundId}`,
      'system'
    );
    await paymentDoc.save();

    order.paymentStatus = 'REFUNDED';
    order.paymentHistory.push({
      state: 'REFUNDED',
      transactionId: paymentDoc.transactionId,
      timestamp: new Date(),
      note: `Refunded ₹${order.totalAmount}. Reason: ${reason}`
    });
    await order.save();

    return {
      success: true,
      paymentState: 'REFUNDED',
      message: `₹${order.totalAmount} refunded successfully. Refund ID: ${refundId}`,
      escrowTimeline: paymentDoc.escrowTimeline
    };
  },

  // ── 7. Webhook: Razorpay event handler ────────────────────────────────────
  /**
   * POST /api/payments/webhook
   * Safety net for cases where frontend confirm call is missed.
   * Raw body must be passed — do NOT parse with express.json() before this.
   */
  async processWebhook(
    rawBody: Buffer,
    signatureHeader: string
  ): Promise<{ success: boolean; message: string }> {

    const { webhookSecret } = getRazorpayConfig();

    if (!webhookSecret) {
      console.warn('[paymentService] RAZORPAY_WEBHOOK_SECRET not set — skipping webhook signature verification (DEV MODE)');
    } else {
      // Verify webhook signature using raw body (REQUIRED by Razorpay)
      const expectedSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (signatureHeader !== expectedSig) {
        console.warn('[paymentService] ❌ Webhook signature mismatch — request rejected');
        return { success: false, message: 'Invalid webhook signature' };
      }
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody.toString());
    } catch {
      return { success: false, message: 'Invalid JSON payload' };
    }

    const event = payload.event as string;
    console.log(`[paymentService] ⚡ Webhook received: ${event}`);

    if (event === 'payment.captured') {
      const payment = payload?.payload?.payment?.entity;
      if (payment) {
        const razorpayOrderId = payment.order_id;
        const razorpayPaymentId = payment.id;
        // Webhook doesn't include signature — use payment ID as self-verification
        const fakeSignature = crypto
          .createHmac('sha256', getRazorpayConfig().keySecret)
          .update(`${razorpayOrderId}|${razorpayPaymentId}`)
          .digest('hex');
        await this.captureAndHoldEscrow(razorpayOrderId, razorpayPaymentId, fakeSignature, 'webhook');
      }
    } else if (event === 'payment.failed') {
      const payment = payload?.payload?.payment?.entity;
      if (payment) {
        const razorpayOrderId = payment.order_id;
        const paymentDoc = await Payment.findOne({ razorpayOrderId });
        if (paymentDoc) {
          paymentDoc.paymentState = 'FAILED';
          addTimelineEntry(paymentDoc, 'FAILED', `Payment failed via webhook. Razorpay error: ${payment.error_description || 'Unknown'}`, 'webhook');
          await paymentDoc.save();
        }
      }
    }

    return { success: true, message: `Webhook event "${event}" processed.` };
  },

  // ── 8. Get Payment Status + Timeline ──────────────────────────────────────
  /**
   * GET /api/payments/:orderId/status
   * Returns escrow state + full timeline for UI consumption.
   */
  async getPaymentByOrder(
    orderId: string,
    userId: string
  ): Promise<{ success: boolean; payment?: any; orderBreakdown?: any; message?: string }> {

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return { success: false, message: 'Invalid order ID' };
    }

    const order = await Order.findById(orderId);
    if (!order) return { success: false, message: 'Order not found' };

    const isBuyer = order.buyerId.toString() === userId;
    const isSeller = order.sellerId.toString() === userId;

    if (!isBuyer && !isSeller) {
      return { success: false, message: 'Forbidden access to order payment history' };
    }

    const payment = await Payment.findOne({ orderId: order._id });

    return {
      success: true,
      payment,
      orderBreakdown: order.priceBreakdown || this.calculateDynamicBreakdown(order.subtotalAmount, order.logisticsFee)
    };
  }
};
