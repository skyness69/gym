import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, writeBatch, doc, deleteDoc } from 'firebase/firestore';
import type { WorkoutDay } from '../types';
import { useAuth } from '../AuthContext';
import { Plus, LogOut, Trash2, Dumbbell, Zap, Flame } from 'lucide-react';
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
    if (!user || !window.confirm("DELETE THIS ROUTINE PERMANENTLY?")) return;

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
          title: 'PUSH: UPPER FOCUS',
          exercises: [
            { id: uuid(), name: 'BARBELL BENCH PRESS', sets: createSets(4, 80, 8) },
            { id: uuid(), name: 'MILITARY PRESS', sets: createSets(3, 50, 10) },
            { id: uuid(), name: 'DUMBBELL LATERAL RAISES', sets: createSets(4, 12, 12) },
          ]
        },
        {
          title: 'PULL: BACK & BI',
          exercises: [
            { id: uuid(), name: 'PULL-UPS (WEIGHTED)', sets: createSets(3, 15, 10) },
            { id: uuid(), name: 'BARBELL DEADLIFTS', sets: createSets(3, 140, 5) },
            { id: uuid(), name: 'BARBELL CURLS', sets: createSets(3, 30, 12) },
          ]
        },
        {
          title: 'LEGS: MASS BUILDER',
          exercises: [
            { id: uuid(), name: 'BARBELL SQUATS', sets: createSets(4, 100, 8) },
            { id: uuid(), name: 'LEG PRESS 45°', sets: createSets(3, 200, 12) },
            { id: uuid(), name: 'STANDING CALF RAISES', sets: createSets(4, 60, 15) },
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
    <div className="min-h-screen p-4 md:p-10 animate-fade-in relative z-10 font-['Barlow_Condensed']">
      {/* Background Silhouette Pattern */}
      <div className="fixed inset-0 -z-10 opacity-[0.02] pointer-events-none flex items-center justify-center">
        <Dumbbell className="w-[80vw] h-[80vw] rotate-12" />
      </div>

      <header className="max-w-6xl mx-auto mb-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-energy flex items-center justify-center text-black">
            <Flame className="w-8 h-8 fill-black" />
          </div>
          <div>
            <h1 className="heading-power text-3xl tracking-tighter text-white">IRON COMMAND <span className="text-energy/50">X</span></h1>
            <div className="flex items-center gap-2 mt-[-2px]">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30">ELITE PERFORMANCE TRACKER</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => auth.signOut()}
          className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/30 hover:text-red-500"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-1">
            <h2 className="heading-power text-4xl flex items-center gap-4 text-white">
              <Dumbbell className="w-8 h-8 text-energy" />
              ROUTINE CLUSTER
            </h2>
            <p className="text-sm font-bold text-white/20 uppercase tracking-widest">Select target operational module.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setIsAdding(true)}
              className="glass-button-primary py-3 px-8 text-sm"
            >
              <Plus className="w-5 h-5 mr-[-4px]" />
              NEW TRAINING
            </button>
          </div>
        </div>

        {isAdding && (
          <form onSubmit={handleAddDay} className="glass-card mb-12 animate-slide-up bg-white/[0.01] border-energy/10 p-1">
            <div className="p-10 space-y-6">
              <div className="space-y-3">
                <label className="heading-power text-xs tracking-widest text-energy block">INITIALIZE MODULE IDENTITY</label>
                <input 
                  placeholder="E.G. TITAN UPPER BODY"
                  className="input-rugged text-2xl h-16 font-black"
                  value={newDayTitle}
                  onChange={e => setNewDayTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex gap-4 max-w-sm">
                <button type="button" onClick={() => setIsAdding(false)} className="glass-button-secondary flex-1">CANCEL</button>
                <button type="submit" disabled={actionLoading} className="glass-button-primary flex-1">
                  {actionLoading ? 'DEPLOYING...' : 'INITIALIZE'}
                </button>
              </div>
            </div>
          </form>
        )}

        {days.length === 0 && !loading ? (
          <div className="py-32 flex flex-col items-center justify-center glass-card border-dashed bg-white/[0.01] border-white/5">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/5">
              <Zap className="w-10 h-10 text-white/10" />
            </div>
            <h3 className="heading-power text-2xl text-white/40 tracking-widest">TERMINAL EMPTY</h3>
            <p className="text-sm font-bold text-white/20 mt-4 max-w-xs text-center uppercase tracking-widest">Initialize performance cluster or deploy PPL template.</p>
            <button onClick={handleAutoFillPPL} className="mt-10 glass-button-primary px-12">
              DEPLOY ELITE PPL
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-card h-48 animate-pulse border-white/5" />
              ))
            ) : (
              days.map((day) => (
                <div key={day.id} className="relative group animate-slide-up" style={{ animationDelay: `${days.indexOf(day) * 50}ms` }}>
                  <DayCard day={day} onClick={() => setSelectedDay(day)} />
                  <button 
                    onClick={(e) => handleDeleteDay(e, day.id)}
                    className="absolute top-6 right-6 p-2 rounded-lg text-white/0 group-hover:text-white/20 hover:text-red-500 transition-all z-20"
                    title="TERMINATE"
                  >
                    <Trash2 className="w-5 h-5" />
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
    </div>
  );
};

export default Dashboard;
