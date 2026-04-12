import React, { useState } from 'react';
import type { WorkoutDay, Exercise } from '../types';
import { Plus, ChevronLeft, Cloud, CloudCheck, Activity, ShieldCheck } from 'lucide-react';
import ExerciseItem from './ExerciseItem';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface DayDetailProps {
  day: WorkoutDay;
  onClose: () => void;
}

const DayDetail: React.FC<DayDetailProps> = ({ day, onClose }) => {
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
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col overflow-hidden animate-fade-in">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Immersive Navbar */}
      <header className="px-6 py-8 md:px-12 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/5 relative z-10">
        <div className="flex items-center gap-8">
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-white/90">{day.title || 'Untitled Routine'}</h2>
              <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-cyan-400">Live</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-white/20">
                <ShieldCheck className="w-3 h-3 text-white/10" />
                Secure Mode
              </div>
              <div className="w-1 h-1 rounded-full bg-white/5" />
              <div className="text-[9px] font-bold uppercase tracking-widest text-white/20">
                Data Instance: <span className="text-white/40 mono-data">{day.id.substring(0, 8)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex flex-col items-end">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
              {isSyncing ? (
                <span className="text-cyan-400 flex items-center gap-2">
                  <Cloud className="w-3 h-3 animate-pulse" />
                  Syncing Core...
                </span>
              ) : (
                <span className="text-green-500/60 flex items-center gap-2">
                  <CloudCheck className="w-3 h-3" />
                  Kernel Synced
                </span>
              )}
            </div>
            {lastSynced && (
              <span className="text-[9px] text-white/10 font-medium uppercase mt-1">Validated: {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </div>
          
          <button 
            onClick={onClose}
            className="glass-button-primary px-10 text-xs tracking-widest"
          >
            FINALIZE SESSION
          </button>
        </div>
      </header>

      {/* Main Command Center */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 max-w-5xl mx-auto w-full scrollbar-hide relative z-10">
        <div className="grid grid-cols-1 gap-6">
          {exercises.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center glass-card border-dashed bg-white/[0.01] border-white/5">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                <Activity className="w-8 h-8 text-white/10" />
              </div>
              <h3 className="text-lg font-bold text-white/30 tracking-widest uppercase">No Modules Compiled</h3>
              <p className="text-xs text-white/20 mt-3 uppercase tracking-widest">Append movement nodes to initialize routine.</p>
            </div>
          ) : (
            exercises.map((ex, index) => (
              <div key={ex.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <ExerciseItem 
                  exercise={ex} 
                  onUpdate={handleUpdateExercise}
                  onRemove={() => removeExercise(ex.id)}
                />
              </div>
            ))
          )}
        </div>

        <button
          onClick={addExercise}
          className="w-full py-12 glass-card border-dashed bg-white/[0.01] flex flex-col items-center justify-center gap-4 text-white/10 hover:bg-white/[0.03] hover:border-cyan-500/30 hover:text-cyan-400 group transition-all duration-700"
        >
          <div className="w-14 h-14 rounded-full border border-white/5 flex items-center justify-center group-hover:border-cyan-500/20 group-hover:bg-cyan-500/5 transition-all duration-500">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Append Movement Node</span>
        </button>
        
        <div className="h-24" />
      </main>
    </div>
  );
};

export default DayDetail;
