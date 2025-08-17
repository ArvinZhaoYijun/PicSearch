#!/bin/bash

echo "🚀 快速启动API测试项目..."
echo ""

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
    echo ""
fi

echo "🌐 启动开发服务器..."
echo "📱 访问地址: http://localhost:5173"
echo "🔗 API测试页面: http://localhost:5173/api-test"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 启动开发服务器
npm run dev
