import React, { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, fullWidth = true, className = '', id, disabled, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <div className={`${widthStyle} flex flex-col space-y-1.5`}>
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 tracking-wide">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 pointer-events-none text-slate-400 flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`
              w-full rounded-lg border bg-white text-slate-900 text-sm placeholder:text-slate-400
              transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600
              disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
              ${leftIcon ? 'pl-9' : 'pl-3.5'}
              ${rightIcon ? 'pr-9' : 'pr-3.5'}
              py-2.5
              ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300'}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 pointer-events-none text-slate-400 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs font-medium text-red-600 mt-1 flex items-center gap-1">
            <span>⚠️</span>
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
