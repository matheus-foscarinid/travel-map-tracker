import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './useTheme';
import { themes } from '../config/themes';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
  });

  it('should use default theme when no saved theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.currentTheme.id).toBe(themes[0].id);
  });

  it('should load saved theme from localStorage', () => {
    localStorage.setItem('travel-map-theme', 'midnight');

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.currentTheme.id).toBe('midnight');
  });

  it('should change theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme('midnight');
    });

    expect(result.current.currentTheme.id).toBe('midnight');
    expect(localStorage.getItem('travel-map-theme')).toBe('midnight');
  });

  it('should provide available themes', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.availableThemes).toEqual(themes);
  });
});


