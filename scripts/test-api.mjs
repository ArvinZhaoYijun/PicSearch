#!/usr/bin/env node

/**
 * Vidu API 测试脚本 (ES模块版本)
 */

import https from 'https';
import http from 'http';

// 测试配置
const TEST_URL = 'https://api.vidu.cn/ent/v2/health';
const API_KEY = process.env.VIDU_API_KEY || '';

console.log('🔍 测试 Vidu API 连接...');
console.log(`📍 测试地址: ${TEST_URL}`);
console.log(`🔑 API Key: ${API_KEY ? `${API_KEY.slice(0, 8)}...` : '未设置'}`);

// 发送请求
const req = https.request(TEST_URL, {
  method: 'GET',
  headers: {
    'User-Agent': 'Vidu-API-Test/1.0',
    ...(API_KEY ? { 'Authorization': `Token ${API_KEY}` } : {}),
  },
  timeout: 10000,
}, (res) => {
  console.log(`\n📊 响应状态: ${res.statusCode}`);
  console.log(`📋 响应头:`);
  
  Object.entries(res.headers).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`\n📄 响应内容:`);
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
    } catch {
      console.log(data);
    }
    
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('\n✅ 连接测试成功！');
    } else {
      console.log('\n❌ 连接测试失败');
    }
  });
});

req.on('error', (error) => {
  console.error('\n💥 请求错误:', error.message);
  
  if (error.code === 'ENOTFOUND') {
    console.log('💡 建议: 检查网络连接和DNS设置');
  } else if (error.code === 'ECONNREFUSED') {
    console.log('💡 建议: 检查防火墙设置或API地址是否正确');
  } else if (error.code === 'ETIMEDOUT') {
    console.log('💡 建议: 检查网络延迟或增加超时时间');
  }
});

req.on('timeout', () => {
  console.error('\n⏰ 请求超时');
  req.destroy();
});

req.end();
