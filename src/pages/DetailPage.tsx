import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import appsData from '../data/apps.json';
import { fetchReadme } from '../services/github';
import { useGitHubAppsContext } from '../context/GitHubAppsContext';
import type { AppInfo } from '../types';

function safeValue<T>(val: T | undefined | null, fallback: T): T {
  return val !== undefined && val !== null ? val : fallback;
}

function RelatedApps({ current, all }: { current: AppInfo; all: AppInfo[] }) {
  const related = useMemo(() => {
    const tags = current.tags || [];
    return all
      .filter(a => a.id !== current.id)
      .map(a => ({
        ...a,
        score: (a.tags || []).filter(t => tags.includes(t)).length * 2 +
               (a.category === current.category ? 3 : 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [current, all]);

  if (related.length === 0) return null;

  return (
    <motion.div
      className="border-t border-gray-200/50 mt-12 pt-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📎 相关应用</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map(app => (
          <Link key={app.id} to={`/app/${app.id}`} className="block">
            <motion.div
              className="glass rounded-xl p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={app.icon}
                  alt={app.name}
                  className="w-8 h-8 rounded-lg object-cover"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{app.name}</h3>
                  <p className="text-xs text-gray-400">@{app.author}</p>
                </div>
                <span className="text-xs text-yellow-600">⭐ {(app.stars / 1000).toFixed(1)}k</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allApps, loading } = useGitHubAppsContext();

  const app = useMemo<AppInfo | null>(() => {
    if (!id) return null;
    const localApp = (appsData as AppInfo[]).find((a) => a.id === id);
    if (localApp) return localApp;
    return allApps.find((a) => a.id === id) || null;
  }, [id, allApps]);

  const [readme, setReadme] = useState<string>('');
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [readmeError, setReadmeError] = useState<string | null>(null);
  const [iconError, setIconError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setReadme('');
    setReadmeError(null);
    setIconError(false);

    if (!app?.repoUrl) return;

    setReadmeLoading(true);
    let cancelled = false;
    fetchReadme(app.repoUrl)
      .then(text => { if (!cancelled) setReadme(text); })
      .catch(err => { if (!cancelled) setReadmeError(err.message || '加载 README 失败'); })
      .finally(() => { if (!cancelled) setReadmeLoading(false); });
    return () => { cancelled = true; };
  }, [app?.repoUrl]);

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-gray-500 mb-6">应用未找到</p>
          <Link to="/discover" className="text-purple-600 hover:underline">返回首页</Link>
        </div>
      </div>
    );
  }

  if (loading && !app) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-gray-500 mb-6">应用未找到</p>
          <Link to="/discover" className="text-purple-600 hover:underline">返回首页</Link>
        </div>
      </div>
    );
  }

  const displayName = safeValue(app.name, '未命名');
  const displayAuthor = safeValue(app.author, 'unknown');
  const displayLongDesc = safeValue(app.longDescription, '暂无详细介绍');
  const displayStars = safeValue(app.stars, 0);
  const displayCategory = safeValue(app.category, '其他');
  const displayTags = safeValue(app.tags, []);
  const displayIcon = safeValue(app.icon, '');
  const displayRepoUrl = safeValue(app.repoUrl, '#');
  const displayDownloadUrl = safeValue(app.downloadUrl, '#');

  return (
    <motion.main
      className="min-h-screen pt-24 pb-20 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>{displayName} - WeHub</title>
        <meta name="description" content={displayLongDesc.slice(0, 160)} />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <motion.button
          onClick={() => navigate(-1)}
          className="glass px-4 py-2 rounded-xl text-gray-500 hover:text-gray-900 mb-8 inline-flex items-center gap-2"
          whileHover={{ x: -4 }}
        >
          ← 返回
        </motion.button>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <motion.div
            className="w-24 h-24 rounded-3xl bg-gray-100 overflow-hidden ring-1 ring-gray-200 flex-shrink-0"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {displayIcon && !iconError ? (
              <img src={displayIcon} alt={displayName} className="w-full h-full object-cover" onError={() => setIconError(true)} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                {displayName[0]}
              </div>
            )}
          </motion.div>

          <div className="flex-1">
            <motion.h1
              className="text-4xl md:text-5xl font-black text-gray-900 mb-3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {displayName}
            </motion.h1>
            <motion.p
              className="text-gray-500 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              by <span className="text-purple-600">@{displayAuthor}</span>
            </motion.p>

            <div className="flex flex-wrap gap-3 mb-4">
              <span className="glass px-4 py-2 rounded-full text-sm font-medium text-yellow-400 flex items-center gap-1.5">
                ⭐ {displayStars >= 1000 ? `${(displayStars / 1000).toFixed(1)}k` : displayStars} Stars
              </span>
              <span className="glass px-4 py-2 rounded-full text-sm font-medium text-purple-600">
                {displayCategory}
              </span>
              {displayTags.map((tag) => (
                <span key={tag} className="glass px-4 py-2 rounded-full text-sm text-gray-500">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          className="glass rounded-2xl p-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">📖 简介</h2>
          <p className="text-gray-600 leading-relaxed text-lg">{displayLongDesc}</p>
        </motion.div>

        {(readme || readmeLoading || readmeError) && (
          <motion.div
            className="glass rounded-2xl p-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">📋 GitHub README</h2>
            {readmeLoading ? (
              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin" />
                正在加载 README...
              </div>
            ) : readmeError ? (
              <p className="text-gray-500">{readmeError}</p>
            ) : (
              <div className="markdown-body overflow-x-auto rounded-lg bg-gray-100/50 p-6 max-h-[500px] overflow-y-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
                <p className="text-gray-400 mt-4 pt-4 border-t border-gray-200 text-sm">
                  <a href={displayRepoUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                    在 GitHub 查看完整内容 →
                  </a>
                </p>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.a
            href={displayDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold text-lg py-4 px-8 rounded-2xl text-center shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            📥 下载最新版本
          </motion.a>
          <motion.a
            href={displayRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 glass text-gray-900 font-bold text-lg py-4 px-8 rounded-2xl text-center hover:bg-gray-100/50 transition-all duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            🔗 查看源代码
          </motion.a>
        </motion.div>

        <RelatedApps current={app} all={allApps} />
      </div>
    </motion.main>
  );
}
