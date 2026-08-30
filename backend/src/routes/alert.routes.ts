import { Router } from 'express';
import { alertController } from '../controllers/alertController.js';

export const alertRouter = Router();

// GET /api/alerts - Fetch community disease alerts by state, district, crop
alertRouter.get('/', alertController.getAlerts);
