import React, { useState, useEffect } from 'react';
import { api } from './services/dataService';
import { UserProfile, Theme } from './types';
import Auth from './components/Auth';
import WallFeed from './components/WallFeed';
import Layout from './components/Layout';
import { isMockMode } from './firebase';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark

  useEffect(() => {
    // Check initial auth state
    const initAuth = async () => {
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    initAuth();

    // Check theme preference from local storage or system
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  // Apply theme class to html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout} toggleTheme={toggleTheme} theme={theme}>
      {/* Mock Mode Banner */}
      {isMockMode && (
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg flex items-start gap-3 text-sm text-yellow-800 dark:text-yellow-200">
           <i className="fas fa-info-circle mt-0.5"></i>
           <div>
             <strong>Demo Mode:</strong> Data is currently saved to your browser's local storage. 
             To sync across devices, you must configure the Firebase keys in <code>firebase.ts</code>.
           </div>
        </div>
      )}

      {user ? (
        <WallFeed />
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </Layout>
  );
};

export default App;