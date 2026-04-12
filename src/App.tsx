import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

import { ToastProvider } from './ToastContext';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  
  return user ? <Dashboard /> : <Auth />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
