import type { AppInfo } from '../types';

const GITHUB_API = 'https://api.github.com';
const SEARCH_QUERY = 'topic:android+language:kotlin';
export const CACHE_KEY = 'wehub_github_data_v3';
const CACHE_DURATION = 30 * 60 * 1000;

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  owner: { login: string; avatar_url: string };
  html_url: string;
  topics: string[];
  updated_at: string;
  created_at: string;
  language: string | null;
  license: { spdx_id: string | null } | null;
}

function calcActivityScore(updatedAt: string): number {
  const now = new Date();
  const updated = new Date(updatedAt);
  const diffDays = (now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays <= 7) return Math.round(99 - diffDays * (10 / 7));
  if (diffDays <= 30) return Math.round(89 - (diffDays - 7) * (19 / 23));
  if (diffDays <= 90) return Math.round(69 - (diffDays - 30) * (20 / 60));
  if (diffDays <= 180) return Math.round(49 - (diffDays - 90) * (20 / 90));
  return Math.max(0, Math.round(29 - (diffDays - 180) * (29 / 365)));
}

function transformRepo(repo: GitHubRepo, index: number): AppInfo {
  const rawTags = Array.isArray(repo.topics) ? repo.topics : [];
  const cleanTags = rawTags
    .filter(t => typeof t === 'string' && t.length > 0 && t !== 'android')
    .map(t => t.toLowerCase().trim())
    .filter((t, i, arr) => arr.indexOf(t) === i)
    .slice(0, 5);

  return {
    id: `gh-${repo.id}`,
    name: repo.name || '未命名',
    description: repo.description || '暂无描述',
    longDescription: repo.description || '暂无详细介绍',
    stars: repo.stargazers_count || 0,
    activityScore: calcActivityScore(repo.updated_at || new Date().toISOString()),
    category: cleanTags.find(t => t !== 'android') || '其他',
    tags: cleanTags,
    author: repo.owner?.login || 'unknown',
    repoUrl: repo.html_url || '',
    downloadUrl: `${repo.html_url}/releases/latest`,
    icon: repo.owner?.avatar_url || '',
    screenshots: [],
    featured: index < 10,
    createdAt: repo.created_at || new Date().toISOString(),
    updatedAt: repo.updated_at || new Date().toISOString(),
    language: repo.language || 'Unknown',
    license: repo.license?.spdx_id || 'Unknown',
  };
}

export async function fetchTrendingApps(): Promise<AppInfo[]> {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION && Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch {
      sessionStorage.removeItem(CACHE_KEY);
    }
  }

  try {
    const response = await fetch(
      `${GITHUB_API}/search/repositories?q=${SEARCH_QUERY}&sort=stars&order=desc&per_page=20`
    );
    if (response.status === 403 || response.status === 429) {
      throw new Error('GitHub API 速率限制已超，请稍后再试');
    }
    if (!response.ok) throw new Error(`GitHub API 请求失败 (${response.status})`);

    const json = await response.json();
    if (!json.items || !Array.isArray(json.items)) throw new Error('Invalid API response');

    const apps = json.items
      .filter((repo: GitHubRepo) => repo && repo.id)
      .map((repo: GitHubRepo, i: number) => transformRepo(repo, i));

    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: apps, timestamp: Date.now() })
    );

    return apps;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('获取 GitHub 数据时发生未知错误');
  }
}

export async function fetchReadme(repoUrl: string): Promise<string> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return '';

  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '');
  const cacheKey = `wehub_readme_${owner}_${cleanRepo}`;

  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 2 * 60 * 60 * 1000) {
        return data;
      }
    } catch {
      sessionStorage.removeItem(cacheKey);
    }
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${cleanRepo}/readme`,
      { headers: { Accept: 'application/vnd.github.v3.raw' } }
    );
    if (response.status === 403 || response.status === 429) {
      throw new Error('GitHub API 速率限制已超');
    }
    if (!response.ok) return '';

    const text = await response.text();

    sessionStorage.setItem(
      cacheKey,
      JSON.stringify({ data: text, timestamp: Date.now() })
    );

    return text;
  } catch (error) {
    if (error instanceof Error && error.message.includes('速率限制')) throw error;
    return '';
  }
}
