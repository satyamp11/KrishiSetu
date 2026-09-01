import React from 'react';
import { Truck, MapPin, Navigation, ArrowRight, ShieldCheck, Clock, Fuel } from 'lucide-react';

interface LogisticsSectionProps {
  onTrackDelivery?: () => void;
}

export const LogisticsSection: React.FC<LogisticsSectionProps> = ({
  onTrackDelivery = () => {},
}) => {
  return (
    <section id="logistics-section" className="py-16 bg-[#f4f6f0] border-b border-stone-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300">
            <Truck className="w-3.5 h-3.5 text-emerald-700" />
            <span>COLD-CHAIN DISPATCH & ROUTING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#143022] font-sans tracking-tight">
            From Farm to Doorstep.
          </h2>
          <p className="text-sm text-slate-600">
            Intelligent route optimization reduces transit times, maintains produce freshness, and cuts delivery costs.
          </p>
        </div>

        {/* Visual Route Flow & Map */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-8">
          {/* Step Nodes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase block">Step 1</span>
              <span className="font-black text-sm text-[#1b4332] block">Farmer Location</span>
              <span className="text-[11px] text-slate-500">Nashik FPO Hub</span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase block">Step 2</span>
              <span className="font-black text-sm text-[#1b4332] block">Cold Pickup</span>
              <span className="text-[11px] text-slate-500">Temp-Controlled</span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase block">Step 3</span>
              <span className="font-black text-sm text-[#1b4332] block">Optimized Route</span>
              <span className="text-[11px] text-slate-500">VRP Multi-Stop</span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase block">Step 4</span>
              <span className="font-black text-sm text-[#1b4332] block">Doorstep Delivery</span>
              <span className="text-[11px] text-slate-500">Verified Consumer</span>
            </div>
          </div>

          {/* Map Preview Graphic & Demo Metrics */}
          <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-3 z-10">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE ROUTE TELEMETRY (DEMO BENCHMARK)</span>
              </div>
              <h3 className="text-xl font-black text-white">Nashik Hub ➔ Delhi City Fulfillment</h3>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-3 gap-3 z-10">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                <span className="text-sm font-black text-emerald-400 block">31 km</span>
                <span className="text-[10px] text-slate-400">Optimized Route</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                <span className="text-sm font-black text-emerald-400 block">18%</span>
                <span className="text-[10px] text-slate-400">Est. Fuel Saved</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                <span className="text-sm font-black text-emerald-400 block">42 min</span>
                <span className="text-[10px] text-slate-400">Est. Delivery</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <button
              onClick={onTrackDelivery}
              className="bg-[#1b4332] hover:bg-[#143022] text-white px-8 py-3.5 rounded-2xl font-black text-xs shadow-md transition-all flex items-center gap-2"
            >
              <span>Track Your Delivery</span>
              <ArrowRight className="w-4 h-4 text-emerald-300" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
