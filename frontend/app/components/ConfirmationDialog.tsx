import { useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: string;
  isLoading?: boolean;
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonColor,
  isLoading = false
}: ConfirmationDialogProps) {
  const { currentTheme } = useTheme();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleBackdropClick}
      />

      <div
        className="relative rounded-lg shadow-xl max-w-md w-full mx-4 theme-surface theme-border border"
      >
        <div className="flex items-center justify-between p-6 theme-border border-b">
          <div className="flex items-center gap-3">
            <AlertTriangle
              className="w-6 h-6"
              style={{ color: confirmButtonColor || currentTheme.colors.warning }}
            />
            <h2 className="text-xl font-semibold theme-text-primary">
              {title}
            </h2>
          </div>
          {!isLoading && (
            <button
              onClick={onClose}
              className="theme-text-muted hover:theme-text-secondary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="p-6">
          <p className="theme-text-secondary mb-6">
            {message}
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 theme-border border rounded-md theme-text-secondary hover:theme-surface-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-4 py-2 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: confirmButtonColor || currentTheme.colors.error || '#dc2626'
              }}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

