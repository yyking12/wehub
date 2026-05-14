import { useState, useMemo } from 'react';
import AppGrid from '../components/AppGrid';
import SearchBar from '../components/SearchBar';
import HeroSection from '../components/HeroSection';
import FilterBar from '../components/FilterBar';
import { useGitHubAppsContext } from '../context/GitHubAppsContext';
import type { AppInfo } from '../types';


export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredApps, setFilteredApps] = useState<AppInfo[] | null>(null);
  const { allApps, loading, error } = useGitHubAppsContext();

  const baseApps = useMemo(() => {
    const base = allApps.filter(a => a.featured);
    if (!searchQuery.trim()) return base;
    const q = searchQuery.toLowerCase();
    return base.filter(app =>
      app.name.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      app.author.toLowerCase().includes(q) ||
      app.tags.some(tag => tag.toLowerCase().includes(q)) ||
      app.category.toLowerCase().includes(q)
    );
  }, [allApps, searchQuery]);

  const displayApps = filteredApps ?? baseApps;

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
      {searchQuery && (
        <p className="text-center text-gray-500 text-sm mb-8 -mt-4">
          搜索 "{searchQuery}" 找到 {baseApps.length} 个应用
        </p>
      )}
      {!loading && allApps.length > 0 && (
        <FilterBar apps={baseApps} onFilter={setFilteredApps} />
      )}
      <AppGrid apps={displayApps} loading={loading} />
    </main>
  );
}
