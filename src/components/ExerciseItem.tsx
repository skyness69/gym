import React, { useState } from 'react';
import type { Exercise, ExerciseSet } from '../types';
import { Trash2, Plus, Circle, CheckCircle2, Hash } from 'lucide-react';

interface ExerciseItemProps {
  exercise: Exercise;
  onUpdate: (updated: Exercise) => void;
  onRemove: () => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, onUpdate, onRemove }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [localName, setLocalName] = useState(exercise.name);

  const handleNameSave = () => {
    onUpdate({ ...exercise, name: localName });
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

  return (
    <div className="glass-card p-6 md:p-10 space-y-8 bg-white/[0.01] border-white/5 relative overflow-hidden group">
      {/* Exercise Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <div className="flex items-center gap-5 flex-1">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:text-cyan-400/60 group-hover:border-cyan-400/20 transition-all duration-500">
            <Hash className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            {isEditingName ? (
              <input 
                className="bg-transparent border-b border-cyan-500/50 underline-offset-8 outline-none text-2xl font-bold text-white w-full uppercase tracking-tight"
                value={localName}
                onChange={e => setLocalName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={e => e.key === 'Enter' && handleNameSave()}
                autoFocus
              />
            ) : (
              <h4 
                onClick={() => setIsEditingName(true)}
                className="text-2xl font-black text-white/80 group-hover:text-white cursor-text transition-colors uppercase tracking-tight"
              >
                {exercise.name}
              </h4>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Operational Module</span>
              <div className="w-1 h-1 rounded-full bg-white/5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/10">v1.2</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onRemove}
          className="w-10 h-10 rounded-xl bg-red-500/5 text-red-500/0 group-hover:text-red-500/20 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Sets Command Container */}
      <div className="space-y-4">
        {/* Table Header (Desktop) */}
        <div className="hidden md:grid grid-cols-[60px_1fr_1fr_80px_60px] gap-6 px-4 mb-2">
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/10">Set</div>
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/10">Mass (KG)</div>
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/10">Frequency</div>
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/10 text-center">Status</div>
          <div></div>
        </div>

        {/* Sets List */}
        <div className="space-y-3">
          {(exercise.sets || []).map((set, index) => (
            <div 
              key={set.id} 
              className={`grid grid-cols-1 md:grid-cols-[60px_1fr_1fr_80px_60px] gap-4 md:gap-6 items-center p-4 md:p-3 rounded-2xl transition-all duration-500 border ${set.isCompleted ? 'success-glow border-green-500/20' : 'bg-white/[0.01] border-white/5 hover:border-white/10'}`}
            >
              {/* Set Label */}
              <div className="flex items-center justify-between md:justify-center">
                <span className="md:hidden text-[10px] font-bold uppercase tracking-widest text-white/20">Sequence Index</span>
                <span className="mono-data font-black text-white/20 group-hover:text-white/40">{String(index + 1).padStart(2, '0')}</span>
              </div>

              {/* Weight Input */}
              <div className="relative">
                <input 
                  type="number"
                  className={`glass-input text-center text-lg h-12 md:h-10 ${set.isCompleted ? 'text-green-400/80 border-green-500/10' : ''}`}
                  value={set.weight || ''}
                  onChange={e => handleUpdateSet(set.id, { weight: Number(e.target.value) })}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/10 uppercase md:hidden">Mass/KG</span>
              </div>

              {/* Reps Input */}
              <div className="relative">
                <input 
                  type="number"
                  className={`glass-input text-center text-lg h-12 md:h-10 ${set.isCompleted ? 'text-green-400/80 border-green-500/10' : ''}`}
                  value={set.reps || ''}
                  onChange={e => handleUpdateSet(set.id, { reps: Number(e.target.value) })}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/10 uppercase md:hidden">Reps</span>
              </div>

              {/* Completion Toggle */}
              <div className="flex justify-center md:h-full">
                <button 
                  onClick={() => handleUpdateSet(set.id, { isCompleted: !set.isCompleted })}
                  className={`w-full md:w-12 h-12 md:h-full rounded-xl flex items-center justify-center transition-all ${set.isCompleted ? 'text-green-400 bg-green-500/10' : 'text-white/5 bg-white/5 hover:text-white/20 hover:bg-white/10'}`}
                >
                  {set.isCompleted ? <CheckCircle2 className="w-5 h-5 shadow-[0_0_10px_rgba(34,197,94,0.4)]" /> : <Circle className="w-5 h-5" />}
                </button>
              </div>

              {/* Remove Set */}
              <div className="flex justify-center">
                <button 
                  onClick={() => removeSet(set.id)}
                  className="w-full md:w-auto h-12 md:h-auto flex items-center justify-center text-white/5 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Append Structure */}
          <button 
            onClick={addSet}
            className="w-full py-5 rounded-2xl border border-dashed border-white/5 text-white/[0.03] hover:bg-white/[0.02] hover:border-cyan-500/20 hover:text-cyan-400/40 transition-all flex items-center justify-center gap-3 group/btn uppercase tracking-[0.3em] text-[9px] font-black"
          >
            <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-500" />
            Append Set Structure
          </button>
        </div>
      </div>
      
      {/* Absolute scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.02] to-transparent h-[1px] top-0 group-hover:top-full transition-all duration-[2000ms] pointer-events-none" />
    </div>
  );
};

export default ExerciseItem;
