import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import type { Language } from '../../types';


interface MarketTrendsProps {
  language: Language;
}

export const MarketTrendsSection: React.FC<MarketTrendsProps> = ({ language }) => {
  const [timeframe, setTimeframe] = useState<'today' | '7d' | '30d'>('7d');

  const trendData = [
    {
      titleEn: "Wheat (गेहूं)",
      titleHi: "गेहूं बाज़ार मूल्य रुझान",
      mandi: "Rohtak Mandi",
      currentPrice: "₹2,450 / Quintal",
      change: "+2.4%",
      isUp: true,
      points: timeframe === 'today' ? [2440, 2445, 2450] : timeframe === '7d' ? [2380, 2400, 2410, 2425, 2430, 2440, 2450] : [2300, 2320, 2350, 2380, 2400, 2420, 2450],
      strokeColor: "#10b981",
    },
    {
      titleEn: "Basmati Rice (धान)",
      titleHi: "धान बाज़ार मूल्य रुझान",
      mandi: "Karnal Mandi",
      currentPrice: "₹3,180 / Quintal",
      change: "-0.8%",
      isUp: false,
      points: timeframe === 'today' ? [3190, 3185, 3180] : timeframe === '7d' ? [3220, 3210, 3200, 3195, 3190, 3185, 3180] : [3300, 3280, 3250, 3220, 3200, 3190, 3180],
      strokeColor: "#ef4444",
    },
    {
      titleEn: "Vegetables Avg (टमाटर / आलू)",
      titleHi: "सब्जी मंडी मूल्य रुझान",
      mandi: "Azadpur Mandi",
      currentPrice: "₹32 / Kg",
      change: "+4.1%",
      isUp: true,
      points: timeframe === 'today' ? [30, 31, 32] : timeframe === '7d' ? [28, 29, 29, 30, 31, 31, 32] : [22, 24, 25, 27, 29, 30, 32],
      strokeColor: "#10b981",
    }
  ];

  // Render SVG Sparkline
  const renderSvgLineChart = (points: number[], strokeColor: string) => {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 280;
    const height = 70;

    const pathData = points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 16) - 8;
        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

    return (
      <svg className="w-full h-20 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((val, idx) => {
          const x = (idx / (points.length - 1)) * width;
          const y = height - ((val - min) / range) * (height - 16) - 8;
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r={idx === points.length - 1 ? "5" : "3"}
              fill={idx === points.length - 1 ? strokeColor : "#ffffff"}
              stroke={strokeColor}
              strokeWidth="2"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <section className="py-16 bg-[#faf9f6] border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Timeframe Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
              Market Price Trends
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1b4332] font-serif-title">
              {language === 'hi' ? 'मूल्य रुझान विश्लेषण (Trends)' : 'Market Trend Visualization'}
            </h2>
          </div>

          {/* Timeframe Switcher Buttons */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-300 shadow-sm self-start sm:self-auto text-xs font-bold">
            <button
              onClick={() => setTimeframe('today')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1 ${
                timeframe === 'today'
                  ? 'bg-[#1b4332] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Today</span>
            </button>

            <button
              onClick={() => setTimeframe('7d')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1 ${
                timeframe === '7d'
                  ? 'bg-[#1b4332] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>7 Days</span>
            </button>

            <button
              onClick={() => setTimeframe('30d')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1 ${
                timeframe === '30d'
                  ? 'bg-[#1b4332] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>30 Days</span>
            </button>
          </div>
        </div>

        {/* 3 Compact Trend Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendData.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {language === 'hi' ? item.titleHi : item.titleEn}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">{item.mandi}</p>
                </div>

                <div className={`px-2.5 py-1 rounded-full text-xs font-black ${
                  item.isUp ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.change}
                </div>
              </div>

              <div>
                <p className="text-2xl font-black text-slate-900">{item.currentPrice}</p>
              </div>

              {/* Sparkline */}
              <div className="pt-2">
                {renderSvgLineChart(item.points, item.strokeColor)}
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-t border-slate-100 pt-2">
                <span>Start: ₹{item.points[0]}</span>
                <span className="text-emerald-700 font-black">Latest: ₹{item.points[item.points.length - 1]}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
