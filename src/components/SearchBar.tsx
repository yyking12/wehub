import { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGitHubAppsContext } from '../context/GitHubAppsContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
    };
  }, []);

  const { allApps } = useGitHubAppsContext();

  const suggestions = useMemo(() => {
    if (!value.trim()) return [];
    const q = value.toLowerCase();
    return allApps
      .filter(
        (app) =>
          app.name.toLowerCase().includes(q) ||
          app.author.toLowerCase().includes(q) ||
          app.tags.some((tag) => tag.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [value, allApps]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
    setShowSuggestions(false);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const splitRegex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(splitRegex);
    const matchRegex = new RegExp(escaped, 'i');
    return parts.map((part, i) =>
      matchRegex.test(part) ? (
        <span key={i} className="text-purple-600 font-semibold">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative max-w-xl mx-auto -mt-6 mb-16 px-6 z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className={`relative glass rounded-2xl transition-all duration-500 ${
          focused || showSuggestions ? 'shadow-lg shadow-purple-500/15 border-purple-400/40' : ''
        }`}
        animate={{ scale: focused || showSuggestions ? 1.02 : 1 }}
      >
        {focused && (
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 opacity-15 blur-md"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}

        <div className="relative flex items-center px-6 py-4">
          <motion.svg
            className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ scale: focused ? 1.1 : 1, color: focused ? '#7c3aed' : '#9ca3af' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </motion.svg>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              setFocused(true);
              if (value.trim()) setShowSuggestions(true);
            }}
            onBlur={() => {
              setFocused(false);
              if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
              blurTimerRef.current = setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder="搜索应用、标签或作者..."
            className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-lg"
          />
          {value && (
            <motion.button
              type="button"
              onClick={() => {
                setValue('');
                onSearch('');
                inputRef.current?.focus();
              }}
              className="text-gray-400 hover:text-gray-900 ml-3"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              ✕
            </motion.button>
          )}
        </div>
      </motion.form>

      {/* 自动补全下拉 */}
      <AnimatePresence>
        {showSuggestions && value.trim() && suggestions.length > 0 && (
          <motion.div
            className="absolute left-6 right-6 top-full mt-2 glass rounded-2xl overflow-hidden shadow-2xl z-30"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            {suggestions.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={`/app/${app.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100/50 transition-colors"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <img
                    src={app.icon}
                    alt={app.name}
                    className="w-8 h-8 rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 truncate">
                      {highlightMatch(app.name, value)}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      @{app.author}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 bg-gray-200/50 px-2 py-0.5 rounded-full">
                    {app.category}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
