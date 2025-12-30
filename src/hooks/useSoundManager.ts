import { useRef, useState, useCallback, useEffect } from 'react';

export const useSoundManager = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const bgmGainRef = useRef<GainNode | null>(null);
  const bgmSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const isPlayingBgmRef = useRef(false);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Background music using oscillators (retro style)
  const startBgm = useCallback(() => {
    if (isPlayingBgmRef.current) return;
    
    try {
      const ctx = getAudioContext();
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.08;
      masterGain.connect(ctx.destination);
      bgmGainRef.current = masterGain;

      const playNote = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(masterGain);
        
        osc.type = 'square';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.9);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      // Simple retro loop melody
      const notes = [262, 330, 392, 523, 392, 330, 262, 196];
      const noteDuration = 0.25;
      const loopDuration = notes.length * noteDuration;

      const scheduleLoop = () => {
        if (!isPlayingBgmRef.current) return;
        const ctx = audioContextRef.current;
        if (!ctx) return;

        notes.forEach((freq, i) => {
          playNote(freq, ctx.currentTime + i * noteDuration, noteDuration * 0.8);
        });

        setTimeout(scheduleLoop, loopDuration * 1000);
      };

      isPlayingBgmRef.current = true;
      scheduleLoop();
    } catch (e) {
      // Audio not supported
    }
  }, [getAudioContext]);

  const stopBgm = useCallback(() => {
    isPlayingBgmRef.current = false;
    if (bgmSourceRef.current) {
      try {
        bgmSourceRef.current.stop();
      } catch (e) {}
      bgmSourceRef.current = null;
    }
  }, []);

  const playShoot = useCallback(() => {
    if (isMuted) return;
    
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Audio not supported
    }
  }, [isMuted, getAudioContext]);

  const playExplosion = useCallback(() => {
    if (isMuted) return;
    
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.12);
      
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.12);
    } catch (e) {
      // Audio not supported
    }
  }, [isMuted, getAudioContext]);

  const playLevelUp = useCallback(() => {
    if (isMuted) return;
    
    try {
      const ctx = getAudioContext();
      
      // Ascending arpeggio
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
      
      // Descending sad tones
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
