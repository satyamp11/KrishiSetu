import { Router } from 'express';
import { bulkRequestController } from '../controllers/bulkRequestController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

export const bulkRequestRouter = Router();

// POST /api/bulk-requests - Create Bulk Purchase Request
bulkRequestRouter.post('/', authenticateUser, bulkRequestController.createBulkRequest);

// GET /api/bulk-requests - Get Bulk Requests List
bulkRequestRouter.get('/', authenticateUser, bulkRequestController.getBulkRequests);

// POST /api/bulk-requests/:id/offers - Farmer Submits Offer
bulkRequestRouter.post('/:id/offers', authenticateUser, bulkRequestController.createFarmerOffer);

// GET /api/bulk-requests/:id/offers - Get Offers for a Bulk Request
bulkRequestRouter.get('/:id/offers', authenticateUser, bulkRequestController.getFarmerOffers);

// POST /api/bulk-requests/:id/offers/:offerId/accept - Buyer Accepts Offer
bulkRequestRouter.post('/:id/offers/:offerId/accept', authenticateUser, bulkRequestController.acceptOffer);

export default bulkRequestRouter;
