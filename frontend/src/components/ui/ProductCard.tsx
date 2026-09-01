import React from 'react';
import { MapPin, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';

export interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  price: number; // e.g. 2450
  unit: string; // e.g. "Quintal" or "kg"
  mandiPrice?: number; // e.g. 2100 benchmark mandi price
  farmerName: string;
  location: string; // e.g. "Gorakhpur, UP"
  verifiedFPO?: boolean;
  minOrderQty?: string; // e.g. "50 kg"
  harvestDate?: string;
  image?: string;
  onAction?: (id: string) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  category,
  price,
  unit,
  mandiPrice,
  farmerName,
  location,
  verifiedFPO = false,
  minOrderQty = '1 Quintal',
  harvestDate = 'Fresh Harvest',
  image = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80',
  onAction,
  className = '',
}) => {
  // Profit calculation vs standard mandi
  const extraGainPercentage = mandiPrice ? Math.round(((price - mandiPrice) / mandiPrice) * 100) : null;

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col group ${className}`}
    >
      {/* Image container */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Badge variant="primary" size="sm">
            {category}
          </Badge>
          {verifiedFPO && (
            <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
              Verified FPO
            </Badge>
          )}
        </div>
        {extraGainPercentage && extraGainPercentage > 0 && (
          <div className="absolute bottom-3 right-3 bg-amber-500 text-stone-950 font-bold text-[11px] px-2 py-0.5 rounded-md shadow-xs">
            +{extraGainPercentage}% Farmer Gain
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-1">
              {title}
            </h4>
          </div>

          <div className="flex items-center text-xs text-slate-500 mt-1 gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{location} • By <strong className="text-slate-700">{farmerName}</strong></span>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Direct Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-emerald-800">₹{price.toLocaleString()}</span>
              <span className="text-xs text-slate-500 font-medium">/ {unit}</span>
            </div>
          </div>

          {mandiPrice && (
            <div className="text-right border-l border-slate-200 pl-3">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Mandi Benchmark</span>
              <span className="text-xs font-semibold text-slate-500 line-through">₹{mandiPrice.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Info pills */}
        <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>Min Qty: <strong className="text-slate-900">{minOrderQty}</strong></span>
          <span>{harvestDate}</span>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          size="sm"
          fullWidth
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          onClick={() => onAction && onAction(id)}
        >
          Direct Purchase
        </Button>
      </div>
    </div>
  );
};
