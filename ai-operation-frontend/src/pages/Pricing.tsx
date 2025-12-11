import { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Tag, Tabs, Modal, message, Spin, Statistic } from 'antd'
import { CheckOutlined, CrownOutlined, ThunderboltOutlined, GiftOutlined } from '@ant-design/icons'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import type { CreditPackage, MembershipPlan } from '../types/database.types'
import { getCreditPackages, getMembershipPlans, createRechargeOrder } from '../services/creditsService'

export default function Pricing() {
  const { isAuthenticated, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('membership')
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>([])
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [packages, plans] = await Promise.all([
        getCreditPackages(),
        getMembershipPlans()
      ])
      setCreditPackages(packages)
      setMembershipPlans(plans)
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchaseCredits = async (pkg: CreditPackage) => {
    if (!isAuthenticated) {
      message.info('请先登录')
      navigate('/login')
      return
    }

    setPurchasing(true)
    try {
      const { amount } = await createRechargeOrder(pkg.id)
      // 这里应该跳转到支付页面，暂时模拟支付成功
      Modal.confirm({
        title: '确认支付',
        content: `您将支付 ¥${amount} 购买 ${pkg.name}，获得 ${pkg.credits + pkg.bonus_credits} 积分`,
        okText: '模拟支付成功',
        cancelText: '取消',
        onOk: async () => {
          // 模拟支付成功后的处理
          message.success('充值成功！')
          refreshProfile()
        }
      })
    } catch (error: any) {
      message.error(error.message || '创建订单失败')
    } finally {
      setPurchasing(false)
    }
  }

  const handlePurchaseMembership = async (plan: MembershipPlan) => {
    if (!isAuthenticated) {
      message.info('请先登录')
      navigate('/login')
      return
    }

    if (plan.type === 'free') {
      message.info('您已是免费用户')
      return
    }

    Modal.confirm({
      title: '开通会员',
      content: `您将开通 ${plan.name}，月付 ¥${plan.price_monthly}，每月获得 ${plan.credits_monthly} 积分`,
      okText: '确认开通',
      cancelText: '取消',
      onOk: async () => {
        message.success('会员开通成功！')
        refreshProfile()
      }
    })
  }

  const getCurrentPlanName = () => {
    if (!profile) return '免费版'
    const plan = membershipPlans.find(p => p.type === profile.membership_type)
    return plan?.name || '免费版'
  }

  const isCurrentPlan = (planType: string) => {
    return profile?.membership_type === planType
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>
  }


  // 会员套餐渲染
  const renderMembershipPlans = () => (
    <div>
      {isAuthenticated && (
        <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Row gutter={24} align="middle">
            <Col span={6}>
              <Statistic title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>当前套餐</span>} value={getCurrentPlanName()} valueStyle={{ color: '#fff', fontSize: 24 }} prefix={<CrownOutlined />} />
            </Col>
            <Col span={6}>
              <Statistic title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>剩余积分</span>} value={profile?.credits || 0} valueStyle={{ color: '#fff', fontSize: 24 }} prefix={<ThunderboltOutlined />} />
            </Col>
            <Col span={6}>
              <Statistic title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>到期时间</span>} value={profile?.membership_expiry ? new Date(profile.membership_expiry).toLocaleDateString() : '永久'} valueStyle={{ color: '#fff', fontSize: 18 }} />
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <Button size="large" onClick={() => setActiveTab('credits')} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none' }}>充值积分</Button>
            </Col>
          </Row>
        </Card>
      )}

      <Row gutter={24}>
        {membershipPlans.map((plan) => (
          <Col span={6} key={plan.id}>
            <Card
              style={{ borderRadius: 12, border: plan.type === 'pro' ? '2px solid #1890ff' : undefined, position: 'relative', height: '100%' }}
              styles={{ body: { padding: 24 } }}
            >
              {plan.type === 'pro' && (
                <Tag color="blue" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>推荐</Tag>
              )}
              
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 8 }}>
                  ¥{plan.price_monthly}
                  <span style={{ fontSize: 16, fontWeight: 'normal', color: '#8c8c8c' }}>/月</span>
                </div>
                <div style={{ color: '#52c41a', fontWeight: 500 }}>
                  <GiftOutlined /> 每月赠送 {plan.credits_monthly} 积分
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                {(plan.features as string[]).map((feature, idx) => (
                  <div key={idx} style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckOutlined style={{ color: '#52c41a' }} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                type={isCurrentPlan(plan.type) ? 'default' : plan.type === 'pro' ? 'primary' : 'default'}
                block
                size="large"
                disabled={isCurrentPlan(plan.type)}
                onClick={() => handlePurchaseMembership(plan)}
              >
                {isCurrentPlan(plan.type) ? '当前套餐' : plan.type === 'free' ? '免费使用' : '立即开通'}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )

  // 积分充值渲染
  const renderCreditPackages = () => (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, marginBottom: 8 }}>积分充值</h2>
        <p style={{ color: '#8c8c8c' }}>积分可用于使用工作流和工具，充值越多优惠越大</p>
        {isAuthenticated && (
          <div style={{ marginTop: 16 }}>
            <Tag color="blue" style={{ fontSize: 16, padding: '8px 16px' }}>
              当前积分: {profile?.credits || 0}
            </Tag>
          </div>
        )}
      </div>

      <Row gutter={24}>
        {creditPackages.map((pkg, index) => (
          <Col span={24 / Math.min(creditPackages.length, 5)} key={pkg.id}>
            <Card
              hoverable
              style={{ borderRadius: 12, textAlign: 'center', height: '100%' }}
              styles={{ body: { padding: 24 } }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>
                {index === 0 ? '🎁' : index === 1 ? '💎' : index === 2 ? '👑' : index === 3 ? '🚀' : '🏆'}
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>{pkg.name}</h3>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff', marginBottom: 8 }}>
                {pkg.credits}
                <span style={{ fontSize: 14, color: '#8c8c8c' }}> 积分</span>
              </div>
              {pkg.bonus_credits > 0 && (
                <Tag color="red" style={{ marginBottom: 16 }}>+{pkg.bonus_credits} 赠送</Tag>
              )}
              <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
                ¥{pkg.price}
              </div>
              <Button
                type="primary"
                block
                size="large"
                loading={purchasing}
                onClick={() => handlePurchaseCredits(pkg)}
              >
                立即充值
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <Card style={{ marginTop: 32 }}>
        <h3>积分说明</h3>
        <Row gutter={24}>
          <Col span={8}>
            <h4>如何获取积分？</h4>
            <ul style={{ color: '#8c8c8c', paddingLeft: 20 }}>
              <li>新用户注册赠送 100 积分</li>
              <li>开通会员每月赠送积分</li>
              <li>直接充值购买积分</li>
              <li>上传工作流/工具获得分成</li>
            </ul>
          </Col>
          <Col span={8}>
            <h4>积分如何使用？</h4>
            <ul style={{ color: '#8c8c8c', paddingLeft: 20 }}>
              <li>使用工作流消耗积分</li>
              <li>使用工具消耗积分</li>
              <li>不同资源消耗不同积分</li>
              <li>积分永久有效</li>
            </ul>
          </Col>
          <Col span={8}>
            <h4>创作者收益</h4>
            <ul style={{ color: '#8c8c8c', paddingLeft: 20 }}>
              <li>上传工作流/工具审核通过后上架</li>
              <li>用户使用时获得 70% 分成</li>
              <li>收益可在创作者中心提现</li>
              <li>最低提现 100 积分</li>
            </ul>
          </Col>
        </Row>
      </Card>
    </div>
  )

  const tabItems = [
    { key: 'membership', label: <span><CrownOutlined /> 会员套餐</span>, children: renderMembershipPlans() },
    { key: 'credits', label: <span><ThunderboltOutlined /> 积分充值</span>, children: renderCreditPackages() },
  ]

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, marginBottom: 16 }}>选择适合您的方案</h1>
        <p style={{ fontSize: 16, color: '#8c8c8c' }}>灵活的会员套餐和积分充值，满足不同需求</p>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} centered size="large" />
    </div>
  )
}
