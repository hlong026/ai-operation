import { Card, Row, Col, Button, Tag, Table } from 'antd'
import { CheckOutlined, CrownOutlined } from '@ant-design/icons'

export default function Pricing() {
  const plans = [
    {
      name: '免费版',
      price: 0,
      period: '月',
      credits: 100,
      features: [
        { text: '基础工具', included: true },
        { text: '3个工作流', included: true },
        { text: '10条内容发布', included: true },
        { text: '基础数据分析', included: true },
        { text: '团队管理', included: false },
        { text: 'API调用', included: false },
        { text: '优先支持', included: false },
        { text: '专属客服', included: false },
      ],
      current: true,
    },
    {
      name: '基础版',
      price: 99,
      period: '月',
      credits: 1000,
      recommended: true,
      features: [
        { text: '全部工具', included: true },
        { text: '10个工作流', included: true },
        { text: '100条内容发布', included: true },
        { text: '高级数据分析', included: true },
        { text: '团队管理', included: false },
        { text: 'API调用', included: false },
        { text: '优先支持', included: false },
        { text: '专属客服', included: false },
      ],
    },
    {
      name: '专业版',
      price: 299,
      period: '月',
      credits: 5000,
      features: [
        { text: '全部工具', included: true },
        { text: '50个工作流', included: true },
        { text: '500条内容发布', included: true },
        { text: '高级数据分析', included: true },
        { text: '5人团队', included: true },
        { text: 'API调用', included: true },
        { text: '优先支持', included: true },
        { text: '专属客服', included: false },
      ],
    },
    {
      name: '企业版',
      price: 999,
      period: '月',
      credits: 20000,
      features: [
        { text: '全部工具', included: true },
        { text: '无限工作流', included: true },
        { text: '无限内容发布', included: true },
        { text: '高级数据分析', included: true },
        { text: '20人团队', included: true },
        { text: 'API调用', included: true },
        { text: '优先支持', included: true },
        { text: '专属客服', included: true },
      ],
    },
  ]

  const comparisonColumns = [
    { title: '功能', dataIndex: 'feature', key: 'feature' },
    { title: '免费版', dataIndex: 'free', key: 'free' },
    { title: '基础版', dataIndex: 'basic', key: 'basic' },
    { title: '专业版', dataIndex: 'pro', key: 'pro' },
    { title: '企业版', dataIndex: 'enterprise', key: 'enterprise' },
  ]

  const comparisonData = [
    { key: 1, feature: '每月积分', free: '100', basic: '1000', pro: '5000', enterprise: '20000' },
    { key: 2, feature: '工作流数量', free: '3', basic: '10', pro: '50', enterprise: '无限' },
    { key: 3, feature: '内容发布数量', free: '10', basic: '100', pro: '500', enterprise: '无限' },
    { key: 4, feature: '数据分析', free: '基础', basic: '高级', pro: '高级', enterprise: '高级' },
    { key: 5, feature: '团队成员', free: '-', basic: '-', pro: '5', enterprise: '20' },
    { key: 6, feature: 'API调用', free: '-', basic: '-', pro: '✓', enterprise: '✓' },
    { key: 7, feature: '优先支持', free: '-', basic: '-', pro: '✓', enterprise: '✓' },
    { key: 8, feature: '专属客服', free: '-', basic: '-', pro: '-', enterprise: '✓' },
  ]

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontSize: 32, marginBottom: 16 }}>选择适合您的套餐</h1>
        <p style={{ fontSize: 16, color: '#8c8c8c' }}>
          当前套餐: 基础版 | 到期时间: 2024-12-31 | 剩余积分: 1000
        </p>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
        {plans.map((plan, index) => (
          <Col span={6} key={index}>
            <Card
              style={{
                borderRadius: 8,
                border: plan.recommended ? '2px solid #1890ff' : undefined,
                position: 'relative',
              }}
            >
              {plan.recommended && (
                <Tag 
                  color="blue" 
                  style={{ 
                    position: 'absolute', 
                    top: -12, 
                    left: '50%', 
                    transform: 'translateX(-50%)'
                  }}
                >
                  推荐
                </Tag>
              )}
              
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 8 }}>
                  ¥{plan.price}
                  <span style={{ fontSize: 16, fontWeight: 'normal', color: '#8c8c8c' }}>
                    /{plan.period}
                  </span>
                </div>
                <div style={{ color: '#8c8c8c' }}>{plan.credits}积分</div>
              </div>

              <div style={{ marginBottom: 24 }}>
                {plan.features.map((feature, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      padding: '8px 0',
                      color: feature.included ? '#262626' : '#d9d9d9'
                    }}
                  >
                    {feature.included ? (
                      <CheckOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                    ) : (
                      <span style={{ marginRight: 8 }}>✗</span>
                    )}
                    {feature.text}
                  </div>
                ))}
              </div>

              <Button 
                type={plan.current ? 'default' : plan.recommended ? 'primary' : 'default'}
                block
                size="large"
                disabled={plan.current}
              >
                {plan.current ? '当前套餐' : '升级'}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <h2 style={{ marginBottom: 24 }}>功能对比</h2>
      <Card>
        <Table 
          columns={comparisonColumns} 
          dataSource={comparisonData} 
          pagination={false}
        />
      </Card>
    </div>
  )
}
