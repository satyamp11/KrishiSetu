import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

export const orderRouter = Router();

// POST /api/orders - Place New Order
orderRouter.post('/', authenticateUser, orderController.createOrder);

// GET /api/orders - Fetch User Orders History (Role Protected Ownership filter)
orderRouter.get('/', authenticateUser, orderController.getUserOrders);

// GET /api/orders/:id - Fetch Single Order Details
orderRouter.get('/:id', authenticateUser, orderController.getOrderById);

// PUT /api/orders/:id/status - Update Order Status (Status Timeline Guard)
orderRouter.put('/:id/status', authenticateUser, orderController.updateOrderStatus);

export default orderRouter;
