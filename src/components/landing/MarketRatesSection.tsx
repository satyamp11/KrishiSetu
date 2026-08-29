import React, { useState, useMemo } from 'react';
import { Search, RefreshCw, TrendingUp, TrendingDown, MapPin, Filter, AlertCircle, ArrowRight } from 'lucide-react';
import type { Language, MarketRate } from '../../types';
import { MOCK_MARKET_RATES } from '../../mockData';

interface MarketRatesProps {
  language: Language;
}

export const MarketRatesSection: React.FC<MarketRatesProps> = ({ language }) => {
  const [rates, setRates] = useState<MarketRate[]>(MOCK_MARKET_RATES);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMandi, setSelectedMandi] = useState<string>('All');
  const [lastUpdated, setLastUpdated] = useState<string>('Today, 10:30 AM');

  const statesList = ['All', 'Haryana', 'Punjab', 'Uttar Pradesh', 'Rajasthan', 'Delhi', 'Maharashtra', 'Madhya Pradesh'];
  const categoriesList = ['All', 'Grains', 'Vegetables', 'Oilseeds', 'Pulses'];

  // Simulated Real API Fetcher for Agmarknet / Govt Mandi API
  const fetchLiveMarketData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate real HTTP delay from API endpoint
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Slight price jitter simulation to reflect live API connection
      const updatedRates = MOCK_MARKET_RATES.map((item) => {
        const jitter = (Math.random() - 0.5) * 10;
        const newPrice = Math.round((item.price + jitter) * 10) / 10;
        return {
          ...item,
          price: newPrice,
          lastUpdated: `Just now (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
        };
      });

      setRates(updatedRates);
      setLastUpdated(`Just now (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);
    } catch {
      setError('Unable to connect to live Agmarknet API server. Showing cached market prices.');
    } finally {
      setLoading(false);
    }
  };

  // Derive filtered rates using useMemo
  const filteredRates = useMemo(() => {
    let result = [...rates];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.nameHindi.includes(q) ||
          r.mandi.toLowerCase().includes(q) ||
          r.mandiHindi.includes(q)
      );
    }

    if (selectedState !== 'All') {
      result = result.filter((r) => r.state === selectedState);
    }

    if (selectedCategory !== 'All') {
      result = result.filter((r) => r.category === selectedCategory);
    }

    if (selectedMandi !== 'All') {
      result = result.filter((r) => r.mandi === selectedMandi);
    }

    return result;
  }, [searchQuery, selectedState, selectedCategory, selectedMandi, rates]);


  // Extract list of mandis for dropdown
  const mandisList = ['All', ...Array.from(new Set(rates.map((r) => r.mandi)))];

  return (
    <section id="market-rates" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>{language === 'hi' ? 'लाइव एग्री मार्केट डेटा' : 'Real-Time Agricultural Mandi Prices'}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4332] tracking-tight font-serif-title">
              {language === 'hi' ? 'आज का मंडी भाव' : 'Live Market Rates'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium mt-1">
              {language === 'hi'
                ? 'विभिन्न राज्यों और मंडियों के फसल एवं सब्जी के ताज़ा भाव।'
                : 'Track current commodity prices across key mandis and agricultural trading hubs.'}
            </p>
          </div>

          {/* Right Status & Refresh Action */}
          <div className="flex items-center gap-3">
            <div className="text-right text-xs font-semibold text-slate-600 hidden sm:block">
              <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">API Status: Ready</span>
              <span>Last Updated: <strong className="text-emerald-800">{lastUpdated}</strong></span>
            </div>

            <button
              onClick={fetchLiveMarketData}
              disabled={loading}
              className="bg-emerald-50 hover:bg-emerald-100 text-[#1b4332] border border-emerald-300 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
              <span>{loading ? 'Fetching...' : 'Refresh Live Prices'}</span>
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS TOOLBAR */}
        <div className="bg-[#faf9f6] p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === 'hi' ? 'फसल या मंडी खोजें...' : 'Search crop or mandi...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-800"
              />
            </div>

            {/* State Selector */}
            <div className="relative">
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">State / राज्य</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-800"
              >
                {statesList.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Mandi Selector */}
            <div className="relative">
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Mandi / मंडी</label>
              <select
                value={selectedMandi}
                onChange={(e) => setSelectedMandi(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-800"
              >
                {mandisList.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Category / श्रेणी</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-800"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* API ERROR BANNER STATE */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchLiveMarketData}
              className="text-xs bg-red-600 text-white px-3 py-1 rounded-lg"
            >
              Retry
            </button>
          </div>
        )}

        {/* LOADING STATE */}
        {loading ? (
          <div className="py-16 text-center space-y-4">
            <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
            <p className="text-base font-bold text-slate-700">Connecting to Mandi Price API network...</p>
          </div>
        ) : filteredRates.length === 0 ? (
          /* EMPTY STATE */
          <div className="py-16 text-center bg-[#faf9f6] rounded-3xl border border-dashed border-slate-300 space-y-3">
            <Filter className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-lg font-bold text-slate-800">No market rates match your filters</h4>
            <p className="text-sm text-slate-500">Try adjusting your search query, state, or mandi selection.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedState('All');
                setSelectedCategory('All');
                setSelectedMandi('All');
              }}
              className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* MARKET RATES GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRates.map((rate) => {
              const isPositive = rate.priceChange >= 0;
              return (
                <div
                  key={rate.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    
                    {/* Header Image & Category */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        {rate.image ? (
                          <img src={rate.image} alt={rate.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-emerald-800 bg-emerald-100">
                            🌾
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                        {rate.category}
                      </span>
                    </div>

                    {/* Crop Name */}
                    <div>
                      <h3 className="text-lg font-black text-[#1b4332] group-hover:text-emerald-700 transition-colors">
                        {language === 'hi' ? rate.nameHindi : rate.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{language === 'hi' ? rate.mandiHindi : rate.mandi}, {rate.state}</span>
                      </p>
                    </div>

                    {/* Price Tag & Change Indicator */}
                    <div className="pt-2 flex items-baseline justify-between border-t border-slate-100">
                      <div>
                        <span className="text-2xl font-black text-slate-900 tracking-tight">
                          ₹{rate.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500 font-bold ml-1">
                          / {language === 'hi' ? rate.unitHindi : rate.unit}
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

                  {/* Timestamp Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400">
                    <span>{rate.lastUpdated}</span>
                    <span className="text-emerald-700 font-bold group-hover:translate-x-1 transition-transform">
                      Details →
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* View All Rates Footer CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setSelectedCategory('All')}
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
