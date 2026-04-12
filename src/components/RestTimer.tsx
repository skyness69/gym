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
    <div className="fixed bottom-10 right-10 z-[200] animate-slide-up">
      <div className="performance-card p-6 flex items-center gap-8 bg-surface border-l-4 border-l-primary shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="transparent"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="4"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="transparent"
              stroke="#ff5f1f"
              strokeWidth="4"
              strokeDasharray={226}
              strokeDashoffset={226 - (226 * percentage) / 100}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center mono-data font-black text-xl text-primary">
            {timeLeft}s
          </div>
        </div>

        <div className="flex items-center gap-3 pl-8 border-l border-white/5">
          <button 
            onClick={() => setTimeLeft(duration)} 
            className="w-10 h-10 bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose} 
            className="w-10 h-10 bg-red-500/5 flex items-center justify-center text-red-500/40 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestTimer;
