import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { scanService } from '../services/scanService.js';

export const scanController = {
  async createScan(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const { cropName, diseaseName, diseaseHindi, confidence, imageUrl, result, recommendations, recommendationsHindi } = req.body;
      if (!cropName || !diseaseName) {
        return res.status(400).json({ success: false, message: 'Crop name and disease name are required' });
      }

      const scan = scanService.createScan(req.user.id, {
        cropName,
        diseaseName,
        diseaseHindi: diseaseHindi || diseaseName,
        confidence: confidence || 95,
        imageUrl: imageUrl || '',
        result: result || 'Infected',
        recommendations: recommendations || [],
        recommendationsHindi: recommendationsHindi || []
      });

      return res.status(201).json({ success: true, scan });
    } catch (err) {
      console.error('Error creating crop scan:', err);
      return res.status(500).json({ success: false, message: 'Server error saving crop scan record' });
    }
  },

  async getFarmerScans(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const { total, scans } = scanService.getFarmerScans(req.user.id, page, limit);

      return res.status(200).json({
        success: true,
        total,
        page,
        limit,
        scans
      });
    } catch (err) {
      console.error('Error fetching crop scans:', err);
      return res.status(500).json({ success: false, message: 'Server error fetching crop scans' });
    }
  }
};
