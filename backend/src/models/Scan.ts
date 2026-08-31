import mongoose, { Schema, Document } from 'mongoose';

export interface IScan extends Document {
  userId: mongoose.Types.ObjectId | string;
  cropName: string;
  diseaseName: string;
  diseaseHindi?: string;
  confidence: number;
  imageUrl?: string;
  severity?: string;
  symptoms?: string[];
  precautions?: string[];
  treatment?: string[];
  location?: {
    village?: string;
    district?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ScanSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    cropName: {
      type: String,
      required: true,
      trim: true
    },
    diseaseName: {
      type: String,
      required: true,
      trim: true
    },
    diseaseHindi: {
      type: String,
      trim: true,
      default: ''
    },
    confidence: {
      type: Number,
      default: 0
    },
    imageUrl: {
      type: String,
      default: ''
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    symptoms: {
      type: [String],
      default: []
    },
    precautions: {
      type: [String],
      default: []
    },
    treatment: {
      type: [String],
      default: []
    },
    location: {
      village: { type: String, default: '' },
      district: { type: String, default: '' },
      state: { type: String, default: '' },
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  {
    timestamps: true
  }
);

export const Scan = mongoose.model<IScan>('Scan', ScanSchema);
