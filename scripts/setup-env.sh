#!/bin/bash

# Vidu API 环境变量设置脚本

echo "🔧 设置 Vidu API 环境变量"
echo "================================"

# 检查是否已有 .env 文件
if [ -f ".env" ]; then
    echo "⚠️  发现已存在的 .env 文件"
    read -p "是否要覆盖？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 操作已取消"
        exit 1
    fi
fi

# 获取 API Key
echo "请输入你的 Vidu API Key:"
read -s VIDU_API_KEY

if [ -z "$VIDU_API_KEY" ]; then
    echo "❌ API Key 不能为空"
    exit 1
fi

# 获取基础 URL
echo "请输入 API 基础地址 (默认: https://api.vidu.cn):"
read VIDU_API_BASE_URL
VIDU_API_BASE_URL=${VIDU_API_BASE_URL:-"https://api.vidu.cn"}

# 获取超时时间
echo "请输入请求超时时间，单位毫秒 (默认: 30000):"
read VIDU_API_TIMEOUT
VIDU_API_TIMEOUT=${VIDU_API_TIMEOUT:-"30000"}

# 创建 .env 文件
cat > .env << EOF
# Vidu API 配置
VIDU_API_KEY=$VIDU_API_KEY
VIDU_API_BASE_URL=$VIDU_API_BASE_URL
VIDU_API_TIMEOUT=$VIDU_API_TIMEOUT

# 开发环境配置
NODE_ENV=development
EOF

echo "✅ 环境变量已保存到 .env 文件"
echo "📋 配置内容:"
echo "   API Key: ${VIDU_API_KEY:0:8}..."
echo "   基础地址: $VIDU_API_BASE_URL"
echo "   超时时间: ${VIDU_API_TIMEOUT}ms"

# 设置环境变量到当前会话
export VIDU_API_KEY=$VIDU_API_KEY
export VIDU_API_BASE_URL=$VIDU_API_BASE_URL
export VIDU_API_TIMEOUT=$VIDU_API_TIMEOUT

echo ""
echo "🚀 现在可以运行测试脚本了:"
echo "   node scripts/simple-test.js"
echo "   node scripts/test-vidu-api.js"
echo ""
echo "💡 提示: 重新打开终端时需要重新运行此脚本，或者将环境变量添加到 ~/.bashrc 或 ~/.zshrc"
