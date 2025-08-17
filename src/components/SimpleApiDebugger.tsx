import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Play, Eye, Code } from "lucide-react";
import { toast } from "sonner";

interface ApiResponse {
  status: number;
  headers: Record<string, string>;
  body: any;
  error?: string;
}

export default function SimpleApiDebugger() {
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://api.vidu.cn");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  
  // 测试参数
  const [testPrompt, setTestPrompt] = useState("一只可爱的小猫");
  const [testImage, setTestImage] = useState("https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop");
  const [testModel, setTestModel] = useState("viduq1");

  // 从localStorage加载保存的API Key
  useEffect(() => {
    const saved = localStorage.getItem("VIDU_API_KEY");
    if (saved) setApiKey(saved);
  }, []);

  const saveApiKey = () => {
    localStorage.setItem("VIDU_API_KEY", apiKey);
    toast.success("API Key 已保存");
  };

  const testSimpleGet = async () => {
    setLoading(true);
    setResponse(null);
    
    try {
      // 由于健康检查端点不存在，我们直接测试图片生成API
      const url = `${baseUrl}/ent/v2/reference2image`;
      console.log("Testing Reference2Image API:", url);
      
      const payload = {
        model: testModel,
        images: [testImage],
        prompt: testPrompt,
        seed: 0,
        aspect_ratio: "1:1",
        payload: "",
      };

      console.log("Request payload:", payload);
      
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Token ${apiKey}` } : {}),
        },
        body: JSON.stringify(payload),
        // 添加mode配置以处理CORS
        mode: "cors",
      });

      const headers: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        headers[key] = value;
      });

      let body;
      try {
        body = await res.json();
      } catch {
        body = await res.text();
      }

      setResponse({
        status: res.status,
        headers,
        body,
      });

      if (res.ok) {
        toast.success("API 连接测试成功");
        console.log("API Response:", body);
      } else if (res.status === 401) {
        toast.error("API 连接成功，但需要有效的 API Key");
        console.log("API Response:", body);
      } else {
        toast.error(`API 调用失败: ${res.status}`);
        console.error("API Error:", body);
      }
    } catch (error: any) {
      console.error("Fetch error details:", error);
      
      let errorMessage = error.message;
      if (error.message === "Failed to fetch") {
        errorMessage = "网络请求失败 - 可能是CORS问题或网络连接问题";
      }
      
      setResponse({
        status: 0,
        headers: {},
        body: null,
        error: errorMessage,
      });
      toast.error(`请求错误: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const testReference2Image = async () => {
    setLoading(true);
    setResponse(null);
    
    try {
      const url = `${baseUrl}/ent/v2/reference2image`;
      console.log("Testing Reference2Image API:", url);
      
      const payload = {
        model: testModel,
        images: [testImage],
        prompt: testPrompt,
        seed: 0,
        aspect_ratio: "1:1",
        payload: "",
      };

      console.log("Request payload:", payload);
      
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Token ${apiKey}` } : {}),
        },
        body: JSON.stringify(payload),
        // 添加mode配置以处理CORS
        mode: "cors",
      });

      const headers: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        headers[key] = value;
      });

      let body;
      try {
        body = await res.json();
      } catch {
        body = await res.text();
      }

      setResponse({
        status: res.status,
        headers,
        body,
      });

      if (res.ok) {
        toast.success("Reference2Image API 调用成功");
        console.log("API Response:", body);
      } else {
        toast.error(`Reference2Image API 调用失败: ${res.status}`);
        console.error("API Error:", body);
      }
    } catch (error: any) {
      console.error("Fetch error details:", error);
      
      let errorMessage = error.message;
      if (error.message === "Failed to fetch") {
        errorMessage = "网络请求失败 - 可能是CORS问题或网络连接问题";
      }
      
      setResponse({
        status: 0,
        headers: {},
        body: null,
        error: errorMessage,
      });
      toast.error(`请求错误: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Vidu API 调试工具 (简化版)</h1>
        <p className="text-muted-foreground mt-2">
          独立测试 Vidu 图片生成 API 的基本功能
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 配置面板 */}
        <Card>
          <CardHeader>
            <CardTitle>API 配置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="baseUrl">API 基础地址</Label>
              <Input
                id="baseUrl"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.vidu.cn"
              />
            </div>
            
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="输入你的 Vidu API Key"
                />
                <Button variant="outline" onClick={saveApiKey}>
                  保存
                </Button>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <h3 className="font-medium">测试参数</h3>
              
              <div>
                <Label htmlFor="testPrompt">测试 Prompt</Label>
                <Textarea
                  id="testPrompt"
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="描述要生成的图片内容"
                />
              </div>

              <div>
                <Label htmlFor="testImage">测试图片 URL</Label>
                <Input
                  id="testImage"
                  value={testImage}
                  onChange={(e) => setTestImage(e.target.value)}
                  placeholder="参考图片的 URL"
                />
              </div>

              <div>
                <Label htmlFor="testModel">模型</Label>
                <Input
                  id="testModel"
                  value={testModel}
                  onChange={(e) => setTestModel(e.target.value)}
                  placeholder="viduq1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 测试面板 */}
        <Card>
          <CardHeader>
            <CardTitle>API 测试</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button 
                onClick={testSimpleGet} 
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                测试 API 连接
              </Button>

              <Button 
                onClick={testReference2Image} 
                disabled={loading}
                className="w-full"
                variant="default"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                测试图片生成 API
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 响应结果 */}
      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              API 响应结果
              <span className="text-sm font-normal">
                状态: {response.status || "Error"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-muted p-4">
              <pre className="text-sm overflow-auto max-h-96">
                {response.error ? (
                  <span className="text-red-500">{response.error}</span>
                ) : (
                  JSON.stringify(response.body, null, 2)
                )}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 调试信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            调试信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>当前配置:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>基础URL: {baseUrl}</li>
              <li>API Key: {apiKey ? `${apiKey.slice(0, 8)}...` : '未设置'}</li>
              <li>模型: {testModel}</li>
              <li>Prompt: {testPrompt}</li>
              <li>参考图: {testImage}</li>
            </ul>
            
            <div className="pt-4">
              <p><strong>常见问题排查:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>检查 API Key 是否正确</li>
                <li>确认网络连接和防火墙设置</li>
                <li>验证 API 基础地址是否正确</li>
                <li>检查请求参数格式是否符合要求</li>
                <li>查看浏览器控制台的详细错误信息</li>
                <li><strong>CORS 问题解决方案:</strong></li>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>使用浏览器扩展禁用CORS（仅用于开发测试）</li>
                  <li>检查API服务器是否支持CORS</li>
                  <li>考虑使用代理服务器转发请求</li>
                  <li>联系API提供商确认CORS配置</li>
                </ul>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
