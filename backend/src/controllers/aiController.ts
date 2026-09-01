import { Request, Response } from 'express';
import { aiDemandForecastService } from '../services/aiDemandForecastService.js';
import { aiRouteOptimizationService } from '../services/aiRouteOptimizationService.js';

export const aiController = {
  // GET /api/ai/demand-forecast
  async getDemandForecast(req: Request, res: Response) {
    try {
      const crop = req.query.crop as string;
      const state = (req.query.state as string) || 'Uttar Pradesh';
      const district = (req.query.district as string) || 'Gorakhpur';

      const forecastData = await aiDemandForecastService.getDemandForecast(crop, state, district);
      return res.status(200).json(forecastData);
    } catch (error) {
      console.error('Error in getDemandForecast controller:', error);
      return res.status(500).json({
        success: false,
        message: 'Unable to fetch AI demand forecast.'
      });
    }
  },

  // POST /api/ai/optimize-route
  async optimizeRoute(req: Request, res: Response) {
    try {
      const result = await aiRouteOptimizationService.optimizeRoute(req.body);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in optimizeRoute controller:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Unable to optimize route.'
      });
    }
  }
};
