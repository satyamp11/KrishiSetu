export interface MarketRate {
  id: string;
  name: string;
  nameHindi: string;
  category: string;
  price: number;
  unit: string;
  unitHindi: string;
  mandi: string;
  mandiHindi: string;
  district?: string;
  districtHindi?: string;
  state: string;
  variety?: string;
  grade?: string;
  minPrice?: number;
  maxPrice?: number;
  modalPrice?: number;
  arrivalDate?: string;
  isRealtimeApi?: boolean;
  priceChange: number;
  lastUpdated: string;
  trend7d: number[];
  trend30d: number[];
  image: string;
}

export interface MarketRatesFilterQuery {
  state?: string;
  district?: string;
  mandi?: string;
  commodity?: string;
  category?: string;
  search?: string;
  page?: number | string;
  limit?: number | string;
}

