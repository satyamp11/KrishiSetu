import React from 'react';
import { ShieldCheck, Users, TrendingUp, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { StatCard, Badge, Button } from '../../components/ui';
import { AuthUser } from '../../services/apiService';

export const AdminDashboardView: React.FC<{ user: AuthUser; onNavigate?: (tab: string) => void }> = ({
  user,
  onNavigate = () => {},
}) => {
  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Role Banner */}
      <div className="bg-slate-950 text-white p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="primary" dot>
              Active Role: Platform System Administrator
            </Badge>
            <Badge variant="earth" icon={<ShieldCheck className="w-3 h-3 text-emerald-400" />}>
              Full Governance Access
            </Badge>
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-1">Platform Control Center: {user.name}</h2>
          <p className="text-xs text-slate-300 mt-1">
            Monitoring Farmers, FPOs, Consumers, Bulk Buyers, Delivery Partners & AI Models
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => onNavigate('marketplace')}>
          System Audit Logs
        </Button>
      </div>

      {/* Admin Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Users"
          value="4,850 Users"
          subtitle="Across 5 Roles"
          icon={<Users className="w-5 h-5" />}
          variant="emerald"
        />
        <StatCard
          title="Gross Trade Value (GTV)"
          value="₹1.48 Crore"
          change={42.8}
          changeLabel="Direct Agri GMV"
          icon={<TrendingUp className="w-5 h-5" />}
          variant="emerald"
        />
        <StatCard
          title="Verified FPO Network"
          value="142 FPOs"
          subtitle="Gorakhpur & Nashik"
          icon={<ShieldCheck className="w-5 h-5" />}
          variant="amber"
        />
        <StatCard
          title="AI Disease Risk Hotspots"
          value="2 Active"
          subtitle="Outbreak warnings"
          icon={<AlertTriangle className="w-5 h-5" />}
          variant="slate"
        />
      </div>
    </div>
  );
};
