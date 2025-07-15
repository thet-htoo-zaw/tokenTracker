import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  colors: typeof lightColors | typeof darkColors;
}

const lightColors = {
  // Background colors
  background: '#ffffff',
  surface: '#f8fafc',
  card: '#ffffff',
  cardSecondary: '#f1f5f9',
  
  // Text colors
  text: '#1e293b',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  
  // Border colors
  border: '#e2e8f0',
  borderSecondary: '#f1f5f9',
  
  // Primary colors
  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  
  // Success colors
  success: '#10b981',
  successLight: '#34d399',
  
  // Warning colors
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  
  // Error colors
  error: '#ef4444',
  errorLight: '#f87171',
  
  // Action colors
  action: '#6366f1',
  actionHover: '#4f46e5',
  
  // Status colors
  positive: '#10b981',
  negative: '#ef4444',
  neutral: '#6b7280',
};

const darkColors = {
  // Background colors
  background: '#0a0a0a',
  surface: '#1a1a1a',
  card: '#1a1a1a',
  cardSecondary: '#2a2a2a',
  
  // Text colors
  text: '#ffffff',
  textSecondary: '#9ca3af',
  textTertiary: '#6b7280',
  
  // Border colors
  border: '#1a1a1a',
  borderSecondary: '#2a2a2a',
  
  // Primary colors
  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  
  // Success colors
  success: '#10b981',
  successLight: '#34d399',
  
  // Warning colors
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  
  // Error colors
  error: '#ef4444',
  errorLight: '#f87171',
  
  // Action colors
  action: '#6366f1',
  actionHover: '#4f46e5',
  
  // Status colors
  positive: '#10b981',
  negative: '#ef4444',
  neutral: '#6b7280',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setThemeState(savedTheme as Theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Only use system color scheme when theme is set to 'system'
  const isDark = theme === 'system' 
    ? systemColorScheme === 'dark'
    : theme === 'dark';

  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = async () => {
    const newTheme = isDark ? 'light' : 'dark';
    setThemeState(newTheme);
    await saveTheme(newTheme);
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await saveTheme(newTheme);
  };

  if (loading) {
    // Return a loading state or default theme while loading
    return (
      <ThemeContext.Provider value={{
        theme: 'system',
        isDark: systemColorScheme === 'dark',
        toggleTheme: async () => {},
        setTheme: async () => {},
        colors: systemColorScheme === 'dark' ? darkColors : lightColors,
      }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      isDark,
      toggleTheme,
      setTheme,
      colors,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}; 