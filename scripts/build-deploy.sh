#!/bin/bash

echo "🚀 开始构建图片搜索网站..."

# 检查环境变量
if [ -z "$VITE_UNSPLASH_API_KEY" ]; then
    echo "⚠️  警告: 未设置VITE_UNSPLASH_API_KEY环境变量"
    echo "💡 提示: 请设置你的Unsplash API密钥"
    echo "   方法1: export VITE_UNSPLASH_API_KEY=你的密钥"
    echo "   方法2: 在项目根目录创建.env文件"
    echo ""
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    echo ""
    echo "📁 构建文件位置: dist/"
    echo "🌐 可以部署到以下平台:"
    echo "   • Vercel (推荐): 拖拽dist文件夹到vercel.com"
    echo "   • Netlify: 拖拽dist文件夹到netlify.com"
    echo "   • GitHub Pages: 将dist内容推送到gh-pages分支"
    echo "   • 任何静态文件托管服务"
    echo ""
    echo "💡 本地预览: npm run preview"
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi
