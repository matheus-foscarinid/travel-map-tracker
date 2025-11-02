import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface CountryData {
  visited: string[];
  wishlist: string[];
}

interface CountryDataContextType {
  visitedCountries: string[];
  wishlistCountries: string[];
  updateCountries: (visited: string[], wishlist: string[]) => void;
  getCountryStatus: (countryName: string) => 'visited' | 'wishlist' | 'default';
}

const STORAGE_KEY = 'travel-map-countries';

const CountryDataContext = createContext<CountryDataContextType | undefined>(undefined);

export function CountryDataProvider({ children }: { children: ReactNode }) {
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const [wishlistCountries, setWishlistCountries] = useState<string[]>([]);

  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data: CountryData = JSON.parse(stored);
          setVisitedCountries(data.visited || []);
          setWishlistCountries(data.wishlist || []);
        }
      } catch (error) {
        console.error('Error loading country data from localStorage:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const data: CountryData = JSON.parse(e.newValue);
          setVisitedCountries(data.visited || []);
          setWishlistCountries(data.wishlist || []);
        } catch (error) {
          console.error('Error parsing storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveData = (visited: string[], wishlist: string[]) => {
    try {
      const data: CountryData = { visited, wishlist };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setVisitedCountries(visited);
      setWishlistCountries(wishlist);
    } catch (error) {
      console.error('Error saving country data to localStorage:', error);
    }
  };

  const updateCountries = (visited: string[], wishlist: string[]) => {
    saveData(visited, wishlist);
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
        updateCountries,
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

