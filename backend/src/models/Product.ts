import mongoose, { Schema, Document } from 'mongoose';

export type ProductCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Pulses'
  | 'Spices'
  | 'Dairy'
  | 'Organic Products'
  | 'Seeds'
  | 'Fertilizers'
  | 'Farm Equipment';

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  category: ProductCategory;
  price: number; // Price per unit
  unit: string; // kg, Quintal, Ton, Liter, Piece, Packet, etc.
  mandiBenchmarkPrice?: number; // Optional APMC Mandi benchmark price
  availableQuantity: number; // Current stock available
  minOrderQuantity: number; // Minimum order quantity
  description?: string;
  imageUrl: string;
  
  // Supplier / Farmer Information
  farmerId: mongoose.Types.ObjectId;
  farmerName: string;
  fpoName?: string;
  isVerifiedFPO: boolean;
  isOrganicCertified: boolean;
  location: {
    village?: string;
    district: string;
    state: string;
  };
  
  rating: number; // e.g. 4.8
  reviewCount: number;
  harvestDate?: Date;
  status: 'available' | 'sold_out' | 'unlisted';

  createdAt: Date;
  updatedAt: Date;
}

export interface ProductResponse {
  id: string;
  title: string;
  category: ProductCategory;
  price: number;
  unit: string;
  mandiBenchmarkPrice?: number;
  availableQuantity: number;
  minOrderQuantity: number;
  description?: string;
  imageUrl: string;
  
  farmerId: string;
  farmerName: string;
  fpoName?: string;
  isVerifiedFPO: boolean;
  isOrganicCertified: boolean;
  location: {
    village?: string;
    district: string;
    state: string;
  };
  
  rating: number;
  reviewCount: number;
  harvestDate?: string;
  status: 'available' | 'sold_out' | 'unlisted';

  createdAt: string;
}

export interface CreateProductDTO {
  title: string;
  category: ProductCategory;
  price: number;
  unit: string;
  mandiBenchmarkPrice?: number;
  availableQuantity: number;
  minOrderQuantity?: number;
  description?: string;
  imageUrl?: string;
  fpoName?: string;
  isVerifiedFPO?: boolean;
  isOrganicCertified?: boolean;
  village?: string;
  district?: string;
  state?: string;
  harvestDate?: string;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  status?: 'available' | 'sold_out' | 'unlisted';
}

const ProductSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      minlength: [2, 'Product title must be at least 2 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Vegetables',
        'Fruits',
        'Grains',
        'Pulses',
        'Spices',
        'Dairy',
        'Organic Products',
        'Seeds',
        'Fertilizers',
        'Farm Equipment'
      ],
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    unit: {
      type: String,
      required: [true, 'Unit (e.g. kg, Quintal) is required'],
      trim: true,
      default: 'kg'
    },
    mandiBenchmarkPrice: {
      type: Number,
      default: 0
    },
    availableQuantity: {
      type: Number,
      required: [true, 'Available quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 100
    },
    minOrderQuantity: {
      type: Number,
      default: 1,
      min: [1, 'Min order quantity must be at least 1']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80'
    },
    
    // Supplier / Farmer References
    farmerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    farmerName: {
      type: String,
      required: true,
      trim: true
    },
    fpoName: {
      type: String,
      default: '',
      trim: true
    },
    isVerifiedFPO: {
      type: Boolean,
      default: false
    },
    isOrganicCertified: {
      type: Boolean,
      default: false
    },
    location: {
      village: { type: String, default: '' },
      district: { type: String, required: true, default: 'Gorakhpur' },
      state: { type: String, required: true, default: 'Uttar Pradesh' }
    },
    
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 12
    },
    harvestDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['available', 'sold_out', 'unlisted'],
      default: 'available',
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
