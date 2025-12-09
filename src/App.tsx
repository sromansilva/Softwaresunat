import { useState } from 'react';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/sonner';

interface User {
  code: string;
  name: string;
  role: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'casos' | 'contribuyentes' | 'alertas' | 'reportes' | 'ai-analytics' | 'settings'>('dashboard');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentView('dashboard');
  };

  return (
    <ThemeProvider>
      {!isLoggedIn || !currentUser ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <DashboardPage
          currentView={currentView}
          onViewChange={setCurrentView}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
      )}
      <Toaster />
    </ThemeProvider>
  );
}