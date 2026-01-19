import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Target, Zap, Shield, TrendingUp, Award, Clock, Star, BookOpen, CheckCircle, ChevronRight } from 'lucide-react';

const AnalyticsView: React.FC = () => {
  const [data, setData] = useState({
    articlesRead: 0,
    bookmarks: 0,
    drills: 0,
    accuracy: 0,
    catStats: {} as Record<string, number>
  });

  useEffect(() => {
    const read = parseInt(localStorage.getItem('aspirant_stats_read') || '0');
    const drills = parseInt(localStorage.getItem('aspirant_stats_drills') || '0');
    const accSum = parseInt(localStorage.getItem('aspirant_stats_accuracy_sum') || '0');
    const bookmarks = JSON.parse(localStorage.getItem('aspirant_bookmarks') || '[]').length;
    const catStats = JSON.parse(localStorage.getItem('aspirant_category_stats') || '{}');

    setData({
      articlesRead: read,
      bookmarks,
      drills,
      accuracy: drills > 0 ? Math.round(accSum / drills) : 0,
      catStats
    });
  }, []);

  const metrics = useMemo(() => {
    // 3 mins per article + 10 mins per drill
    const totalMinutes = (data.articlesRead * 3) + (data.drills * 10);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    const points = (data.articlesRead * 10) + (data.bookmarks * 5) + (data.drills * 50) + (data.accuracy * 2);
    
    let rank = "Officer Cadet";
    if (points > 100) rank = "Second Lieutenant";
    if (points > 500) rank = "Lieutenant";
    if (points > 1000) rank = "Captain";
    if (points > 2500) rank = "Major";
    if (points > 5000) rank = "Lieutenant Colonel";
    if (points > 10000) rank = "Colonel";
    if (points > 25000) rank = "Brigadier";

    return {
      prepTime: `${hours}h ${mins}m`,
      points,
      rank,
      accuracy: `${data.accuracy}%`
    };
  }, [data]);

  // Derived Proficiency (0-100 scale, milestone 20 articles per category)
  const proficiencies = [
    { label: 'Defense & Security', value: Math.min(((data.catStats['Defense'] || 0) / 20) * 100, 100), color: 'bg-blue-500' },
    { label: 'Polity & Governance', value: Math.min(((data.catStats['Polity'] || 0) / 20) * 100, 100), color: 'bg-purple-500' },
    { label: 'Global Economy', value: Math.min(((data.catStats['Economy'] || 0) / 20) * 100, 100), color: 'bg-emerald-500' },
    { label: 'International Relations', value: Math.min(((data.catStats['International'] || 0) / 20) * 100, 100), color: 'bg-amber-500' },
    { label: 'Science & Technology', value: Math.min(((data.catStats['Science'] || 0) / 20) * 100, 100), color: 'bg-rose-500' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 space-y-10 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full w-fit"
          >
            <Shield size={12} className="text-indigo-400" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Duty: Day 12</span>
          </motion.div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-4">
            <Award className="text-indigo-500" size={36} /> Prep Tracker
          </h2>
          <p className="text-slate-500 font-medium text-lg">Real-time analysis of your strategic combat readiness.</p>
        </div>
        <div className="flex gap-4">
          <StatBox icon={<Clock className="text-emerald-400" size={16} />} label="Operational Time" value={metrics.prepTime} />
          <StatBox icon={<Target className="text-purple-400" size={16} />} label="Drill Precision" value={metrics.accuracy} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Readiness Score */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <Shield size={160} />
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Commissioned Rank</p>
              <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{metrics.rank}</h3>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-indigo-400 tracking-tighter">{metrics.points}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Merit Points</p>
            </div>
          </div>

          <div className="space-y-6 pt-4 relative z-10">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Knowledge Distribution</h4>
            {proficiencies.map((prof, i) => (
              <ProficiencyBar key={i} label={prof.label} value={prof.value} color={prof.color} />
            ))}
          </div>
        </div>

        {/* Tactical Milestones */}
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 space-y-6 shadow-xl flex flex-col">
           <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
             <Zap className="text-indigo-400" size={18} /> Strategic Objectives
           </h4>
           <div className="space-y-4 flex-1">
              <ObjectiveCard 
                title="Geopolitics Master" 
                current={data.catStats['International'] || 0} 
                target={10} 
                reward="Elite Intel Badge" 
              />
              <ObjectiveCard 
                title="Vault Specialist" 
                current={data.bookmarks} 
                target={25} 
                reward="Archivist Insignia" 
              />
              <ObjectiveCard 
                title="Combat Readiness" 
                current={data.drills} 
                target={10} 
                reward="Tier 1 Access" 
              />
              <ObjectiveCard 
                title="Generalist" 
                current={data.articlesRead} 
                target={100} 
                reward="Veteran Status" 
              />
           </div>
           
           <button className="w-full bg-indigo-600/10 border border-indigo-500/20 py-4 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 group">
             Claim Unlocked Medals <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>

      {/* Strategic Consistency (Heatmap) */}
      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
             <TrendingUp className="text-emerald-400" size={18} /> Strategic Consistency
          </h4>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Archive Log: Last 40 Days</span>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-between">
           {Array.from({ length: 40 }).map((_, i) => {
             // Mock density based on total read count to give immediate visual feedback
             const density = Math.min(Math.floor(data.articlesRead / 5), 4);
             const isActive = i > (40 - density * 3);
             return (
               <motion.div 
                 key={i} 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ delay: i * 0.005 }}
                 className={`w-6 h-6 rounded-md border border-white/5 transition-colors duration-500 
                   ${isActive && i % 3 === 0 ? 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]' : 
                     isActive && i % 2 === 0 ? 'bg-indigo-800/60' : 
                     isActive ? 'bg-indigo-900/40' : 
                     'bg-white/5 hover:bg-white/10'}`} 
               />
             );
           })}
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
             <span>Inactive</span>
             <div className="flex gap-1">
               <div className="w-2.5 h-2.5 rounded bg-white/5 border border-white/5" />
               <div className="w-2.5 h-2.5 rounded bg-indigo-900/40" />
               <div className="w-2.5 h-2.5 rounded bg-indigo-800/60" />
               <div className="w-2.5 h-2.5 rounded bg-indigo-600" />
             </div>
             <span>Active Research</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Prep Density is calculated using historical session logs.
          </p>
        </div>
      </div>
    </div>
  );
};

// Use React.FC to fix JSX attribute mismatch (key) and provide proper typing for props
const StatBox: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-lg backdrop-blur-xl">
    <div className="p-2.5 bg-white/5 rounded-xl">{icon}</div>
    <div>
      <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1.5">{label}</p>
      <p className="text-xl font-black text-white leading-none tracking-tight italic">{value}</p>
    </div>
  </div>
);

// Use React.FC to fix JSX attribute mismatch (key) and provide proper typing for props
const ProficiencyBar: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-xs font-black text-white italic">{Math.round(value)}%</span>
    </div>
    <div className="h-2 w-full bg-slate-900 rounded-full border border-white/5 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className={`h-full ${color} rounded-full shadow-[0_0_12px_rgba(255,255,255,0.05)]`}
      />
    </div>
  </div>
);

// Use React.FC to fix JSX attribute mismatch (key) and provide proper typing for props
const ObjectiveCard: React.FC<{ title: string, current: number, target: number, reward: string }> = ({ title, current, target, reward }) => {
  const progress = Math.min((current / target) * 100, 100);
  const isComplete = progress >= 100;
  
  return (
    <div className={`p-4 rounded-2xl space-y-3 transition-all border ${isComplete ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h5 className={`text-[11px] font-black uppercase tracking-tight ${isComplete ? 'text-emerald-400' : 'text-slate-200'}`}>
            {title}
          </h5>
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Reward: {reward}</p>
        </div>
        {isComplete && <CheckCircle size={14} className="text-emerald-500" />}
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase">
          <span>Progress</span>
          <span>{current} / {target}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full rounded-full ${isComplete ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-indigo-600'}`} 
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;