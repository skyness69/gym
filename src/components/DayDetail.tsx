import React, { useState } from 'react';
import type { WorkoutDay, Exercise } from '../types';
import { Plus, ChevronLeft, Target, CloudCheck, Activity } from 'lucide-react';
import ExerciseItem from './ExerciseItem';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import RestTimer from './RestTimer';

interface DayDetailProps {
  day: WorkoutDay;
  onClose: () => void;
}

const DayDetail: React.FC<DayDetailProps> = ({ day, onClose }) => {
  const [exercises, setExercises] = useState<Exercise[]>(day?.exercises || []);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);

  if (!day) return null;

  const syncToFirebase = async (newExercises: Exercise[]) => {
    setIsSyncing(true);
    try {
      const dayRef = doc(db, `users/${day.userId}/workout_days/${day.id}`);
      await updateDoc(dayRef, { exercises: newExercises });
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateExercise = (updatedEx: Exercise, triggerTimer: boolean = false) => {
    const newExs = exercises.map(ex => ex.id === updatedEx.id ? updatedEx : ex);
    setExercises(newExs);
    syncToFirebase(newExs);
    if (triggerTimer) {
      setShowRestTimer(false);
      setTimeout(() => setShowRestTimer(true), 100);
    }
  };

  const addExercise = () => {
    const uuid = () => (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11);
    const newEx: Exercise = {
      id: uuid(),
      name: 'NEW MOVEMENT',
      sets: []
    };
    const newExs = [...exercises, newEx];
    setExercises(newExs);
    syncToFirebase(newExs);
  };

  const removeExercise = (id: string) => {
    const newExs = exercises.filter(ex => ex.id !== id);
    setExercises(newExs);
    syncToFirebase(newExs);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col overflow-hidden animate-fade-in font-['Inter']">
      
      {/* High-Performance Navbar */}
      <header className="px-6 py-8 md:px-20 md:py-12 border-b border-white/5 bg-surface relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-start md:items-center gap-6 md:gap-12">
            <button 
              onClick={onClose} 
              className="w-12 h-12 md:w-14 md:h-14 bg-white/5 flex items-center justify-center text-white/40 hover:text-primary transition-all rounded-sm border border-white/5 hover:border-primary shrink-0 mt-1 md:mt-0"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            <div className="space-y-2 md:space-y-4">
              <h2 className="heading-athletic text-6xl md:text-9xl text-white leading-[0.8]">{day.title}</h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex items-center gap-2">
                  <span className="status-dot active" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">LIVE ENGINE</span>
                </div>
                <div className="hidden sm:block w-[1px] h-3 bg-white/10" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                  REF: <span className="text-white mono-data">{day.id.substring(0, 6)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-8 border-t border-white/5 pt-6 md:border-0 md:pt-0">
            <div className="flex flex-col items-start md:items-end gap-1">
              {isSyncing ? (
                <span className="text-primary text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                   ENCRYPTING...
                </span>
              ) : (
                <span className="text-white/10 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                   SYNCED
                </span>
              )}
            </div>
            
            <button 
              onClick={onClose}
              className="btn-blaze px-8 h-12 md:px-16 md:h-14 text-[10px]"
            >
              EXIT SESSION
            </button>
          </div>
        </div>
      </header>

      {/* Deployment Floor */}
      <main className="flex-1 overflow-y-auto p-6 md:p-20 space-y-12 md:space-y-20 max-w-7xl mx-auto w-full scrollbar-hide relative z-10">
        <div className="flex flex-col gap-1 w-full bg-white/5">
          {exercises.length === 0 ? (
            <div className="py-60 flex flex-col items-center justify-center bg-surface">
              <div className="w-24 h-24 bg-white/5 flex items-center justify-center mb-10">
                <Target className="w-10 h-10 text-white/10" />
              </div>
              <h3 className="heading-athletic text-6xl text-white/20 tracking-widest uppercase">CLUSTER VOID</h3>
            </div>
          ) : (
            exercises.map((ex, index) => (
              <div key={ex.id} className="animate-slide-up bg-surface p-12 md:p-20" style={{ animationDelay: `${index * 50}ms` }}>
                <ExerciseItem 
                  exercise={ex} 
                  onUpdate={(updated) => handleUpdateExercise(updated, true)}
                  onRemove={() => removeExercise(ex.id)}
                />
              </div>
            ))
          )}
        </div>

        <button
          onClick={addExercise}
          className="w-full py-32 border-2 border-dashed border-white/10 bg-surface flex flex-col items-center justify-center gap-8 text-white/20 hover:bg-white/[0.02] hover:border-primary hover:text-primary group transition-all duration-700"
        >
          <div className="w-20 h-20 border-2 border-white/5 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
            <Plus className="w-10 h-10" />
          </div>
          <span className="heading-athletic text-4xl tracking-widest">DEPLOY NEW NODE</span>
        </button>
        
        <div className="h-60" />
      </main>

      {showRestTimer && (
        <RestTimer duration={60} onClose={() => setShowRestTimer(false)} />
      )}
    </div>
  );
};

export default DayDetail;
