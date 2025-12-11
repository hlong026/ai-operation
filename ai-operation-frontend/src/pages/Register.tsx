import { useState, useEffect } from 'react'
import { Form, Input, Button, Card, Checkbox, Alert, Result, Row, Col } from 'antd'
import { LockOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { sendVerificationCode, verifyCode } from '../services/verification'

export default function Register() {
  const { signUp } = useAuth()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [countdown, setCountdown] = useState(0)

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const [devCode, setDevCode] = useState<string | null>(null)

  // 发送验证码
  const handleSendCode = async () => {
    try {
      const email = form.getFieldValue('email')
      if (!email) {
        setError('请先输入邮箱地址')
        return
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError('请输入有效的邮箱地址')
        return
      }

      setSendingCode(true)
      setError(null)
      setDevCode(null)

      const result = await sendVerificationCode(email, 'register')

      if (!result.success) {
        setError(result.error || '发送验证码失败')
        return
      }

      // 开发模式显示验证码
      if (result.devCode) {
        setDevCode(result.devCode)
      }

      setCountdown(60)
    } catch (err) {
      setError('发送验证码失败，请稍后重试')
    } finally {
      setSendingCode(false)
    }
  }

  const onFinish = async (values: {
    email: string
    verificationCode: string
    password: string
    confirmPassword: string
    agreement: boolean
  }) => {
    if (values.password !== values.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (!values.agreement) {
      setError('请阅读并同意用户协议和隐私政策')
      return
    }

    setLoading(true)
    setError(null)

    // 先验证验证码
    const verifyResult = await verifyCode(values.email, values.verificationCode, 'register')
    if (!verifyResult.valid) {
      setLoading(false)
      setError(verifyResult.error || '验证码错误')
      return
    }

    // 注册用户
    const { error } = await signUp(values.email, values.password)

    setLoading(false)

    if (error) {
      if (error.message.includes('already registered')) {
        setError('该邮箱已被注册')
      } else {
        setError(error.message)
      }
      return
    }

    setRegisteredEmail(values.email)
    setSuccess(true)
  }

  if (success) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Card style={{ width: 500, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          <Result
            status="success"
            title="注册成功！"
            subTitle={
              <div>
                <p>
                  我们已向 <strong>{registeredEmail}</strong> 发送了验证邮件
                </p>
                <p>请查收邮件并点击验证链接完成注册</p>
              </div>
            }
            extra={[
              <Button type="primary" key="login">
                <Link to="/login">前往登录</Link>
              </Button>,
              <Button key="resend" onClick={() => setSuccess(false)}>
                重新注册
              </Button>,
            ]}
          />
          <div style={{ textAlign: 'center', color: '#8c8c8c', marginTop: 16 }}>
            <p>没有收到邮件？请检查垃圾邮件文件夹</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card style={{ width: 420, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, color: '#1890ff', marginBottom: 8 }}>AI运营系统</h1>
          <p style={{ color: '#8c8c8c' }}>30秒注册，开启高效创作之旅</p>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
            closable
            onClose={() => setError(null)}
          />
        )}

        <Form form={form} name="register" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>

          <Form.Item>
            <Row gutter={8}>
              <Col flex="auto">
                <Form.Item
                  name="verificationCode"
                  noStyle
                  rules={[
                    { required: true, message: '请输入验证码' },
                    { pattern: /^\d{6}$/, message: '验证码为6位数字' },
                  ]}
                >
                  <Input
                    prefix={<SafetyCertificateOutlined />}
                    placeholder="6位数字验证码"
                    maxLength={6}
                    style={{ letterSpacing: 6, fontWeight: 600, fontSize: 16 }}
                  />
                </Form.Item>
              </Col>
              <Col flex="none">
                <Button
                  onClick={handleSendCode}
                  loading={sendingCode}
                  disabled={countdown > 0}
                  style={{ width: 120, height: 40 }}
                >
                  {countdown > 0 ? `${countdown}秒后重发` : '发送验证码'}
                </Button>
              </Col>
            </Row>
          </Form.Item>

          {/* 开发模式显示验证码 */}
          {devCode && (
            <Alert
              message={
                <div style={{ textAlign: 'center' }}>
                  <span style={{ color: '#666' }}>开发模式 - 验证码：</span>
                  <span
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      letterSpacing: 8,
                      color: '#1890ff',
                      marginLeft: 8,
                      fontFamily: 'monospace',
                    }}
                  >
                    {devCode}
                  </span>
                </div>
              }
              type="info"
              style={{ marginBottom: 16 }}
            />
          )}

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' },
              { max: 20, message: '密码最多20位' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码（6-20位）" />
          </Form.Item>

          <Form.Item name="confirmPassword" rules={[{ required: true, message: '请确认密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意协议')),
              },
            ]}
          >
            <Checkbox>
              我已阅读并同意 <a href="#">《用户协议》</a> 和 <a href="#">《隐私政策》</a>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              注册
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            已有账号？ <Link to="/login">立即登录</Link>
          </div>
        </Form>

        <div
          style={{
            textAlign: 'center',
            marginTop: 24,
            padding: '16px',
            background: '#f6ffed',
            borderRadius: 8,
          }}
        >
          <p style={{ margin: 0, color: '#52c41a' }}>🎁 注册即送 100积分</p>
        </div>
      </Card>
    </div>
  )
}
