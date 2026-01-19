
import React from 'react';
import { Menu, Bell, User, Calendar } from 'lucide-react';
import { AppView } from '../types';

interface HeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ setIsSidebarOpen, activeView, setActiveView, isLoggedIn }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning, Aspirant";
    if (hour < 17) return "Good Afternoon, Aspirant";
    return "Good Evening, Aspirant";
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'feed': return 'Daily Briefing';
      case 'bookmarks': return 'Revision Vault';
      case 'search': return 'Exploration';
      case 'analytics': return 'Preparation Tracker';
      case 'account': return 'My Profile';
      default: return '';
    }
  };

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden p-2 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{getViewTitle()}</h2>
            <span className="w-1 h-1 bg-indigo-500 rounded-full" />
            <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
              <Calendar size={10} /> {today}
            </div>
          </div>
          <h1 className="text-2xl font-black text-white italic tracking-tighter">{getGreeting()}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors relative">
          <Bell size={16} className="text-slate-500" />
          <span>Alerts</span>
          <span className="absolute top-2 right-4 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
        </button>
        <button 
          onClick={() => setActiveView('account')}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${activeView === 'account' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}
        >
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
