import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { Workout } from '../types';
import { useAuth } from '../AuthContext';
import { Plus, LogOut, History, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WorkoutForm from './WorkoutForm';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/workouts`),
      orderBy('date', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workoutData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Workout[];
      setWorkouts(workoutData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const totalSessions = workouts.length;
  const totalVolume = workouts.reduce((acc, w) => acc + (w.totalVolume || 0), 0);

  return (
    <div className="min-h-screen bg-background text-white p-4 md:p-8 bg-glow-gradient">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl shadow-lg neon-glow">G</div>
          <h1 className="text-2xl font-bold tracking-tight hidden sm:block">Gym Log Track</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium">{user?.displayName || 'Athlete'}</span>
            <span className="text-xs text-gray-400">{user?.email}</span>
          </div>
          <button 
            onClick={() => auth.signOut()}
            className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-10">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 flex items-start justify-between group cursor-default">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Sessions</p>
              <h3 className="text-3xl font-bold">{totalSessions}</h3>
            </div>
            <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors">
              <History className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          
          <div className="glass-card p-6 flex items-start justify-between group cursor-default">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Volume</p>
              <h3 className="text-3xl font-bold">{(totalVolume / 1000).toFixed(1)} <span className="text-sm font-normal text-gray-500">tons</span></h3>
            </div>
            <div className="p-3 bg-green-600/10 rounded-xl border border-green-500/20 group-hover:bg-green-600/20 transition-colors">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>

          <div className="glass-card p-6 flex items-center justify-center">
            <button 
              onClick={() => setShowForm(true)}
              className="w-full glass-button-primary py-4 text-lg animate-pulse hover:animate-none"
            >
              <Plus className="w-6 h-6" />
              Log New Workout
            </button>
          </div>
        </section>

        {/* Recent History */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Recent Activities
            </h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full h-40 flex items-center justify-center text-gray-500">Loading workouts...</div>
            ) : workouts.length === 0 ? (
              <div className="col-span-full h-40 flex flex-col items-center justify-center glass-card border-dashed">
                <p className="text-gray-400">No workouts logged yet.</p>
                <button onClick={() => setShowForm(true)} className="text-blue-400 hover:underline mt-2">Start your first session</button>
              </div>
            ) : (
            <AnimatePresence>
              {workouts.map((workout, index) => (
                <motion.div 
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-6 hover:border-white/20 transition-all cursor-default"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/30">
                      {workout.date ? workout.date.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now'}
                    </span>
                    <span className="text-sm text-gray-400">{workout.exercises.length} Exercises</span>
                  </div>
                  
                  <div className="space-y-3">
                    {workout.exercises.map((ex) => (
                      <div key={ex.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <span className="font-medium">{ex.name}</span>
                        <div className="flex gap-4 text-sm text-gray-400">
                          <span>{ex.weight}kg</span>
                          <span>{ex.sets}x{ex.reps}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
                    <span>Total Volume: {workout.totalVolume} kg</span>
                    <span>{workout.date ? workout.date.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Processing...'}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            )}
          </div>
        </section>
      </main>

      {showForm && (
        <WorkoutForm 
          onClose={() => setShowForm(false)} 
          onSuccess={() => {
            // Firestore onSnapshot handles live update
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
