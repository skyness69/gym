import React, { useState } from 'react';
import type { Exercise, ExerciseSet } from '../types';
import { Trash2, Layers, Plus, Circle, CheckCircle2 } from 'lucide-react';

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
    const lastSet = exercise.sets && exercise.sets.length > 0 ? exercise.sets[exercise.sets.length - 1] : null;
    const newSet: ExerciseSet = {
      id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
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
    <div className="glass-card p-6 md:p-8 space-y-6 relative group border-white/5 hover:border-white/20 transition-all duration-500">
      {/* Exercise Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <Layers className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            {isEditingName ? (
              <input 
                className="bg-white/5 border-b border-blue-500/50 outline-none text-xl font-bold text-white w-full py-1"
                value={localName}
                onChange={e => setLocalName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={e => e.key === 'Enter' && handleNameSave()}
                autoFocus
              />
            ) : (
              <h4 
                onClick={() => setIsEditingName(true)}
                className="text-xl font-bold text-white/90 group-hover:text-white cursor-text transition-colors"
              >
                {exercise.name}
              </h4>
            )}
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mt-1">Advanced Tactical Plan</p>
          </div>
        </div>

        <button 
          onClick={onRemove}
          className="p-3 rounded-xl bg-red-500/5 text-red-500/40 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Set Header Labels (Desktop) */}
      <div className="hidden md:grid grid-cols-[40px_1fr_1fr_60px_40px] gap-6 px-4 text-[10px] uppercase font-bold tracking-widest text-white/20">
        <div className="text-center">Set</div>
        <div>Weight (KG)</div>
        <div>Reps</div>
        <div className="text-center">Done</div>
        <div></div>
      </div>

      {/* Sets List */}
      <div className="space-y-3">
        {(exercise.sets || []).map((set, index) => (
          <div 
            key={set.id} 
            className={`grid grid-cols-[40px_1fr_1fr_60px_40px] gap-3 md:gap-6 items-center p-3 rounded-2xl transition-all ${set.isCompleted ? 'bg-green-500/5 border border-green-500/10' : 'bg-white/[0.02] border border-white/5'}`}
          >
            {/* Set Number */}
            <div className="text-center font-bold text-white/20">{index + 1}</div>

            {/* Weight Input */}
            <div className="relative">
              <input 
                type="number"
                className={`w-full bg-black/20 border rounded-xl py-2 px-3 text-center font-bold transition-all outline-none ${set.isCompleted ? 'border-green-500/20 text-green-400/70' : 'border-white/5 text-blue-400 focus:border-blue-500/50'}`}
                value={set.weight || ''}
                onChange={e => handleUpdateSet(set.id, { weight: Number(e.target.value) })}
              />
            </div>

            {/* Reps Input */}
            <div className="relative">
              <input 
                type="number"
                className={`w-full bg-black/20 border rounded-xl py-2 px-3 text-center font-bold transition-all outline-none ${set.isCompleted ? 'border-green-500/20 text-green-400/70' : 'border-white/5 text-white focus:border-blue-500/50'}`}
                value={set.reps || ''}
                onChange={e => handleUpdateSet(set.id, { reps: Number(e.target.value) })}
              />
            </div>

            {/* Completion Toggle */}
            <div className="flex justify-center">
              <button 
                onClick={() => handleUpdateSet(set.id, { isCompleted: !set.isCompleted })}
                className={`transition-all ${set.isCompleted ? 'text-green-400' : 'text-white/10 hover:text-white/30'}`}
              >
                {set.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </button>
            </div>

            {/* Remove Set */}
            <div className="flex justify-center">
              <button 
                onClick={() => removeSet(set.id)}
                className="text-white/10 hover:text-red-400/70 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Add Set Button */}
        <button 
          onClick={addSet}
          className="w-full py-4 rounded-2xl border border-dashed border-white/5 text-white/20 hover:bg-white/[0.03] hover:border-blue-500/20 hover:text-blue-400/50 transition-all flex items-center justify-center gap-2 group/add"
        >
          <Plus className="w-4 h-4 group-hover/add:scale-125 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Append Set Structure</span>
        </button>
      </div>
    </div>
  );
};

export default ExerciseItem;
