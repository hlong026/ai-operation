import { Card, Button, Tag, Table, Space } from 'antd'
import { PlusOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons'

export default function Accounts() {
  const accounts = [
    {
      key: 1,
      platform: '抖音',
      icon: '📱',
      name: '@我的抖音号',
      followers: '12.5K',
      status: 'active',
      connectedAt: '2024-11-15',
      expiresAt: '2025-11-15',
    },
    {
      key: 2,
      platform: '小红书',
      icon: '📕',
      name: '@我的小红书号',
      followers: '8.3K',
      status: 'active',
      connectedAt: '2024-10-20',
      expiresAt: '2025-10-20',
    },
    {
      key: 3,
      platform: '视频号',
      icon: '📹',
      name: '未连接',
      followers: '-',
      status: 'inactive',
      connectedAt: '-',
      expiresAt: '-',
    },
  ]

  const historyColumns = [
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '平台', dataIndex: 'platform', key: 'platform' },
    { title: '内容标题', dataIndex: 'title', key: 'title' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'success' ? 'success' : 'error'}>
          {status === 'success' ? '✅ 成功' : '❌ 失败'}
        </Tag>
      )
    },
  ]

  const historyData = [
    { key: 1, time: '12-03 14:30', platform: '抖音', title: '30天涨粉10万...', status: 'success' },
    { key: 2, time: '12-03 10:15', platform: '小红书', title: '短视频拍摄技巧...', status: 'success' },
    { key: 3, time: '12-02 18:00', platform: '抖音', title: '新手运营指南...', status: 'success' },
    { key: 4, time: '12-02 16:45', platform: '小红书', title: '爆款文案技巧...', status: 'failed' },
    { key: 5, time: '12-01 20:30', platform: '抖音', title: '如何提高完播率...', status: 'success' },
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>账号管理</h1>
        <Button type="primary" icon={<PlusOutlined />}>添加账号</Button>
      </div>

      <h2 style={{ marginBottom: 16 }}>已连接账号</h2>
      
      <Space direction="vertical" style={{ width: '100%', marginBottom: 32 }} size="large">
        {accounts.map(account => (
          <Card key={account.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 32 }}>{account.icon}</span>
                  <h3 style={{ margin: 0 }}>{account.platform}</h3>
                  {account.status === 'active' ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">已连接</Tag>
                  ) : (
                    <Tag icon={<WarningOutlined />} color="default">未连接</Tag>
                  )}
                </div>
                
                {account.status === 'active' ? (
                  <>
                    <p style={{ margin: '8px 0', color: '#595959' }}>
                      账号名: {account.name}
                    </p>
                    <p style={{ margin: '8px 0', color: '#595959' }}>
                      粉丝数: {account.followers}
                    </p>
                    <p style={{ margin: '8px 0', color: '#595959' }}>
                      连接时间: {account.connectedAt}
                    </p>
                    <p style={{ margin: '8px 0', color: '#595959' }}>
                      授权状态: 正常 (有效期至 {account.expiresAt})
                    </p>
                  </>
                ) : (
                  <p style={{ margin: '8px 0', color: '#8c8c8c' }}>
                    还未连接{account.platform}账号
                  </p>
                )}
              </div>
              
              <div>
                {account.status === 'active' ? (
                  <Space>
                    <Button>查看详情</Button>
                    <Button danger>解除绑定</Button>
                  </Space>
                ) : (
                  <Button type="primary">立即连接</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </Space>

      <h2 style={{ marginBottom: 16 }}>发布历史</h2>
      <Card>
        <Table columns={historyColumns} dataSource={historyData} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  )
}
