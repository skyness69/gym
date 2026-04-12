import React from 'react';
import type { WorkoutDay } from '../types';
import { ArrowRight, Hash, Trophy } from 'lucide-react';

interface DayCardProps {
  day: WorkoutDay;
  onClick: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, onClick }) => {
  const isCompleted = day.exercises?.length > 0 && day.exercises.every(ex => 
    ex.sets?.length > 0 && ex.sets.every(s => s.isCompleted)
  );

  return (
    <div 
      onClick={onClick}
      className="flex flex-col justify-between h-full min-h-[160px] cursor-pointer group"
    >
      <div className="space-y-3">
        <div className="mono-data text-[8px] font-black text-primary tracking-[0.3em] opacity-30 group-hover:opacity-100 transition-opacity">
          DAY_{day.id.substring(0, 4).toUpperCase()}
        </div>
        
        <div className="flex items-start justify-between">
          <h3 className="heading-athletic text-4xl text-white group-hover:text-primary transition-colors leading-tight">
            {day.title}
          </h3>
          {isCompleted && (
            <div className="flex items-center gap-1 bg-primary/10 border border-primary/30 px-2 py-0.5 rounded-sm">
              <Trophy className="w-3 h-3 text-primary" />
              <span className="text-[8px] font-black text-primary tracking-tighter">DONE</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Hash className="w-2.5 h-2.5 text-white/10" />
            <span className="mono-data text-lg font-black text-white">{String(day.exercises?.length || 0).padStart(2, '0')}</span>
          </div>
          <p className="text-[8px] font-black uppercase tracking-widest text-white/5">Exercises</p>
        </div>
        
        <div className="w-8 h-8 border border-white/5 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
          <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-black transition-colors" />
        </div>
      </div>
      
      {/* Decorative vertical line */}
      <div className="absolute top-6 left-0 w-[2px] h-0 bg-primary group-hover:h-12 transition-all duration-700" />
    </div>
  );
};

export default DayCard;
