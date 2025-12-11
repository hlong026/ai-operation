import { useState, useEffect } from 'react'
import { 
  Card, Form, Input, Select, Button, Checkbox, Alert, Tag, List, 
  Avatar, Tooltip, message, Spin, Empty, Progress, Drawer
} from 'antd'
import { 
  ArrowLeftOutlined, PlayCircleOutlined, ThunderboltOutlined, HistoryOutlined,
  DownloadOutlined, ShareAltOutlined, CopyOutlined,
  ClockCircleOutlined, VideoCameraOutlined, ReloadOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const { TextArea } = Input

interface ExecutionRecord {
  id: string
  status: 'success' | 'failed' | 'running'
  credits: number
  duration: number
  createdAt: Date
  output?: {
    type: 'video' | 'text' | 'image'
    url?: string
    content?: string
    thumbnail?: string
  }
  error?: string
}

export default function WorkflowExecute() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { profile } = useAuth()
  const [form] = Form.useForm()
  const [executing, setExecuting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentResult, setCurrentResult] = useState<ExecutionRecord | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [executionHistory, setExecutionHistory] = useState<ExecutionRecord[]>([
    {
      id: '1',
      status: 'success',
      credits: 10,
      duration: 45.2,
      createdAt: new Date('2024-12-10 14:30'),
      output: {
        type: 'video',
        url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnail: 'https://picsum.photos/400/225?random=1'
      }
    },
    {
      id: '2',
      status: 'success',
      credits: 10,
      duration: 38.5,
      createdAt: new Date('2024-12-10 10:15'),
      output: {
        type: 'video',
        url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnail: 'https://picsum.photos/400/225?random=2'
      }
    },
    {
      id: '3',
      status: 'failed',
      credits: 0,
      duration: 0,
      createdAt: new Date('2024-12-09 16:45'),
      error: '视频生成超时，请重试'
    },
  ])

  // 模拟工作流数据
  const workflow = {
    id: id,
    name: '爆款短视频生成器',
    desc: '输入主题和风格，自动生成适合各平台的短视频内容',
    credits: 10,
    avatar: '🎬',
    category: '视频创作',
    estimatedTime: '30-60秒',
  }

  // 模拟执行进度
  useEffect(() => {
    if (executing) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(timer)
            return prev
          }
          return prev + Math.random() * 15
        })
      }, 500)
      return () => clearInterval(timer)
    } else {
      setProgress(0)
    }
  }, [executing])

  const onFinish = async () => {
    if ((profile?.credits || 0) < workflow.credits) {
      message.warning('积分不足，请先充值')
      navigate('/pricing')
      return
    }

    setExecuting(true)
    setCurrentResult(null)
    setProgress(0)
    
    // 模拟执行
    setTimeout(() => {
      setExecuting(false)
      setProgress(100)
      
      const newResult: ExecutionRecord = {
        id: Date.now().toString(),
        status: 'success',
        credits: workflow.credits,
        duration: 45.2,
        createdAt: new Date(),
        output: {
          type: 'video',
          url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
          thumbnail: 'https://picsum.photos/400/225?random=' + Date.now()
        }
      }
      
      setCurrentResult(newResult)
      setExecutionHistory(prev => [newResult, ...prev])
      message.success(`执行成功！消耗 ${workflow.credits} 积分`)
    }, 5000)
  }

  const loadHistoryResult = (record: ExecutionRecord) => {
    setCurrentResult(record)
    setHistoryOpen(false)
  }

  const copyResult = () => {
    if (currentResult?.output?.url) {
      navigator.clipboard.writeText(currentResult.output.url)
      message.success('链接已复制')
    }
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', height: 'calc(100vh - 140px)', display: 'flex', gap: 24 }}>
      {/* 左侧：参数输入 */}
      <Card 
        style={{ width: 400, flexShrink: 0, display: 'flex', flexDirection: 'column' }}
        styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' } }}
      >
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(`/workflows/${id}`)}
          style={{ marginBottom: 16, padding: 0 }}
        >
          返回工作流详情
        </Button>

        {/* 工作流信息 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
          <Avatar size={48} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: 24 }}>
            {workflow.avatar}
          </Avatar>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, marginBottom: 4 }}>{workflow.name}</h3>
            <div style={{ display: 'flex', gap: 12, color: '#8c8c8c', fontSize: 12 }}>
              <span><ThunderboltOutlined /> {workflow.credits}积分/次</span>
              <span><ClockCircleOutlined /> {workflow.estimatedTime}</span>
            </div>
          </div>
        </div>

        {/* 参数表单 */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ flex: 1 }}
        >
          <Form.Item
            label="视频主题"
            name="topic"
            rules={[{ required: true, message: '请输入视频主题' }]}
          >
            <Input placeholder="例如：秋季穿搭分享" />
          </Form.Item>

          <Form.Item
            label="目标平台"
            name="platforms"
            rules={[{ required: true, message: '请选择目标平台' }]}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Checkbox value="douyin">抖音</Checkbox>
                <Checkbox value="xiaohongshu">小红书</Checkbox>
                <Checkbox value="shipin">视频号</Checkbox>
                <Checkbox value="kuaishou">快手</Checkbox>
              </div>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            label="视频风格"
            name="style"
            rules={[{ required: true, message: '请选择视频风格' }]}
          >
            <Select placeholder="请选择视频风格">
              <Select.Option value="vlog">Vlog日常</Select.Option>
              <Select.Option value="tutorial">教程讲解</Select.Option>
              <Select.Option value="funny">搞笑娱乐</Select.Option>
              <Select.Option value="emotional">情感故事</Select.Option>
              <Select.Option value="knowledge">知识科普</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="视频时长"
            name="duration"
          >
            <Select placeholder="请选择视频时长" defaultValue="30">
              <Select.Option value="15">15秒</Select.Option>
              <Select.Option value="30">30秒</Select.Option>
              <Select.Option value="60">60秒</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="补充说明"
            name="description"
          >
            <TextArea 
              rows={3} 
              placeholder="描述你想要的视频效果、特殊要求等..."
            />
          </Form.Item>

          <Alert
            message={
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>本次执行消耗 {workflow.credits} 积分</span>
                <span>余额: {profile?.credits || 0} 积分</span>
              </div>
            }
            type="info"
            showIcon
            icon={<ThunderboltOutlined />}
            style={{ marginBottom: 16 }}
          />

          <Form.Item style={{ marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<PlayCircleOutlined />}
              loading={executing}
              size="large"
              block
            >
              {executing ? '生成中...' : '开始生成'}
            </Button>
          </Form.Item>
        </Form>

        {/* 执行历史入口 */}
        <Button 
          type="text" 
          icon={<HistoryOutlined />} 
          onClick={() => setHistoryOpen(true)}
          style={{ marginTop: 16 }}
        >
          查看执行历史 ({executionHistory.length})
        </Button>
      </Card>

      {/* 右侧：结果输出 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* 状态栏 */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <VideoCameraOutlined style={{ fontSize: 18, color: '#722ed1' }} />
              <span style={{ fontWeight: 500 }}>输出结果</span>
              {currentResult && (
                <>
                  <Tag color={currentResult.status === 'success' ? 'success' : 'error'}>
                    {currentResult.status === 'success' ? '生成成功' : '生成失败'}
                  </Tag>
                  <span style={{ color: '#8c8c8c', fontSize: 12 }}>
                    用时 {currentResult.duration.toFixed(1)}秒 | {currentResult.createdAt.toLocaleString()}
                  </span>
                </>
              )}
            </div>
            {currentResult?.output?.url && (
              <div style={{ display: 'flex', gap: 8 }}>
                <Tooltip title="复制链接">
                  <Button size="small" icon={<CopyOutlined />} onClick={copyResult} />
                </Tooltip>
                <Tooltip title="下载视频">
                  <Button size="small" icon={<DownloadOutlined />} />
                </Tooltip>
                <Tooltip title="分享">
                  <Button size="small" icon={<ShareAltOutlined />} />
                </Tooltip>
              </div>
            )}
          </div>
        </Card>

        {/* 视频预览区域 */}
        <Card 
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          styles={{ body: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 } }}
        >
          {executing ? (
            <div style={{ textAlign: 'center' }}>
              <Spin size="large" />
              <div style={{ marginTop: 24, marginBottom: 16 }}>
                <Progress 
                  percent={Math.round(progress)} 
                  status="active" 
                  style={{ width: 300 }}
                />
              </div>
              <p style={{ color: '#8c8c8c', marginBottom: 8 }}>正在生成视频...</p>
              <p style={{ color: '#bfbfbf', fontSize: 12 }}>预计需要 {workflow.estimatedTime}</p>
            </div>
          ) : currentResult ? (
            currentResult.status === 'success' && currentResult.output ? (
              <div style={{ width: '100%', maxWidth: 800 }}>
                {/* 视频播放器 */}
                <div style={{ 
                  position: 'relative', 
                  paddingBottom: '56.25%', 
                  background: '#000', 
                  borderRadius: 12,
                  overflow: 'hidden'
                }}>
                  <video
                    controls
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                    poster={currentResult.output.thumbnail}
                    src={currentResult.output.url}
                  />
                </div>
                
                {/* 视频信息 */}
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Tag color="purple">视频已生成</Tag>
                    <span style={{ color: '#8c8c8c', marginLeft: 8 }}>
                      消耗 {currentResult.credits} 积分
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button icon={<ReloadOutlined />} onClick={() => form.submit()}>
                      重新生成
                    </Button>
                    <Button type="primary" icon={<DownloadOutlined />}>
                      下载视频
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
                <h3 style={{ color: '#ff4d4f' }}>生成失败</h3>
                <p style={{ color: '#8c8c8c' }}>{currentResult.error}</p>
                <Button type="primary" onClick={() => form.submit()} style={{ marginTop: 16 }}>
                  重新尝试
                </Button>
              </div>
            )
          ) : (
            <Empty 
              image={<VideoCameraOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
              description={
                <div>
                  <p style={{ color: '#8c8c8c', marginBottom: 8 }}>填写左侧参数后点击"开始生成"</p>
                  <p style={{ color: '#bfbfbf', fontSize: 12 }}>生成的视频将在这里预览</p>
                </div>
              }
            />
          )}
        </Card>
      </div>

      {/* 执行历史抽屉 */}
      <Drawer
        title={<><HistoryOutlined /> 执行历史</>}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        width={450}
      >
        {executionHistory.length === 0 ? (
          <Empty description="暂无执行记录" />
        ) : (
          <List
            dataSource={executionHistory}
            renderItem={(record) => (
              <List.Item
                style={{ 
                  cursor: 'pointer', 
                  background: currentResult?.id === record.id ? '#f0f5ff' : 'transparent',
                  borderRadius: 8,
                  marginBottom: 8,
                  padding: 12
                }}
                onClick={() => loadHistoryResult(record)}
              >
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Tag color={record.status === 'success' ? 'success' : 'error'}>
                      {record.status === 'success' ? '成功' : '失败'}
                    </Tag>
                    <span style={{ color: '#8c8c8c', fontSize: 12 }}>
                      {record.createdAt.toLocaleString()}
                    </span>
                  </div>
                  
                  {record.status === 'success' && record.output?.thumbnail && (
                    <div style={{ 
                      width: '100%', 
                      height: 120, 
                      borderRadius: 8, 
                      overflow: 'hidden',
                      marginBottom: 8
                    }}>
                      <img 
                        src={record.output.thumbnail} 
                        alt="缩略图"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8c8c8c', fontSize: 12 }}>
                    <span><ThunderboltOutlined /> {record.credits}积分</span>
                    {record.duration > 0 && <span><ClockCircleOutlined /> {record.duration.toFixed(1)}秒</span>}
                  </div>
                  
                  {record.error && (
                    <div style={{ color: '#ff4d4f', fontSize: 12, marginTop: 4 }}>
                      {record.error}
                    </div>
                  )}
                </div>
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </div>
  )
}
