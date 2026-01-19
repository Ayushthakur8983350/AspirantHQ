
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Target, 
  ShieldCheck, 
  Loader2, 
  BookOpen, 
  AlertCircle,
  Filter,
  ArrowUp,
  Search,
  ChevronDown,
  Info,
  Calendar,
  Layers,
  Zap,
  Globe,
  Quote,
  Flag,
  Lightbulb,
  Crosshair
} from 'lucide-react';
import { fetchHistoryToday, HistoryPackage } from '../services/geminiService';
import { HistoryEvent } from '../types';

const HistorySkeleton = () => (
  <div className="space-y-12 animate-pulse">
    <div className="space-y-4 text-center">
      <div className="h-4 w-32 bg-white/5 rounded-full mx-auto" />
      <div className="h-16 w-64 bg-white/5 rounded-3xl mx-auto" />
    </div>
    <div className="space-y-8 relative">
      <div className="absolute left-8 top-0 bottom-0 w-px bg-white/5 md:left-1/2" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`relative flex flex-col md:flex-row gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
          <div className="absolute left-8 -translate-x-1/2 w-4 h-4 bg-white/10 rounded-full md:left-1/2" />
          <div className="flex-1 ml-16 md:ml-0 h-40 bg-white/5 rounded-[2rem]" />
          <div className="flex-1 hidden md:block" />
        </div>
      ))}
    </div>
  </div>
);

const HistoryTodayView: React.FC = () => {
  const [data, setData] = useState<HistoryPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const todayRaw = new Date();
  const today = todayRaw.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        const result = await fetchHistoryToday();
        setData(result);
      } catch (err) {
        console.error("Failed to load history data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const categories = useMemo(() => {
    if (!data) return ['All'];
    const cats = new Set(data.events.map(e => e.category));
    return ['All', ...Array.from(cats)].sort();
  }, [data]);

  const filteredEvents = useMemo(() => {
    if (!data) return [];
    let result = data.events;
    if (activeCategory !== 'All') {
      result = result.filter(e => e.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(q) || 
        e.description.toLowerCase().includes(q) ||
        e.year.toLowerCase().includes(q)
      );
    }
    return result;
  }, [data, activeCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading || !data) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24">
        <HistorySkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-16 pb-64">
      {/* 1. Header Section */}
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest"
        >
           <Layers size={12} /> Strategic Temporal Registry
        </motion.div>
        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
          History <span className="text-indigo-500">Today</span>
        </h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm italic">{today} • Daily Chronology</p>
      </div>

      {/* 2. Control Panel */}
      <div className="sticky top-24 z-40 space-y-4">
        <div className="bg-slate-950/80 backdrop-blur-2xl p-5 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-3 text-slate-500">
              <Filter size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Sector Filter:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  activeCategory === cat 
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.3)]' 
                    : 'bg-white/5 text-slate-500 border-white/5 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search through chronology (Year, Event, or Relevance)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-[1.8rem] py-4 pl-14 pr-4 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* 3. Daily Brief Chronology (Timeline) */}
      <div className="space-y-8 relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/5 md:left-1/2" />
        
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event, idx) => {
            const eventId = event.id || `${event.year}-${idx}`;
            return (
              <motion.div
                key={eventId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className={`relative flex flex-col md:flex-row gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="absolute left-8 -translate-x-1/2 w-4 h-4 bg-indigo-600 rounded-full border-4 border-slate-950 z-10 md:left-1/2 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />

                <div className="flex-1 ml-16 md:ml-0">
                  <div 
                    onClick={() => toggleExpand(eventId)}
                    className={`p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group ${expandedId === eventId ? 'bg-white/10 border-indigo-500/30' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-black text-indigo-400 italic tracking-tighter">{event.year}</span>
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{event.category}</span>
                    </div>
                    <h4 className="text-xl font-black text-white leading-tight mb-2 uppercase italic tracking-tight">{event.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{event.description}</p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                         <ChevronDown size={14} className={`transition-transform duration-300 ${expandedId === eventId ? 'rotate-180' : ''}`} />
                         {expandedId === eventId ? 'Less Intel' : 'Strategic Context'}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedId === eventId && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mt-6 pt-6 border-t border-white/5 space-y-4"
                        >
                          <div className="space-y-2">
                             <div className="flex items-center gap-2 text-indigo-400">
                               <Target size={14} />
                               <span className="text-[10px] font-black uppercase tracking-widest">Aspirant Perspective</span>
                             </div>
                             <p className="text-sm text-slate-300 italic leading-relaxed">{event.relevance}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="flex-1 hidden md:block" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 4. DEDICATED SIGNIFICANCE SECTION (BELOW THE BRIEF) */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative group pt-12"
      >
        <div className="absolute inset-0 bg-indigo-600/5 blur-3xl rounded-[3rem] -z-10" />
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
            <Flag size={200} />
          </div>
          
          <div className="space-y-10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl">
                <Lightbulb size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Mission Debrief: Date Importance</h3>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Strategic Analysis for {today}</p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-xl md:text-2xl font-black text-white italic leading-snug border-l-4 border-indigo-500 pl-6">
                "{data.significance.summary}"
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <Crosshair size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Strategic Reasoning</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed font-bold italic">
                    {data.significance.whyItMatters}
                  </p>
                </div>
                
                <div className="bg-black/40 border border-white/5 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Target size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Primary Exam Pillars</span>
                  </div>
                  <ul className="space-y-3">
                    {data.significance.examPillars.map((pillar, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span className="text-xs font-bold text-slate-400 italic">{pillar}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                <ShieldCheck size={14} /> High-Yield Date
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="flex justify-center">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all shadow-xl"
        >
          <ArrowUp size={16} /> Extraction Point (Back to top)
        </button>
      </div>
    </div>
  );
};

export default HistoryTodayView;
