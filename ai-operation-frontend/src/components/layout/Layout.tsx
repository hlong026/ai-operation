import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Avatar, Badge, Dropdown } from 'antd'
import {
  HomeOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  BarChartOutlined,
  UserOutlined,
  TeamOutlined,
  CrownOutlined,
  RocketOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

const { Header, Content } = AntLayout

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [credits] = useState(1000)

  const menuItems: MenuProps['items'] = [
    { key: '/', label: '首页', icon: <HomeOutlined /> },
    { key: '/workflows', label: '工作流', icon: <ThunderboltOutlined /> },
    { key: '/tools', label: '工具箱', icon: <ToolOutlined /> },
    { key: '/create', label: '一键创作', icon: <RocketOutlined /> },
    { key: '/analytics', label: '数据分析', icon: <BarChartOutlined /> },
    { key: '/accounts', label: '账号管理', icon: <UserOutlined /> },
    { key: '/team', label: '团队管理', icon: <TeamOutlined /> },
  ]

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', label: '个人资料' },
    { key: 'settings', label: '设置' },
    { key: 'logout', label: '退出登录' },
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
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
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
              <span style={{ fontWeight: 500 }}>{credits} 积分</span>
            </div>
            
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Badge dot>
                <Avatar 
                  style={{ backgroundColor: '#1890ff', cursor: 'pointer' }} 
                  icon={<UserOutlined />} 
                />
              </Badge>
            </Dropdown>
          </div>
        </div>
      </Header>
      
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <Outlet />
      </Content>
    </AntLayout>
  )
}
