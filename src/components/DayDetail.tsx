import React, { useState } from 'react';
import type { WorkoutDay, Exercise } from '../types';
import { Plus, ChevronLeft, Cloud, CloudCheck, Target } from 'lucide-react';
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
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col overflow-hidden animate-fade-in font-['Barlow_Condensed']">
      {/* Industrial Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] grain-texture -z-10" />

      {/* Rugged Header */}
      <header className="px-6 py-10 md:px-12 flex items-center justify-between bg-black/80 backdrop-blur-3xl border-b-2 border-white/5 relative z-10">
        <div className="flex items-center gap-10">
          <button 
            onClick={onClose} 
            className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-white/20 hover:text-energy hover:bg-energy/5 hover:border-energy/20 transition-all border border-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="space-y-1">
            <h2 className="heading-power text-4xl tracking-tighter text-white">{day.title}</h2>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-energy animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-energy">Active Briefing</span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                ID: <span className="mono-data text-white/40">{day.id.substring(0, 12)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden lg:flex flex-col items-end">
            <div className="flex items-center gap-3">
              {isSyncing ? (
                <span className="text-energy animate-pulse text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Cloud className="w-3 h-3" /> Encrypting...
                </span>
              ) : (
                <span className="text-white/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <CloudCheck className="w-3 h-3 text-energy/40" /> Cluster Synced
                </span>
              )}
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="glass-button-primary px-12 text-sm"
          >
            TERMINATE SESSION
          </button>
        </div>
      </header>

      {/* Main Deployment Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 max-w-6xl mx-auto w-full scrollbar-hide relative z-10">
        <div className="grid grid-cols-1 gap-12">
          {exercises.length === 0 ? (
            <div className="py-40 flex flex-col items-center justify-center glass-card border-dashed bg-white/[0.01] border-white/5">
              <div className="w-24 h-24 rounded-lg bg-white/5 flex items-center justify-center mb-10 border border-white/10">
                <Target className="w-10 h-10 text-white/10" />
              </div>
              <h3 className="heading-power text-2xl text-white/30 tracking-widest uppercase">No Movement Nodes Assigned</h3>
              <p className="text-sm font-bold text-white/10 mt-4 uppercase tracking-[0.2em]">Deploy hardware to initialize cluster.</p>
            </div>
          ) : (
            exercises.map((ex, index) => (
              <div key={ex.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
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
          className="w-full py-20 glass-card border-dashed bg-white/[0.01] border-2 border-white/5 flex flex-col items-center justify-center gap-6 text-white/10 hover:bg-white/[0.03] hover:border-energy/30 hover:text-energy group transition-all duration-700"
        >
          <div className="w-16 h-16 rounded-lg border border-white/10 flex items-center justify-center group-hover:border-energy/30 group-hover:bg-energy/5 transition-all duration-500">
            <Plus className="w-8 h-8" />
          </div>
          <span className="heading-power text-lg tracking-[0.3em]">REPLOY MOVEMENT NODE</span>
        </button>
        
        <div className="h-40" />
      </main>

      {showRestTimer && (
        <RestTimer duration={60} onClose={() => setShowRestTimer(false)} />
      )}
    </div>
  );
};

export default DayDetail;
