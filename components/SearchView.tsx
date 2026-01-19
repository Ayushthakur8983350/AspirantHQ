
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, Loader2, ArrowRight, BookOpen, ShieldAlert, Calendar, Info, ExternalLink } from 'lucide-react';
import { searchArchives } from '../services/geminiService';
import { NewsItem } from '../types';

type DateFilter = 'Today' | 'Last 7 Days' | 'Last 30 Days';

const SearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('Today');
  const [results, setResults] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await searchArchives(query, dateFilter);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOptions: DateFilter[] = ['Today', 'Last 7 Days', 'Last 30 Days'];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Intelligence Archive</h2>
        <p className="text-slate-500 font-medium">Query the global intelligence database with temporal precision.</p>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
           <Info size={12} /> Search is currently locked to {dateFilter} only.
        </div>
      </div>

      <div className="space-y-8">
        <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-0 bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all rounded-[2.5rem]" />
          <div className="relative flex items-center bg-white/5 border border-white/10 p-2 rounded-[2.5rem] backdrop-blur-3xl">
            <div className="pl-6 pr-3 text-slate-500">
              <Search size={24} />
            </div>
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none py-4 text-white outline-none placeholder:text-slate-600 font-bold text-lg" 
              placeholder="Search IR, Economy, Geopolitics..." 
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-indigo-500 transition-all disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>Commence <ArrowRight size={18} /></>}
            </button>
          </div>
        </form>

        {/* Date Filter Segmented Control */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <Calendar size={12} /> Temporal Scope
          </div>
          <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex gap-1 backdrop-blur-xl">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setDateFilter(option)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  dateFilter === option 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Deciphering Archives</p>
            </motion.div>
          ) : hasSearched && results.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/10"
            >
              <ShieldAlert className="mx-auto text-slate-700 mb-4" size={48} />
              <p className="text-slate-500 font-bold italic">No intelligence records found for this scope.</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-600 mt-2 font-black">Try expanding the temporal scope beyond {dateFilter}.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4"
            >
              {results.map((item, idx) => (
                <SearchResultCard key={item.id} item={item} index={idx} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SearchResultCard: React.FC<{ item: NewsItem, index: number }> = ({ item, index }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-all group cursor-pointer"
  >
    <div className="flex items-start gap-5">
      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
        <BookOpen size={20} />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{item.category}</span>
          <span className="w-1 h-1 bg-slate-700 rounded-full" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">{item.date}</span>
        </div>
        <h3 className="text-xl font-black text-white leading-tight group-hover:text-indigo-300 transition-colors">{item.title}</h3>
        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{item.summary}</p>
        
        {/* Compliance: Render Grounding sources */}
        {item.sources && item.sources.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {item.sources.map((source, sIdx) => (
              <a 
                key={sIdx} 
                href={source.uri} 
                target="_blank" 
                rel="noreferrer" 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
              >
                <ExternalLink size={10} /> {source.title || 'Source'}
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="self-center p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="text-indigo-500" />
      </div>
    </div>
  </motion.div>
);

export default SearchView;
