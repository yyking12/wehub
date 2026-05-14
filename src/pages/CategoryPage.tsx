import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import AppGrid from '../components/AppGrid';
import { useGitHubAppsContext } from '../context/GitHubAppsContext';

const categoryLabels: Record<string, string> = {
  proxy: '🔒 网络代理',
  graalvm: '☕ GraalVM',
  'android-architecture': '🏗️ 架构设计',
  accessibility: '♿ 无障碍',
  shadowsocks: '🔒 Shadowsocks',
  java: '☕ Java',
  'jetpack-compose': '🖌️ Jetpack Compose',
  'f-droid': '📦 F-Droid',
  api: '🔌 API 工具',
  'android-library': '📚 Android 库',
  architecture: '🏗️ 架构',
  gfw: '🔒 网络工具',
  kotlin: '💜 Kotlin',
  alert: '🔔 对话框',
  awt: '🖥️ 跨平台 UI',
  ani: '🎬 番剧动画',
  kernel: '⚙️ 内核工具',
  'blackbox-testing': '🧪 自动化测试',
  communication: '💬 通讯工具',
  desktop: '🖥️ 桌面应用',
  ai: '🤖 AI 工具',
  androidx: '📱 AndroidX',
  'android-development': '📱 Android 开发',
};

function safeDecode(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

export default function CategoryPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
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

  const recommendations = useMemo(() => {
    if (categoryApps.length <= 3) {
      const relatedTags = categoryApps.flatMap(a => a.tags || []).slice(0, 5);
      return allApps
        .filter(a => a.category !== decodedName && (a.tags || []).some(t => relatedTags.includes(t)))
        .slice(0, 6);
    }
    return [];
  }, [categoryApps, allApps, decodedName]);

  const displayLabel = categoryLabels[decodedName] || `📂 ${decodedName}`;

  return (
    <main className="pt-24 pb-20">
      <Helmet>
        <title>{displayLabel} - WeHub</title>
        <meta name="description" content={`WeHub 分类：${displayLabel}，共 ${categoryApps.length} 个应用`} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <Link
            to="/discover"
            className="text-gray-500 hover:text-purple-600 text-sm transition-colors"
          >
            ← 返回首页
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 mb-2">
            {displayLabel}
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
                {categoryLabels[cat] || cat}
              </motion.span>
            </Link>
          ))}
        </div>

        {categoryApps.length > 0 ? (
          <AppGrid apps={categoryApps} onTagClick={(tag) => navigate(`/discover?tag=${encodeURIComponent(tag)}`)} />
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500 text-lg">该分类暂无应用 😕</p>
          </motion.div>
        )}

        {categoryApps.length <= 3 && recommendations.length > 0 && (
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 你可能也会喜欢</h2>
            <AppGrid apps={recommendations} onTagClick={(tag) => navigate(`/discover?tag=${encodeURIComponent(tag)}`)} />
          </motion.div>
        )}
      </div>
    </main>
  );
}
