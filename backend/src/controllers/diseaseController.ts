import { Request, Response } from 'express';

export const scanCropDisease = (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Crop disease scanning service operational"
  });
};
