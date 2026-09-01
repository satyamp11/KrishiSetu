import React from 'react';
import { ShoppingBag, Truck, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import { StatCard, Badge, Button } from '../../components/ui';
import { AuthUser } from '../../services/apiService';

export const ConsumerDashboardView: React.FC<{ user: AuthUser; onNavigate?: (tab: string) => void }> = ({
  user,
  onNavigate = () => {},
}) => {
  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Role Banner */}
      <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-md border border-blue-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="info" dot>
              Active Role: Consumer / Household Buyer
            </Badge>
            <Badge variant="success" icon={<ShieldCheck className="w-3 h-3 text-emerald-400" />}>
              Direct Farm Fresh
            </Badge>
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-1">Hello, {user.name}!</h2>
          <p className="text-xs text-blue-200 mt-1">
            Delivering fresh farm produce directly to: {user.deliveryAddress?.streetAddress || user.district || 'Your Address'}
          </p>
        </div>

        <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => onNavigate('marketplace')}>
          Browse Produce Catalog
        </Button>
      </div>

      {/* Consumer Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Direct Farm Orders"
          value="12 Orders"
          subtitle="Total fulfilled"
          icon={<ShoppingBag className="w-5 h-5" />}
          variant="emerald"
        />
        <StatCard
          title="Grocery Savings"
          value="₹3,450"
          change={19.5}
          changeLabel="vs retail supermarket"
          icon={<Heart className="w-5 h-5" />}
          variant="amber"
        />
        <StatCard
          title="In-Transit Delivery"
          value="1 Active"
          subtitle="Sharbati Wheat (25 kg)"
          icon={<Truck className="w-5 h-5" />}
          variant="slate"
        />
        <StatCard
          title="Verified Farmers Supported"
          value="6 FPOs"
          subtitle="Gorakhpur & Nashik"
          icon={<ShieldCheck className="w-5 h-5" />}
          variant="emerald"
        />
      </div>
    </div>
  );
};
