import React, { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'outline' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'bg-white rounded-xl transition-all duration-200 overflow-hidden';

  const variants = {
    default: 'border border-slate-200/80 shadow-xs hover:shadow-md',
    flat: 'bg-slate-50 border border-slate-100',
    outline: 'border-2 border-slate-200 shadow-none',
    interactive:
      'border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-emerald-500/60 cursor-pointer transform hover:-translate-y-0.5',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`mb-3 flex items-center justify-between border-b border-slate-100 pb-3 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-base sm:text-lg font-bold text-slate-900 tracking-tight ${className}`}>{children}</h3>
);

export const CardDescription: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed ${className}`}>{children}</p>
);

export const CardContent: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`space-y-3 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`mt-4 pt-3 border-t border-slate-100 flex items-center justify-between ${className}`}>
    {children}
  </div>
);
