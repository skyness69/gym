import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, Bell } from 'lucide-react';

interface RestTimerProps {
  duration: number; // in seconds
  onClose: () => void;
}

const PRESETS = [60, 90, 120, 180];

const RestTimer: React.FC<RestTimerProps> = ({ duration: initialDuration, onClose }) => {
  const [duration, setDuration] = useState(initialDuration);
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isActive, setIsActive] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play a short beep using the Web Audio API when time runs out
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio not available in this environment
    }
    // Vibrate on mobile if supported
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      playBeep();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleReset = () => {
    setTimeLeft(duration);
    setIsActive(true);
  };

  const handlePreset = (secs: number) => {
    setDuration(secs);
    setTimeLeft(secs);
    setIsActive(true);
  };

  const percentage = duration > 0 ? (timeLeft / duration) * 100 : 0;
  const circumference = 2 * Math.PI * 36; // r=36
  const dashOffset = circumference - (circumference * percentage) / 100;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const display = mins > 0
    ? `${mins}:${String(secs).padStart(2, '0')}`
    : `${timeLeft}s`;

  const isDone = timeLeft === 0;

  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-slide-up">
      <div className={`performance-card p-5 flex flex-col gap-4 bg-surface shadow-[0_20px_60px_rgba(0,0,0,0.85)] border-l-4 transition-colors duration-500 ${isDone ? 'border-l-primary' : 'border-l-primary/40'}`}>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5">
          <Bell className="w-3 h-3 text-white/20 mr-1" />
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => handlePreset(p)}
              className={`text-[9px] font-black tracking-widest px-2 py-1 transition-all rounded-sm ${duration === p ? 'bg-primary text-black' : 'text-white/20 hover:text-primary hover:bg-primary/10'}`}
            >
              {p >= 60 ? `${p / 60}M` : `${p}S`}
            </button>
          ))}
        </div>

        {/* Timer Row */}
        <div className="flex items-center gap-6">
          {/* Circular Progress */}
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="transparent"
                stroke={isDone ? '#8ABB6C' : '#8ABB6C'}
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000 ease-linear"
                strokeLinecap="round"
              />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center mono-data font-black text-lg transition-colors ${isDone ? 'text-primary animate-pulse' : 'text-primary'}`}>
              {isDone ? 'GO!' : display}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-2 pl-4 border-l border-white/5">
            <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${isDone ? 'text-primary' : 'text-white/20'}`}>
              {isDone ? 'REST COMPLETE' : 'REST TIMER'}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={handleReset}
                title="Restart timer"
                className="w-9 h-9 bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all rounded-sm"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                title="Dismiss timer"
                className="w-9 h-9 bg-red-500/5 flex items-center justify-center text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestTimer;
