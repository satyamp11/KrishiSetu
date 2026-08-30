import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterDTO, LoginDTO, UserResponse } from '../models/User.js';
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
    // 1. Validation
    if (!dto.name || dto.name.trim().length < 2) {
      return { success: false, message: 'Full name must be at least 2 characters.' };
    }

    if (!dto.emailOrPhone || dto.emailOrPhone.trim().length < 5) {
      return { success: false, message: 'Valid email address or 10-digit mobile number is required.' };
    }

    if (!dto.password || dto.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    if (!dto.state || dto.state === 'All') {
      return { success: false, message: 'Please select a valid Indian State.' };
    }

    if (!dto.district || dto.district === 'All') {
      return { success: false, message: 'Please select a valid District.' };
    }

    // 2. Check for duplicate account
    const existing = userService.findUserByEmailOrPhone(dto.emailOrPhone);
    if (existing) {
      return { success: false, message: 'An account with this email/mobile number already exists.' };
    }

    // 3. Hash password using bcryptjs
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // 4. Create User
    const newUser = userService.createUser(dto, passwordHash);

    // 5. Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, emailOrPhone: newUser.emailOrPhone },
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
    if (!dto.emailOrPhone || !dto.password) {
      return { success: false, message: 'Email/mobile and password are required.' };
    }

    const user = userService.findUserByEmailOrPhone(dto.emailOrPhone);
    if (!user) {
      return { success: false, message: 'Invalid credentials. User account not found.' };
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      return { success: false, message: 'Invalid credentials. Password incorrect.' };
    }

    const token = jwt.sign(
      { id: user.id, emailOrPhone: user.emailOrPhone },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    return {
      success: true,
      token,
      user: userService.toUserResponse(user)
    };
  },

  verifyToken(token: string): { id: string; emailOrPhone: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; emailOrPhone: string };
      return decoded;
    } catch (err) {
      return null;
    }
  },

  getUserProfile(id: string): UserResponse | null {
    const user = userService.findUserById(id);
    if (!user) return null;
    return userService.toUserResponse(user);
  }
};
