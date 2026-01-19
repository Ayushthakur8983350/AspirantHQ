
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Mail, 
  Lock, 
  User, 
  LogOut, 
  ChevronRight, 
  Award, 
  Flame, 
  CheckCircle, 
  Activity, 
  FileText, 
  ShieldAlert, 
  Eye, 
  EyeOff,
  Clock,
  Loader2,
  Trophy as TrophyIcon,
  UserPlus,
  RefreshCw
} from 'lucide-react';
import { authService, UserSession } from '../services/authService';

interface AccountViewProps {
  isLoggedIn: boolean;
  session: UserSession | null;
  bookmarksCount?: number;
  onResetIntent?: () => void;
}

const AccountView: React.FC<AccountViewProps> = ({ isLoggedIn, session, bookmarksCount = 0, onResetIntent }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    articlesRead: 0,
    drillsCompleted: 0,
    streak: 7
  });

  useEffect(() => {
    if (isLoggedIn) {
      const readCount = parseInt(localStorage.getItem('aspirant_stats_read') || '0');
      const drillsCount = parseInt(localStorage.getItem('aspirant_stats_drills') || '0');
      setStats(prev => ({ ...prev, articlesRead: readCount, drillsCompleted: drillsCount }));
    }
  }, [isLoggedIn]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      if (mode === 'login') {
        await authService.login(email, password);
      } else {
        if (!name.trim()) throw new Error("Please provide your full name for the registry.");
        await authService.register(name, email, password);
      }
    } catch (err: any) {
      setError(err.message);
      // Visual feedback: clear password on failure
      setPassword('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  const handleReset = () => {
    if (session) {
      localStorage.removeItem(`aspirant_intent_${session.user.uid}`);
      onResetIntent?.();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-10">
        <motion.div 
          layout
          initial={{ opacity: 0, y: 20 }} 
          animate={error ? { x: [-10, 10, -10, 10, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          className="max-w-md w-full glass-card p-8 md:p-10 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden"
        >
          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            <motion.div 
              layout
              className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.2rem] flex items-center justify-center text-white shadow-2xl border border-white/10"
            >
              {mode === 'login' ? <Shield size={36} /> : <UserPlus size={36} />}
            </motion.div>
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
                {mode === 'login' ? 'Strategic Login' : 'Candidate Enlistment'}
              </h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                {mode === 'login' ? 'Registry Access Portal' : 'New Officer Registration'}
              </p>
            </div>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-5 relative z-10">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold" 
                      placeholder="e.g. Vikram Batra" 
                      required={mode === 'register'}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Official Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold" 
                  placeholder="officer@hq.com" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-12 text-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold" 
                  placeholder="••••••••" 
                  required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-[10px] font-black uppercase"
                >
                  <ShieldAlert size={16} className="shrink-0" /> 
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button 
              type="submit" 
              disabled={isProcessing} 
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 ${isProcessing ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-black hover:bg-indigo-50 shadow-xl active:scale-[0.98]'}`}
            >
              {isProcessing ? <Loader2 className="animate-spin" size={18} /> : (mode === 'login' ? 'Authorize Session' : 'Enlist Candidate')}
              {!isProcessing && <ChevronRight size={18} />}
            </button>
          </form>
          
          <div className="text-center pt-2 border-t border-white/5 relative z-10 flex flex-col gap-4">
            <button 
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
              className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors"
            >
              {mode === 'login' ? "Don't have an account? Enlist Now" : "Already registered? Strategic Login"}
            </button>
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none opacity-50">
              AspirantHQ Multi-Factor Encryption Active
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 rounded-[3rem] p-10 border border-white/10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group shadow-2xl"
      >
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2.8rem] flex items-center justify-center text-white border-4 border-white/5 shadow-2xl relative group overflow-hidden">
            <User size={64} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg"><CheckCircle className="text-emerald-500" size={20} /></div>
        </div>
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex items-center justify-center md:justify-start gap-4">
             <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{session?.user.name || 'Aspirant'}</h2>
             <span className="px-4 py-1.5 bg-indigo-600/20 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-400/20">Active Session</span>
          </div>
          <p className="text-slate-400 font-bold text-lg">{session?.user.email}</p>
          <div className="pt-3 flex flex-wrap justify-center md:justify-start gap-3">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10"><Award size={12} className="text-amber-400" /> Rank: {session?.user.rank}</div>
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all"
            >
              <RefreshCw size={12} /> Redefine Mission Profile
            </button>
          </div>
        </div>
        <button onClick={handleLogout} className="p-5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-3xl border border-white/5 transition-all"><LogOut size={28} /></button>
      </motion.div>

      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <div className="space-y-1">
             <h3 className="text-2xl font-black text-white tracking-widest uppercase flex items-center gap-3 italic"><Activity className="text-indigo-500" size={24} /> Training Readiness</h3>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-9">Registry Performance Logs</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
            <Flame className="text-indigo-500" size={16} />
            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">{stats.streak} Day Streak</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-indigo-400"><FileText size={20} /><span className="text-[10px] font-black uppercase tracking-widest">Read Metrics</span></div>
              <p className="text-3xl font-black text-white italic">{stats.articlesRead}</p>
           </div>
           <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-emerald-400"><Shield size={20} /><span className="text-[10px] font-black uppercase tracking-widest">Vaulted Intel</span></div>
              <p className="text-3xl font-black text-white italic">{bookmarksCount}</p>
           </div>
           <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-purple-400"><TrophyIcon size={20} /><span className="text-[10px] font-black uppercase tracking-widest">Drill Progress</span></div>
              <p className="text-3xl font-black text-white italic">{stats.drillsCompleted}</p>
           </div>
        </div>

        <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-4">
           <div className="flex items-center gap-3">
              <Clock className="text-indigo-400" size={20} />
              <h4 className="text-sm font-black text-white uppercase italic">Officer Directive</h4>
           </div>
           <p className="text-sm text-slate-400 leading-relaxed italic">
             Peak operational readiness requires consistent briefing. Engage with the <span className="text-indigo-400 font-bold">Daily Brief</span> to stay ahead of the strategic curve.
           </p>
        </div>
      </div>
    </div>
  );
};

export default AccountView;
