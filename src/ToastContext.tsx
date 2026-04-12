import React, { createContext, useContext, useState, ReactNode } from 'react';
import UndoToast from './components/UndoToast';

interface ToastContextType {
  showUndo: (message: string, onUndo: () => void) => void;
  clearToast: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [toast, setToast] = useState<{message: string, onUndo: () => void} | null>(null);
  
  return (
    <ToastContext.Provider value={{ showUndo: (msg, undo) => setToast({ message: msg, onUndo: undo }), clearToast: () => setToast(null) }}>
      {children}
      {toast && (
        <UndoToast 
          message={toast.message} 
          onUndo={toast.onUndo} 
          onClose={() => setToast(null)} 
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
