import { Router } from 'express';
import { scanCropDisease } from '../controllers/diseaseController.js';

const router = Router();

router.get('/', scanCropDisease);

export default router;
