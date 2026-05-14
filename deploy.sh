#!/bin/bash
# deploy.sh - 在服务器上首次部署时运行
# 用法: chmod +x deploy.sh && ./deploy.sh /path/to/deploy

set -e

DEPLOY_DIR="${1:-/opt/wehub}"
REPO_URL="https://github.com/yyking12/wehub.git"
NODE_DIR="/d/node-v22.15.0-win-x64"

echo "🚀 WeHub 部署脚本"
echo "=================="
echo "部署目录: $DEPLOY_DIR"
echo ""

# 创建部署目录
mkdir -p "$DEPLOY_DIR"

# 克隆仓库
if [ -d "$DEPLOY_DIR/.git" ]; then
    echo "📦 已存在仓库，执行更新..."
    cd "$DEPLOY_DIR"
    git pull origin main
else
    echo "📥 克隆仓库..."
    git clone "$REPO_URL" "$DEPLOY_DIR"
    cd "$DEPLOY_DIR"
fi

# 找到 npm 可执行文件
if command -v npm &> /dev/null; then
    NPM_CMD="npm"
elif [ -f "$NODE_DIR/npm.cmd" ]; then
    NPM_CMD="$NODE_DIR/npm.cmd"
elif [ -f "$NODE_DIR/npm" ]; then
    NPM_CMD="$NODE_DIR/npm"
else
    echo "❌ 未找到 npm，请先安装 Node.js"
    exit 1
fi

echo "📦 安装依赖..."
$NPM_CMD install

echo "🔨 构建项目..."
$NPM_CMD run build

echo ""
echo "✅ 部署完成！"
echo "运行 npm run dev 启动开发服务器"
echo "或在生产环境使用: $NPM_CMD run preview"
