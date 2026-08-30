import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';
import { UserResponse } from '../models/User.js';

export interface AuthenticatedRequest extends Request {
  user?: UserResponse;
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token.'
      });
    }

    const userProfile = authService.getUserProfile(decoded.id);
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
