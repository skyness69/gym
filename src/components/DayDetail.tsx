import React, { useState } from 'react';
import type { WorkoutDay, Exercise } from '../types';
import { Plus, ChevronLeft, Cloud, CloudCheck, Activity } from 'lucide-react';
import ExerciseItem from './ExerciseItem';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface DayDetailProps {
  day: WorkoutDay;
  onClose: () => void;
}

const DayDetail: React.FC<DayDetailProps> = ({ day, onClose }) => {
  // Defensive check for initialization
  const [exercises, setExercises] = useState<Exercise[]>(day?.exercises || []);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  if (!day) return null;

  const syncToFirebase = async (newExercises: Exercise[]) => {
    setIsSyncing(true);
    try {
      const dayRef = doc(db, `users/${day.userId}/workout_days/${day.id}`);
      await updateDoc(dayRef, { exercises: newExercises });
      setLastSynced(new Date());
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateExercise = (updatedEx: Exercise) => {
    const newExs = exercises.map(ex => ex.id === updatedEx.id ? updatedEx : ex);
    setExercises(newExs);
    syncToFirebase(newExs);
  };

  const addExercise = () => {
    const newEx: Exercise = {
      id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      name: 'New Exercise',
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
    <div className="fixed inset-0 z-[100] bg-black backdrop-blur-3xl flex flex-col overflow-hidden">
      {/* Immersive Header */}
      <header className="p-6 md:px-12 border-b border-white/10 flex items-center justify-between bg-black/40 relative z-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={onClose} 
            className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-0.5">{day.title || 'Untitled Routine'}</h2>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
              <Activity className="w-3 h-3 text-blue-500" />
              Configuration Mode
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2 text-xs font-medium text-white/40">
              {isSyncing ? (
                <>
                  <Cloud className="w-3 h-3 animate-pulse text-blue-400" />
                  Synchronizing...
                </>
              ) : (
                <>
                  <CloudCheck className="w-3 h-3 text-green-400" />
                  Cloud Secured
                </>
              )}
            </div>
            {lastSynced && !isSyncing && (
              <span className="text-[10px] text-white/20 uppercase tracking-tighter">Verified: {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </div>
          
          <button 
            onClick={onClose}
            className="glass-button-primary px-8"
          >
            Save & Exit
          </button>
        </div>
      </header>

      {/* Exercise List */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12 space-y-6 max-w-4xl mx-auto w-full scrollbar-hide relative z-10">
        <div className="space-y-4">
          {exercises.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center glass-card border-dashed bg-white/[0.01]">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                <Plus className="w-8 h-8 text-white/10" />
              </div>
              <h3 className="text-lg font-medium text-white/40">No exercises assigned</h3>
              <p className="text-sm text-white/20 mt-2">Start building your routine by adding your first lift.</p>
            </div>
          ) : (
            exercises.map(ex => (
              <ExerciseItem 
                key={ex.id} 
                exercise={ex} 
                onUpdate={handleUpdateExercise}
                onRemove={() => removeExercise(ex.id)}
              />
            ))
          )}
        </div>

        <button
          onClick={addExercise}
          className="w-full py-8 border-2 border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center gap-3 text-white/30 hover:bg-white/[0.03] hover:border-blue-500/30 hover:text-blue-400/70 transition-all duration-500 group"
        >
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold tracking-wide uppercase">Incorporate New Movement</span>
        </button>
        
        <div className="h-20" /> {/* Spacer */}
      </main>
    </div>
  );
};

export default DayDetail;
