import { useEffect, useRef } from 'react';

export interface KeyState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export interface KeyboardActions {
  pause: boolean;
}

export const useKeyboard = (onPause?: () => void, onMute?: () => void) => {
  const keys = useRef<KeyState>({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          keys.current.up = true;
          break;
        case 's':
        case 'arrowdown':
          keys.current.down = true;
          break;
        case 'a':
        case 'arrowleft':
          keys.current.left = true;
          break;
        case 'd':
        case 'arrowright':
          keys.current.right = true;
          break;
        case 'escape':
          e.preventDefault();
          onPause?.();
          break;
        case 'end':
          e.preventDefault();
          onMute?.();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          keys.current.up = false;
          break;
        case 's':
        case 'arrowdown':
          keys.current.down = false;
          break;
        case 'a':
        case 'arrowleft':
          keys.current.left = false;
          break;
        case 'd':
        case 'arrowright':
          keys.current.right = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onPause, onMute]);

  return keys;
};
