import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spin, Result, Button } from 'antd'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.getSession()
      
      if (error) {
        setError(error.message)
        return
      }

      // 验证成功，跳转到首页
      navigate('/', { replace: true })
    }

    handleCallback()
  }, [navigate])

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f0f2f5'
      }}>
        <Result
          status="error"
          title="验证失败"
          subTitle={error}
          extra={[
            <Button type="primary" key="login" onClick={() => navigate('/login')}>
              返回登录
            </Button>,
          ]}
        />
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16
    }}>
      <Spin size="large" />
      <p>正在验证邮箱...</p>
    </div>
  )
}
