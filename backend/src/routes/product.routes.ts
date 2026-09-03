import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';

export const productRouter = Router();

// GET /api/products - Public Marketplace Search & Filtering
productRouter.get('/', productController.getProducts);

// GET /api/products/matches - AI-Assisted Smart Matching (Authenticated)
productRouter.get('/matches', authenticateUser, productController.getMatchingFarmers);

// GET /api/products/my-products - Authenticated Farmer's own listings
productRouter.get('/my-products', authenticateUser, authorizeRole('farmer', 'admin'), productController.getMyProducts);

// GET /api/products/:id - Single Product Details
productRouter.get('/:id', productController.getProductById);

// POST /api/products - Create Produce Listing (Farmers & Admin only)
productRouter.post('/', authenticateUser, authorizeRole('farmer', 'admin'), productController.createProduct);

// PUT /api/products/:id - Update Produce Listing (Ownership Guard enforced in controller)
productRouter.put('/:id', authenticateUser, authorizeRole('farmer', 'admin'), productController.updateProduct);

// DELETE /api/products/:id - Delete Produce Listing (Ownership Guard enforced in controller)
productRouter.delete('/:id', authenticateUser, authorizeRole('farmer', 'admin'), productController.deleteProduct);

export default productRouter;
