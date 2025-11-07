import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { api } from '../utils/api';
import { useAuth } from './useAuth';

interface CountryDataContextType {
  visitedCountries: string[];
  wishlistCountries: string[];
  loading: boolean;
  error: string | null;
  updateCountry: (countryName: string, status: 'visited' | 'wishlist' | null) => Promise<void>;
  getCountryStatus: (countryName: string) => 'visited' | 'wishlist' | 'default';
}

interface Country {
  id: number;
  name: string;
  code: string;
  flag: string | null;
  continent: string;
}

interface MarkedCountry {
  id: number;
  user_id: number;
  country_id: number;
  country_name: string;
  country_code: string | null;
  status: 'visited' | 'wishlist';
  created_at: string;
  updated_at: string;
}

const CountryDataContext = createContext<CountryDataContextType | undefined>(undefined);

export function CountryDataProvider({ children }: { children: ReactNode }) {
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const [wishlistCountries, setWishlistCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countryNameToIdMap, setCountryNameToIdMap] = useState<Map<string, number>>(new Map());
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Fetch countries list to build name→ID mapping
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countries = await api.get<Country[]>('/countries');
        const map = new Map<string, number>();
        countries.forEach((country) => {
          map.set(country.name, country.id);
        });
        setCountryNameToIdMap(map);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setError('Failed to load countries list');
      }
    };

    if (!authLoading && isAuthenticated) {
      fetchCountries();
    }
  }, [isAuthenticated, authLoading]);

  // Fetch marked countries from API
  useEffect(() => {
    const fetchMarkedCountries = async () => {
      if (authLoading || !isAuthenticated || countryNameToIdMap.size === 0) {
        if (!authLoading) {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const markedCountries = await api.get<MarkedCountry[]>('/marked-countries/my');

        const visited: string[] = [];
        const wishlist: string[] = [];

        markedCountries.forEach((mc) => {
          if (mc.country_name) {
            if (mc.status === 'visited') {
              visited.push(mc.country_name);
            } else if (mc.status === 'wishlist') {
              wishlist.push(mc.country_name);
            }
          }
        });

        setVisitedCountries(visited);
        setWishlistCountries(wishlist);
      } catch (error) {
        console.error('Error fetching marked countries:', error);
        setError('Failed to load marked countries');
      } finally {
        setLoading(false);
      }
    };

    fetchMarkedCountries();
  }, [isAuthenticated, authLoading, countryNameToIdMap]);

  const refreshMarkedCountries = async () => {
    if (!isAuthenticated) return;

    try {
      const markedCountries = await api.get<MarkedCountry[]>('/marked-countries/my');

      const visited: string[] = [];
      const wishlist: string[] = [];

      markedCountries.forEach((mc) => {
        if (mc.country_name) {
          if (mc.status === 'visited') {
            visited.push(mc.country_name);
          } else if (mc.status === 'wishlist') {
            wishlist.push(mc.country_name);
          }
        }
      });

      setVisitedCountries(visited);
      setWishlistCountries(wishlist);
    } catch (error) {
      console.error('Error refreshing marked countries:', error);
      setError('Failed to refresh marked countries');
    }
  };

  const updateCountry = async (countryName: string, status: 'visited' | 'wishlist' | null) => {
    if (!isAuthenticated) {
      setError('User not authenticated');
      return;
    }

    try {
      setError(null);

      const countryId = countryNameToIdMap.get(countryName);
      if (!countryId) {
        throw new Error(`Country "${countryName}" not found`);
      }

      if (status === null) {
        // Unmark the country - get current status to pass to API
        const currentStatus = visitedCountries.includes(countryName)
          ? 'visited'
          : wishlistCountries.includes(countryName)
          ? 'wishlist'
          : null;

        if (currentStatus) {
          await api.post('/marked-countries/unmark', {
            country_id: countryId,
            status: currentStatus
          });
        }
      } else {
        // Mark the country with the specified status (API handles switching between visited/wishlist)
        await api.post('/marked-countries/mark', {
          country_id: countryId,
          status: status
        });
      }

      // Refresh the marked countries list
      await refreshMarkedCountries();
    } catch (error) {
      console.error('Error updating country:', error);
      setError('Failed to update country');
      throw error;
    }
  };

  const getCountryStatus = (countryName: string): 'visited' | 'wishlist' | 'default' => {
    if (visitedCountries.includes(countryName)) return 'visited';
    if (wishlistCountries.includes(countryName)) return 'wishlist';
    return 'default';
  };

  return (
    <CountryDataContext.Provider
      value={{
        visitedCountries,
        wishlistCountries,
        loading,
        error,
        updateCountry,
        getCountryStatus,
      }}
    >
      {children}
    </CountryDataContext.Provider>
  );
}

export function useCountryData() {
  const context = useContext(CountryDataContext);
  if (context === undefined) {
    throw new Error('useCountryData must be used within a CountryDataProvider');
  }
  return context;
}

