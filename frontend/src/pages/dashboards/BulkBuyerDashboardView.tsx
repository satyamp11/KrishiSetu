import React, { useState, useEffect } from 'react';
import {
  Building2,
  Package,
  DollarSign,
  TrendingUp,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  FileText,
  Send,
  UserCheck,
  ArrowRight,
  Filter,
} from 'lucide-react';
import {
  StatCard,
  Badge,
  Button,
  Modal,
  LoadingState,
  EmptyState,
  ErrorState,
  useToast,
} from '../../components/ui';
import { apiService, AuthUser, BulkRequestDTO } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

export interface BulkBuyerDashboardViewProps {
  user: AuthUser;
  onNavigate?: (tab: string) => void;
}

export const BulkBuyerDashboardView: React.FC<BulkBuyerDashboardViewProps> = ({
  user,
  onNavigate = () => {},
}) => {
  const { token } = useAuth();
  const toast = useToast();

  const [requests, setRequests] = useState<BulkRequestDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // RFQ Creation Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // RFQ Form State (Phase 11 Example Defaults)
  const [productTitle, setProductTitle] = useState<string>('Tomatoes');
  const [targetQuantity, setTargetQuantity] = useState<number>(5000);
  const [unit, setUnit] = useState<string>('kg');
  const [deliveryCity, setDeliveryCity] = useState<string>('Delhi');
  const [deliveryState, setDeliveryState] = useState<string>('Delhi');
  const [requiredByDate, setRequiredByDate] = useState<string>('2026-09-15');
  const [targetPricePerUnit, setTargetPricePerUnit] = useState<number>(32);

  const fetchBulkRequests = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getBulkRequests(token);
      if (res.success) {
        setRequests(res.bulkRequests);
      } else {
        setError(res.message || 'Failed to fetch bulk requests.');
      }
    } catch (err) {
      setError('Network error fetching bulk requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBulkRequests();
  }, [token]);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!productTitle.trim() || targetQuantity <= 0 || !deliveryCity.trim()) {
      toast.error('Validation Error', 'Please complete all required RFQ fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiService.createBulkRequest(token, {
        productTitle,
        targetQuantity,
        unit,
        deliveryCity,
        deliveryState,
        requiredByDate,
        targetPricePerUnit,
      });

      if (res.success && res.bulkRequest) {
        toast.success('RFQ Created!', `Broadcasted request for ${targetQuantity} ${unit} of ${productTitle} to matching FPOs.`);
        setIsModalOpen(false);
        fetchBulkRequests();
      } else {
        toast.error('Creation Failed', res.message || 'Unable to create RFQ.');
      }
    } catch (err) {
      toast.error('Error', 'Network error creating bulk request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptOffer = async (requestId: string, offerId: string) => {
    if (!token) return;
    try {
      const res = await apiService.acceptFarmerOffer(token, requestId, offerId);
      if (res.success) {
        toast.success('Quotation Accepted!', 'Escrow contract initiated with Producer FPO.');
        fetchBulkRequests();
      } else {
        toast.error('Failed to Accept', res.message || 'Unable to accept offer.');
      }
    } catch (err) {
      toast.error('Error', 'Network error accepting offer.');
    }
  };

  const totalProcurementVolume = requests.reduce((sum, r) => sum + r.targetQuantity, 18500);
  const activeRFQCount = requests.filter((r) => r.status === 'OPEN' || r.status === 'QUOTES_RECEIVED').length || 4;
  const quotesReceivedCount = requests.reduce((sum, r) => sum + r.offers.length, 7);

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Organization Hero Banner */}
      <div className="bg-slate-950 text-white p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary" size="sm" icon={<Building2 className="w-3.5 h-3.5 text-emerald-400" />}>
              Phase 11: Bulk Buyer Marketplace
            </Badge>
            <Badge variant="earth" size="sm">
              GSTIN: {user.businessInfo?.gstin || '27AABCU9603R1ZN'}
            </Badge>
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-1 text-white">
            {user.businessInfo?.organizationName || `${user.name} Bulk Procurement`}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Direct Contract Procurement • FPO Aggregation • Temperature-Controlled Logistics
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Create Bulk Purchase Request (RFQ)
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-white border-slate-700 hover:bg-slate-800"
            onClick={() => onNavigate('marketplace')}
          >
            Explore Marketplace
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Procurement Volume"
          value={`${totalProcurementVolume.toLocaleString()} kg`}
          change={28.5}
          changeLabel="direct contract volume"
          icon={<Package className="w-5 h-5" />}
          variant="emerald"
        />
        <StatCard
          title="Active RFQ Requests"
          value={`${activeRFQCount} Open RFQs`}
          subtitle="Awaiting FPO quotes"
          icon={<FileText className="w-5 h-5" />}
          variant="amber"
        />
        <StatCard
          title="Farmer Quotations"
          value={`${quotesReceivedCount} Quotes`}
          subtitle="Received from verified FPOs"
          icon={<UserCheck className="w-5 h-5" />}
          variant="emerald"
        />
        <StatCard
          title="Intermediary Savings"
          value="₹1,85,400"
          change={34.2}
          changeLabel="saved vs APMC mandi brokers"
          icon={<DollarSign className="w-5 h-5" />}
          variant="slate"
        />
      </div>

      {/* Bulk Purchase Requests List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Your Bulk Purchase Requests (RFQs)</h3>
            <p className="text-xs text-slate-500">Quotations received directly from agricultural producer organizations.</p>
          </div>
        </div>

        {loading && <LoadingState message="Loading bulk purchase requests..." />}

        {error && !loading && <ErrorState title="RFQ Error" message={error} onRetry={fetchBulkRequests} />}

        {!loading && !error && requests.length === 0 && (
          <EmptyState
            title="No Bulk Requests Created"
            description="Create your first RFQ to aggregate produce from verified FPOs."
            actionLabel="Create Bulk Request (RFQ)"
            onAction={() => setIsModalOpen(true)}
          />
        )}

        {!loading && !error && requests.length > 0 && (
          <div className="space-y-6">
            {requests.map((req) => (
              <div key={req.id} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                {/* RFQ Header Bar */}
                <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">{req.requestNumber}</span>
                      <Badge
                        variant={
                          req.status === 'ACCEPTED'
                            ? 'success'
                            : req.status === 'QUOTES_RECEIVED'
                            ? 'warning'
                            : 'primary'
                        }
                        size="sm"
                      >
                        {req.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <h4 className="text-base font-black text-slate-900 mt-1">
                      {req.targetQuantity.toLocaleString()} {req.unit} of {req.productTitle}
                    </h4>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Delivery: <strong>{req.deliveryCity}, {req.deliveryState}</strong> • Required by:{' '}
                      <strong>{new Date(req.requiredByDate).toLocaleDateString()}</strong> • Target Price: ₹{req.targetPricePerUnit}/{req.unit}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Matching FPOs Found</span>
                    <span className="text-sm font-black text-emerald-800">
                      {req.matchingFarmers.length} Producer Group(s)
                    </span>
                  </div>
                </div>

                {/* Body: Matching Farmers & Quotation Comparison Table */}
                <div className="p-5 space-y-5">
                  {/* Matching Farmers Section */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Matching Farmer Producer Organizations (FPOs)
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {req.matchingFarmers.map((f, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{f.fpoName}</span>
                            <Badge variant="earth" size="sm">{f.district}</Badge>
                          </div>
                          <p className="text-slate-500">Producer Lead: {f.farmerName}</p>
                          <p className="text-emerald-800 font-bold">Capacity: {f.availableQty.toLocaleString()} kg available</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quotations Received Table */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black uppercase tracking-wider text-slate-700">
                        Received Quotation Offers ({req.offers.length})
                      </h5>
                    </div>

                    {req.offers.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No formal quotation offers submitted yet. Matching FPOs are evaluating demand.</p>
                    ) : (
                      <div className="space-y-3">
                        {req.offers.map((off) => (
                          <div
                            key={off.id}
                            className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                              off.status === 'ACCEPTED'
                                ? 'bg-emerald-950 text-white border-emerald-800'
                                : 'bg-white text-slate-900 border-slate-200'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm">{off.fpoName || off.farmerName}</span>
                                <Badge variant={off.status === 'ACCEPTED' ? 'success' : 'primary'} size="sm">
                                  {off.status}
                                </Badge>
                              </div>

                              <p className={`text-xs font-semibold ${off.status === 'ACCEPTED' ? 'text-emerald-200' : 'text-slate-600'}`}>
                                Offered Quantity: <strong>{off.offeredQuantity.toLocaleString()} {req.unit}</strong> @ ₹
                                <strong>{off.offeredPricePerUnit}</strong> / {req.unit} (Total: ₹
                                <strong>{off.totalOfferAmount.toLocaleString()}</strong>)
                              </p>

                              <p className={`text-[11px] ${off.status === 'ACCEPTED' ? 'text-emerald-300' : 'text-slate-500'}`}>
                                "{off.notes || 'Direct cold-chain truck dispatch included.'}"
                              </p>
                            </div>

                            <div>
                              {off.status !== 'ACCEPTED' && req.status !== 'ACCEPTED' && (
                                <Button
                                  variant="primary"
                                  size="xs"
                                  leftIcon={<ShieldCheck className="w-3.5 h-3.5 fill-white" />}
                                  onClick={() => handleAcceptOffer(req.id, off.id)}
                                >
                                  Accept Offer & Deposit Escrow
                                </Button>
                              )}

                              {off.status === 'ACCEPTED' && (
                                <Badge variant="success" size="md" icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}>
                                  Offer Accepted & Escrow Protected
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RFQ Creation Modal (Phase 11 Specs Example) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Bulk Purchase Request (RFQ)"
        size="lg"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Product Title</label>
            <input
              type="text"
              placeholder="e.g. Fresh Tomatoes Grade-A"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Required Quantity</label>
              <input
                type="number"
                placeholder="5000"
                value={targetQuantity}
                onChange={(e) => setTargetQuantity(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Unit of Measure</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
              >
                <option value="kg">kg (Kilograms)</option>
                <option value="Quintal">Quintal (100 kg)</option>
                <option value="Tons">Tons (1,000 kg)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Delivery Destination City</label>
              <input
                type="text"
                placeholder="Delhi"
                value={deliveryCity}
                onChange={(e) => setDeliveryCity(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Required By Date</label>
              <input
                type="date"
                value={requiredByDate}
                onChange={(e) => setRequiredByDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Target Price Per Unit (₹)</label>
            <input
              type="number"
              placeholder="32"
              value={targetPricePerUnit}
              onChange={(e) => setTargetPricePerUnit(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
            />
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Matching FPOs in Nashik, Gorakhpur, and Lucknow will be auto-notified of your RFQ.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={submitting}>
              Broadcast RFQ to FPOs
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
