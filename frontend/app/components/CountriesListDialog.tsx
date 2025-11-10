import { useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

interface Country {
  name: string;
  flag: string;
  continent: string;
}

interface CountriesListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  countries: Country[];
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export default function CountriesListDialog({
  isOpen,
  onClose,
  countries,
  title,
  icon: Icon,
  color
}: CountriesListDialogProps) {
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

      <div
        className="relative rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col"
        style={{
          backgroundColor: currentTheme.colors.surface,
          borderColor: currentTheme.colors.border,
          border: `1px solid ${currentTheme.colors.border}`
        }}
      >
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: currentTheme.colors.border }}
        >
          <h2
            className="text-lg font-semibold flex items-center gap-2"
            style={{ color: currentTheme.colors.textPrimary }}
          >
            <Icon className="w-5 h-5" />
            {title} ({countries.length})
          </h2>
          <button
            onClick={onClose}
            style={{ color: currentTheme.colors.textMuted }}
            className="hover:opacity-70 transition-opacity"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {countries.length > 0 ? (
              [...countries].sort((a, b) => a.name.localeCompare(b.name)).map((country, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 rounded"
                  style={{ backgroundColor: `${color}10` }}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{country.flag}</span>
                    <span
                      className="font-medium text-sm"
                      style={{ color: currentTheme.colors.textPrimary }}
                    >
                      {country.name}
                    </span>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${color}20`,
                      color: color
                    }}
                  >
                    {country.continent}
                  </span>
                </div>
              ))
            ) : (
              <div
                className="text-center py-8"
                style={{ color: currentTheme.colors.textMuted }}
              >
                <Icon className="w-12 h-12 mx-auto mb-2" />
                <p>No countries in this list</p>
              </div>
            )}
          </div>
        </div>

        <div
          className="flex justify-end p-4 border-t rounded-b-lg"
          style={{
            backgroundColor: currentTheme.colors.surfaceSecondary,
            borderColor: currentTheme.colors.border
          }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md transition-colors"
            style={{
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border,
              color: currentTheme.colors.textSecondary,
              border: `1px solid ${currentTheme.colors.border}`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.colors.surfaceSecondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

