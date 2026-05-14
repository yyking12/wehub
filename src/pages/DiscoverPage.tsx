import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AppGrid from '../components/AppGrid';
import SearchBar from '../components/SearchBar';
import HeroSection from '../components/HeroSection';
import FilterBar from '../components/FilterBar';
import { useGitHubAppsContext } from '../context/GitHubAppsContext';
import type { AppInfo } from '../types';


export default function DiscoverPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredApps, setFilteredApps] = useState<AppInfo[] | null>(null);
  const { allApps, loading, error } = useGitHubAppsContext();

  const urlTag = searchParams.get('tag') || '';

  useEffect(() => {
    if (urlTag) setSearchQuery(urlTag);
  }, [urlTag]);

  const baseApps = useMemo(() => {
    let base = allApps.filter(a => a.featured);
    if (urlTag) {
      base = base.filter(app =>
        (app.tags || []).some(tag => tag.toLowerCase().includes(urlTag.toLowerCase())) ||
        app.category.toLowerCase().includes(urlTag.toLowerCase())
      );
    }
    if (searchQuery.trim() && !urlTag) {
      const q = searchQuery.toLowerCase();
      base = base.filter(app =>
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.author.toLowerCase().includes(q) ||
        (app.tags || []).some(tag => tag.toLowerCase().includes(q)) ||
        app.category.toLowerCase().includes(q)
      );
    }
    return base;
  }, [allApps, searchQuery, urlTag]);

  const displayApps = filteredApps ?? baseApps;

  const handleTagClick = (tag: string) => {
    navigate(`/discover?tag=${encodeURIComponent(tag)}`);
    setFilteredApps(null);
  };

  return (
    <main>
      <HeroSection />
      <SearchBar onSearch={setSearchQuery} />
      {loading && (
        <p className="text-center text-gray-500 text-sm mb-8">正在从 GitHub 获取最新数据...</p>
      )}
      {error && !loading && (
        <p className="text-center text-red-500 text-sm mb-8">{error}</p>
      )}
      {(searchQuery || urlTag) && (
        <p className="text-center text-gray-500 text-sm mb-8 -mt-4">
          {urlTag ? `标签 "${urlTag}" 找到 ` : `搜索 "${searchQuery}" 找到 `}{baseApps.length} 个应用
        </p>
      )}
      {!loading && allApps.length > 0 && (
        <FilterBar apps={baseApps} onFilter={setFilteredApps} />
      )}
      <AppGrid apps={displayApps} loading={loading} onTagClick={handleTagClick} />
    </main>
  );
}
