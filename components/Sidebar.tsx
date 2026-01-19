
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, 
  Bookmark, 
  Search, 
  Award, 
  X,
  Shield,
  Zap,
  Target,
  ChevronRight,
  History,
  Bell
} from 'lucide-react';
import { AppView, NewsCategory, UserIntent } from '../types';

interface SidebarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  selectedCategory: NewsCategory;
  setSelectedCategory: (cat: NewsCategory) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userIntent: UserIntent;
  newUpdatesCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView, 
  selectedCategory, 
  setSelectedCategory, 
  isOpen, 
  setIsOpen,
  userIntent,
  newUpdatesCount = 0
}) => {
  const isPrep = userIntent === 'preparation';

  const menuItems = [
    { id: 'feed', icon: <Newspaper size={20} />, label: 'Daily Brief' },
    ...(isPrep ? [{ id: 'history', icon: <History size={20} />, label: 'History Today' }] : []),
    { id: 'bookmarks', icon: <Bookmark size={20} />, label: 'Revision Vault' },
    { id: 'search', icon: <Search size={20} />, label: 'Exploration' },
    { id: 'analytics', icon: <Award size={20} />, label: 'Prep Tracker' },
  ];

  const categories: { label: string, value: NewsCategory }[] = [
    { label: 'All Updates', value: 'All' },
    { label: 'Defense & Security', value: 'Defense' },
    { label: 'International Relations', value: 'International' },
    { label: 'Polity & Governance', value: 'Polity' },
    { label: 'Economy & Business', value: 'Economy' },
    { label: 'Science & Tech', value: 'Science' }
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] md:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-72 bg-slate-950 border-r border-white/5 z-[120] 
        transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tighter text-white">Aspirant<span className="text-indigo-500">HQ</span></h1>
              <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-bold">Officer Portal</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as AppView);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all group relative
                ${activeView === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-[1.02]' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-white'}
              `}
            >
              <span className={`transition-transform duration-300 ${activeView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="text-sm tracking-tight">{item.label}</span>
              
              {item.id === 'feed' && newUpdatesCount > 0 && (
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute right-4 px-2 py-0.5 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.6)]"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-emerald-400 rounded-full opacity-30"
                  />
                  <span className="text-[9px] font-black text-white relative z-10">{newUpdatesCount}</span>
                </motion.div>
              )}
            </button>
          ))}

          <div className="pt-10 pb-4 px-5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-2">
            <Target size={12} /> Strategic Focus
          </div>
          <div className="space-y-1">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setActiveView('feed');
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-5 py-3 text-sm transition-all rounded-xl group
                  ${selectedCategory === cat.value && activeView === 'feed'
                    ? 'text-indigo-400 bg-white/5 font-bold' 
                    : 'text-slate-500 hover:text-white hover:translate-x-1'}
                `}
              >
                <div className={`w-1.5 h-1.5 rounded-full transition-all ${selectedCategory === cat.value && activeView === 'feed' ? 'bg-indigo-400 scale-125 shadow-[0_0_10px_rgba(129,140,248,0.5)]' : 'bg-slate-800'}`} />
                {cat.label}
                <ChevronRight size={14} className={`ml-auto opacity-0 -translate-x-2 transition-all ${selectedCategory === cat.value && activeView === 'feed' ? 'opacity-100 translate-x-0' : 'group-hover:opacity-100 group-hover:translate-x-0'}`} />
              </button>
            ))}
          </div>
        </nav>

        {isPrep && (
          <div className="p-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-white relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-indigo-400" />
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Strategic Drill</p>
              </div>
              <h3 className="font-bold text-sm leading-tight mb-4">UPSC/CDS GS Cycle 2026</h3>
              <button 
                onClick={() => {
                  setActiveView('weekly-drill');
                  setIsOpen(false);
                }}
                className="w-full bg-white text-black py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors"
              >
                Daily Intel Drill
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
