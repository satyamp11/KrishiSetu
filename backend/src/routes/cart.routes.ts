import { Router } from 'express';
import { cartController } from '../controllers/cartController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

export const cartRouter = Router();

// GET /api/cart - Fetch User Shopping Cart
cartRouter.get('/', authenticateUser, cartController.getCart);

// POST /api/cart - Add Item to Cart
cartRouter.post('/', authenticateUser, cartController.addToCart);

// PUT /api/cart - Update Cart Item Quantity
cartRouter.put('/', authenticateUser, cartController.updateQuantity);

// DELETE /api/cart/:itemId - Remove Item from Cart
cartRouter.delete('/:itemId', authenticateUser, cartController.removeItem);

export default cartRouter;
