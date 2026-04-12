import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, writeBatch, doc, deleteDoc } from 'firebase/firestore';
import type { WorkoutDay } from '../types';
import { useAuth } from '../AuthContext';
import { Plus, LogOut, Sparkles, ClipboardCheck, Trash2, LayoutGrid, Zap } from 'lucide-react';
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
    if (!user || !window.confirm("Confirm routine termination?")) return;

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
          title: 'Hypertrophy Push',
          exercises: [
            { id: uuid(), name: 'Incline Bench Press', sets: createSets(3, 60, 10) },
            { id: uuid(), name: 'Overhead Press', sets: createSets(3, 40, 10) },
            { id: uuid(), name: 'Lateral Raises', sets: createSets(3, 8, 15) },
          ]
        },
        {
          title: 'Hypertrophy Pull',
          exercises: [
            { id: uuid(), name: 'Weighted Pull-ups', sets: createSets(3, 10, 8) },
            { id: uuid(), name: 'Barbell Rows', sets: createSets(3, 50, 10) },
            { id: uuid(), name: 'Face Pulls', sets: createSets(3, 15, 15) },
          ]
        },
        {
          title: 'Hypertrophy Legs',
          exercises: [
            { id: uuid(), name: 'Back Squats', sets: createSets(3, 70, 8) },
            { id: uuid(), name: 'Romanian Deadlifts', sets: createSets(3, 80, 10) },
            { id: uuid(), name: 'Leg Extensions', sets: createSets(3, 40, 12) },
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
    <div className="min-h-screen p-4 md:p-10 animate-fade-in relative z-10">
      <header className="max-w-5xl mx-auto mb-16 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white/90">AuraLift <span className="text-white/20 font-light">OS</span></h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">System Nominal</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => auth.signOut()}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      <main className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              <LayoutGrid className="w-5 h-5 text-purple-400/60" />
              Core Architecture
            </h2>
            <p className="text-sm text-white/30">Initialize training sequence from active routines.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsLogging(true)}
              className="glass-button-secondary px-6 text-sm"
            >
              <ClipboardCheck className="w-4 h-4 text-cyan-400" />
              Quick Log
            </button>
            <button 
              onClick={() => setIsAdding(true)}
              className="glass-button-primary px-6 text-sm"
            >
              <Plus className="w-4 h-4" />
              New Routine
            </button>
          </div>
        </div>

        {isAdding && (
          <form onSubmit={handleAddDay} className="glass-card p-10 mb-12 animate-slide-up bg-white/[0.01] border-cyan-500/10">
            <div className="max-w-md space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/60 block ml-1">Routine Identity</label>
              <input 
                placeholder="Enter routine title (e.g. Alpha Protocol)"
                className="glass-input text-lg"
                value={newDayTitle}
                onChange={e => setNewDayTitle(e.target.value)}
                autoFocus
              />
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setIsAdding(false)} className="glass-button-secondary flex-1">Abort</button>
                <button type="submit" disabled={actionLoading} className="glass-button-primary flex-1">
                  {actionLoading ? 'Deploying...' : 'Initialize'}
                </button>
              </div>
            </div>
          </form>
        )}

        {days.length === 0 && !loading ? (
          <div className="py-24 flex flex-col items-center justify-center glass-card border-dashed bg-white/[0.01] border-white/5">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-white/10" />
            </div>
            <h3 className="text-xl font-bold text-white/50 tracking-tight">System Purged</h3>
            <p className="text-sm text-white/20 mt-2 max-w-xs text-center">No routines detected in local cluster. Initialize PPL template for rapid deployment.</p>
            <button onClick={handleAutoFillPPL} className="mt-8 glass-button-primary px-10">
              Apply Hypertrophy PPL
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-card h-40 animate-pulse border-white/5" />
              ))
            ) : (
              days.map((day) => (
                <div key={day.id} className="relative group animate-slide-up" style={{ animationDelay: `${days.indexOf(day) * 50}ms` }}>
                  <DayCard day={day} onClick={() => setSelectedDay(day)} />
                  <button 
                    onClick={(e) => handleDeleteDay(e, day.id)}
                    className="absolute top-4 right-14 p-2 rounded-xl text-white/0 group-hover:text-white/20 hover:text-red-500 transition-all z-20"
                    title="Terminate Routine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
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
