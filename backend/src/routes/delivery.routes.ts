import { Router } from 'express';
import { deliveryController } from '../controllers/deliveryController.js';

export const deliveryRouter = Router();

// POST /api/delivery - Create Delivery Dispatch
deliveryRouter.post('/', deliveryController.createDelivery);

// GET /api/delivery/:id - Get Delivery Dispatch Details
deliveryRouter.get('/:id', deliveryController.getDeliveryById);

// GET /api/orders/:orderId/tracking - Get Order Tracking
deliveryRouter.get('/orders/:orderId/tracking', deliveryController.getOrderTracking);

// POST /api/delivery/location - Update Vehicle Location Snapshot
deliveryRouter.post('/location', deliveryController.updateLocation);

export default deliveryRouter;
