# Vidu API 调试工具使用说明

## 概述

这个项目包含了专门的 Vidu 图片生成 API 调试工具，帮助你独立测试和排查 API 问题。

## 调试工具

### 1. 网页版调试工具

访问 `/api-debug` 路径，使用图形化界面调试 API：

- **API 配置**: 设置基础URL、API Key等
- **测试功能**: 测试基础连接、图片生成API、任务状态查询
- **响应查看**: 实时查看API响应内容、状态码、响应头
- **参数调整**: 灵活调整测试参数

### 2. 命令行调试工具

使用 Node.js 脚本在终端中测试 API：

```bash
# 设置环境变量
export VIDU_API_KEY="your_api_key_here"

# 运行测试
node scripts/test-vidu-api.js
```

## 使用方法

### 网页版调试

1. 启动开发服务器：`npm run dev`
2. 访问：`http://localhost:5173/api-debug`
3. 输入你的 Vidu API Key
4. 点击测试按钮进行调试

### 命令行调试

1. 设置环境变量：
   ```bash
   export VIDU_API_KEY="your_api_key_here"
   ```

2. 运行测试脚本：
   ```bash
   node scripts/test-vidu-api.js
   ```

## 常见问题排查

### 1. API Key 问题
- 确认 API Key 格式正确
- 检查是否有权限访问相应接口
- 验证 API Key 是否已过期

### 2. 网络连接问题
- 检查防火墙设置
- 确认网络代理配置
- 验证 DNS 解析

### 3. 请求格式问题
- 检查 Content-Type 头
- 验证请求体 JSON 格式
- 确认必需参数是否完整

### 4. 响应处理问题
- 查看响应状态码
- 检查响应头信息
- 分析错误响应内容

## API 接口说明

### 基础连接测试
- **端点**: `GET /ent/v2/health`
- **用途**: 测试API服务是否可用
- **认证**: 可选

### 图片生成API
- **端点**: `POST /ent/v2/reference2image`
- **用途**: 基于参考图生成新图片
- **认证**: 必需
- **参数**:
  - `model`: 模型名称 (如: viduq1)
  - `images`: 参考图片数组
  - `prompt`: 生成提示词
  - `aspect_ratio`: 宽高比
  - `seed`: 随机种子

### 任务状态查询
- **端点**: `GET /ent/v2/tasks/{task_id}`
- **用途**: 查询异步任务状态
- **认证**: 必需

## 调试建议

1. **逐步测试**: 先测试基础连接，再测试具体功能
2. **参数验证**: 确保所有必需参数都正确设置
3. **错误分析**: 仔细分析错误响应，查找具体问题
4. **日志记录**: 查看浏览器控制台和终端输出的详细信息
5. **文档参考**: 参考 Vidu API 官方文档确认接口规范

## 环境变量配置

创建 `.env` 文件（参考 `.env.example`）：

```bash
VIDU_API_KEY=your_vidu_api_key_here
VIDU_API_BASE_URL=https://api.vidu.cn
VIDU_API_TIMEOUT=30000
```

## 技术支持

如果遇到问题：

1. 检查浏览器控制台错误信息
2. 查看终端输出日志
3. 确认网络连接和防火墙设置
4. 验证 API Key 和权限设置
5. 参考 Vidu API 官方文档
