import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { ShieldAlert, Zap, Globe, Dumbbell, Flame } from 'lucide-react';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden bg-[#050505] font-['Barlow_Condensed']">
      {/* Heavy Industrial Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] select-none flex items-center justify-center">
        <Dumbbell className="w-[120vw] h-[120vw] rotate-[30deg]" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-12">
        {/* Branding Cluster */}
        <div className="text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-energy shadow-[0_0_60px_rgba(34,197,94,0.3)] relative group cursor-default clip-path-polygon-[25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%]">
            <Flame className="w-14 h-14 text-black fill-black" />
          </div>
          
          <div className="space-y-2">
            <h1 className="heading-power text-6xl tracking-tighter text-white">
              IRON COMMAND <span className="text-energy">X</span>
            </h1>
            <p className="text-[11px] font-black uppercase tracking-[0.6em] text-white/20">Elite Performance Protocol v3.0</p>
          </div>
        </div>

        {/* Auth Command Center */}
        <div className="glass-card p-12 space-y-12 border-2 border-white/5 bg-white/[0.01] animate-slide-up relative overflow-hidden">
          {/* Top warning line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-energy/50 to-transparent" />

          <div className="text-center space-y-3">
            <h2 className="heading-power text-lg text-white/80 tracking-widest uppercase">Personnel Validation</h2>
            <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.3em]">Initialize mission-critical metrics logging</p>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full glass-button-primary py-7 flex items-center justify-center gap-6 group relative overflow-hidden text-sm"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Globe className="w-6 h-6 text-black" />
            <span className="heading-power tracking-[0.3em]">AUTHORIZE WITH GOOGLE</span>
          </button>

          {error && (
            <div className="p-5 rounded-lg bg-red-500/5 border border-red-500/20 flex items-center gap-4 animate-slide-up">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-relaxed">Auth Breach: {error}</p>
            </div>
          )}

          <div className="pt-6 flex flex-col items-center gap-6">
            <div className="flex items-center gap-6 opacity-20">
              <Zap className="w-4 h-4 text-energy" />
              <div className="w-[1px] h-4 bg-white/40" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Encrypted Channel</span>
            </div>
          </div>
        </div>

        {/* Global Footer */}
        <div className="text-center opacity-5">
          <p className="text-[9px] font-black uppercase tracking-[0.8em]">Built for the 1%</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
