import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { X, Plus, Trash2, ShieldAlert, Activity } from 'lucide-react';

interface WorkoutFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface FormExercise {
  name: string;
  weight: number;
  sets: number;
  reps: number;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<FormExercise[]>([
    { name: '', weight: 0, sets: 3, reps: 10 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const uuid = () => (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11);
      
      const workoutData = {
        userId: user.uid,
        date: serverTimestamp(),
        exercises: exercises.map((ex) => ({
          id: uuid(),
          name: ex.name.toUpperCase(),
          sets: Array.from({ length: ex.sets || 0 }).map(() => ({
            id: uuid(),
            weight: Number(ex.weight || 0),
            reps: Number(ex.reps || 0),
            isCompleted: true
          }))
        })),
        totalVolume: exercises.reduce((acc, ex) => acc + (Number(ex.weight || 0) * Number(ex.sets || 0) * Number(ex.reps || 0)), 0)
      };

      await addDoc(collection(db, `users/${user.uid}/workouts`), workoutData);
      onSuccess();
    } catch (error) {
      console.error("Error logging workout:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', weight: 0, sets: 3, reps: 10 }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof FormExercise, value: string | number) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value } as FormExercise;
    setExercises(newExercises);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 animate-fade-in overflow-hidden font-['Barlow_Condensed']">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="glass-card w-full max-w-2xl bg-[#0a0a0a] border-2 border-white/5 flex flex-col max-h-[90vh] shadow-[0_0_100px_rgba(0,0,0,0.9)] relative z-10 animate-slide-up overflow-hidden">
        <header className="px-10 py-10 border-b-2 border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-energy flex items-center justify-center text-black">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <h2 className="heading-power text-3xl tracking-tighter text-white">RAPID DATA INGESTION</h2>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Direct Performance Telemetry</p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/20 hover:text-red-500 transition-all">
            <X className="w-6 h-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
          <div className="p-5 rounded-lg bg-energy/5 border border-energy/20 flex items-start gap-5">
            <ShieldAlert className="w-5 h-5 text-energy mt-1 shrink-0" />
            <p className="text-[11px] font-black text-energy/80 uppercase leading-relaxed tracking-widest">
              Critical: Operational nodes will be marked as 100% complete upon cluster injection.
            </p>
          </div>

          <div className="space-y-10">
            {exercises.map((ex, index) => (
              <div key={index} className="p-8 rounded-xl bg-white/[0.02] border border-white/5 space-y-8 relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="mono-data text-xs font-black text-energy">ENTRY_{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-[10px] font-black text-white/10 uppercase tracking-widest">Movement node</span>
                  </div>
                  {exercises.length > 1 && (
                    <button type="button" onClick={() => removeExercise(index)} className="text-white/10 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">MOVEMENT IDENTITY</label>
                    <input
                      placeholder="E.G. BARBELL SQUAT"
                      className="input-rugged text-xl h-14 font-black"
                      value={ex.name}
                      onChange={(e) => updateExercise(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">MASS (KG)</label>
                      <input
                        type="number"
                        className="input-rugged h-14 text-center text-energy text-2xl"
                        value={ex.weight || ''}
                        onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">REPS</label>
                      <input
                        type="number"
                        className="input-rugged h-14 text-center text-2xl"
                        value={ex.reps || ''}
                        onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">UNITS</label>
                      <input
                        type="number"
                        className="input-rugged h-14 text-center text-2xl"
                        value={ex.sets || ''}
                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addExercise}
            className="w-full py-8 rounded-xl border-2 border-dashed border-white/5 flex items-center justify-center gap-4 text-white/10 hover:text-energy hover:bg-energy/5 hover:border-energy/20 transition-all heading-power text-sm tracking-widest"
          >
            <Plus className="w-6 h-6" />
            APPEND TELEMETRY NODE
          </button>
        </form>

        <footer className="px-10 py-10 border-t-2 border-white/5 bg-black/40 flex gap-6">
          <button onClick={onClose} className="glass-button-secondary flex-1 text-sm">ABORT MISSION</button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting} 
            className="glass-button-primary flex-1 text-sm"
          >
            {isSubmitting ? 'TRANSMITTING...' : 'COMMIT TO ARCHIVE'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default WorkoutForm;
