import React, { ReactNode } from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary' | 'earth';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  className = '',
  icon,
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full tracking-wide shrink-0';

  const variants: Record<BadgeVariant, string> = {
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-200/80',
    warning: 'bg-amber-100 text-amber-900 border border-amber-200/80',
    danger: 'bg-red-100 text-red-800 border border-red-200/80',
    info: 'bg-blue-100 text-blue-800 border border-blue-200/80',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-emerald-800 text-white shadow-2xs',
    earth: 'bg-stone-200 text-stone-800 border border-stone-300',
  };

  const dotColors: Record<BadgeVariant, string> = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    neutral: 'bg-slate-400',
    primary: 'bg-emerald-300',
    earth: 'bg-stone-500',
  };

  const sizes: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
