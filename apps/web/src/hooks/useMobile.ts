import { useState, useEffect } from 'react';

interface MobileBreakpoints {
  isMobile: boolean;      // < 768px
  isTablet: boolean;      // 768px - 1024px
  isDesktop: boolean;     // > 1024px
  isSmallMobile: boolean; // < 640px
  isLargeMobile: boolean; // 640px - 768px
}

const useMobile = (): MobileBreakpoints => {
  const [breakpoints, setBreakpoints] = useState<MobileBreakpoints>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isSmallMobile: false,
    isLargeMobile: false,
  });

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth;
      
      setBreakpoints({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        isSmallMobile: width < 640,
        isLargeMobile: width >= 640 && width < 768,
      });
    };

    // Establecer breakpoints iniciales
    updateBreakpoints();

    // Agregar event listener para cambios de tamaño
    window.addEventListener('resize', updateBreakpoints);

    // Cleanup
    return () => window.removeEventListener('resize', updateBreakpoints);
  }, []);

  return breakpoints;
};

export default useMobile;
