import mongoose from 'mongoose';
import { Delivery, IDelivery, DeliveryStatus } from '../models/Delivery.js';
import { Order } from '../models/Order.js';

export interface CreateDeliveryPayload {
  orderId: string;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  vehicleType?: string;
  vehicleNumber?: string;
}

export interface UpdateLocationPayload {
  deliveryId?: string;
  orderId?: string;
  lat: number;
  lng: number;
  speedKmH?: number;
  address?: string;
  status?: DeliveryStatus;
  isDemoSimulator?: boolean;
}

export interface DeliveryResponseDTO {
  id: string;
  orderId: string;
  orderNumber: string;
  deliveryPartner: {
    id: string;
    name: string;
    phone: string;
    vehicleType: string;
    vehicleNumber: string;
  };
  pickupLocation: {
    address: string;
    district: string;
    state: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    district: string;
    state: string;
    lat: number;
    lng: number;
  };
  currentLocation: {
    address: string;
    lat: number;
    lng: number;
    speedKmH: number;
    heading: number;
    lastUpdated: string;
  };
  status: DeliveryStatus;
  estimatedArrival: string;
  distanceRemainingKm: number;
  isDemoSimulator: boolean;
  orderStatusTimeline: {
    step: string;
    label: string;
    isCompleted: boolean;
    timestamp?: string;
  }[];
  createdAt: string;
}

export const deliveryService = {
  // Convert Mongoose doc to Clean DTO
  toDeliveryDTO(doc: IDelivery, orderStatus: string = 'IN_TRANSIT'): DeliveryResponseDTO {
    const timelineSteps = [
      { step: 'PENDING', label: 'Order Placed', isCompleted: true },
      { step: 'CONFIRMED', label: 'Confirmed by Farmer', isCompleted: true },
      { step: 'PACKED', label: 'Produce Packed', isCompleted: doc.status !== 'ASSIGNED' },
      { step: 'PICKED_UP', label: 'Picked Up from FPO Hub', isCompleted: doc.status !== 'ASSIGNED' },
      { step: 'IN_TRANSIT', label: 'In Transit', isCompleted: doc.status === 'IN_TRANSIT' || doc.status === 'OUT_FOR_DELIVERY' || doc.status === 'DELIVERED' },
      { step: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', isCompleted: doc.status === 'OUT_FOR_DELIVERY' || doc.status === 'DELIVERED' },
      { step: 'DELIVERED', label: 'Delivered', isCompleted: doc.status === 'DELIVERED' }
    ];

    return {
      id: doc._id.toString(),
      orderId: doc.orderId.toString(),
      orderNumber: doc.orderNumber,
      deliveryPartner: {
        id: doc.deliveryPartnerId ? doc.deliveryPartnerId.toString() : 'dp-1',
        name: doc.deliveryPartnerName || 'Suresh Kumar',
        phone: doc.deliveryPartnerPhone || '+91 98765 43210',
        vehicleType: doc.vehicleInfo?.vehicleType || 'Mini Truck (Refrigerated)',
        vehicleNumber: doc.vehicleInfo?.vehicleNumber || 'UP53BT9821'
      },
      pickupLocation: doc.pickupLocation,
      destination: doc.destination,
      currentLocation: {
        address: doc.currentLocation.address,
        lat: doc.currentLocation.lat,
        lng: doc.currentLocation.lng,
        speedKmH: doc.currentLocation.speedKmH,
        heading: doc.currentLocation.heading,
        lastUpdated: doc.currentLocation.lastUpdated
          ? new Date(doc.currentLocation.lastUpdated).toISOString()
          : new Date().toISOString()
      },
      status: doc.status,
      estimatedArrival: doc.estimatedArrival
        ? new Date(doc.estimatedArrival).toISOString()
        : new Date(Date.now() + 3.5 * 3600 * 1000).toISOString(),
      distanceRemainingKm: doc.distanceRemainingKm || 142,
      isDemoSimulator: !!doc.isDemoSimulator,
      orderStatusTimeline: timelineSteps,
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString()
    };
  },

  // 1. Create or Assign Delivery Dispatch
  async createDelivery(payload: CreateDeliveryPayload): Promise<DeliveryResponseDTO> {
    if (!mongoose.Types.ObjectId.isValid(payload.orderId)) {
      throw new Error('Invalid order ID');
    }

    let delivery = await Delivery.findOne({ orderId: new mongoose.Types.ObjectId(payload.orderId) });
    if (delivery) {
      return this.toDeliveryDTO(delivery);
    }

    const order = await Order.findById(payload.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const pickupLat = 26.7606; // Gorakhpur FPO Coordinates
    const pickupLng = 83.3732;
    const destLat = 26.8467; // Lucknow Coordinates
    const destLng = 80.9462;

    delivery = new Delivery({
      orderId: order._id,
      orderNumber: order.orderNumber,
      deliveryPartnerId: payload.deliveryPartnerId
        ? new mongoose.Types.ObjectId(payload.deliveryPartnerId)
        : new mongoose.Types.ObjectId(),
      deliveryPartnerName: payload.deliveryPartnerName || 'Suresh Kumar',
      vehicleInfo: {
        vehicleType: payload.vehicleType || 'Mini Truck (Refrigerated)',
        vehicleNumber: payload.vehicleNumber || 'UP53BT9821'
      },
      pickupLocation: {
        address: `${order.sellerDistrict} FPO Producer Hub`,
        district: order.sellerDistrict,
        state: order.sellerState,
        lat: pickupLat,
        lng: pickupLng
      },
      destination: {
        address: `${order.deliveryAddress.streetAddress}, ${order.deliveryAddress.city}`,
        district: order.deliveryAddress.city,
        state: order.deliveryAddress.state,
        lat: destLat,
        lng: destLng
      },
      currentLocation: {
        address: 'En-route on NH-27 (Ayodhya Expressway)',
        lat: 26.7900,
        lng: 82.2000,
        speedKmH: 52,
        heading: 260,
        lastUpdated: new Date()
      },
      status: 'IN_TRANSIT',
      estimatedArrival: new Date(Date.now() + 3.5 * 3600 * 1000),
      distanceRemainingKm: 142,
      isDemoSimulator: true
    });

    const saved = await delivery.save();
    return this.toDeliveryDTO(saved, order.orderStatus);
  },

  // 2. Get Live Order GPS Tracking
  async getOrderTracking(orderId: string): Promise<DeliveryResponseDTO> {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error('Invalid order ID');
    }

    let delivery = await Delivery.findOne({ orderId: new mongoose.Types.ObjectId(orderId) });
    if (!delivery) {
      // Auto-create delivery dispatch for order
      return await this.createDelivery({ orderId });
    }

    const order = await Order.findById(orderId);
    return this.toDeliveryDTO(delivery, order?.orderStatus || 'IN_TRANSIT');
  },

  // 3. Get Delivery Dispatch By ID
  async getDeliveryById(id: string): Promise<DeliveryResponseDTO | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await Delivery.findById(id);
    if (!doc) return null;
    return this.toDeliveryDTO(doc);
  },

  // 4. Update Vehicle Location Snapshot (Does NOT spam DB with history)
  async updateLocation(payload: UpdateLocationPayload): Promise<DeliveryResponseDTO> {
    let query: any = {};
    if (payload.deliveryId && mongoose.Types.ObjectId.isValid(payload.deliveryId)) {
      query = { _id: new mongoose.Types.ObjectId(payload.deliveryId) };
    } else if (payload.orderId && mongoose.Types.ObjectId.isValid(payload.orderId)) {
      query = { orderId: new mongoose.Types.ObjectId(payload.orderId) };
    } else {
      throw new Error('deliveryId or orderId required');
    }

    const doc = await Delivery.findOne(query);
    if (!doc) {
      throw new Error('Delivery record not found');
    }

    doc.currentLocation.lat = payload.lat;
    doc.currentLocation.lng = payload.lng;
    if (payload.speedKmH !== undefined) doc.currentLocation.speedKmH = payload.speedKmH;
    if (payload.address) doc.currentLocation.address = payload.address;
    doc.currentLocation.lastUpdated = new Date();

    if (payload.status) {
      doc.status = payload.status;
      if (payload.status === 'DELIVERED') {
        doc.distanceRemainingKm = 0;
        doc.deliveryTime = new Date();
      }
    }

    const updated = await doc.save();
    return this.toDeliveryDTO(updated);
  }
};
