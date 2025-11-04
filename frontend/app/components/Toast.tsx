import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast, type Toast as ToastType } from '../hooks/useToast';
import { useTheme } from '../hooks/useTheme';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
      style={{ maxWidth: '400px' }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: ToastType;
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const { currentTheme } = useTheme();

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(onClose, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, onClose]);

  const getIcon = () => {
    const iconClass = 'w-5 h-5';
    switch (toast.type) {
      case 'success':
        return <CheckCircle className={iconClass} />;
      case 'error':
        return <AlertCircle className={iconClass} />;
      case 'warning':
        return <AlertTriangle className={iconClass} />;
      case 'info':
      default:
        return <Info className={iconClass} />;
    }
  };

  const getColors = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: currentTheme.colors.success,
          text: '#ffffff',
          border: currentTheme.colors.success,
        };
      case 'error':
        return {
          bg: currentTheme.colors.error,
          text: '#ffffff',
          border: currentTheme.colors.error,
        };
      case 'warning':
        return {
          bg: currentTheme.colors.warning,
          text: '#ffffff',
          border: currentTheme.colors.warning,
        };
      case 'info':
      default:
        return {
          bg: currentTheme.colors.primary,
          text: '#ffffff',
          border: currentTheme.colors.primary,
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className="flex items-start gap-3 p-4 rounded-lg shadow-lg border pointer-events-auto toast-animate"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
      }}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
        style={{ color: colors.text }}
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

