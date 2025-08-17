#!/bin/bash

echo "🚀 启动 Vidu API 调试工具..."
echo ""

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 启动开发服务器
echo "�� 启动开发服务器..."
echo "⏳ 等待服务器启动..."

# 在后台启动开发服务器并捕获输出
npm run dev > /tmp/vite-output.log 2>&1 &
VITE_PID=$!

# 等待服务器启动
sleep 5

# 从日志中提取实际端口
ACTUAL_PORT=$(grep -o "Local:.*http://localhost:[0-9]*" /tmp/vite-output.log | grep -o "[0-9]*" | tail -1)

if [ -n "$ACTUAL_PORT" ]; then
    echo "✅ 开发服务器启动成功！"
    echo "🌐 请在浏览器中访问: http://localhost:${ACTUAL_PORT}/simple-test"
    echo ""
    echo "💡 提示:"
    echo "   - 如果遇到 CORS 错误，请安装浏览器扩展禁用 CORS"
    echo "   - 或者使用 Node.js 测试脚本: node scripts/test-cors.mjs"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    
    # 保持脚本运行并监控服务器状态
    while kill -0 $VITE_PID 2>/dev/null; do
        sleep 2
    done
else
    echo "❌ 无法检测到服务器端口"
    echo "请手动检查服务器状态"
    exit 1
fi
