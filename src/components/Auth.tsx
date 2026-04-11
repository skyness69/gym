import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Dumbbell } from 'lucide-react';

const Auth: React.FC = () => {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 bg-glow-gradient">
      <div className="glass-card p-10 w-full max-w-md flex flex-col items-center gap-8 animate-fade-in translate-y-0">
        <div className="p-4 bg-blue-600/20 rounded-2xl border border-blue-500/30">
          <Dumbbell className="w-10 h-10 text-blue-400" />
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Gym Log Track
          </h1>
          <p className="text-gray-400">Elevate your training, track your progress.</p>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="glass-button-primary w-full py-4 text-lg hover:scale-[1.02] transition-transform"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          Continue with Google
        </button>

        <div className="text-xs text-gray-500 uppercase tracking-widest">
          Secure Cloud Storage
        </div>
      </div>
    </div>
  );
};

export default Auth;
