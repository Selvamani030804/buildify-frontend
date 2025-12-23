import React, { useMemo, useState } from 'react';
import { AppRoute, User } from '../types';
import Dock from './Dock';
import Aurora from './Aurora';
import { AuthModal } from './AuthModal';
import { 
  Home, 
  FolderOpen, 
  Lightbulb, 
  Palette, 
  Wand2, 
  LayoutTemplate, 
  Bot, 
  Mic, 
  CreditCard,
  Settings,
  User as UserIcon
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: AppRoute;
  setRoute: (route: AppRoute) => void;
  user: User | null;
  onLogin: (name: string, email: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentRoute, setRoute, user, onLogin }) => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const dockItems = useMemo(() => [
    { id: AppRoute.HOME, label: 'Home', icon: <Home size={22} />, onClick: () => setRoute(AppRoute.HOME) },
    { id: AppRoute.PROJECTS, label: 'Projects', icon: <FolderOpen size={22} />, onClick: () => setRoute(AppRoute.PROJECTS) },
    { id: AppRoute.IDEA, label: 'Strategy', icon: <Lightbulb size={22} />, onClick: () => setRoute(AppRoute.IDEA) },
    { id: AppRoute.IDENTITY, label: 'Identity', icon: <Palette size={22} />, onClick: () => setRoute(AppRoute.IDENTITY) },
    { id: AppRoute.STUDIO, label: 'Studio', icon: <Wand2 size={22} />, onClick: () => setRoute(AppRoute.STUDIO) },
    { id: AppRoute.UI_SUGGESTION, label: 'UI Design', icon: <LayoutTemplate size={22} />, onClick: () => setRoute(AppRoute.UI_SUGGESTION) },
    { id: AppRoute.CHAT, label: 'Assistant', icon: <Bot size={22} />, onClick: () => setRoute(AppRoute.CHAT) },
    { id: AppRoute.CONSULTANT, label: 'Voice', icon: <Mic size={22} />, onClick: () => setRoute(AppRoute.CONSULTANT) },
    { id: AppRoute.SUBSCRIPTION, label: 'Upgrade', icon: <CreditCard size={22} />, onClick: () => setRoute(AppRoute.SUBSCRIPTION) },
    { id: AppRoute.SETTINGS, label: 'Settings', icon: <Settings size={22} />, onClick: () => setRoute(AppRoute.SETTINGS) },
  ], [setRoute]);

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-slate-100 relative overflow-hidden flex selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Dynamic Background Ambience with Aurora */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#020205]">
             <Aurora
                colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                blend={0.5}
                amplitude={1.0}
            />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020205]/40 to-[#020205]" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 w-full ml-24 max-w-[1400px] mx-auto p-6 md:p-8 pb-10 overflow-y-auto h-screen scroll-smooth custom-scrollbar">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between sticky top-0 z-40 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                    <Wand2 size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-1">
                      Buildify
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1"></div>
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {currentRoute === AppRoute.PROJECTS && (
                    <div className="text-xs font-medium text-slate-400 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 shadow-sm backdrop-blur-md">
                        Dashboard
                    </div>
                )}
                
                {/* Auth Buttons or User Profile */}
                {user ? (
                   <div 
                      onClick={() => setRoute(AppRoute.SETTINGS)}
                      className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-white/10"
                   >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-200 hidden md:block">{user.name}</span>
                   </div>
                ) : (
                  currentRoute === AppRoute.HOME && (
                    <div className="flex items-center gap-3">
                        <button 
                          onClick={() => openAuth('signin')}
                          className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                        >
                          Sign In
                        </button>
                        <button 
                          onClick={() => openAuth('signup')}
                          className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10"
                        >
                            Sign Up
                        </button>
                    </div>
                  )
                )}
            </div>
        </header>

        {children}
      </main>

      <Dock 
        items={dockItems} 
        activeId={currentRoute} 
        baseItemSize={48} 
        magnification={70}
        orientation="vertical"
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onLogin={onLogin}
        mode={authMode}
      />
    </div>
  );
};

export default Layout;