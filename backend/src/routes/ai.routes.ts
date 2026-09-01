import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';

export const aiRouter = Router();

// GET /api/ai/demand-forecast - AI Demand Forecast Endpoint
aiRouter.get('/demand-forecast', aiController.getDemandForecast);

export default aiRouter;
