import React from 'react';
import { Sprout, TrendingUp, Plus, ShieldCheck, ShoppingBag, Sparkles, MapPin } from 'lucide-react';
import { StatCard, Card, Badge, Button, ProductCard } from '../../components/ui';
import { AuthUser } from '../../services/apiService';

export const FarmerDashboardView: React.FC<{ user: AuthUser; onNavigate?: (tab: string) => void }> = ({
  user,
  onNavigate = () => {},
}) => {
  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Role Banner */}
      <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-md border border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="success" dot>
              Active Role: Farmer / FPO Producer
            </Badge>
            {user.farmInfo?.fpoName && (
              <Badge variant="earth" icon={<ShieldCheck className="w-3 h-3 text-emerald-400" />}>
                {user.farmInfo.fpoName}
              </Badge>
            )}
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-1">Welcome back, {user.name}!</h2>
          <p className="text-xs text-emerald-200 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {user.village ? `${user.village}, ` : ''}
              {user.district}, {user.state}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => onNavigate('marketplace')}>
            Post Crop Listing
          </Button>
          <Button variant="outline" size="sm" className="border-emerald-700 text-white hover:bg-emerald-800" leftIcon={<Sparkles className="w-4 h-4" />} onClick={() => onNavigate('ai-forecast')}>
            AI Demand Forecast
          </Button>
        </div>
      </div>

      {/* Farmer Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Direct Sales Revenue"
          value="₹1,48,500"
          change={24.2}
          changeLabel="vs Mandi price"
          icon={<TrendingUp className="w-5 h-5" />}
          variant="emerald"
        />
        <StatCard
          title="Active Crop Listings"
          value="4 Batches"
          subtitle="Wheat, Chana, Tomato"
          icon={<Sprout className="w-5 h-5" />}
          variant="emerald"
        />
        <StatCard
          title="Middleman Fees Saved"
          value="₹18,400"
          change={100}
          changeLabel="Direct trade profit"
          icon={<ShieldCheck className="w-5 h-5" />}
          variant="amber"
        />
        <StatCard
          title="Logistics Pickups"
          value="2 Pending"
          subtitle="Assigned to Delivery Partner"
          icon={<ShoppingBag className="w-5 h-5" />}
          variant="slate"
        />
      </div>
    </div>
  );
};
