
export type NewsCategory = 'Defense' | 'Polity' | 'Economy' | 'International' | 'Science' | 'Environment' | 'Sports' | 'Miscellaneous' | 'All';

export type UserIntent = 'news_track' | 'preparation' | null;

export interface NewsItem {
  id: string;
  title: string;
  category: NewsCategory;
  summary: string;
  date: string;
  sources: { title: string; uri: string }[];
  isBookmarked?: boolean;
}

export interface HistoryEvent {
  id: string;
  title: string;
  year: string;
  description: string;
  relevance: string;
  category: string;
}

export type AppView = 'feed' | 'bookmarks' | 'search' | 'analytics' | 'account' | 'weekly-drill' | 'history' | 'onboarding';

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
