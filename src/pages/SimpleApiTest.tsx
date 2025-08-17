import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Search, Image, Heart, Download } from 'lucide-react'
import { API_CONFIG, validateApiConfig } from '@/config/api'

interface UnsplashImage {
  id: string
  urls: {
    small: string
    regular: string
    full: string
  }
  alt_description: string
  user: {
    name: string
    username: string
    links: {
      html: string
    }
  }
  links: {
    html: string
    download: string
  }
  likes: number
}



export default function SimpleApiTest() {
  const [searchTerm, setSearchTerm] = useState('')
  const [images, setImages] = useState<UnsplashImage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [isApiConfigured, setIsApiConfigured] = useState(false)

  // 检查API配置
  useEffect(() => {
    const isValid = validateApiConfig()
    setIsApiConfigured(isValid)
    if (!isValid) {
      setError('API配置无效，请检查API密钥设置')
    }
  }, [])

  const searchImages = async () => {
    if (!searchTerm.trim()) {
      setError('请输入搜索关键词')
      return
    }

    setIsLoading(true)
    setError('')
    setHasSearched(true)

    try {
      // 确保API密钥是有效的字符串
      const apiKey = String(API_CONFIG.UNSPLASH.API_KEY).trim()
      if (!apiKey || apiKey === 'YOUR_UNSPLASH_API_KEY_HERE') {
        throw new Error('API密钥未配置')
      }

      const url = `${API_CONFIG.UNSPLASH.BASE_URL}${API_CONFIG.UNSPLASH.SEARCH_ENDPOINT}?query=${encodeURIComponent(searchTerm)}&per_page=${API_CONFIG.UNSPLASH.DEFAULT_PER_PAGE}&orientation=${API_CONFIG.UNSPLASH.DEFAULT_ORIENTATION}`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Client-ID ${apiKey}`
        }
      })

      if (!response.ok) {
        throw new Error(`搜索失败: ${response.status}`)
      }

      const data = await response.json()
      setImages(data.results || [])
      
      if (data.results?.length === 0) {
        setError('没有找到相关图片，请尝试其他关键词')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '搜索失败，请稍后重试')
      setImages([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      searchImages()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* 标题区域 */}
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🖼️ 智能图片搜索
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            输入任何关键词，AI帮你找到最匹配的高质量图片
          </p>
        </div>

        {/* 搜索区域 */}
        <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="输入图片关键词，如：猫咪、自然风景、城市建筑..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <Button 
                onClick={searchImages} 
                disabled={isLoading || !searchTerm.trim() || !isApiConfigured}
                className="px-8 py-3 text-lg font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    搜索中...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    搜索
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 错误提示 */}
        {error && (
          <Card className="max-w-2xl mx-auto border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 结果展示 */}
        {images.length > 0 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-2xl">🎯 搜索结果</span>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {images.length} 张图片
                </Badge>
              </CardTitle>
              <CardDescription className="text-lg">
                关键词：<span className="font-semibold text-blue-600">"{searchTerm}"</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((image) => (
                  <div key={image.id} className="group space-y-3">
                    <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      <img
                        src={image.urls.regular}
                        alt={image.alt_description || '图片'}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-red-400" />
                              <span className="text-sm">{image.likes}</span>
                            </div>
                            <a
                              href={image.links.download}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-800 truncate">
                        {image.alt_description || '无描述'}
                      </p>
                      <p className="text-sm text-gray-500">
                        摄影师：{' '}
                        <a 
                          href={image.user.links.html}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {image.user.name}
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 空状态 */}
        {hasSearched && images.length === 0 && !error && (
          <Card className="max-w-2xl mx-auto text-center border-gray-200 bg-gray-50">
            <CardContent className="pt-8 pb-8">
              <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">没有找到相关图片</h3>
              <p className="text-gray-500">尝试使用更通用的关键词，比如：自然、风景、动物等</p>
            </CardContent>
          </Card>
        )}

        {/* 使用说明 */}
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">💡 使用提示</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-700">
            <p>• 支持中英文关键词搜索</p>
            <p>• 点击图片可查看大图</p>
            <p>• 所有图片来自Unsplash，免费商用</p>
            <p>• 鼠标悬停图片可查看下载按钮</p>
          </CardContent>
        </Card>

        {/* 页脚 */}
        <div className="text-center text-gray-500 text-sm py-8">
          <p>Powered by Unsplash API • 高质量图片搜索服务</p>
        </div>
      </div>
    </div>
  )
}
