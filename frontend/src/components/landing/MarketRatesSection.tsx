import React, { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, TrendingUp, TrendingDown, MapPin, Filter, AlertCircle, ArrowRight, Sprout, ChevronLeft, ChevronRight, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import type { Language, MarketRate } from '../../types';
import { apiService, MandiPricesApiResponse } from '../../services/apiService';

interface MarketRatesProps {
  language: Language;
}

// Complete list of 28 Indian States & 8 Union Territories
const ALL_INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export const MarketRatesSection: React.FC<MarketRatesProps> = ({ language }) => {
  const [rates, setRates] = useState<MarketRate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Dynamic Option Lists from API
  const [districtsList, setDistrictsList] = useState<string[]>(['All']);
  const [commoditiesList, setCommoditiesList] = useState<string[]>(['All']);
  const statesList = ['All', ...ALL_INDIAN_STATES];
  const categoriesList = ['All', 'Grains', 'Vegetables', 'Oilseeds', 'Pulses'];

  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(25);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [lastUpdated, setLastUpdated] = useState<string>('Today, 10:30 AM');

  // Track images that fail to load to show fallback icon
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Show More / Show Less Expanded State (default false: show only first 4 cards)
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Reset expansion state whenever state or any filter changes
  useEffect(() => {
    setIsExpanded(false);
  }, [selectedState, selectedDistrict, selectedCommodity, selectedCategory, searchQuery, page]);

  const visibleCards = isExpanded ? rates : rates.slice(0, 4);

  // Main Mandi Data Fetcher from backend API with complete dynamic parameters
  const loadMandiPrices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: MandiPricesApiResponse = await apiService.getMarketRates({
        state: selectedState,
        district: selectedDistrict,
        commodity: selectedCommodity,
        category: selectedCategory,
        search: searchQuery,
        page,
        limit: pageSize
      });

      if (response && response.success) {
        setRates(response.rates || []);
        setTotalRecords(response.total || 0);
        setTotalPages(response.totalPages || 1);

        if (response.districts && response.districts.length > 0) {
          setDistrictsList(response.districts);
        }
        if (response.commodities && response.commodities.length > 0) {
          setCommoditiesList(response.commodities);
        }
        
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastUpdated(`Today, ${nowStr}`);
      } else {
        setError('Unable to fetch current mandi prices. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching Mandi prices:', err);
      setError('Unable to fetch current mandi prices. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedState, selectedDistrict, selectedCommodity, selectedCategory, searchQuery, page, pageSize]);

  // Fetch districts when state changes
  useEffect(() => {
    async function loadDistricts() {
      const dists = await apiService.getDistricts(selectedState);
      setDistrictsList(dists);
    }
    loadDistricts();
    setSelectedDistrict('All');
    setPage(1);
  }, [selectedState]);

  // Trigger main data load whenever filters or page changes
  useEffect(() => {
    loadMandiPrices();
  }, [loadMandiPrices]);

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedState('All');
    setSelectedDistrict('All');
    setSelectedCommodity('All');
    setSelectedCategory('All');
    setPage(1);
  };

  return (
    <section id="market-rates" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>{language === 'hi' ? 'लाइव एग्री मार्केट डेटा' : 'Real-Time Agricultural Mandi API'}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4332] tracking-tight font-serif-title">
              {language === 'hi' ? 'आज का मंडी भाव' : 'Live Mandi Prices'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium mt-1">
              {language === 'hi'
                ? 'भारत के सभी 28 राज्यों और जिलों की मंडियों के ताज़ा आधिकारिक भाव।'
                : 'Real-time commodity prices sourced directly from Indian agricultural mandis and government market data.'}
            </p>
          </div>

          {/* Right Status & Refresh Action */}
          <div className="flex items-center gap-3">
            <div className="text-right text-xs font-semibold text-slate-600 hidden sm:block">
              <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">API Status: Active</span>
              <span>Last Updated: <strong className="text-emerald-800">{lastUpdated}</strong></span>
            </div>

            <button
              onClick={loadMandiPrices}
              disabled={loading}
              className="bg-emerald-50 hover:bg-emerald-100 text-[#1b4332] border border-emerald-300 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
              <span>{loading ? 'Fetching API...' : 'Refresh Prices'}</span>
            </button>
          </div>
        </div>

        {/* SEARCH & DYNAMIC FILTERS TOOLBAR */}
        <div className="bg-[#faf9f6] p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            
            {/* Search Input */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                {language === 'hi' ? 'खोजें / SEARCH' : 'SEARCH CROP / MANDI'}
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'फसल या मंडी खोजें...' : 'Search crop, mandi, district...'}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-800"
                />
              </div>
            </div>

            {/* State Selector */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                {language === 'hi' ? 'राज्य / STATE' : 'STATE / राज्य'}
              </label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedDistrict('All');
                  setPage(1);
                }}
                className="w-full h-11 px-3 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-800 cursor-pointer"
              >
                {statesList.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* District Selector */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                {language === 'hi' ? 'जिला / DISTRICT' : 'DISTRICT / जिला'}
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setPage(1);
                }}
                className="w-full h-11 px-3 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-800 cursor-pointer"
              >
                {districtsList.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Crop/Commodity Selector */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                {language === 'hi' ? 'फसल / COMMODITY' : 'CROP / COMMODITY'}
              </label>
              <select
                value={selectedCommodity}
                onChange={(e) => {
                  setSelectedCommodity(e.target.value);
                  setPage(1);
                }}
                className="w-full h-11 px-3 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-800 cursor-pointer"
              >
                {commoditiesList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                {language === 'hi' ? 'श्रेणी / CATEGORY' : 'CATEGORY / श्रेणी'}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full h-11 px-3 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-800 cursor-pointer"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* API ERROR BANNER */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadMandiPrices}
              className="text-xs bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-lg font-bold transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* LOADING STATE */}
        {loading ? (
          <div className="py-16 text-center space-y-4">
            <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
            <p className="text-base font-bold text-slate-700">Fetching latest mandi prices from API network...</p>
          </div>
        ) : rates.length === 0 ? (
          /* EMPTY STATE */
          <div className="py-16 text-center bg-[#faf9f6] rounded-3xl border border-dashed border-slate-300 space-y-3">
            <Filter className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-lg font-bold text-slate-800">No mandi price data available for the selected filters.</h4>
            <p className="text-sm text-slate-500">Try selecting a different district, state, or resetting your filter criteria.</p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* MARKET RATES GRID */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300">
              {visibleCards.map((rate) => {
                const isPositive = rate.priceChange >= 0;
                const hasFailedImage = failedImages[rate.id];

                return (
                  <div
                    key={rate.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group animate-fadeIn"
                  >
                    <div className="space-y-4">
                      
                      {/* Header Image & Category Badge */}
                      <div className="flex items-center justify-between">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center shadow-sm">
                          {rate.image && !hasFailedImage ? (
                            <img
                              src={rate.image}
                              alt={rate.name}
                              onError={() => handleImageError(rate.id)}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-emerald-800 bg-emerald-50">
                              <Sprout className="w-7 h-7 text-emerald-700" />
                            </div>
                          )}
                        </div>

                        <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider border border-slate-200">
                          {rate.category}
                        </span>
                      </div>

                      {/* Crop Name & Location */}
                      <div>
                        <h3 className="text-lg font-black text-[#1b4332] group-hover:text-emerald-700 transition-colors leading-snug">
                          {language === 'hi' ? rate.nameHindi || rate.name : rate.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">
                            {language === 'hi' ? rate.mandiHindi || rate.mandi : rate.mandi}
                            {rate.district ? `, ${rate.district}` : ''}, {rate.state}
                          </span>
                        </p>
                        {rate.variety && (
                          <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Variety: {rate.variety}</span>
                        )}
                      </div>

                      {/* Price Tag & Trend Badge */}
                      <div className="pt-3 flex items-baseline justify-between border-t border-slate-100">
                        <div>
                          <span className="text-2xl font-black text-slate-900 tracking-tight">
                            ₹{rate.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-500 font-bold ml-1">
                            / {language === 'hi' ? rate.unitHindi || rate.unit : rate.unit}
                          </span>
                        </div>

                        <div className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 ${
                          isPositive 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {isPositive ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5" />
                          )}
                          <span>{isPositive ? `+${rate.priceChange}%` : `${rate.priceChange}%`}</span>
                        </div>
                      </div>

                    </div>

                    {/* Timestamp & Arrival Date Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{rate.arrivalDate ? `Arrival: ${rate.arrivalDate}` : rate.lastUpdated}</span>
                      </span>
                      <span className="text-emerald-700 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 cursor-pointer">
                        Details →
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* SHOW MORE / SHOW LESS BUTTON */}
            {rates.length > 4 && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => {
                    if (isExpanded) {
                      setIsExpanded(false);
                      const el = document.getElementById('market-rates');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    } else {
                      setIsExpanded(true);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-[#1b4332] hover:bg-[#2d6a4f] text-white rounded-full font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer border border-[#1b4332]"
                >
                  <span>
                    {isExpanded
                      ? (language === 'hi' ? 'कम देखें (Show Less)' : 'Show Less')
                      : (language === 'hi' ? 'और देखें (Show More)' : 'Show More')}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}

            {/* PAGINATION CONTROLS */}
            <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-semibold text-slate-600">
                Showing <strong className="text-slate-900">{((page - 1) * pageSize) + 1}</strong> to <strong className="text-slate-900">{Math.min(page * pageSize, totalRecords)}</strong> of <strong className="text-emerald-800">{totalRecords}</strong> total Mandi records
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="px-3 text-xs font-extrabold text-slate-700">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* View All Rates Footer CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={handleResetFilters}
            className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            <span>{language === 'hi' ? 'सभी मंडी भाव देखें (View All Rates)' : 'View All Market Rates'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
