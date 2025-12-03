import { Card, Row, Col, Statistic, Button, Table, Tag, Modal, Form, Input, Select } from 'antd'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'
import { useState } from 'react'

export default function Team() {
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [form] = Form.useForm()

  const columns = [
    { title: '成员', dataIndex: 'name', key: 'name' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { 
      title: '角色', 
      dataIndex: 'role', 
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'blue' : 'default'}>
          {role === 'admin' ? '管理员' : '成员'}
        </Tag>
      )
    },
    { title: '配额', dataIndex: 'quota', key: 'quota', render: (quota: number) => `${quota}积分/月` },
    { title: '已用', dataIndex: 'used', key: 'used', render: (used: number) => `${used}积分` },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'normal' ? 'success' : 'error'}>
          {status === 'normal' ? '正常' : '超额'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button 
          type="link" 
          icon={<EditOutlined />}
          onClick={() => setEditModalVisible(true)}
        >
          编辑
        </Button>
      ),
    },
  ]

  const data = [
    { key: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin', quota: 10000, used: 8234, status: 'normal' },
    { key: 2, name: '李四', email: 'lisi@example.com', role: 'member', quota: 5000, used: 4123, status: 'normal' },
    { key: 3, name: '王五', email: 'wangwu@example.com', role: 'member', quota: 5000, used: 3890, status: 'normal' },
    { key: 4, name: '赵六', email: 'zhaoliu@example.com', role: 'member', quota: 3000, used: 2567, status: 'normal' },
    { key: 5, name: '孙七', email: 'sunqi@example.com', role: 'member', quota: 3000, used: 2890, status: 'exceed' },
  ]

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>团队管理</h1>
        <Button type="primary" icon={<PlusOutlined />}>邀请成员</Button>
      </div>

      {/* 团队概览 */}
      <h2 style={{ marginBottom: 16 }}>团队概览</h2>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col span={8}>
          <Card>
            <Statistic title="团队成员" value={12} suffix="人" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="总配额" value={50000} suffix="积分/月" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="已使用" value={32450} suffix="积分" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="本月内容" value={156} suffix="条" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="本月工作流" value={423} suffix="次" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="活跃成员" value={10} suffix="人" />
          </Card>
        </Col>
      </Row>

      {/* 成员列表 */}
      <h2 style={{ marginBottom: 16 }}>成员列表</h2>
      <Card>
        <Table columns={columns} dataSource={data} pagination={false} />
        <div style={{ marginTop: 16 }}>
          <Button>批量导入</Button>
          <Button style={{ marginLeft: 8 }}>导出数据</Button>
        </div>
      </Card>

      {/* 编辑成员弹窗 */}
      <Modal
        title="编辑成员配额"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => {
          form.submit()
          setEditModalVisible(false)
        }}
      >
        <Form form={form} layout="vertical">
          <div style={{ marginBottom: 16 }}>
            <p><strong>成员信息</strong></p>
            <p>姓名: 李四</p>
            <p>邮箱: lisi@example.com</p>
            <p>加入时间: 2024-10-15</p>
          </div>

          <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
            <p>当前配额: 5,000 积分/月</p>
            <p>已使用: 4,123 积分</p>
            <p>剩余: 877 积分</p>
          </div>

          <Form.Item
            label="每月配额 (积分)"
            name="quota"
            rules={[{ required: true, message: '请输入配额' }]}
          >
            <Input type="number" placeholder="请输入配额" />
          </Form.Item>

          <div style={{ marginBottom: 16, color: '#8c8c8c', fontSize: 12 }}>
            建议配额: 3000 / 5000 / 10000
          </div>

          <Form.Item
            label="角色权限"
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select>
              <Select.Option value="admin">管理员 - 可以管理团队成员和配额</Select.Option>
              <Select.Option value="member">成员 - 只能使用分配的积分</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
