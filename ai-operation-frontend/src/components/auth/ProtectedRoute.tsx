import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuth } from '../../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

// 需要登录才能访问的路由
export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()
  const [showContent, setShowContent] = React.useState(false)

  // 超时后直接显示内容，避免一直卡在加载
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 2000) // 2秒超时

    return () => clearTimeout(timer)
  }, [])

  // 如果还在加载且未超时，显示加载状态
  if (loading && !showContent) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!isAuthenticated) {
    // 保存当前路径，登录后跳转回来
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

// 只有未登录才能访问的路由（登录、注册页）
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  const [showContent, setShowContent] = React.useState(false)

  // 超时后直接显示内容，避免一直卡在加载
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 2000) // 2秒超时

    return () => clearTimeout(timer)
  }, [])

  // 如果还在加载且未超时，显示加载状态
  if (loading && !showContent) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  if (isAuthenticated) {
    // 如果已登录，跳转到之前的页面或首页
    const from = (location.state as any)?.from?.pathname || '/'
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}
