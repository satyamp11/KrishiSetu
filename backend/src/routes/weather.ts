import { Router, Request, Response } from 'express';
import { INITIAL_WEATHER } from '../data/seedData.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: INITIAL_WEATHER
  });
});

export default router;
