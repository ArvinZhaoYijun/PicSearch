#!/usr/bin/env node

/**
 * Vidu API 完整测试脚本
 */

import https from 'https';

// 配置
const CONFIG = {
  baseUrl: 'https://api.vidu.cn',
  apiKey: process.env.VIDU_API_KEY || '',
  timeout: 30000,
};

// 测试用例
const TEST_CASES = [
  {
    name: '健康检查',
    method: 'GET',
    path: '/ent/v2/health',
    headers: {},
    body: null,
  },
  {
    name: '图片生成API测试',
    method: 'POST',
    path: '/ent/v2/reference2image',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      model: 'viduq1',
      images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop'],
      prompt: '一只可爱的小猫',
      seed: 0,
      aspect_ratio: '1:1',
      payload: '',
    },
  },
];

// 工具函数
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(options.url);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : https; // 都使用https
    
    const requestOptions = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: options.method,
      headers: {
        ...options.headers,
        ...(CONFIG.apiKey ? { 'Authorization': `Token ${CONFIG.apiKey}` } : {}),
      },
      timeout: CONFIG.timeout,
    };

    const req = client.request(requestOptions, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        let parsedData;
        try {
          parsedData = JSON.parse(responseData);
        } catch {
          parsedData = responseData;
        }
        
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: parsedData,
          raw: responseData,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runTest(testCase) {
  console.log(`\n🧪 运行测试: ${testCase.name}`);
  console.log(`📍 请求地址: ${testCase.method} ${CONFIG.baseUrl}${testCase.path}`);
  
  if (testCase.body) {
    console.log(`📦 请求数据:`, JSON.stringify(testCase.body, null, 2));
  }
  
  try {
    const startTime = Date.now();
    const response = await makeRequest({
      url: `${CONFIG.baseUrl}${testCase.path}`,
      method: testCase.method,
      headers: testCase.headers,
    }, testCase.body);
    
    const duration = Date.now() - startTime;
    
    console.log(`⏱️  响应时间: ${duration}ms`);
    console.log(`📊 响应状态: ${response.status}`);
    console.log(`📋 响应头:`, response.headers);
    console.log(`📄 响应内容:`, JSON.stringify(response.body, null, 2));
    
    if (response.status >= 200 && response.status < 300) {
      console.log(`✅ 测试通过`);
    } else {
      console.log(`❌ 测试失败: HTTP ${response.status}`);
    }
    
    return { success: true, response, duration };
  } catch (error) {
    console.log(`💥 测试错误: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 Vidu API 测试工具');
  console.log('=' * 50);
  
  if (!CONFIG.apiKey) {
    console.log('⚠️  警告: 未设置 VIDU_API_KEY 环境变量');
    console.log('   可以通过以下方式设置:');
    console.log('   export VIDU_API_KEY="your_api_key_here"');
    console.log('   或者在 .env 文件中设置');
    console.log('');
  }
  
  console.log(`🔧 配置信息:`);
  console.log(`   基础URL: ${CONFIG.baseUrl}`);
  console.log(`   API Key: ${CONFIG.apiKey ? `${CONFIG.apiKey.slice(0, 8)}...` : '未设置'}`);
  console.log(`   超时时间: ${CONFIG.timeout}ms`);
  
  const results = [];
  
  for (const testCase of TEST_CASES) {
    const result = await runTest(testCase);
    results.push({ testCase, result });
  }
  
  // 输出测试总结
  console.log('\n📊 测试总结');
  console.log('=' * 50);
  
  const passed = results.filter(r => r.result.success).length;
  const failed = results.length - passed;
  
  console.log(`✅ 通过: ${passed}`);
  console.log(`❌ 失败: ${failed}`);
  console.log(`📈 成功率: ${((passed / results.length) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n🔍 故障排除建议:');
    console.log('1. 检查 API Key 是否正确');
    console.log('2. 确认网络连接正常');
    console.log('3. 验证 API 地址是否正确');
    console.log('4. 检查请求参数格式');
    console.log('5. 查看 API 文档确认接口规范');
  }
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { makeRequest, runTest };
