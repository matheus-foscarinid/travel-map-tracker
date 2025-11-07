import { useEffect, useState } from 'react';
import { X, Search, Globe, Bookmark } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { COUNTRIES, type Country } from '../config/countries';

interface CountryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitedCountries: string[];
  wishlistCountries: string[];
  onUpdateCountry: (countryName: string, status: 'visited' | 'wishlist' | null) => Promise<void>;
}

export default function CountryManagementModal({
  isOpen,
  onClose,
  visitedCountries,
  wishlistCountries,
  onUpdateCountry
}: CountryManagementModalProps) {
  const { currentTheme } = useTheme();
  const { showError } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCountryStatus = (countryName: string) => {
    if (visitedCountries.includes(countryName)) return 'visited';
    if (wishlistCountries.includes(countryName)) return 'wishlist';
    return 'none';
  };

  const toggleVisited = async (countryName: string) => {
    const currentStatus = getCountryStatus(countryName);
    const newStatus = currentStatus === 'visited' ? null : 'visited';

    try {
      await onUpdateCountry(countryName, newStatus);
    } catch (error) {
      console.error('Error updating country:', error);
      showError('Failed to update country status');
    }
  };

  const toggleWishlist = async (countryName: string) => {
    const currentStatus = getCountryStatus(countryName);
    const newStatus = currentStatus === 'wishlist' ? null : 'wishlist';

    try {
      await onUpdateCountry(countryName, newStatus);
    } catch (error) {
      console.error('Error updating country:', error);
      showError('Failed to update country status');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div className="relative theme-surface rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col theme-border border">
        <div className="flex items-center justify-between p-6 theme-border border-b">
          <h2 className="text-xl font-semibold theme-text-primary">
            Manage Countries
          </h2>
          <button
            onClick={onClose}
            className="theme-text-muted hover:theme-text-secondary transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 theme-border border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 theme-text-muted" />
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 theme-border border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 theme-surface theme-text-primary"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCountries.map((country) => {
              const status = getCountryStatus(country.name);
              return (
                <div
                  key={country.code}
                  className={`p-4 rounded-lg border transition-all ${
                    status === 'visited'
                      ? 'theme-border border-2'
                      : status === 'wishlist'
                      ? 'theme-border border-2'
                      : 'theme-border border'
                  }`}
                  style={{
                    backgroundColor: status === 'visited'
                      ? `${currentTheme.colors.success}10`
                      : status === 'wishlist'
                      ? `${currentTheme.colors.warning}10`
                      : 'transparent'
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{country.flag}</span>
                      <span className="font-medium theme-text-primary">{country.name}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleVisited(country.name)}
                      className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        status === 'visited'
                          ? 'text-white'
                          : 'theme-text-secondary theme-border border hover:theme-surface-secondary'
                      }`}
                      style={{
                        backgroundColor: status === 'visited' ? currentTheme.colors.success : 'transparent'
                      }}
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      Visited
                    </button>

                    <button
                      onClick={() => toggleWishlist(country.name)}
                      className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        status === 'wishlist'
                          ? 'text-white'
                          : 'theme-text-secondary theme-border border hover:theme-surface-secondary'
                      }`}
                      style={{
                        backgroundColor: status === 'wishlist' ? currentTheme.colors.warning : 'transparent'
                      }}
                    >
                      <Bookmark className="w-4 h-4 mr-1" />
                      Wishlist
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
