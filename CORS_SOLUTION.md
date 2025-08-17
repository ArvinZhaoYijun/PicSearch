# Vidu API 调试工具 - CORS 问题解决方案

## 问题描述

当在浏览器中使用 API 调试工具时，可能会遇到 "Failed to fetch" 错误，这通常是由于 CORS (跨域资源共享) 策略限制导致的。

## 解决方案

### 1. 使用浏览器扩展禁用 CORS（推荐用于开发测试）

#### Chrome 浏览器
1. 安装 "CORS Unblock" 扩展
2. 启用扩展
3. 刷新页面

#### Firefox 浏览器
1. 安装 "CORS Everywhere" 扩展
2. 启用扩展
3. 刷新页面

### 2. 使用 Node.js 测试脚本（绕过 CORS）

我们已经创建了一个 Node.js 测试脚本，可以绕过浏览器的 CORS 限制：

```bash
# 设置 API Key（可选）
export VIDU_API_KEY="your_api_key_here"

# 运行测试脚本
node scripts/test-cors.mjs
```

### 3. 使用代理服务器

如果你有自己的服务器，可以设置代理来转发请求：

```javascript
// 示例代理配置
const proxyUrl = "https://your-proxy-server.com/api";
const targetUrl = "https://api.vidu.cn/ent/v2/reference2image";

// 通过代理发送请求
fetch(proxyUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ targetUrl, ...payload })
});
```

## API 端点说明

- **健康检查**: 目前 Vidu API 没有公开的健康检查端点
- **图片生成**: `/ent/v2/reference2image` - 需要有效的 API Key

## 常见错误码

- **401 Unauthorized**: API Key 无效或缺失
- **404 Not Found**: 请求的端点不存在
- **Failed to fetch**: 通常是 CORS 问题或网络连接问题

## 调试步骤

1. 检查浏览器控制台的错误信息
2. 确认 API Key 是否正确设置
3. 验证网络连接是否正常
4. 使用 Node.js 测试脚本验证 API 连接
5. 检查 API 文档确认端点路径

## 联系支持

如果问题仍然存在，请联系 Vidu API 支持团队确认：
- API 端点配置
- CORS 策略设置
- API Key 权限验证
