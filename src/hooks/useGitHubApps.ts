import { useState, useEffect, useMemo } from 'react';
import { fetchTrendingApps } from '../services/github';
import type { AppInfo } from '../types';
import appsData from '../data/apps.json';

export function useGitHubApps() {
  const [ghApps, setGhApps] = useState<AppInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTrendingApps()
      .then(data => {
        if (!cancelled) {
          setGhApps(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message || '获取 GitHub 数据失败');
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const allApps = useMemo<AppInfo[]>(() => {
    const local = appsData as AppInfo[];
    const localNames = new Set(local.map(a => a.name));
    return [...local, ...ghApps.filter(gh => !localNames.has(gh.name))];
  }, [ghApps]);

  return { allApps, loading, error };
}
