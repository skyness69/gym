import React, { useState } from 'react';
import type { Exercise, ExerciseSet } from '../types';
import { Trash2, Plus, Circle, CheckCircle2, Hash, Activity } from 'lucide-react';

interface ExerciseItemProps {
  exercise: Exercise;
  onUpdate: (updated: Exercise) => void;
  onRemove: () => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, onUpdate, onRemove }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [localName, setLocalName] = useState(exercise.name);

  const handleNameSave = () => {
    onUpdate({ ...exercise, name: localName.toUpperCase() });
    setIsEditingName(false);
  };

  const handleUpdateSet = (setId: string, updates: Partial<ExerciseSet>) => {
    const newSets = exercise.sets.map(s => 
      s.id === setId ? { ...s, ...updates } : s
    );
    onUpdate({ ...exercise, sets: newSets });
  };

  const addSet = () => {
    const uuid = () => (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11);
    const lastSet = exercise.sets && exercise.sets.length > 0 ? exercise.sets[exercise.sets.length - 1] : null;
    const newSet: ExerciseSet = {
      id: uuid(),
      weight: lastSet ? lastSet.weight : 0,
      reps: lastSet ? lastSet.reps : 10,
      isCompleted: false
    };
    onUpdate({ ...exercise, sets: [...(exercise.sets || []), newSet] });
  };

  const removeSet = (setId: string) => {
    const newSets = exercise.sets.filter(s => s.id !== setId);
    onUpdate({ ...exercise, sets: newSets });
  };

  const completedSets = exercise.sets?.filter(s => s.isCompleted).length || 0;
  const totalSets = exercise.sets?.length || 0;
  const progressPercent = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <div className="glass-card p-8 md:p-12 space-y-10 bg-white/[0.01] border-white/5 relative overflow-hidden group border-l-4 border-l-white/10 hover:border-l-energy transition-all duration-500">
      {/* Exercise Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/5">
        <div className="flex items-center gap-8 flex-1">
          <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/10 group-hover:text-energy group-hover:bg-energy/5 group-hover:border-energy/20 transition-all duration-500">
            <Activity className="w-8 h-8" />
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-4">
              {isEditingName ? (
                <input 
                  className="bg-transparent border-b-2 border-energy outline-none text-4xl heading-power text-white w-full"
                  value={localName}
                  onChange={e => setLocalName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={e => e.key === 'Enter' && handleNameSave()}
                  autoFocus
                />
              ) : (
                <h4 
                  onClick={() => setIsEditingName(true)}
                  className="text-4xl heading-power text-white/80 group-hover:text-white cursor-text transition-colors"
                >
                  {exercise.name}
                </h4>
              )}
            </div>
            
            {/* Intensity Progress Bar */}
            <div className="flex items-center gap-4">
              <div className="h-1.5 w-48 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-energy transition-all duration-700 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
              <span className="mono-data text-[11px] font-black text-white/20 uppercase tracking-widest">
                INTENSITY: {completedSets}/{totalSets} SETS DEPLETE
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={onRemove}
          className="w-12 h-12 rounded-lg bg-red-500/5 text-red-500/10 group-hover:text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center border border-transparent hover:border-red-500/20"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Sets Command Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(exercise.sets || []).map((set, index) => (
          <div 
            key={set.id} 
            className={`p-6 rounded-xl border transition-all duration-500 flex flex-col justify-between h-40 relative group/set ${set.isCompleted ? 'bg-energy/5 border-energy/30' : 'bg-white/[0.01] border-white/5 hover:border-white/10'}`}
          >
            <div className="flex items-center justify-between">
              <span className="mono-data text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">SEQUENCE {String(index + 1).padStart(2, '0')}</span>
              <button 
                onClick={() => handleUpdateSet(set.id, { isCompleted: !set.isCompleted })}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${set.isCompleted ? 'bg-energy text-black' : 'bg-white/5 text-white/10 hover:text-white/40 hover:bg-white/10'}`}
              >
                {set.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/10">MASS (KG)</p>
                <input 
                  type="number"
                  className="w-full bg-transparent heading-power text-3xl text-white outline-none"
                  value={set.weight || ''}
                  onChange={e => handleUpdateSet(set.id, { weight: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/10">REPS</p>
                <input 
                  type="number"
                  className="w-full bg-transparent heading-power text-3xl text-white outline-none"
                  value={set.reps || ''}
                  onChange={e => handleUpdateSet(set.id, { reps: Number(e.target.value) })}
                />
              </div>
            </div>

            <button 
              onClick={() => removeSet(set.id)}
              className="absolute top-2 right-2 opacity-0 group-hover/set:opacity-100 p-1 text-white/10 hover:text-red-500 transition-all"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            
            {/* Set scanline */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-energy/20 w-0 group-hover/set:w-full transition-all duration-500" />
          </div>
        ))}

        <button 
          onClick={addSet}
          className="h-40 p-6 rounded-xl border border-dashed border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-energy/30 text-white/10 hover:text-energy flex flex-col items-center justify-center gap-4 transition-all duration-500 group/add"
        >
          <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center group-hover/add:border-energy/20">
            <Plus className="w-5 h-5" />
          </div>
          <span className="heading-power text-xs tracking-[0.2em]">APPEND SEQUENCE</span>
        </button>
      </div>
      
      {/* Absolute industry scanline effect */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.02] pointer-events-none">
        <Hash className="w-full h-full text-white" />
      </div>
    </div>
  );
};

export default ExerciseItem;
