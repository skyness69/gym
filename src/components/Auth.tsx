import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { ShieldAlert, Zap, Dumbbell, BarChart3 } from 'lucide-react';

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
    <div className="min-h-screen relative flex flex-col items-center justify-center p-12 overflow-hidden bg-[#0c0c0e] font-['Inter']">
     
      <div className="w-full max-w-4xl relative z-10 flex flex-col md:flex-row gap-20 items-center">
        
        {/* Cinematic Branding */}
        <div className="max-w-md space-y-12 text-center md:text-left animate-fade-in">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 bg-primary flex items-center justify-center">
               <BarChart3 className="w-7 h-7 text-black" />
            </div>
            <span className="heading-athletic text-4xl text-white">PERFORMANCE_ENGINE</span>
          </div>

          <div className="space-y-4">
            <h1 className="heading-athletic text-[140px] md:text-[180px] leading-[0.8] text-white tracking-tighter shadow-2xl">
              GO<br/>HARD.
            </h1>
            <p className="text-[12px] font-black uppercase tracking-[0.6em] text-primary">ELITE DEPLOYMENT TERMINAL V4.0</p>
          </div>

          <div className="flex items-center gap-10 opacity-20 justify-center md:justify-start">
             <Dumbbell className="w-10 h-10" />
             <div className="w-[1px] h-8 bg-white" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em]">Global Standards</span>
          </div>
        </div>

        {/* Minimal Auth Card */}
        <div className="w-full max-w-sm flex flex-col gap-1 w-full bg-white/5 p-1 animate-slide-up">
           <div className="bg-surface p-12 space-y-12">
              <div className="space-y-4">
                <h2 className="heading-athletic text-4xl text-white">VALIDATE_USER</h2>
                <div className="h-1 w-20 bg-primary" />
                <p className="text-[10px] font-medium text-white/30 leading-relaxed uppercase tracking-widest leading-loose">
                  Access denied. Initiate secure handshake to authorize biometric session.
                </p>
              </div>

              <button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="btn-blaze w-full py-6 text-[11px]"
              >
                {loading ? 'SYNCHRONIZING...' : 'AUTHORIZE WITH GOOGLE'}
              </button>

              {error && (
                <div className="p-6 bg-primary/5 border-l-4 border-primary flex items-start gap-4">
                  <ShieldAlert className="w-5 h-5 text-primary mt-1" />
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-relaxed">Cluster Error: {error}</p>
                </div>
              )}

              <div className="flex items-center gap-4 opacity-10">
                 <Zap className="w-4 h-4" />
                 <span className="text-[8px] font-black uppercase tracking-widest">Quantum Secured Tunnel</span>
              </div>
           </div>
        </div>

      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -z-10" />
      <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/5 -z-10" />

    </div>
  );
};

export default Auth;
