import React from 'react';
import type { WorkoutDay } from '../types';
import { ChevronRight, Target, Hash } from 'lucide-react';

interface DayCardProps {
  day: WorkoutDay;
  onClick: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="glass-card glass-card-hover p-8 flex flex-col justify-between group cursor-pointer relative overflow-hidden h-full min-h-[180px] border-l-2 border-l-white/10 hover:border-l-energy transition-all duration-500"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-white/30 group-hover:text-energy group-hover:bg-energy/5 group-hover:border-energy/30 transition-all duration-500">
            <Target className="w-6 h-6" />
          </div>
          <span className="mono-data text-[10px] font-bold text-white/10 group-hover:text-energy/40 transition-colors">MDL-{day.id.substring(0, 4).toUpperCase()}</span>
        </div>
        
        <div>
          <h3 className="heading-power text-2xl tracking-tighter text-white/90 group-hover:text-white transition-colors line-clamp-1">{day.title}</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/10 mt-2 group-hover:text-energy/60 transition-colors">Target Objective: Hypertrophy</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <div className="flex items-center gap-3">
          <Hash className="w-3 h-3 text-energy/40" />
          <span className="text-xs font-bold text-white/40 mono-data group-hover:text-energy transition-colors">{String(day.exercises?.length || 0).padStart(2, '0')}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/10">Active Nodes</span>
        </div>
        
        <div className="text-white/10 group-hover:text-energy transition-colors">
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Industrial Scanline Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
    </div>
  );
};

export default DayCard;
