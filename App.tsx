
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, 
  Bookmark, 
  Search, 
  User, 
  Menu, 
  RotateCcw,
  Loader2,
  ShieldAlert,
  TrendingUp,
  History,
  Zap,
  Activity,
  ArrowUp,
  Wifi,
  Database,
  Bell,
  RefreshCw
} from 'lucide-react';
import { AppView, NewsItem, NewsCategory, UserIntent } from './types';
import { fetchCurrentAffairs } from './services/geminiService';
import { authService, UserSession } from './services/authService';
import NewsCard from './components/NewsCard';
import Sidebar from './components/Sidebar';
import BookmarkList from './components/BookmarkList';
import AccountView from './components/AccountView';
import WeeklyDrill from './components/WeeklyDrill';
import SearchView from './components/SearchView';
import AnalyticsView from './components/AnalyticsView';
import HistoryTodayView from './components/HistoryTodayView';
import OnboardingView from './components/OnboardingView';
import HistorySnapshotCard from './components/HistorySnapshotCard';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('feed');
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('All');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());
  const [bookmarks, setBookmarks] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [session, setSession] = useState<UserSession | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [userIntent, setUserIntent] = useState<UserIntent>(null);
  const [isLiveScanning, setIsLiveScanning] = useState(false);
  const [isStockpiling, setIsStockpiling] = useState(false);
  const [newUpdatesAvailable, setNewUpdatesAvailable] = useState(0);
  
  // High-performance news cache
  const newsCache = useRef<Record<string, NewsItem[]>>({});
  const isFetchingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Persistence: Load session and viewed IDs
  useEffect(() => {
    const unsubscribe = authService.onAuthUpdate((newSession) => {
      setSession(newSession);
      setAuthInitialized(true);
      if (!newSession) {
        setActiveView('account');
      } else {
        const savedIntent = localStorage.getItem(`aspirant_intent_${newSession.user.uid}`);
        if (savedIntent) setUserIntent(savedIntent as UserIntent);
        
        const savedViewed = localStorage.getItem(`aspirant_viewed_${newSession.user.uid}`);
        if (savedViewed) setViewedIds(new Set(JSON.parse(savedViewed)));
      }
    });
    
    const savedBookmarks = localStorage.getItem('aspirant_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (session && viewedIds.size > 0) {
      localStorage.setItem(`aspirant_viewed_${session.user.uid}`, JSON.stringify(Array.from(viewedIds)));
    }
  }, [viewedIds, session]);

  // CATEGORY SWITCHING LOGIC (Optimized for Speed)
  useEffect(() => {
    if (activeView === 'feed' && session && userIntent) {
      // 1. Check Cache First
      if (newsCache.current[selectedCategory]) {
        setNews(newsCache.current[selectedCategory]);
        // Silently refresh in background if cache is old (optional)
        triggerBackgroundStockpile(0, true);
      } else {
        loadInitialNews();
      }
    }
  }, [selectedCategory, activeView, !!session, userIntent]);

  const loadInitialNews = async () => {
    if (isFetchingRef.current || !session) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      let accumulatedItems: NewsItem[] = [];
      const { items } = await fetchCurrentAffairs(selectedCategory, 0);
      accumulatedItems = items.filter(item => !viewedIds.has(item.id));
      
      setNews(accumulatedItems);
      newsCache.current[selectedCategory] = accumulatedItems;
      setNewUpdatesAvailable(0);
      setError(null);

      // PARALLEL STOCKPILING: Fetch even more in the background
      triggerBackgroundStockpile(accumulatedItems.length);
    } catch (err) {
      setError("Strategic Sync Failure.");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const triggerBackgroundStockpile = async (currentCount: number, isSilentRefresh = false) => {
    if (isStockpiling) return;
    setIsStockpiling(true);
    try {
      const { items } = await fetchCurrentAffairs(selectedCategory, currentCount + 50);
      const filtered = items.filter(item => !viewedIds.has(item.id) && !news.some(n => n.id === item.id));
      if (filtered.length > 0) {
        const updated = isSilentRefresh ? [...filtered, ...news] : [...news, ...filtered];
        setNews(updated);
        newsCache.current[selectedCategory] = updated;
      }
    } catch (e) {
      console.debug("Background stockpile skipped");
    } finally {
      setIsStockpiling(false);
    }
  };

  const loadMoreNews = async () => {
    if (isFetchingRef.current || !session || loadingMore) return;
    isFetchingRef.current = true;
    setLoadingMore(true);
    try {
      const { items } = await fetchCurrentAffairs(selectedCategory, news.length);
      const filtered = items.filter(item => !viewedIds.has(item.id) && !news.some(n => n.id === item.id));
      const updated = [...news, ...filtered];
      setNews(updated);
      newsCache.current[selectedCategory] = updated;
    } finally {
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop < 100 && newUpdatesAvailable > 0) setNewUpdatesAvailable(0);

    const itemIndex = Math.floor(scrollTop / clientHeight);
    const actualNewsIndex = (userIntent === 'preparation' && selectedCategory === 'All') ? itemIndex - 1 : itemIndex;

    if (actualNewsIndex >= 0 && news[actualNewsIndex]) {
      const newViewed = new Set(viewedIds);
      let changed = false;
      for (let i = 0; i <= actualNewsIndex; i++) {
        if (news[i] && !newViewed.has(news[i].id)) {
          newViewed.add(news[i].id);
          changed = true;
        }
      }
      if (changed) setViewedIds(newViewed);
    }

    if (scrollTop + clientHeight >= scrollHeight - 1000 && !loadingMore && !loading) {
      loadMoreNews();
    }
  };

  const handleIntentSelection = (intent: UserIntent) => {
    if (session) localStorage.setItem(`aspirant_intent_${session.user.uid}`, intent as string);
    setUserIntent(intent);
    setActiveView('feed');
  };

  const toggleBookmark = (item: NewsItem) => {
    setBookmarks(prev => {
      const isExist = prev.find(b => b.id === item.id);
      const updated = isExist ? prev.filter(b => b.id !== item.id) : [...prev, { ...item, isBookmarked: true }];
      localStorage.setItem('aspirant_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const clearSeenHistory = () => {
    if (session && window.confirm("This will clear your 'Seen' archive. Proceed?")) {
      setViewedIds(new Set());
      localStorage.removeItem(`aspirant_viewed_${session.user.uid}`);
      newsCache.current = {}; // Clear cache to force reload
      loadInitialNews();
    }
  };

  const isLoggedIn = !!session;

  const renderContent = () => {
    if (!authInitialized) return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );

    if (!isLoggedIn && activeView !== 'account') return (
      <div className="h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-950">
        <ShieldAlert className="text-slate-800 w-20 h-20 mb-6" />
        <h3 className="text-white text-2xl font-black uppercase tracking-tighter italic">Access Restricted</h3>
        <button onClick={() => setActiveView('account')} className="mt-8 px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full">Secure Auth</button>
      </div>
    );

    if (isLoggedIn && !userIntent && activeView !== 'account') return <OnboardingView onSelect={handleIntentSelection} userName={session?.user.name || 'Officer'} />;

    switch (activeView) {
      case 'feed':
        return (
          <div className="snap-container bg-slate-950" onScroll={handleScroll} ref={containerRef}>
            {news.length === 0 && !loading ? (
              <div className="h-screen flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center mb-8">
                  <Activity size={40} className="text-slate-700" />
                </div>
                <h3 className="text-white text-3xl font-black uppercase tracking-tighter italic">Sector Scanned</h3>
                <p className="text-slate-500 max-w-sm mt-3 text-sm italic">You've reached the current operational limit. Clear history to re-brief.</p>
                <div className="flex gap-4 mt-10">
                  <button onClick={() => setSelectedCategory('All')} className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full">Reset Sector</button>
                  <button onClick={clearSeenHistory} className="px-8 py-3 bg-white/5 border border-white/10 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-white/10 transition-colors">Clear History</button>
                </div>
              </div>
            ) : (
              <>
                {userIntent === 'preparation' && selectedCategory === 'All' && !loading && (
                  <HistorySnapshotCard onViewFull={() => setActiveView('history')} />
                )}

                {news.map((item) => (
                  <NewsCard 
                    key={item.id} 
                    item={item} 
                    isBookmarked={bookmarks.some(b => b.id === item.id)} 
                    onBookmark={() => toggleBookmark(item)} 
                  />
                ))}
                {(loading || loadingMore) && (
                  <div className="snap-item flex flex-col items-center justify-center text-indigo-400 bg-slate-950">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Establishing Secure Data Link</span>
                  </div>
                )}
              </>
            )}
          </div>
        );
      case 'history': return <div className="overflow-y-auto h-screen bg-slate-950 custom-scrollbar"><HistoryTodayView /></div>;
      case 'bookmarks': return <div className="p-6 md:p-12 max-w-4xl mx-auto overflow-y-auto h-screen pb-32 custom-scrollbar"><BookmarkList bookmarks={bookmarks} onRemove={toggleBookmark} /></div>;
      case 'search': return <div className="overflow-y-auto h-screen bg-slate-950 custom-scrollbar"><SearchView /></div>;
      case 'account': return <div className="p-6 md:p-12 max-w-4xl mx-auto overflow-y-auto h-screen pb-32 custom-scrollbar"><AccountView isLoggedIn={isLoggedIn} session={session} bookmarksCount={bookmarks.length} onResetIntent={() => setUserIntent(null)} /></div>;
      case 'weekly-drill': return <div className="overflow-y-auto h-screen bg-slate-950 custom-scrollbar"><WeeklyDrill onBack={() => setActiveView('feed')} /></div>;
      case 'analytics': return <div className="overflow-y-auto h-screen bg-slate-950 custom-scrollbar"><AnalyticsView /></div>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-inter select-none overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        userIntent={userIntent}
        newUpdatesCount={newUpdatesAvailable}
      />
      
      <main className="flex-1 relative h-screen overflow-hidden">
        <div className="absolute top-0 left-0 right-0 z-[60] p-6 flex justify-between items-center bg-gradient-to-b from-slate-950/95 via-slate-950/40 to-transparent pointer-events-none">
          <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-white pointer-events-auto hover:bg-white/10 transition-colors shadow-xl">
            <Menu size={22} />
          </button>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">Aspirant<span className="text-indigo-500">HQ</span></h1>
              <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-500 ${isLiveScanning ? 'bg-emerald-500 scale-125' : isStockpiling ? 'bg-amber-500 animate-pulse' : 'bg-indigo-500 animate-pulse'}`} />
            </div>
            <div className="flex gap-1 mt-1">
              <div className={`h-0.5 rounded-full transition-all duration-700 ${isLiveScanning ? 'bg-emerald-500 w-12 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : isStockpiling ? 'bg-amber-500 w-12 animate-pulse' : 'bg-indigo-500 w-8'}`} />
              <div className="w-2 h-0.5 bg-white/20 rounded-full" />
            </div>
          </div>

          <div className="flex items-center gap-3 pointer-events-auto">
            <button onClick={() => { newsCache.current = {}; loadInitialNews(); }} disabled={loading} className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 flex items-center justify-center transition-all ${loading ? 'opacity-50' : ''}`}>
              <RefreshCw size={20} className={`${loading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
            <button onClick={() => setActiveView('account')} className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all shadow-xl ${activeView === 'account' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
              <User size={22} />
            </button>
          </div>
        </div>
        {renderContent()}
      </main>

      <AnimatePresence>
        {(isLoggedIn && userIntent && (activeView === 'feed' || activeView === 'history' || activeView === 'bookmarks' || activeView === 'analytics')) && (
          <motion.nav initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="md:hidden fixed bottom-8 left-8 right-8 z-[100] p-1.5 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <NavIcon 
              icon={<Newspaper size={20} />} 
              active={activeView === 'feed'} 
              onClick={() => { setActiveView('feed'); setNewUpdatesAvailable(0); }} 
              label="Brief" 
              badge={newUpdatesAvailable > 0}
            />
            {userIntent === 'preparation' && <NavIcon icon={<History size={20} />} active={activeView === 'history'} onClick={() => setActiveView('history')} label="History" />}
            <NavIcon icon={<Bookmark size={20} />} active={activeView === 'bookmarks'} onClick={() => setActiveView('bookmarks')} label="Vault" />
            <NavIcon icon={<TrendingUp size={20} />} active={activeView === 'analytics'} onClick={() => setActiveView('analytics')} label="Track" />
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavIcon: React.FC<{ icon: React.ReactNode, active: boolean, onClick: () => void, label: string, badge?: boolean }> = ({ icon, active, onClick, label, badge }) => (
  <button onClick={onClick} className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-[2.2rem] transition-all relative ${active ? 'bg-white text-black scale-105 shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>
    {badge && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-4 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
    {icon}
    <span className="text-[8px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

export default App;
