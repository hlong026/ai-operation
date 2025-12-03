import { Card, Row, Col, Tabs } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function Tools() {
  const navigate = useNavigate()

  const tools = [
    { name: '文案提取工具', desc: '从视频中提取文案内容', usage: 29, icon: '📝', category: 'text' },
    { name: '文案二创工具', desc: '基于原始内容生成新文案', usage: 45, icon: '✨', category: 'text' },
    { name: '账号拆解工具', desc: '分析目标账号运营策略', usage: 18, icon: '📊', category: 'analysis' },
    { name: '视频拆解工具', desc: '深入分析视频内容结构', usage: 32, icon: '🎬', category: 'video' },
    { name: '图片处理工具', desc: '批量处理和优化图片', usage: 15, icon: '🖼️', category: 'image' },
    { name: '数据导出工具', desc: '导出各类数据报表', usage: 28, icon: '📥', category: 'data' },
  ]

  const categories = [
    { key: 'all', label: '全部工具' },
    { key: 'text', label: '文案工具' },
    { key: 'video', label: '视频工具' },
    { key: 'image', label: '图片工具' },
    { key: 'analysis', label: '分析工具' },
  ]

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 24 }}>工具箱</h1>

      <Tabs
        items={categories.map(cat => ({
          key: cat.key,
          label: cat.label,
          children: (
            <Row gutter={[16, 16]}>
              {tools
                .filter(tool => cat.key === 'all' || tool.category === cat.key)
                .map((tool, index) => (
                  <Col span={6} key={index}>
                    <Card hoverable style={{ borderRadius: 8, height: '100%' }}>
                      <div style={{ fontSize: 48, marginBottom: 16, textAlign: 'center' }}>
                        {tool.icon}
                      </div>
                      <h3 style={{ marginBottom: 8, textAlign: 'center' }}>{tool.name}</h3>
                      <p style={{ color: '#8c8c8c', fontSize: 12, marginBottom: 16, textAlign: 'center' }}>
                        {tool.desc}
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        borderTop: '1px solid #f0f0f0',
                        paddingTop: 12
                      }}>
                        <span style={{ fontSize: 12, color: '#8c8c8c' }}>使用{tool.usage}次</span>
                        <a>立即使用 →</a>
                      </div>
                    </Card>
                  </Col>
                ))}
            </Row>
          ),
        }))}
      />
    </div>
  )
}
