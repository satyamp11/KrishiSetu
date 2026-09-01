import mongoose, { Schema, Document } from 'mongoose';
import { ExtendedPaymentState } from './Payment.js';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  title: string;
  category: string;
  imageUrl: string;
  unit: string;
  pricePerUnit: number;
  quantity: number;
  subtotal: number;
}

export interface IPriceBreakdown {
  consumerTotal: number;
  farmerEarnings: number;
  logisticsCost: number;
  platformFee: number;
  intermediarySavings: number; // APMC middleman commission saved
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  
  // Buyer Details
  buyerId: mongoose.Types.ObjectId;
  buyerName: string;
  buyerEmailOrPhone: string;
  buyerRole: string;

  // Seller / Farmer Details
  sellerId: mongoose.Types.ObjectId;
  sellerName: string;
  fpoName?: string;
  sellerDistrict: string;
  sellerState: string;

  // Items & Amounts (Computed on Backend)
  items: IOrderItem[];
  subtotalAmount: number;
  logisticsFee: number;
  totalAmount: number;

  // Dynamic Price Breakdown Architecture
  priceBreakdown: IPriceBreakdown;

  // Delivery & Payment Details
  deliveryAddress: {
    streetAddress: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  paymentStatus: ExtendedPaymentState;
  paymentMethod: 'ESCROW' | 'UPI' | 'COD' | 'BANK_TRANSFER';
  
  orderStatus: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    updatedAt: Date;
    note?: string;
  }[];

  paymentHistory: {
    state: ExtendedPaymentState;
    transactionId?: string;
    timestamp: Date;
    note?: string;
  }[];

  deliveryPartnerId?: mongoose.Types.ObjectId;
  deliveryPartnerName?: string;
  expectedDeliveryDate?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'Produce' },
  imageUrl: { type: String, default: '' },
  unit: { type: String, required: true, default: 'kg' },
  pricePerUnit: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true }
});

const PriceBreakdownSchema = new Schema({
  consumerTotal: { type: Number, required: true },
  farmerEarnings: { type: Number, required: true },
  logisticsCost: { type: Number, required: true },
  platformFee: { type: Number, required: true },
  intermediarySavings: { type: Number, required: true }
});

const OrderSchema: Schema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    buyerName: { type: String, required: true },
    buyerEmailOrPhone: { type: String, required: true },
    buyerRole: { type: String, required: true, default: 'consumer' },

    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    sellerName: { type: String, required: true },
    fpoName: { type: String, default: '' },
    sellerDistrict: { type: String, default: 'Gorakhpur' },
    sellerState: { type: String, default: 'Uttar Pradesh' },

    items: [OrderItemSchema],
    subtotalAmount: { type: Number, required: true },
    logisticsFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    priceBreakdown: {
      type: PriceBreakdownSchema,
      required: true
    },

    deliveryAddress: {
      streetAddress: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: { type: String, default: '' }
    },

    paymentStatus: {
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
      default: 'HELD_FOR_ORDER',
      index: true
    },
    paymentMethod: {
      type: String,
      enum: ['ESCROW', 'UPI', 'COD', 'BANK_TRANSFER'],
      default: 'ESCROW'
    },

    orderStatus: {
      type: String,
      enum: [
        'PENDING',
        'CONFIRMED',
        'PACKED',
        'PICKED_UP',
        'IN_TRANSIT',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED'
      ],
      default: 'PENDING',
      index: true
    },

    statusHistory: [
      {
        status: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now },
        note: { type: String, default: '' }
      }
    ],

    paymentHistory: [
      {
        state: { type: String, required: true },
        transactionId: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: '' }
      }
    ],

    deliveryPartnerId: { type: Schema.Types.ObjectId, ref: 'User' },
    deliveryPartnerName: { type: String, default: '' },
    expectedDeliveryDate: { type: Date }
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
