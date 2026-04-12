import React, { useState, useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';

interface RestTimerProps {
  duration: number; // in seconds
  onClose: () => void;
}

const RestTimer: React.FC<RestTimerProps> = ({ duration, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Optional: Play a sound or vibrate
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-slide-up">
      <div className="glass-card p-4 flex items-center gap-6 border-l-4 border-l-energy">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="transparent"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="4"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="transparent"
              stroke="#22c55e"
              strokeWidth="4"
              strokeDasharray={176}
              strokeDashoffset={176 - (176 * percentage) / 100}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center mono-data font-bold text-lg text-energy">
            {timeLeft}s
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="heading-power text-sm tracking-widest text-white/80">RECOVERY PHASE</h4>
          <p className="text-[10px] font-bold text-white/20 uppercase">Next set ready in {timeLeft}...</p>
        </div>

        <div className="flex items-center gap-2 pl-4 border-l border-white/5">
          <button 
            onClick={() => setTimeLeft(duration)} 
            className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg bg-red-500/10 text-red-500/60 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestTimer;
