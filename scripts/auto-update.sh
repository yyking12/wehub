#!/bin/bash
# auto-update.sh - 定时自动更新脚本
# 放到 crontab 中运行

DEPLOY_DIR="/opt/wehub"
NODE_DIR="/d/node-v22.15.0-win-x64"

cd "$DEPLOY_DIR"

# 拉取最新代码
git fetch origin main

# 检查是否有更新
if ! git diff --quiet HEAD origin/main; then
    echo "[$(date)] 发现更新，开始部署..."

    git pull origin main

    # 找到 npm
    if command -v npm &> /dev/null; then
        NPM_CMD="npm"
    elif [ -f "$NODE_DIR/npm" ]; then
        NPM_CMD="$NODE_DIR/npm"
    else
        echo "[$(date)] 错误: 未找到 npm"
        exit 1
    fi

    $NPM_CMD install --silent 2>&1
    $NPM_CMD run build 2>&1

    echo "[$(date)] 更新完成"

    # 如果之前启动了开发服务器，重启它
    PM2_PID=$(pgrep -f "npm run dev" || true)
    if [ -n "$PM2_PID" ]; then
        kill $PM2_PID
        sleep 2
        cd "$DEPLOY_DIR"
        nohup $NPM_CMD run dev > /dev/null 2>&1 &
        echo "[$(date)] 已重启开发服务器"
    fi
else
    echo "[$(date)] 已是最新，无需更新"
fi
