
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Timer, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Target,
  ArrowLeft,
  RefreshCw,
  Zap,
  Loader2,
  Lock
} from 'lucide-react';
import { QuizQuestion } from '../types';
import { fetchDailyDrill } from '../services/geminiService';

interface WeeklyDrillProps {
  onBack: () => void;
}

const WeeklyDrill: React.FC<WeeklyDrillProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<'intro' | 'active' | 'results' | 'loading'>('intro');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes for 5 questions

  useEffect(() => {
    let timer: number;
    if (gameState === 'active' && timeLeft > 0) {
      timer = window.setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'active') {
      finalizeMission();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startDrill = async () => {
    setGameState('loading');
    try {
      const freshQuestions = await fetchDailyDrill();
      if (freshQuestions && freshQuestions.length > 0) {
        setQuestions(freshQuestions);
        setGameState('active');
        setTimeLeft(120);
        setCurrentIdx(0);
        setScore(0);
        setIsAnswered(false);
        setSelectedOption(null);
      } else {
        throw new Error("Registry Empty");
      }
    } catch (err) {
      setGameState('intro');
      alert("Strategic Sync Failure. Ensure the secure link is active.");
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswered || !questions[currentIdx]) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === questions[currentIdx].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const finalizeMission = () => {
    const drillsCount = parseInt(localStorage.getItem('aspirant_stats_drills') || '0');
    const accuracySum = parseInt(localStorage.getItem('aspirant_stats_accuracy_sum') || '0');
    const sessionAccuracy = Math.round((score / questions.length) * 100);
    
    localStorage.setItem('aspirant_stats_drills', (drillsCount + 1).toString());
    localStorage.setItem('aspirant_stats_accuracy_sum', (accuracySum + sessionAccuracy).toString());
    
    setGameState('results');
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finalizeMission();
    }
  };

  if (gameState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center space-y-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
          <Lock className="absolute inset-0 m-auto w-6 h-6 text-indigo-300 opacity-50" />
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Generating Daily Tactical Brief</p>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse max-w-xs mx-auto">
            Gemini is synthesizing high-yield MCQs for the 2026 Strategic Cycle...
          </p>
        </div>
      </div>
    );
  }

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full glass-card p-10 rounded-[3rem] space-y-8 border-white/5 shadow-2xl">
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-600/30">
            <Zap size={44} fill="currentColor" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[9px] font-black uppercase tracking-widest">Cycle 2026 Active</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Daily Strategic Drill</h2>
            <p className="text-slate-500 font-medium text-sm">Real-time dynamic MCQ generation based on today's intelligence updates.</p>
          </div>
          
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-indigo-400" size={24} />
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase">Daily Capacity</p>
                <p className="text-xs font-bold text-white">5 High-Impact Objectives</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase">Standard Time</p>
              <p className="text-xs font-bold text-white">120 Seconds</p>
            </div>
          </div>

          <button onClick={startDrill} className="w-full bg-white text-black font-black py-5 rounded-2xl shadow-xl hover:bg-indigo-50 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3">
            Commence Drill <ChevronRight size={18} />
          </button>
          
          <button onClick={onBack} className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">
            Return to Command Center
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'results') {
    const performance = (score / questions.length) * 100;
    const isSuccess = performance >= 60;
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-md w-full glass-card p-10 rounded-[3rem] space-y-8 border-white/5 shadow-2xl">
          <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl ${isSuccess ? 'bg-emerald-600 shadow-emerald-600/40' : 'bg-red-600 shadow-red-600/40'}`}>
            {isSuccess ? <ShieldCheck size={44} className="text-white" /> : <AlertCircle size={44} className="text-white" />}
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">{isSuccess ? 'Operational Success' : 'Drill Failed'}</h2>
            <p className="text-slate-500 font-medium text-sm mt-1">Strategic Proficiency: {score} / {questions.length} Points</p>
          </div>
          <div className="space-y-3">
            <button onClick={startDrill} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-indigo-500 uppercase tracking-widest text-xs flex items-center justify-center gap-3">
              Generate New Drill <RefreshCw size={16} />
            </button>
            <button onClick={onBack} className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl hover:bg-indigo-50 uppercase tracking-widest text-xs">Return to HQ</button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  if (!currentQ) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col min-h-screen">
      <div className="flex items-center justify-between mb-12">
        <button onClick={() => setGameState('intro')} className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white border border-white/10">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Timer size={16} className="text-indigo-400" />
            <span className={`text-sm font-black tracking-widest ${timeLeft < 20 ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-black text-slate-400 uppercase tracking-widest">
            {currentIdx + 1} / {questions.length}
          </div>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div key={currentIdx} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
          <div className="space-y-3">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Objective Identified</p>
            <h3 className="text-2xl font-black text-white leading-tight tracking-tight">{currentQ.question}</h3>
          </div>
          
          <div className="grid gap-4">
            {currentQ.options.map((option, idx) => (
              <button 
                key={idx} 
                onClick={() => handleOptionSelect(idx)} 
                disabled={isAnswered} 
                className={`
                  w-full p-6 rounded-[1.8rem] border text-left transition-all duration-300 flex items-center justify-between group
                  ${!isAnswered ? 'bg-white/5 border-white/10 hover:border-indigo-500/50 hover:bg-white/10' : 
                    idx === currentQ.correctAnswer ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 
                    selectedOption === idx ? 'bg-red-500/20 border-red-500 text-red-400' : 'opacity-40 grayscale border-white/5'}
                `}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${!isAnswered ? 'bg-white/5 text-slate-500' : idx === currentQ.correctAnswer ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-slate-700'}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-bold">{option}</span>
                </div>
                {isAnswered && idx === currentQ.correctAnswer && <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />}
              </button>
            ))}
          </div>
          
          {isAnswered && (
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl space-y-2">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                <Target size={12} /> Strategic Debrief
              </p>
              <p className="text-sm text-slate-300 leading-relaxed italic font-medium">
                {currentQ.explanation}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      
      <div className="mt-auto pt-12">
        <button 
          onClick={handleNext} 
          disabled={!isAnswered} 
          className={`
            w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2
            ${isAnswered ? 'bg-white text-black hover:bg-indigo-50 shadow-2xl' : 'bg-white/5 text-slate-700 cursor-not-allowed'}
          `}
        >
          {currentIdx === questions.length - 1 ? 'Finalize Mission Assessment' : 'Next Strategic Objective'} 
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default WeeklyDrill;
