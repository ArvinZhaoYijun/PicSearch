#!/bin/bash

echo "🚀 一键部署脚本 - 图片搜索网站"
echo "=================================="
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查是否已构建
if [ ! -d "dist" ]; then
    echo "📦 正在构建项目..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ 构建失败，请检查错误信息"
        exit 1
    fi
    echo "✅ 构建成功！"
fi

echo ""
echo "🌐 部署选项："
echo "1. Vercel (推荐) - 免费、快速、自动部署"
echo "2. Netlify - 免费、功能丰富"
echo "3. GitHub Pages - 免费、适合开源项目"
echo "4. 手动部署 - 上传到任何静态托管服务"
echo ""

read -p "请选择部署方式 (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🎯 选择Vercel部署"
        echo "=================="
        echo "请按以下步骤操作："
        echo ""
        echo "1. 访问 https://vercel.com"
        echo "2. 使用GitHub账号登录"
        echo "3. 点击 'New Project'"
        echo "4. 选择你的GitHub仓库"
        echo "5. 配置项目："
        echo "   - Framework Preset: Vite"
        echo "   - Output Directory: dist"
        echo "6. 设置环境变量："
        echo "   - Name: VITE_UNSPLASH_API_KEY"
        echo "   - Value: KXAsMXCrmoYKrA_ktmdVoCrAvq8_4PvUMVK4IxPAnsM"
        echo "7. 点击 'Deploy'"
        echo ""
        echo "💡 提示：如果没有GitHub仓库，先运行 ./scripts/setup-github.sh"
        ;;
    2)
        echo ""
        echo "🎯 选择Netlify部署"
        echo "=================="
        echo "请按以下步骤操作："
        echo ""
        echo "1. 访问 https://netlify.com"
        echo "2. 拖拽 dist/ 文件夹到部署区域"
        echo "3. 等待部署完成"
        echo "4. 获得免费域名"
        echo ""
        echo "💡 提示：Netlify也支持从GitHub自动部署"
        ;;
    3)
        echo ""
        echo "🎯 选择GitHub Pages部署"
        echo "======================="
        echo "请按以下步骤操作："
        echo ""
        echo "1. 在GitHub仓库设置中启用Pages"
        echo "2. 选择 gh-pages 分支作为源"
        echo "3. 将dist内容推送到该分支"
        echo ""
        echo "💡 提示：需要先设置GitHub仓库，运行 ./scripts/setup-github.sh"
        ;;
    4)
        echo ""
        echo "🎯 选择手动部署"
        echo "================="
        echo "构建文件位置: dist/"
        echo ""
        echo "你可以将dist/文件夹内容上传到："
        echo "- 阿里云OSS"
        echo "- 腾讯云COS"
        echo "- 七牛云"
        echo "- 任何支持静态文件的托管服务"
        ;;
    *)
        echo "❌ 无效选择，请重新运行脚本"
        exit 1
        ;;
esac

echo ""
echo "🎉 部署指南已显示完成！"
echo ""
echo "📁 构建文件位置: dist/"
echo "🔑 API密钥已配置: KXAsMXCrmoYKrA_ktmdVoCrAvq8_4PvUMVK4IxPAnsM"
echo ""
echo "💡 如果遇到问题，请查看："
echo "   - QUICK_DEPLOY.md (Vercel详细指南)"
echo "   - GITHUB_SETUP.md (GitHub设置指南)"
echo "   - DEPLOY_GUIDE.md (完整部署指南)"
echo ""
echo "🚀 祝你部署成功！"
