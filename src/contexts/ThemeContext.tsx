import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [accentColor, setAccentColorState] = useState('#003876');

  // Load accent color from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('sunat_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.accentColor) {
          setAccentColorState(parsed.accentColor);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    }
  }, []);

  // Apply CSS variables whenever accent color changes
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
    
    // Calculate darker shade for hover states
    const darkerShade = adjustColor(accentColor, -20);
    document.documentElement.style.setProperty('--accent-color-dark', darkerShade);
    
    // Calculate lighter shade for backgrounds
    const lighterShade = adjustColor(accentColor, 40);
    document.documentElement.style.setProperty('--accent-color-light', lighterShade);
  }, [accentColor]);

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
    
    // Update localStorage
    const savedSettings = localStorage.getItem('sunat_settings');
    let settings = {};
    
    if (savedSettings) {
      try {
        settings = JSON.parse(savedSettings);
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }
    
    localStorage.setItem('sunat_settings', JSON.stringify({
      ...settings,
      accentColor: color
    }));
  };

  return (
    <ThemeContext.Provider value={{ accentColor, setAccentColor }}>
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

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
