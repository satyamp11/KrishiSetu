import { Router } from 'express';
import { mandiController } from '../controllers/mandiController.js';

export const mandiRouter = Router();

// GET /api/mandi/prices - Real-time mandi prices with filtering & pagination
mandiRouter.get('/prices', mandiController.getPrices);

// GET /api/mandi/districts - List districts for selected state
mandiRouter.get('/districts', mandiController.getDistricts);
