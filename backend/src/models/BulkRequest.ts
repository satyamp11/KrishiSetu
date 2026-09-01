import mongoose, { Schema, Document } from 'mongoose';

export type BulkRequestStatus =
  | 'OPEN'
  | 'QUOTES_RECEIVED'
  | 'ACCEPTED'
  | 'FULFILLED'
  | 'CANCELLED';

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface IFarmerOffer extends Document {
  _id: mongoose.Types.ObjectId;
  requestId: mongoose.Types.ObjectId;
  farmerId: mongoose.Types.ObjectId;
  farmerName: string;
  fpoName?: string;
  farmerDistrict: string;
  farmerState: string;
  offeredQuantity: number;
  offeredPricePerUnit: number;
  totalOfferAmount: number;
  logisticsIncluded: boolean;
  notes?: string;
  status: OfferStatus;
  createdAt: Date;
}

export interface IBulkRequest extends Document {
  _id: mongoose.Types.ObjectId;
  requestNumber: string;
  buyerId: mongoose.Types.ObjectId;
  buyerName: string;
  organizationName: string;
  buyerPhone?: string;

  productTitle: string;
  category: string;
  targetQuantity: number;
  unit: string;
  deliveryCity: string;
  deliveryState: string;
  requiredByDate: Date;
  targetPricePerUnit?: number;
  
  status: BulkRequestStatus;
  matchingFarmers: {
    farmerId: mongoose.Types.ObjectId;
    farmerName: string;
    fpoName?: string;
    district: string;
    availableQty: number;
  }[];

  offers: IFarmerOffer[];

  acceptedOfferId?: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const FarmerOfferSchema = new Schema(
  {
    requestId: { type: Schema.Types.ObjectId, ref: 'BulkRequest', required: true, index: true },
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    farmerName: { type: String, required: true },
    fpoName: { type: String, default: '' },
    farmerDistrict: { type: String, default: 'Gorakhpur' },
    farmerState: { type: String, default: 'Uttar Pradesh' },

    offeredQuantity: { type: Number, required: true },
    offeredPricePerUnit: { type: Number, required: true },
    totalOfferAmount: { type: Number, required: true },
    logisticsIncluded: { type: Boolean, default: true },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' }
  },
  { timestamps: true }
);

const BulkRequestSchema = new Schema(
  {
    requestNumber: { type: String, required: true, unique: true },
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    buyerName: { type: String, required: true },
    organizationName: { type: String, default: 'Bulk Procurement Corp' },
    buyerPhone: { type: String, default: '+91 98765 00000' },

    productTitle: { type: String, required: true },
    category: { type: String, default: 'Vegetables' },
    targetQuantity: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    deliveryCity: { type: String, required: true },
    deliveryState: { type: String, required: true },
    requiredByDate: { type: Date, required: true },
    targetPricePerUnit: { type: Number },

    status: {
      type: String,
      enum: ['OPEN', 'QUOTES_RECEIVED', 'ACCEPTED', 'FULFILLED', 'CANCELLED'],
      default: 'OPEN',
      index: true
    },

    matchingFarmers: [
      {
        farmerId: { type: Schema.Types.ObjectId, ref: 'User' },
        farmerName: String,
        fpoName: String,
        district: String,
        availableQty: Number
      }
    ],

    offers: [FarmerOfferSchema],

    acceptedOfferId: { type: Schema.Types.ObjectId },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' }
  },
  { timestamps: true }
);

export const BulkRequest = mongoose.model<IBulkRequest>('BulkRequest', BulkRequestSchema);
