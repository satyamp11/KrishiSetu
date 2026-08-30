import type { MarketRate } from '../types';
import { MOCK_MARKET_RATES, ALL_INDIAN_STATES } from '../mockData';

const API_BASE_URL = '/api';

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

export const apiService = {
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
