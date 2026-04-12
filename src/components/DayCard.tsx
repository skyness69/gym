import React from 'react';
import type { WorkoutDay } from '../types';
import { ChevronRight, Layers } from 'lucide-react';

interface DayCardProps {
  day: WorkoutDay;
  onClick: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="glass-card glass-card-hover p-6 flex flex-col justify-between group cursor-pointer relative overflow-hidden h-full min-h-[160px]"
    >
      <div className="space-y-4">
        <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-white/30 group-hover:text-cyan-400 group-hover:border-cyan-400/30 transition-all duration-500">
          <Layers className="w-5 h-5" />
        </div>
        
        <div>
          <h3 className="text-lg font-bold tracking-tight text-white/90 group-hover:text-white transition-colors line-clamp-1">{day.title}</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/10 mt-1 group-hover:text-cyan-400/40 transition-colors">Protocol v1.0</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white/30 mono-data">{String(day.exercises?.length || 0).padStart(2, '0')}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/10">Active Nodes</span>
        </div>
        
        <div className="text-white/10 group-hover:text-white/40 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Subtle scanner glow effect */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
    </div>
  );
};

export default DayCard;
