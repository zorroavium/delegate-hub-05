
import React, { createContext, useContext, useEffect } from 'react';
import { useStatusStore, ThemeType } from '@/store/useStatusStore';

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  applySidebarTheme: boolean;
  toggleSidebarTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, setTheme } = useStatusStore();
  const [themeColor, setThemeColorState] = React.useState<string>(
    localStorage.getItem('themeColor') || 'blue'
  );
  const [applySidebarTheme, setApplySidebarTheme] = React.useState<boolean>(
    localStorage.getItem('applySidebarTheme') === 'true'
  );

  const toggleSidebarTheme = () => {
    const newValue = !applySidebarTheme;
    setApplySidebarTheme(newValue);
    localStorage.setItem('applySidebarTheme', newValue.toString());
    if (newValue) {
      applySidebarColor(themeColor);
    } else {
      resetSidebarColor();
    }
  };

  const setThemeColor = (color: string) => {
    setThemeColorState(color);
    localStorage.setItem('themeColor', color);
    applyThemeColor(color);
    if (applySidebarTheme) {
      applySidebarColor(color);
    }
  };

  // Apply theme class to document element
  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Apply theme color
  useEffect(() => {
    // Load saved theme color
    const savedThemeColor = localStorage.getItem('themeColor');
    if (savedThemeColor) {
      setThemeColorState(savedThemeColor);
      applyThemeColor(savedThemeColor);
      
      // Check sidebar theme preference
      const savedSidebarTheme = localStorage.getItem('applySidebarTheme');
      setApplySidebarTheme(savedSidebarTheme === 'true');
      
      if (savedSidebarTheme === 'true') {
        applySidebarColor(savedThemeColor);
      }
    } else {
      applyThemeColor('blue');
    }
  }, []);

  // Function to apply theme color to CSS variables
  const applyThemeColor = (color: string) => {
    const root = window.document.documentElement;
    
    // Define color values
    const colors = {
      blue: {
        primary: '221 83% 53%', // tailwind blue-500
        primaryLight: '217 91% 60%', // tailwind blue-400
        primaryDark: '224 76% 48%', // tailwind blue-600
      },
      purple: {
        primary: '259 94% 51%', // tailwind purple-500
        primaryLight: '258 90% 66%', // tailwind purple-400
        primaryDark: '262 83% 45%', // tailwind purple-600
      },
      green: {
        primary: '142 76% 36%', // tailwind green-500
        primaryLight: '142 69% 46%', // tailwind green-400
        primaryDark: '142 72% 29%', // tailwind green-600
      },
      orange: {
        primary: '24 94% 50%', // tailwind orange-500
        primaryLight: '26 96% 55%', // tailwind orange-400
        primaryDark: '21 90% 48%', // tailwind orange-600
      }
    };
    
    // Update CSS variables
    if (colors[color as keyof typeof colors]) {
      const selectedColor = colors[color as keyof typeof colors];
      root.style.setProperty('--primary', selectedColor.primary);
      root.style.setProperty('--primary-light', selectedColor.primaryLight);
      root.style.setProperty('--primary-dark', selectedColor.primaryDark);
    }
  };

  // Function to apply sidebar theming
  const applySidebarColor = (color: string) => {
    const root = window.document.documentElement;
    const colorValues: Record<string, string> = {
      blue: '#3b82f6',
      purple: '#8b5cf6',
      green: '#10b981',
      orange: '#f97316'
    };
    
    // Apply color to the sidebar
    root.style.setProperty('--sidebar-primary', colorValues[color] || '#3b82f6');
  };

  // Function to reset sidebar color
  const resetSidebarColor = () => {
    const root = window.document.documentElement;
    root.style.removeProperty('--sidebar-primary');
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      themeColor, 
      setThemeColor,
      applySidebarTheme,
      toggleSidebarTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
