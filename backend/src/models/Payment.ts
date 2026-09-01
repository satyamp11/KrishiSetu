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
  
  paymentState: ExtendedPaymentState;
  gatewayProvider: 'RAZORPAY_SANDBOX' | 'STRIPE_SANDBOX' | 'UPI_GATEWAY';
  paymentSignature?: string;
  rawGatewayResponse?: any;
  
  history: {
    state: ExtendedPaymentState;
    timestamp: Date;
    note: string;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentTransactionDocument extends IPaymentRecord, Document {}

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
    paymentSignature: { type: String, default: '' },
    rawGatewayResponse: { type: Schema.Types.Mixed, default: {} },

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
