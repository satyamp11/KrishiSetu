import React, { SelectHTMLAttributes, ReactNode, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  fullWidth?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, options, error, helperText, leftIcon, fullWidth = true, placeholder, className = '', id, disabled, ...props },
    ref
  ) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <div className={`${widthStyle} flex flex-col space-y-1.5`}>
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-slate-700 tracking-wide">
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
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`
              w-full appearance-none rounded-lg border bg-white text-slate-900 text-sm
              transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600
              disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
              ${leftIcon ? 'pl-9' : 'pl-3.5'}
              pr-10 py-2.5
              ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300'}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
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

Select.displayName = 'Select';
