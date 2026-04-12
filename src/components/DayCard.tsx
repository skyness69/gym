import React from 'react';
import type { WorkoutDay } from '../types';
import { ArrowRight, Hash } from 'lucide-react';

interface DayCardProps {
  day: WorkoutDay;
  onClick: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="flex flex-col justify-between h-full min-h-[280px] cursor-pointer group"
    >
      <div className="space-y-6">
        <div className="mono-data text-[10px] font-black text-primary tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">
          PROT-{day.id.substring(0, 4).toUpperCase()}
        </div>
        
        <h3 className="heading-athletic text-6xl text-white group-hover:text-primary transition-colors leading-tight">
          {day.title}
        </h3>
      </div>
      
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Hash className="w-3 h-3 text-white/20" />
            <span className="mono-data text-2xl font-black text-white">{String(day.exercises?.length || 0).padStart(2, '0')}</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/10">Active Movements</p>
        </div>
        
        <div className="w-12 h-12 border border-white/5 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
          <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-black transition-colors" />
        </div>
      </div>
      
      {/* Decorative vertical line */}
      <div className="absolute top-12 left-0 w-1 h-0 bg-primary group-hover:h-32 transition-all duration-700" />
    </div>
  );
};

export default DayCard;
