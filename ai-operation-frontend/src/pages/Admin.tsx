import { useState } from 'react'
import { Card, Tabs, Table, Button, Tag, Space, Modal, Form, InputNumber, Input, message, Statistic, Row, Col, Select } from 'antd'
import {
  ThunderboltOutlined,
  ToolOutlined,
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
  SettingOutlined,
  DollarOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { TextArea } = Input

interface PendingWorkflow {
  id: string
  name: string
  type: 'coze' | 'n8n'
  category: string
  description: string
  webhook_url: string
  suggested_credits: number
  creator_name: string
  creator_email: string
  created_at: string
}

interface PendingTool {
  id: string
  name: string
  category: string
  description: string
  webhook_url: string
  suggested_credits: number
  creator_name: string
  creator_email: string
  created_at: string
}

interface ApprovedResource {
  id: string
  name: string
  type: 'workflow' | 'tool'
  category: string
  credits_per_call: number
  creator_share_ratio: number
  usage_count: number
  total_earnings: number
  status: 'approved'
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('pending')
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [editCreditsModalOpen, setEditCreditsModalOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<any>(null)
  const [approveForm] = Form.useForm()
  const [rejectForm] = Form.useForm()
  const [editForm] = Form.useForm()

  // 模拟待审核数据
  const [pendingWorkflows] = useState<PendingWorkflow[]>([
    { id: '1', name: '智能客服助手', type: 'coze', category: '客服', description: '自动回复客户问题', webhook_url: 'https://...', suggested_credits: 10, creator_name: '张三', creator_email: 'zhangsan@example.com', created_at: '2024-12-08' },
    { id: '2', name: '数据报表生成器', type: 'n8n', category: '数据分析', description: '自动生成数据报表', webhook_url: 'https://...', suggested_credits: 15, creator_name: '李四', creator_email: 'lisi@example.com', created_at: '2024-12-07' },
  ])

  const [pendingTools] = useState<PendingTool[]>([
    { id: '1', name: '图片水印工具', category: '图片工具', description: '批量添加水印', webhook_url: 'https://...', suggested_credits: 5, creator_name: '王五', creator_email: 'wangwu@example.com', created_at: '2024-12-08' },
  ])

  const [approvedResources] = useState<ApprovedResource[]>([
    { id: '1', name: '爆款文案生成器', type: 'workflow', category: '内容创作', credits_per_call: 10, creator_share_ratio: 0.7, usage_count: 1234, total_earnings: 8638, status: 'approved' },
    { id: '2', name: '文案提取工具', type: 'tool', category: '文案工具', credits_per_call: 5, creator_share_ratio: 0.7, usage_count: 456, total_earnings: 1596, status: 'approved' },
    { id: '3', name: '视频脚本生成器', type: 'workflow', category: '内容创作', credits_per_call: 8, creator_share_ratio: 0.7, usage_count: 789, total_earnings: 4418, status: 'approved' },
  ])

  // 统计数据
  const stats = {
    pendingCount: pendingWorkflows.length + pendingTools.length,
    approvedCount: approvedResources.length,
    totalUsage: approvedResources.reduce((sum, r) => sum + r.usage_count, 0),
    totalEarnings: approvedResources.reduce((sum, r) => sum + r.total_earnings, 0),
  }


  const handleApprove = (resource: any, type: 'workflow' | 'tool') => {
    setSelectedResource({ ...resource, resourceType: type })
    approveForm.setFieldsValue({
      credits_per_call: resource.suggested_credits,
      creator_share_ratio: 0.7
    })
    setApproveModalOpen(true)
  }

  const handleReject = (resource: any, type: 'workflow' | 'tool') => {
    setSelectedResource({ ...resource, resourceType: type })
    setRejectModalOpen(true)
  }

  const handleEditCredits = (resource: ApprovedResource) => {
    setSelectedResource(resource)
    editForm.setFieldsValue({
      credits_per_call: resource.credits_per_call,
      creator_share_ratio: resource.creator_share_ratio
    })
    setEditCreditsModalOpen(true)
  }

  const submitApprove = async (values: any) => {
    console.log('审核通过:', selectedResource, values)
    message.success(`已通过 ${selectedResource.name} 的审核，设置积分: ${values.credits_per_call}，分成比例: ${values.creator_share_ratio * 100}%`)
    setApproveModalOpen(false)
    approveForm.resetFields()
  }

  const submitReject = async (values: any) => {
    console.log('审核拒绝:', selectedResource, values)
    message.success(`已拒绝 ${selectedResource.name}`)
    setRejectModalOpen(false)
    rejectForm.resetFields()
  }

  const submitEditCredits = async (values: any) => {
    console.log('修改积分设置:', selectedResource, values)
    message.success(`已更新 ${selectedResource.name} 的积分设置`)
    setEditCreditsModalOpen(false)
    editForm.resetFields()
  }

  const pendingWorkflowColumns: ColumnsType<PendingWorkflow> = [
    { title: '名称', dataIndex: 'name', key: 'name', render: (text) => <span style={{ fontWeight: 500 }}>{text}</span> },
    { title: '类型', dataIndex: 'type', key: 'type', render: (type) => <Tag color={type === 'coze' ? 'blue' : 'green'}>{type.toUpperCase()}</Tag> },
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '建议积分', dataIndex: 'suggested_credits', key: 'suggested_credits', render: (v) => <Tag color="orange">{v} 积分</Tag> },
    { title: '创作者', dataIndex: 'creator_name', key: 'creator_name' },
    { title: '提交时间', dataIndex: 'created_at', key: 'created_at' },
    {
      title: '操作', key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small">详情</Button>
          <Button type="primary" icon={<CheckOutlined />} size="small" onClick={() => handleApprove(record, 'workflow')}>通过</Button>
          <Button danger icon={<CloseOutlined />} size="small" onClick={() => handleReject(record, 'workflow')}>拒绝</Button>
        </Space>
      ),
    },
  ]

  const pendingToolColumns: ColumnsType<PendingTool> = [
    { title: '名称', dataIndex: 'name', key: 'name', render: (text) => <span style={{ fontWeight: 500 }}>{text}</span> },
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '建议积分', dataIndex: 'suggested_credits', key: 'suggested_credits', render: (v) => <Tag color="orange">{v} 积分</Tag> },
    { title: '创作者', dataIndex: 'creator_name', key: 'creator_name' },
    { title: '提交时间', dataIndex: 'created_at', key: 'created_at' },
    {
      title: '操作', key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small">详情</Button>
          <Button type="primary" icon={<CheckOutlined />} size="small" onClick={() => handleApprove(record, 'tool')}>通过</Button>
          <Button danger icon={<CloseOutlined />} size="small" onClick={() => handleReject(record, 'tool')}>拒绝</Button>
        </Space>
      ),
    },
  ]

  const approvedColumns: ColumnsType<ApprovedResource> = [
    { title: '名称', dataIndex: 'name', key: 'name', render: (text) => <span style={{ fontWeight: 500 }}>{text}</span> },
    { title: '类型', dataIndex: 'type', key: 'type', render: (type) => <Tag color={type === 'workflow' ? 'blue' : 'purple'}>{type === 'workflow' ? '工作流' : '工具'}</Tag> },
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '积分/次', dataIndex: 'credits_per_call', key: 'credits_per_call', render: (v) => <Tag color="blue">{v} 积分</Tag> },
    { title: '分成比例', dataIndex: 'creator_share_ratio', key: 'creator_share_ratio', render: (v) => `${v * 100}%` },
    { title: '使用次数', dataIndex: 'usage_count', key: 'usage_count' },
    { title: '累计收益', dataIndex: 'total_earnings', key: 'total_earnings', render: (v) => <span style={{ color: '#52c41a' }}>{v} 积分</span> },
    {
      title: '操作', key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<SettingOutlined />} size="small" onClick={() => handleEditCredits(record)}>设置积分</Button>
        </Space>
      ),
    },
  ]


  const renderPending = () => (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="待审核" value={stats.pendingCount} prefix={<ThunderboltOutlined style={{ color: '#faad14' }} />} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="已上架" value={stats.approvedCount} prefix={<CheckOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="总使用次数" value={stats.totalUsage} prefix={<UserOutlined style={{ color: '#1890ff' }} />} /></Card></Col>
        <Col span={6}><Card><Statistic title="总收益" value={stats.totalEarnings} suffix="积分" prefix={<DollarOutlined style={{ color: '#52c41a' }} />} /></Card></Col>
      </Row>

      <Card title={<span><ThunderboltOutlined style={{ marginRight: 8 }} />待审核工作流 ({pendingWorkflows.length})</span>} style={{ marginBottom: 24 }}>
        <Table columns={pendingWorkflowColumns} dataSource={pendingWorkflows} rowKey="id" pagination={false} locale={{ emptyText: '暂无待审核工作流' }} />
      </Card>

      <Card title={<span><ToolOutlined style={{ marginRight: 8 }} />待审核工具 ({pendingTools.length})</span>}>
        <Table columns={pendingToolColumns} dataSource={pendingTools} rowKey="id" pagination={false} locale={{ emptyText: '暂无待审核工具' }} />
      </Card>
    </div>
  )

  const renderApproved = () => (
    <div>
      <Card title="已上架资源管理" extra={<span style={{ color: '#8c8c8c' }}>可修改积分和分成比例</span>}>
        <Table columns={approvedColumns} dataSource={approvedResources} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  )

  const renderSettings = () => (
    <div>
      <Card title="系统设置" style={{ marginBottom: 24 }}>
        <Form layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item label="默认创作者分成比例" extra="创作者获得用户消费积分的比例">
            <InputNumber min={0} max={1} step={0.05} defaultValue={0.7} style={{ width: 200 }} addonAfter="(70%)" />
          </Form.Item>
          <Form.Item label="最低提现积分" extra="创作者申请提现的最低积分数">
            <InputNumber min={10} defaultValue={100} style={{ width: 200 }} addonAfter="积分" />
          </Form.Item>
          <Form.Item label="新用户注册赠送积分">
            <InputNumber min={0} defaultValue={100} style={{ width: 200 }} addonAfter="积分" />
          </Form.Item>
          <Form.Item label="邀请好友奖励积分">
            <InputNumber min={0} defaultValue={50} style={{ width: 200 }} addonAfter="积分" />
          </Form.Item>
          <Form.Item>
            <Button type="primary">保存设置</Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="积分套餐管理">
        <p style={{ color: '#8c8c8c' }}>管理积分充值套餐，可在数据库中直接修改 credit_packages 表</p>
      </Card>
    </div>
  )

  const tabItems = [
    { key: 'pending', label: <span><ThunderboltOutlined />待审核 ({stats.pendingCount})</span>, children: renderPending() },
    { key: 'approved', label: <span><CheckOutlined />已上架</span>, children: renderApproved() },
    { key: 'settings', label: <span><SettingOutlined />系统设置</span>, children: renderSettings() },
  ]

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, marginBottom: 8 }}>管理后台</h1>
        <p style={{ color: '#8c8c8c', margin: 0 }}>审核工作流和工具，管理积分设置</p>
      </div>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      {/* 审核通过弹窗 */}
      <Modal title="审核通过 - 设置积分" open={approveModalOpen} onCancel={() => setApproveModalOpen(false)} footer={null} width={480}>
        <div style={{ background: '#f0f5ff', padding: 16, borderRadius: 8, marginBottom: 24 }}>
          <p style={{ margin: 0 }}><strong>{selectedResource?.name}</strong></p>
          <p style={{ margin: '8px 0 0', color: '#8c8c8c' }}>{selectedResource?.description}</p>
          <p style={{ margin: '8px 0 0', color: '#8c8c8c' }}>创作者建议积分: {selectedResource?.suggested_credits}</p>
        </div>
        <Form form={approveForm} layout="vertical" onFinish={submitApprove}>
          <Form.Item name="credits_per_call" label="每次调用消耗积分" rules={[{ required: true }]}>
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="creator_share_ratio" label="创作者分成比例" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={0.5}>50%</Select.Option>
              <Select.Option value={0.6}>60%</Select.Option>
              <Select.Option value={0.7}>70%（默认）</Select.Option>
              <Select.Option value={0.8}>80%</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setApproveModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit">确认通过</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 审核拒绝弹窗 */}
      <Modal title="审核拒绝" open={rejectModalOpen} onCancel={() => setRejectModalOpen(false)} footer={null} width={480}>
        <Form form={rejectForm} layout="vertical" onFinish={submitReject}>
          <Form.Item name="reason" label="拒绝原因" rules={[{ required: true, message: '请输入拒绝原因' }]}>
            <TextArea rows={4} placeholder="请说明拒绝原因，创作者可根据原因修改后重新提交" />
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setRejectModalOpen(false)}>取消</Button>
              <Button type="primary" danger htmlType="submit">确认拒绝</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改积分设置弹窗 */}
      <Modal title="修改积分设置" open={editCreditsModalOpen} onCancel={() => setEditCreditsModalOpen(false)} footer={null} width={480}>
        <div style={{ background: '#f0f5ff', padding: 16, borderRadius: 8, marginBottom: 24 }}>
          <p style={{ margin: 0 }}><strong>{selectedResource?.name}</strong></p>
          <p style={{ margin: '8px 0 0', color: '#8c8c8c' }}>当前使用次数: {selectedResource?.usage_count}</p>
        </div>
        <Form form={editForm} layout="vertical" onFinish={submitEditCredits}>
          <Form.Item name="credits_per_call" label="每次调用消耗积分" rules={[{ required: true }]}>
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="creator_share_ratio" label="创作者分成比例" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={0.5}>50%</Select.Option>
              <Select.Option value={0.6}>60%</Select.Option>
              <Select.Option value={0.7}>70%</Select.Option>
              <Select.Option value={0.8}>80%</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setEditCreditsModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit">保存</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
