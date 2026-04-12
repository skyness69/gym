import React, { useState } from 'react';
import type { Exercise, ExerciseSet } from '../types';
import { Trash2, Plus, Circle, CheckCircle2, Activity } from 'lucide-react';

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
    <div className="space-y-6 group relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l border-white/10 hover:border-l-primary transition-all duration-300 pl-4 md:pl-6">
        
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-4">
             {isEditingName ? (
                <input 
                  className="bg-transparent border-0 border-b border-primary outline-none text-2xl md:text-4xl heading-athletic text-white w-full"
                  value={localName}
                  onChange={e => setLocalName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={e => e.key === 'Enter' && handleNameSave()}
                  autoFocus
                />
              ) : (
                <h4 
                  onClick={() => setIsEditingName(true)}
                  className="text-2xl md:text-4xl heading-athletic text-white/90 group-hover:text-white cursor-text transition-colors leading-[1]"
                >
                  {exercise.name}
                </h4>
              )}
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <div className="space-y-1">
               <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/10 italic">TELEMETRY</p>
               <div className="flex items-center gap-3">
                 <div className="h-[1px] w-20 bg-white/5 overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000" 
                      style={{ width: `${progressPercent}%` }} 
                    />
                 </div>
                 <span className="mono-data text-[10px] font-black text-primary">{completedSets}/{totalSets}</span>
               </div>
            </div>

            <div className="space-y-1">
              <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/10 italic">SPEC</p>
              <div className="flex items-center gap-1.5">
                <Activity className="w-2.5 h-2.5 text-primary/40" />
                <span className="heading-athletic text-sm text-white/20">C3</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onRemove}
          className="w-8 h-8 flex items-center justify-center text-white/5 hover:text-primary transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
        {(exercise.sets || []).map((set, index) => (
          <div 
            key={set.id} 
            className={`p-4 h-24 bg-surface flex flex-col justify-between group/set border-t-2 performance-card ${set.isCompleted ? 'border-primary' : 'border-white/5'}`}
          >
            <div className="flex items-center justify-between">
              <span className="mono-data text-[7px] font-black text-white/10 uppercase tracking-[0.2em]">S_{String(index + 1).padStart(2, '0')}</span>
              <button 
                onClick={() => handleUpdateSet(set.id, { isCompleted: !set.isCompleted })}
                className={`w-6 h-6 flex items-center justify-center transition-all border ${set.isCompleted ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/5 text-white/5 hover:border-primary'}`}
              >
                {set.isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex flex-col items-center">
                <p className="text-[8px] font-black uppercase tracking-[0.1em] text-white/5">MASS</p>
                <input 
                  type="number"
                  className="w-full bg-transparent heading-athletic text-3xl text-white outline-none text-center"
                  value={set.weight || ''}
                  onChange={e => handleUpdateSet(set.id, { weight: Number(e.target.value) })}
                />
              </div>
            </div>

            <button 
              onClick={() => removeSet(set.id)}
              className="absolute top-1 right-1 opacity-0 group-hover/set:opacity-100 p-1 text-white/5 hover:text-primary transition-all"
            >
              <Trash2 className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}

        <button 
          onClick={addSet}
          className="h-24 p-4 bg-surface hover:bg-white/[0.01] border-t-2 border-white/5 flex flex-col items-center justify-center gap-2 transition-all group/add performance-card"
        >
          <div className="w-6 h-6 border-2 border-dashed border-white/5 flex items-center justify-center group-hover/add:border-primary">
            <Plus className="w-3.5 h-3.5 text-white/5 group-hover/add:text-primary" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default ExerciseItem;
