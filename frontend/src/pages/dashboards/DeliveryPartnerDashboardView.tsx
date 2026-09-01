import React from 'react';
import { Truck, Sparkles, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { StatCard, Badge, Button } from '../../components/ui';
import { AuthUser } from '../../services/apiService';

export const DeliveryPartnerDashboardView: React.FC<{ user: AuthUser; onNavigate?: (tab: string) => void }> = ({
  user,
  onNavigate = () => {},
}) => {
  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Role Banner */}
      <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-md border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="earth" dot>
              Active Role: Delivery & Logistics Partner
            </Badge>
            {user.vehicleInfo?.vehicleNumber && (
              <Badge variant="neutral">
                {user.vehicleInfo.vehicleType || 'Truck'} • {user.vehicleInfo.vehicleNumber}
              </Badge>
            )}
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-1">Welcome back, {user.name}!</h2>
          <p className="text-xs text-stone-300 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Assigned Operating District: {user.vehicleInfo?.operatingDistrict || user.district || 'Gorakhpur'}</span>
          </p>
        </div>

        <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-4 h-4" />} onClick={() => onNavigate('logistics')}>
          AI Route Dispatch Center
        </Button>
      </div>

      {/* Delivery Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Logistics Trips Completed"
          value="48 Shipments"
          change={14.2}
          changeLabel="on-time delivery"
          icon={<CheckCircle2 className="w-5 h-5" />}
          variant="emerald"
        />
        <StatCard
          title="Fuel Cost Optimized"
          value="₹12,400"
          change={-18.5}
          changeLabel="fuel consumption saved"
          icon={<Sparkles className="w-5 h-5" />}
          variant="amber"
        />
        <StatCard
          title="Active Dispatch Batch"
          value="3 Pickups"
          subtitle="Gorakhpur Hub -> Kanpur"
          icon={<Truck className="w-5 h-5" />}
          variant="slate"
        />
        <StatCard
          title="Logistics Payout Earnings"
          value="₹38,200"
          subtitle="Direct escrow release"
          icon={<MapPin className="w-5 h-5" />}
          variant="emerald"
        />
      </div>
    </div>
  );
};
