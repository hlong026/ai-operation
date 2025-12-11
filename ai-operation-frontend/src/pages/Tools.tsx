import { useState, useEffect } from 'react'
import { Card, Row, Col, Tabs, Button, Input, Tag, Rate, Avatar, message, Tooltip } from 'antd'
import { 
  PlusOutlined, ThunderboltOutlined, 
  FireOutlined, AppstoreOutlined, HeartOutlined, HeartFilled
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import * as favoriteService from '../services/favoriteService'

const { Search } = Input

interface Tool {
  id: string
  name: string
  desc: string
  icon: string
  category: string
  credits: number
  usage: number
  rating: number
  reviews: number
  tags: string[]
  isHot?: boolean
  isNew?: boolean
}

export default function Tools() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [searchText, setSearchText] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  
  const tools: Tool[] = [
    { 
      id: '1',
      name: '文案提取工具', 
      desc: '从视频中智能提取文案内容，支持多种视频格式', 
      icon: '📝', 
      category: 'text',
      credits: 3,
      usage: 2934,
      rating: 4.8,
      reviews: 156,
      tags: ['文案', '提取', '视频'],
      isHot: true
    },
    { 
      id: '2',
      name: '文案二创工具', 
      desc: '基于原始内容智能生成新文案，保持原意的同时创新表达', 
      icon: '✨', 
      category: 'text',
      credits: 5,
      usage: 4521,
      rating: 4.9,
      reviews: 289,
      tags: ['文案', '二创', 'AI'],
      isHot: true
    },
    { 
      id: '3',
      name: '账号拆解工具', 
      desc: '深度分析目标账号运营策略，包括内容、互动、增长等维度', 
      icon: '📊', 
      category: 'analysis',
      credits: 8,
      usage: 1823,
      rating: 4.7,
      reviews: 98,
      tags: ['分析', '账号', '运营']
    },
    { 
      id: '4',
      name: '视频拆解工具', 
      desc: '深入分析视频内容结构，提取爆款元素和创作技巧', 
      icon: '🎬', 
      category: 'video',
      credits: 6,
      usage: 3256,
      rating: 4.8,
      reviews: 178,
      tags: ['视频', '分析', '爆款'],
      isNew: true
    },
    { 
      id: '5',
      name: '图片处理工具', 
      desc: '批量处理和优化图片，支持裁剪、滤镜、水印等功能', 
      icon: '🖼️', 
      category: 'image',
      credits: 2,
      usage: 1567,
      rating: 4.6,
      reviews: 87,
      tags: ['图片', '处理', '批量']
    },
    { 
      id: '6',
      name: '数据导出工具', 
      desc: '导出各类数据报表，支持Excel、CSV等多种格式', 
      icon: '📥', 
      category: 'data',
      credits: 1,
      usage: 2834,
      rating: 4.5,
      reviews: 134,
      tags: ['数据', '导出', '报表']
    },
    { 
      id: '7',
      name: '标题生成器', 
      desc: '智能生成吸引眼球的标题，提升点击率', 
      icon: '💡', 
      category: 'text',
      credits: 2,
      usage: 5678,
      rating: 4.9,
      reviews: 345,
      tags: ['标题', '生成', '爆款'],
      isHot: true
    },
    { 
      id: '8',
      name: '视频转文字', 
      desc: '将视频内容转换为文字，支持多语言识别', 
      icon: '🎙️', 
      category: 'video',
      credits: 4,
      usage: 2345,
      rating: 4.7,
      reviews: 167,
      tags: ['视频', '转文字', '语音'],
      isNew: true
    },
  ]

  const categories = [
    { key: 'all', label: '全部工具', icon: <AppstoreOutlined /> },
    { key: 'text', label: '文案工具', icon: '📝' },
    { key: 'video', label: '视频工具', icon: '🎬' },
    { key: 'image', label: '图片工具', icon: '🖼️' },
    { key: 'analysis', label: '分析工具', icon: '📊' },
    { key: 'data', label: '数据工具', icon: '📥' },
  ]

  // 加载收藏状态
  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites()
    }
  }, [isAuthenticated])

  const loadFavorites = async () => {
    try {
      const ids = tools.map(t => t.id)
      const favSet = await favoriteService.checkFavorites('tool', ids)
      setFavorites(favSet)
    } catch (err) {
      console.error('加载收藏状态失败:', err)
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent, toolId: string) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      message.warning('请先登录')
      navigate('/login')
      return
    }

    try {
      const isFav = favorites.has(toolId)
      if (isFav) {
        await favoriteService.removeFavorite('tool', toolId)
        setFavorites(prev => {
          const next = new Set(prev)
          next.delete(toolId)
          return next
        })
        message.success('已取消收藏')
      } else {
        await favoriteService.addFavorite('tool', toolId)
        setFavorites(prev => new Set(prev).add(toolId))
        message.success('收藏成功')
      }
    } catch (err) {
      message.error('操作失败')
    }
  }

  const filteredTools = (category: string) => {
    let result = category === 'all' ? tools : tools.filter(t => t.category === category)
    if (searchText) {
      result = result.filter(t => 
        t.name.includes(searchText) || 
        t.desc.includes(searchText) ||
        t.tags.some(tag => tag.includes(searchText))
      )
    }
    return result
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <AppstoreOutlined style={{ color: '#1890ff' }} />
            工具箱
          </h1>
          <p style={{ color: '#8c8c8c', margin: 0 }}>使用各种 AI 工具提升创作效率，每个工具都经过精心打磨</p>
        </div>
        {isAuthenticated && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/creator')}
          >
            上传我的工具
          </Button>
        )}
      </div>

      {/* 搜索栏 */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <Search 
            placeholder="搜索工具名称、描述或标签..." 
            allowClear 
            style={{ flex: 1 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ color: '#8c8c8c' }}>热门标签:</span>
          {['文案', '视频', '爆款', 'AI', '分析'].map(tag => (
            <Tag 
              key={tag} 
              style={{ cursor: 'pointer' }}
              onClick={() => setSearchText(tag)}
            >
              #{tag}
            </Tag>
          ))}
        </div>
      </Card>

      <Tabs
        items={categories.map(cat => ({
          key: cat.key,
          label: (
            <span>
              {typeof cat.icon === 'string' ? cat.icon : cat.icon} {cat.label}
            </span>
          ),
          children: (
            <Row gutter={[16, 16]}>
              {filteredTools(cat.key).map((tool) => (
                <Col span={6} key={tool.id}>
                  <Card 
                    hoverable 
                    style={{ borderRadius: 12, height: '100%' }}
                    styles={{ body: { padding: 20 } }}
                    onClick={() => navigate(`/tools/${tool.id}`)}
                  >
                    {/* 收藏按钮和标签 */}
                    <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4, alignItems: 'center' }}>
                      {tool.isHot && <Tag color="red"><FireOutlined /> 热门</Tag>}
                      {tool.isNew && <Tag color="green">新上线</Tag>}
                      <Tooltip title={favorites.has(tool.id) ? '取消收藏' : '收藏'}>
                        <Button
                          type="text"
                          size="small"
                          icon={favorites.has(tool.id) ? 
                            <HeartFilled style={{ color: '#ff4d4f', fontSize: 16 }} /> : 
                            <HeartOutlined style={{ fontSize: 16 }} />
                          }
                          onClick={(e) => handleToggleFavorite(e, tool.id)}
                        />
                      </Tooltip>
                    </div>

                    {/* 图标和名称 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <Avatar 
                        size={48} 
                        style={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                          fontSize: 24 
                        }}
                      >
                        {tool.icon}
                      </Avatar>
                      <div>
                        <h3 style={{ margin: 0, marginBottom: 4 }}>{tool.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Rate disabled defaultValue={tool.rating} style={{ fontSize: 10 }} />
                          <span style={{ color: '#8c8c8c', fontSize: 11 }}>{tool.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* 描述 */}
                    <p style={{ 
                      color: '#595959', 
                      fontSize: 13, 
                      marginBottom: 12, 
                      minHeight: 40,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {tool.desc}
                    </p>

                    {/* 标签 */}
                    <div style={{ marginBottom: 12 }}>
                      {tool.tags.slice(0, 3).map(tag => (
                        <Tag key={tag} style={{ marginBottom: 4 }}>#{tag}</Tag>
                      ))}
                    </div>

                    {/* 底部信息 */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      borderTop: '1px solid #f0f0f0',
                      paddingTop: 12
                    }}>
                      <div style={{ display: 'flex', gap: 12, color: '#8c8c8c', fontSize: 12 }}>
                        <span><ThunderboltOutlined /> {tool.credits}积分</span>
                        <span>{tool.usage.toLocaleString()}次使用</span>
                      </div>
                      <Button type="link" size="small" style={{ padding: 0 }}>
                        使用 →
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ),
        }))}
      />
    </div>
  )
}
