import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Card, Button, Input, Avatar, Tag, Rate, Spin, message, 
  Tooltip, Alert, Progress, Upload, List, Empty, Drawer
} from 'antd'
import { 
  ArrowLeftOutlined, ThunderboltOutlined, PlayCircleOutlined,
  CopyOutlined, DownloadOutlined, HistoryOutlined, PlusOutlined,
  UploadOutlined, FileTextOutlined, ClockCircleOutlined,
  CheckCircleOutlined, CloseCircleOutlined
} from '@ant-design/icons'
import { useAuth } from '../contexts/AuthContext'

const { TextArea } = Input

interface ExecutionRecord {
  id: string
  status: 'success' | 'failed'
  credits: number
  duration: number
  createdAt: Date
  input: string
  output?: string
  error?: string
}

export default function ToolDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, profile } = useAuth()
  const [inputValue, setInputValue] = useState('')
  const [executing, setExecuting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentResult, setCurrentResult] = useState<ExecutionRecord | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [executionHistory, setExecutionHistory] = useState<ExecutionRecord[]>([
    {
      id: '1',
      status: 'success',
      credits: 3,
      duration: 2.5,
      createdAt: new Date('2024-12-10 14:30'),
      input: '这是一段测试视频的文案内容...',
      output: '提取的文案内容：\n\n大家好，今天给大家分享一个超级实用的技巧...'
    },
    {
      id: '2',
      status: 'success',
      credits: 3,
      duration: 1.8,
      createdAt: new Date('2024-12-10 10:15'),
      input: '另一段视频内容...',
      output: '提取的文案内容：\n\n你知道吗？这个方法可以让你的效率提升10倍...'
    },
  ])

  // 模拟工具数据
  const tool = {
    id: id,
    name: '文案提取工具',
    desc: '从视频中智能提取文案内容，支持多种视频格式。使用先进的语音识别技术，准确率高达98%。',
    icon: '📝',
    category: '文案工具',
    credits: 3,
    usage: 2934,
    rating: 4.8,
    reviews: 156,
    tags: ['文案', '提取', '视频'],
    inputType: 'text', // text, file, url
    inputPlaceholder: '请输入视频链接或粘贴视频内容...',
    outputType: 'text', // text, file, image
    instructions: '1. 输入视频链接或上传视频文件\n2. 点击"开始提取"按钮\n3. 等待处理完成，获取提取的文案',
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
          return prev + Math.random() * 20
        })
      }, 300)
      return () => clearInterval(timer)
    } else {
      setProgress(0)
    }
  }, [executing])

  const handleExecute = async () => {
    if (!inputValue.trim()) {
      message.warning('请输入内容')
      return
    }

    if (!isAuthenticated) {
      message.warning('请先登录')
      navigate('/login')
      return
    }

    if ((profile?.credits || 0) < tool.credits) {
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
        credits: tool.credits,
        duration: 2.5,
        createdAt: new Date(),
        input: inputValue,
        output: generateMockOutput(inputValue),
      }

      setCurrentResult(newResult)
      setExecutionHistory(prev => [newResult, ...prev])
      message.success(`执行成功！消耗 ${tool.credits} 积分`)
    }, 2500)
  }

  const generateMockOutput = (input: string): string => {
    return `📝 提取的文案内容：

大家好，今天给大家分享一个超级实用的技巧！

很多人都不知道，其实只需要简单的几步，就能让你的工作效率提升10倍！

首先，我们需要准备以下材料：
1. 一个清晰的目标
2. 合理的时间规划
3. 专注的执行力

接下来，按照这个方法操作：
- 第一步：明确你要达成的目标
- 第二步：将大目标拆解成小任务
- 第三步：每天专注完成2-3个小任务

坚持一周，你就会发现惊人的变化！

记得点赞收藏，下次找不到就麻烦了～

#效率提升 #工作技巧 #干货分享`
  }

  const copyResult = () => {
    if (currentResult?.output) {
      navigator.clipboard.writeText(currentResult.output)
      message.success('已复制到剪贴板')
    }
  }

  const loadHistoryResult = (record: ExecutionRecord) => {
    setCurrentResult(record)
    setInputValue(record.input)
    setHistoryOpen(false)
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', height: 'calc(100vh - 140px)', display: 'flex', gap: 24 }}>
      {/* 左侧：工具信息和输入 */}
      <Card 
        style={{ width: 420, flexShrink: 0, display: 'flex', flexDirection: 'column' }}
        styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' } }}
      >
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/tools')}
          style={{ marginBottom: 16, padding: 0 }}
        >
          返回工具箱
        </Button>

        {/* 工具信息 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
          <Avatar 
            size={56} 
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: 28 }}
          >
            {tool.icon}
          </Avatar>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, marginBottom: 4 }}>{tool.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Rate disabled defaultValue={tool.rating} style={{ fontSize: 12 }} />
              <span style={{ color: '#8c8c8c', fontSize: 12 }}>{tool.rating} ({tool.reviews})</span>
            </div>
            <Tag color="blue">{tool.category}</Tag>
          </div>
        </div>

        <p style={{ color: '#595959', marginBottom: 16 }}>{tool.desc}</p>

        {/* 标签 */}
        <div style={{ marginBottom: 16 }}>
          {tool.tags.map(tag => (
            <Tag key={tag} style={{ marginBottom: 4 }}>#{tag}</Tag>
          ))}
        </div>

        {/* 使用说明 */}
        <div style={{ 
          background: '#f5f5f5', 
          borderRadius: 8, 
          padding: 12, 
          marginBottom: 16,
          fontSize: 13,
          color: '#595959'
        }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>使用说明</div>
          <div style={{ whiteSpace: 'pre-line' }}>{tool.instructions}</div>
        </div>

        {/* 输入区域 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>输入内容</div>
          <TextArea
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={tool.inputPlaceholder}
            style={{ flex: 1, minHeight: 150, marginBottom: 12 }}
          />

          <Upload.Dragger 
            style={{ marginBottom: 16 }}
            beforeUpload={() => false}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text" style={{ fontSize: 13 }}>或拖拽文件到此处上传</p>
          </Upload.Dragger>

          <Alert
            message={
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><ThunderboltOutlined /> 消耗 {tool.credits} 积分</span>
                <span>余额: {profile?.credits || 0} 积分</span>
              </div>
            }
            type="info"
            style={{ marginBottom: 16 }}
          />

          <Button 
            type="primary" 
            icon={<PlayCircleOutlined />}
            onClick={handleExecute}
            loading={executing}
            size="large"
            block
          >
            {executing ? '处理中...' : '开始执行'}
          </Button>
        </div>

        {/* 执行历史入口 */}
        <Button 
          type="text" 
          icon={<HistoryOutlined />} 
          onClick={() => setHistoryOpen(true)}
          style={{ marginTop: 12 }}
        >
          执行历史 ({executionHistory.length})
        </Button>
      </Card>

      {/* 右侧：结果输出 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* 状态栏 */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FileTextOutlined style={{ fontSize: 18, color: '#1890ff' }} />
              <span style={{ fontWeight: 500 }}>输出结果</span>
              {currentResult && (
                <>
                  <Tag color={currentResult.status === 'success' ? 'success' : 'error'}>
                    {currentResult.status === 'success' ? '执行成功' : '执行失败'}
                  </Tag>
                  <span style={{ color: '#8c8c8c', fontSize: 12 }}>
                    用时 {currentResult.duration.toFixed(1)}秒
                  </span>
                </>
              )}
            </div>
            {currentResult?.output && (
              <div style={{ display: 'flex', gap: 8 }}>
                <Tooltip title="复制结果">
                  <Button size="small" icon={<CopyOutlined />} onClick={copyResult} />
                </Tooltip>
                <Tooltip title="下载">
                  <Button size="small" icon={<DownloadOutlined />} />
                </Tooltip>
              </div>
            )}
          </div>
        </Card>

        {/* 结果展示区域 */}
        <Card 
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', padding: 0 } }}
        >
          {executing ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <Spin size="large" />
                <div style={{ marginTop: 24, marginBottom: 16 }}>
                  <Progress 
                    percent={Math.round(progress)} 
                    status="active" 
                    style={{ width: 300 }}
                  />
                </div>
                <p style={{ color: '#8c8c8c' }}>正在处理中，请稍候...</p>
              </div>
            </div>
          ) : currentResult ? (
            currentResult.status === 'success' && currentResult.output ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* 结果内容 */}
                <div style={{ 
                  flex: 1, 
                  padding: 24, 
                  overflow: 'auto',
                  background: '#fafafa',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.8,
                  fontSize: 14
                }}>
                  {currentResult.output}
                </div>

                {/* 操作栏 */}
                <div style={{ 
                  padding: 16, 
                  borderTop: '1px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <Tag color="purple">消耗 {currentResult.credits} 积分</Tag>
                    <span style={{ color: '#8c8c8c', marginLeft: 8, fontSize: 12 }}>
                      {currentResult.createdAt.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button icon={<CopyOutlined />} onClick={copyResult}>
                      复制结果
                    </Button>
                    <Button type="primary" onClick={() => {
                      setInputValue('')
                      setCurrentResult(null)
                    }}>
                      继续使用
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <CloseCircleOutlined style={{ fontSize: 48, color: '#ff4d4f', marginBottom: 16 }} />
                  <h3 style={{ color: '#ff4d4f' }}>执行失败</h3>
                  <p style={{ color: '#8c8c8c' }}>{currentResult.error || '未知错误，请重试'}</p>
                  <Button type="primary" onClick={handleExecute} style={{ marginTop: 16 }}>
                    重新执行
                  </Button>
                </div>
              </div>
            )
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Empty 
                image={<FileTextOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
                description={
                  <div>
                    <p style={{ color: '#8c8c8c', marginBottom: 8 }}>在左侧输入内容后点击"开始执行"</p>
                    <p style={{ color: '#bfbfbf', fontSize: 12 }}>处理结果将在这里显示</p>
                  </div>
                }
              />
            </div>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {record.status === 'success' ? (
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      ) : (
                        <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                      )}
                      <Tag color={record.status === 'success' ? 'success' : 'error'}>
                        {record.status === 'success' ? '成功' : '失败'}
                      </Tag>
                    </div>
                    <span style={{ color: '#8c8c8c', fontSize: 12 }}>
                      {record.createdAt.toLocaleString()}
                    </span>
                  </div>
                  
                  <div style={{ 
                    background: '#f5f5f5', 
                    padding: 8, 
                    borderRadius: 4, 
                    marginBottom: 8,
                    fontSize: 12,
                    color: '#595959',
                    maxHeight: 60,
                    overflow: 'hidden'
                  }}>
                    {record.input.slice(0, 100)}...
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8c8c8c', fontSize: 12 }}>
                    <span><ThunderboltOutlined /> {record.credits}积分</span>
                    <span><ClockCircleOutlined /> {record.duration.toFixed(1)}秒</span>
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </div>
  )
}
