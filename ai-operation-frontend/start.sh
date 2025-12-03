#!/bin/bash

echo "================================"
echo "AI自动运营系统 - 前端项目启动"
echo "================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null
then
    echo "❌ 未检测到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo ""

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    echo ""
fi

echo "🚀 启动开发服务器..."
echo ""
echo "项目将在 http://localhost:3000 启动"
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev
