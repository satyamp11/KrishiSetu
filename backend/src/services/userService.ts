import mongoose from 'mongoose';
import { User, IUser, UserResponse, RegisterDTO } from '../models/User.js';

export const userService = {
  async findUserByEmailOrPhone(queryInput: string): Promise<IUser | null> {
    if (!queryInput) return null;
    const q = queryInput.trim().toLowerCase();
    try {
      return await User.findOne({
        $or: [
          { email: q },
          { emailOrPhone: q },
          { phone: q }
        ]
      }).select('+passwordHash');
    } catch (err) {
      console.error('Error finding user by email or phone:', err);
      return null;
    }
  },

  async findUserById(id: string): Promise<IUser | null> {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    try {
      return await User.findById(id);
    } catch (err) {
      console.error('Error finding user by ID:', err);
      return null;
    }
  },

  async createUser(dto: RegisterDTO, passwordHash: string): Promise<IUser> {
    const rawContact = (dto.email || dto.emailOrPhone || '').trim().toLowerCase();
    const phoneVal = dto.phone || (/^\d{10}$/.test(rawContact) ? rawContact : '');
    const emailVal = dto.email || (!/^\d{10}$/.test(rawContact) ? rawContact : `${rawContact}@krishisetu.agri`);

    const newUser = new User({
      name: dto.name.trim(),
      email: emailVal,
      phone: phoneVal,
      emailOrPhone: rawContact,
      passwordHash: passwordHash,
      role: dto.role || 'farmer',
      state: dto.state?.trim() || 'Uttar Pradesh',
      district: dto.district?.trim() || 'Gorakhpur',
      village: dto.village?.trim() || '',
      primaryCrop: dto.primaryCrop?.trim() || '',
      profileImage: dto.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      farmInfo: dto.farmInfo || {},
      deliveryAddress: dto.deliveryAddress || {},
      businessInfo: dto.businessInfo || {},
      vehicleInfo: dto.vehicleInfo || {}
    });

    return await newUser.save();
  },

  async updateUserProfile(id: string, updates: Partial<RegisterDTO>): Promise<IUser | null> {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    try {
      return await User.findByIdAndUpdate(
        id,
        { $set: updates },
        { returnDocument: 'after', runValidators: true }
      );
    } catch (err) {
      console.error('Error updating user profile:', err);
      return null;
    }
  },

  toUserResponse(user: IUser): UserResponse {
    return {
      id: user._id ? user._id.toString() : '',
      name: user.name,
      email: user.email || user.emailOrPhone,
      phone: user.phone || '',
      emailOrPhone: user.emailOrPhone || user.email,
      role: user.role || 'farmer',
      phoneVerified: !!user.phoneVerified,
      emailVerified: !!user.emailVerified,
      state: user.state,
      district: user.district,
      village: user.village || '',
      primaryCrop: user.primaryCrop || '',
      profileImage: user.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      farmInfo: user.farmInfo,
      deliveryAddress: user.deliveryAddress,
      businessInfo: user.businessInfo,
      vehicleInfo: user.vehicleInfo,
      createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString()
    };
  }
};
