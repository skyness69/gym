import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, writeBatch, doc, deleteDoc, setDoc } from 'firebase/firestore';
import type { WorkoutDay } from '../types';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';
import { Plus, LogOut, Trash2, Dumbbell, LayoutGrid, Timer, BarChart3 } from 'lucide-react';
import DayCard from './DayCard';
import DayDetail from './DayDetail';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { showUndo } = useToast();
  const [days, setDays] = useState<WorkoutDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
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
        title: newDayTitle.toUpperCase(),
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

  const handleDeleteDay = async (e: React.MouseEvent, day: WorkoutDay) => {
    e.stopPropagation();
    if (!user) return;

    try {
      await deleteDoc(doc(db, `users/${user.uid}/workout_days/${day.id}`));
      showUndo(`ROUTINE DAY DELETED`, async () => {
        try {
          await setDoc(doc(db, `users/${user.uid}/workout_days/${day.id}`), day);
        } catch(err) {
          console.error("Undo error:", err);
        }
      });
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
          title: 'PUSH / STRENGTH',
          exercises: [
            { id: uuid(), name: 'FLAT BENCH PRESS', sets: createSets(4, 100, 5) },
            { id: uuid(), name: 'SHOULDER PRESS', sets: createSets(3, 60, 8) },
            { id: uuid(), name: 'TRICEP DIPS', sets: createSets(3, 20, 10) },
          ]
        },
        {
          title: 'PULL / HYPERTROPHY',
          exercises: [
            { id: uuid(), name: 'LAT PULLDOWN', sets: createSets(4, 70, 12) },
            { id: uuid(), name: 'SEATED ROWS', sets: createSets(3, 65, 12) },
            { id: uuid(), name: 'FACE PULLS', sets: createSets(3, 20, 15) },
          ]
        },
        {
          title: 'LEGS / VOLUME',
          exercises: [
            { id: uuid(), name: 'BACK SQUAT', sets: createSets(5, 120, 5) },
            { id: uuid(), name: 'LEG PRESS', sets: createSets(3, 250, 12) },
            { id: uuid(), name: 'CALF RAISES', sets: createSets(4, 80, 15) },
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
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-6xl animate-fade-in flex flex-col gap-6 md:gap-8">
        
        {/* Navigation / Brand Header */}
        <header className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-black" />
            </div>
            <h1 className="heading-athletic text-4xl tracking-widest text-white leading-none mt-1.5">RAW</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <span className="status-dot active w-1.5 h-1.5" />
              <span className="text-[8px] font-black uppercase tracking-widest text-primary">ACTIVE LOG</span>
            </div>
            <button 
              onClick={() => auth.signOut()}
              className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-primary transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dashboard Title & Actions */}
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <h2 className="heading-athletic text-5xl sm:text-6xl md:text-7xl text-white leading-[0.9]">CURRENT_SPLIT</h2>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2 text-[8px] font-black text-white/10 tracking-[0.2em] uppercase">
                <Timer className="w-3 h-3" />
                DUR: 45M
              </div>
              <div className="flex items-center gap-2 text-[8px] font-black text-white/10 tracking-[0.2em] uppercase">
                <LayoutGrid className="w-3 h-3 text-primary/40" />
                DAYS: {days.length}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <button 
              onClick={() => setIsAdding(true)}
              className="btn-blaze w-full sm:w-auto whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD ROUTINE DAY
            </button>
          </div>
        </section>

        {isAdding && (
          <form onSubmit={handleAddDay} className="performance-card p-6 animate-slide-up">
            <div className="flex flex-col md:flex-row items-end gap-6">
              <div className="flex-1 space-y-2 w-full">
                <label className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Day Name</label>
                <input 
                  placeholder="EXAMPLE: PULL DAY..."
                  className="input-performance text-2xl heading-athletic"
                  value={newDayTitle}
                  onChange={e => setNewDayTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button type="button" onClick={() => setIsAdding(false)} className="btn-outline flex-1 md:w-32">CANCEL</button>
                <button type="submit" disabled={actionLoading} className="btn-blaze flex-1 md:w-32">
                  {actionLoading ? 'SAVING...' : 'CREATE'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Training Grid */}
        <section className="mt-4">
          {days.length === 0 && !loading ? (
            <div className="py-20 flex flex-col items-center justify-center performance-card bg-transparent border-dashed">
              <div className="w-16 h-16 bg-white/5 flex items-center justify-center mb-6">
                <Dumbbell className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="heading-athletic text-2xl text-white/40 mb-6">NO WORKOUTS FOUND</h3>
              <button onClick={handleAutoFillPPL} className="btn-blaze px-10">
                GENERATE PPL SPLIT
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-surface h-48 animate-pulse performance-card" />
                ))
              ) : (
                days.map((day) => (
                  <div key={day.id} className="relative group animate-slide-up bg-surface p-6 overflow-hidden performance-card performance-card-hover" style={{ animationDelay: `${days.indexOf(day) * 50}ms` }}>
                    <DayCard day={day} onClick={() => setSelectedDay(day)} />
                    <button 
                      onClick={(e) => handleDeleteDay(e, day)}
                      className="absolute top-3 right-3 p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all z-20 rounded-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>

      {selectedDay && (
        <DayDetail day={selectedDay} onClose={() => setSelectedDay(null)} />
      )}
    </div>
  );
};

export default Dashboard;
