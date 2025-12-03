import { useState } from 'react'
import { Card, Row, Col, Button, Input, Select, Tag, Rate } from 'antd'
import { PlusOutlined, SearchOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Search } = Input

export default function Workflows() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('all')
  const [type, setType] = useState('all')

  const workflows = [
    {
      id: 1,
      name: '爆款短视频文案生成器',
      desc: '基于热点话题和用户画像，自动生成吸引眼球的短视频文案',
      type: 'Coze',
      category: '内容创作',
      tags: ['文案', '短视频', 'AI生成'],
      credits: 5,
      usage: 1234,
      rating: 4.8,
      reviews: 156,
    },
    {
      id: 2,
      name: '账号数据分析助手',
      desc: '自动抓取和分析竞品账号数据，生成详细的分析报告',
      type: 'n8n',
      category: '数据分析',
      tags: ['数据', '分析', '报告'],
      credits: 10,
      usage: 856,
      rating: 4.9,
      reviews: 89,
    },
    {
      id: 3,
      name: '视频脚本生成器',
      desc: '根据主题自动生成完整的视频脚本，包含分镜和台词',
      type: 'Coze',
      category: '内容创作',
      tags: ['脚本', '视频', 'AI'],
      credits: 8,
      usage: 980,
      rating: 4.7,
      reviews: 123,
    },
  ]

  const categories = ['全部分类', '内容创作', '数据分析', '营销推广', '数据处理']
  const types = ['全部类型', 'Coze', 'n8n']

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>工作流管理</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => navigate('/workflows/upload')}
        >
          上传工作流
        </Button>
      </div>

      {/* 筛选区域 */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <Select
            style={{ width: 150 }}
            value={type}
            onChange={setType}
            options={types.map(t => ({ label: t, value: t }))}
          />
          <Select
            style={{ width: 150 }}
            value={category}
            onChange={setCategory}
            options={categories.map(c => ({ label: c, value: c }))}
          />
          <Search
            placeholder="搜索工作流..."
            allowClear
            style={{ flex: 1 }}
            prefix={<SearchOutlined />}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ color: '#8c8c8c' }}>热门标签:</span>
          {['内容创作', '数据分析', '营销推广', '数据处理'].map(tag => (
            <Tag key={tag} style={{ cursor: 'pointer' }}>#{tag}</Tag>
          ))}
        </div>
      </Card>

      {/* 工作流列表 */}
      <Row gutter={[16, 16]}>
        {workflows.map(workflow => (
          <Col span={24} key={workflow.id}>
            <Card 
              hoverable
              style={{ borderRadius: 8 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <ThunderboltOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    <h2 style={{ margin: 0 }}>{workflow.name}</h2>
                    <Tag color={workflow.type === 'Coze' ? 'blue' : 'green'}>{workflow.type}</Tag>
                  </div>
                  
                  <p style={{ color: '#595959', marginBottom: 12 }}>{workflow.desc}</p>
                  
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ color: '#8c8c8c', marginRight: 8 }}>分类: {workflow.category}</span>
                    <span style={{ color: '#8c8c8c', marginRight: 8 }}>标签:</span>
                    {workflow.tags.map(tag => (
                      <Tag key={tag} color="blue">{tag}</Tag>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', gap: 24, color: '#8c8c8c' }}>
                    <span>💰 {workflow.credits}积分/次</span>
                    <span>📊 使用{workflow.usage}次</span>
                    <span>
                      <Rate disabled defaultValue={workflow.rating} style={{ fontSize: 14 }} />
                      {workflow.rating} ({workflow.reviews}评价)
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 24 }}>
                  <Button type="primary" onClick={() => navigate(`/workflows/${workflow.id}`)}>
                    查看详情
                  </Button>
                  <Button onClick={() => navigate(`/workflows/${workflow.id}/execute`)}>
                    立即使用
                  </Button>
                  <Button type="text">编辑</Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
