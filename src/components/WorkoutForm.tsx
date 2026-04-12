import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { X, Plus, Zap, Info, Trash2 } from 'lucide-react';

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
          name: ex.name,
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 animate-fade-in overflow-hidden">
      <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="glass-card w-full max-w-2xl bg-[#0a0a0a]/90 border-white/5 flex flex-col max-h-[90vh] shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10 animate-scale">
        <header className="px-8 py-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-400 border border-cyan-500/10">
              <Zap className="w-6 h-6 fill-cyan-400/10" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Rapid Sync</h2>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Manual Data Ingestion</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 flex items-start gap-4">
            <Info className="w-4 h-4 text-cyan-500 mt-1 shrink-0" />
            <p className="text-[10px] font-bold text-cyan-500/60 uppercase leading-relaxed tracking-widest">
              Direct telemetry input: Sets will be automatically marked as complete upon submission.
            </p>
          </div>

          <div className="space-y-6">
            {exercises.map((ex, index) => (
              <div key={index} className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 space-y-6 relative group overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-white/30 mono-data">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Target Movement</span>
                  </div>
                  {exercises.length > 1 && (
                    <button type="button" onClick={() => removeExercise(index)} className="text-white/10 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-5">
                  <input
                    placeholder="MOVEMENT NAME (E.G. DEADLIFT)"
                    className="glass-input text-lg font-bold uppercase tracking-tight h-14"
                    value={ex.name}
                    onChange={(e) => updateExercise(index, 'name', e.target.value)}
                    required
                  />
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Mass (KG)</label>
                      <input
                        type="number"
                        placeholder="00"
                        className="glass-input h-12 text-center text-cyan-400"
                        value={ex.weight || ''}
                        onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Freq (Reps)</label>
                      <input
                        type="number"
                        placeholder="00"
                        className="glass-input h-12 text-center"
                        value={ex.reps || ''}
                        onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Units (Sets)</label>
                      <input
                        type="number"
                        placeholder="03"
                        className="glass-input h-12 text-center"
                        value={ex.sets || ''}
                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Scanner effect on hover */}
                <div className="absolute left-0 bottom-0 w-full h-[1px] bg-cyan-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addExercise}
            className="w-full py-6 rounded-2xl border border-dashed border-white/5 flex items-center justify-center gap-3 text-white/20 hover:text-white/40 hover:bg-white/[0.01] hover:border-white/10 transition-all uppercase tracking-widest text-[10px] font-black"
          >
            <Plus className="w-4 h-4" />
            Append Telemetry Node
          </button>
        </form>

        <footer className="px-8 py-8 border-t border-white/5 bg-black/20 flex gap-4">
          <button onClick={onClose} className="glass-button-secondary flex-1 font-black text-[10px] tracking-widest">ABORT</button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting} 
            className="glass-button-primary flex-1 font-black text-[10px] tracking-widest"
          >
            {isSubmitting ? 'TRANSMITTING...' : 'COMMIT TO CORE'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default WorkoutForm;
