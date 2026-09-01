import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl border border-slate-200 z-10 overflow-hidden transform transition-all animate-in fade-in zoom-in-95`}
      >
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div>
              {title && typeof title === 'string' ? (
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              ) : (
                title
              )}
              {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 p-1.5 rounded-lg transition-colors ml-auto"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">{children}</div>

        {/* Modal Footer */}
        {footer && <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-100 bg-slate-50/60">{footer}</div>}
      </div>
    </div>
  );
};
