# Vidu API 调试完整指南

## 🎯 问题描述

你的项目使用 Vidu 图片生成 API，但一直调试不成功。我已经为你创建了完整的调试工具集来帮助解决这个问题。

## 🛠️ 调试工具概览

### 1. 网页版调试工具 (`/api-debug`)
- 图形化界面，易于使用
- 实时查看API响应
- 支持多种测试场景

### 2. 命令行调试工具
- `simple-test.js`: 基础连接测试
- `test-vidu-api.js`: 完整功能测试
- 适合自动化测试和CI/CD

### 3. 环境配置工具
- `setup-env.sh`: 自动设置环境变量
- `quick-debug.sh`: 一键启动调试环境

## 🚀 快速开始

### 方法1: 一键启动（推荐）
```bash
./scripts/quick-debug.sh
```

### 方法2: 手动启动
```bash
# 1. 设置环境变量
./scripts/setup-env.sh

# 2. 启动开发服务器
npm run dev

# 3. 访问调试页面
# http://localhost:5173/api-debug
```

### 方法3: 命令行测试
```bash
# 设置环境变量
export VIDU_API_KEY="your_api_key_here"

# 基础连接测试
node scripts/simple-test.js

# 完整功能测试
node scripts/test-vidu-api.js
```

## 🔍 调试步骤

### 第一步：基础连接测试
1. 访问 `/api-debug` 页面
2. 输入你的 Vidu API Key
3. 点击"测试基础连接"按钮
4. 查看响应状态和内容

**预期结果**: 应该返回 200 状态码

**如果失败**:
- 检查网络连接
- 验证 API 地址是否正确
- 确认防火墙设置

### 第二步：API 功能测试
1. 设置测试参数（Prompt、参考图等）
2. 点击"测试图片生成 API"按钮
3. 分析响应内容

**常见响应格式**:
```json
{
  "task_id": "xxx",
  "status": "pending"
}
```

**如果返回 task_id**:
- 使用任务状态查询功能
- 等待任务完成
- 获取最终结果

### 第三步：任务状态查询
1. 复制返回的 task_id
2. 在"查询任务状态"中输入
3. 点击查询按钮
4. 重复查询直到任务完成

## 🐛 常见问题及解决方案

### 问题1: 网络连接失败
**症状**: 请求超时或连接被拒绝
**解决方案**:
```bash
# 测试网络连通性
ping api.vidu.cn

# 检查DNS解析
nslookup api.vidu.cn

# 测试HTTPS连接
curl -v https://api.vidu.cn/ent/v2/health
```

### 问题2: API Key 认证失败
**症状**: 返回 401 或 403 状态码
**解决方案**:
- 确认 API Key 格式正确
- 检查是否有相应接口的权限
- 验证 API Key 是否已过期

### 问题3: 请求参数错误
**症状**: 返回 400 状态码
**解决方案**:
- 检查必需参数是否完整
- 验证参数格式是否正确
- 参考 API 文档确认参数要求

### 问题4: 服务器内部错误
**症状**: 返回 500 状态码
**解决方案**:
- 稍后重试
- 检查 API 服务状态
- 联系技术支持

## 📊 调试信息收集

### 浏览器控制台
- 网络请求详情
- JavaScript 错误信息
- 响应数据内容

### 终端日志
- 请求/响应详情
- 错误堆栈信息
- 网络连接状态

### 响应分析
- HTTP 状态码
- 响应头信息
- 响应体内容
- 错误消息

## 🔧 高级调试技巧

### 1. 使用 curl 测试
```bash
# 基础连接测试
curl -X GET "https://api.vidu.cn/ent/v2/health" \
  -H "Authorization: Token YOUR_API_KEY"

# 图片生成测试
curl -X POST "https://api.vidu.cn/ent/v2/reference2image" \
  -H "Content-Type: application/json" \
  -H "Authorization: Token YOUR_API_KEY" \
  -d '{
    "model": "viduq1",
    "images": ["https://example.com/image.jpg"],
    "prompt": "测试图片",
    "aspect_ratio": "1:1"
  }'
```

### 2. 使用 Postman 测试
- 导入 API 集合
- 设置环境变量
- 批量测试接口

### 3. 网络抓包分析
- 使用浏览器开发者工具
- 分析请求/响应详情
- 检查网络延迟

## 📋 检查清单

在开始调试前，请确认：

- [ ] 已获取有效的 Vidu API Key
- [ ] 网络连接正常
- [ ] 防火墙允许 HTTPS 连接
- [ ] API 地址正确
- [ ] 请求参数完整且格式正确

## 🆘 获取帮助

如果问题仍然存在：

1. **收集调试信息**:
   - 错误截图
   - 控制台日志
   - 网络请求详情

2. **检查官方文档**:
   - Vidu API 接口文档
   - 错误码说明
   - 最佳实践指南

3. **联系技术支持**:
   - 提供详细的错误信息
   - 包含调试日志
   - 说明已尝试的解决方案

## 📚 相关资源

- [Vidu API 官方文档](https://api.vidu.cn/docs)
- [项目调试工具](/api-debug)
- [API 测试脚本](scripts/)
- [环境配置说明](API_DEBUG_README.md)

---

**记住**: 调试是一个逐步的过程，从基础连接开始，逐步测试各个功能模块。保持耐心，仔细分析每个错误信息，你一定能找到问题的根源！
