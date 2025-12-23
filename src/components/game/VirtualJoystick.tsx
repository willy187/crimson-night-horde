import React, { useState, useEffect, RefObject } from 'react';

interface JoystickPosition {
  active: boolean;
  baseX: number;
  baseY: number;
  handleX: number;
  handleY: number;
}

interface VirtualJoystickProps {
  joystickPosition: RefObject<JoystickPosition>;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ joystickPosition }) => {
  const [, forceUpdate] = useState(0);

  // Re-render periodically to show joystick position updates
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((n) => n + 1);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const pos = joystickPosition.current;
  if (!pos?.active) return null;

  return (
    <>
      {/* Outer ring (base) */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: pos.baseX - 60,
          top: pos.baseY - 60,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, hsl(var(--primary) / 0.2) 100%)',
          border: '2px solid hsl(var(--primary) / 0.4)',
          boxShadow: '0 0 20px hsl(var(--primary) / 0.3)',
        }}
      />
      {/* Inner handle (knob) */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: pos.handleX - 25,
          top: pos.handleY - 25,
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: 'radial-gradient(circle, hsl(var(--primary)) 0%, hsl(var(--primary-glow)) 100%)',
          border: '2px solid hsl(var(--foreground) / 0.6)',
          boxShadow: '0 0 15px hsl(var(--primary) / 0.6)',
        }}
      />
    </>
  );
};
