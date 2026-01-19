
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, 
  Share2, 
  ExternalLink, 
  Calendar, 
  ChevronDown, 
  ShieldCheck, 
  Globe, 
  Activity, 
  Cpu,
  Info,
  CheckCircle2,
  Zap,
  Radio
} from 'lucide-react';
import { NewsItem } from '../types';

interface NewsCardProps {
  item: NewsItem;
  isBookmarked: boolean;
  onBookmark: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, isBookmarked, onBookmark }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleReadEngagement = () => {
    if (!showAnalysis) {
      const current = parseInt(localStorage.getItem('aspirant_stats_read') || '0');
      localStorage.setItem('aspirant_stats_read', (current + 1).toString());

      const catStatsRaw = localStorage.getItem('aspirant_category_stats');
      const catStats = catStatsRaw ? JSON.parse(catStatsRaw) : {};
      const category = item.category || 'Miscellaneous';
      catStats[category] = (catStats[category] || 0) + 1;
      localStorage.setItem('aspirant_category_stats', JSON.stringify(catStats));
    }
    setShowAnalysis(!showAnalysis);
  };

  const getCategoryTheme = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('defense')) return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: <ShieldCheck size={20} /> };
    if (c.includes('intl') || c.includes('global') || c.includes('international')) return { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: <Globe size={20} /> };
    if (c.includes('economy')) return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <Activity size={20} /> };
    if (c.includes('science')) return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: <Cpu size={20} /> };
    return { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: <Info size={20} /> };
  };

  const theme = getCategoryTheme(item.category);

  return (
    <div className="snap-item relative w-full overflow-y-auto custom-scrollbar flex flex-col justify-start p-6">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent pointer-events-none z-0" />
      
      {/* Background Pulse Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none opacity-20" />

      <div className="relative z-10 w-full max-w-2xl mx-auto py-24 md:py-32 space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: false, margin: "-100px" }} 
          transition={{ duration: 0.5 }} 
          className="space-y-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black border tracking-widest ${theme.border} ${theme.bg} ${theme.color}`}>
              {theme.icon}
              {item.category.toUpperCase()}
            </span>
            <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest">
              <Radio size={12} className="text-emerald-500 animate-pulse" /> LIVE STREAM
            </span>
            <span className="text-slate-500 text-[10px] font-black flex items-center gap-1 uppercase tracking-widest">
              <Calendar size={12} /> {item.date}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter uppercase italic drop-shadow-2xl">
            {item.title}
          </h2>
          
          <div className="p-1 bg-white/5 rounded-[2rem] border border-white/10">
            <div className="p-6 md:p-8 bg-slate-900/40 backdrop-blur-3xl rounded-[1.8rem] border border-white/5 space-y-4">
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-medium italic">
                {item.summary}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={handleReadEngagement}
              className={`group w-full p-5 rounded-2xl border transition-all flex items-center justify-between ${showAnalysis ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-600/30' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
            >
              <div className="flex items-center gap-3 font-black text-xs uppercase tracking-widest">
                <Zap size={18} className={showAnalysis ? 'fill-current' : 'text-indigo-400'} /> 
                2026 Strategic Analysis
              </div>
              <ChevronDown className={`transition-transform duration-500 ${showAnalysis ? 'rotate-180' : ''}`} size={18} />
            </button>

            <AnimatePresence>
              {showAnalysis && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }} 
                  className="overflow-hidden"
                >
                  <div className="p-6 bg-indigo-950/20 border border-indigo-500/20 rounded-[2rem] space-y-4 shadow-inner">
                    <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                      <CheckCircle2 size={14} /> Tactical Briefing for 2026 Cycle
                    </div>
                    <ul className="text-sm text-slate-300 space-y-3 font-bold italic leading-relaxed">
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /> Exam Relevance: Direct correlation with UPSC GS-II & Defense Current Affairs.</li>
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /> IR Dynamics: Monitor this shift for bilateral relations essays.</li>
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /> Preparation Strategy: Cross-reference this with today's Historical Milestones.</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Floating Tactical Actions */}
      <div className="sticky bottom-32 right-0 ml-auto flex flex-col gap-6 z-20 w-fit pointer-events-auto">
        <ActionButton 
          icon={<Bookmark size={24} fill={isBookmarked ? "currentColor" : "none"} />} 
          label={isBookmarked ? "SAVED" : "VAULT"} 
          active={isBookmarked} 
          onClick={onBookmark} 
        />
        <ActionButton icon={<Share2 size={24} />} label="EXPORT" onClick={() => {}} />
        {item.sources && item.sources[0] && (
          <a 
            href={item.sources[0].uri} 
            target="_blank" 
            rel="noreferrer" 
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 rounded-[1.2rem] bg-indigo-600/10 backdrop-blur-md flex items-center justify-center text-indigo-400 border border-indigo-500/30 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl group-hover:shadow-indigo-600/40">
              <ExternalLink size={24} />
            </div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white">SOURCE</span>
          </a>
        )}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-pulse pointer-events-none">
        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Next Brief</span>
        <ChevronDown size={20} className="text-white" />
      </div>
    </div>
  );
};

const ActionButton: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group">
    <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center backdrop-blur-md border transition-all ${active ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/40' : 'bg-white/10 border-white/10 text-white group-hover:bg-white/20 group-hover:border-white/30'}`}>
      {icon}
    </div>
    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white">{label}</span>
  </button>
);

export default NewsCard;
