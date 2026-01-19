
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Target, Shield, ChevronRight, Zap, Newspaper } from 'lucide-react';
import { UserIntent } from '../types';

interface OnboardingViewProps {
  onSelect: (intent: UserIntent) => void;
  userName?: string;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ onSelect, userName }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <div className="max-w-4xl w-full space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-600/30 mb-6"
          >
            <Shield size={40} />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic"
          >
            Identify Your <span className="text-indigo-500">Mission</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]"
          >
            Officer {userName || 'Aspirant'}, Define your strategic objective for the registry.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Option A: News Track */}
          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('news_track')}
            className="group relative bg-white/5 border border-white/10 rounded-[3rem] p-10 text-left transition-all hover:bg-white/10 hover:border-indigo-500/30 shadow-2xl overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-colors" />
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/5 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
                <Newspaper size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Daily Sentinel</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                  "I am here to stay informed. I need a clean, real-time feed of national and global affairs without the exam pressure."
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                Deploy as Sentinel <ChevronRight size={14} />
              </div>
            </div>
          </motion.button>

          {/* Option B: Preparation */}
          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('preparation')}
            className="group relative bg-white/5 border border-white/10 rounded-[3rem] p-10 text-left transition-all hover:bg-white/10 hover:border-indigo-500/30 shadow-2xl overflow-hidden"
          >
             <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-colors" />
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl shadow-indigo-600/10">
                <Target size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Strategic Aspirant</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                  "I am preparing for UPSC, CDS, or AFCAT. I need exam relevance, daily history, and drills to secure my commission."
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                Deploy as Aspirant <Zap size={14} className="fill-current" />
              </div>
            </div>
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">AspirantHQ Multi-Factor Personnel Selection Active</p>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingView;
