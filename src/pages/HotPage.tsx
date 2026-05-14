import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppGrid from '../components/AppGrid';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import { useGitHubAppsContext } from '../context/GitHubAppsContext';
import type { AppInfo } from '../types';

function calcHotScore(app: AppInfo): number {
  const starScore = Math.log2(app.stars + 1) * 5;
  return starScore * 0.6 + app.activityScore * 0.4;
}

export default function HotPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredApps, setFilteredApps] = useState<AppInfo[] | null>(null);
  const { allApps, loading, error } = useGitHubAppsContext();

  const baseApps = useMemo(() => {
    const scored = allApps.map(app => ({
      ...app,
      hotScore: calcHotScore(app),
    }));
    scored.sort((a, b) => b.hotScore - a.hotScore);
    if (!searchQuery.trim()) return scored;
    const q = searchQuery.toLowerCase();
    return scored.filter(app =>
      app.name.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      app.author.toLowerCase().includes(q) ||
      (app.tags || []).some(tag => tag.toLowerCase().includes(q)) ||
      app.category.toLowerCase().includes(q)
    );
  }, [allApps, searchQuery]);

  const displayApps = filteredApps ?? baseApps;

  const handleTagClick = (tag: string) => {
    navigate(`/discover?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <main className="pt-24 pb-20">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">🔥 热门排行</h1>
        <p className="text-gray-500">综合 Star 数与社区活跃度的实时热度排名</p>
      </div>
      <SearchBar onSearch={setSearchQuery} />
      {loading && (
        <p className="text-center text-gray-500 text-sm mb-8">正在从 GitHub 获取最新数据...</p>
      )}
      {error && !loading && (
        <p className="text-center text-red-500 text-sm mb-8">{error}</p>
      )}
      {searchQuery && (
        <p className="text-center text-gray-500 text-sm mb-8 -mt-4">
          搜索 "{searchQuery}" 找到 {baseApps.length} 个应用
        </p>
      )}
      {!loading && allApps.length > 0 && (
        <FilterBar apps={baseApps} onFilter={setFilteredApps} />
      )}
      <AppGrid apps={displayApps} loading={loading} onTagClick={handleTagClick} />
    </main>
  );
}
