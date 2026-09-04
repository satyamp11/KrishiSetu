import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Otp } from '../models/Otp.js';
import { User, IUser, UserResponse } from '../models/User.js';
import { userService } from './userService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'novakrishi_ai_secure_jwt_secret_2026_key_987654321';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface OtpResult {
  success: boolean;
  message?: string;
  token?: string;
  user?: UserResponse;
}

export const otpService = {
  // Normalize Email or Mobile Identifier
  normalizeIdentifier(rawIdentifier: string): string {
    if (!rawIdentifier) return '';
    const trimmed = rawIdentifier.trim().toLowerCase();
    if (trimmed.includes('@')) {
      return trimmed;
    }
    // Clean phone number (strip non-digits)
    const digitsOnly = trimmed.replace(/\D/g, '');
    if (digitsOnly.length === 10) {
      return digitsOnly;
    }
    if (digitsOnly.length > 10 && digitsOnly.startsWith('91')) {
      return digitsOnly.slice(-10);
    }
    return digitsOnly || trimmed;
  },

  // Validate Email or Mobile Format
  validateIdentifier(identifier: string): { isValid: boolean; isEmail: boolean; isPhone: boolean } {
    if (!identifier) return { isValid: false, isEmail: false, isPhone: false };
    
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isPhone = /^\d{10}$/.test(identifier);

    return {
      isValid: isEmail || isPhone,
      isEmail,
      isPhone
    };
  },

  // Send OTP
  async sendOtp(rawIdentifier: string): Promise<OtpResult> {
    const normalized = this.normalizeIdentifier(rawIdentifier);
    const validation = this.validateIdentifier(normalized);

    if (!validation.isValid) {
      return {
        success: false,
        message: 'Please enter a valid 10-digit mobile number or email address.'
      };
    }

    // 1. Rate Limiting Cooldown Check (minimum 45 seconds between requests)
    const existingOtp = await Otp.findOne({ identifier: normalized, verified: false }).sort({ createdAt: -1 });
    if (existingOtp) {
      const timeSinceLastRequest = (Date.now() - new Date(existingOtp.createdAt).getTime()) / 1000;
      if (timeSinceLastRequest < 45) {
        const waitTime = Math.ceil(45 - timeSinceLastRequest);
        return {
          success: false,
          message: `Please wait ${waitTime} seconds before requesting a new OTP.`
        };
      }
    }

    // 2. Maximum requests in last 15 minutes check (Max 5 OTPs per 15 min)
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recentOtpCount = await Otp.countDocuments({
      identifier: normalized,
      createdAt: { $gte: fifteenMinsAgo }
    });

    if (recentOtpCount >= 5) {
      return {
        success: false,
        message: 'Too many OTP requests for this number/email. Please try again after 15 minutes.'
      };
    }

    // 3. Invalidate/Delete previous unverified OTP records for this identifier
    await Otp.deleteMany({ identifier: normalized });

    // 4. Generate Cryptographically Secure 6-Digit OTP
    const otpCode = crypto.randomInt(100000, 1000000).toString();

    // 5. Hash OTP before saving to MongoDB
    const otpHash = await bcrypt.hash(otpCode, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    const newOtp = new Otp({
      identifier: normalized,
      otpHash,
      expiresAt,
      attempts: 0,
      verified: false
    });

    await newOtp.save();

    // 6. DEVELOPMENT MODE: Always log OTP to console so you can test even if telecom blocks the SMS
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n======================================================');
      console.log(`🔑 [DEV OTP] OTP generated for ${normalized}: ${otpCode}`);
      console.log('⏰ Valid for 5 minutes (Expires at:', expiresAt.toLocaleTimeString(), ')');
      console.log('======================================================\n');
    }

    // 7. PRODUCTION SMS / EMAIL INTEGRATION PLACEHOLDER
    // Plug in your Indian SMS provider (Fast2SMS/MSG91) here when ready for production
    if (validation.isPhone) {
      // e.g. await fast2sms.send({ to: normalized, message: `OTP is ${otpCode}` });
    } else {
      // e.g. await emailService.sendOtpEmail(normalized, otpCode);
    }

    return {
      success: true,
      message: validation.isPhone
        ? 'OTP sent successfully to your mobile number.'
        : 'OTP sent successfully to your email address.'
    };
  },

  // Verify OTP & Authenticate/Register User
  async verifyOtp(
    rawIdentifier: string,
    otpInput: string,
    registrationDetails?: {
      name?: string;
      state?: string;
      district?: string;
      village?: string;
      primaryCrop?: string;
    }
  ): Promise<OtpResult> {
    if (!otpInput || otpInput.trim().length !== 6 || !/^\d{6}$/.test(otpInput.trim())) {
      return {
        success: false,
        message: 'Please enter a valid 6-digit OTP code.'
      };
    }

    const normalized = this.normalizeIdentifier(rawIdentifier);
    const validation = this.validateIdentifier(normalized);

    if (!validation.isValid) {
      return {
        success: false,
        message: 'Invalid mobile number or email address.'
      };
    }

    // 1. Find active OTP document for normalized identifier
    const otpDoc = await Otp.findOne({ identifier: normalized, verified: false });
    if (!otpDoc) {
      return {
        success: false,
        message: 'OTP expired or not found. Please request a new OTP.'
      };
    }

    // 2. Check if expired
    if (new Date() > new Date(otpDoc.expiresAt)) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return {
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      };
    }

    // 3. Check max attempts (Max 5 attempts)
    if (otpDoc.attempts >= 5) {
      await Otp.deleteOne({ _id: otpDoc._id });
      return {
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new OTP.'
      };
    }

    // 4. Compare entered OTP with stored hash
    const isMatch = await bcrypt.compare(otpInput.trim(), otpDoc.otpHash);

    if (!isMatch) {
      otpDoc.attempts += 1;
      await otpDoc.save();

      const remainingAttempts = 5 - otpDoc.attempts;
      if (remainingAttempts <= 0) {
        await Otp.deleteOne({ _id: otpDoc._id });
        return {
          success: false,
          message: 'Maximum verification attempts exceeded. Please request a new OTP.'
        };
      }

      return {
        success: false,
        message: `Invalid OTP code. ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.`
      };
    }

    // 5. OTP verified successfully -> Delete OTP record to prevent re-use
    await Otp.deleteOne({ _id: otpDoc._id });

    // 6. Find or Create User in MongoDB
    let user = await User.findOne({
      $or: [
        { email: normalized },
        { phone: normalized },
        { emailOrPhone: normalized }
      ]
    });

    if (user) {
      // Update verification flags & profile fields if supplied
      if (validation.isEmail) user.emailVerified = true;
      if (validation.isPhone) user.phoneVerified = true;

      if (registrationDetails?.name && registrationDetails.name.trim().length >= 2) {
        user.name = registrationDetails.name.trim();
      }
      if (registrationDetails?.state && registrationDetails.state !== 'All') {
        user.state = registrationDetails.state.trim();
      }
      if (registrationDetails?.district && registrationDetails.district !== 'All') {
        user.district = registrationDetails.district.trim();
      }
      if (registrationDetails?.village) {
        user.village = registrationDetails.village.trim();
      }
      if (registrationDetails?.primaryCrop) {
        user.primaryCrop = registrationDetails.primaryCrop.trim();
      }

      await user.save();
    } else {
      // Create new Farmer User in MongoDB
      const defaultName = registrationDetails?.name?.trim() || (validation.isPhone ? `Farmer ${normalized.slice(-4)}` : normalized.split('@')[0]);
      const emailVal = validation.isEmail ? normalized : `${normalized}@novakrishi.farmer`;
      const phoneVal = validation.isPhone ? normalized : '';

      user = new User({
        name: defaultName,
        email: emailVal,
        phone: phoneVal,
        emailOrPhone: normalized,
        phoneVerified: validation.isPhone,
        emailVerified: validation.isEmail,
        state: registrationDetails?.state?.trim() || 'Uttar Pradesh',
        district: registrationDetails?.district?.trim() || 'Gorakhpur',
        village: registrationDetails?.village?.trim() || '',
        primaryCrop: registrationDetails?.primaryCrop?.trim() || '',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
      });

      await user.save();
    }

    // 7. Generate JWT Token (payload: userId)
    const token = jwt.sign(
      { userId: user._id.toString(), id: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    return {
      success: true,
      message: 'OTP verified successfully.',
      token,
      user: userService.toUserResponse(user)
    };
  }
};
