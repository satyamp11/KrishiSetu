import React, { ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  icon?: ReactNode;
  variant?: 'banner' | 'card' | 'full';
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Data',
  message = 'A network error occurred while connecting to the KrishiSetu servers. Please verify your internet connection and try again.',
  onRetry,
  icon = <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />,
  variant = 'card',
  className = '',
}) => {
  if (variant === 'banner') {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 text-sm ${className}`}>
        {icon}
        <div className="flex-1">
          <h4 className="font-bold text-red-900">{title}</h4>
          <p className="text-xs text-red-700 mt-0.5">{message}</p>
        </div>
        {onRetry && (
          <Button variant="danger" size="xs" onClick={onRetry} leftIcon={<RefreshCw className="w-3 h-3" />}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl border border-red-100 shadow-xs p-8 text-center flex flex-col items-center justify-center max-w-md mx-auto ${className}`}
    >
      <div className="p-3.5 bg-red-50 rounded-2xl border border-red-100 mb-3.5">{icon}</div>

      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{message}</p>

      {onRetry && (
        <div className="mt-5">
          <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
