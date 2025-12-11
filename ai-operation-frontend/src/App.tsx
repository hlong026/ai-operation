import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute, GuestRoute } from './components/auth/ProtectedRoute'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Workflows from './pages/Workflows'
import WorkflowDetail from './pages/WorkflowDetail'
import WorkflowUpload from './pages/WorkflowUpload'
import WorkflowExecute from './pages/WorkflowExecute'
import Tools from './pages/Tools'
import ToolDetail from './pages/ToolDetail'
import Agents from './pages/Agents'
import AgentDetail from './pages/AgentDetail'
import CreatorCenter from './pages/CreatorCenter'
import Pricing from './pages/Pricing'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Register from './pages/Register'
import AuthCallback from './pages/AuthCallback'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* 认证回调 */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* 游客路由 - 已登录用户会被重定向 */}
            <Route path="/login" element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            } />
            <Route path="/register" element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            } />
            
            {/* 主布局路由 */}
            <Route path="/" element={<Layout />}>
              {/* 公开页面 */}
              <Route index element={<Home />} />
              <Route path="workflows" element={<Workflows />} />
              <Route path="workflows/:id" element={<WorkflowDetail />} />
              <Route path="agents" element={<Agents />} />
              <Route path="agents/:id" element={<AgentDetail />} />
              <Route path="pricing" element={<Pricing />} />
              
              {/* 需要登录的页面 */}
              <Route path="workflows/:id/execute" element={
                <ProtectedRoute>
                  <WorkflowExecute />
                </ProtectedRoute>
              } />
              <Route path="tools" element={
                <ProtectedRoute>
                  <Tools />
                </ProtectedRoute>
              } />
              <Route path="tools/:id" element={
                <ProtectedRoute>
                  <ToolDetail />
                </ProtectedRoute>
              } />
              <Route path="creator" element={
                <ProtectedRoute>
                  <CreatorCenter />
                </ProtectedRoute>
              } />
              
              {/* 需要管理员权限的页面 */}
              <Route path="workflows/upload" element={
                <ProtectedRoute requireAdmin>
                  <WorkflowUpload />
                </ProtectedRoute>
              } />
              <Route path="workflows/:id/edit" element={
                <ProtectedRoute requireAdmin>
                  <WorkflowUpload />
                </ProtectedRoute>
              } />
              
              {/* 管理员页面 */}
              <Route path="admin" element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* 404 重定向 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App
