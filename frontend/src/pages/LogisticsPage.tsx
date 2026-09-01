import React from 'react';
import { Truck, MapPin, Sparkles, ShieldCheck, CheckCircle2, Navigation, ArrowRight } from 'lucide-react';
import { Navbar, Footer, Button, Badge, StatCard } from '../components/ui';
import { useAuth } from '../context/AuthContext';

export interface LogisticsPageProps {
  onNavigateTab?: (tab: string) => void;
  onNavigateToTracking?: (orderId: string) => void;
}

export const LogisticsPage: React.FC<LogisticsPageProps> = ({
  onNavigateTab = () => {},
  onNavigateToTracking = () => {},
}) => {
  const { user, openAuthModal } = useAuth();

  const activeDispatches = [
    {
      id: 'disp-1',
      orderNumber: 'ORD-2026-849201',
      driver: 'Suresh Kumar',
      vehicle: 'Mini Truck (UP53BT9821)',
      route: 'Gorakhpur Hub ➔ Lucknow (NH-27)',
      status: 'IN_TRANSIT',
      speed: '52 km/h',
      eta: '3h 45m',
      distance: '142 km remaining',
      produce: 'Red Tomatoes (1500 kg)',
    },
    {
      id: 'disp-2',
      orderNumber: 'ORD-2026-712940',
      driver: 'Rajesh Malviya',
      vehicle: 'Refrigerated Van (MP09CT4021)',
      route: 'Indore ➔ Mumbai Direct Trade',
      status: 'OUT_FOR_DELIVERY',
      speed: '38 km/h',
      eta: '45 mins',
      distance: '18 km remaining',
      produce: 'Desi Chana & Organic Ghee',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar activeTab="logistics" onNavigate={onNavigateTab} user={user} onOpenAuth={openAuthModal} />

      {/* Header Hero */}
      <section className="bg-stone-950 text-white py-10 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="earth" size="sm" icon={<Truck className="w-3.5 h-3.5 text-emerald-400" />}>
                  Phase 9: AI Route & Logistics
                </Badge>
                <Badge variant="primary" size="sm">
                  Sub-24h Dispatch Network
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                AI Logistics & Fleet Route Optimization
              </h1>
              <p className="text-xs text-stone-300 mt-1 max-w-2xl">
                Smart agricultural cold-chain routing algorithm minimizing transit fuel consumption and preventing crop spoilage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Logistics Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Dispatches"
            value="18 Vehicles"
            change={14.2}
            changeLabel="on-time delivery rate"
            icon={<Truck className="w-5 h-5" />}
            variant="emerald"
          />
          <StatCard
            title="Fuel Cost Saved"
            value="₹38,400"
            change={-18.5}
            changeLabel="AI route optimization"
            icon={<Sparkles className="w-5 h-5" />}
            variant="amber"
          />
          <StatCard
            title="Cold-Chain Vehicles"
            value="12 Units"
            subtitle="Maintaining 4°C for perishables"
            icon={<ShieldCheck className="w-5 h-5" />}
            variant="slate"
          />
          <StatCard
            title="Avg Delivery Time"
            value="14 Hours"
            change={-22.1}
            changeLabel="faster than APMC mandis"
            icon={<Navigation className="w-5 h-5" />}
            variant="emerald"
          />
        </div>

        {/* Active Dispatches Table */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Active Crop Shipments & Live Telemetry</h3>
              <p className="text-xs text-slate-500">Real-time GPS status of dispatches across regional hubs.</p>
            </div>
          </div>

          <div className="space-y-3">
            {activeDispatches.map((disp) => (
              <div
                key={disp.id}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">{disp.orderNumber}</span>
                    <Badge variant="primary" size="sm">{disp.status.replace('_', ' ')}</Badge>
                  </div>

                  <p className="text-xs font-bold text-emerald-800">{disp.produce}</p>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{disp.route}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">Driver: {disp.driver} ({disp.vehicle})</p>
                </div>

                <div className="flex flex-col md:items-end gap-2">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Distance & ETA</span>
                    <span className="text-sm font-black text-emerald-800">{disp.distance} • {disp.eta} ETA</span>
                  </div>

                  <Button
                    variant="primary"
                    size="xs"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => onNavigateToTracking(disp.orderNumber)}
                  >
                    View Live GPS Tracking Map
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigateTab} />
    </div>
  );
};
