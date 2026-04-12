import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { Zap, Shield, Globe } from 'lucide-react';

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
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden bg-[#050505]">
      {/* Dynamic Background Orbital Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md relative z-10 space-y-12">
        {/* Branding Cluster */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-white/[0.02] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative group cursor-default">
            <Zap className="w-12 h-12 text-cyan-400 fill-cyan-400/20 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 rounded-[32px] border border-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-white">
              AuraLift <span className="text-white/20 font-light">OS</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">Nexus Training Terminal v2.0</p>
          </div>
        </div>

        {/* Auth Command Center */}
        <div className="glass-card p-12 space-y-10 border-white/5 bg-white/[0.01] animate-slide-up">
          <div className="text-center space-y-2">
            <h2 className="text-sm font-bold text-white/60 uppercase tracking-[0.2em]">Authentication Required</h2>
            <p className="text-[10px] text-white/20 uppercase tracking-widest">Initialize neural link to access your routines</p>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full glass-button-primary py-6 flex items-center justify-center gap-5 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Globe className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Authorize with Google</span>
          </button>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex items-center gap-3 animate-slide-up">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest leading-relaxed">System Error: {error}</p>
            </div>
          )}

          <div className="pt-4 flex flex-col items-center gap-4">
            <div className="flex items-center gap-6 opacity-20">
              <Shield className="w-4 h-4" />
              <div className="w-[1px] h-3 bg-white/40" />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Encrypted Handshake</span>
            </div>
          </div>
        </div>

        {/* Global Footer */}
        <div className="text-center opacity-10">
          <p className="text-[8px] font-black uppercase tracking-[0.5em]">Quantum Secured Deployment</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
