import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, writeBatch, doc, deleteDoc } from 'firebase/firestore';
import type { WorkoutDay } from '../types';
import { useAuth } from '../AuthContext';
import { Plus, LogOut, Trash2, Dumbbell, LayoutGrid, Timer, BarChart3 } from 'lucide-react';
import DayCard from './DayCard';
import DayDetail from './DayDetail';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
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

  const handleDeleteDay = async (e: React.MouseEvent, dayId: string) => {
    e.stopPropagation();
    if (!user || !window.confirm("CONFIRM DELETION?")) return;

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
    <div className="min-h-screen p-6 md:p-12 lg:p-20 flex flex-col items-center">
      <div className="w-full max-w-7xl animate-fade-in flex flex-col gap-10">
        
        {/* Navigation / Brand Header */}
        <header className="flex items-center justify-between border-b border-white/5 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-black" />
            </div>
            <h1 className="heading-athletic text-4xl tracking-tight text-white">PERFORMANCE <span className="text-white/40">CORE</span></h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3">
              <span className="status-dot active" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">LIVE ENGINE</span>
            </div>
            <button 
              onClick={() => auth.signOut()}
              className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-primary transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dashboard Title & Actions */}
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="space-y-6">
            <h2 className="heading-athletic text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white leading-[0.8]">ACTIVE<br/>RETIREMENT</h2>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-white/10 tracking-[0.2em] uppercase">
                <Timer className="w-4 h-4" />
                DUR: 45M
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-white/10 tracking-[0.2em] uppercase">
                <LayoutGrid className="w-4 h-4 text-primary/40" />
                MODS: {days.length}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <button 
              onClick={() => setIsAdding(true)}
              className="btn-blaze w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              CREATE MODULE
            </button>
          </div>
        </section>

        {isAdding && (
          <form onSubmit={handleAddDay} className="performance-card p-12 animate-slide-up">
            <div className="flex flex-col md:flex-row items-end gap-10">
              <div className="flex-1 space-y-4 w-full">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Module Title</label>
                <input 
                  placeholder="E.G. MAXIMUM PUSH"
                  className="input-performance text-4xl heading-athletic"
                  value={newDayTitle}
                  onChange={e => setNewDayTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button type="button" onClick={() => setIsAdding(false)} className="btn-outline flex-1 md:w-40">CANCEL</button>
                <button type="submit" disabled={actionLoading} className="btn-blaze flex-1 md:w-40">
                  {actionLoading ? 'PENDING...' : 'INITIATE'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Training Grid */}
        <section className="mt-8">
          {days.length === 0 && !loading ? (
            <div className="py-40 flex flex-col items-center justify-center performance-card bg-transparent border-dashed">
              <div className="w-24 h-24 bg-white/5 flex items-center justify-center mb-10">
                <Dumbbell className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="heading-athletic text-4xl text-white/40 mb-10">NO MODULES DETECTED</h3>
              <button onClick={handleAutoFillPPL} className="btn-blaze px-16">
                AUTO-DECODE ELITE PPL
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-surface h-80 animate-pulse performance-card" />
                ))
              ) : (
                days.map((day) => (
                  <div key={day.id} className="relative group animate-slide-up bg-surface p-12 overflow-hidden performance-card performance-card-hover" style={{ animationDelay: `${days.indexOf(day) * 50}ms` }}>
                    <DayCard day={day} onClick={() => setSelectedDay(day)} />
                    <button 
                      onClick={(e) => handleDeleteDay(e, day.id)}
                      className="absolute top-6 right-6 p-3 text-white/0 group-hover:text-white/20 hover:text-primary transition-all z-20"
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
