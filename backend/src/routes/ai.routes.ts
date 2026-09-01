import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';

export const aiRouter = Router();

// GET /api/ai/demand-forecast - AI Demand Forecast Endpoint
aiRouter.get('/demand-forecast', aiController.getDemandForecast);

// POST /api/ai/optimize-route - AI Assisted Route Optimization Endpoint
aiRouter.post('/optimize-route', aiController.optimizeRoute);

export default aiRouter;
