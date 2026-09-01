import { Response } from 'express';
import { bulkRequestService } from '../services/bulkRequestService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const bulkRequestController = {
  // POST /api/bulk-requests
  async createBulkRequest(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const result = await bulkRequestService.createBulkRequest(req.user, req.body);
      return res.status(201).json({
        success: true,
        message: 'Bulk purchase request created successfully.',
        bulkRequest: result
      });
    } catch (error: any) {
      console.error('Error in createBulkRequest controller:', error);
      return res.status(500).json({ success: false, message: error.message || 'Unable to create bulk request.' });
    }
  },

  // GET /api/bulk-requests
  async getBulkRequests(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const bulkRequests = await bulkRequestService.getBulkRequests(req.user);
      return res.status(200).json({
        success: true,
        total: bulkRequests.length,
        bulkRequests
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Unable to fetch bulk requests.' });
    }
  },

  // POST /api/bulk-requests/:id/offers
  async createFarmerOffer(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const requestId = req.params.id as string;
      const result = await bulkRequestService.createFarmerOffer(req.user, requestId, req.body);
      return res.status(200).json({
        success: true,
        message: 'Quotation offer submitted to bulk buyer.',
        bulkRequest: result
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Unable to submit quotation offer.' });
    }
  },

  // GET /api/bulk-requests/:id/offers
  async getFarmerOffers(req: AuthenticatedRequest, res: Response) {
    try {
      const requestId = req.params.id as string;
      const offers = await bulkRequestService.getFarmerOffers(requestId);
      return res.status(200).json({
        success: true,
        total: offers.length,
        offers
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Unable to fetch offers.' });
    }
  },

  // POST /api/bulk-requests/:id/offers/:offerId/accept
  async acceptOffer(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const requestId = req.params.id as string;
      const offerId = req.params.offerId as string;

      const result = await bulkRequestService.acceptOffer(req.user.id, requestId, offerId);
      return res.status(200).json({
        success: true,
        message: 'Farmer quotation accepted! Bulk order initiated with Escrow protection.',
        bulkRequest: result
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Unable to accept offer.' });
    }
  }
};
