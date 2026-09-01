import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterDTO, LoginDTO, UserResponse, UserRole } from '../models/User.js';
import { userService } from './userService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'krishi_shield_ai_secure_jwt_secret_2026_key_987654321';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface AuthResult {
  success: boolean;
  message?: string;
  token?: string;
  user?: UserResponse;
}

export const authService = {
  async register(dto: RegisterDTO): Promise<AuthResult> {
    // 1. Input Validation
    if (!dto.name || dto.name.trim().length < 2) {
      return { success: false, message: 'Full name must be at least 2 characters.' };
    }

    const contact = dto.email || dto.emailOrPhone;
    if (!contact || contact.trim().length < 5) {
      return { success: false, message: 'Valid email address or mobile number is required.' };
    }

    if (!dto.password || dto.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    // 2. Role Validation & Public Registration Protection
    const allowedPublicRoles: UserRole[] = ['farmer', 'consumer', 'bulk_buyer', 'delivery_partner'];
    if (dto.role === 'admin') {
      const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'KrishiSetuAdmin2026';
      if (!dto.adminSecretKey || dto.adminSecretKey !== ADMIN_SECRET) {
        return {
          success: false,
          message: 'Admin accounts cannot be registered publicly without authorization.'
        };
      }
    } else if (!dto.role || !allowedPublicRoles.includes(dto.role)) {
      return { success: false, message: 'Please select a valid platform role.' };
    }

    // 3. Role-specific validation
    if (dto.role === 'farmer') {
      if (!dto.state || dto.state === 'All') {
        return { success: false, message: 'Please select a valid State for Farmer profile.' };
      }
      if (!dto.district || dto.district === 'All') {
        return { success: false, message: 'Please select a valid District for Farmer profile.' };
      }
    } else if (dto.role === 'bulk_buyer') {
      if (!dto.businessInfo?.organizationName || dto.businessInfo.organizationName.trim().length < 2) {
        return { success: false, message: 'Organization / Company name is required for Bulk Buyer registration.' };
      }
    } else if (dto.role === 'delivery_partner') {
      if (!dto.vehicleInfo?.vehicleType) {
        return { success: false, message: 'Vehicle type is required for Delivery Partner registration.' };
      }
      if (!dto.vehicleInfo?.vehicleNumber || dto.vehicleInfo.vehicleNumber.trim().length < 4) {
        return { success: false, message: 'Valid Vehicle registration number is required.' };
      }
    } else if (dto.role === 'consumer') {
      if (!dto.deliveryAddress?.streetAddress && !dto.deliveryAddress?.city) {
        return { success: false, message: 'Delivery address is required for Consumer registration.' };
      }
    }

    // 4. Check for duplicate user
    const existingUser = await userService.findUserByEmailOrPhone(contact);
    if (existingUser) {
      return { success: false, message: 'An account with this email/mobile number already exists.' };
    }

    // 5. Hash password securely using bcryptjs
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // 6. Create User in MongoDB
    const newUser = await userService.createUser(dto, passwordHash);

    // 7. Generate JWT Token with embedded userId and role
    const token = jwt.sign(
      {
        userId: newUser._id.toString(),
        id: newUser._id.toString(),
        role: newUser.role,
        email: newUser.email
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    return {
      success: true,
      token,
      user: userService.toUserResponse(newUser)
    };
  },

  async login(dto: LoginDTO): Promise<AuthResult> {
    const contact = dto.email || dto.emailOrPhone;
    if (!contact || !dto.password) {
      return { success: false, message: 'Email/mobile and password are required.' };
    }

    const user = await userService.findUserByEmailOrPhone(contact);
    if (!user) {
      return { success: false, message: 'Invalid credentials. User account not found.' };
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash || '');
    if (!isMatch) {
      return { success: false, message: 'Invalid credentials. Password incorrect.' };
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        id: user._id.toString(),
        role: user.role,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    return {
      success: true,
      token,
      user: userService.toUserResponse(user)
    };
  },

  verifyToken(token: string): { userId: string; id: string; role: UserRole; email?: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const userId = decoded.userId || decoded.id;
      if (!userId) return null;
      return {
        userId,
        id: userId,
        role: decoded.role || 'farmer',
        email: decoded.email
      };
    } catch (err) {
      return null;
    }
  },

  async getUserProfile(id: string): Promise<UserResponse | null> {
    const user = await userService.findUserById(id);
    if (!user) return null;
    return userService.toUserResponse(user);
  }
};
