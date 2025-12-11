import { useState, useEffect } from 'react'
import { Card, Tabs, Table, Button, Tag, Space, Modal, Form, Input, Select, Upload, message, Empty, Statistic, Row, Col, List, InputNumber } from 'antd'
import {
  PlusOutlined,
  UploadOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  WalletOutlined,
  DollarOutlined,
  BankOutlined,
  RobotOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useAuth } from '../contexts/AuthContext'
import { getCreatorEarnings, getWithdrawals, requestWithdrawal } from '../services/creditsService'
import type { CreditTransaction, Withdrawal } from '../types/database.types'

const { TextArea } = Input

interface WorkflowItem {
  id: string
  name: string
  type: 'coze' | 'n8n'
  category: string
  status: 'pending' | 'approved' | 'rejected'
  credits_per_call: number
  usageCount: number
  createdAt: string
  rejectReason?: string
}

interface ToolItem {
  id: string
  name: string
  category: string
  status: 'pending' | 'approved' | 'rejected'
  credits_per_call: number
  usageCount: number
  createdAt: string
  rejectReason?: string
}

interface AgentItem {
  id: string
  name: string
  category: string
  status: 'pending' | 'approved' | 'rejected'
  credits_per_call: number
  usageCount: number
  createdAt: string
  rejectReason?: string
}

export default function CreatorCenter() {
  const { profile, refreshProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [workflowModalOpen, setWorkflowModalOpen] = useState(false)
  const [toolModalOpen, setToolModalOpen] = useState(false)
  const [agentModalOpen, setAgentModalOpen] = useState(false)
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false)
  const [workflowForm] = Form.useForm()
  const [toolForm] = Form.useForm()
  const [agentForm] = Form.useForm()
  const [withdrawForm] = Form.useForm()
  const [earnings, setEarnings] = useState<CreditTransaction[]>([])
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loadingEarnings, setLoadingEarnings] = useState(false)

  // 模拟数据
  const [myWorkflows] = useState<WorkflowItem[]>([
    { id: '1', name: '爆款文案生成器', type: 'coze', category: '内容创作', status: 'approved', credits_per_call: 10, usageCount: 1234, createdAt: '2024-12-01' },
    { id: '2', name: '数据分析助手', type: 'n8n', category: '数据分析', status: 'pending', credits_per_call: 15, usageCount: 0, createdAt: '2024-12-08' },
    { id: '3', name: '视频脚本生成', type: 'coze', category: '内容创作', status: 'rejected', credits_per_call: 8, usageCount: 0, createdAt: '2024-12-05', rejectReason: 'Webhook URL 无效' },
  ])

  const [myTools] = useState<ToolItem[]>([
    { id: '1', name: '文案提取工具', category: '文案工具', status: 'approved', credits_per_call: 5, usageCount: 456, createdAt: '2024-12-01' },
    { id: '2', name: '图片压缩工具', category: '图片工具', status: 'pending', credits_per_call: 3, usageCount: 0, createdAt: '2024-12-07' },
  ])

  const [myAgents] = useState<AgentItem[]>([
    { id: '1', name: '小红书文案助手', category: '内容创作', status: 'approved', credits_per_call: 8, usageCount: 789, createdAt: '2024-12-01' },
    { id: '2', name: '智能客服助手', category: '客服', status: 'pending', credits_per_call: 5, usageCount: 0, createdAt: '2024-12-06' },
  ])

  useEffect(() => {
    if (profile?.id && activeTab === 'earnings') {
      loadEarningsData()
    }
  }, [profile?.id, activeTab])

  const loadEarningsData = async () => {
    if (!profile?.id) return
    setLoadingEarnings(true)
    try {
      const [earningsData, withdrawalsData] = await Promise.all([
        getCreatorEarnings(profile.id),
        getWithdrawals(profile.id)
      ])
      setEarnings(earningsData)
      setWithdrawals(withdrawalsData)
    } catch (error) {
      console.error('加载收益数据失败:', error)
    } finally {
      setLoadingEarnings(false)
    }
  }

  const statusConfig = {
    pending: { color: 'orange', icon: <ClockCircleOutlined />, text: '审核中' },
    approved: { color: 'green', icon: <CheckCircleOutlined />, text: '已通过' },
    rejected: { color: 'red', icon: <CloseCircleOutlined />, text: '已拒绝' },
  }

  const withdrawalStatusConfig = {
    pending: { color: 'orange', text: '待处理' },
    processing: { color: 'blue', text: '处理中' },
    completed: { color: 'green', text: '已完成' },
    rejected: { color: 'red', text: '已拒绝' },
  }


  const workflowColumns: ColumnsType<WorkflowItem> = [
    { title: '名称', dataIndex: 'name', key: 'name', render: (text) => <span style={{ fontWeight: 500 }}>{text}</span> },
    { title: '类型', dataIndex: 'type', key: 'type', render: (type) => <Tag color={type === 'coze' ? 'blue' : 'green'}>{type.toUpperCase()}</Tag> },
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '积分/次', dataIndex: 'credits_per_call', key: 'credits_per_call', render: (v) => <Tag color="blue">{v} 积分</Tag> },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (status: keyof typeof statusConfig, record) => (
        <Space>
          <Tag color={statusConfig[status].color} icon={statusConfig[status].icon}>{statusConfig[status].text}</Tag>
          {status === 'rejected' && record.rejectReason && (
            <span style={{ color: '#ff4d4f', fontSize: 12 }}>原因: {record.rejectReason}</span>
          )}
        </Space>
      ),
    },
    { title: '使用次数', dataIndex: 'usageCount', key: 'usageCount' },
    { title: '预估收益', key: 'earnings', render: (_, record) => <span style={{ color: '#52c41a' }}>{Math.floor(record.usageCount * record.credits_per_call * 0.7)} 积分</span> },
    {
      title: '操作', key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small">查看</Button>
          {record.status !== 'approved' && <Button type="text" icon={<EditOutlined />} size="small">编辑</Button>}
          <Button type="text" danger icon={<DeleteOutlined />} size="small">删除</Button>
        </Space>
      ),
    },
  ]

  const toolColumns: ColumnsType<ToolItem> = [
    { title: '名称', dataIndex: 'name', key: 'name', render: (text) => <span style={{ fontWeight: 500 }}>{text}</span> },
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '积分/次', dataIndex: 'credits_per_call', key: 'credits_per_call', render: (v) => <Tag color="blue">{v} 积分</Tag> },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (status: keyof typeof statusConfig, record) => (
        <Space>
          <Tag color={statusConfig[status].color} icon={statusConfig[status].icon}>{statusConfig[status].text}</Tag>
          {status === 'rejected' && record.rejectReason && (
            <span style={{ color: '#ff4d4f', fontSize: 12 }}>原因: {record.rejectReason}</span>
          )}
        </Space>
      ),
    },
    { title: '使用次数', dataIndex: 'usageCount', key: 'usageCount' },
    { title: '预估收益', key: 'earnings', render: (_, record) => <span style={{ color: '#52c41a' }}>{Math.floor(record.usageCount * record.credits_per_call * 0.7)} 积分</span> },
    {
      title: '操作', key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small">查看</Button>
          {record.status !== 'approved' && <Button type="text" icon={<EditOutlined />} size="small">编辑</Button>}
          <Button type="text" danger icon={<DeleteOutlined />} size="small">删除</Button>
        </Space>
      ),
    },
  ]

  const handleSubmitWorkflow = async (values: any) => {
    console.log('提交工作流:', values)
    message.success('工作流已提交，等待审核')
    setWorkflowModalOpen(false)
    workflowForm.resetFields()
  }

  const handleSubmitTool = async (values: any) => {
    console.log('提交工具:', values)
    message.success('工具已提交，等待审核')
    setToolModalOpen(false)
    toolForm.resetFields()
  }

  const handleWithdraw = async (values: any) => {
    const result = await requestWithdrawal(values.amount, values.payment_method, values.payment_account)
    if (result.success) {
      message.success('提现申请已提交')
      setWithdrawModalOpen(false)
      withdrawForm.resetFields()
      refreshProfile()
      loadEarningsData()
    } else {
      message.error(result.error || '提现失败')
    }
  }

  // 统计数据
  const stats = {
    totalWorkflows: myWorkflows.length,
    approvedWorkflows: myWorkflows.filter(w => w.status === 'approved').length,
    totalTools: myTools.length,
    approvedTools: myTools.filter(t => t.status === 'approved').length,
    totalUsage: myWorkflows.reduce((sum, w) => sum + w.usageCount, 0) + myTools.reduce((sum, t) => sum + t.usageCount, 0),
    totalEarnings: profile?.total_earnings || 0,
    pendingEarnings: profile?.pending_earnings || 0,
    withdrawnEarnings: profile?.withdrawn_earnings || 0,
  }


  const renderOverview = () => (
    <div>
      {/* 收益概览 */}
      <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Row gutter={24}>
          <Col span={6}>
            <Statistic title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>累计收益</span>} value={stats.totalEarnings} suffix="积分" valueStyle={{ color: '#fff', fontSize: 28 }} prefix={<DollarOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>可提现</span>} value={stats.pendingEarnings} suffix="积分" valueStyle={{ color: '#fff', fontSize: 28 }} prefix={<WalletOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>已提现</span>} value={stats.withdrawnEarnings} suffix="积分" valueStyle={{ color: '#fff', fontSize: 28 }} prefix={<BankOutlined />} />
          </Col>
          <Col span={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button size="large" onClick={() => setWithdrawModalOpen(true)} disabled={stats.pendingEarnings < 100} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none' }}>
              申请提现
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card><Statistic title="我的工作流" value={stats.totalWorkflows} prefix={<ThunderboltOutlined style={{ color: '#1890ff' }} />} suffix={<span style={{ fontSize: 14, color: '#52c41a' }}>/ {stats.approvedWorkflows} 已上架</span>} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="我的工具" value={stats.totalTools} prefix={<ToolOutlined style={{ color: '#722ed1' }} />} suffix={<span style={{ fontSize: 14, color: '#52c41a' }}>/ {stats.approvedTools} 已上架</span>} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="总使用次数" value={stats.totalUsage} prefix={<EyeOutlined style={{ color: '#fa8c16' }} />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="待审核" value={myWorkflows.filter(w => w.status === 'pending').length + myTools.filter(t => t.status === 'pending').length} prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />} /></Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Card title={<span><ThunderboltOutlined style={{ marginRight: 8 }} />上传工作流</span>} hoverable onClick={() => setWorkflowModalOpen(true)} style={{ cursor: 'pointer', textAlign: 'center', minHeight: 180 }}>
            <PlusOutlined style={{ fontSize: 40, color: '#1890ff', marginBottom: 12 }} />
            <p style={{ color: '#8c8c8c', fontSize: 13 }}>上传 Coze 或 n8n 工作流</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<span><RobotOutlined style={{ marginRight: 8 }} />上传智能体</span>} hoverable onClick={() => setAgentModalOpen(true)} style={{ cursor: 'pointer', textAlign: 'center', minHeight: 180 }}>
            <PlusOutlined style={{ fontSize: 40, color: '#722ed1', marginBottom: 12 }} />
            <p style={{ color: '#8c8c8c', fontSize: 13 }}>上传 AI 智能体</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<span><ToolOutlined style={{ marginRight: 8 }} />上传工具</span>} hoverable onClick={() => setToolModalOpen(true)} style={{ cursor: 'pointer', textAlign: 'center', minHeight: 180 }}>
            <PlusOutlined style={{ fontSize: 40, color: '#fa8c16', marginBottom: 12 }} />
            <p style={{ color: '#8c8c8c', fontSize: 13 }}>上传实用工具</p>
          </Card>
        </Col>
      </Row>
    </div>
  )

  const renderMyWorkflows = () => (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: '#8c8c8c' }}>共 {myWorkflows.length} 个工作流</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setWorkflowModalOpen(true)}>上传工作流</Button>
      </div>
      {myWorkflows.length > 0 ? (
        <Table columns={workflowColumns} dataSource={myWorkflows} rowKey="id" pagination={{ pageSize: 10 }} />
      ) : (
        <Empty description="暂无工作流" image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Button type="primary" onClick={() => setWorkflowModalOpen(true)}>上传第一个工作流</Button>
        </Empty>
      )}
    </div>
  )

  const renderMyTools = () => (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: '#8c8c8c' }}>共 {myTools.length} 个工具</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setToolModalOpen(true)}>上传工具</Button>
      </div>
      {myTools.length > 0 ? (
        <Table columns={toolColumns} dataSource={myTools} rowKey="id" pagination={{ pageSize: 10 }} />
      ) : (
        <Empty description="暂无工具" image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Button type="primary" onClick={() => setToolModalOpen(true)}>上传第一个工具</Button>
        </Empty>
      )}
    </div>
  )

  const renderEarnings = () => (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card><Statistic title="累计收益" value={stats.totalEarnings} suffix="积分" prefix={<DollarOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="可提现" value={stats.pendingEarnings} suffix="积分" prefix={<WalletOutlined style={{ color: '#1890ff' }} />} valueStyle={{ color: '#1890ff' }} /></Card>
        </Col>
        <Col span={8}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Statistic title="已提现" value={stats.withdrawnEarnings} suffix="积分" prefix={<BankOutlined />} />
              <Button type="primary" onClick={() => setWithdrawModalOpen(true)} disabled={stats.pendingEarnings < 100}>申请提现</Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="收益明细" style={{ marginBottom: 24 }}>
        <List
          loading={loadingEarnings}
          dataSource={earnings}
          locale={{ emptyText: '暂无收益记录' }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.description} description={new Date(item.created_at).toLocaleString()} />
              <span style={{ color: '#52c41a', fontWeight: 600 }}>+{item.creator_earn} 积分</span>
            </List.Item>
          )}
        />
      </Card>

      <Card title="提现记录">
        <List
          loading={loadingEarnings}
          dataSource={withdrawals}
          locale={{ emptyText: '暂无提现记录' }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={`提现 ${item.amount} 积分`}
                description={`${item.payment_method === 'alipay' ? '支付宝' : item.payment_method === 'wechat' ? '微信' : '银行卡'}: ${item.payment_account} | ${new Date(item.created_at).toLocaleString()}`}
              />
              <Tag color={withdrawalStatusConfig[item.status].color}>{withdrawalStatusConfig[item.status].text}</Tag>
            </List.Item>
          )}
        />
      </Card>
    </div>
  )

  const agentColumns: ColumnsType<AgentItem> = [
    { title: '名称', dataIndex: 'name', key: 'name', render: (text) => <span style={{ fontWeight: 500 }}>{text}</span> },
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '积分/次', dataIndex: 'credits_per_call', key: 'credits_per_call', render: (v) => <Tag color="purple">{v} 积分</Tag> },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (status: keyof typeof statusConfig, record) => (
        <Space>
          <Tag color={statusConfig[status].color} icon={statusConfig[status].icon}>{statusConfig[status].text}</Tag>
          {status === 'rejected' && record.rejectReason && (
            <span style={{ color: '#ff4d4f', fontSize: 12 }}>原因: {record.rejectReason}</span>
          )}
        </Space>
      ),
    },
    { title: '使用次数', dataIndex: 'usageCount', key: 'usageCount' },
    { title: '预估收益', key: 'earnings', render: (_, record) => <span style={{ color: '#52c41a' }}>{Math.floor(record.usageCount * record.credits_per_call * 0.7)} 积分</span> },
    {
      title: '操作', key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small">查看</Button>
          {record.status !== 'approved' && <Button type="text" icon={<EditOutlined />} size="small">编辑</Button>}
          <Button type="text" danger icon={<DeleteOutlined />} size="small">删除</Button>
        </Space>
      ),
    },
  ]

  const handleSubmitAgent = async (values: any) => {
    console.log('提交智能体:', values)
    message.success('智能体已提交，等待审核')
    setAgentModalOpen(false)
    agentForm.resetFields()
  }

  const renderMyAgents = () => (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: '#8c8c8c' }}>共 {myAgents.length} 个智能体</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setAgentModalOpen(true)}>上传智能体</Button>
      </div>
      {myAgents.length > 0 ? (
        <Table columns={agentColumns} dataSource={myAgents} rowKey="id" pagination={{ pageSize: 10 }} />
      ) : (
        <Empty description="暂无智能体" image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Button type="primary" onClick={() => setAgentModalOpen(true)}>上传第一个智能体</Button>
        </Empty>
      )}
    </div>
  )

  const tabItems = [
    { key: 'overview', label: <span><FileTextOutlined />总览</span>, children: renderOverview() },
    { key: 'workflows', label: <span><ThunderboltOutlined />我的工作流</span>, children: renderMyWorkflows() },
    { key: 'agents', label: <span><RobotOutlined />我的智能体</span>, children: renderMyAgents() },
    { key: 'tools', label: <span><ToolOutlined />我的工具</span>, children: renderMyTools() },
    { key: 'earnings', label: <span><WalletOutlined />收益管理</span>, children: renderEarnings() },
  ]


  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, marginBottom: 8 }}>创作者中心</h1>
        <p style={{ color: '#8c8c8c', margin: 0 }}>上传和管理你的工作流与工具，审核通过后将展示在首页供其他用户使用，每次被使用可获得 70% 积分分成</p>
      </div>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      {/* 上传工作流弹窗 */}
      <Modal title="上传工作流" open={workflowModalOpen} onCancel={() => setWorkflowModalOpen(false)} footer={null} width={640}>
        <Form form={workflowForm} layout="vertical" onFinish={handleSubmitWorkflow}>
          <Form.Item name="name" label="工作流名称" rules={[{ required: true, message: '请输入工作流名称' }]}>
            <Input placeholder="例如：爆款文案生成器" />
          </Form.Item>
          <Form.Item name="type" label="工作流类型" rules={[{ required: true, message: '请选择类型' }]}>
            <Select placeholder="选择类型">
              <Select.Option value="coze">Coze</Select.Option>
              <Select.Option value="n8n">n8n</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
            <Select placeholder="选择分类">
              <Select.Option value="内容创作">内容创作</Select.Option>
              <Select.Option value="数据分析">数据分析</Select.Option>
              <Select.Option value="营销推广">营销推广</Select.Option>
              <Select.Option value="数据处理">数据处理</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述" rules={[{ required: true, message: '请输入描述' }]}>
            <TextArea rows={3} placeholder="简要描述工作流的功能和用途" />
          </Form.Item>
          <Form.Item name="webhookUrl" label="Webhook URL" rules={[{ required: true, message: '请输入 Webhook URL' }]}>
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="instructions" label="使用说明" rules={[{ required: true, message: '请输入使用说明' }]}>
            <TextArea rows={4} placeholder="详细说明如何使用这个工作流" />
          </Form.Item>
          <Form.Item name="credits" label="建议积分/次（管理员审核时可调整）" rules={[{ required: true, message: '请设置积分' }]}>
            <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="建议 5-20 积分" />
          </Form.Item>
          <Form.Item name="screenshots" label="截图（可选）">
            <Upload listType="picture-card" maxCount={3}><UploadOutlined /> 上传截图</Upload>
          </Form.Item>
          <div style={{ background: '#f6ffed', padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <p style={{ margin: 0, color: '#52c41a' }}>💰 审核通过后，每次被用户使用，你将获得 70% 的积分分成</p>
          </div>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setWorkflowModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit">提交审核</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 上传工具弹窗 */}
      <Modal title="上传工具" open={toolModalOpen} onCancel={() => setToolModalOpen(false)} footer={null} width={640}>
        <Form form={toolForm} layout="vertical" onFinish={handleSubmitTool}>
          <Form.Item name="name" label="工具名称" rules={[{ required: true, message: '请输入工具名称' }]}>
            <Input placeholder="例如：文案提取工具" />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
            <Select placeholder="选择分类">
              <Select.Option value="文案工具">文案工具</Select.Option>
              <Select.Option value="视频工具">视频工具</Select.Option>
              <Select.Option value="图片工具">图片工具</Select.Option>
              <Select.Option value="分析工具">分析工具</Select.Option>
              <Select.Option value="数据工具">数据工具</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述" rules={[{ required: true, message: '请输入描述' }]}>
            <TextArea rows={3} placeholder="简要描述工具的功能和用途" />
          </Form.Item>
          <Form.Item name="webhookUrl" label="Webhook URL" rules={[{ required: true, message: '请输入 Webhook URL' }]}>
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="instructions" label="使用说明" rules={[{ required: true, message: '请输入使用说明' }]}>
            <TextArea rows={4} placeholder="详细说明如何使用这个工具" />
          </Form.Item>
          <Form.Item name="credits" label="建议积分/次（管理员审核时可调整）" rules={[{ required: true, message: '请设置积分' }]}>
            <InputNumber min={1} max={50} style={{ width: '100%' }} placeholder="建议 3-10 积分" />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Select placeholder="选择图标">
              <Select.Option value="📝">📝 文案</Select.Option>
              <Select.Option value="✨">✨ 创意</Select.Option>
              <Select.Option value="📊">📊 分析</Select.Option>
              <Select.Option value="🎬">🎬 视频</Select.Option>
              <Select.Option value="🖼️">🖼️ 图片</Select.Option>
              <Select.Option value="📥">📥 数据</Select.Option>
            </Select>
          </Form.Item>
          <div style={{ background: '#f6ffed', padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <p style={{ margin: 0, color: '#52c41a' }}>💰 审核通过后，每次被用户使用，你将获得 70% 的积分分成</p>
          </div>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setToolModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit">提交审核</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 上传智能体弹窗 */}
      <Modal title="上传智能体" open={agentModalOpen} onCancel={() => setAgentModalOpen(false)} footer={null} width={640}>
        <Form form={agentForm} layout="vertical" onFinish={handleSubmitAgent}>
          <Form.Item name="name" label="智能体名称" rules={[{ required: true, message: '请输入智能体名称' }]}>
            <Input placeholder="例如：小红书文案助手" />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
            <Select placeholder="选择分类">
              <Select.Option value="内容创作">内容创作</Select.Option>
              <Select.Option value="视频创作">视频创作</Select.Option>
              <Select.Option value="客服">客服</Select.Option>
              <Select.Option value="数据分析">数据分析</Select.Option>
              <Select.Option value="翻译">翻译</Select.Option>
              <Select.Option value="开发">开发</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述" rules={[{ required: true, message: '请输入描述' }]}>
            <TextArea rows={3} placeholder="简要描述智能体的功能和特点" />
          </Form.Item>
          <Form.Item name="webhookUrl" label="Webhook URL" rules={[{ required: true, message: '请输入 Webhook URL' }]}>
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="welcome_message" label="欢迎语">
            <TextArea rows={2} placeholder="用户开始对话时的欢迎语" />
          </Form.Item>
          <Form.Item name="capabilities" label="能力标签">
            <Select mode="tags" placeholder="输入能力标签，如：文案生成、标题优化" />
          </Form.Item>
          <Form.Item name="credits" label="建议积分/次（管理员审核时可调整）" rules={[{ required: true, message: '请设置积分' }]}>
            <InputNumber min={1} max={50} style={{ width: '100%' }} placeholder="建议 5-15 积分" />
          </Form.Item>
          <Form.Item name="avatar" label="头像">
            <Select placeholder="选择头像">
              <Select.Option value="🤖">🤖 机器人</Select.Option>
              <Select.Option value="💬">💬 对话</Select.Option>
              <Select.Option value="📝">📝 文案</Select.Option>
              <Select.Option value="🎬">🎬 视频</Select.Option>
              <Select.Option value="📊">📊 分析</Select.Option>
              <Select.Option value="💻">💻 代码</Select.Option>
            </Select>
          </Form.Item>
          <div style={{ background: '#f6ffed', padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <p style={{ margin: 0, color: '#52c41a' }}>💰 审核通过后，每次被用户使用，你将获得 70% 的积分分成</p>
          </div>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setAgentModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit">提交审核</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 提现弹窗 */}
      <Modal title="申请提现" open={withdrawModalOpen} onCancel={() => setWithdrawModalOpen(false)} footer={null} width={480}>
        <div style={{ background: '#f0f5ff', padding: 16, borderRadius: 8, marginBottom: 24 }}>
          <p style={{ margin: 0 }}>可提现余额: <span style={{ fontSize: 24, fontWeight: 600, color: '#1890ff' }}>{stats.pendingEarnings}</span> 积分</p>
          <p style={{ margin: '8px 0 0', color: '#8c8c8c', fontSize: 12 }}>最低提现 100 积分，1 积分 = 0.1 元</p>
        </div>
        <Form form={withdrawForm} layout="vertical" onFinish={handleWithdraw}>
          <Form.Item name="amount" label="提现积分" rules={[{ required: true, message: '请输入提现积分' }]}>
            <InputNumber min={100} max={stats.pendingEarnings} style={{ width: '100%' }} placeholder="最低 100 积分" />
          </Form.Item>
          <Form.Item name="payment_method" label="提现方式" rules={[{ required: true, message: '请选择提现方式' }]}>
            <Select placeholder="选择提现方式">
              <Select.Option value="alipay">支付宝</Select.Option>
              <Select.Option value="wechat">微信</Select.Option>
              <Select.Option value="bank">银行卡</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="payment_account" label="收款账号" rules={[{ required: true, message: '请输入收款账号' }]}>
            <Input placeholder="请输入收款账号" />
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setWithdrawModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit">提交申请</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
