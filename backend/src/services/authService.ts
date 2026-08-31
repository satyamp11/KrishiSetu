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

    if (!dto.state || dto.state === 'All') {
      return { success: false, message: 'Please select a valid Indian State.' };
    }

    if (!dto.district || dto.district === 'All') {
      return { success: false, message: 'Please select a valid District.' };
    }

    // 2. Check for duplicate user
    const existingUser = await userService.findUserByEmailOrPhone(contact);
    if (existingUser) {
      return { success: false, message: 'An account with this email/mobile number already exists.' };
    }

    // 3. Hash password using bcryptjs
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // 4. Create User in MongoDB
    const newUser = await userService.createUser(dto, passwordHash);

    // 5. Generate JWT Token (payload: userId)
    const token = jwt.sign(
      { userId: newUser._id.toString(), id: newUser._id.toString(), email: newUser.email },
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
      { userId: user._id.toString(), id: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    return {
      success: true,
      token,
      user: userService.toUserResponse(user)
    };
  },

  verifyToken(token: string): { userId: string; id: string; email?: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const userId = decoded.userId || decoded.id;
      if (!userId) return null;
      return { userId, id: userId, email: decoded.email };
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
