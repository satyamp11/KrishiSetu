import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserResponse, UserRole } from '../models/User.js';
import { authService } from '../services/authService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'krishi_shield_ai_secure_jwt_secret_2026_key_987654321';

export interface AuthenticatedRequest extends Request {
  user?: UserResponse;
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (!decoded || (!decoded.userId && !decoded.id)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token.'
      });
    }

    const userId = decoded.userId || decoded.id;
    const authResult = await authService.getProfile(userId);

    if (!authResult.success || !authResult.user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found.'
      });
    }

    req.user = authResult.user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access.'
    });
  }
};

export const requireAuth = authenticateUser;

export const authorizeRole = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to ${roles.join(', ')} role(s). Your role is ${req.user.role}.`
      });
    }

    next();
  };
};
