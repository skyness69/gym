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
    <div className="space-y-16 group relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-l-4 border-l-white/5 hover:border-l-primary transition-all duration-700 pl-12 md:pl-20">
        
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-6">
             {isEditingName ? (
                <input 
                  className="bg-transparent border-0 border-b-4 border-primary outline-none text-7xl md:text-9xl heading-athletic text-white w-full"
                  value={localName}
                  onChange={e => setLocalName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={e => e.key === 'Enter' && handleNameSave()}
                  autoFocus
                />
              ) : (
                <h4 
                  onClick={() => setIsEditingName(true)}
                  className="text-7xl md:text-9xl heading-athletic text-white/90 group-hover:text-white cursor-text transition-colors"
                >
                  {exercise.name}
                </h4>
              )}
          </div>

          <div className="flex flex-wrap items-center gap-20">
            <div className="space-y-4">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">PROGRESS TELEMETRY</p>
               <div className="flex items-center gap-6">
                 <div className="h-1 w-60 bg-white/5 overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000" 
                      style={{ width: `${progressPercent}%` }} 
                    />
                 </div>
                 <span className="mono-data text-2xl font-black text-primary">{completedSets} / {totalSets}</span>
               </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">MODULE TYPE</p>
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-primary" />
                <span className="heading-athletic text-4xl text-white">HARDCORE_STRENGTH_V3</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onRemove}
          className="w-20 h-20 border border-white/5 flex items-center justify-center text-white/5 hover:text-primary hover:bg-primary/5 hover:border-primary transition-all rounded-sm md:mb-1"
        >
          <Trash2 className="w-7 h-7" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 w-full bg-white/5">
        {(exercise.sets || []).map((set, index) => (
          <div 
            key={set.id} 
            className={`p-12 h-64 bg-surface flex flex-col justify-between group/set border-t-2 ${set.isCompleted ? 'border-primary shadow-[inset_0_0_40px_rgba(255,95,31,0.05)]' : 'border-white/5'}`}
          >
            <div className="flex items-center justify-between">
              <span className="mono-data text-sm font-black text-white/10 uppercase tracking-[0.3em]">UNIT_{String(index + 1).padStart(2, '0')}</span>
              <button 
                onClick={() => handleUpdateSet(set.id, { isCompleted: !set.isCompleted })}
                className={`w-14 h-14 flex items-center justify-center transition-all border ${set.isCompleted ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/5 text-white/10 hover:border-primary'}`}
              >
                {set.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/10">MASS_KG</p>
                  <input 
                    type="number"
                    className="w-full bg-transparent heading-athletic text-6xl text-white outline-none"
                    value={set.weight || ''}
                    onChange={e => handleUpdateSet(set.id, { weight: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/10">FREQ_REPS</p>
                  <input 
                    type="number"
                    className="w-full bg-transparent heading-athletic text-6xl text-white outline-none"
                    value={set.reps || ''}
                    onChange={e => handleUpdateSet(set.id, { reps: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => removeSet(set.id)}
              className="absolute top-4 right-4 opacity-0 group-hover/set:opacity-100 p-2 text-white/10 hover:text-primary transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button 
          onClick={addSet}
          className="h-64 p-12 bg-surface hover:bg-white/[0.01] border-t-2 border-white/5 flex flex-col items-center justify-center gap-6 transition-all group/add"
        >
          <div className="w-14 h-14 border-2 border-dashed border-white/10 flex items-center justify-center group-hover/add:border-primary">
            <Plus className="w-6 h-6 text-white/10 group-hover/add:text-primary" />
          </div>
          <span className="heading-athletic text-2xl tracking-[0.2em] text-white/10 group-hover/add:text-white">APPEND SEQUENCE</span>
        </button>
      </div>
    </div>
  );
};

export default ExerciseItem;
