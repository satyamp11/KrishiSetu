import mongoose, { Schema, Document } from 'mongoose';

export type ExtendedPaymentState =
  | 'PENDING'
  | 'PAID'
  | 'HELD_FOR_ORDER'
  | 'RELEASE_PENDING'
  | 'RELEASED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'FAILED';

export interface IEscrowTimelineEntry {
  status: ExtendedPaymentState;
  timestamp: Date;
  note: string;
  triggeredBy?: string; // 'buyer' | 'admin' | 'system' | 'webhook'
}

export interface IPaymentRecord {
  transactionId: string;
  orderId: mongoose.Types.ObjectId;
  orderNumber: string;
  buyerId: mongoose.Types.ObjectId;
  farmerId: mongoose.Types.ObjectId;

  totalAmount: number;
  farmerAmount: number;
  logisticsAmount: number;
  platformFee: number;

  // Computed at release time from priceBreakdown
  farmerPayoutAmount?: number;
  platformFeeAmount?: number;

  paymentState: ExtendedPaymentState;
  gatewayProvider: 'RAZORPAY_SANDBOX' | 'STRIPE_SANDBOX' | 'UPI_GATEWAY';

  // Razorpay-specific fields
  razorpayOrderId?: string;     // order_id from Razorpay (order_...)
  razorpayPaymentId?: string;   // payment_id from Razorpay after capture (pay_...)
  razorpayRefundId?: string;    // refund_id from Razorpay after refund (rfnd_...)
  razorpaySignature?: string;   // HMAC signature verified on backend

  paymentSignature?: string;
  rawGatewayResponse?: any;

  // Rich audit trail for UI timeline display
  escrowTimeline: IEscrowTimelineEntry[];

  // Legacy history array (kept for backward compatibility)
  history: {
    state: ExtendedPaymentState;
    timestamp: Date;
    note: string;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentTransactionDocument extends IPaymentRecord, Document {}

const EscrowTimelineEntrySchema = new Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
  triggeredBy: { type: String, default: 'system' }
});

const PaymentSchema: Schema = new Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true
    },
    orderNumber: { type: String, required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    totalAmount: { type: Number, required: true },
    farmerAmount: { type: Number, required: true },
    logisticsAmount: { type: Number, required: true },
    platformFee: { type: Number, required: true },

    farmerPayoutAmount: { type: Number, default: 0 },
    platformFeeAmount: { type: Number, default: 0 },

    paymentState: {
      type: String,
      enum: [
        'PENDING',
        'PAID',
        'HELD_FOR_ORDER',
        'RELEASE_PENDING',
        'RELEASED',
        'REFUND_PENDING',
        'REFUNDED',
        'FAILED'
      ],
      default: 'PENDING',
      index: true
    },
    gatewayProvider: {
      type: String,
      default: 'RAZORPAY_SANDBOX'
    },

    // Razorpay identifiers
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    razorpayRefundId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },

    paymentSignature: { type: String, default: '' },
    rawGatewayResponse: { type: Schema.Types.Mixed, default: {} },

    // Rich escrow timeline for UI display
    escrowTimeline: [EscrowTimelineEntrySchema],

    // Legacy history array (kept for backward compat)
    history: [
      {
        state: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: '' }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Payment = mongoose.model<PaymentTransactionDocument>('Payment', PaymentSchema);
