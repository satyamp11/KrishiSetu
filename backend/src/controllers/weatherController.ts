import { Request, Response } from 'express';
import { INITIAL_WEATHER } from '../utils/seedData.js';

export const getWeather = (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: INITIAL_WEATHER
  });
};
