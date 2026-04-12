import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { Zap, BarChart3 } from 'lucide-react';

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
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden bg-[#0c0c0e] font-['Inter']">
     
      <div className="w-full max-w-5xl relative z-10 flex flex-col md:flex-row gap-12 md:gap-24 items-center">
        
        {/* Cinematic Branding */}
        <div className="max-w-md space-y-6 text-center md:text-left animate-fade-in">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 bg-primary flex items-center justify-center">
               <BarChart3 className="w-6 h-6 text-black" />
            </div>
            <span className="heading-athletic text-2xl text-white">PERFORMANCE_ENGINE</span>
          </div>

          <div className="space-y-2">
            <h1 className="heading-athletic text-[80px] md:text-[120px] leading-[0.85] text-white tracking-tighter">
              GO<br/>HARD.
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">ELITE DEPLOYMENT TERMINAL</p>
          </div>
        </div>

        {/* Minimal Auth Card */}
        <div className="w-full max-w-xs performance-card p-0.5 animate-slide-up">
           <div className="bg-surface p-8 space-y-8">
              <div className="space-y-3">
                <h2 className="heading-athletic text-3xl text-white">VALIDATE_USER</h2>
                <div className="h-0.5 w-12 bg-primary" />
                <p className="text-[9px] font-medium text-white/20 leading-relaxed uppercase tracking-widest">
                  Secure biometric handshake required.
                </p>
              </div>

              <button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="btn-blaze w-full py-4 text-[10px]"
              >
                {loading ? 'SYNCING...' : 'AUTHORIZE WITH GOOGLE'}
              </button>

              {error && (
                <div className="p-4 bg-primary/5 border-l-2 border-primary">
                  <p className="text-[8px] font-black text-primary uppercase tracking-widest leading-relaxed">Error: {error}</p>
                </div>
              )}

              <div className="flex items-center gap-2 opacity-10">
                 <Zap className="w-3 h-3" />
                 <span className="text-[7px] font-black uppercase tracking-widest">Quantum Secured</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
