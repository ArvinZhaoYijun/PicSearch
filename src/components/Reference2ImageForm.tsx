import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Trash2, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";

const MAX_REFERENCES = 7;
const VIDU_BASE = import.meta.env.DEV ? "/api/vidu" : "https://api.vidu.cn";

function guessBase64Mime(base64Body: string): string {
  const head = base64Body.slice(0, 20);
  if (head.startsWith("/9j/")) return "image/jpeg"; // JPEG
  if (head.startsWith("iVBORw0KGgo")) return "image/png"; // PNG
  if (head.startsWith("R0lGODdh") || head.startsWith("R0lGODlh")) return "image/gif"; // GIF
  if (head.startsWith("UklGR")) return "image/webp"; // WebP (RIFF)
  return "image/jpeg";
}

function normalizeImageString(value: string): string {
  const v = String(value).trim();
  if (v.startsWith("ssupload:")) return ""; // unresolved storage handle; needs exchange to real URL
  if (v.startsWith("http://") || v.startsWith("https://") || v.startsWith("data:")) return v;
  const mime = guessBase64Mime(v);
  return `data:${mime};base64,${v}`;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Reference2ImageForm() {
  const [images, setImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [callbackUrl, setCallbackUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentTaskIdRef = useRef<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("VIDU_API_KEY");
    if (saved) setApiKey(saved);
  }, []);

  const handleSelectFiles = async (files: FileList | null) => {
    if (!files) return;
    const existing = images.length;
    const allowed = Math.max(0, MAX_REFERENCES - existing);
    const picked = Array.from(files).slice(0, allowed);
    if (picked.length < files.length) {
      toast("最多只支持 7 张参考图");
    }
    try {
      const dataUrls = await Promise.all(picked.map((f) => readFileAsDataURL(f)));
      setImages((prev) => [...prev, ...dataUrls]);
    } catch (e) {
      toast.error("读取图片失败，请重试");
    }
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    await handleSelectFiles(e.dataTransfer.files);
  };

  const startUpload = () => fileInputRef.current?.click();

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const saveKey = () => {
    localStorage.setItem("VIDU_API_KEY", apiKey);
    toast.success("API Key 已保存到本地");
  };

  async function tryFetchTask(taskId: string): Promise<any | null> {
    const candidateUrls = [
      `${VIDU_BASE}/ent/v2/tasks/${taskId}`,
      `${VIDU_BASE}/ent/v2/reference2image/${taskId}`,
      `${VIDU_BASE}/ent/v2/reference2image?task_id=${encodeURIComponent(taskId)}`,
      `${VIDU_BASE}/ent/v2/task?task_id=${encodeURIComponent(taskId)}`,
      `${VIDU_BASE}/ent/v2/get_task?task_id=${encodeURIComponent(taskId)}`,
    ];
    for (const url of candidateUrls) {
      try {
        const r = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(apiKey ? { Authorization: `Token ${apiKey}` } : {}),
          },
        });
        if (!r.ok) continue;
        const ct = r.headers.get("content-type") || "";
        if (!ct.includes("application/json")) continue;
        const j = await r.json();
        return j;
      } catch {
        // ignore and try next
      }
    }
    return null;
  }

  function startPolling(taskId: string) {
    currentTaskIdRef.current = taskId;
    let attemptsLeft = 40; // ~2 minutes @ 3s interval

    const tick = async () => {
      if (attemptsLeft-- <= 0) {
        toast.error("查询超时，请稍后重试");
        pollingRef.current = null;
        return;
      }
      const j = await tryFetchTask(taskId);
      if (j) {
        const imgs: string[] = [];
        if (Array.isArray(j.images)) {
          j.images.forEach((v: string) => imgs.push(normalizeImageString(v)));
        } else if (j.result?.images) {
          j.result.images.forEach((v: string) => imgs.push(normalizeImageString(String(v))));
        }
        const filtered = imgs.filter(Boolean);
        const state = String(j.state || "");
        if (filtered.length > 0) {
          setResults(filtered);
          setLoading(false);
          pollingRef.current = null;
          return;
        }
        if (state.toLowerCase() === "failed" || state.toLowerCase() === "error") {
          toast.error("生成失败，请稍后重试");
          setLoading(false);
          pollingRef.current = null;
          return;
        }
      }
      pollingRef.current = setTimeout(tick, 3000);
    };

    if (pollingRef.current) clearTimeout(pollingRef.current);
    pollingRef.current = setTimeout(tick, 3000);
  }

  const callVidu = async () => {
    if (!prompt.trim()) {
      toast.error("请输入 Prompt");
      return;
    }
    if (images.length === 0) {
      toast.error("请上传至少 1 张参考图");
      return;
    }

    setLoading(true);
    setResults([]);

    // 直接传完整 dataURL（或 URL）。如果是本地 dataURL，需包含 data:image/...;base64, 前缀
    const references = images.map((src) => src);

    const payload: Record<string, any> = {
      model: "viduq1",
      images: references,
      prompt,
      seed: 0,
      aspect_ratio: "1:1",
      payload: "",
      ...(callbackUrl ? { callback_url: callbackUrl } : {}),
    };

    try {
      const res = await fetch(`${VIDU_BASE}/ent/v2/reference2image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Token ${apiKey}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!res.ok) {
        const errText = contentType.includes("application/json") ? JSON.stringify(await res.json()) : await res.text();
        throw new Error(errText || `请求失败(${res.status})`);
      }

      let json: any = contentType.includes("application/json") ? await res.json() : null;

      // 兼容不同返回结构，尽量提取图片 URL 或 base64
      const out: string[] = [];
      if (json) {
        if (Array.isArray(json.images)) {
          for (const img of json.images) {
            if (typeof img === "string") out.push(normalizeImageString(img));
          }
        } else if (Array.isArray(json.data)) {
          for (const item of json.data) {
            if (typeof item === "string") out.push(normalizeImageString(item));
            if (item?.imageURL) out.push(normalizeImageString(String(item.imageURL)));
            if (Array.isArray(item?.images)) item.images.forEach((im: string) => out.push(normalizeImageString(im)));
          }
        } else if (json.result?.images) {
          for (const im of json.result.images) out.push(normalizeImageString(String(im)));
        }
      }

      const filtered = out.filter(Boolean);

      if (filtered.length === 0) {
        // 如果包含 task_id，尝试轮询任务结果
        if (json?.task_id) {
          toast("任务已创建，正在获取结果...");
          startPolling(String(json.task_id));
          return;
        }
        toast("已成功请求，但未解析到图片，返回内容见控制台");
        console.log("Vidu response raw:", json);
      } else if (filtered.length < out.length) {
        const unresolved = out.length - filtered.length;
        toast(`成功解析 ${filtered.length} 张图片，有 ${unresolved} 张为占位符（如 ssupload），需要按接口文档换取真实 URL`);
      }

      setResults(filtered);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "请求失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative">
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-surface"
        aria-hidden
      />

      <div className="relative grid gap-6 md:grid-cols-2">
        <Card className="shadow-elev">
          <CardHeader>
            <CardTitle>上传参考图（最多 7 张）</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="mb-4 rounded-lg border border-dashed p-6 text-center hover:bg-accent/40"
              aria-label="拖拽或点击上传参考图"
            >
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleSelectFiles(e.target.files)}
              />
              <div className="flex flex-col items-center gap-2">
                <ImagePlus className="opacity-70" />
                <p className="text-sm text-muted-foreground">拖拽图片到此处，或</p>
                <Button variant="outline" onClick={startUpload}>
                  选择图片
                </Button>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
                {images.map((src, idx) => (
                  <div key={idx} className="group relative overflow-hidden rounded-md border">
                    <img
                      src={src}
                      alt={`参考图 ${idx + 1}`}
                      className="aspect-square w-full object-cover"
                      loading="lazy"
                    />
                    <button
                      aria-label={`删除参考图 ${idx + 1}`}
                      onClick={() => removeImage(idx)}
                      className="absolute right-1 top-1 rounded-md bg-background/80 p-1 opacity-0 shadow hover:opacity-100 focus:opacity-100 focus:outline-none group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 space-y-3">
              <label className="text-sm font-medium">Prompt</label>
              <Textarea
                placeholder="描述你希望基于参考图生成什么（可中英文）"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <KeyRound className="h-4 w-4" /> Vidu API Key（仅保存在本地）
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="在此输入 Vidu API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <Button variant="secondary" onClick={saveKey}>
                    保存
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">可选：回调地址 callback_url（如使用 webhook.site 调试）</label>
                <Input
                  placeholder="https://webhook.site/..."
                  value={callbackUrl}
                  onChange={(e) => setCallbackUrl(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <Button variant="hero" className="w-full" onClick={callVidu} disabled={loading}>
                  {loading ? (
                    <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> 正在生成...</span>
                  ) : (
                    "开始生成"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elev">
          <CardHeader>
            <CardTitle>生成结果</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                结果将在这里展示
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {results.map((url, i) => (
                  <article key={i} className="overflow-hidden rounded-md border">
                    <img
                      src={url}
                      alt={`生成结果 ${i + 1}`}
                      className="aspect-square w-full object-cover"
                      loading="lazy"
                    />
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
