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
    <div className="min-h-screen relative flex flex-col items-center justify-center p-8 overflow-hidden bg-[#0c0c0e] font-['Inter']">
     
      <div className="w-full max-w-6xl relative z-10 flex flex-col md:flex-row gap-16 md:gap-32 items-center">
        
        {/* Cinematic Branding */}
        <div className="max-w-xl space-y-10 text-center md:text-left animate-fade-in">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 bg-primary flex items-center justify-center">
               <BarChart3 className="w-7 h-7 text-black" />
            </div>
            <span className="heading-athletic text-4xl text-white">PERFORMANCE_ENGINE</span>
          </div>

          <div className="space-y-4">
            <h1 className="heading-athletic text-[140px] md:text-[200px] leading-[0.8] text-white tracking-tighter shadow-2xl">
              GO<br/>HARD.
            </h1>
            <p className="text-[12px] font-black uppercase tracking-[0.6em] text-primary">ELITE DEPLOYMENT TERMINAL V4.0</p>
          </div>
        </div>

        {/* Minimal Auth Card */}
        <div className="w-full max-w-sm performance-card p-1 animate-slide-up">
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
    </div>
  );
};

export default Auth;
