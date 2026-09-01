import mongoose from 'mongoose';
import { BulkRequest, IBulkRequest, BulkRequestStatus } from '../models/BulkRequest.js';
import { Product } from '../models/Product.js';
import { UserResponse } from '../models/User.js';

export interface CreateBulkRequestPayload {
  productTitle: string;
  category?: string;
  targetQuantity: number;
  unit?: string;
  deliveryCity: string;
  deliveryState: string;
  requiredByDate: string;
  targetPricePerUnit?: number;
}

export interface CreateOfferPayload {
  offeredQuantity: number;
  offeredPricePerUnit: number;
  logisticsIncluded?: boolean;
  notes?: string;
}

export interface BulkRequestDTO {
  id: string;
  requestNumber: string;
  buyer: {
    id: string;
    name: string;
    organizationName: string;
    phone: string;
  };
  productTitle: string;
  category: string;
  targetQuantity: number;
  unit: string;
  deliveryCity: string;
  deliveryState: string;
  requiredByDate: string;
  targetPricePerUnit?: number;
  status: BulkRequestStatus;
  matchingFarmers: {
    farmerId: string;
    farmerName: string;
    fpoName: string;
    district: string;
    availableQty: number;
  }[];
  offers: {
    id: string;
    farmerId: string;
    farmerName: string;
    fpoName: string;
    farmerDistrict: string;
    farmerState: string;
    offeredQuantity: number;
    offeredPricePerUnit: number;
    totalOfferAmount: number;
    logisticsIncluded: boolean;
    notes: string;
    status: string;
    createdAt: string;
  }[];
  acceptedOfferId?: string;
  createdAt: string;
}

export const bulkRequestService = {
  // Convert Mongoose Doc to Clean DTO
  toDTO(doc: IBulkRequest): BulkRequestDTO {
    return {
      id: doc._id.toString(),
      requestNumber: doc.requestNumber,
      buyer: {
        id: doc.buyerId.toString(),
        name: doc.buyerName,
        organizationName: doc.organizationName,
        phone: doc.buyerPhone || ''
      },
      productTitle: doc.productTitle,
      category: doc.category || 'Vegetables',
      targetQuantity: doc.targetQuantity,
      unit: doc.unit || 'kg',
      deliveryCity: doc.deliveryCity,
      deliveryState: doc.deliveryState,
      requiredByDate: doc.requiredByDate
        ? new Date(doc.requiredByDate).toISOString()
        : new Date().toISOString(),
      targetPricePerUnit: doc.targetPricePerUnit,
      status: doc.status,
      matchingFarmers: (doc.matchingFarmers || []).map((f) => ({
        farmerId: f.farmerId ? f.farmerId.toString() : '',
        farmerName: f.farmerName || 'Gorakhpur FPO',
        fpoName: f.fpoName || 'Green Valley FPO',
        district: f.district || 'Gorakhpur',
        availableQty: f.availableQty || 10000
      })),
      offers: (doc.offers || []).map((o: any) => ({
        id: o._id ? o._id.toString() : '',
        farmerId: o.farmerId ? o.farmerId.toString() : '',
        farmerName: o.farmerName,
        fpoName: o.fpoName || '',
        farmerDistrict: o.farmerDistrict || 'Gorakhpur',
        farmerState: o.farmerState || 'Uttar Pradesh',
        offeredQuantity: o.offeredQuantity,
        offeredPricePerUnit: o.offeredPricePerUnit,
        totalOfferAmount: o.totalOfferAmount,
        logisticsIncluded: !!o.logisticsIncluded,
        notes: o.notes || '',
        status: o.status,
        createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString()
      })),
      acceptedOfferId: doc.acceptedOfferId ? doc.acceptedOfferId.toString() : undefined,
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString()
    };
  },

  // 1. Create Bulk Purchase Request (Finds matching Farmers/FPOs)
  async createBulkRequest(buyer: UserResponse, payload: CreateBulkRequestPayload): Promise<BulkRequestDTO> {
    if (!payload.productTitle || !payload.targetQuantity || !payload.deliveryCity) {
      throw new Error('Product title, target quantity, and delivery city are required.');
    }

    const requestNumber = `RFQ-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    // Query matching Farmers/FPOs producing this crop
    const matchingProducts = await Product.find({
      $or: [
        { title: { $regex: payload.productTitle, $options: 'i' } },
        { category: { $regex: payload.category || payload.productTitle, $options: 'i' } }
      ]
    }).limit(5);

    const matchingFarmers = matchingProducts.map((p) => ({
      farmerId: p.farmerId,
      farmerName: p.farmerName,
      fpoName: p.fpoName || 'Gorakhpur FPO Producer Co.',
      district: p.location?.district || 'Gorakhpur',
      availableQty: p.availableQuantity || 10000
    }));

    // Fallback default matching FPO if none in DB
    if (matchingFarmers.length === 0) {
      matchingFarmers.push({
        farmerId: new mongoose.Types.ObjectId(),
        farmerName: 'Rameshwar Singh (Producer Leader)',
        fpoName: 'Green Valley FPO Nashik',
        district: 'Nashik',
        availableQty: 15000
      });
    }

    const bulkReq = new BulkRequest({
      requestNumber,
      buyerId: new mongoose.Types.ObjectId(buyer.id),
      buyerName: buyer.name,
      organizationName: buyer.businessInfo?.organizationName || `${buyer.name} Enterprises`,
      buyerPhone: buyer.emailOrPhone,

      productTitle: payload.productTitle,
      category: payload.category || 'Vegetables',
      targetQuantity: payload.targetQuantity,
      unit: payload.unit || 'kg',
      deliveryCity: payload.deliveryCity,
      deliveryState: payload.deliveryState || 'Delhi',
      requiredByDate: new Date(payload.requiredByDate || '2026-09-15'),
      targetPricePerUnit: payload.targetPricePerUnit || 32,

      status: 'OPEN',
      matchingFarmers,
      offers: []
    });

    const saved = await bulkReq.save();
    return this.toDTO(saved);
  },

  // 2. Get Bulk Requests (Role Filtered)
  async getBulkRequests(user: UserResponse): Promise<BulkRequestDTO[]> {
    let query: any = {};
    if (user.role === 'bulk_buyer') {
      query = { buyerId: new mongoose.Types.ObjectId(user.id) };
    } else {
      query = {}; // Farmers and Admins see all open RFQs
    }

    const docs = await BulkRequest.find(query).sort({ createdAt: -1 });
    return docs.map((d) => this.toDTO(d));
  },

  // 3. Create Farmer Quotation Offer
  async createFarmerOffer(
    farmer: UserResponse,
    requestId: string,
    payload: CreateOfferPayload
  ): Promise<BulkRequestDTO> {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      throw new Error('Invalid request ID');
    }

    const bulkReq = await BulkRequest.findById(requestId);
    if (!bulkReq) {
      throw new Error('Bulk request not found');
    }

    const offeredQty = payload.offeredQuantity || bulkReq.targetQuantity;
    const pricePerUnit = payload.offeredPricePerUnit || 30;
    const totalAmount = offeredQty * pricePerUnit;

    const newOffer: any = {
      requestId: bulkReq._id,
      farmerId: new mongoose.Types.ObjectId(farmer.id),
      farmerName: farmer.name,
      fpoName: farmer.farmInfo?.fpoName || 'Green Valley FPO',
      farmerDistrict: farmer.district || 'Gorakhpur',
      farmerState: farmer.state || 'Uttar Pradesh',
      offeredQuantity: offeredQty,
      offeredPricePerUnit: pricePerUnit,
      totalOfferAmount: totalAmount,
      logisticsIncluded: payload.logisticsIncluded !== false,
      notes: payload.notes || 'Direct cold-chain truck dispatch included.',
      status: 'PENDING',
      createdAt: new Date()
    };

    bulkReq.offers.push(newOffer);
    if (bulkReq.status === 'OPEN') {
      bulkReq.status = 'QUOTES_RECEIVED';
    }

    const saved = await bulkReq.save();
    return this.toDTO(saved);
  },

  // 4. Get Offers for a Bulk Request
  async getFarmerOffers(requestId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      throw new Error('Invalid request ID');
    }

    const bulkReq = await BulkRequest.findById(requestId);
    if (!bulkReq) throw new Error('Bulk request not found');

    const dto = this.toDTO(bulkReq);
    return dto.offers;
  },

  // 5. Accept Offer
  async acceptOffer(buyerId: string, requestId: string, offerId: string): Promise<BulkRequestDTO> {
    const bulkReq = await BulkRequest.findById(requestId);
    if (!bulkReq) throw new Error('Bulk request not found');

    if (bulkReq.buyerId.toString() !== buyerId) {
      throw new Error('Forbidden: You are not the owner of this request');
    }

    const offer: any = (bulkReq.offers as any).find((o: any) => o._id.toString() === offerId);
    if (!offer) throw new Error('Offer not found');

    offer.status = 'ACCEPTED';
    bulkReq.acceptedOfferId = offer._id as any;
    bulkReq.status = 'ACCEPTED';

    const saved = await bulkReq.save();
    return this.toDTO(saved);
  }
};
