# 🚀 图片搜索网站部署指南

## 🎯 项目简介

这是一个基于React + TypeScript + Vite构建的智能图片搜索网站，使用Unsplash API提供高质量的图片搜索服务。

## 📋 部署前准备

### 1. 配置API密钥

**方法1：环境变量（推荐）**
```bash
# 在项目根目录创建.env文件
echo "VITE_UNSPLASH_API_KEY=你的实际API密钥" > .env
```

**方法2：直接修改代码**
编辑 `src/config/api.ts` 文件，将API密钥直接填入。

### 2. 获取Unsplash API密钥
- 访问 [Unsplash开发者页面](https://unsplash.com/developers)
- 注册免费账号
- 创建新应用
- 复制Client ID

## 🔨 构建项目

### 使用构建脚本（推荐）
```bash
./scripts/build-deploy.sh
```

### 手动构建
```bash
npm install
npm run build
```

构建成功后，所有文件会在 `dist/` 目录中。

## 🌐 部署选项

### 1. Vercel（推荐，免费且简单）

1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 点击"New Project"
4. 导入你的GitHub仓库
5. 设置环境变量：
   - 名称：`VITE_UNSPLASH_API_KEY`
   - 值：你的Unsplash API密钥
6. 点击"Deploy"

**优点：**
- 完全免费
- 自动部署
- 全球CDN
- 自动HTTPS

### 2. Netlify（免费且功能丰富）

1. 访问 [netlify.com](https://netlify.com)
2. 拖拽 `dist` 文件夹到部署区域
3. 设置环境变量（在Site settings > Environment variables中）
4. 获得一个免费的域名

**优点：**
- 免费计划很慷慨
- 支持表单处理
- 自动HTTPS
- 自定义域名

### 3. GitHub Pages（免费，适合开源项目）

1. 在GitHub仓库设置中启用Pages
2. 选择 `gh-pages` 分支作为源
3. 将构建文件推送到该分支

### 4. 其他静态托管服务

- **Cloudflare Pages**：免费，性能优秀
- **Firebase Hosting**：Google提供，免费额度大
- **阿里云OSS**：国内访问快，有免费额度

## 🔧 环境变量配置

### 本地开发
```bash
# 创建.env文件
VITE_UNSPLASH_API_KEY=你的API密钥
```

### 生产环境
在部署平台中设置环境变量：
- 名称：`VITE_UNSPLASH_API_KEY`
- 值：你的实际Unsplash API密钥

## 📱 自定义域名

部署成功后，你可以：
1. 在部署平台中设置自定义域名
2. 配置DNS解析
3. 启用HTTPS（大多数平台自动提供）

## 🚨 注意事项

1. **API密钥安全**：不要在代码中硬编码API密钥
2. **CORS问题**：Unsplash API支持跨域请求，无需额外配置
3. **请求限制**：Unsplash免费版每天1000次请求
4. **图片版权**：所有图片来自Unsplash，可免费商用

## 🎉 部署完成

部署成功后，你的图片搜索网站就可以：
- 接受用户搜索请求
- 调用Unsplash API获取图片
- 展示高质量的搜索结果
- 提供图片下载链接

## 🆘 常见问题

**Q: 部署后搜索功能不工作？**
A: 检查API密钥是否正确配置，环境变量是否设置

**Q: 图片加载很慢？**
A: 这是正常的，图片来自Unsplash服务器，可以考虑添加加载动画

**Q: 如何添加更多功能？**
A: 可以添加图片分类、收藏功能、历史记录等

---

**恭喜！** 🎊 你已经成功部署了一个完整的图片搜索网站！
