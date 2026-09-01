import React, { ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Produce Available',
  description = 'No crop listings match your current filters. Try searching for a different crop, state, or category.',
  icon = <PackageOpen className="w-10 h-10 text-emerald-600" />,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
    >
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-4">{icon}</div>

      <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 mt-1.5 leading-relaxed max-w-sm">{description}</p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && onAction && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
