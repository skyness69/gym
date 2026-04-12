import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, writeBatch, doc, deleteDoc } from 'firebase/firestore';
import type { WorkoutDay } from '../types';
import { useAuth } from '../AuthContext';
import { Plus, LogOut, Layers, Sparkles, Dumbbell, ArrowRight, ClipboardCheck, Trash2 } from 'lucide-react';
import DayCard from './DayCard';
import DayDetail from './DayDetail';
import WorkoutForm from './WorkoutForm';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [days, setDays] = useState<WorkoutDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [newDayTitle, setNewDayTitle] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/workout_days`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dayData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WorkoutDay[];
      setDays(dayData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const handleAddDay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newDayTitle.trim()) return;

    setActionLoading(true);
    try {
      await addDoc(collection(db, `users/${user.uid}/workout_days`), {
        userId: user.uid,
        title: newDayTitle,
        exercises: [],
        createdAt: serverTimestamp()
      });
      setNewDayTitle('');
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding day:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDay = async (e: React.MouseEvent, dayId: string) => {
    e.stopPropagation();
    if (!user || !window.confirm("Are you sure you want to delete this routine?")) return;

    try {
      await deleteDoc(doc(db, `users/${user.uid}/workout_days/${dayId}`));
    } catch (error) {
      console.error("Error deleting day:", error);
    }
  };

  const handleAutoFillPPL = async () => {
    if (!user) return;
    setActionLoading(true);
    try {
      const batch = writeBatch(db);
      const uuid = () => (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11);
      
      const createSets = (count: number, weight: number, reps: number) => 
        Array.from({ length: count }).map(() => ({
          id: uuid(),
          weight,
          reps,
          isCompleted: false
        }));

      const ppl = [
        {
          title: 'Push Day',
          exercises: [
            { id: uuid(), name: 'Bench Press', sets: createSets(3, 60, 10) },
            { id: uuid(), name: 'Overhead Press', sets: createSets(3, 40, 10) },
            { id: uuid(), name: 'Lateral Raises', sets: createSets(3, 8, 12) },
          ]
        },
        {
          title: 'Pull Day',
          exercises: [
            { id: uuid(), name: 'Pull-ups', sets: createSets(3, 0, 10) },
            { id: uuid(), name: 'Barbell Rows', sets: createSets(3, 50, 10) },
            { id: uuid(), name: 'Bicep Curls', sets: createSets(3, 12, 12) },
          ]
        },
        {
          title: 'Leg Day',
          exercises: [
            { id: uuid(), name: 'Squats', sets: createSets(3, 70, 8) },
            { id: uuid(), name: 'Leg Press', sets: createSets(3, 120, 10) },
            { id: uuid(), name: 'Calf Raises', sets: createSets(3, 40, 15) },
          ]
        }
      ];

      ppl.forEach(day => {
        const docRef = doc(collection(db, `users/${user.uid}/workout_days`));
        batch.set(docRef, {
          ...day,
          userId: user.uid,
          createdAt: serverTimestamp()
        });
      });

      await batch.commit();
    } catch (error) {
      console.error("Auto-fill error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in relative z-10">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <header className="max-w-5xl mx-auto mb-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Gym Log Track</h1>
            <div className="premium-badge mt-1">Status: Active</div>
          </div>
        </div>
        
        <button 
          onClick={() => auth.signOut()}
          className="glass-button-secondary py-2.5 px-3"
        >
          <LogOut className="w-5 h-5 opacity-70" />
        </button>
      </header>

      <main className="max-w-5xl mx-auto space-y-12">
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-3">
                <Layers className="w-5 h-5 text-blue-400" />
                Training Architecture
              </h2>
              <p className="text-sm text-white/40 mt-1">Select a program to begin your session</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {days.length === 0 && (
                <button 
                  onClick={handleAutoFillPPL}
                  disabled={actionLoading}
                  className="glass-button-secondary py-2.5 px-5 bg-white/5 border-dashed border-white/20"
                >
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Starter PPL Template
                </button>
              )}
              <button 
                onClick={() => setIsLogging(true)}
                className="glass-button-secondary py-2.5 px-6 border-white/10"
              >
                <ClipboardCheck className="w-4 h-4 text-green-400" />
                Log Session
              </button>
              <button 
                onClick={() => setIsAdding(true)}
                className="glass-button-primary py-2.5 px-6"
              >
                <Plus className="w-4 h-4 ml-[-4px]" />
                New Routine
              </button>
            </div>
          </div>

          {isAdding && (
            <form onSubmit={handleAddDay} className="glass-card p-8 animate-slide-up space-y-5 border-blue-500/20 bg-blue-500/5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-blue-400 ml-1">Routine Identity</label>
                <input 
                  placeholder="Enter day title (e.g. Upper Body Elite)"
                  className="glass-input"
                  value={newDayTitle}
                  onChange={e => setNewDayTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsAdding(false)} className="glass-button-secondary flex-1">Minimize</button>
                <button type="submit" disabled={actionLoading} className="glass-button-primary flex-1">
                  {actionLoading ? 'Allocating...' : 'Initialize Routine'}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card h-32 animate-pulse" />
              ))
            ) : days.length === 0 ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center glass-card border-dashed bg-white/[0.01]">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                  <ArrowRight className="w-8 h-8 text-white/20" />
                </div>
                <h3 className="text-lg font-medium text-white/60">No training modules found</h3>
                <p className="text-sm text-white/30 mt-2 max-w-xs text-center px-4">Initialize your workout structure by creating a routine or starting with our pro template.</p>
                <button onClick={handleAutoFillPPL} className="mt-8 text-blue-400 font-medium hover:text-blue-300 transition-colors flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Apply Starter Template
                </button>
              </div>
            ) : (
              days.map((day) => (
                <div key={day.id} className="relative group">
                  <DayCard day={day} onClick={() => setSelectedDay(day)} />
                  <button 
                    onClick={(e) => handleDeleteDay(e, day.id)}
                    className="absolute top-4 right-14 p-2 rounded-xl bg-red-500/5 text-red-500/0 group-hover:text-red-500/40 hover:text-red-400 transition-all z-20"
                    title="Delete Routine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {selectedDay && (
        <DayDetail day={selectedDay} onClose={() => setSelectedDay(null)} />
      )}

      {isLogging && (
        <WorkoutForm 
          onClose={() => setIsLogging(false)} 
          onSuccess={() => {
            setIsLogging(false);
          }} 
        />
      )}
    </div>
  );
};

export default Dashboard;
