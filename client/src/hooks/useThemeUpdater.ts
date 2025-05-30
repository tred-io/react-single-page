import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { StoreSettings } from '@shared/schema';

function hexToHsl(hex: string): string {
  // Remove the hash if it exists
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  // Convert to CSS format
  const hue = Math.round(h * 360);
  const saturation = Math.round(s * 100);
  const lightness = Math.round(l * 100);
  
  return `${hue} ${saturation}% ${lightness}%`;
}

function updateCSSVariables(settings: StoreSettings) {
  const root = document.documentElement;
  
  // Update color variables
  if (settings.primaryColor) {
    root.style.setProperty('--primary', hexToHsl(settings.primaryColor));
  }
  
  if (settings.secondaryColor) {
    root.style.setProperty('--secondary', hexToHsl(settings.secondaryColor));
  }
  
  if (settings.accentColor) {
    root.style.setProperty('--accent', hexToHsl(settings.accentColor));
  }
  
  // Update font family
  if (settings.fontFamily) {
    document.body.style.fontFamily = settings.fontFamily;
  }
}

export function useThemeUpdater() {
  const { data: storeSettings } = useQuery<StoreSettings>({
    queryKey: ["/api/store-settings"],
  });
  
  useEffect(() => {
    if (storeSettings) {
      updateCSSVariables(storeSettings);
    }
  }, [storeSettings]);
}