import { useState, useMemo } from 'react';
import AppGrid from '../components/AppGrid';
import SearchBar from '../components/SearchBar';
import HeroSection from '../components/HeroSection';
import { useGitHubAppsContext } from '../context/GitHubAppsContext';


export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { allApps, loading, error } = useGitHubAppsContext();

  const featuredApps = useMemo(() => {
    const featured = allApps.filter(a => a.featured);
    if (!searchQuery.trim()) return featured;
    const q = searchQuery.toLowerCase();
    return featured.filter(app =>
      app.name.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      app.author.toLowerCase().includes(q) ||
      app.tags.some(tag => tag.toLowerCase().includes(q)) ||
      app.category.toLowerCase().includes(q)
    );
  }, [allApps, searchQuery]);

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
          搜索 "{searchQuery}" 找到 {featuredApps.length} 个应用
        </p>
      )}
      <AppGrid apps={featuredApps} loading={loading} />
    </main>
  );
}
