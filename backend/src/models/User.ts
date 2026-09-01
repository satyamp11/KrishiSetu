import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'farmer' | 'consumer' | 'bulk_buyer' | 'delivery_partner' | 'admin';

export interface FarmInfo {
  fpoName?: string;
  fpoRegistrationNumber?: string;
  landSizeAcres?: number;
  primaryCrop?: string;
  organicCertified?: boolean;
}

export interface DeliveryAddress {
  streetAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
}

export interface BusinessInfo {
  organizationName?: string;
  gstin?: string;
  businessType?: 'Wholesaler' | 'Retailer' | 'Processor' | 'Hotel/Restaurant' | 'Exporter' | 'Other';
  annualVolumeEstimate?: string;
}

export interface VehicleInfo {
  vehicleType?: 'TwoWheeler' | 'MiniTruck' | 'HeavyTruck' | 'RefrigeratedVan';
  vehicleNumber?: string;
  licenseNumber?: string;
  operatingDistrict?: string;
  maxCapacityKg?: number;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  emailOrPhone: string;
  passwordHash?: string;
  role: UserRole;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  state: string;
  district: string;
  village?: string;
  primaryCrop?: string;
  profileImage?: string;
  
  // Role specific metadata
  farmInfo?: FarmInfo;
  deliveryAddress?: DeliveryAddress;
  businessInfo?: BusinessInfo;
  vehicleInfo?: VehicleInfo;

  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  emailOrPhone: string;
  role: UserRole;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  state: string;
  district: string;
  village?: string;
  primaryCrop?: string;
  profileImage?: string;
  
  farmInfo?: FarmInfo;
  deliveryAddress?: DeliveryAddress;
  businessInfo?: BusinessInfo;
  vehicleInfo?: VehicleInfo;

  createdAt: string;
}

export interface RegisterDTO {
  name: string;
  email?: string;
  emailOrPhone?: string;
  phone?: string;
  password?: string;
  role: UserRole;
  state?: string;
  district?: string;
  village?: string;
  primaryCrop?: string;
  profileImage?: string;
  adminSecretKey?: string; // Only required if trying to register as admin

  // Role specific payload
  farmInfo?: FarmInfo;
  deliveryAddress?: DeliveryAddress;
  businessInfo?: BusinessInfo;
  vehicleInfo?: VehicleInfo;
}

export interface LoginDTO {
  emailOrPhone?: string;
  email?: string;
  password?: string;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Email or primary contact identifier is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    emailOrPhone: {
      type: String,
      trim: true,
      lowercase: true,
      index: true
    },
    passwordHash: {
      type: String,
      default: '',
      select: false
    },
    role: {
      type: String,
      enum: ['farmer', 'consumer', 'bulk_buyer', 'delivery_partner', 'admin'],
      default: 'farmer',
      required: true,
      index: true
    },
    phoneVerified: {
      type: Boolean,
      default: false
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    state: {
      type: String,
      default: 'Uttar Pradesh',
      trim: true
    },
    district: {
      type: String,
      default: 'Gorakhpur',
      trim: true
    },
    village: {
      type: String,
      trim: true,
      default: ''
    },
    primaryCrop: {
      type: String,
      trim: true,
      default: ''
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    
    // Role metadata embedded schema definitions
    farmInfo: {
      fpoName: { type: String, default: '' },
      fpoRegistrationNumber: { type: String, default: '' },
      landSizeAcres: { type: Number, default: 0 },
      primaryCrop: { type: String, default: '' },
      organicCertified: { type: Boolean, default: false }
    },
    deliveryAddress: {
      streetAddress: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      landmark: { type: String, default: '' }
    },
    businessInfo: {
      organizationName: { type: String, default: '' },
      gstin: { type: String, default: '' },
      businessType: { type: String, default: 'Wholesaler' },
      annualVolumeEstimate: { type: String, default: '' }
    },
    vehicleInfo: {
      vehicleType: { type: String, default: 'MiniTruck' },
      vehicleNumber: { type: String, default: '' },
      licenseNumber: { type: String, default: '' },
      operatingDistrict: { type: String, default: '' },
      maxCapacityKg: { type: Number, default: 1000 }
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to ensure emailOrPhone is always populated
UserSchema.pre('save', function (this: any) {
  if (!this.emailOrPhone) {
    this.emailOrPhone = this.email || this.phone || '';
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);
