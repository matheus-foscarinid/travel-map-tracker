import { useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

interface CountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  countryName: string;
  countryCode?: string;
}

export default function CountryModal({ isOpen, onClose, countryName, countryCode }: CountryModalProps) {
  const { currentTheme } = useTheme();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div className="relative theme-surface rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all theme-border border">
        <div className="flex items-center justify-between p-6 theme-border border-b">
          <h2 className="text-xl font-semibold theme-text-primary">
            {countryName}
          </h2>
          <button
            onClick={onClose}
            className="theme-text-muted hover:theme-text-secondary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium theme-text-secondary mb-1">
                Country Name
              </label>
              <p className="theme-text-primary">{countryName}</p>
            </div>

            {countryCode && (
              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-1">
                  Country Code
                </label>
                <p className="theme-text-primary">{countryCode}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium theme-text-secondary mb-1">
                Status
              </label>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: `${currentTheme.colors.success}20`,
                    color: currentTheme.colors.success
                  }}
                >
                  Visited
                </button>
                <button
                  className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: `${currentTheme.colors.warning}20`,
                    color: currentTheme.colors.warning
                  }}
                >
                  Wishlist
                </button>
                <button
                  className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: `${currentTheme.colors.mapDefault}20`,
                    color: currentTheme.colors.mapDefault
                  }}
                >
                  Not Visited
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 theme-border border-t theme-surface-secondary rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 theme-text-secondary theme-surface theme-border border rounded-md hover:theme-surface-secondary transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 theme-primary text-white rounded-md hover:bg-indigo-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

