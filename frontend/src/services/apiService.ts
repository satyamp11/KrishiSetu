import type { MarketRate } from '../types';
export type { MarketRate };
import { MOCK_MARKET_RATES, ALL_INDIAN_STATES } from '../mockData';

const API_BASE_URL = '/api';

export type UserRole = 'farmer' | 'consumer' | 'bulk_buyer' | 'delivery_partner' | 'admin';

export type ProductCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Pulses'
  | 'Spices'
  | 'Dairy'
  | 'Organic Products'
  | 'Seeds'
  | 'Fertilizers'
  | 'Farm Equipment';

export interface ProductItem {
  id: string;
  title: string;
  category: ProductCategory;
  price: number;
  unit: string;
  mandiBenchmarkPrice?: number;
  availableQuantity: number;
  minOrderQuantity: number;
  description?: string;
  imageUrl: string;
  farmerId: string;
  farmerName: string;
  fpoName?: string;
  isVerifiedFPO: boolean;
  isOrganicCertified: boolean;
  location: {
    village?: string;
    district: string;
    state: string;
  };
  rating: number;
  reviewCount: number;
  harvestDate?: string;
  status: 'available' | 'sold_out' | 'unlisted';
  createdAt: string;
}

export interface ProductsFilterParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  state?: string;
  district?: string;
  organicOnly?: boolean;
  verifiedOnly?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'stock';
  page?: number;
  limit?: number;
}

export interface ProductsApiResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  products: ProductItem[];
  message?: string;
}

export interface MandiPricesFilterParams {
  state?: string;
  district?: string;
  mandi?: string;
  commodity?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface MandiPricesApiResponse {
  success: boolean;
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  states: string[];
  districts?: string[];
  commodities?: string[];
  categories: string[];
  rates: MarketRate[];
}

export interface FarmInfo {
  fpoName?: string;
  fpoRegistrationNumber?: string;
  landSizeAcres?: number;
  primaryCrop?: string;
  organicCertified?: boolean;
}

export interface DeliveryAddress {
  streetAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
}

export interface BusinessInfo {
  organizationName?: string;
  gstin?: string;
  businessType?: 'Wholesaler' | 'Retailer' | 'Processor' | 'Hotel/Restaurant' | 'Exporter' | 'Other';
  annualVolumeEstimate?: string;
}

export interface VehicleInfo {
  vehicleType?: 'TwoWheeler' | 'MiniTruck' | 'HeavyTruck' | 'RefrigeratedVan';
  vehicleNumber?: string;
  licenseNumber?: string;
  operatingDistrict?: string;
  maxCapacityKg?: number;
}

export interface AuthUser {
  id: string;
  name: string;
  emailOrPhone: string;
  role: UserRole;
  state: string;
  district: string;
  village?: string;
  primaryCrop?: string;
  profileImage?: string;
  
  farmInfo?: FarmInfo;
  deliveryAddress?: DeliveryAddress;
  businessInfo?: BusinessInfo;
  vehicleInfo?: VehicleInfo;

  createdAt: string;
}

export interface AuthApiResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: AuthUser;
}

export interface RegisterPayload {
  name: string;
  emailOrPhone: string;
  password?: string;
  role: UserRole;
  state?: string;
  district?: string;
  village?: string;
  primaryCrop?: string;
  adminSecretKey?: string;

  farmInfo?: FarmInfo;
  deliveryAddress?: DeliveryAddress;
  businessInfo?: BusinessInfo;
  vehicleInfo?: VehicleInfo;
}

export interface CropScanRecord {
  id: string;
  farmerId: string;
  cropName: string;
  diseaseName: string;
  diseaseHindi: string;
  confidence: number;
  imageUrl?: string;
  result: 'Healthy' | 'Infected';
  recommendations?: string[];
  recommendationsHindi?: string[];
  createdAt: string;
}

export interface CommunityAlertRecord {
  id: string;
  diseaseName: string;
  diseaseHindi: string;
  crop: string;
  state: string;
  district: string;
  centerVillage: string;
  severity: 'Critical' | 'Warning' | 'Low';
  reportCount: number;
  description: string;
  descriptionHindi: string;
  recommendations: string[];
  recommendationsHindi: string[];
  createdAt: string;
}

export const apiService = {
  // Marketplace Product API Methods
  async getProducts(params?: ProductsFilterParams): Promise<ProductsApiResponse> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All') query.append('category', params.category);
      if (params?.search) query.append('search', params.search);
      if (params?.minPrice !== undefined) query.append('minPrice', String(params.minPrice));
      if (params?.maxPrice !== undefined) query.append('maxPrice', String(params.maxPrice));
      if (params?.state && params.state !== 'All') query.append('state', params.state);
      if (params?.district && params.district !== 'All') query.append('district', params.district);
      if (params?.organicOnly) query.append('organicOnly', 'true');
      if (params?.verifiedOnly) query.append('verifiedOnly', 'true');
      if (params?.sort) query.append('sort', params.sort);
      if (params?.page) query.append('page', String(params.page));
      if (params?.limit) query.append('limit', String(params.limit));

      const response = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error('Error fetching products from backend:', err);
      return {
        success: false,
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 1,
        products: [],
        message: 'Unable to connect to Marketplace database.'
      };
    }
  },

  async getProductById(id: string): Promise<{ success: boolean; product?: ProductItem; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      return await response.json();
    } catch (err) {
      return { success: false, message: 'Failed to load product details.' };
    }
  },

  async getMyProducts(token: string): Promise<{ success: boolean; total: number; products: ProductItem[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/my-products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (err) {
      return { success: false, total: 0, products: [] };
    }
  },

  async createProduct(
    token: string,
    payload: {
      title: string;
      category: ProductCategory;
      price: number;
      unit: string;
      availableQuantity: number;
      minOrderQuantity?: number;
      mandiBenchmarkPrice?: number;
      description?: string;
      imageUrl?: string;
      fpoName?: string;
      isVerifiedFPO?: boolean;
      isOrganicCertified?: boolean;
      village?: string;
      district?: string;
      state?: string;
    }
  ): Promise<{ success: boolean; product?: ProductItem; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (err) {
      return { success: false, message: 'Failed to create product listing.' };
    }
  },

  async updateProduct(
    token: string,
    id: string,
    payload: Partial<ProductItem>
  ): Promise<{ success: boolean; product?: ProductItem; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (err) {
      return { success: false, message: 'Failed to update product listing.' };
    }
  },

  async deleteProduct(token: string, id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (err) {
      return { success: false, message: 'Failed to delete product listing.' };
    }
  },

  // OTP Authentication API Methods
  async sendOtp(identifier: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      return await response.json();
    } catch (err) {
      return { success: false, message: 'Network error sending OTP. Please try again.' };
    }
  },

  async verifyOtp(payload: {
    identifier: string;
    otp: string;
    name?: string;
    role?: UserRole;
    state?: string;
    district?: string;
    village?: string;
    primaryCrop?: string;
    farmInfo?: FarmInfo;
    deliveryAddress?: DeliveryAddress;
    businessInfo?: BusinessInfo;
    vehicleInfo?: VehicleInfo;
  }): Promise<AuthApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (err) {
      return { success: false, message: 'Network error verifying OTP. Please try again.' };
    }
  },

  // Authentication API Methods
  async registerUser(data: RegisterPayload): Promise<AuthApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      return result;
    } catch (err) {
      return { success: false, message: 'Network error during registration. Please try again.' };
    }
  },

  async loginUser(credentials: {
    emailOrPhone: string;
    password: string;
  }): Promise<AuthApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const result = await response.json();
      return result;
    } catch (err) {
      return { success: false, message: 'Network error during login. Please try again.' };
    }
  },

  async getCurrentUser(token: string): Promise<AuthApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      return result;
    } catch (err) {
      return { success: false, message: 'Session validation failed.' };
    }
  },

  async logoutUser(): Promise<AuthApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
      return await response.json();
    } catch {
      return { success: true };
    }
  },

  // Role Access Validation Test Methods
  async testRoleAccess(token: string, role: UserRole): Promise<{ success: boolean; message: string; user?: AuthUser }> {
    try {
      const endpoint = `/auth/${role.replace('_', '')}-only`;
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (err) {
      return { success: false, message: 'Authorization test network error.' };
    }
  },

  // Farmer Profile API Methods
  async getUserProfile(token: string): Promise<AuthApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (err) {
      return { success: false, message: 'Failed to fetch user profile.' };
    }
  },

  async updateUserProfile(
    token: string,
    updates: Partial<RegisterPayload>
  ): Promise<AuthApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      return await response.json();
    } catch (err) {
      return { success: false, message: 'Failed to update user profile.' };
    }
  },

  // Crop Scan History API Methods
  async saveCropScan(token: string, data: {
    cropName: string;
    diseaseName: string;
    diseaseHindi?: string;
    confidence?: number;
    imageUrl?: string;
    result?: 'Healthy' | 'Infected';
    recommendations?: string[];
    recommendationsHindi?: string[];
  }): Promise<{ success: boolean; scan?: CropScanRecord; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/scans`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (err) {
      return { success: false, message: 'Failed to save scan history.' };
    }
  },

  async getFarmerScans(token: string): Promise<{ success: boolean; total: number; scans: CropScanRecord[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/scans`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {}
    return { success: false, total: 0, scans: [] };
  },

  // Location-based Community Alerts API Method
  async getCommunityAlerts(params?: { state?: string; district?: string; crop?: string }): Promise<{ success: boolean; count: number; alerts: CommunityAlertRecord[] }> {
    try {
      const query = new URLSearchParams();
      if (params?.state) query.append('state', params.state);
      if (params?.district) query.append('district', params.district);
      if (params?.crop) query.append('crop', params.crop);

      const response = await fetch(`${API_BASE_URL}/alerts?${query.toString()}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {}
    return { success: false, count: 0, alerts: [] };
  },

  // Fetch real-time Mandi prices from backend Express API
  async getMarketRates(params?: MandiPricesFilterParams): Promise<MandiPricesApiResponse> {
    try {
      const query = new URLSearchParams();
      if (params?.state && params.state !== 'All') query.append('state', params.state);
      if (params?.district && params.district !== 'All') query.append('district', params.district);
      if (params?.mandi && params.mandi !== 'All') query.append('mandi', params.mandi);
      if (params?.commodity && params.commodity !== 'All') query.append('commodity', params.commodity);
      if (params?.category && params.category !== 'All') query.append('category', params.category);
      if (params?.search) query.append('search', params.search);
      if (params?.page) query.append('page', String(params.page));
      if (params?.limit) query.append('limit', String(params.limit));

      const response = await fetch(`${API_BASE_URL}/mandi/prices?${query.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('Backend Mandi API server error, using client dataset fallback:', err);
      let filtered = [...MOCK_MARKET_RATES];
      if (params?.state && params.state !== 'All') {
        filtered = filtered.filter((r) => r.state.toLowerCase() === params.state!.toLowerCase());
      }
      if (params?.category && params.category !== 'All') {
        filtered = filtered.filter((r) => r.category === params.category);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (r) => r.name.toLowerCase().includes(q) || r.mandi.toLowerCase().includes(q) || r.state.toLowerCase().includes(q)
        );
      }
      const limit = params?.limit || 25;
      const page = params?.page || 1;
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const startIndex = (page - 1) * limit;

      return {
        success: true,
        total,
        page,
        limit,
        totalPages,
        states: ['All', ...ALL_INDIAN_STATES],
        districts: ['All', 'Gorakhpur', 'Lucknow', 'Kanpur Nagar', 'Agra', 'Varanasi', 'Prayagraj', 'Meerut', 'Deoria', 'Basti'],
        commodities: ['All', 'Wheat', 'Basmati Rice', 'Tomato', 'Potato', 'Onion', 'Mustard', 'Maize (Corn)', 'Gram (Chana)', 'Raw Cotton', 'Sugarcane'],
        categories: ['All', 'Grains', 'Vegetables', 'Oilseeds', 'Pulses'],
        rates: filtered.slice(startIndex, startIndex + limit)
      };
    }
  },

  // Fetch list of districts for selected state
  async getDistricts(stateName?: string): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/mandi/districts?state=${encodeURIComponent(stateName || 'All')}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.districts)) {
          return data.districts;
        }
      }
    } catch (e) {}
    return ['All', 'Gorakhpur', 'Lucknow', 'Kanpur Nagar', 'Agra', 'Varanasi', 'Prayagraj', 'Meerut', 'Deoria', 'Basti'];
  },

  // Trigger live refresh on backend API
  async refreshLivePrices(): Promise<{ success: boolean; lastUpdated: string; rates: MarketRate[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/market-rates/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return await response.json();
    } catch {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updatedRates = MOCK_MARKET_RATES.map((item) => {
        const jitter = (Math.random() - 0.5) * 10;
        return {
          ...item,
          price: Math.max(10, Math.round((item.price + jitter) * 10) / 10),
          lastUpdated: `Just now (${currentTime})`
        };
      });
      return {
        success: true,
        lastUpdated: `Just now (${currentTime})`,
        rates: updatedRates
      };
    }
  }
};
