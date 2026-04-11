import React, { useState } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import type { Exercise } from '../types';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../AuthContext';

interface WorkoutFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Partial<Exercise>[]>([
    { name: '', weight: 0, sets: 0, reps: 0 }
  ]);
  const [loading, setLoading] = useState(false);

  const addExercise = () => {
    setExercises([...exercises, { name: '', weight: 0, sets: 0, reps: 0 }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const workoutData = {
        userId: user.uid,
        date: serverTimestamp(),
        exercises: exercises.map((ex) => ({ ...ex, id: crypto.randomUUID() })),
        totalVolume: exercises.reduce((acc, ex) => acc + (Number(ex.weight || 0) * Number(ex.sets || 0) * Number(ex.reps || 0)), 0)
      };

      await addDoc(collection(db, `users/${user.uid}/workouts`), workoutData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving workout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Log New Workout</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full ring-offset-background transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto scrollbar-hide flex-1 space-y-6">
          {exercises.map((exercise, index) => (
            <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">Exercise {index + 1}</span>
                {exercises.length > 1 && (
                  <button type="button" onClick={() => removeExercise(index)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full">
                  <label className="text-xs text-gray-400 mb-1 ml-1 block">Exercise Name</label>
                  <input
                    required
                    placeholder="e.g. Bench Press"
                    className="glass-input"
                    value={exercise.name}
                    onChange={(e) => updateExercise(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 ml-1 block">Weight (kg)</label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    className="glass-input"
                    value={exercise.weight || ''}
                    onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 ml-1 block">Sets</label>
                    <input
                      type="number"
                      required
                      placeholder="0"
                      className="glass-input"
                      value={exercise.sets || ''}
                      onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 ml-1 block">Reps</label>
                    <input
                      type="number"
                      required
                      placeholder="0"
                      className="glass-input"
                      value={exercise.reps || ''}
                      onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addExercise}
            className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-gray-400 hover:bg-white/5 hover:border-white/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Another Exercise
          </button>
        </form>

        <div className="p-6 border-t border-white/10 flex gap-4">
          <button type="button" onClick={onClose} className="glass-button-secondary flex-1">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="glass-button-primary flex-1 py-3"
          >
            {loading ? 'Saving...' : (
              <>
                <Save className="w-5 h-5" />
                Complete Workout
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutForm;
