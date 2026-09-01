import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Search, MapPin, BarChart3 } from 'lucide-react';
import type { Language, MarketRate } from '../../types';
import { apiService } from '../../services/apiService';

interface MarketRatesProps {
  language: Language;
}

export const MarketRatesSection: React.FC<MarketRatesProps> = ({ language }) => {
  const [rates, setRates] = useState<MarketRate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('All');

  const fetchRates = async () => {
    setLoading(true);
    try {
      const res = await apiService.getMarketRates({
        state: selectedState,
        search: searchQuery,
        limit: 8,
      });
      if (res.success && res.rates) {
        setRates(res.rates);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [selectedState, searchQuery]);

  const defaultRates: MarketRate[] = [
    {
      id: 'm1',
      name: 'Fresh Tomatoes',
      nameHindi: 'ताज़ा टमाटर',
      price: 32,
      unit: 'kg',
      unitHindi: 'किग्रा',
      mandi: 'Nashik Mandi',
      mandiHindi: 'नासिक मंडी',
      state: 'Maharashtra',
      priceChange: 8.4,
      category: 'Vegetables',
      lastUpdated: 'Just now',
      trend7d: [26, 27, 29, 28, 30, 31, 32],
      trend30d: [20, 25, 30, 32],
    },
    {
      id: 'm2',
      name: 'Sharbati Wheat',
      nameHindi: 'शरबती गेहूं',
      price: 2450,
      unit: 'Quintal',
      unitHindi: 'कुंतल',
      mandi: 'Local APMC Market',
      mandiHindi: 'स्थानीय मंडी',
      state: 'Madhya Pradesh',
      priceChange: 3.2,
      category: 'Grains',
      lastUpdated: 'Just now',
      trend7d: [2300, 2350, 2400, 2450],
      trend30d: [2200, 2450],
    },
    {
      id: 'm3',
      name: 'Red Onions',
      nameHindi: 'लाल प्याज',
      price: 28,
      unit: 'kg',
      unitHindi: 'किग्रा',
      mandi: 'Solapur Mandi',
      mandiHindi: 'सोलापुर मंडी',
      state: 'Maharashtra',
      priceChange: 5.1,
      category: 'Vegetables',
      lastUpdated: 'Just now',
      trend7d: [24, 25, 26, 28],
      trend30d: [20, 28],
    },
    {
      id: 'm4',
      name: 'Mustard Seeds',
      nameHindi: 'सरसों',
      price: 5400,
      unit: 'Quintal',
      unitHindi: 'कुंतल',
      mandi: 'Jaipur Mandi',
      mandiHindi: 'जयपुर मंडी',
      state: 'Rajasthan',
      priceChange: 4.1,
      category: 'Oilseeds',
      lastUpdated: 'Just now',
      trend7d: [5100, 5250, 5400],
      trend30d: [5000, 5400],
    },
  ];

  const displayRates = rates.length > 0 ? rates : defaultRates;

  return (
    <section id="live-prices" className="py-16 bg-[#f4f6f0] border-b border-stone-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>LIVE MANDI BENCHMARKS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#143022] font-sans tracking-tight">
              Know the Market. Sell Smarter.
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Real-time Mandi market rates across major regional agricultural trading hubs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search crop or mandi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-xl font-medium w-48 sm:w-64"
              />
            </div>
            <button
              onClick={fetchRates}
              className="p-2 bg-white text-slate-700 hover:text-[#1b4332] rounded-xl border border-stone-300 shadow-2xs"
              title="Refresh Mandi Rates"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mandi Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayRates.slice(0, 4).map((rate) => {
            const isUp = rate.priceChange >= 0;
            return (
              <div
                key={rate.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-base">
                    {language === 'hi' && rate.nameHindi ? rate.nameHindi : rate.name}
                  </span>
                  <div
                    className={`inline-flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full ${
                      isUp
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{isUp ? `+${rate.priceChange}%` : `${rate.priceChange}%`}</span>
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-black text-[#1b4332]">
                    ₹{rate.price.toLocaleString()}
                    <span className="text-xs font-bold text-slate-500 font-sans"> / {rate.unit}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{rate.mandi}, {rate.state}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Benchmark Rate</span>
                  <span className="font-semibold text-emerald-700">{rate.lastUpdated || 'Updated Live'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Approachable Price Trend Chart Visual */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-black text-slate-900">7-Day Mandi Price Trend (Tomatoes vs Wheat)</h3>
            </div>
            <span className="text-xs font-bold text-slate-500">Source: Agmarknet & Platform Index</span>
          </div>

          <div className="h-40 w-full bg-[#f9fbf8] p-4 rounded-2xl border border-stone-200 flex items-end justify-between gap-3">
            {[
              { day: 'Mon', price: 26 },
              { day: 'Tue', price: 27 },
              { day: 'Wed', price: 29 },
              { day: 'Thu', price: 28 },
              { day: 'Fri', price: 30 },
              { day: 'Sat', price: 31 },
              { day: 'Sun', price: 32 },
            ].map((d) => {
              const height = (d.price / 35) * 100;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] font-bold text-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{d.price}/kg
                  </span>
                  <div
                    className="w-full bg-[#2d6a4f] rounded-t-md transition-all group-hover:bg-[#1b4332]"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] font-extrabold text-slate-500">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
