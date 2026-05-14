import { useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGitHubAppsContext } from '../context/GitHubAppsContext';

interface CategoryDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryEmojiMap: Record<string, string> = {
  proxy: '🔒', graalvm: '☕', 'android-architecture': '🏗️',
  accessibility: '♿', shadowsocks: '🔒', java: '☕',
  'jetpack-compose': '🖌️', 'f-droid': '📦', api: '🔌',
  'android-library': '📚', architecture: '🏗️', gfw: '🔒',
  kotlin: '💜', alert: '🔔', awt: '🖥️', ani: '🎬',
  kernel: '⚙️', 'blackbox-testing': '🧪', communication: '💬',
  desktop: '🖥️', ai: '🤖', androidx: '📱', 'android-development': '📱',
};

function catEmoji(name: string): string {
  return categoryEmojiMap[name] || '📱';
}

export default function CategoryDropdown({ isOpen, onClose }: CategoryDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const { allApps } = useGitHubAppsContext();

  const categories = useMemo(() => {
    const countMap: Record<string, number> = {};
    allApps.forEach((app) => {
      countMap[app.category] = (countMap[app.category] || 0) + 1;
    });
    return Object.entries(countMap).map(([name, count]) => ({ name, count }));
  }, [allApps]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onCloseRef.current();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景模糊层 */}
          <motion.div
            className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* 下拉面板 */}
          <motion.div
            ref={dropdownRef}
            className="absolute top-full left-0 mt-2 w-64 glass rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/20 z-50"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-3">
              <p className="text-xs text-gray-500 font-medium px-3 py-2 uppercase tracking-wider">
                应用分类
              </p>
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, x: -30, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{
                    delay: 0.05 + i * 0.06,
                    type: 'spring',
                    stiffness: 400,
                    damping: 20,
                  }}
                >
                  <Link
                    to={`/category/${encodeURIComponent(cat.name)}`}
                    onClick={onClose}
                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100/50 transition-colors duration-200 group"
                  >
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors flex items-center gap-3">
                      <span className="text-base">
                        {catEmoji(cat.name)}
                      </span>
                      {cat.name}
                    </span>
                    <motion.span
                      className="text-xs text-gray-500 bg-gray-200 px-2.5 py-1 rounded-full"
                      whileHover={{ scale: 1.1, backgroundColor: '#7c3aed', color: '#fff' }}
                    >
                      {cat.count}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
