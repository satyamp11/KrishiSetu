import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (item: Omit<ToastItem, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((title: string, message?: string) => toast({ type: 'success', title, message }), [toast]);
  const error = useCallback((title: string, message?: string) => toast({ type: 'error', title, message }), [toast]);
  const warning = useCallback((title: string, message?: string) => toast({ type: 'warning', title, message }), [toast]);
  const info = useCallback((title: string, message?: string) => toast({ type: 'info', title, message }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div
        aria-live="assertive"
        className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-md w-full px-4 sm:px-0 pointer-events-none"
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} item={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastCard: React.FC<{ item: ToastItem; onClose: () => void }> = ({ item, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-emerald-700 shrink-0" />,
  };

  const borders = {
    success: 'border-l-4 border-l-emerald-600 border-slate-200 bg-white',
    error: 'border-l-4 border-l-red-600 border-slate-200 bg-white',
    warning: 'border-l-4 border-l-amber-500 border-slate-200 bg-white',
    info: 'border-l-4 border-l-emerald-700 border-slate-200 bg-white',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start p-4 rounded-lg border shadow-lg ${borders[item.type]} transition-all duration-300 transform translate-y-0`}
    >
      <div className="mr-3 mt-0.5">{icons[item.type]}</div>
      <div className="flex-1 mr-2">
        <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
        {item.message && <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.message}</p>}
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
