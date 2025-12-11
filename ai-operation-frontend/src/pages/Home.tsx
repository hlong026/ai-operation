import { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Statistic, Tag, Avatar } from 'antd'
import {
  RocketOutlined,
  ThunderboltOutlined,
  StarFilled,
  FireOutlined,
  TrophyOutlined,
  ArrowRightOutlined,
  UserAddOutlined,
  CheckCircleFilled,
  ToolOutlined,
  EditOutlined,
  RobotOutlined,
  MessageOutlined,
  HeartFilled,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import * as favoriteService from '../services/favoriteService'

export default function Home() {
  const { isAuthenticated, profile } = useAuth()

  if (!isAuthenticated) {
    return <GuestHome />
  }

  return <AuthenticatedHome profile={profile} />
}

// ==================== 游客首页 ====================
function GuestHome() {
  const navigate = useNavigate()

  // 核心功能
  const coreFeatures = [
    {
      icon: <RobotOutlined />,
      title: '智能体商店',
      desc: 'AI 智能助手，对话即服务',
      gradient: 'linear-gradient(135deg, #722ed1 0%, #eb2f96 100%)',
      path: '/agents',
    },
    {
      icon: <ThunderboltOutlined />,
      title: '工作流商店',
      desc: '海量 AI 工作流，一键使用',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      path: '/workflows',
    },
    {
      icon: <ToolOutlined />,
      title: '工具箱',
      desc: '实用工具集合，提升效率',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      path: '/tools',
    },
    {
      icon: <EditOutlined />,
      title: '创作者中心',
      desc: '上传分享你的作品',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      path: '/creator',
    },
  ]

  // 热门智能体
  const agents = [
    {
      name: '小红书文案助手',
      avatar: '🤖',
      desc: '专业的小红书文案创作助手',
      rating: 4.9,
      usage: 5234,
      gradient: 'linear-gradient(135deg, #722ed1 0%, #eb2f96 100%)',
    },
    {
      name: '抖音脚本生成器',
      avatar: '🎬',
      desc: '一键生成短视频脚本',
      rating: 4.8,
      usage: 3856,
      gradient: 'linear-gradient(135deg, #13c2c2 0%, #52c41a 100%)',
    },
    {
      name: '智能客服助手',
      avatar: '💬',
      desc: '7x24小时智能客服',
      rating: 4.7,
      usage: 8921,
      gradient: 'linear-gradient(135deg, #fa8c16 0%, #faad14 100%)',
    },
  ]

  // 热门工作流
  const workflows = [
    {
      name: '爆款文案生成器',
      desc: '基于热点话题，自动生成吸引眼球的短视频文案',
      rating: 4.8,
      usage: 12340,
      tags: ['文案', '短视频', '热门'],
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      name: '视频脚本生成器',
      desc: '输入主题，自动生成完整的视频脚本和分镜',
      rating: 4.9,
      usage: 9801,
      tags: ['脚本', 'AI生成', '推荐'],
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      name: '竞品账号分析',
      desc: '深度分析竞品账号，学习爆款内容规律',
      rating: 4.7,
      usage: 7562,
      tags: ['数据', '分析', '洞察'],
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  ]

  // 用户评价
  const testimonials = [
    {
      avatar: '👩',
      name: '小红书博主 @美妆小达人',
      content: '用了2周，粉丝从3000涨到2万！文案生成器太好用了',
      result: '涨粉 17000+',
    },
    {
      avatar: '👨',
      name: '抖音创作者 @知识分享官',
      content: '以前一条视频要准备3天，现在2小时就能搞定',
      result: '效率提升 10倍',
    },
    {
      avatar: '👩‍💼',
      name: 'MCN运营总监 @星辰传媒',
      content: '团队20个账号，用这个系统管理效率翻倍',
      result: '管理 20+ 账号',
    },
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 20,
          padding: '80px 60px',
          marginBottom: 60,
          color: '#fff',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', right: -100, top: -100, width: 400, height: 400, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', left: -50, bottom: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.08)', borderRadius: '50%', filter: 'blur(40px)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 20 }}>
            <Tag color="rgba(255,255,255,0.2)" style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '4px 16px', fontSize: 14 }}>
              🔥 已有 10,000+ 创作者在使用
            </Tag>
          </div>

          <h1 style={{ fontSize: 52, fontWeight: 800, marginBottom: 20, color: '#fff', lineHeight: 1.2 }}>
            AI 运营工具平台
          </h1>

          <p style={{ fontSize: 22, marginBottom: 40, opacity: 0.95, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
            工作流商店 · 工具箱 · 创作者中心
            <br />
            让 AI 为你的内容创作赋能
          </p>

          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 40 }}>
            <Button
              type="primary"
              size="large"
              icon={<UserAddOutlined />}
              onClick={() => navigate('/register')}
              style={{ height: 56, fontSize: 18, padding: '0 40px', background: '#fff', color: '#667eea', border: 'none', fontWeight: 600, borderRadius: 28, boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
            >
              免费注册，送100积分
            </Button>
            <Button
              size="large"
              onClick={() => navigate('/workflows')}
              style={{ height: 56, fontSize: 18, padding: '0 40px', background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.5)', borderRadius: 28 }}
            >
              浏览工作流
            </Button>
          </div>

          <Row gutter={48} justify="center">
            <Col><Statistic title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>工作流数量</span>} value={500} suffix="+" valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }} /></Col>
            <Col><Statistic title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>工具数量</span>} value={100} suffix="+" valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }} /></Col>
            <Col><Statistic title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>用户好评率</span>} value={98} suffix="%" valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }} /></Col>
          </Row>
        </div>
      </div>


      {/* 核心功能 Section */}
      <div style={{ marginBottom: 80 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16, color: '#1a1a2e' }}>四大核心功能</h2>
          <p style={{ fontSize: 18, color: '#666', maxWidth: 500, margin: '0 auto' }}>一站式 AI 运营工具平台，满足你的所有需求</p>
        </div>

        <Row gutter={24}>
          {coreFeatures.map((feature, index) => (
            <Col span={6} key={index}>
              <div
                style={{
                  background: feature.gradient,
                  borderRadius: 20,
                  padding: '36px 24px',
                  height: 240,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                }}
                onClick={() => navigate(feature.path)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)' }}
              >
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, backdropFilter: 'blur(10px)' }}>
                  <span style={{ fontSize: 28, color: '#fff' }}>{feature.icon}</span>
                </div>
                <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{feature.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, margin: 0 }}>{feature.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* 热门智能体 Section */}
      <div style={{ marginBottom: 80 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}><RobotOutlined style={{ color: '#722ed1', marginRight: 12 }} />热门智能体</h2>
            <p style={{ fontSize: 16, color: '#666', margin: 0 }}>AI 智能助手，对话即服务</p>
          </div>
          <Button type="link" size="large" onClick={() => navigate('/agents')}>查看全部 <ArrowRightOutlined /></Button>
        </div>

        <Row gutter={24}>
          {agents.map((agent, index) => (
            <Col span={8} key={index}>
              <Card hoverable style={{ borderRadius: 16, overflow: 'hidden', height: '100%', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} styles={{ body: { padding: 0 } }}>
                <div style={{ background: agent.gradient, padding: '28px 24px', color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Avatar size={56} style={{ background: 'rgba(255,255,255,0.2)', fontSize: 28 }}>{agent.avatar}</Avatar>
                    <div>
                      <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: 0 }}>{agent.name}</h3>
                      <p style={{ opacity: 0.9, margin: '4px 0 0', fontSize: 13 }}>{agent.desc}</p>
                    </div>
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><StarFilled style={{ color: '#faad14' }} /><span style={{ fontWeight: 600 }}>{agent.rating}</span></div>
                    <span style={{ color: '#8c8c8c', fontSize: 13 }}><MessageOutlined /> {agent.usage.toLocaleString()} 次对话</span>
                  </div>
                  <Button type="primary" block onClick={() => navigate('/register')} style={{ borderRadius: 8, height: 40, background: '#722ed1', borderColor: '#722ed1' }}>开始对话</Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 热门工作流 Section */}
      <div style={{ marginBottom: 80 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}><FireOutlined style={{ color: '#ff4d4f', marginRight: 12 }} />热门工作流</h2>
            <p style={{ fontSize: 16, color: '#666', margin: 0 }}>看看大家都在用什么</p>
          </div>
          <Button type="link" size="large" onClick={() => navigate('/workflows')}>查看全部 <ArrowRightOutlined /></Button>
        </div>

        <Row gutter={24}>
          {workflows.map((workflow, index) => (
            <Col span={8} key={index}>
              <Card hoverable style={{ borderRadius: 16, overflow: 'hidden', height: '100%', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} styles={{ body: { padding: 0 } }}>
                <div style={{ background: workflow.gradient, padding: '28px 24px', color: '#fff' }}>
                  <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{workflow.name}</h3>
                  <p style={{ opacity: 0.9, margin: 0, fontSize: 14, lineHeight: 1.6 }}>{workflow.desc}</p>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ marginBottom: 16 }}>{workflow.tags.map((tag) => <Tag key={tag} style={{ marginBottom: 4 }}>{tag}</Tag>)}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><StarFilled style={{ color: '#faad14' }} /><span style={{ fontWeight: 600 }}>{workflow.rating}</span></div>
                    <span style={{ color: '#8c8c8c', fontSize: 13 }}>{workflow.usage.toLocaleString()} 次使用</span>
                  </div>
                  <Button type="primary" block onClick={() => navigate('/register')} style={{ borderRadius: 8, height: 40 }}>登录后使用</Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 用户评价 Section */}
      <div style={{ marginBottom: 80 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}><TrophyOutlined style={{ color: '#faad14', marginRight: 12 }} />用户真实反馈</h2>
          <p style={{ fontSize: 18, color: '#666' }}>看看他们怎么说</p>
        </div>

        <Row gutter={24}>
          {testimonials.map((item, index) => (
            <Col span={8} key={index}>
              <Card style={{ borderRadius: 16, height: '100%', border: '2px solid #f0f0f0' }} styles={{ body: { padding: 28 } }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 40 }}>{item.avatar}</div>
                  <div><div style={{ fontWeight: 600 }}>{item.name}</div></div>
                </div>
                <p style={{ fontSize: 15, color: '#595959', lineHeight: 1.8, marginBottom: 16, minHeight: 54 }}>"{item.content}"</p>
                <div style={{ background: '#f6ffed', padding: '8px 16px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircleFilled style={{ color: '#52c41a' }} />
                  <span style={{ color: '#389e0d', fontWeight: 600 }}>{item.result}</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 最终 CTA Section */}
      <Card style={{ textAlign: 'center', borderRadius: 20, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', marginBottom: 40 }} styles={{ body: { padding: '60px 40px' } }}>
        <h2 style={{ fontSize: 36, marginBottom: 16, color: '#fff', fontWeight: 700 }}>准备好开始了吗？</h2>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', marginBottom: 32 }}>注册即送 100 积分，立即体验 AI 运营工具的魅力</p>
        <Button
          type="primary"
          size="large"
          icon={<RocketOutlined />}
          onClick={() => navigate('/register')}
          style={{ height: 56, fontSize: 18, padding: '0 48px', background: '#fff', color: '#667eea', border: 'none', fontWeight: 600, borderRadius: 28, boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
        >
          免费开始使用
        </Button>
      </Card>
    </div>
  )
}


// ==================== 已登录用户首页 ====================
function AuthenticatedHome({ profile }: { profile: any }) {
  const navigate = useNavigate()
  const [myFavorites, setMyFavorites] = useState<any[]>([])

  // 所有资源数据映射（与各商店页面保持一致）
  const allResources: Record<string, Record<string, any>> = {
    agent: {
      '1': { id: '1', name: '小红书爆款文案助手', avatar: '🤖', type: 'agent', credits: 8 },
      '2': { id: '2', name: '抖音脚本生成器', avatar: '🎬', type: 'agent', credits: 10 },
      '3': { id: '3', name: '智能客服助手', avatar: '💬', type: 'agent', credits: 5 },
      '4': { id: '4', name: '数据分析专家', avatar: '📊', type: 'agent', credits: 15 },
      '5': { id: '5', name: '英语翻译助手', avatar: '🌍', type: 'agent', credits: 3 },
      '6': { id: '6', name: '代码助手', avatar: '💻', type: 'agent', credits: 12 },
    },
    workflow: {
      '1': { id: '1', name: '爆款短视频文案生成器', avatar: '📝', type: 'workflow', credits: 5 },
      '2': { id: '2', name: '账号数据分析助手', avatar: '📊', type: 'workflow', credits: 10 },
      '3': { id: '3', name: '视频脚本生成器', avatar: '🎬', type: 'workflow', credits: 8 },
      '4': { id: '4', name: '批量视频生成工作流', avatar: '🎥', type: 'workflow', credits: 15 },
      '5': { id: '5', name: '小红书爆款笔记生成', avatar: '📕', type: 'workflow', credits: 6 },
      '6': { id: '6', name: '营销文案批量生成', avatar: '📢', type: 'workflow', credits: 4 },
    },
    tool: {
      '1': { id: '1', name: '文案提取工具', avatar: '📝', type: 'tool', credits: 3 },
      '2': { id: '2', name: '文案二创工具', avatar: '✨', type: 'tool', credits: 5 },
      '3': { id: '3', name: '账号拆解工具', avatar: '📊', type: 'tool', credits: 8 },
      '4': { id: '4', name: '视频拆解工具', avatar: '🎬', type: 'tool', credits: 6 },
      '5': { id: '5', name: '图片处理工具', avatar: '🖼️', type: 'tool', credits: 2 },
      '6': { id: '6', name: '数据导出工具', avatar: '📥', type: 'tool', credits: 1 },
      '7': { id: '7', name: '标题生成器', avatar: '💡', type: 'tool', credits: 2 },
      '8': { id: '8', name: '视频转文字', avatar: '🎙️', type: 'tool', credits: 4 },
    },
  }

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      const favorites = await favoriteService.getFavorites()
      console.log('收藏数据:', favorites) // 调试用
      // 将收藏映射到实际资源
      const items = favorites.map(fav => {
        const resourceMap = allResources[fav.resource_type]
        if (!resourceMap) return null
        const resource = resourceMap[fav.resource_id]
        return resource ? { ...resource, favoriteId: fav.id } : null
      }).filter(Boolean)
      console.log('映射后的收藏:', items) // 调试用
      setMyFavorites(items)
    } catch (err) {
      console.error('加载收藏失败:', err)
    }
  }

  const getResourcePath = (type: string, id: string) => {
    switch (type) {
      case 'agent': return `/agents/${id}`
      case 'workflow': return `/workflows/${id}/execute`
      case 'tool': return `/tools/${id}`
      default: return '/'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'agent': return { label: '智能体', color: '#722ed1' }
      case 'workflow': return { label: '工作流', color: '#1890ff' }
      case 'tool': return { label: '工具', color: '#52c41a' }
      default: return { label: '', color: '' }
    }
  }

  const quickActions = [
    {
      icon: <RobotOutlined />,
      title: '智能体商店',
      desc: 'AI 智能助手，对话即服务',
      path: '/agents',
      gradient: 'linear-gradient(135deg, #722ed1 0%, #eb2f96 100%)',
    },
    {
      icon: <ThunderboltOutlined />,
      title: '工作流商店',
      desc: '浏览和使用 AI 工作流',
      path: '/workflows',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      icon: <ToolOutlined />,
      title: '工具箱',
      desc: '使用各种实用工具',
      path: '/tools',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      icon: <EditOutlined />,
      title: '创作者中心',
      desc: '上传和管理你的作品',
      path: '/creator',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  ]

  const tools = [
    { name: '文案提取工具', desc: '从视频中智能提取文案内容', usage: 2934, icon: '📝', trend: '+12%', color: '#1890ff' },
    { name: '文案二创工具', desc: '基于原始内容AI生成创新文案', usage: 4521, icon: '✨', trend: '+28%', color: '#52c41a' },
    { name: '账号拆解工具', desc: '深度分析目标账号运营策略', usage: 1876, icon: '📊', trend: '+8%', color: '#722ed1' },
    { name: '视频拆解工具', desc: '全方位分析视频内容结构', usage: 3245, icon: '🎬', trend: '+15%', color: '#fa8c16' },
  ]

  const stats = [
    { title: '工作流使用', value: 0, prefix: <ThunderboltOutlined />, suffix: '次' },
    { title: '工具使用', value: 0, prefix: <ToolOutlined />, suffix: '次' },
    { title: '我的作品', value: 0, prefix: <EditOutlined />, suffix: '个' },
    { title: '剩余积分', value: profile?.credits ?? 0, prefix: <TrophyOutlined />, suffix: '' },
  ]

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 16, padding: '48px 40px', marginBottom: 32, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 42, fontWeight: 700, marginBottom: 16, color: '#fff' }}>
            欢迎回来，{profile?.nickname || profile?.email?.split('@')[0]}！👋
          </h1>
          <p style={{ fontSize: 18, marginBottom: 32, opacity: 0.95 }}>探索 AI 工作流和工具，或者上传你自己的作品</p>
          <Button
            type="primary"
            size="large"
            icon={<ThunderboltOutlined />}
            onClick={() => navigate('/workflows')}
            style={{ height: 48, fontSize: 16, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}
          >
            浏览工作流
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 32 }}>
        {stats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <Statistic title={stat.title} value={stat.value} prefix={stat.prefix} suffix={stat.suffix} valueStyle={{ color: '#1890ff', fontSize: 28, fontWeight: 600 }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 我的常用 */}
      {myFavorites.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <HeartFilled style={{ color: '#ff4d4f' }} />我的常用
            </h2>
          </div>
          <Row gutter={[16, 16]}>
            {myFavorites.slice(0, 8).map((item, index) => {
              const typeInfo = getTypeLabel(item.type)
              return (
                <Col span={6} key={index}>
                  <Card 
                    hoverable 
                    style={{ borderRadius: 12 }}
                    styles={{ body: { padding: 20 } }}
                    onClick={() => navigate(getResourcePath(item.type, item.id))}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Avatar 
                        size={48} 
                        style={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                          fontSize: 24,
                          flexShrink: 0
                        }}
                      >
                        {item.avatar}
                      </Avatar>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ 
                          margin: 0, 
                          marginBottom: 4,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.name}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Tag color={typeInfo.color} style={{ margin: 0 }}>{typeInfo.label}</Tag>
                          <span style={{ color: '#8c8c8c', fontSize: 12 }}>{item.credits}积分</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThunderboltOutlined style={{ color: '#1890ff' }} />快速开始
        </h2>
        <Row gutter={16}>
          {quickActions.map((action, index) => (
            <Col span={6} key={index}>
              <div
                onClick={() => navigate(action.path)}
                style={{
                  borderRadius: 16,
                  background: action.gradient,
                  padding: '32px 24px',
                  cursor: 'pointer',
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)' }}
              >
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, backdropFilter: 'blur(10px)' }}>
                  <div style={{ fontSize: 24, color: '#fff' }}>{action.icon}</div>
                </div>
                <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 6, margin: 0 }}>{action.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: 13, lineHeight: 1.5 }}>{action.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Tools Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FireOutlined style={{ color: '#ff4d4f' }} />热门工具
          </h2>
          <Button type="link" onClick={() => navigate('/tools')} icon={<ArrowRightOutlined />} iconPosition="end">查看全部</Button>
        </div>
        <Row gutter={[16, 16]}>
          {tools.map((tool, index) => (
            <Col span={6} key={index}>
              <Card hoverable style={{ borderRadius: 12, height: '100%' }} styles={{ body: { padding: 24 } }}>
                <div style={{ fontSize: 40, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{tool.icon}</span>
                  <Tag color="success">{tool.trend}</Tag>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{tool.name}</h3>
                <p style={{ color: '#8c8c8c', fontSize: 13, marginBottom: 16, minHeight: 40 }}>{tool.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                  <span style={{ fontSize: 13, color: '#8c8c8c' }}>{tool.usage.toLocaleString()} 次使用</span>
                  <Button type="primary" size="small" style={{ borderRadius: 6, background: tool.color, borderColor: tool.color }}>使用</Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}
