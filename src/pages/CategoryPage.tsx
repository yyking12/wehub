import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import AppGrid from '../components/AppGrid';
import { useGitHubAppsContext } from '../context/GitHubAppsContext';

function safeDecode(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

export default function CategoryPage() {
  const { name } = useParams<{ name: string }>();
  const { allApps } = useGitHubAppsContext();
  const decodedName = safeDecode(name || '');

  const categoryApps = useMemo(() => {
    return allApps.filter(
      (app) => app.category === decodedName
    );
  }, [allApps, decodedName]);

  const allCategories = useMemo(() => {
    const cats = new Set(allApps.map((a) => a.category));
    return Array.from(cats);
  }, [allApps]);

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <Link
            to="/discover"
            className="text-gray-500 hover:text-purple-600 text-sm transition-colors"
          >
            ← 返回首页
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 mb-4">
            📂 {decodedName}
          </h1>
          <p className="text-gray-500">
            共 {categoryApps.length} 个应用
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {allCategories.map((cat) => (
            <Link
              key={cat}
              to={`/category/${encodeURIComponent(cat)}`}
            >
              <motion.span
                className={`inline-block px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  decodedName === cat
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25'
                    : 'glass text-gray-500 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat}
              </motion.span>
            </Link>
          ))}
        </div>

        {categoryApps.length > 0 ? (
          <AppGrid apps={categoryApps} />
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500 text-lg">该分类暂无应用 😕</p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
