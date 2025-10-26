import { useEffect, useState } from 'react';
import { X, Search, Globe, Bookmark } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { COUNTRIES, type Country } from '../config/countries';

interface CountryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitedCountries: string[];
  wishlistCountries: string[];
  onUpdateCountries: (visited: string[], wishlist: string[]) => void;
}

export default function CountryManagementModal({
  isOpen,
  onClose,
  visitedCountries,
  wishlistCountries,
  onUpdateCountries
}: CountryManagementModalProps) {
  const { currentTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [localVisited, setLocalVisited] = useState<string[]>(visitedCountries);
  const [localWishlist, setLocalWishlist] = useState<string[]>(wishlistCountries);

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

  useEffect(() => {
    setLocalVisited(visitedCountries);
    setLocalWishlist(wishlistCountries);
  }, [visitedCountries, wishlistCountries]);

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCountryStatus = (countryName: string) => {
    if (localVisited.includes(countryName)) return 'visited';
    if (localWishlist.includes(countryName)) return 'wishlist';
    return 'none';
  };

  const toggleVisited = (countryName: string) => {
    const newVisited = localVisited.includes(countryName)
      ? localVisited.filter(name => name !== countryName)
      : [...localVisited, countryName];

    // Remove from wishlist if adding to visited
    const newWishlist = localWishlist.filter(name => name !== countryName);

    setLocalVisited(newVisited);
    setLocalWishlist(newWishlist);
  };

  const toggleWishlist = (countryName: string) => {
    const newWishlist = localWishlist.includes(countryName)
      ? localWishlist.filter(name => name !== countryName)
      : [...localWishlist, countryName];

    // Remove from visited if adding to wishlist
    const newVisited = localVisited.filter(name => name !== countryName);

    setLocalVisited(newVisited);
    setLocalWishlist(newWishlist);
  };

  const handleSave = () => {
    onUpdateCountries(localVisited, localWishlist);
    onClose();
  };

  const handleCancel = () => {
    setLocalVisited(visitedCountries);
    setLocalWishlist(wishlistCountries);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleCancel}
      />

      <div className="relative theme-surface rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col theme-border border">
        <div className="flex items-center justify-between p-6 theme-border border-b">
          <h2 className="text-xl font-semibold theme-text-primary">
            Manage Countries
          </h2>
          <button
            onClick={handleCancel}
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

        <div className="flex justify-end space-x-3 p-6 theme-border border-t theme-surface-secondary rounded-b-lg">
          <button
            onClick={handleCancel}
            className="px-4 py-2 theme-text-secondary theme-surface theme-border border rounded-md hover:theme-surface-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 theme-primary text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
