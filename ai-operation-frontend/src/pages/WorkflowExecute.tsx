import { useState } from 'react'
import { Card, Form, Input, Select, Button, Checkbox, Alert, Timeline, Tag } from 'antd'
import { ArrowLeftOutlined, PlayCircleOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'

const { TextArea } = Input

export default function WorkflowExecute() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form] = Form.useForm()
  const [executing, setExecuting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const workflow = {
    name: '爆款短视频文案生成器',
    credits: 5,
    currentCredits: 1000,
  }

  const onFinish = async (values: any) => {
    setExecuting(true)
    setResult(null)
    
    // 模拟执行
    setTimeout(() => {
      setExecuting(false)
      setResult({
        success: true,
        duration: 4.2,
        output: {
          variants: [
            '你知道吗？这个方法让我的粉丝暴涨10倍！今天教你...',
            '震惊！原来大V都在用这个技巧，难怪涨粉这么快...',
            '3分钟学会这个方法，让你的视频播放量翻倍！',
          ]
        }
      })
    }, 3000)
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(`/workflows/${id}`)}
        style={{ marginBottom: 16 }}
      >
        返回详情
      </Button>

      <Card title={`执行工作流: ${workflow.name}`}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <h3>输入参数</h3>
          
          <Form.Item
            label="内容主题"
            name="topic"
            rules={[{ required: true, message: '请输入内容主题' }]}
          >
            <Input placeholder="请输入内容主题" />
          </Form.Item>

          <Form.Item
            label="目标平台"
            name="platforms"
            rules={[{ required: true, message: '请选择目标平台' }]}
          >
            <Checkbox.Group>
              <Checkbox value="douyin">抖音</Checkbox>
              <Checkbox value="xiaohongshu">小红书</Checkbox>
              <Checkbox value="shipin">视频号</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            label="内容风格"
            name="style"
          >
            <Select placeholder="请选择内容风格">
              <Select.Option value="funny">搞笑</Select.Option>
              <Select.Option value="knowledge">知识</Select.Option>
              <Select.Option value="emotional">情感</Select.Option>
              <Select.Option value="drama">剧情</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="其他参数 (JSON格式)"
            name="params"
          >
            <TextArea 
              rows={4} 
              placeholder='{"length": "short", "tone": "casual"}'
            />
          </Form.Item>

          <Alert
            message={`本次执行将消耗 ${workflow.credits} 积分 (当前余额: ${workflow.currentCredits}积分)`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<PlayCircleOutlined />}
              loading={executing}
              size="large"
            >
              {executing ? '执行中...' : '执行工作流'}
            </Button>
          </Form.Item>
        </Form>

        {/* 执行状态 */}
        {executing && (
          <Card style={{ marginTop: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <LoadingOutlined style={{ fontSize: 24, color: '#1890ff', marginRight: 8 }} />
              <span style={{ fontSize: 16 }}>执行中... (已用时 3秒)</span>
            </div>
            <Timeline
              items={[
                { children: '发送请求到 Webhook...', color: 'green', dot: <CheckCircleOutlined /> },
                { children: '等待响应...', color: 'blue', dot: <LoadingOutlined /> },
                { children: '处理返回数据...', color: 'gray' },
              ]}
            />
          </Card>
        )}

        {/* 执行结果 */}
        {result && (
          <Card 
            title="执行结果" 
            style={{ marginTop: 24 }}
            extra={<Tag color="success">执行成功</Tag>}
          >
            <div style={{ marginBottom: 16 }}>
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
              <span>用时: {result.duration}秒 | 消耗积分: {workflow.credits}</span>
            </div>

            <h4>输出结果</h4>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, marginBottom: 16 }}>
              {result.output.variants.map((variant: string, index: number) => (
                <div key={index} style={{ marginBottom: 16 }}>
                  <strong>版本{index + 1}:</strong>
                  <p style={{ marginTop: 8 }}>{variant}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <Button>复制结果</Button>
              <Button>保存到内容库</Button>
              <Button type="primary" onClick={() => form.submit()}>再次执行</Button>
            </div>
          </Card>
        )}

        {/* 执行历史 */}
        <Card title="执行历史" style={{ marginTop: 24 }}>
          <Timeline
            items={[
              { 
                children: (
                  <div>
                    <div>2024-12-03 14:30</div>
                    <Tag color="success">成功</Tag>
                    <span>5积分 | 用时4.2秒</span>
                  </div>
                )
              },
              { 
                children: (
                  <div>
                    <div>2024-12-03 10:15</div>
                    <Tag color="success">成功</Tag>
                    <span>5积分 | 用时3.8秒</span>
                  </div>
                )
              },
              { 
                children: (
                  <div>
                    <div>2024-12-02 16:45</div>
                    <Tag color="error">失败</Tag>
                    <span>0积分 | 错误: 超时</span>
                  </div>
                )
              },
            ]}
          />
        </Card>
      </Card>
    </div>
  )
}
