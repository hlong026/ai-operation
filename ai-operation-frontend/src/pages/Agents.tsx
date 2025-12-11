import { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Input, Select, Tag, Rate, Avatar, message, Tooltip } from 'antd'
import { PlusOutlined, RobotOutlined, MessageOutlined, ThunderboltOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import * as favoriteService from '../services/favoriteService'

const { Search } = Input

export default function Agents() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [category, setCategory] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const agents = [
    {
      id: '1',
      name: '小红书爆款文案助手',
      avatar: '🤖',
      desc: '专业的小红书文案创作助手，帮你写出爆款笔记',
      category: '内容创作',
      tags: ['小红书', '文案', '爆款'],
      credits: 8,
      usage: 5234,
      rating: 4.9,
      reviews: 328,
      capabilities: ['文案生成', '标题优化', '话题推荐'],
    },
    {
      id: '2',
      name: '抖音脚本生成器',
      avatar: '🎬',
      desc: '一键生成抖音短视频脚本，包含分镜和台词',
      category: '视频创作',
      tags: ['抖音', '脚本', '短视频'],
      credits: 10,
      usage: 3856,
      rating: 4.8,
      reviews: 256,
      capabilities: ['脚本生成', '分镜设计', '台词创作'],
    },
    {
      id: '3',
      name: '智能客服助手',
      avatar: '💬',
      desc: '7x24小时智能客服，自动回复客户问题',
      category: '客服',
      tags: ['客服', '自动回复', 'AI'],
      credits: 5,
      usage: 8921,
      rating: 4.7,
      reviews: 512,
      capabilities: ['自动回复', '问题分类', '转人工'],
    },
    {
      id: '4',
      name: '数据分析专家',
      avatar: '📊',
      desc: '智能分析数据，生成可视化报告和洞察',
      category: '数据分析',
      tags: ['数据', '分析', '报告'],
      credits: 15,
      usage: 2134,
      rating: 4.9,
      reviews: 189,
      capabilities: ['数据分析', '报告生成', '趋势预测'],
    },
    {
      id: '5',
      name: '英语翻译助手',
      avatar: '🌍',
      desc: '专业的中英互译助手，支持多种场景',
      category: '翻译',
      tags: ['翻译', '英语', '多语言'],
      credits: 3,
      usage: 12456,
      rating: 4.8,
      reviews: 678,
      capabilities: ['中英互译', '专业术语', '语法校正'],
    },
    {
      id: '6',
      name: '代码助手',
      avatar: '💻',
      desc: '智能编程助手，帮你写代码、找Bug、优化性能',
      category: '开发',
      tags: ['编程', '代码', 'Debug'],
      credits: 12,
      usage: 4567,
      rating: 4.9,
      reviews: 345,
      capabilities: ['代码生成', 'Bug修复', '代码优化'],
    },
  ]

  const categories = ['全部分类', '内容创作', '视频创作', '客服', '数据分析', '翻译', '开发']

  // 加载收藏状态
  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites()
    }
  }, [isAuthenticated])

  const loadFavorites = async () => {
    try {
      const ids = agents.map(a => a.id)
      const favSet = await favoriteService.checkFavorites('agent', ids)
      setFavorites(favSet)
    } catch (err) {
      console.error('加载收藏状态失败:', err)
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent, agentId: string) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      message.warning('请先登录')
      navigate('/login')
      return
    }

    try {
      const isFav = favorites.has(agentId)
      if (isFav) {
        await favoriteService.removeFavorite('agent', agentId)
        setFavorites(prev => {
          const next = new Set(prev)
          next.delete(agentId)
          return next
        })
        message.success('已取消收藏')
      } else {
        await favoriteService.addFavorite('agent', agentId)
        setFavorites(prev => new Set(prev).add(agentId))
        message.success('收藏成功')
      }
    } catch (err) {
      message.error('操作失败')
    }
  }

  const filteredAgents = agents.filter(a => {
    const matchCategory = category === 'all' || category === '全部分类' || a.category === category
    const matchSearch = !searchText || 
      a.name.includes(searchText) || 
      a.desc.includes(searchText) ||
      a.tags.some(tag => tag.includes(searchText))
    return matchCategory && matchSearch
  })

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <RobotOutlined style={{ color: '#722ed1' }} />
            智能体商店
          </h1>
          <p style={{ color: '#8c8c8c', margin: 0 }}>发现和使用各种 AI 智能体，让 AI 成为你的得力助手</p>
        </div>
        {isAuthenticated && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/creator')}>
            上传我的智能体
          </Button>
        )}
      </div>

      {/* 筛选区域 */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <Select
            style={{ width: 150 }}
            value={category}
            onChange={setCategory}
            options={categories.map(c => ({ label: c, value: c }))}
          />
          <Search 
            placeholder="搜索智能体..." 
            allowClear 
            style={{ flex: 1 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ color: '#8c8c8c' }}>热门标签:</span>
          {['小红书', '抖音', '客服', '翻译', '编程'].map(tag => (
            <Tag key={tag} style={{ cursor: 'pointer' }} onClick={() => setSearchText(tag)}>#{tag}</Tag>
          ))}
        </div>
      </Card>

      {/* 智能体列表 */}
      <Row gutter={[16, 16]}>
        {filteredAgents.map(agent => (
          <Col span={8} key={agent.id}>
            <Card
              hoverable
              style={{ borderRadius: 12, height: '100%' }}
              styles={{ body: { padding: 24 } }}
              onClick={() => navigate(`/agents/${agent.id}`)}
            >
              {/* 收藏按钮 */}
              <Tooltip title={favorites.has(agent.id) ? '取消收藏' : '收藏'}>
                <Button
                  type="text"
                  icon={favorites.has(agent.id) ? 
                    <HeartFilled style={{ color: '#ff4d4f', fontSize: 18 }} /> : 
                    <HeartOutlined style={{ fontSize: 18 }} />
                  }
                  style={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}
                  onClick={(e) => handleToggleFavorite(e, agent.id)}
                />
              </Tooltip>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                <Avatar size={64} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: 32 }}>
                  {agent.avatar}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, marginBottom: 4 }}>{agent.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Rate disabled defaultValue={agent.rating} style={{ fontSize: 12 }} />
                    <span style={{ color: '#8c8c8c', fontSize: 12 }}>{agent.rating} ({agent.reviews})</span>
                  </div>
                </div>
              </div>

              <p style={{ color: '#595959', marginBottom: 12, minHeight: 44 }}>{agent.desc}</p>

              <div style={{ marginBottom: 12 }}>
                {agent.capabilities.map(cap => (
                  <Tag key={cap} color="purple" style={{ marginBottom: 4 }}>{cap}</Tag>
                ))}
              </div>

              <div style={{ marginBottom: 16 }}>
                {agent.tags.map(tag => (
                  <Tag key={tag} style={{ marginBottom: 4 }}>#{tag}</Tag>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', gap: 16, color: '#8c8c8c', fontSize: 13 }}>
                  <span><ThunderboltOutlined /> {agent.credits}积分/次</span>
                  <span><MessageOutlined /> {agent.usage.toLocaleString()}次对话</span>
                </div>
                <Button type="primary" onClick={(e) => { e.stopPropagation(); navigate(`/agents/${agent.id}`) }}>
                  开始对话
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
