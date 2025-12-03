import { Card, Row, Col, Button, Statistic, Tag, Progress } from 'antd'
import { 
  RocketOutlined, 
  FileTextOutlined, 
  ThunderboltOutlined,
  StarFilled,
  FireOutlined,
  TrophyOutlined,
  RiseOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const quickActions = [
    { 
      icon: <RocketOutlined />, 
      title: '一键创作', 
      desc: '快速生成优质内容',
      path: '/create', 
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      icon: <FileTextOutlined />, 
      title: 'AI选题', 
      desc: '智能推荐热门话题',
      path: '/create', 
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      icon: <ThunderboltOutlined />, 
      title: '我的工作流', 
      desc: '管理自动化流程',
      path: '/workflows', 
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
  ]

  const tools = [
    { 
      name: '文案提取工具', 
      desc: '从视频中智能提取文案内容，支持多平台格式', 
      usage: 2934, 
      icon: '📝',
      trend: '+12%',
      color: '#1890ff'
    },
    { 
      name: '文案二创工具', 
      desc: '基于原始内容AI生成创新文案', 
      usage: 4521, 
      icon: '✨',
      trend: '+28%',
      color: '#52c41a'
    },
    { 
      name: '账号拆解工具', 
      desc: '深度分析目标账号运营策略与数据', 
      usage: 1876, 
      icon: '📊',
      trend: '+8%',
      color: '#722ed1'
    },
    { 
      name: '视频拆解工具', 
      desc: '全方位分析视频内容结构与亮点', 
      usage: 3245, 
      icon: '🎬',
      trend: '+15%',
      color: '#fa8c16'
    },
  ]

  const workflows = [
    { 
      name: '爆款文案生成器', 
      rating: 4.8, 
      usage: 12340, 
      tags: ['文案', '短视频', '热门'],
      desc: '基于大数据分析的爆款文案生成',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      name: '视频脚本生成器', 
      rating: 4.9, 
      usage: 9801, 
      tags: ['脚本', 'AI生成', '推荐'],
      desc: '智能生成专业视频拍摄脚本',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      name: '数据分析助手', 
      rating: 4.7, 
      usage: 7562, 
      tags: ['数据', '分析', '洞察'],
      desc: '全面的运营数据分析与建议',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
  ]

  const stats = [
    { title: '今日创作', value: 128, prefix: <RocketOutlined />, suffix: '篇' },
    { title: '本周涨粉', value: 3542, prefix: <RiseOutlined />, suffix: '人' },
    { title: '工作流运行', value: 89, prefix: <ThunderboltOutlined />, suffix: '次' },
    { title: '成就解锁', value: 15, prefix: <TrophyOutlined />, suffix: '个' },
  ]

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 16,
        padding: '48px 40px',
        marginBottom: 32,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: 42, 
            fontWeight: 700, 
            marginBottom: 16,
            color: '#fff'
          }}>
            欢迎回来！👋
          </h1>
          <p style={{ 
            fontSize: 18, 
            marginBottom: 32,
            opacity: 0.95
          }}>
            让AI助力你的内容创作，开启高效运营之旅
          </p>
          <Button 
            type="primary" 
            size="large"
            icon={<RocketOutlined />}
            onClick={() => navigate('/create')}
            style={{ 
              height: 48,
              fontSize: 16,
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            开始创作
          </Button>
        </div>
        <div style={{
          position: 'absolute',
          right: -50,
          top: -50,
          width: 300,
          height: 300,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }} />
      </div>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 32 }}>
        {stats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card 
              bordered={false}
              style={{ 
                borderRadius: 12,
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                valueStyle={{ color: '#1890ff', fontSize: 28, fontWeight: 600 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ 
          fontSize: 24, 
          fontWeight: 600, 
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <ThunderboltOutlined style={{ color: '#1890ff' }} />
          快速开始
        </h2>
        <Row gutter={16}>
          {quickActions.map((action, index) => (
            <Col span={8} key={index}>
              <Card 
                hoverable
                onClick={() => navigate(action.path)}
                style={{ 
                  borderRadius: 12,
                  border: 'none',
                  background: action.gradient,
                  color: '#fff',
                  cursor: 'pointer',
                  height: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
                bodyStyle={{ padding: 32 }}
              >
                <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.9 }}>
                  {action.icon}
                </div>
                <h3 style={{ 
                  color: '#fff', 
                  fontSize: 20, 
                  fontWeight: 600,
                  marginBottom: 8 
                }}>
                  {action.title}
                </h3>
                <p style={{ 
                  color: 'rgba(255,255,255,0.85)', 
                  margin: 0,
                  fontSize: 14 
                }}>
                  {action.desc}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Tools Section */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 20 
        }}>
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 600,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <FireOutlined style={{ color: '#ff4d4f' }} />
            热门工具
          </h2>
          <Button 
            type="link" 
            onClick={() => navigate('/tools')}
            icon={<ArrowRightOutlined />}
            iconPosition="end"
            style={{ fontSize: 15 }}
          >
            查看全部
          </Button>
        </div>
        <Row gutter={[16, 16]}>
          {tools.map((tool, index) => (
            <Col span={6} key={index}>
              <Card 
                hoverable 
                style={{ 
                  borderRadius: 12,
                  border: '1px solid #f0f0f0',
                  height: '100%',
                  transition: 'all 0.3s'
                }}
                bodyStyle={{ padding: 24 }}
              >
                <div style={{ 
                  fontSize: 40, 
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>{tool.icon}</span>
                  <Tag color="success" style={{ margin: 0 }}>{tool.trend}</Tag>
                </div>
                <h3 style={{ 
                  fontSize: 16, 
                  fontWeight: 600,
                  marginBottom: 8,
                  color: '#262626'
                }}>
                  {tool.name}
                </h3>
                <p style={{ 
                  color: '#8c8c8c', 
                  fontSize: 13, 
                  marginBottom: 16,
                  lineHeight: 1.6,
                  minHeight: 40
                }}>
                  {tool.desc}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: 12,
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <span style={{ fontSize: 13, color: '#8c8c8c' }}>
                    {tool.usage.toLocaleString()} 次使用
                  </span>
                  <Button 
                    type="primary" 
                    size="small"
                    style={{ 
                      borderRadius: 6,
                      background: tool.color,
                      borderColor: tool.color
                    }}
                  >
                    使用
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Workflows Section */}
      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 20 
        }}>
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 600,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <TrophyOutlined style={{ color: '#faad14' }} />
            精选工作流
          </h2>
          <Button 
            type="link" 
            onClick={() => navigate('/workflows')}
            icon={<ArrowRightOutlined />}
            iconPosition="end"
            style={{ fontSize: 15 }}
          >
            查看全部
          </Button>
        </div>
        <Row gutter={[16, 16]}>
          {workflows.map((workflow, index) => (
            <Col span={8} key={index}>
              <Card 
                hoverable 
                style={{ 
                  borderRadius: 12,
                  border: 'none',
                  overflow: 'hidden',
                  height: '100%'
                }}
                bodyStyle={{ padding: 0 }}
              >
                <div style={{ 
                  background: workflow.gradient,
                  padding: '24px 24px 16px',
                  color: '#fff'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8, 
                    marginBottom: 8 
                  }}>
                    <FireOutlined style={{ fontSize: 20 }} />
                    <h3 style={{ 
                      margin: 0, 
                      color: '#fff',
                      fontSize: 18,
                      fontWeight: 600
                    }}>
                      {workflow.name}
                    </h3>
                  </div>
                  <p style={{ 
                    margin: 0, 
                    opacity: 0.9,
                    fontSize: 13,
                    lineHeight: 1.6
                  }}>
                    {workflow.desc}
                  </p>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ marginBottom: 16 }}>
                    {workflow.tags.map(tag => (
                      <Tag key={tag} style={{ marginBottom: 4 }}>{tag}</Tag>
                    ))}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <StarFilled style={{ color: '#faad14', fontSize: 16 }} />
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{workflow.rating}</span>
                    </div>
                    <span style={{ fontSize: 13, color: '#8c8c8c' }}>
                      {workflow.usage.toLocaleString()} 次使用
                    </span>
                  </div>
                  <Button 
                    type="primary" 
                    block
                    icon={<CheckCircleOutlined />}
                    style={{ borderRadius: 8, height: 40 }}
                  >
                    立即使用
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}
