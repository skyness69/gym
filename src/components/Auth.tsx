import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { Mail, Lock, LogIn, KeyRound, UserPlus, Chrome, Apple, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type AuthMode = 'login' | 'register' | 'forgot';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setMessage('Reset link sent to your email.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    login: { 
      title: 'Log In', 
      button: 'Log In', 
      toggle: 'New to GYM ZONE? Sign up', 
      mode: 'register' as AuthMode,
      icon: <LogIn className="w-6 h-6" /> 
    },
    register: { 
      title: 'Sign Up', 
      button: 'Register', 
      toggle: 'Already have an account? Log In', 
      mode: 'login' as AuthMode,
      icon: <UserPlus className="w-6 h-6" /> 
    },
    forgot: { 
      title: 'Reset Password', 
      button: 'Send Link', 
      toggle: 'Back to Log In', 
      mode: 'login' as AuthMode,
      icon: <KeyRound className="w-6 h-6" /> 
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden font-['Inter']">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: 'url("/auth-bg.png")' }}
      />
      <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px]" />
      
      {/* Top Logo (Similar to JEFIT) */}
      <div className="absolute top-8 z-20 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-sm">
            <div className="w-4 h-1 bg-black rotate-90 translate-x-1" />
            <div className="w-3 h-1 bg-black rotate-90 -translate-x-1" />
          </div>
          <span className="heading-athletic text-2xl text-white tracking-[0.2em]">GYM ZONE</span>
        </div>
      </div>

      {/* Centered Auth Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-20 w-full max-w-[420px] mx-4"
      >
        <div className="bg-[#161618]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-2xl space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tight">{labels[mode].title}</h2>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email"
                    required
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-12 py-4 text-sm text-white outline-none focus:border-primary focus:bg-black/60 transition-all font-medium placeholder:text-white/5"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Security Key</label>
                    {mode === 'login' && (
                      <button 
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="password"
                      required
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-12 py-4 text-sm text-white outline-none focus:border-primary focus:bg-black/60 transition-all font-medium placeholder:text-white/5"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-white text-black font-black uppercase tracking-[0.2em] py-4 rounded-xl transition-all duration-300 shadow-lg shadow-primary/10 flex items-center justify-center gap-2 text-xs"
            >
              {loading ? 'PROCESSING...' : labels[mode].button}
            </button>

            <button 
              type="button"
              onClick={() => {
                setMode(labels[mode].mode);
                setError('');
                setMessage('');
              }}
              className="w-full text-center text-xs font-bold text-white/40 hover:text-white transition-colors"
            >
              {labels[mode].toggle}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 h-px bg-white/5" />
            <span className="relative z-10 block w-max mx-auto px-4 bg-[#161618] text-[9px] font-black text-white/10 uppercase tracking-[0.3em]">
              Or continue with
            </span>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3.5 bg-white text-black rounded-xl font-bold text-xs flex items-center justify-center gap-3 hover:bg-white/90 transition-all shadow-md"
            >
              <Chrome className="w-4 h-4" />
              Sign in with Google
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                disabled={true}
                className="py-3.5 bg-white text-black rounded-xl font-bold text-xs flex items-center justify-center gap-3 opacity-80 cursor-not-allowed"
              >
                <Apple className="w-4 h-4 fill-black" />
                Apple
              </button>
              <button 
                disabled={true}
                className="py-3.5 bg-[#1877F2] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-3 opacity-80 cursor-not-allowed"
              >
                <Facebook className="w-4 h-4 fill-white" />
                Facebook
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest text-center">{error}</p>
                </div>
              </motion.div>
            )}

            {message && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest text-center">{message}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 z-20 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
        Elite Workout Terminal v1.0
      </div>
    </div>
  );
};

export default Auth;


