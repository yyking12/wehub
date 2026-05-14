import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { AppInfo } from '../types';

const languageColors: Record<string, string> = {
  Kotlin: 'bg-purple-500',
  Java: 'bg-red-500',
  'C++': 'bg-blue-500',
  C: 'bg-gray-500',
  Python: 'bg-yellow-500',
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-600',
  Swift: 'bg-orange-500',
  Dart: 'bg-cyan-500',
  Go: 'bg-cyan-400',
  Rust: 'bg-orange-600',
  Unknown: 'bg-gray-400',
};

function formatFullDate(dateStr: string): string {
  if (!dateStr) return '未知';
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatRelative(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays} 天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} 个月前`;
  return `${Math.floor(diffDays / 365)} 年前`;
}

function getSafeTags(app: AppInfo): string[] {
  if (!Array.isArray(app.tags)) return [];
  return app.tags
    .filter((t): t is string => typeof t === 'string' && t.length > 0)
    .slice(0, 3);
}

interface AppCardProps {
  app: AppInfo;
  index: number;
  onTagClick?: (tag: string) => void;
}

export default function AppCard({ app, index, onTagClick }: AppCardProps) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const desc = app.description || '暂无描述';
  const isLong = desc.length > 100;
  const displayDesc = isLong && !expanded ? desc.slice(0, 100) + '...' : desc;
  const lang = app.language || 'Unknown';
  const langColor = languageColors[lang] || 'bg-gray-400';
  const tags = getSafeTags(app);
  const updatedFull = formatFullDate(app.updatedAt || app.createdAt);
  const updatedRelative = formatRelative(app.updatedAt || app.createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.08, 0.8),
        ease: [0.2, 0.0, 0.0, 1.0],
      }}
      viewport={{ once: true, margin: '-40px' }}
    >
      <Link to={`/app/${app.id}`}>
        <motion.div
          className="relative glass rounded-2xl p-5 cursor-pointer card-shadow transition-all duration-300"
          whileHover={{ y: -6 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Header: Icon + Name/Author + Stars */}
          <div className="flex items-start gap-3.5 mb-3">
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 ring-1 ring-gray-200"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <img
                src={app.icon}
                alt={app.name}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const char = app.name[0] || '?';
                  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50" y="70" text-anchor="middle" fill="%239ca3af" font-size="50" font-family="sans-serif">${char}</text></svg>`;
                  target.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
                }}
              />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 font-bold text-[17px] truncate leading-tight">{app.name}</h3>
              <p className="text-gray-400 text-xs mt-0.5">@{app.author}</p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 rounded-full px-2.5 py-1 text-xs font-semibold text-yellow-700 flex-shrink-0 ring-1 ring-yellow-200">
              <span>⭐</span>
              {app.stars >= 1000 ? `${(app.stars / 1000).toFixed(1)}k` : app.stars}
            </div>
          </div>

          {/* Description */}
          <p
            className="text-gray-500 text-sm leading-relaxed mb-3"
            onClick={(e) => { if (isLong) { e.preventDefault(); setExpanded(!expanded); } }}
          >
            {displayDesc}
            {isLong && (
              <span className="text-purple-500 ml-1 text-xs font-medium inline-block">
                {expanded ? '收起' : '展开'}
              </span>
            )}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.map((tag, i) => (
                <span
                  key={`${tag}-${i}`}
                  className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full cursor-pointer hover:bg-purple-100 hover:text-purple-700 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onTagClick) onTagClick(tag);
                    else navigate(`/discover?tag=${encodeURIComponent(tag)}`);
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Metadata bar */}
          <div className="flex items-center gap-3 pt-3 border-t border-gray-200/50 text-xs text-gray-400">
            <span className="flex items-center gap-1.5" title={`编程语言: ${lang}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${langColor}`} />
              {lang}
            </span>
            <span className="flex items-center gap-1" title={`最后更新: ${updatedFull}`}>
              🕒 {updatedRelative}
            </span>
            {app.license && app.license !== 'Unknown' && (
              <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-medium" title={`开源协议: ${app.license}`}>
                {app.license}
              </span>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
