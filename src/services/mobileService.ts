
import { useState, useEffect } from 'react';

export interface MobileDetectionOptions {
  mobileBreakpoint?: number;
  tabletBreakpoint?: number;
}

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// Hook to detect device type
export function useDeviceDetection(options: MobileDetectionOptions = {}) {
  const { 
    mobileBreakpoint = 640,  // Default to Tailwind's sm breakpoint
    tabletBreakpoint = 1024  // Default to Tailwind's lg breakpoint
  } = options;
  
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < mobileBreakpoint) {
        setDeviceType('mobile');
      } else if (width < tabletBreakpoint) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    }
    
    // Set initial device type
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileBreakpoint, tabletBreakpoint]);
  
  return deviceType;
}

// Detect touch support
export function hasTouchSupport(): boolean {
  return (
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 || 
    (navigator as any).msMaxTouchPoints > 0
  );
}

// Helper to generate appropriate classes based on device type
export function getResponsiveClasses(deviceType: DeviceType): {
  container: string;
  card: string;
  button: string;
  heading: string;
  grid: string;
} {
  const baseClasses = {
    container: 'w-full mx-auto px-4',
    card: 'rounded-lg shadow-md',
    button: 'rounded px-4 py-2',
    heading: 'font-bold',
    grid: 'grid gap-4'
  };
  
  if (deviceType === 'mobile') {
    return {
      container: `${baseClasses.container} max-w-full`,
      card: `${baseClasses.card} p-3`,
      button: `${baseClasses.button} text-sm`,
      heading: `${baseClasses.heading} text-lg`,
      grid: `${baseClasses.grid} grid-cols-1`
    };
  } else if (deviceType === 'tablet') {
    return {
      container: `${baseClasses.container} max-w-4xl`,
      card: `${baseClasses.card} p-4`,
      button: `${baseClasses.button}`,
      heading: `${baseClasses.heading} text-xl`,
      grid: `${baseClasses.grid} grid-cols-2`
    };
  } else {
    return {
      container: `${baseClasses.container} max-w-7xl`,
      card: `${baseClasses.card} p-5`,
      button: `${baseClasses.button}`,
      heading: `${baseClasses.heading} text-2xl`,
      grid: `${baseClasses.grid} grid-cols-3`
    };
  }
}

// Detect OS or platform
export function detectPlatform(): 'ios' | 'android' | 'windows' | 'mac' | 'linux' | 'other' {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  } else if (/android/.test(userAgent)) {
    return 'android';
  } else if (/win/.test(userAgent)) {
    return 'windows';
  } else if (/mac/.test(userAgent)) {
    return 'mac';
  } else if (/linux/.test(userAgent)) {
    return 'linux';
  } else {
    return 'other';
  }
}

// Detect browser type
export function detectBrowser(): 'chrome' | 'firefox' | 'safari' | 'edge' | 'ie' | 'opera' | 'other' {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/chrome/.test(userAgent) && !/edg/.test(userAgent)) {
    return 'chrome';
  } else if (/firefox/.test(userAgent)) {
    return 'firefox';
  } else if (/safari/.test(userAgent) && !/chrome/.test(userAgent)) {
    return 'safari';
  } else if (/edg/.test(userAgent)) {
    return 'edge';
  } else if (/msie|trident/.test(userAgent)) {
    return 'ie';
  } else if (/opera|opr/.test(userAgent)) {
    return 'opera';
  } else {
    return 'other';
  }
}
