
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
  Zap
} from 'lucide-react';
import { QuizQuestion } from '../types';

const MOCK_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: "The 'S-400 Triumf' missile system, recently integrated into Indian defense, is acquired from which strategic partner?",
    options: ["United States", "Israel", "Russia", "France"],
    correctAnswer: 2,
    explanation: "India signed a $5.43 billion deal with Russia for five S-400 Triumf surface-to-air missile systems, considered one of the most advanced in the world."
  },
  {
    id: 'q2',
    question: "Under which Article of the Indian Constitution can the President seek the opinion of the Supreme Court on a matter of law or fact?",
    options: ["Article 123", "Article 143", "Article 72", "Article 356"],
    correctAnswer: 1,
    explanation: "Article 143 (Power of President to consult Supreme Court) allows the President to refer matters of public importance to the SC for its advisory opinion."
  },
  {
    id: 'q3',
    question: "The 'Vande Bharat' mission was primarily focused on:",
    options: ["Digital literacy in rural India", "Repatriation of Indian citizens during COVID-19", "High-speed rail connectivity", "Clean energy transition"],
    correctAnswer: 1,
    explanation: "Launched in May 2020, it was one of the largest repatriation exercises globally to bring back stranded Indians from overseas during the pandemic."
  },
  {
    id: 'q4',
    question: "Which international organization recently admitted the African Union as a permanent member during its summit in New Delhi?",
    options: ["BRICS", "ASEAN", "G20", "SCO"],
    correctAnswer: 2,
    explanation: "Under India's Presidency in 2023, the G20 admitted the African Union as a permanent member, significantly increasing Global South representation."
  }
];

interface WeeklyDrillProps {
  onBack: () => void;
}

const WeeklyDrill: React.FC<WeeklyDrillProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<'intro' | 'active' | 'results'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    let timer: number;
    if (gameState === 'active' && timeLeft > 0) {
      timer = window.setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'active') {
      setGameState('results');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === MOCK_QUESTIONS[currentIdx].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < MOCK_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setGameState('results');
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(60);
    setGameState('active');
  };

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full glass-card p-10 rounded-[3rem] space-y-8 border-white/5"
        >
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-600/30">
            <Zap size={44} fill="currentColor" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Sunday Drill</h2>
            <p className="text-slate-500 font-medium text-sm">Strategic validation of your weekly current affairs intelligence.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Items</p>
              <p className="text-xl font-black text-white">{MOCK_QUESTIONS.length} Questions</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Time</p>
              <p className="text-xl font-black text-white">60 Seconds</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => setGameState('active')}
              className="w-full bg-white text-black font-black py-5 rounded-2xl shadow-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
            >
              Begin Mission <ChevronRight size={18} />
            </button>
            <button 
              onClick={onBack}
              className="w-full bg-white/5 text-slate-400 font-black py-4 rounded-2xl hover:text-white transition-all uppercase tracking-widest text-[10px]"
            >
              Abort Operation
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'results') {
    const performance = (score / MOCK_QUESTIONS.length) * 100;
    const isSuccess = performance >= 75;

    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="max-w-md w-full glass-card p-10 rounded-[3rem] space-y-8 border-white/5"
        >
          <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl ${isSuccess ? 'bg-emerald-600 shadow-emerald-600/30' : 'bg-red-600 shadow-red-600/30'}`}>
            {isSuccess ? <ShieldCheck size={44} className="text-white" /> : <AlertCircle size={44} className="text-white" />}
          </div>
          
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              {isSuccess ? 'Operational Success' : 'Drill Failed'}
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Final Score: {score} / {MOCK_QUESTIONS.length} Correct
            </p>
          </div>

          <div className="relative h-4 bg-slate-900 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${performance}%` }}
              className={`absolute inset-y-0 left-0 ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`}
            />
          </div>

          <div className="space-y-3">
            <button 
              onClick={resetQuiz}
              className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
            >
              Retry Drill <RefreshCw size={18} />
            </button>
            <button 
              onClick={onBack}
              className="w-full bg-white/5 text-slate-400 font-black py-4 rounded-2xl hover:text-white transition-all uppercase tracking-widest text-[10px]"
            >
              Return to HQ
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = MOCK_QUESTIONS[currentIdx];

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col min-h-screen">
      <div className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white border border-white/10">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Timer size={16} className="text-indigo-400" />
            <span className={`text-sm font-black tracking-widest ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`}>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </span>
          </div>
          <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-black text-slate-400 uppercase tracking-widest">
            {currentIdx + 1} / {MOCK_QUESTIONS.length}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIdx}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="space-y-8"
        >
          <h3 className="text-2xl font-black text-white leading-tight tracking-tight">
            {currentQ.question}
          </h3>

          <div className="grid gap-4">
            {currentQ.options.map((option, idx) => {
              const isCorrect = isAnswered && idx === currentQ.correctAnswer;
              const isWrong = isAnswered && selectedOption === idx && idx !== currentQ.correctAnswer;
              
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isAnswered}
                  className={`
                    w-full p-6 rounded-[1.5rem] border text-left transition-all duration-300 flex items-center justify-between group
                    ${!isAnswered ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-500/50' : ''}
                    ${isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : ''}
                    ${isWrong ? 'bg-red-500/20 border-red-500 text-red-400' : ''}
                    ${isAnswered && !isCorrect && !isWrong ? 'opacity-40 grayscale border-white/5' : ''}
                  `}
                >
                  <span className="font-bold">{option}</span>
                  {isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                  {isWrong && <AlertCircle size={20} className="text-red-500" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl"
            >
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Target size={12} /> Strategic Insight
              </p>
              <p className="text-sm text-slate-300 leading-relaxed italic">
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
            ${isAnswered ? 'bg-white text-black hover:bg-indigo-50 shadow-xl' : 'bg-white/5 text-slate-700 cursor-not-allowed'}
          `}
        >
          {currentIdx === MOCK_QUESTIONS.length - 1 ? 'Finalize Mission' : 'Next Strategic Objective'} 
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default WeeklyDrill;
