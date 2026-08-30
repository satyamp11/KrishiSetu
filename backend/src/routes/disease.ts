import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Krishi Shield AI Disease Scanner Endpoint active"
  });
});

export default router;
