import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { CountryDataProvider, useCountryData } from './useCountryData';
import { AuthProvider } from './useAuth';
import { api } from '../utils/api';

vi.mock('../utils/api');
vi.mock('./useAuth', async () => {
  const actual = await vi.importActual('./useAuth');
  return {
    ...actual,
    useAuth: () => ({
      isAuthenticated: true,
      loading: false,
    }),
  };
});

describe('useCountryData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useCountryData());
    }).toThrow('useCountryData must be used within a CountryDataProvider');
  });

  it('should get country status', async () => {
    const mockCountries = [
      { id: 1, name: 'United States', code: 'US', flag: '🇺🇸', continent: 'North America' },
      { id: 2, name: 'Brazil', code: 'BR', flag: '🇧🇷', continent: 'South America' },
    ];

    const mockMarkedCountries = [
      {
        id: 1,
        user_id: 1,
        country_id: 1,
        country_name: 'United States',
        country_code: 'US',
        status: 'visited',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
    ];

    vi.mocked(api.get)
      .mockResolvedValueOnce(mockCountries)
      .mockResolvedValueOnce(mockMarkedCountries);

    const { result } = renderHook(() => useCountryData(), {
      wrapper: ({ children }) => (
        <BrowserRouter>
          <AuthProvider>
            <CountryDataProvider>{children}</CountryDataProvider>
          </AuthProvider>
        </BrowserRouter>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.visitedCountries.length).toBeGreaterThan(0);
    });

    expect(result.current.getCountryStatus('United States')).toBe('visited');
    expect(result.current.getCountryStatus('Brazil')).toBe('default');
  });

  it('should update country to visited', async () => {
    const mockCountries = [
      { id: 1, name: 'United States', code: 'US', flag: '🇺🇸', continent: 'North America' },
    ];

    vi.mocked(api.get)
      .mockResolvedValueOnce(mockCountries)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const { result } = renderHook(() => useCountryData(), {
      wrapper: ({ children }) => (
        <BrowserRouter>
          <AuthProvider>
            <CountryDataProvider>{children}</CountryDataProvider>
          </AuthProvider>
        </BrowserRouter>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.mocked(api.post).mockResolvedValue({});

    await act(async () => {
      await result.current.updateCountry('United States', 'visited');
    });

    expect(api.post).toHaveBeenCalledWith('/marked-countries/mark', {
      country_id: 1,
      status: 'visited',
    });
  });

  it('should update country to wishlist', async () => {
    const mockCountries = [
      { id: 1, name: 'United States', code: 'US', flag: '🇺🇸', continent: 'North America' },
    ];

    vi.mocked(api.get)
      .mockResolvedValueOnce(mockCountries)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const { result } = renderHook(() => useCountryData(), {
      wrapper: ({ children }) => (
        <BrowserRouter>
          <AuthProvider>
            <CountryDataProvider>{children}</CountryDataProvider>
          </AuthProvider>
        </BrowserRouter>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.mocked(api.post).mockResolvedValue({});

    await act(async () => {
      await result.current.updateCountry('United States', 'wishlist');
    });

    expect(api.post).toHaveBeenCalledWith('/marked-countries/mark', {
      country_id: 1,
      status: 'wishlist',
    });
  });

  it('should unmark country', async () => {
    const mockCountries = [
      { id: 1, name: 'United States', code: 'US', flag: '🇺🇸', continent: 'North America' },
    ];

    const mockMarkedCountries = [
      {
        id: 1,
        user_id: 1,
        country_id: 1,
        country_name: 'United States',
        country_code: 'US',
        status: 'visited',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
    ];

    vi.mocked(api.get)
      .mockResolvedValueOnce(mockCountries)
      .mockResolvedValueOnce(mockMarkedCountries)
      .mockResolvedValueOnce([]);

    const { result } = renderHook(() => useCountryData(), {
      wrapper: ({ children }) => (
        <BrowserRouter>
          <AuthProvider>
            <CountryDataProvider>{children}</CountryDataProvider>
          </AuthProvider>
        </BrowserRouter>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.visitedCountries).toContain('United States');
    });

    vi.mocked(api.post).mockResolvedValue({});

    await act(async () => {
      await result.current.updateCountry('United States', null);
    });

    expect(api.post).toHaveBeenCalledWith('/marked-countries/unmark', {
      country_id: 1,
      status: 'visited',
    });
  });
});


