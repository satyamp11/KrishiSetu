import React from 'react';
import { Building2, TrendingUp, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import { StatCard, Badge, Button } from '../../components/ui';
import { AuthUser } from '../../services/apiService';

export const BulkBuyerDashboardView: React.FC<{ user: AuthUser; onNavigate?: (tab: string) => void }> = ({
  user,
  onNavigate = () => {},
}) => {
  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Role Banner */}
      <div className="bg-amber-950 text-white p-6 rounded-2xl shadow-md border border-amber-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="warning" dot>
              Active Role: Bulk B2B Procurement Buyer
            </Badge>
            {user.businessInfo?.organizationName && (
              <Badge variant="earth" icon={<Building2 className="w-3 h-3 text-amber-400" />}>
                {user.businessInfo.organizationName}
              </Badge>
            )}
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-1">Welcome, {user.name}!</h2>
          <p className="text-xs text-amber-200 mt-1">
            B2B Procurement Portal • GSTIN: {user.businessInfo?.gstin || 'Verified Enterprise'}
          </p>
        </div>

        <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => onNavigate('marketplace')}>
          Create Bulk Procurement Contract
        </Button>
      </div>

      {/* Bulk Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Procurement Volume"
          value="450 Quintals"
          change={32.1}
          changeLabel="quarterly bulk contracts"
          icon={<Building2 className="w-5 h-5" />}
          variant="amber"
        />
        <StatCard
          title="B2B Cost Savings"
          value="₹1,84,000"
          change={16.8}
          changeLabel="vs mandi APMC commission"
          icon={<TrendingUp className="w-5 h-5" />}
          variant="emerald"
        />
        <StatCard
          title="Active FPO Contracts"
          value="8 Contracts"
          subtitle="Wheat, Chana & Mustard"
          icon={<FileText className="w-5 h-5" />}
          variant="slate"
        />
        <StatCard
          title="Escrow Protected Funds"
          value="₹4,50,000"
          subtitle="Quality inspection pending"
          icon={<ShieldCheck className="w-5 h-5" />}
          variant="emerald"
        />
      </div>
    </div>
  );
};
