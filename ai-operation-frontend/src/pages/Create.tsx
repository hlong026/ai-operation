import { useState } from 'react'
import { Card, Steps, Button, Radio, Input, Select, Space } from 'antd'
import { SearchOutlined, FireOutlined } from '@ant-design/icons'

const { TextArea } = Input

export default function Create() {
  const [current, setCurrent] = useState(0)
  const [selectedTopic, setSelectedTopic] = useState('')

  const topics = [
    { title: '如何在30天内涨粉10万', heat: 9.8, type: '知识分享' },
    { title: '2024年最火的短视频拍摄技巧', heat: 9.5, type: '教程类' },
    { title: '普通人如何通过短视频月入过万', heat: 9.2, type: '励志类' },
  ]

  const steps = [
    { title: '选择选题' },
    { title: '生成文案' },
    { title: '生成素材' },
    { title: '发布内容' },
  ]

  const renderStep = () => {
    switch (current) {
      case 0:
        return (
          <div>
            <div style={{ marginBottom: 24 }}>
              <Input
                size="large"
                placeholder="搜索选题..."
                prefix={<SearchOutlined />}
                suffix={<Button type="primary">搜索</Button>}
              />
            </div>

            <h3>热门选题</h3>
            <Radio.Group 
              value={selectedTopic} 
              onChange={e => setSelectedTopic(e.target.value)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {topics.map((topic, index) => (
                  <Card 
                    key={index}
                    hoverable
                    style={{ cursor: 'pointer' }}
                  >
                    <Radio value={topic.title}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
                            {topic.title}
                          </div>
                          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                            <FireOutlined style={{ color: '#ff4d4f' }} /> 热度: {topic.heat} | 💬 适合: {topic.type}
                          </div>
                        </div>
                      </div>
                    </Radio>
                  </Card>
                ))}
              </Space>
            </Radio.Group>

            <div style={{ marginTop: 24 }}>
              <h4>或者自定义选题:</h4>
              <Input placeholder="输入您的选题..." />
            </div>
          </div>
        )
      
      case 1:
        return (
          <div>
            <div style={{ marginBottom: 24 }}>
              <p><strong>选题:</strong> {selectedTopic || '如何在30天内涨粉10万'}</p>
            </div>

            <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
              <div>
                <label>目标平台:</label>
                <Radio.Group defaultValue="douyin">
                  <Radio value="douyin">抖音</Radio>
                  <Radio value="xiaohongshu">小红书</Radio>
                  <Radio value="shipin">视频号</Radio>
                </Radio.Group>
              </div>

              <div>
                <label>内容风格:</label>
                <Select defaultValue="knowledge" style={{ width: 200 }}>
                  <Select.Option value="knowledge">知识分享</Select.Option>
                  <Select.Option value="funny">搞笑</Select.Option>
                  <Select.Option value="emotional">情感</Select.Option>
                </Select>
              </div>
            </Space>

            <Card style={{ background: '#f5f5f5' }}>
              <h4>生成的文案:</h4>
              <div style={{ marginBottom: 16 }}>
                <strong>标题:</strong> 30天涨粉10万的秘密，我终于找到了！
              </div>
              <div style={{ marginBottom: 16 }}>
                <strong>正文:</strong>
                <p>大家好，我是XXX。今天要分享一个让我在30天内涨粉10万的方法。这个方法分为三个步骤...</p>
              </div>
              <div>
                <strong>标签:</strong> #涨粉技巧 #短视频运营 #新手必看
              </div>
              <div style={{ marginTop: 16 }}>
                <Button>重新生成</Button>
                <Button type="link">编辑文案</Button>
              </div>
            </Card>
          </div>
        )
      
      case 2:
        return (
          <div>
            <Card>
              <h4>视频预览</h4>
              <div style={{ 
                width: '100%', 
                height: 300, 
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                marginBottom: 16
              }}>
                ▶️ 播放预览 | 时长: 1:23
              </div>

              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <label>配音:</label>
                  <Select defaultValue="male" style={{ width: 200, marginLeft: 8 }}>
                    <Select.Option value="male">男声</Select.Option>
                    <Select.Option value="female">女声</Select.Option>
                    <Select.Option value="child">童声</Select.Option>
                  </Select>
                </div>

                <div>
                  <label>背景音乐:</label>
                  <Select defaultValue="music1" style={{ width: 200, marginLeft: 8 }}>
                    <Select.Option value="music1">轻快音乐</Select.Option>
                    <Select.Option value="music2">激励音乐</Select.Option>
                  </Select>
                </div>
              </Space>

              <div style={{ marginTop: 16 }}>
                <Button>重新生成</Button>
                <Button type="link">上传自己的素材</Button>
              </div>
            </Card>
          </div>
        )
      
      case 3:
        return (
          <div>
            <h4>选择发布平台:</h4>
            <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
              <Card>
                <label>
                  <input type="checkbox" defaultChecked /> 抖音 - @我的抖音号
                </label>
              </Card>
              <Card>
                <label>
                  <input type="checkbox" defaultChecked /> 小红书 - @我的小红书号
                </label>
              </Card>
              <Card>
                <label>
                  <input type="checkbox" /> 视频号 - 未绑定 <a>立即绑定</a>
                </label>
              </Card>
            </Space>

            <h4>发布时间:</h4>
            <Radio.Group defaultValue="now" style={{ marginBottom: 24 }}>
              <Radio value="now">立即发布</Radio>
              <Radio value="scheduled">定时发布</Radio>
            </Radio.Group>

            <Card title="内容预览" style={{ background: '#f5f5f5' }}>
              <p><strong>标题:</strong> 30天涨粉10万的秘密，我终于找到了！</p>
              <p><strong>封面:</strong> [图片预览]</p>
              <p><strong>标签:</strong> #涨粉技巧 #短视频运营 #新手必看</p>
            </Card>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 24 }}>一键创作</h1>

      <Card>
        <Steps current={current} items={steps} style={{ marginBottom: 32 }} />
        
        <div style={{ minHeight: 400 }}>
          {renderStep()}
        </div>

        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
          >
            上一步
          </Button>
          <Button 
            type="primary"
            onClick={() => {
              if (current === steps.length - 1) {
                alert('发布成功！')
              } else {
                setCurrent(current + 1)
              }
            }}
          >
            {current === steps.length - 1 ? '确认发布' : '下一步'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
