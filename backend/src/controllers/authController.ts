import { Response } from 'express';
import { authService } from '../services/authService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const authController = {
  async register(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await authService.register(req.body);
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.status(201).json(result);
    } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({
        success: false,
        message: 'An unexpected server error occurred during registration.'
      });
    }
  },

  async login(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await authService.login(req.body);
      if (!result.success) {
        return res.status(401).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({
        success: false,
        message: 'An unexpected server error occurred during login.'
      });
    }
  },

  async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized request.'
        });
      }
      return res.status(200).json({
        success: true,
        user: req.user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Unable to fetch user profile.'
      });
    }
  },

  async logout(_req: AuthenticatedRequest, res: Response) {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  }
};
