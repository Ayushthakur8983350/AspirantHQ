
import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Trash2, BookOpen, ChevronRight } from 'lucide-react';
import { NewsItem } from '../types';

interface BookmarkListProps {
  bookmarks: NewsItem[];
  onRemove: (item: NewsItem) => void;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks, onRemove }) => {
  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-center px-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Bookmark className="w-10 h-10 opacity-20" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Revision Vault Empty</h3>
        <p className="max-w-xs mx-auto text-sm">Save important current affairs items here for quick revision before your exams.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="text-indigo-600" /> Revision Vault
        </h2>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
          {bookmarks.length} Items Saved
        </span>
      </div>

      <div className="space-y-4">
        {bookmarks.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">{item.category}</span>
                <span className="text-[10px] text-slate-400">•</span>
                <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
              </div>
              <h4 className="font-bold text-slate-800 line-clamp-1">{item.title}</h4>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button 
                onClick={() => onRemove(item)}
                className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                title="Remove from bookmarks"
              >
                <Trash2 size={18} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors">
                Revise Details <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkList;
