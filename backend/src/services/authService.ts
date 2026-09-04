import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, IUser, RegisterDTO, LoginDTO, UserResponse } from '../models/User.js';
import { userService } from './userService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'NovaKrishiDefaultSecretKey2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface AuthResult {
  success: boolean;
  message?: string;
  token?: string;
  user?: UserResponse;
}

export const authService = {
  async register(dto: RegisterDTO): Promise<AuthResult> {
    const contact = dto.email || dto.emailOrPhone;

    if (!dto.name || !contact || !dto.password || !dto.role) {
      return { success: false, message: 'Name, email/phone, password, and role are required.' };
    }

    if (dto.role === 'admin') {
      const expectedAdminKey = process.env.ADMIN_REGISTRATION_SECRET || 'NovaKrishiAdmin2026';
      if (dto.adminSecretKey !== expectedAdminKey) {
        return { success: false, message: 'Forbidden: Invalid Admin Secret Registration Key.' };
      }
    }

    const existingUser = await userService.findUserByEmailOrPhone(contact);
    if (existingUser) {
      return { success: false, message: 'An account with this email/mobile number already exists.' };
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const createdUser = await userService.createUser({ ...dto, password: passwordHash });

    const token = jwt.sign(
      {
        userId: createdUser.id,
        id: createdUser.id,
        role: createdUser.role,
        email: createdUser.email
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    return {
      success: true,
      token,
      user: createdUser
    };
  },

  async login(dto: LoginDTO): Promise<AuthResult> {
    const contact = dto.email || dto.emailOrPhone;
    if (!contact || !dto.password) {
      return { success: false, message: 'Email/mobile and password are required.' };
    }

    const user = await userService.findUserByEmailOrPhone(contact);
    if (!user || !user.passwordHash) {
      return { success: false, message: 'Invalid credentials.' };
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      return { success: false, message: 'Invalid credentials.' };
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

  async getProfile(userId: string): Promise<AuthResult> {
    const user = await userService.findUserById(userId);
    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    return {
      success: true,
      user: userService.toUserResponse(user)
    };
  }
};
