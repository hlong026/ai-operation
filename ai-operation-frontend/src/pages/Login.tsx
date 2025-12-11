import { useState } from 'react'
import { Form, Input, Button, Card, Checkbox, message, Alert } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as any)?.from?.pathname || '/'

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true)
    setError(null)

    console.log('Attempting login with:', values.email)
    const { error } = await signIn(values.email, values.password)

    if (error) {
      setLoading(false)
      console.error('Login error:', error)
      
      // 更详细的错误处理
      if (error.message.includes('Invalid login credentials')) {
        setError('邮箱或密码错误，请检查后重试')
      } else if (error.message.includes('Email not confirmed')) {
        setError('请先验证邮箱后再登录。请检查您的邮箱收件箱（包括垃圾邮件）')
      } else if (error.message.includes('User not found')) {
        setError('该邮箱尚未注册，请先注册')
      } else {
        // 显示原始错误信息以便调试
        setError(`登录失败: ${error.message}`)
      }
      return
    }

    setLoading(false)
    message.success('登录成功！')
    navigate(from, { replace: true })
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 400, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, color: '#1890ff', marginBottom: 8 }}>AI运营系统</h1>
          <p style={{ color: '#8c8c8c' }}>欢迎回来</p>
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

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="邮箱" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Checkbox>记住我</Checkbox>
              <Link to="/forgot-password">忘记密码？</Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            还没有账号？ <Link to="/register">立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}
