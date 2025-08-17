#!/bin/bash

# 快速启动 Vidu API 调试工具

echo "🚀 启动 Vidu API 调试工具"
echo "================================"

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 检查是否有 .env 文件
if [ ! -f ".env" ]; then
    echo "⚠️  未找到 .env 文件"
    echo "🔧 正在设置环境变量..."
    ./scripts/setup-env.sh
fi

# 启动开发服务器
echo "🌐 启动开发服务器..."
echo "📱 调试工具将在以下地址可用:"
echo "   - 主页: http://localhost:5173"
echo "   - API调试: http://localhost:5173/api-debug"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "================================"

npm run dev
