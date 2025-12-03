import { Card, Button, Tag, Rate, Image, Tabs } from 'antd'
import { ArrowLeftOutlined, StarOutlined, ShareAltOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'

export default function WorkflowDetail() {
  const navigate = useNavigate()
  const { id } = useParams()

  const workflow = {
    name: '爆款短视频文案生成器',
    type: 'Coze',
    rating: 4.8,
    reviews: 156,
    usage: 1234,
    category: '内容创作',
    tags: ['文案', '短视频', 'AI生成', '爆款'],
    credits: 5,
    videoUrl: 'https://example.com/demo.mp4',
    screenshots: [
      'https://via.placeholder.com/300x200',
      'https://via.placeholder.com/300x200',
      'https://via.placeholder.com/300x200',
    ],
    features: [
      '支持多种内容类型：搞笑、知识、情感、剧情等',
      '自动分析热点话题，生成贴合趋势的文案',
      '提供多个文案版本供选择',
      '支持自定义风格和语气',
    ],
    steps: [
      '输入内容主题或关键词',
      '选择目标平台（抖音/小红书/视频号）',
      '选择内容风格',
      '点击生成，等待3-5秒',
      '查看生成的文案，选择满意的版本',
    ],
    notes: [
      '每次调用消耗5积分',
      '生成的文案仅供参考，请根据实际情况修改',
    ],
  }

  const tabItems = [
    {
      key: 'intro',
      label: '功能介绍',
      children: (
        <div>
          <h3>功能说明</h3>
          <ul>
            {workflow.features.map((feature, index) => (
              <li key={index} style={{ marginBottom: 8 }}>{feature}</li>
            ))}
          </ul>
          
          <h3 style={{ marginTop: 24 }}>使用步骤</h3>
          <ol>
            {workflow.steps.map((step, index) => (
              <li key={index} style={{ marginBottom: 8 }}>{step}</li>
            ))}
          </ol>
          
          <h3 style={{ marginTop: 24 }}>注意事项</h3>
          <ul>
            {workflow.notes.map((note, index) => (
              <li key={index} style={{ marginBottom: 8, color: '#ff4d4f' }}>⚠️ {note}</li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      key: 'reviews',
      label: `评价 (${workflow.reviews})`,
      children: <div>评价内容...</div>,
    },
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/workflows')}
        style={{ marginBottom: 16 }}
      >
        返回列表
      </Button>

      <Card>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <h1 style={{ margin: 0 }}>{workflow.name}</h1>
                <Tag color="blue">{workflow.type}</Tag>
              </div>
              
              <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
                <span>
                  <Rate disabled defaultValue={workflow.rating} />
                  {workflow.rating} ({workflow.reviews}条评价)
                </span>
                <span>📊 使用{workflow.usage}次</span>
              </div>
              
              <div style={{ marginBottom: 12 }}>
                <span style={{ marginRight: 8 }}>分类: {workflow.category}</span>
              </div>
              
              <div>
                {workflow.tags.map(tag => (
                  <Tag key={tag} color="blue">#{tag}</Tag>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 8 }}>
              <Button icon={<StarOutlined />}>收藏</Button>
              <Button icon={<ShareAltOutlined />}>分享</Button>
            </div>
          </div>
        </div>

        {/* 演示视频 */}
        <div style={{ marginBottom: 24 }}>
          <h3>演示视频</h3>
          <div style={{ 
            width: '100%', 
            height: 400, 
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            borderRadius: 8
          }}>
            ▶️ 播放演示视频
          </div>
        </div>

        {/* 运行界面截图 */}
        <div style={{ marginBottom: 24 }}>
          <h3>运行界面截图</h3>
          <div style={{ display: 'flex', gap: 16 }}>
            {workflow.screenshots.map((url, index) => (
              <Image
                key={index}
                width={200}
                src={url}
                alt={`截图${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 详细信息 */}
        <Tabs items={tabItems} />

        {/* 操作按钮 */}
        <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
          <Button 
            type="primary" 
            size="large"
            onClick={() => navigate(`/workflows/${id}/execute`)}
          >
            立即使用 - {workflow.credits}积分
          </Button>
        </div>
      </Card>
    </div>
  )
}
