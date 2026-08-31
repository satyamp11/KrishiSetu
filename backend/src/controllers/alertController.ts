import { Request, Response } from 'express';
import { alertService } from '../services/alertService.js';

export const alertController = {
  async getAlerts(req: Request, res: Response) {
    try {
      const state = req.query.state as string;
      const district = req.query.district as string;
      const crop = req.query.crop as string;

      const alerts = await alertService.getRelevantAlerts(state, district, crop);
      return res.status(200).json({
        success: true,
        count: alerts.length,
        alerts
      });
    } catch (err) {
      console.error('Error fetching community alerts:', err);
      return res.status(500).json({ success: false, message: 'Server error fetching alerts' });
    }
  }
};
