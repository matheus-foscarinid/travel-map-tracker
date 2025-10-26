export interface Theme {
  id: string;
  name: string;
  description: string;
  type: 'light' | 'dark';
  colors: {
    // Background colors
    background: string;
    surface: string;
    surfaceSecondary: string;

    // Text colors
    textPrimary: string;
    textSecondary: string;
    textMuted: string;

    // Border colors
    border: string;
    borderLight: string;

    // Interactive colors
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;

    // Status colors
    success: string;
    successHover: string;
    warning: string;
    warningHover: string;
    error: string;
    errorHover: string;

    // Map colors
    mapBackground: string;
    mapDefault: string;
    mapDefaultHover: string;
    mapVisited: string;
    mapVisitedHover: string;
    mapWishlist: string;
    mapWishlistHover: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Default light theme',
    type: 'light',
    colors: {
      background: '#f9fafb',
      surface: '#ffffff',
      surfaceSecondary: '#f3f4f6',
      textPrimary: '#111827',
      textSecondary: '#6b7280',
      textMuted: '#9ca3af',
      border: '#e5e7eb',
      borderLight: '#f3f4f6',
      primary: '#4f46e5',
      primaryHover: '#4338ca',
      secondary: '#6b7280',
      secondaryHover: '#4b5563',
      success: '#10b981',
      successHover: '#059669',
      warning: '#f59e0b',
      warningHover: '#d97706',
      error: '#ef4444',
      errorHover: '#dc2626',
      mapBackground: '#cce3ff',
      mapDefault: '#9ca3af',
      mapDefaultHover: '#6b7280',
      mapVisited: '#10b981',
      mapVisitedHover: '#059669',
      mapWishlist: '#f59e0b',
      mapWishlistHover: '#d97706',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark theme with strong colors',
    type: 'dark',
    colors: {
      background: '#0f172a',
      surface: '#1e293b',
      surfaceSecondary: '#334155',
      textPrimary: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      border: '#475569',
      borderLight: '#334155',
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      secondary: '#64748b',
      secondaryHover: '#475569',
      success: '#22c55e',
      successHover: '#16a34a',
      warning: '#f59e0b',
      warningHover: '#d97706',
      error: '#ef4444',
      errorHover: '#dc2626',
      mapBackground: '#1e3a8a',
      mapDefault: '#475569',
      mapDefaultHover: '#64748b',
      mapVisited: '#22c55e',
      mapVisitedHover: '#16a34a',
      mapWishlist: '#f59e0b',
      mapWishlistHover: '#d97706',
    },
  },
  {
    id: 'gruvbox',
    name: 'Gruvbox',
    description: 'Dark theme with retro colors',
    type: 'dark',
    colors: {
      background: '#282828',
      surface: '#3c3836',
      surfaceSecondary: '#504945',
      textPrimary: '#ebdbb2',
      textSecondary: '#d5c4a1',
      textMuted: '#a89984',
      border: '#665c54',
      borderLight: '#504945',
      primary: '#b16286',
      primaryHover: '#8f3f71',
      secondary: '#a89984',
      secondaryHover: '#928374',
      success: '#b8bb26',
      successHover: '#98971a',
      warning: '#fabd2f',
      warningHover: '#d79921',
      error: '#fb4934',
      errorHover: '#cc241d',
      mapBackground: '#1d2021',
      mapDefault: '#665c54',
      mapDefaultHover: '#7c6f64',
      mapVisited: '#b8bb26',
      mapVisitedHover: '#98971a',
      mapWishlist: '#fabd2f',
      mapWishlistHover: '#d79921',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Light theme with ocean blues',
    type: 'light',
    colors: {
      background: '#f0f9ff',
      surface: '#ffffff',
      surfaceSecondary: '#e0f2fe',
      textPrimary: '#0c4a6e',
      textSecondary: '#0369a1',
      textMuted: '#0284c7',
      border: '#bae6fd',
      borderLight: '#e0f2fe',
      primary: '#0284c7',
      primaryHover: '#0369a1',
      secondary: '#64748b',
      secondaryHover: '#475569',
      success: '#059669',
      successHover: '#047857',
      warning: '#d97706',
      warningHover: '#b45309',
      error: '#dc2626',
      errorHover: '#b91c1c',
      mapBackground: '#bae6fd',
      mapDefault: '#94a3b8',
      mapDefaultHover: '#64748b',
      mapVisited: '#059669',
      mapVisitedHover: '#047857',
      mapWishlist: '#d97706',
      mapWishlistHover: '#b45309',
    },
  },
];

export const getThemeById = (id: string): Theme | undefined => {
  return themes.find(theme => theme.id === id);
};

export const getDefaultTheme = (): Theme => {
  return themes[0];
};
