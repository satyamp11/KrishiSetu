import { Request, Response } from 'express';
import { mandiService } from '../services/mandiService.js';

export const getMarketRates = async (req: Request, res: Response) => {
  try {
    const result = await mandiService.getMandiPrices(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Unable to fetch current mandi prices. Please try again.'
    });
  }
};

export const refreshMarketRates = async (req: Request, res: Response) => {
  try {
    const result = await mandiService.getMandiPrices(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Unable to refresh mandi prices.'
    });
  }
};
