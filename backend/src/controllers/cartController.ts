import { Response } from 'express';
import { cartService } from '../services/cartService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const cartController = {
  // GET /api/cart
  async getCart(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const cart = await cartService.getCart(req.user.id);
      return res.status(200).json(cart);
    } catch (error) {
      console.error('Error in getCart:', error);
      return res.status(500).json({ success: false, message: 'Unable to fetch cart.' });
    }
  },

  // POST /api/cart
  async addToCart(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const { productId, quantity } = req.body;
      if (!productId) {
        return res.status(400).json({ success: false, message: 'productId is required.' });
      }

      const cart = await cartService.addToCart(req.user.id, productId, quantity || 1);
      if (!cart.success) {
        return res.status(400).json(cart);
      }

      return res.status(200).json(cart);
    } catch (error) {
      console.error('Error in addToCart:', error);
      return res.status(500).json({ success: false, message: 'Unable to add item to cart.' });
    }
  },

  // PUT /api/cart
  async updateQuantity(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const { productId, quantity } = req.body;
      if (!productId || quantity === undefined) {
        return res.status(400).json({ success: false, message: 'productId and quantity are required.' });
      }

      const cart = await cartService.updateQuantity(req.user.id, productId, Number(quantity));
      if (!cart.success) {
        return res.status(400).json(cart);
      }

      return res.status(200).json(cart);
    } catch (error) {
      console.error('Error in updateQuantity:', error);
      return res.status(500).json({ success: false, message: 'Unable to update cart quantity.' });
    }
  },

  // DELETE /api/cart/:itemId
  async removeItem(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const itemId = req.params.itemId as string;
      const cart = await cartService.removeItem(req.user.id, itemId);
      return res.status(200).json(cart);
    } catch (error) {
      console.error('Error in removeItem:', error);
      return res.status(500).json({ success: false, message: 'Unable to remove item from cart.' });
    }
  }
};
