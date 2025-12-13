import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Avatar, Badge, Dropdown, Button, Space } from 'antd'
import {
  HomeOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  UserOutlined,
  CrownOutlined,
  LogoutOutlined,
  DashboardOutlined,
  LoginOutlined,
  RobotOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useAuth } from '../../contexts/AuthContext'

const { Header, Content } = AntLayout

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isAdmin, profile, signOut } = useAuth()

  // 公共菜单项
  const publicMenuItems: MenuProps['items'] = [
    { key: '/', label: '首页', icon: <HomeOutlined /> },
    { key: '/agents', label: '智能体商店', icon: <RobotOutlined /> },
    { key: '/workflows', label: '工作流商店', icon: <ThunderboltOutlined /> },
    { key: '/pricing', label: '套餐价格', icon: <CrownOutlined /> },
  ]

  // 登录用户菜单项
  const authMenuItems: MenuProps['items'] = [
    { key: '/', label: '首页', icon: <HomeOutlined /> },
    { key: '/agents', label: '智能体商店', icon: <RobotOutlined /> },
    { key: '/workflows', label: '工作流商店', icon: <ThunderboltOutlined /> },
    { key: '/tools', label: '工具箱', icon: <ToolOutlined /> },
  ]

  // 管理员额外菜单
  const adminMenuItems: MenuProps['items'] = isAdmin ? [
    { key: '/admin', label: '管理后台', icon: <DashboardOutlined /> },
  ] : []

  const menuItems = isAuthenticated 
    ? [...authMenuItems, ...adminMenuItems]
    : publicMenuItems

  // 退出登录处理 - 最简单有效的方式
  const handleLogout = () => {
    // 1. 同步清除所有 Supabase 相关的 localStorage（立即执行，不等待）
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('sb-') || key.includes('supabase')) {
        localStorage.removeItem(key)
      }
    })
    
    // 2. 通知服务端（不等待结果）
    signOut().catch(() => {})
    
    // 3. 立即跳转（使用 replace 防止后退）
    window.location.replace('/')
  }

  // 用户下拉菜单项
  const dropdownItems = [
    {
      key: 'user-center',
      label: '个人中心',
      icon: <UserOutlined />,
      onClick: () => navigate('/user'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ]

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: 1400
        }}>
          <div 
            style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            AI运营系统
          </div>
          
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ border: 'none', flex: 1, justifyContent: 'center' }}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {isAuthenticated ? (
              <>
                {/* 积分显示 */}
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8,
                    padding: '4px 12px',
                    background: '#f0f2f5',
                    borderRadius: 16,
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate('/pricing')}
                >
                  <CrownOutlined style={{ color: '#faad14' }} />
                  <span style={{ fontWeight: 500 }}>{profile?.credits ?? 0} 积分</span>
                </div>
                
                {/* 用户头像下拉菜单 */}
                <Dropdown 
                  menu={{ items: dropdownItems }} 
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Badge dot={false}>
                      <Avatar 
                        style={{ backgroundColor: '#1890ff' }} 
                        icon={<UserOutlined />}
                        src={profile?.avatar}
                      />
                    </Badge>
                  </div>
                </Dropdown>
              </>
            ) : (
              <Space>
                <Button 
                  type="text" 
                  icon={<LoginOutlined />}
                  onClick={() => navigate('/login')}
                >
                  登录
                </Button>
                <Button 
                  type="primary"
                  onClick={() => navigate('/register')}
                >
                  免费注册
                </Button>
              </Space>
            )}
          </div>
        </div>
      </Header>
      
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <Outlet />
      </Content>
    </AntLayout>
  )
}
