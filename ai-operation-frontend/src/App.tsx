import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Workflows from './pages/Workflows'
import WorkflowDetail from './pages/WorkflowDetail'
import WorkflowUpload from './pages/WorkflowUpload'
import WorkflowExecute from './pages/WorkflowExecute'
import Tools from './pages/Tools'
import Create from './pages/Create'
import Analytics from './pages/Analytics'
import Accounts from './pages/Accounts'
import Team from './pages/Team'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="workflows/:id" element={<WorkflowDetail />} />
          <Route path="workflows/upload" element={<WorkflowUpload />} />
          <Route path="workflows/:id/execute" element={<WorkflowExecute />} />
          <Route path="tools" element={<Tools />} />
          <Route path="create" element={<Create />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="team" element={<Team />} />
          <Route path="pricing" element={<Pricing />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
