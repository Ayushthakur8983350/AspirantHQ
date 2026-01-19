
import React from 'react';
import { motion } from 'framer-motion';
import { History, ArrowRight, Calendar, Target, Shield } from 'lucide-react';

interface HistorySnapshotCardProps {
  onViewFull: () => void;
}

const HistorySnapshotCard: React.FC<HistorySnapshotCardProps> = ({ onViewFull }) => {
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });

  return (
    <div className="snap-item relative w-full overflow-hidden flex flex-col justify-center items-center p-6 bg-slate-950">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="bg-white/5 border border-white/10 rounded-[3.5rem] p-8 md:p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="relative">
              <div className="w-24 h-24 bg-indigo-600 rounded-[2.2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30">
                <History size={48} />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -inset-4 bg-indigo-600 rounded-[2.5rem] -z-10 blur-xl"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <span className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic">
                  Daily Chronology
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <Calendar size={12} /> {today}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                History <span className="text-indigo-500">Today</span>
              </h2>
            </div>

            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed italic max-w-lg">
              "Mastering the past is the strategic key to predicting the future in administrative and defense services."
            </p>

            <div className="grid grid-cols-2 gap-4 w-full pt-4">
              <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Target size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Exam Density</span>
                </div>
                <p className="text-xl font-black text-white italic">High-Yield</p>
              </div>
              <div className="bg-black/40 border border-white/5 p-5 rounded-3xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Shield size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Target Scope</span>
                </div>
                <p className="text-xl font-black text-white italic">50 Briefs</p>
              </div>
            </div>

            <button 
              onClick={onViewFull}
              className="group w-full bg-white text-black py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 transition-all hover:bg-indigo-50 shadow-2xl active:scale-[0.98]"
            >
              Access Archival Intel <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-pulse pointer-events-none">
        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Scroll to Daily Updates</span>
        <ArrowRight size={20} className="text-white rotate-90" />
      </div>
    </div>
  );
};

export default HistorySnapshotCard;
