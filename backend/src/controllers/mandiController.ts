import { Request, Response } from 'express';
import { mandiService } from '../services/mandiService.js';

export const mandiController = {
  async getPrices(req: Request, res: Response) {
    try {
      const query = {
        state: req.query.state as string,
        district: req.query.district as string,
        mandi: req.query.mandi as string,
        commodity: req.query.commodity as string,
        category: req.query.category as string,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 25
      };

      const result = await mandiService.getMandiPrices(query);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching mandi prices:', error);
      return res.status(500).json({
        success: false,
        message: 'Unable to fetch current mandi prices. Please try again.'
      });
    }
  },

  getDistricts(req: Request, res: Response) {
    try {
      const state = req.query.state as string;
      const districts = mandiService.getDistricts(state);
      return res.status(200).json({
        success: true,
        districts
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Unable to fetch districts.'
      });
    }
  }
};
