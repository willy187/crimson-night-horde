import { useRef, useState, useCallback, useEffect } from 'react';
import { GameTheme } from '@/types/game';

export const useSoundManager = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const bgmGainRef = useRef<GainNode | null>(null);
  const bgmSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const isPlayingBgmRef = useRef(false);
  const currentThemeRef = useRef<GameTheme>('space');
  const bgmIntervalRef = useRef<number | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Cat theme BGM - playful, bouncy melody
  const startCatBgm = useCallback((ctx: AudioContext, masterGain: GainNode) => {
    const playNote = (freq: number, startTime: number, duration: number, type: OscillatorType = 'square') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.type = type;
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.9);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Playful cat melody - bouncy and cute
    const melody = [
      { freq: 523, dur: 0.15 },  // C5
      { freq: 587, dur: 0.15 },  // D5
      { freq: 659, dur: 0.2 },   // E5
      { freq: 523, dur: 0.15 },  // C5
      { freq: 698, dur: 0.25 },  // F5
      { freq: 659, dur: 0.15 },  // E5
      { freq: 587, dur: 0.15 },  // D5
      { freq: 523, dur: 0.3 },   // C5
    ];
    
    const loopDuration = melody.reduce((sum, n) => sum + n.dur, 0);

    const scheduleLoop = () => {
      if (!isPlayingBgmRef.current) return;
      const context = audioContextRef.current;
      if (!context) return;

      let time = context.currentTime;
      melody.forEach(note => {
        playNote(note.freq, time, note.dur * 0.9, 'triangle');
        time += note.dur;
      });

      bgmIntervalRef.current = window.setTimeout(scheduleLoop, loopDuration * 1000);
    };

    scheduleLoop();
  }, []);

  // Space theme BGM - epic, synth-wave style
  const startSpaceBgm = useCallback((ctx: AudioContext, masterGain: GainNode) => {
    const playNote = (freq: number, startTime: number, duration: number, type: OscillatorType = 'sawtooth') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.type = type;
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.85);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Epic space melody - deeper, more dramatic
    const melody = [
      { freq: 196, dur: 0.3 },   // G3
      { freq: 220, dur: 0.3 },   // A3
      { freq: 262, dur: 0.4 },   // C4
      { freq: 220, dur: 0.2 },   // A3
      { freq: 262, dur: 0.3 },   // C4
      { freq: 330, dur: 0.4 },   // E4
      { freq: 294, dur: 0.3 },   // D4
      { freq: 262, dur: 0.5 },   // C4
    ];
    
    const loopDuration = melody.reduce((sum, n) => sum + n.dur, 0);

    const scheduleLoop = () => {
      if (!isPlayingBgmRef.current) return;
      const context = audioContextRef.current;
      if (!context) return;

      let time = context.currentTime;
      melody.forEach(note => {
        playNote(note.freq, time, note.dur * 0.85, 'sawtooth');
        // Add subtle harmony
        playNote(note.freq * 1.5, time, note.dur * 0.5, 'sine');
        time += note.dur;
      });

      bgmIntervalRef.current = window.setTimeout(scheduleLoop, loopDuration * 1000);
    };

    scheduleLoop();
  }, []);

  const startBgm = useCallback((theme: GameTheme = 'space') => {
    if (isPlayingBgmRef.current) {
      stopBgm();
    }
    
    try {
      const ctx = getAudioContext();
      const masterGain = ctx.createGain();
      masterGain.gain.value = isMuted ? 0 : 0.08;
      masterGain.connect(ctx.destination);
      bgmGainRef.current = masterGain;
      currentThemeRef.current = theme;

      isPlayingBgmRef.current = true;

      if (theme === 'cat') {
        startCatBgm(ctx, masterGain);
      } else {
        startSpaceBgm(ctx, masterGain);
      }
    } catch (e) {
      // Audio not supported
    }
  }, [getAudioContext, startCatBgm, startSpaceBgm, isMuted]);

  const stopBgm = useCallback(() => {
    isPlayingBgmRef.current = false;
    if (bgmIntervalRef.current) {
      clearTimeout(bgmIntervalRef.current);
      bgmIntervalRef.current = null;
    }
    if (bgmSourceRef.current) {
      try {
        bgmSourceRef.current.stop();
      } catch (e) {}
      bgmSourceRef.current = null;
    }
  }, []);

  const playShoot = useCallback((theme: GameTheme = 'space') => {
    if (isMuted) return;
    
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      if (theme === 'cat') {
        // Cat paw swipe sound - softer, higher pitched
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.04);
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.04);
      } else {
        // Space laser - sharper, more electronic
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(900, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.06);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.06);
      }
    } catch (e) {
      // Audio not supported
    }
  }, [isMuted, getAudioContext]);

  const playExplosion = useCallback((theme: GameTheme = 'space') => {
    if (isMuted) return;
    
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      if (theme === 'cat') {
        // Cat squeak/poof sound
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
      } else {
        // Space explosion - deeper, more impactful
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.22, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {
      // Audio not supported
    }
  }, [isMuted, getAudioContext]);

  const playLevelUp = useCallback(() => {
    if (isMuted) return;
    
    try {
      const ctx = getAudioContext();
      
      const frequencies = [523, 659, 784, 1047];
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        const startTime = ctx.currentTime + i * 0.08;
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
        
        osc.start(startTime);
        osc.stop(startTime + 0.15);
      });
    } catch (e) {
      // Audio not supported
    }
  }, [isMuted, getAudioContext]);

  const playGameOver = useCallback(() => {
    if (isMuted) return;
    
    try {
      const ctx = getAudioContext();
      
      const frequencies = [392, 330, 262, 196];
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.value = freq;
        
        const startTime = ctx.currentTime + i * 0.2;
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch (e) {
      // Audio not supported
    }
  }, [isMuted, getAudioContext]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      if (bgmGainRef.current) {
        bgmGainRef.current.gain.value = newMuted ? 0 : 0.08;
      }
      return newMuted;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopBgm();
    };
  }, [stopBgm]);

  return {
    isMuted,
    playShoot,
    playExplosion,
    playLevelUp,
    playGameOver,
    startBgm,
    stopBgm,
    toggleMute,
  };
};
