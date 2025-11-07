import { useEffect } from 'react';
import { Globe, Bookmark } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useCountryData } from '../hooks/useCountryData';
import { getCountryFlag } from '../config/countries';

interface CountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  countryName: string;
  countryCode?: string;
}

export default function CountryModal({ isOpen, onClose, countryName, countryCode }: CountryModalProps) {
  const { currentTheme } = useTheme();
  const { visitedCountries, wishlistCountries, updateCountry } = useCountryData();

  const getCountryStatus = () => {
    if (visitedCountries.includes(countryName)) return 'visited';
    if (wishlistCountries.includes(countryName)) return 'wishlist';
    return 'none';
  };

  const toggleVisited = async () => {
    const currentStatus = getCountryStatus();
    const newStatus = currentStatus === 'visited' ? null : 'visited';

    try {
      await updateCountry(countryName, newStatus);
    } catch (error) {
      console.error('Error updating country status:', error);
    }
  };

  const toggleWishlist = async () => {
    const currentStatus = getCountryStatus();
    const newStatus = currentStatus === 'wishlist' ? null : 'wishlist';

    try {
      await updateCountry(countryName, newStatus);
    } catch (error) {
      console.error('Error updating country status:', error);
    }
  };

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
          <h2 className="text-xl font-semibold theme-text-primary flex items-center gap-2">
            <span className="text-2xl">{getCountryFlag(countryName)}</span>
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
              <label className="block text-sm font-medium theme-text-secondary mb-3">
                Status
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={toggleVisited}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    getCountryStatus() === 'visited'
                      ? 'text-white'
                      : 'theme-text-secondary theme-border border hover:theme-surface-secondary'
                  }`}
                  style={{
                    backgroundColor: getCountryStatus() === 'visited' ? currentTheme.colors.success : 'transparent'
                  }}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Visited
                </button>

                <button
                  onClick={toggleWishlist}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    getCountryStatus() === 'wishlist'
                      ? 'text-white'
                      : 'theme-text-secondary theme-border border hover:theme-surface-secondary'
                  }`}
                  style={{
                    backgroundColor: getCountryStatus() === 'wishlist' ? currentTheme.colors.warning : 'transparent'
                  }}
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 theme-border border-t theme-surface-secondary rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 theme-text-secondary theme-surface theme-border border rounded-md hover:theme-surface-secondary transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

