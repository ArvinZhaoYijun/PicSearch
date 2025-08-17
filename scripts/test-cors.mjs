#!/usr/bin/env node

import fetch from 'node-fetch';

async function testViduAPI() {
  const baseUrl = "https://api.vidu.cn";
  const apiKey = process.env.VIDU_API_KEY || "";
  
  console.log("🔍 测试 Vidu API 连接...");
  console.log(`📍 基础URL: ${baseUrl}`);
  console.log(`🔑 API Key: ${apiKey ? `${apiKey.slice(0, 8)}...` : '未设置'}`);
  console.log("");
  
  try {
    // 测试健康检查端点
    console.log("1️⃣ 测试健康检查端点...");
    const healthUrl = `${baseUrl}/v1/health`;
    console.log(`   URL: ${healthUrl}`);
    
    const healthRes = await fetch(healthUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Token ${apiKey}` } : {}),
      },
    });
    
    console.log(`   ✅ 状态码: ${healthRes.status}`);
    console.log(`   📋 响应头:`, Object.fromEntries(healthRes.headers.entries()));
    
    const healthData = await healthRes.text();
    console.log(`   📄 响应内容: ${healthData}`);
    console.log("");
    
    // 测试图片生成API
    console.log("2️⃣ 测试图片生成API...");
    const imageUrl = `${baseUrl}/ent/v2/reference2image`;
    console.log(`   URL: ${imageUrl}`);
    
    const payload = {
      model: "viduq1",
      images: ["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop"],
      prompt: "一只可爱的小猫",
      seed: 0,
      aspect_ratio: "1:1",
      payload: "",
    };
    
    console.log(`   📤 请求参数:`, JSON.stringify(payload, null, 2));
    
    const imageRes = await fetch(imageUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Token ${apiKey}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    
    console.log(`   ✅ 状态码: ${imageRes.status}`);
    console.log(`   📋 响应头:`, Object.fromEntries(imageRes.headers.entries()));
    
    const imageData = await imageRes.text();
    console.log(`   📄 响应内容: ${imageData}`);
    
  } catch (error) {
    console.error("❌ 请求失败:", error.message);
    console.error("详细错误:", error);
  }
}

// 运行测试
testViduAPI();
