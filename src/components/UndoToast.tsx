import React, { useEffect } from 'react';
import { RotateCcw, X } from 'lucide-react';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onClose: () => void;
}

const UndoToast: React.FC<UndoToastProps> = ({ message, onUndo, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 8000); // 8 seconds before it disappears
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-slide-up flex items-center justify-between gap-6 bg-[#101114] border border-white/10 px-6 py-4 shadow-[0_0_20px_rgba(138,187,108,0.15)] rounded-sm min-w-[320px]">
      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{message}</span>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => { onUndo(); onClose(); }}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> UNDO
        </button>
        <div className="w-[1px] h-4 bg-white/10" />
        <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default UndoToast;
