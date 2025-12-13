import { useState, useEffect } from 'react'
import { 
  Card, Row, Col, Menu, Statistic, Tag, Button, Table, Avatar, 
  List, Empty, Tabs, Modal, Form, Input, Select, message, InputNumber
} from 'antd'
import { 
  DashboardOutlined, HeartOutlined, HistoryOutlined, EditOutlined,
  WalletOutlined, SettingOutlined, ThunderboltOutlined, TrophyOutlined,
  RobotOutlined, NodeIndexOutlined, ToolOutlined, PlusOutlined,
  EyeOutlined, DeleteOutlined, BankOutlined
} from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import * as favoriteService from '../services/favoriteService'

const { TextArea } = Input

export default function UserCenter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { profile } = useAuth()
  const [activeMenu, setActiveMenu] = useState(searchParams.get('tab') || 'overview')

  const handleMenuClick = (key: string) => {
    setActiveMenu(key)
    setSearchParams({ tab: key })
  }

  const menuItems = [
    { key: 'overview', icon: <DashboardOutlined />, label: '概览' },
    { key: 'favorites', icon: <HeartOutlined />, label: '我的收藏' },
    { key: 'history', icon: <HistoryOutlined />, label: '使用记录' },
    { type: 'divider' as const },
    { key: 'creator', icon: <EditOutlined />, label: '创作者中心', children: [
      { key: 'my-works', label: '我的作品' },
      { key: 'earnings', label: '收益管理' },
      { key: 'withdrawals', label: '提现记录' },
    ]},
    { type: 'divider' as const },
    { key: 'credits', icon: <WalletOutlined />, label: '积分明细' },
    { key: 'settings', icon: <SettingOutlined />, label: '账户设置' },
  ]

  const renderContent = () => {
    switch (activeMenu) {
      case 'overview': return <OverviewSection profile={profile} />
      case 'favorites': return <FavoritesSection />
      case 'history': return <HistorySection />
      case 'my-works': return <MyWorksSection />
      case 'earnings': return <EarningsSection profile={profile} />
      case 'withdrawals': return <WithdrawalsSection />
      case 'credits': return <CreditsSection />
      case 'settings': return <SettingsSection profile={profile} />
      default: return <OverviewSection profile={profile} />
    }
  }

  return (
    <div style={{ display: 'flex', gap: 24, maxWidth: 1400, margin: '0 auto' }}>
      {/* 左侧菜单 */}
      <Card style={{ width: 240, flexShrink: 0, height: 'fit-content' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar size={64} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: 28 }}>
            {profile?.nickname?.[0] || profile?.email?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <h3 style={{ margin: '12px 0 4px' }}>{profile?.nickname || profile?.email?.split('@')[0]}</h3>
          <Tag color={profile?.role === 'admin' ? 'red' : 'blue'}>
            {profile?.role === 'admin' ? '管理员' : '普通用户'}
          </Tag>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeMenu]}
          onClick={({ key }) => handleMenuClick(key)}
          items={menuItems}
          style={{ border: 'none' }}
        />
      </Card>

      {/* 右侧内容 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {renderContent()}
      </div>
    </div>
  )
}

// ==================== 概览 ====================
function OverviewSection({ profile }: { profile: any }) {
  const navigate = useNavigate()

  const stats = [
    { title: '积分余额', value: profile?.credits || 0, icon: <ThunderboltOutlined />, color: '#1890ff' },
    { title: '累计收益', value: profile?.total_earnings || 0, icon: <TrophyOutlined />, color: '#52c41a', suffix: '元' },
    { title: '待提现', value: profile?.pending_earnings || 0, icon: <WalletOutlined />, color: '#faad14', suffix: '元' },
    { title: '已提现', value: profile?.withdrawn_earnings || 0, icon: <BankOutlined />, color: '#722ed1', suffix: '元' },
  ]

  const quickActions = [
    { icon: <RobotOutlined />, title: '智能体商店', path: '/agents', color: '#722ed1' },
    { icon: <NodeIndexOutlined />, title: '工作流商店', path: '/workflows', color: '#1890ff' },
    { icon: <ToolOutlined />, title: '工具箱', path: '/tools', color: '#52c41a' },
    { icon: <PlusOutlined />, title: '上传作品', path: '/user?tab=my-works', color: '#fa8c16' },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>概览</h2>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic 
                title={stat.title} 
                value={stat.value} 
                prefix={stat.icon}
                suffix={stat.suffix}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 快捷入口 */}
      <Card title="快捷入口" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          {quickActions.map((action, index) => (
            <Col span={6} key={index}>
              <div
                onClick={() => navigate(action.path)}
                style={{
                  textAlign: 'center',
                  padding: 24,
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '1px solid #f0f0f0',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = action.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#f0f0f0'}
              >
                <div style={{ fontSize: 32, color: action.color, marginBottom: 8 }}>{action.icon}</div>
                <div>{action.title}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 会员信息 */}
      <Card title="会员信息">
        <Row gutter={24}>
          <Col span={12}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span>会员类型</span>
              <Tag color="gold">{profile?.membership_type === 'free' ? '免费用户' : profile?.membership_type}</Tag>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>会员到期</span>
              <span>{profile?.membership_expiry || '无'}</span>
            </div>
          </Col>
          <Col span={12}>
            <Button type="primary" block onClick={() => navigate('/pricing')}>
              升级会员
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

// ==================== 我的收藏 ====================
function FavoritesSection() {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

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
    },
    tool: {
      '1': { id: '1', name: '文案提取工具', avatar: '📝', type: 'tool', credits: 3 },
      '2': { id: '2', name: '文案二创工具', avatar: '✨', type: 'tool', credits: 5 },
      '3': { id: '3', name: '账号拆解工具', avatar: '📊', type: 'tool', credits: 8 },
    },
  }

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      const data = await favoriteService.getFavorites()
      const items = data.map(fav => {
        const resourceMap = allResources[fav.resource_type]
        const resource = resourceMap?.[fav.resource_id]
        return resource ? { ...resource, favoriteId: fav.id, createdAt: fav.created_at } : null
      }).filter(Boolean)
      setFavorites(items)
    } catch (err) {
      console.error('加载收藏失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (type: string, id: string) => {
    try {
      await favoriteService.removeFavorite(type as any, id)
      setFavorites(prev => prev.filter(f => !(f.type === type && f.id === id)))
      message.success('已取消收藏')
    } catch (err) {
      message.error('操作失败')
    }
  }

  const getPath = (type: string, id: string) => {
    switch (type) {
      case 'agent': return `/agents/${id}`
      case 'workflow': return `/workflows/${id}`
      case 'tool': return `/tools/${id}`
      default: return '/'
    }
  }

  const filteredFavorites = activeTab === 'all' 
    ? favorites 
    : favorites.filter(f => f.type === activeTab)

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>我的收藏</h2>
      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: 'all', label: `全部 (${favorites.length})` },
          { key: 'agent', label: `智能体 (${favorites.filter(f => f.type === 'agent').length})` },
          { key: 'workflow', label: `工作流 (${favorites.filter(f => f.type === 'workflow').length})` },
          { key: 'tool', label: `工具 (${favorites.filter(f => f.type === 'tool').length})` },
        ]}
      />

      {filteredFavorites.length === 0 ? (
        <Empty description="暂无收藏" />
      ) : (
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={filteredFavorites}
          loading={loading}
          renderItem={(item: any) => (
            <List.Item>
              <Card
                hoverable
                actions={[
                  <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(getPath(item.type, item.id))}>查看</Button>,
                  <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleRemoveFavorite(item.type, item.id)}>取消收藏</Button>,
                ]}
              >
                <Card.Meta
                  avatar={<Avatar size={48} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: 24 }}>{item.avatar}</Avatar>}
                  title={item.name}
                  description={
                    <div>
                      <Tag color={item.type === 'agent' ? 'purple' : item.type === 'workflow' ? 'blue' : 'green'}>
                        {item.type === 'agent' ? '智能体' : item.type === 'workflow' ? '工作流' : '工具'}
                      </Tag>
                      <span style={{ marginLeft: 8, color: '#8c8c8c' }}>{item.credits}积分/次</span>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  )
}

// ==================== 使用记录 ====================
function HistorySection() {
  const columns = [
    { title: '资源名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (t: string) => (
      <Tag color={t === 'agent' ? 'purple' : t === 'workflow' ? 'blue' : 'green'}>
        {t === 'agent' ? '智能体' : t === 'workflow' ? '工作流' : '工具'}
      </Tag>
    )},
    { title: '消耗积分', dataIndex: 'credits', key: 'credits' },
    { title: '使用时间', dataIndex: 'time', key: 'time' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => (
      <Tag color={s === 'success' ? 'success' : 'error'}>{s === 'success' ? '成功' : '失败'}</Tag>
    )},
  ]

  const data = [
    { key: '1', name: '小红书爆款文案助手', type: 'agent', credits: 8, time: '2024-12-11 14:30', status: 'success' },
    { key: '2', name: '爆款短视频文案生成器', type: 'workflow', credits: 5, time: '2024-12-11 10:15', status: 'success' },
    { key: '3', name: '文案提取工具', type: 'tool', credits: 3, time: '2024-12-10 16:45', status: 'success' },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>使用记录</h2>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

// ==================== 我的作品 ====================
function MyWorksSection() {
  const [activeTab, setActiveTab] = useState('agents')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadType, setUploadType] = useState<'agent' | 'workflow' | 'tool'>('agent')

  const openUploadModal = (type: 'agent' | 'workflow' | 'tool') => {
    setUploadType(type)
    setUploadModalOpen(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>我的作品</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openUploadModal(activeTab === 'agents' ? 'agent' : activeTab === 'workflows' ? 'workflow' : 'tool')}>
          上传作品
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: 'agents', label: '我的智能体', children: (
            <Empty description="暂无智能体">
              <Button type="primary" onClick={() => openUploadModal('agent')}>上传智能体</Button>
            </Empty>
          )},
          { key: 'workflows', label: '我的工作流', children: (
            <Empty description="暂无工作流">
              <Button type="primary" onClick={() => openUploadModal('workflow')}>上传工作流</Button>
            </Empty>
          )},
          { key: 'tools', label: '我的工具', children: (
            <Empty description="暂无工具">
              <Button type="primary" onClick={() => openUploadModal('tool')}>上传工具</Button>
            </Empty>
          )},
        ]}
      />

      <Modal
        title={`上传${uploadType === 'agent' ? '智能体' : uploadType === 'workflow' ? '工作流' : '工具'}`}
        open={uploadModalOpen}
        onCancel={() => setUploadModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item label="描述" name="description" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item label="分类" name="category" rules={[{ required: true }]}>
            <Select placeholder="请选择分类">
              <Select.Option value="内容创作">内容创作</Select.Option>
              <Select.Option value="数据分析">数据分析</Select.Option>
              <Select.Option value="视频制作">视频制作</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Webhook URL" name="webhook_url" rules={[{ required: true }]}>
            <Input placeholder="请输入 Webhook URL" />
          </Form.Item>
          <Form.Item label="使用说明" name="instructions">
            <TextArea rows={4} placeholder="请输入使用说明" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>提交审核</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

// ==================== 收益管理 ====================
function EarningsSection({ profile }: { profile: any }) {
  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>收益管理</h2>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="累计收益" value={profile?.total_earnings || 0} suffix="元" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="待提现" value={profile?.pending_earnings || 0} suffix="元" valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="已提现" value={profile?.withdrawn_earnings || 0} suffix="元" valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>

      <Card title="收益明细">
        <Empty description="暂无收益记录" />
      </Card>
    </div>
  )
}

// ==================== 提现记录 ====================
function WithdrawalsSection() {
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false)

  const columns = [
    { title: '提现金额', dataIndex: 'amount', key: 'amount', render: (v: number) => `¥${v}` },
    { title: '提现方式', dataIndex: 'method', key: 'method' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => (
      <Tag color={s === 'completed' ? 'success' : s === 'pending' ? 'processing' : 'error'}>
        {s === 'completed' ? '已完成' : s === 'pending' ? '处理中' : '已拒绝'}
      </Tag>
    )},
    { title: '申请时间', dataIndex: 'time', key: 'time' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>提现记录</h2>
        <Button type="primary" onClick={() => setWithdrawModalOpen(true)}>申请提现</Button>
      </div>

      <Table columns={columns} dataSource={[]} locale={{ emptyText: '暂无提现记录' }} />

      <Modal
        title="申请提现"
        open={withdrawModalOpen}
        onCancel={() => setWithdrawModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item label="提现金额" name="amount" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={10} placeholder="最低提现金额 10 元" />
          </Form.Item>
          <Form.Item label="提现方式" name="method" rules={[{ required: true }]}>
            <Select placeholder="请选择提现方式">
              <Select.Option value="alipay">支付宝</Select.Option>
              <Select.Option value="wechat">微信</Select.Option>
              <Select.Option value="bank">银行卡</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="收款账号" name="account" rules={[{ required: true }]}>
            <Input placeholder="请输入收款账号" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>提交申请</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

// ==================== 积分明细 ====================
function CreditsSection() {
  const navigate = useNavigate()

  const columns = [
    { title: '类型', dataIndex: 'type', key: 'type', render: (t: string) => (
      <Tag color={t === 'consume' ? 'red' : t === 'recharge' ? 'green' : 'blue'}>
        {t === 'consume' ? '消费' : t === 'recharge' ? '充值' : '赠送'}
      </Tag>
    )},
    { title: '积分变动', dataIndex: 'amount', key: 'amount', render: (v: number, r: any) => (
      <span style={{ color: r.type === 'consume' ? '#ff4d4f' : '#52c41a' }}>
        {r.type === 'consume' ? '-' : '+'}{v}
      </span>
    )},
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '时间', dataIndex: 'time', key: 'time' },
  ]

  const data = [
    { key: '1', type: 'consume', amount: 8, description: '使用智能体：小红书爆款文案助手', time: '2024-12-11 14:30' },
    { key: '2', type: 'consume', amount: 5, description: '使用工作流：爆款短视频文案生成器', time: '2024-12-11 10:15' },
    { key: '3', type: 'gift', amount: 100, description: '新用户注册赠送', time: '2024-12-10 09:00' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>积分明细</h2>
        <Button type="primary" onClick={() => navigate('/pricing')}>充值积分</Button>
      </div>

      <Table columns={columns} dataSource={data} />
    </div>
  )
}

// ==================== 账户设置 ====================
function SettingsSection({ profile }: { profile: any }) {
  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>账户设置</h2>
      
      <Card title="基本信息" style={{ marginBottom: 24 }}>
        <Form layout="vertical" initialValues={{ nickname: profile?.nickname, email: profile?.email }}>
          <Form.Item label="昵称" name="nickname">
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item label="邮箱" name="email">
            <Input disabled />
          </Form.Item>
          <Form.Item>
            <Button type="primary">保存修改</Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="安全设置">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 500 }}>修改密码</div>
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>定期修改密码可以提高账户安全性</div>
          </div>
          <Button>修改密码</Button>
        </div>
      </Card>
    </div>
  )
}
