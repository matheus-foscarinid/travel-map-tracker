import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { type Theme, themes, getThemeById, getDefaultTheme } from '../config/themes';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('travel-map-theme');
    if (savedTheme) {
      const theme = getThemeById(savedTheme);
      if (theme) return theme;
    }

    return getDefaultTheme();
  });

  const setTheme = (themeId: string) => {
    const theme = getThemeById(themeId);
    if (theme) {
      setCurrentTheme(theme);
      if (typeof window !== 'undefined') {
        localStorage.setItem('travel-map-theme', themeId);
      }
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const themeColors = currentTheme.colors;

      // Set CSS custom properties
      root.style.setProperty('--color-background', themeColors.background);
      root.style.setProperty('--color-surface', themeColors.surface);
      root.style.setProperty('--color-surface-secondary', themeColors.surfaceSecondary);
      root.style.setProperty('--color-text-primary', themeColors.textPrimary);
      root.style.setProperty('--color-text-secondary', themeColors.textSecondary);
      root.style.setProperty('--color-text-muted', themeColors.textMuted);
      root.style.setProperty('--color-border', themeColors.border);
      root.style.setProperty('--color-border-light', themeColors.borderLight);
      root.style.setProperty('--color-primary', themeColors.primary);
      root.style.setProperty('--color-primary-hover', themeColors.primaryHover);
      root.style.setProperty('--color-secondary', themeColors.secondary);
      root.style.setProperty('--color-secondary-hover', themeColors.secondaryHover);
      root.style.setProperty('--color-success', themeColors.success);
      root.style.setProperty('--color-success-hover', themeColors.successHover);
      root.style.setProperty('--color-warning', themeColors.warning);
      root.style.setProperty('--color-warning-hover', themeColors.warningHover);
      root.style.setProperty('--color-error', themeColors.error);
      root.style.setProperty('--color-error-hover', themeColors.errorHover);

      document.body.className = `theme-${currentTheme.id}`;
    }
  }, [currentTheme]);

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    availableThemes: themes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
