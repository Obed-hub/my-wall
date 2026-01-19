import React from 'react';
import { UserProfile, Theme } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
  onLogout: () => void;
  toggleTheme: () => void;
  theme: Theme;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, toggleTheme, theme }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-xl">
                  W
                </div>
                <span className="font-bold text-xl tracking-tight hidden sm:block">My Wall</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               {/* Theme Toggle */}
               <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
              </button>

              {user ? (
                <div className="flex items-center gap-3">
                   <span className="text-sm font-medium hidden sm:block">{user.displayName}</span>
                   <button 
                     onClick={onLogout}
                     className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 py-1.5 rounded-md transition-colors"
                   >
                     Log Out
                   </button>
                </div>
              ) : (
                <span className="text-sm text-gray-500">Not Logged In</span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} My Wall. Secure Personal Cloud.</p>
      </footer>
    </div>
  );
};

export default Layout;