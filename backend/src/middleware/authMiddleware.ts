import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';
import { UserResponse, UserRole } from '../models/User.js';

export interface AuthenticatedRequest extends Request {
  user?: UserResponse;
}

// 1. Authentication Middleware - Verifies Bearer JWT token & loads current session user
export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = authService.verifyToken(token);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token.'
      });
    }

    const userProfile = await authService.getUserProfile(decoded.userId);
    if (!userProfile) {
      return res.status(401).json({
        success: false,
        message: 'User account not found.'
      });
    }

    req.user = userProfile;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access.'
    });
  }
};

// Alias for existing routes compatibility
export const requireAuth = authenticateUser;

// 2. Role Authorization Middleware - Ensures req.user holds one of the required roles
export const authorizeRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before checking role authorizations.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${allowedRoles.join(', ')}] roles. Your role is '${req.user.role}'.`
      });
    }

    next();
  };
};
