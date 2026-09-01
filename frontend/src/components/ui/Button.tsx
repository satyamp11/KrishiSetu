import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'earthy';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-lg';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-emerald-700 hover:bg-emerald-800 text-white focus:ring-emerald-600 shadow-xs hover:shadow-md active:bg-emerald-900',
    secondary:
      'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 focus:ring-emerald-500 shadow-xs border border-emerald-200',
    outline:
      'border border-emerald-700 text-emerald-800 hover:bg-emerald-50 focus:ring-emerald-600 bg-transparent',
    ghost:
      'text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400 bg-transparent',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-xs active:bg-red-800',
    earthy:
      'bg-stone-800 hover:bg-stone-900 text-amber-50 focus:ring-stone-600 shadow-xs border border-stone-700',
  };

  const sizes: Record<ButtonSize, string> = {
    xs: 'px-2.5 py-1 text-xs gap-1.5',
    sm: 'px-3.5 py-1.5 text-xs font-semibold gap-1.5',
    md: 'px-4 py-2 text-sm font-semibold gap-2',
    lg: 'px-6 py-3 text-base font-semibold gap-2.5',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 shrink-0 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
