import React from 'react';
import type { WorkoutDay } from '../types';
import { ChevronRight, Dumbbell, Activity, Target } from 'lucide-react';

interface DayCardProps {
  day: WorkoutDay;
  onClick: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="glass-card glass-card-hover p-6 flex items-center justify-between group cursor-pointer relative overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10 group-hover:bg-blue-500/10 transition-colors" />

      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 flex items-center justify-center group-hover:border-blue-500/30 group-hover:bg-blue-500/5 transition-all duration-500">
          <Dumbbell className="w-7 h-7 text-white/40 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-500" />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-wide text-white/90 group-hover:text-white transition-colors">{day.title}</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-white/30 text-xs font-medium uppercase tracking-tighter">
              <Activity className="w-3 h-3 text-blue-500/50" />
              {day.exercises.length} Exercises
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="flex items-center gap-1.5 text-white/30 text-xs font-medium uppercase tracking-tighter">
              <Target className="w-3 h-3 text-purple-500/50" />
              Routine
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white/20 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all">
        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};

export default DayCard;
