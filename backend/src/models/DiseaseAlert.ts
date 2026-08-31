import mongoose, { Schema, Document } from 'mongoose';

export interface IDiseaseAlert extends Document {
  userId?: mongoose.Types.ObjectId | string;
  cropName: string;
  diseaseName: string;
  diseaseHindi?: string;
  confidence?: number;
  latitude?: number;
  longitude?: number;
  district: string;
  state: string;
  reportedAt: Date;
  severity: 'Low' | 'Warning' | 'High' | 'Critical';
  status: 'active' | 'resolved' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const DiseaseAlertSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    district: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    state: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    reportedAt: {
      type: Date,
      default: Date.now
    },
    severity: {
      type: String,
      enum: ['Low', 'Warning', 'High', 'Critical'],
      default: 'Warning'
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'pending'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

export const DiseaseAlert = mongoose.model<IDiseaseAlert>('DiseaseAlert', DiseaseAlertSchema);
