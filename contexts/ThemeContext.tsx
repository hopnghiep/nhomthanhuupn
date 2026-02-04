
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

type ColorTheme = 'indigo' | 'teal' | 'rose' | 'slate' | 'green' | 'orange' | 'purple' | 'mono';
type FontFamily = 'inter' | 'roboto' | 'lora' | 'poppins' | 'playfair' | 'arial' | 'times' | 'system';
type ThemeMode = 'light' | 'dark' | 'contrast';

interface ThemeState {
  color: ColorTheme;
  font: FontFamily;
  size: number; // Changed to number for pixel value
  mode: ThemeMode;
}

interface ThemeContextType {
  theme: ThemeState;
  setTheme: React.Dispatch<React.SetStateAction<ThemeState>>;
  themeClassName: string;
  fontClassName: string;
  fontSizeClassName: string; // Deprecated but kept for compatibility, effectively unused
  modeClassName: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): ThemeState => {
  try {
    const item = window.localStorage.getItem('app-theme');
    const savedTheme = item ? JSON.parse(item) : {};
    
    // Backward compatibility for size (convert string enum to number)
    let size = 16;
    if (typeof savedTheme.size === 'string') {
        switch(savedTheme.size) {
            case 'xs': size = 12; break;
            case 'sm': size = 14; break;
            case 'base': size = 16; break;
            case 'lg': size = 18; break;
            case 'xl': size = 20; break;
            default: size = 16;
        }
    } else if (typeof savedTheme.size === 'number') {
        size = savedTheme.size;
    }

    return {
      color: savedTheme.color || 'indigo',
      font: savedTheme.font || 'inter',
      size: size,
      mode: savedTheme.mode || 'light',
    };
  } catch (error) {
    console.warn('Error reading theme from localStorage', error);
    return { color: 'indigo', font: 'inter', size: 16, mode: 'light' };
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeState>(getInitialTheme);

  useEffect(() => {
    try {
      window.localStorage.setItem('app-theme', JSON.stringify(theme));
      
      // Calculate scale factor based on 16px default
      const scale = theme.size / 16;
      
      // Apply scale factor to CSS variable instead of changing root font-size
      // This prevents the layout (padding/margin defined in rem) from zooming
      document.documentElement.style.setProperty('--text-scale', scale.toString());
      
      // Reset root font size to ensure layout stability if it was previously changed
      document.documentElement.style.fontSize = ''; 
      
    } catch (error) {
      console.warn('Error saving theme to localStorage', error);
    }
  }, [theme]);
  
  const themeClassName = `theme-${theme.color}`;
  const fontClassName = `font-${theme.font}`;
  // We return an empty string for fontSizeClassName as we control it via root style
  const fontSizeClassName = ''; 
  const modeClassName = theme.mode === 'light' ? '' : theme.mode;

  const value = useMemo(() => ({
    theme,
    setTheme,
    themeClassName,
    fontClassName,
    fontSizeClassName,
    modeClassName,
  }), [theme, themeClassName, fontClassName, fontSizeClassName, modeClassName]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
