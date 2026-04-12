import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { Zap, BarChart3, Mail, Lock, UserPlus, LogIn, KeyRound } from 'lucide-react';

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
        // Optionally switch back to login after success
        // setTimeout(() => setMode('login'), 3000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    login: { title: 'ATHLETE_LOGIN', button: 'AUTHORIZE', link: 'NEW_ACCOUNT', icon: <LogIn className="w-5 h-5" /> },
    register: { title: 'ATHLETE_ENROLL', button: 'REGISTER', link: 'EXISTING_MEMBER', icon: <UserPlus className="w-5 h-5" /> },
    forgot: { title: 'RECOVERY_INIT', button: 'SEND_RESET', link: 'BACK_TO_LOGIN', icon: <KeyRound className="w-5 h-5" /> }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden bg-[#0c0c0e] font-['Inter']">
     
      <div className="w-full max-w-5xl relative z-10 flex flex-col md:flex-row gap-12 md:gap-24 items-center">
        
        {/* Cinematic Branding */}
        <div className="max-w-md space-y-6 text-center md:text-left animate-fade-in">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 bg-primary flex items-center justify-center">
               <BarChart3 className="w-5 h-5 text-black" />
            </div>
            <span className="heading-athletic text-3xl text-white tracking-widest">GYM ZONE</span>
          </div>

          <div className="space-y-2">
            <h1 className="heading-athletic text-[80px] md:text-[120px] leading-[0.85] text-white tracking-tighter">
              GO<br/>HARD.
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">ELITE WORKOUT TERMINAL</p>
          </div>
        </div>

        {/* Minimal Auth Card */}
        <div className="w-full max-w-xs performance-card p-0.5 animate-slide-up">
           <div className="bg-surface p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  {labels[mode].icon}
                  <h2 className="heading-athletic text-3xl text-white">{labels[mode].title}</h2>
                </div>
                <div className="h-0.5 w-12 bg-primary" />
                <p className="text-[9px] font-medium text-white/20 leading-relaxed uppercase tracking-widest">
                  Secure access to the workout vault.
                </p>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-1">
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="email"
                      placeholder="Email Address"
                      required
                      className="w-full bg-[#0a0b0d] border-b border-white/5 px-10 py-3 text-xs text-white outline-none focus:border-primary transition-all font-bold placeholder:text-white/10"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {mode !== 'forgot' && (
                  <div className="space-y-1">
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="password"
                        placeholder="Security Key"
                        required
                        className="w-full bg-[#0a0b0d] border-b border-white/5 px-10 py-3 text-xs text-white outline-none focus:border-primary transition-all font-bold placeholder:text-white/10"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="btn-blaze w-full py-4 text-[10px]"
                >
                  {loading ? 'PROCESSING...' : labels[mode].button}
                </button>

                {mode === 'login' && (
                  <button 
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="w-full text-[8px] font-black uppercase tracking-widest text-white/20 hover:text-primary transition-colors mt-2"
                  >
                    Recover Password
                  </button>
                )}
              </form>

              <div className="relative">
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/5" />
                <span className="relative z-10 block w-max mx-auto px-4 bg-surface text-[7px] font-black text-white/10 uppercase tracking-widest">
                  OR_AUTH_WITH
                </span>
              </div>

              <button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                GOOGLE_SYNC
              </button>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-[9px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
                >
                  [ {labels[mode].link} ]
                </button>
              </div>

              {error && (
                <div className="p-4 bg-primary/5 border-l-2 border-primary">
                  <p className="text-[8px] font-black text-primary uppercase tracking-widest leading-relaxed">Error: {error}</p>
                </div>
              )}

              {message && (
                <div className="p-4 bg-green-500/5 border-l-2 border-green-500">
                  <p className="text-[8px] font-black text-green-500 uppercase tracking-widest leading-relaxed">{message}</p>
                </div>
              )}

              <div className="flex items-center gap-2 opacity-10">
                 <Zap className="w-3 h-3" />
                 <span className="text-[7px] font-black uppercase tracking-widest">Secure Cloud Vault</span>
              </div>
           </div>
        </div>
      </div>

      {/* Social Links Footer */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 opacity-30 hover:opacity-100 transition-opacity z-20">
         <a href="https://github.com/skyness69" target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-white hover:text-primary transition-colors">
            [ GITHUB ]
         </a>
         <a href="https://www.instagram.com/49.4y/" target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-white hover:text-primary transition-colors">
            [ INSTAGRAM ]
         </a>
      </div>
    </div>
  );
};

export default Auth;

