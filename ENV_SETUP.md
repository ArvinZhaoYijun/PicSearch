# 🔑 环境变量配置说明

## 设置API密钥

为了安全起见，API密钥通过环境变量配置。请按以下步骤操作：

### 方法1：创建 .env 文件（推荐）

1. 在项目根目录创建 `.env` 文件
2. 添加以下内容：

```bash
VITE_UNSPLASH_API_KEY=你的实际Unsplash_API密钥
```

### 方法2：直接修改配置文件

如果不想使用环境变量，可以直接修改 `src/config/api.ts` 文件：

```typescript
export const API_CONFIG = {
  UNSPLASH: {
    API_KEY: '你的实际Unsplash_API密钥', // 直接在这里填入
    // ... 其他配置
  }
}
```

## 获取Unsplash API密钥

1. 访问 [Unsplash开发者页面](https://unsplash.com/developers)
2. 注册免费账号
3. 创建新应用
4. 复制Client ID（这就是你的API密钥）

## 安全提醒

- 不要将包含真实API密钥的文件提交到Git
- 如果使用Git，确保 `.env` 文件在 `.gitignore` 中
- 生产环境建议使用环境变量管理API密钥

## 验证配置

启动项目后，如果看到"API配置无效"的错误，说明需要正确配置API密钥。
