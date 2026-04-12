import React, { useState } from 'react';
import type { WorkoutDay, Exercise } from '../types';
import { Plus, ChevronLeft, Target } from 'lucide-react';
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
      <header className="px-4 py-4 md:px-8 md:py-6 border-b border-white/5 bg-surface relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose} 
              className="w-8 h-8 md:w-10 md:h-10 bg-white/5 flex items-center justify-center text-white/40 hover:text-primary transition-all rounded-sm border border-white/5 hover:border-primary shrink-0"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            
            <div className="space-y-1">
              <h2 className="heading-athletic text-3xl md:text-5xl text-white leading-[0.9]">{day.title}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="status-dot active w-1.5 h-1.5" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary">LIVE ENGINE</span>
                </div>
                <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/10">
                  ID: <span className="text-white/40 mono-data">{day.id.substring(0, 6)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end gap-0.5">
              <span className={`text-[8px] font-black uppercase tracking-widest ${isSyncing ? 'text-primary' : 'text-white/5'}`}>
                 {isSyncing ? 'SYNCING...' : 'SYNCED'}
              </span>
            </div>
            
            <button 
              onClick={onClose}
              className="btn-blaze px-6 h-9 md:px-10 md:h-10 text-[9px]"
            >
              EXIT
            </button>
          </div>
        </div>
      </header>

      {/* Deployment Floor */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6 max-w-6xl mx-auto w-full scrollbar-hide relative z-10">
        <div className="flex flex-col gap-2 w-full">
          {exercises.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center bg-surface performance-card border-dashed">
              <div className="w-12 h-12 bg-white/5 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white/5" />
              </div>
              <h3 className="heading-athletic text-2xl text-white/10 tracking-widest">CLUSTER_VOID</h3>
            </div>
          ) : (
            exercises.map((ex, index) => (
              <div key={ex.id} className="animate-slide-up bg-surface p-4 md:p-8 performance-card" style={{ animationDelay: `${index * 50}ms` }}>
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
          className="w-full py-12 border border-dashed border-white/5 bg-surface flex flex-col items-center justify-center gap-4 text-white/10 hover:bg-white/[0.01] hover:border-primary hover:text-primary group transition-all duration-300 performance-card"
        >
          <div className="w-10 h-10 border border-white/5 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
            <Plus className="w-5 h-5" />
          </div>
          <span className="heading-athletic text-xl tracking-widest">DEPLOY NODE</span>
        </button>
        
        <div className="h-20" />
      </main>

      {showRestTimer && (
        <RestTimer duration={60} onClose={() => setShowRestTimer(false)} />
      )}
    </div>
  );
};

export default DayDetail;
