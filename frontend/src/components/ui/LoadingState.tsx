import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'white' | 'slate';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'emerald', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-3',
    lg: 'w-10 h-10 border-4',
  };

  const colors = {
    emerald: 'border-emerald-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    slate: 'border-slate-600 border-t-transparent',
  };

  return (
    <div
      className={`rounded-full animate-spin ${sizes[size]} ${colors[color]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export const LoadingState: React.FC<{ message?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  message = 'Loading platform data...',
  size = 'md',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 text-center">
      <Spinner size={size} />
      {message && <p className="text-xs font-semibold text-slate-500 tracking-wide">{message}</p>}
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 animate-pulse">
      <div className="h-36 bg-slate-100 rounded-lg w-full" />
      <div className="h-4 bg-slate-100 rounded w-3/4" />
      <div className="h-3 bg-slate-100 rounded w-1/2" />
      <div className="h-8 bg-slate-100 rounded w-full mt-4" />
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-10 bg-slate-100 border-b border-slate-200" />
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between space-x-4">
            <div className="h-4 bg-slate-100 rounded w-1/4" />
            <div className="h-4 bg-slate-100 rounded w-1/4" />
            <div className="h-4 bg-slate-100 rounded w-1/4" />
            <div className="h-4 bg-slate-100 rounded w-1/6" />
          </div>
        ))}
      </div>
    </div>
  );
};
