import { useEffect, useState, useCallback } from 'react';

interface MobileOrientationState {
  isMobile: boolean;
  isLandscape: boolean;
  needsRotation: boolean;
}

export function useMobileOrientation() {
  const [state, setState] = useState<MobileOrientationState>({
    isMobile: false,
    isLandscape: true,
    needsRotation: false,
  });

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;
      
      const isLandscape = window.innerWidth > window.innerHeight;
      
      setState({
        isMobile,
        isLandscape,
        needsRotation: isMobile && !isLandscape,
      });
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const requestFullscreen = useCallback(async () => {
    try {
      const elem = document.documentElement;
      
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen();
      }

      // Lock to landscape if supported
      if (screen.orientation && (screen.orientation as any).lock) {
        try {
          await (screen.orientation as any).lock('landscape');
        } catch (e) {
          // Orientation lock might not be supported
          console.log('Orientation lock not supported');
        }
      }
    } catch (e) {
      console.log('Fullscreen not supported or denied');
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    }
  }, []);

  return { ...state, requestFullscreen, exitFullscreen };
}
