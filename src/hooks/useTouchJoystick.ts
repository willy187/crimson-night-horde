import { useRef, useCallback, RefObject } from 'react';

interface TouchState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

interface JoystickPosition {
  active: boolean;
  baseX: number;
  baseY: number;
  handleX: number;
  handleY: number;
}

interface UseTouchJoystickReturn {
  touch: RefObject<TouchState>;
  joystickPosition: RefObject<JoystickPosition>;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
}

export const useTouchJoystick = (): UseTouchJoystickReturn => {
  const touch = useRef<TouchState>({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const joystickPosition = useRef<JoystickPosition>({
    active: false,
    baseX: 0,
    baseY: 0,
    handleX: 0,
    handleY: 0,
  });

  const JOYSTICK_RADIUS = 50;
  const DEAD_ZONE = 10;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touchPoint = e.touches[0];
    const x = touchPoint.clientX;
    const y = touchPoint.clientY;

    joystickPosition.current = {
      active: true,
      baseX: x,
      baseY: y,
      handleX: x,
      handleY: y,
    };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!joystickPosition.current.active) return;

    const touchPoint = e.touches[0];
    const x = touchPoint.clientX;
    const y = touchPoint.clientY;

    const { baseX, baseY } = joystickPosition.current;
    let dx = x - baseX;
    let dy = y - baseY;

    // Clamp to joystick radius
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > JOYSTICK_RADIUS) {
      dx = (dx / dist) * JOYSTICK_RADIUS;
      dy = (dy / dist) * JOYSTICK_RADIUS;
    }

    joystickPosition.current.handleX = baseX + dx;
    joystickPosition.current.handleY = baseY + dy;

    // Update touch direction state with dead zone
    touch.current = {
      up: dy < -DEAD_ZONE,
      down: dy > DEAD_ZONE,
      left: dx < -DEAD_ZONE,
      right: dx > DEAD_ZONE,
    };
  }, []);

  const handleTouchEnd = useCallback(() => {
    joystickPosition.current = {
      active: false,
      baseX: 0,
      baseY: 0,
      handleX: 0,
      handleY: 0,
    };

    touch.current = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
  }, []);

  return {
    touch,
    joystickPosition,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
