import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { userService } from '../services/userService.js';

export const userController = {
  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized access.'
        });
      }
      return res.status(200).json({
        success: true,
        user: req.user
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user profile.'
      });
    }
  },

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized access.'
        });
      }

      const { name, phone, state, district, village, primaryCrop, profileImage } = req.body;

      const updatedUser = await userService.updateUserProfile(req.user.id, {
        name,
        phone,
        state,
        district,
        village,
        primaryCrop,
        profileImage
      });

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User profile not found or update failed.'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        user: userService.toUserResponse(updatedUser)
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating the profile.'
      });
    }
  }
};
