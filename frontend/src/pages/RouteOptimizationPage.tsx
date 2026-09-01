import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingDown,
  Clock,
  Fuel,
  DollarSign,
  Navigation,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  MapPin,
  Truck,
  Layers,
  Cpu,
} from 'lucide-react';
import {
  Navbar,
  Footer,
  Button,
  Badge,
  StatCard,
  LoadingState,
  ErrorState,
  useToast,
} from '../components/ui';
import { apiService, RouteOptimizationResponse } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

export interface RouteOptimizationPageProps {
  onNavigateTab?: (tab: string) => void;
}

export const RouteOptimizationPage: React.FC<RouteOptimizationPageProps> = ({
  onNavigateTab = () => {},
}) => {
  const { user, openAuthModal } = useAuth();
  const toast = useToast();

  const [optimization, setOptimization] = useState<RouteOptimizationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOptimization = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.optimizeRoute();
      if (res.success) {
        setOptimization(res);
      } else {
        setError('Failed to calculate AI route optimization.');
      }
    } catch (err) {
      setError('Network error connecting to Route Optimization API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptimization();
  }, []);

  const metrics = optimization?.metrics || {
    originalDistanceKm: 42,
    optimizedDistanceKm: 31,
    distanceSavedKm: 11,
    savingsPercentage: 26,
    originalDurationMinutes: 110,
    optimizedDurationMinutes: 75,
    timeSavedMinutes: 35,
    originalFuelLiters: 11.2,
    optimizedFuelLiters: 7.4,
    fuelSavedLiters: 3.8,
    costSavedINR: 420,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar activeTab="logistics" onNavigate={onNavigateTab} user={user} onOpenAuth={openAuthModal} />

      {/* Header Hero Banner */}
      <section className="bg-slate-950 text-white py-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="primary" size="sm" icon={<Cpu className="w-3.5 h-3.5 text-emerald-400" />}>
                  Phase 10: AI-Assisted Route Optimization
                </Badge>
                <Badge variant="earth" size="sm">
                  VRP / TSP Genetic Solver
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Multi-Stop Route Dispatch Optimization</span>
                <Sparkles className="w-6 h-6 text-emerald-400 fill-emerald-400 animate-pulse" />
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Reduces delivery distance, travel time, diesel consumption, and regional agricultural logistics costs.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="text-white border-slate-700 hover:bg-slate-800"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={fetchOptimization}
            >
              Re-Calculate Optimal Route
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Prototype AI Model Label */}
        <div className="p-3.5 bg-emerald-950 text-emerald-100 rounded-2xl border border-emerald-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>AI VRP Engine:</strong> KrishiSetu Genetic VRP Engine v2.1 (Prototype Engine)
            </span>
          </div>
          <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded font-mono font-bold text-emerald-300">
            Python OR-Tools & OSRM Engine Hook Configured
          </span>
        </div>

        {loading && <LoadingState message="Calculating optimal vehicle routing schedule..." />}

        {error && !loading && <ErrorState title="Optimization Error" message={error} onRetry={fetchOptimization} />}

        {!loading && !error && (
          <div className="space-y-6">
            {/* Primary Metrics Comparison Grid (Exact Specs Match) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {/* Original Route */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Original Route</span>
                <span className="text-2xl font-black text-slate-500 line-through">{metrics.originalDistanceKm} km</span>
                <span className="text-[11px] text-slate-400 block font-semibold">Unoptimized sequence</span>
              </div>

              {/* Optimized Route */}
              <div className="bg-emerald-950 text-white p-4 rounded-2xl border border-emerald-900 shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Optimized Route</span>
                <span className="text-2xl font-black text-emerald-300">{metrics.optimizedDistanceKm} km</span>
                <span className="text-[11px] text-emerald-200 block font-semibold">AI TSP Genetic sequence</span>
              </div>

              {/* Distance Saved */}
              <StatCard
                title="Distance Saved"
                value={`${metrics.distanceSavedKm} km`}
                change={metrics.savingsPercentage}
                changeLabel="reduced distance"
                icon={<Navigation className="w-4 h-4" />}
                variant="emerald"
              />

              {/* Time Saved */}
              <StatCard
                title="Est. Time Saved"
                value={`${metrics.timeSavedMinutes} mins`}
                subtitle="Faster dispatch"
                icon={<Clock className="w-4 h-4" />}
                variant="emerald"
              />

              {/* Fuel Saved */}
              <StatCard
                title="Fuel Saved"
                value={`${metrics.fuelSavedLiters} L`}
                subtitle="Diesel saved per trip"
                icon={<Fuel className="w-4 h-4" />}
                variant="amber"
              />

              {/* Cost Reduction */}
              <StatCard
                title="Delivery Cost Saved"
                value={`₹${metrics.costSavedINR}`}
                subtitle="Cost reduction per trip"
                icon={<DollarSign className="w-4 h-4" />}
                variant="emerald"
              />
            </div>

            {/* Visual Route Comparison: Unoptimized vs Optimized Waypoints */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Side: Original Sequential Route */}
              <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                      Original Sequential Route (42 km)
                    </h3>
                  </div>
                  <Badge variant="earth" size="sm">Unoptimized</Badge>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                    <span className="font-bold text-slate-700">1. Pickup: Gorakhpur FPO Hub</span>
                    <span className="text-slate-400 font-mono">0 km</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center opacity-70">
                    <span className="font-bold text-slate-700">2. Delivery: Basti Cold Storage</span>
                    <span className="text-slate-400 font-mono">18 km</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center opacity-70">
                    <span className="font-bold text-slate-700">3. Delivery: Ayodhya Retail Hub</span>
                    <span className="text-slate-400 font-mono">14 km</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center opacity-70">
                    <span className="font-bold text-slate-700">4. Delivery: Lucknow Central Mandi</span>
                    <span className="text-slate-400 font-mono">10 km</span>
                  </div>
                </div>
              </div>

              {/* Right Side: AI Genetic VRP Optimized Waypoint Sequence */}
              <div className="lg:col-span-6 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-black text-emerald-300 uppercase tracking-wider">
                      AI Optimized Waypoint Route (31 km)
                    </h3>
                  </div>
                  <Badge variant="success" size="sm">
                    {metrics.distanceSavedKm} km Saved ({metrics.savingsPercentage}%)
                  </Badge>
                </div>

                <div className="space-y-3">
                  {optimization?.optimizedRoute && optimization.optimizedRoute.length > 0 ? (
                    optimization.optimizedRoute.map((wp) => (
                      <div
                        key={wp.sequenceOrder}
                        className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-lg bg-emerald-900 text-emerald-300 font-black text-[11px] flex items-center justify-center shrink-0">
                            {wp.sequenceOrder}
                          </div>
                          <div>
                            <span className="font-extrabold text-white">{wp.name}</span>
                            <span className="text-[10px] text-slate-400 block">{wp.address || 'Priority Dispatch Hub'}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono text-emerald-400 font-bold block">{wp.estimatedArrival}</span>
                          <span className="text-[10px] text-slate-500">
                            {wp.legDistanceKm > 0 ? `+${wp.legDistanceKm} km` : 'Origin'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-slate-950 rounded-xl text-center text-xs text-slate-400">
                      Loading waypoint sequence...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer onNavigate={onNavigateTab} />
    </div>
  );
};
