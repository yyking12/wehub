import { useState, useMemo } from 'react';
import type { AppInfo } from '../types';

interface FilterBarProps {
  apps: AppInfo[];
  onFilter: (filtered: AppInfo[]) => void;
}

const sortOptions = [
  { key: 'hot', label: '🔥 最热' },
  { key: 'stars', label: '⭐ Star' },
  { key: 'updated', label: '🕒 最近更新' },
  { key: 'name', label: '🔤 名称' },
];

export default function FilterBar({ apps, onFilter }: FilterBarProps) {
  const [language, setLanguage] = useState('全部');
  const [sortBy, setSortBy] = useState('hot');
  const [starRange, setStarRange] = useState('全部');

  const languages = useMemo(() => {
    const langs = new Set(apps.map(a => a.language).filter(Boolean));
    return ['全部', ...Array.from(langs).sort()];
  }, [apps]);

  function applyFilters() {
    let filtered = [...apps];

    if (language !== '全部') {
      filtered = filtered.filter(a => a.language === language);
    }

    if (starRange !== '全部') {
      if (starRange === '10k+') filtered = filtered.filter(a => a.stars >= 10000);
      else if (starRange === '5k-10k') filtered = filtered.filter(a => a.stars >= 5000 && a.stars < 10000);
      else if (starRange === '1k-5k') filtered = filtered.filter(a => a.stars >= 1000 && a.stars < 5000);
      else if (starRange === '<1k') filtered = filtered.filter(a => a.stars < 1000);
    }

    if (sortBy === 'hot') {
      filtered.sort((a, b) => (b.activityScore * 0.4 + Math.log2(b.stars + 1) * 5 * 0.6) - (a.activityScore * 0.4 + Math.log2(a.stars + 1) * 5 * 0.6));
    } else if (sortBy === 'stars') {
      filtered.sort((a, b) => b.stars - a.stars);
    } else if (sortBy === 'updated') {
      filtered.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    onFilter(filtered);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 mb-6">
      <div className="glass rounded-2xl p-4 space-y-3">
        {/* Sort buttons */}
        <div className="flex flex-wrap gap-2">
          {sortOptions.map(opt => (
            <button
              key={opt.key}
              onClick={() => { setSortBy(opt.key); setTimeout(applyFilters, 0); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                sortBy === opt.key
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Language filter */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-400 font-medium">语言:</span>
          {languages.slice(0, 8).map(lang => (
            <button
              key={lang}
              onClick={() => { setLanguage(lang); setTimeout(applyFilters, 0); }}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                language === lang
                  ? 'bg-purple-100 text-purple-700 font-medium'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Star range filter */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-400 font-medium">Stars:</span>
          {['全部', '10k+', '5k-10k', '1k-5k', '<1k'].map(range => (
            <button
              key={range}
              onClick={() => { setStarRange(range); setTimeout(applyFilters, 0); }}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                starRange === range
                  ? 'bg-purple-100 text-purple-700 font-medium'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
