import { writeFileSync, readFileSync } from 'fs';

const GITHUB_API = 'https://api.github.com';
const SEARCH_QUERY = 'topic:android+language:kotlin';
const PER_PAGE = 30;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function calcActivityScore(updatedAt) {
  const now = new Date();
  const updated = new Date(updatedAt);
  const diffDays = (now - updated) / (1000 * 60 * 60 * 24);
  if (diffDays <= 7) return Math.round(99 - diffDays * (10 / 7));
  if (diffDays <= 30) return Math.round(89 - (diffDays - 7) * (19 / 23));
  if (diffDays <= 90) return Math.round(69 - (diffDays - 30) * (20 / 60));
  if (diffDays <= 180) return Math.round(49 - (diffDays - 90) * (20 / 90));
  return Math.max(0, Math.round(29 - (diffDays - 180) * (29 / 365)));
}

function transformRepo(repo, index) {
  return {
    id: `gh-${repo.id}`,
    name: repo.name || '未命名',
    description: repo.description || '暂无描述',
    longDescription: repo.description || '暂无详细介绍',
    stars: repo.stargazers_count || 0,
    activityScore: calcActivityScore(repo.updated_at || new Date().toISOString()),
    category: (repo.topics || []).find(t => t !== 'android') || '其他',
    tags: (repo.topics || []).filter(t => t !== 'android').slice(0, 3),
    author: repo.owner?.login || 'unknown',
    repoUrl: repo.html_url || '',
    downloadUrl: `${repo.html_url}/releases/latest`,
    icon: repo.owner?.avatar_url || '',
    screenshots: [],
    featured: index < 10,
    createdAt: repo.created_at || new Date().toISOString(),
  };
}

async function main() {
  console.log('开始获取 GitHub 热门 Android 项目...');

  try {
    const response = await fetch(
      `${GITHUB_API}/search/repositories?q=${SEARCH_QUERY}&sort=stars&order=desc&per_page=${PER_PAGE}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const json = await response.json();
    if (!json.items || !Array.isArray(json.items)) {
      throw new Error('API 返回数据格式异常');
    }

    const newApps = json.items.map(transformRepo);

    let existingApps = [];
    try {
      const raw = readFileSync('src/data/apps.json', 'utf-8');
      existingApps = JSON.parse(raw);
    } catch (e) {
      console.warn('读取现有 apps.json 失败，将创建新文件');
    }

    const localApps = existingApps.filter(app => !app.id.startsWith('gh-'));
    const mergedApps = [...localApps, ...newApps];

    writeFileSync('src/data/apps.json', JSON.stringify(mergedApps, null, 2) + '\n', 'utf-8');

    console.log(`✅ 更新完成！共 ${mergedApps.length} 个应用（本地 ${localApps.length} + GitHub ${newApps.length}）`);
  } catch (error) {
    console.error('❌ 更新失败:', error.message);
    process.exit(1);
  }
}

main();
