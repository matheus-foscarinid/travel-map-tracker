import { useEffect, useState } from 'react';
import { X, Search, Globe, Bookmark, Calendar } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { COUNTRIES, type Country } from '../config/countries';
import { useCountryData } from '../hooks/useCountryData';

interface CountryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitedCountries: string[];
  wishlistCountries: string[];
  onUpdateCountry: (countryName: string, status: 'visited' | 'wishlist' | null, visitStartDate?: string, visitEndDate?: string) => Promise<void>;
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
  const { getCountryDates } = useCountryData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

  const openDatePicker = (countryName: string) => {
    const dates = getCountryDates(countryName);
    setSelectedCountry(countryName);
    setStartDate(dates.startDate || '');
    setEndDate(dates.endDate || '');
  };

  const closeDatePicker = () => {
    setSelectedCountry(null);
    setStartDate('');
    setEndDate('');
  };

  const saveDates = async () => {
    if (!selectedCountry) return;

    const currentStatus = getCountryStatus(selectedCountry);
    if (currentStatus === 'visited') {
      try {
        await onUpdateCountry(selectedCountry, 'visited', startDate, endDate);
        closeDatePicker();
      } catch (error) {
        console.error('Error updating country dates:', error);
        showError('Failed to update travel dates');
      }
    }
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

  const getFormattedDateRange = (startDate: string | null, endDate: string | null) => {
    let result = '';
    if (startDate) result += new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (startDate && endDate) result += ' - ';
    if (endDate) result += new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return result;
  }

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
                    {status === 'visited' && (
                      <button
                        onClick={() => openDatePicker(country.name)}
                        className="p-1 rounded hover:theme-surface-secondary theme-text-muted"
                        title="Edit travel dates"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {status === 'visited' && (() => {
                    const dates = getCountryDates(country.name);
                    return dates.startDate || dates.endDate ? (
                      <div className="text-xs theme-text-muted mb-3 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {getFormattedDateRange(dates.startDate, dates.endDate)}
                      </div>
                    ) : null;
                  })()}

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

      {selectedCountry && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeDatePicker}
          />

          <div className="relative theme-surface rounded-lg shadow-xl max-w-md w-full mx-4 theme-border border">
            <div className="flex items-center justify-between p-6 theme-border border-b">
              <h3 className="text-lg font-semibold theme-text-primary">
                Travel Dates for {selectedCountry}
              </h3>
              <button
                onClick={closeDatePicker}
                className="theme-text-muted hover:theme-text-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium theme-text-primary mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 theme-border border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 theme-surface theme-text-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-primary mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 theme-border border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 theme-surface theme-text-primary"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={closeDatePicker}
                  className="px-4 py-2 theme-border border rounded-md theme-text-secondary hover:theme-surface-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveDates}
                  className="px-4 py-2 rounded-md text-white transition-colors"
                  style={{ backgroundColor: currentTheme.colors.success }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
