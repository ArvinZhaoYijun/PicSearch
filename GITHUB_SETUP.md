# 📚 GitHub仓库设置指南

## 🎯 为什么要用GitHub？
- Vercel可以直接从GitHub部署
- 自动更新：每次推送代码自动重新部署
- 版本控制：可以回滚到之前的版本
- 协作开发：其他人可以贡献代码

## 🚀 快速设置步骤

### 步骤1：创建GitHub账号
1. 访问 [github.com](https://github.com)
2. 点击 "Sign up"
3. 填写用户名、邮箱、密码
4. 验证邮箱

### 步骤2：创建新仓库
1. 登录后，点击右上角 "+" 号
2. 选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `image-search-app`（或你喜欢的名字）
   - **Description**: `智能图片搜索网站 - 基于React + Unsplash API`
   - **Visibility**: 选择 `Public`（推荐）或 `Private`
   - **不要勾选** "Add a README file"（我们已经有文件了）
4. 点击 "Create repository"

### 步骤3：上传代码到GitHub
在终端中执行以下命令：

```bash
# 进入项目目录（如果还没有进入）
cd /Users/bytedance/Downloads/vidu-spark-main

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 创建第一次提交
git commit -m "Initial commit: 图片搜索网站"

# 添加远程仓库（替换YOUR_USERNAME为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/image-search-app.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 步骤4：设置Git忽略文件
创建 `.gitignore` 文件，避免上传敏感信息：

```bash
# 创建.gitignore文件
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity
EOF
```

## 🔐 安全提醒

### 重要：保护API密钥
- ✅ 已经将API密钥硬编码在代码中（仅用于演示）
- ⚠️ 生产环境建议使用环境变量
- 🚫 不要将真实的API密钥提交到公开仓库

### 如果使用环境变量
```bash
# 在GitHub仓库设置中添加Secrets
# Settings > Secrets and variables > Actions > New repository secret
# Name: VITE_UNSPLASH_API_KEY
# Value: 你的实际API密钥
```

## 🌐 现在可以部署了！

完成GitHub设置后：
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 选择你的仓库
4. 按照部署指南完成部署

## 🎉 优势

使用GitHub + Vercel的组合：
- **完全免费**：无需支付任何费用
- **自动部署**：代码推送后自动更新网站
- **版本控制**：可以查看所有修改历史
- **专业展示**：GitHub是程序员的标准简历

---

**设置完成后，你的网站就可以自动更新了！** 🚀
