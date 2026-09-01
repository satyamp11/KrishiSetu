import { Response } from 'express';
import { orderService } from '../services/orderService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { OrderStatus } from '../models/Order.js';

export const orderController = {
  // POST /api/orders
  async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const result = await orderService.createOrder(req.user, req.body);
      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(201).json({
        success: true,
        message: 'Order created successfully! Escrow deposit initiated.',
        orders: result.orders
      });
    } catch (error) {
      console.error('Error in createOrder controller:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while placing order.' });
    }
  },

  // GET /api/orders
  async getUserOrders(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const orders = await orderService.getUserOrders(req.user);
      return res.status(200).json({
        success: true,
        total: orders.length,
        orders
      });
    } catch (error) {
      console.error('Error in getUserOrders controller:', error);
      return res.status(500).json({ success: false, message: 'Unable to fetch orders.' });
    }
  },

  // GET /api/orders/:id
  async getOrderById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const orderId = req.params.id as string;
      const result = await orderService.getOrderById(orderId, req.user);
      if (!result.success) {
        const statusCode = result.message?.includes('Forbidden') ? 403 : 404;
        return res.status(statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in getOrderById controller:', error);
      return res.status(500).json({ success: false, message: 'Unable to fetch order details.' });
    }
  },

  // PUT /api/orders/:id/status
  async updateOrderStatus(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const orderId = req.params.id as string;
      const { status, note } = req.body;

      if (!status) {
        return res.status(400).json({ success: false, message: 'Order status is required.' });
      }

      const result = await orderService.updateOrderStatus(orderId, status as OrderStatus, req.user, note);
      if (!result.success) {
        const statusCode = result.message?.includes('Forbidden') ? 403 : 400;
        return res.status(statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in updateOrderStatus controller:', error);
      return res.status(500).json({ success: false, message: 'Unable to update order status.' });
    }
  }
};
