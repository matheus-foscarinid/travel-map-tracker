import { useState, useEffect } from 'react';

interface CountryData {
  visited: string[];
  wishlist: string[];
}

const STORAGE_KEY = 'travel-map-countries';

export function useCountryData() {
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const [wishlistCountries, setWishlistCountries] = useState<string[]>([]);

  // Load data from localStorage on mount
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

  // Save data to localStorage whenever it changes
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

  return {
    visitedCountries,
    wishlistCountries,
    updateCountries,
    getCountryStatus,
  };
}
