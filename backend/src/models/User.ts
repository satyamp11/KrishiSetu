import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  emailOrPhone: string;
  passwordHash?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  state: string;
  district: string;
  village?: string;
  primaryCrop?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  emailOrPhone: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  state: string;
  district: string;
  village?: string;
  primaryCrop?: string;
  profileImage?: string;
  createdAt: string;
}

export interface RegisterDTO {
  name: string;
  email?: string;
  emailOrPhone?: string;
  phone?: string;
  password?: string;
  state: string;
  district: string;
  village?: string;
  primaryCrop?: string;
  profileImage?: string;
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
