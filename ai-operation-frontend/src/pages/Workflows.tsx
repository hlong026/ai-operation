import { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Input, Select, Tag, Rate, Avatar, message, Tooltip } from 'antd'
import { 
  PlusOutlined, ThunderboltOutlined,
  FireOutlined, PlayCircleOutlined, NodeIndexOutlined,
  HeartOutlined, HeartFilled
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import * as favoriteService from '../services/favoriteService'

const { Search } = Input

interface Workflow {
  id: string
  name: string
  desc: string
  type: 'Coze' | 'n8n'
  category: string
  tags: string[]
  credits: number
  usage: number
  rating: number
  reviews: number
  avatar: string
  isHot?: boolean
  isNew?: boolean
}

export default function Workflows() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [category, setCategory] = useState('all')
  const [type, setType] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const workflows: Workflow[] = [
    {
      id: '1',
      name: '爆款短视频文案生成器',
      desc: '基于热点话题和用户画像，自动生成吸引眼球的短视频文案，支持多平台风格',
      type: 'Coze',
      category: '内容创作',
      tags: ['文案', '短视频', 'AI生成'],
      credits: 5,
      usage: 12340,
      rating: 4.8,
      reviews: 156,
      avatar: '📝',
      isHot: true,
    },
    {
      id: '2',
      name: '账号数据分析助手',
      desc: '自动抓取和分析竞品账号数据，生成详细的分析报告和运营建议',
      type: 'n8n',
      category: '数据分析',
      tags: ['数据', '分析', '报告'],
      credits: 10,
      usage: 8560,
      rating: 4.9,
      reviews: 89,
      avatar: '📊',
      isHot: true,
    },
    {
      id: '3',
      name: '视频脚本生成器',
      desc: '根据主题自动生成完整的视频脚本，包含分镜设计和台词创作',
      type: 'Coze',
      category: '内容创作',
      tags: ['脚本', '视频', 'AI'],
      credits: 8,
      usage: 9800,
      rating: 4.7,
      reviews: 123,
      avatar: '🎬',
    },
    {
      id: '4',
      name: '批量视频生成工作流',
      desc: '一键批量生成短视频，支持自定义模板、配音和字幕',
      type: 'n8n',
      category: '视频制作',
      tags: ['视频', '批量', '自动化'],
      credits: 15,
      usage: 5670,
      rating: 4.8,
      reviews: 78,
      avatar: '🎥',
      isNew: true,
    },
    {
      id: '5',
      name: '小红书爆款笔记生成',
      desc: '专为小红书优化的内容生成工作流，包含标题、正文和标签推荐',
      type: 'Coze',
      category: '内容创作',
      tags: ['小红书', '笔记', '爆款'],
      credits: 6,
      usage: 15680,
      rating: 4.9,
      reviews: 234,
      avatar: '📕',
      isHot: true,
    },
    {
      id: '6',
      name: '营销文案批量生成',
      desc: '批量生成多种风格的营销文案，适用于广告投放和推广',
      type: 'Coze',
      category: '营销推广',
      tags: ['营销', '文案', '批量'],
      credits: 4,
      usage: 7890,
      rating: 4.6,
      reviews: 98,
      avatar: '📢',
    },
  ]

  const categories = [
    { key: 'all', label: '全部分类' },
    { key: '内容创作', label: '内容创作' },
    { key: '数据分析', label: '数据分析' },
    { key: '视频制作', label: '视频制作' },
    { key: '营销推广', label: '营销推广' },
  ]

  const types = [
    { key: 'all', label: '全部类型' },
    { key: 'Coze', label: 'Coze' },
    { key: 'n8n', label: 'n8n' },
  ]

  // 加载收藏状态
  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites()
    }
  }, [isAuthenticated])

  const loadFavorites = async () => {
    try {
      const ids = workflows.map(w => w.id)
      const favSet = await favoriteService.checkFavorites('workflow', ids)
      setFavorites(favSet)
    } catch (err) {
      console.error('加载收藏状态失败:', err)
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent, workflowId: string) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      message.warning('请先登录')
      navigate('/login')
      return
    }

    try {
      const isFav = favorites.has(workflowId)
      if (isFav) {
        await favoriteService.removeFavorite('workflow', workflowId)
        setFavorites(prev => {
          const next = new Set(prev)
          next.delete(workflowId)
          return next
        })
        message.success('已取消收藏')
      } else {
        await favoriteService.addFavorite('workflow', workflowId)
        setFavorites(prev => new Set(prev).add(workflowId))
        message.success('收藏成功')
      }
    } catch (err) {
      message.error('操作失败')
    }
  }

  const filteredWorkflows = workflows.filter(w => {
    const matchCategory = category === 'all' || w.category === category
    const matchType = type === 'all' || w.type === type
    const matchSearch = !searchText || 
      w.name.includes(searchText) || 
      w.desc.includes(searchText) ||
      w.tags.some(tag => tag.includes(searchText))
    return matchCategory && matchType && matchSearch
  })

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <NodeIndexOutlined style={{ color: '#1890ff' }} />
            工作流商店
          </h1>
          <p style={{ color: '#8c8c8c', margin: 0 }}>浏览和使用各种 AI 工作流，提升你的创作效率</p>
        </div>
        {isAuthenticated && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/creator')}
          >
            上传我的工作流
          </Button>
        )}
      </div>

      {/* 筛选区域 */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <Select
            style={{ width: 130 }}
            value={type}
            onChange={setType}
            options={types.map(t => ({ label: t.label, value: t.key }))}
          />
          <Select
            style={{ width: 130 }}
            value={category}
            onChange={setCategory}
            options={categories.map(c => ({ label: c.label, value: c.key }))}
          />
          <Search
            placeholder="搜索工作流名称、描述或标签..."
            allowClear
            style={{ flex: 1 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ color: '#8c8c8c' }}>热门标签:</span>
          {['文案', '视频', '小红书', '数据分析', '批量'].map(tag => (
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

      {/* 工作流列表 - 卡片式布局 */}
      <Row gutter={[16, 16]}>
        {filteredWorkflows.map(workflow => (
          <Col span={8} key={workflow.id}>
            <Card 
              hoverable
              style={{ borderRadius: 12, height: '100%' }}
              styles={{ body: { padding: 24 } }}
              onClick={() => navigate(`/workflows/${workflow.id}`)}
            >
              {/* 收藏按钮和标签 */}
              <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4, alignItems: 'center' }}>
                {workflow.isHot && <Tag color="red"><FireOutlined /> 热门</Tag>}
                {workflow.isNew && <Tag color="green">新上线</Tag>}
                <Tooltip title={favorites.has(workflow.id) ? '取消收藏' : '收藏'}>
                  <Button
                    type="text"
                    size="small"
                    icon={favorites.has(workflow.id) ? 
                      <HeartFilled style={{ color: '#ff4d4f', fontSize: 16 }} /> : 
                      <HeartOutlined style={{ fontSize: 16 }} />
                    }
                    onClick={(e) => handleToggleFavorite(e, workflow.id)}
                  />
                </Tooltip>
              </div>

              {/* 头部：图标和名称 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <Avatar 
                  size={56} 
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    fontSize: 28,
                    flexShrink: 0
                  }}
                >
                  {workflow.avatar}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ 
                    margin: 0, 
                    marginBottom: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {workflow.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Tag color={workflow.type === 'Coze' ? 'blue' : 'green'} style={{ margin: 0 }}>
                      {workflow.type}
                    </Tag>
                    <Rate disabled defaultValue={workflow.rating} style={{ fontSize: 10 }} />
                    <span style={{ color: '#8c8c8c', fontSize: 11 }}>{workflow.rating}</span>
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
                {workflow.desc}
              </p>

              {/* 分类和标签 */}
              <div style={{ marginBottom: 12 }}>
                <Tag color="purple" style={{ marginBottom: 4 }}>{workflow.category}</Tag>
                {workflow.tags.slice(0, 2).map(tag => (
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
                  <span><ThunderboltOutlined /> {workflow.credits}积分</span>
                  <span><PlayCircleOutlined /> {workflow.usage.toLocaleString()}次</span>
                </div>
                <Button 
                  type="primary" 
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/workflows/${workflow.id}/execute`)
                  }}
                >
                  立即使用
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
