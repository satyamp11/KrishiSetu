import { Router } from 'express';
import { getMarketRates, refreshMarketRates } from '../controllers/marketRatesController.js';

const router = Router();

router.get('/', getMarketRates);
router.post('/refresh', refreshMarketRates);

export default router;
