import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Card, Button, Input, Avatar, Tag, Rate, Spin, message, 
  Tooltip, Badge, Drawer, Slider, Switch, List, Popconfirm, Empty
} from 'antd'
import { 
  SendOutlined, UserOutlined, SettingOutlined,
  ThunderboltOutlined, ReloadOutlined, CopyOutlined, DeleteOutlined,
  LeftOutlined, QuestionCircleOutlined, HistoryOutlined, PlusOutlined,
  MessageOutlined
} from '@ant-design/icons'
import { useAuth } from '../contexts/AuthContext'
import * as conversationService from '../services/conversationService'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  credits?: number
}

interface ConversationItem {
  id: string
  title: string
  messageCount: number
  totalCredits: number
  lastMessageAt: Date
}

export default function AgentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, profile } = useAuth()
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 设置参数
  const [settings, setSettings] = useState({
    temperature: 0.7,
    maxTokens: 2000,
    streamOutput: true,
    autoSave: true,
  })

  // 模拟智能体数据
  const agent = {
    id: id || '1',
    name: '小红书爆款文案助手',
    avatar: '🤖',
    desc: '专业的小红书文案创作助手，帮你写出爆款笔记。我可以帮你生成吸引眼球的标题、优化文案结构、推荐热门话题标签。',
    category: '内容创作',
    tags: ['小红书', '文案', '爆款'],
    credits: 8,
    usage: 5234,
    rating: 4.9,
    reviews: 328,
    capabilities: ['文案生成', '标题优化', '话题推荐'],
    welcomeMessage: '👋 你好！我是小红书爆款文案助手，专门帮你创作吸引人的小红书笔记。\n\n我可以帮你：\n• 生成爆款标题\n• 优化文案结构\n• 推荐热门话题和标签\n\n告诉我你想写什么内容，让我们开始吧！',
    sampleQuestions: [
      '帮我写一篇关于秋季穿搭的小红书笔记',
      '如何写出吸引人的美食探店文案？',
      '给我推荐一些护肤类的热门话题标签',
      '帮我优化这段文案，让它更有吸引力',
    ],
  }

  // 加载对话历史列表
  const loadConversations = async () => {
    if (!isAuthenticated) return
    setLoadingHistory(true)
    try {
      const data = await conversationService.getConversations(agent.id)
      setConversations(data.map(c => ({
        id: c.id,
        title: c.title,
        messageCount: c.message_count,
        totalCredits: c.total_credits,
        lastMessageAt: new Date(c.last_message_at),
      })))
    } catch (err) {
      console.error('加载对话历史失败:', err)
    } finally {
      setLoadingHistory(false)
    }
  }

  // 加载特定对话的消息
  const loadConversationMessages = async (conversationId: string) => {
    try {
      const data = await conversationService.getMessages(conversationId)
      const loadedMessages: Message[] = data.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.created_at),
        credits: m.credits_used || undefined,
      }))
      
      // 添加欢迎消息到开头
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: agent.welcomeMessage,
          timestamp: new Date(data[0]?.created_at || Date.now()),
        },
        ...loadedMessages
      ])
      setCurrentConversationId(conversationId)
      setHistoryOpen(false)
    } catch (err) {
      message.error('加载对话失败')
    }
  }

  // 创建新对话
  const startNewConversation = () => {
    setCurrentConversationId(null)
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: agent.welcomeMessage,
      timestamp: new Date(),
    }])
    setHistoryOpen(false)
  }

  // 删除对话
  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await conversationService.deleteConversation(conversationId)
      setConversations(prev => prev.filter(c => c.id !== conversationId))
      if (currentConversationId === conversationId) {
        startNewConversation()
      }
      message.success('对话已删除')
    } catch (err) {
      message.error('删除失败')
    }
  }

  // 初始化欢迎消息
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: agent.welcomeMessage,
        timestamp: new Date(),
      }])
    }
  }, [])

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 打开历史记录时加载
  useEffect(() => {
    if (historyOpen) {
      loadConversations()
    }
  }, [historyOpen])

  const handleSend = async () => {
    if (!inputValue.trim()) return
    
    if (!isAuthenticated) {
      message.warning('请先登录后再使用智能体')
      navigate('/login')
      return
    }

    if ((profile?.credits || 0) < agent.credits) {
      message.warning('积分不足，请先充值')
      navigate('/pricing')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    // 如果开启自动保存且没有当前对话，创建新对话
    let convId = currentConversationId
    if (settings.autoSave && !convId) {
      try {
        const newConv = await conversationService.createConversation(agent.id)
        convId = newConv.id
        setCurrentConversationId(convId)
      } catch (err) {
        console.error('创建对话失败:', err)
      }
    }

    // 保存用户消息
    if (settings.autoSave && convId) {
      try {
        await conversationService.addMessage(convId, 'user', inputValue, 0)
      } catch (err) {
        console.error('保存消息失败:', err)
      }
    }

    // 模拟API调用
    setTimeout(async () => {
      const responseContent = generateMockResponse(inputValue)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        credits: agent.credits,
      }
      setMessages(prev => [...prev, assistantMessage])
      setLoading(false)
      message.success(`本次对话消耗 ${agent.credits} 积分`)

      // 保存助手消息
      if (settings.autoSave && convId) {
        try {
          await conversationService.addMessage(convId, 'assistant', responseContent, agent.credits)
        } catch (err) {
          console.error('保存消息失败:', err)
        }
      }
    }, 1500)
  }

  const generateMockResponse = (input: string): string => {
    if (input.includes('穿搭') || input.includes('服装')) {
      return `# 🍂 秋日氛围感穿搭｜这样穿回头率200%！

姐妹们！秋天真的太适合穿搭了！今天分享我的秋季穿搭公式 👇

## 💫 穿搭公式
针织开衫 + 高腰阔腿裤 + 乐福鞋 = 慵懒法式风

## 🎨 配色推荐
- 奶茶色系：温柔又高级
- 焦糖色系：显白又有质感
- 雾霾蓝：清冷感拉满

## 📍 单品推荐
1. 羊绒针织开衫（某宝搜索：慵懒风针织）
2. 高腰直筒裤（显腿长神器！）
3. 复古乐福鞋（百搭不累脚）

---
💡 小tips：内搭选择修身款，外搭选择oversize，层次感立马出来！

#秋季穿搭 #氛围感穿搭 #法式穿搭 #显瘦穿搭 #穿搭分享`
    }
    
    return `感谢你的提问！根据你的需求，我来帮你分析一下：

## 📝 内容建议

1. **标题优化**：使用数字+情绪词+痛点，例如"3个技巧让你..."
2. **开头吸引**：前3秒决定用户是否继续看，用问句或惊叹句开头
3. **内容结构**：问题引入 → 解决方案 → 效果展示 → 行动号召

## 🏷️ 推荐标签
#${input.slice(0, 4)} #干货分享 #实用技巧 #涨知识

需要我帮你进一步优化或生成完整文案吗？`
  }

  const handleQuestionClick = (question: string) => {
    setInputValue(question)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    message.success('已复制到剪贴板')
  }

  const clearHistory = () => {
    startNewConversation()
    message.success('已开始新对话')
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', height: 'calc(100vh - 140px)', display: 'flex', gap: 24 }}>
      {/* 左侧：智能体信息 */}
      <Card style={{ width: 320, flexShrink: 0, height: 'fit-content' }}>
        <Button 
          type="text" 
          icon={<LeftOutlined />} 
          onClick={() => navigate('/agents')}
          style={{ marginBottom: 16, padding: 0 }}
        >
          返回智能体商店
        </Button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar size={80} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: 40, marginBottom: 12 }}>
            {agent.avatar}
          </Avatar>
          <h2 style={{ margin: 0, marginBottom: 8 }}>{agent.name}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Rate disabled defaultValue={agent.rating} style={{ fontSize: 14 }} />
            <span style={{ color: '#8c8c8c' }}>{agent.rating} ({agent.reviews}评价)</span>
          </div>
          <Tag color="purple">{agent.category}</Tag>
        </div>

        <p style={{ color: '#595959', marginBottom: 16 }}>{agent.desc}</p>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: '#8c8c8c', marginBottom: 8 }}>能力标签</div>
          {agent.capabilities.map(cap => (
            <Tag key={cap} color="blue" style={{ marginBottom: 4 }}>{cap}</Tag>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: '#8c8c8c', marginBottom: 8 }}>相关标签</div>
          {agent.tags.map(tag => (
            <Tag key={tag} style={{ marginBottom: 4 }}>#{tag}</Tag>
          ))}
        </div>

        <div style={{ 
          background: '#f5f5f5', 
          borderRadius: 8, 
          padding: 16,
          display: 'flex',
          justifyContent: 'space-around',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#722ed1' }}>{agent.credits}</div>
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>积分/次</div>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#1890ff' }}>{agent.usage.toLocaleString()}</div>
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>总对话</div>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#52c41a' }}>{profile?.credits || 0}</div>
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>我的积分</div>
          </div>
        </div>
      </Card>

      {/* 右侧：对话区域 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* 对话头部 */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Badge status="success" />
              <span>在线</span>
              <span style={{ color: '#8c8c8c' }}>|</span>
              <span style={{ color: '#8c8c8c' }}>{messages.length - 1} 条对话</span>
              {currentConversationId && (
                <>
                  <span style={{ color: '#8c8c8c' }}>|</span>
                  <span style={{ color: '#52c41a', fontSize: 12 }}>已保存</span>
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Tooltip title="对话历史">
                <Button icon={<HistoryOutlined />} onClick={() => setHistoryOpen(true)} />
              </Tooltip>
              <Tooltip title="运行设置">
                <Button icon={<SettingOutlined />} onClick={() => setSettingsOpen(true)} />
              </Tooltip>
              <Tooltip title="新对话">
                <Button icon={<PlusOutlined />} onClick={clearHistory} />
              </Tooltip>
            </div>
          </div>
        </Card>

        {/* 对话内容 */}
        <Card 
          style={{ flex: 1, marginBottom: 16, overflow: 'hidden' }}
          styles={{ body: { height: '100%', padding: 0, display: 'flex', flexDirection: 'column' } }}
        >
          <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                style={{ 
                  display: 'flex', 
                  gap: 12, 
                  marginBottom: 24,
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <Avatar 
                  size={40}
                  style={msg.role === 'assistant' 
                    ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
                    : { background: '#1890ff' }
                  }
                >
                  {msg.role === 'assistant' ? agent.avatar : <UserOutlined />}
                </Avatar>
                <div style={{ maxWidth: '70%' }}>
                  <div 
                    style={{ 
                      background: msg.role === 'user' ? '#1890ff' : '#f5f5f5',
                      color: msg.role === 'user' ? '#fff' : '#262626',
                      padding: '12px 16px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.6,
                    }}
                  >
                    {msg.content}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: 8, 
                    marginTop: 4,
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                  }}>
                    <span style={{ color: '#bfbfbf', fontSize: 12 }}>
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                    {msg.role === 'assistant' && msg.id !== 'welcome' && (
                      <>
                        <Tooltip title="复制">
                          <CopyOutlined 
                            style={{ color: '#bfbfbf', cursor: 'pointer' }} 
                            onClick={() => copyMessage(msg.content)}
                          />
                        </Tooltip>
                        {msg.credits && (
                          <span style={{ color: '#bfbfbf', fontSize: 12 }}>
                            <ThunderboltOutlined /> -{msg.credits}积分
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <Avatar size={40} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  {agent.avatar}
                </Avatar>
                <div style={{ background: '#f5f5f5', padding: '12px 16px', borderRadius: '16px 16px 16px 4px' }}>
                  <Spin size="small" /> 正在思考...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 快捷问题 */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 24px 16px', borderTop: '1px solid #f0f0f0' }}>
              <div style={{ color: '#8c8c8c', marginBottom: 12, marginTop: 16 }}>
                <QuestionCircleOutlined /> 试试这些问题：
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {agent.sampleQuestions.map((q, i) => (
                  <Button 
                    key={i} 
                    size="small" 
                    onClick={() => handleQuestionClick(q)}
                    style={{ borderRadius: 16 }}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* 输入区域 */}
        <Card size="small">
          <div style={{ display: 'flex', gap: 12 }}>
            <Input.TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入你的问题..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              style={{ flex: 1 }}
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={loading}
              disabled={!inputValue.trim()}
            >
              发送
            </Button>
          </div>
          <div style={{ marginTop: 8, color: '#bfbfbf', fontSize: 12 }}>
            按 Enter 发送，Shift + Enter 换行 | 本次对话将消耗 {agent.credits} 积分
            {settings.autoSave && <span style={{ marginLeft: 8, color: '#52c41a' }}>• 自动保存已开启</span>}
          </div>
        </Card>
      </div>

      {/* 对话历史抽屉 */}
      <Drawer
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><HistoryOutlined /> 对话历史</span>
            <Button type="primary" size="small" icon={<PlusOutlined />} onClick={startNewConversation}>
              新对话
            </Button>
          </div>
        }
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        width={400}
      >
        {loadingHistory ? (
          <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
        ) : conversations.length === 0 ? (
          <Empty description="暂无对话历史" />
        ) : (
          <List
            dataSource={conversations}
            renderItem={(conv) => (
              <List.Item
                style={{ 
                  cursor: 'pointer', 
                  background: currentConversationId === conv.id ? '#f0f5ff' : 'transparent',
                  borderRadius: 8,
                  marginBottom: 8,
                  padding: '12px 16px'
                }}
                onClick={() => loadConversationMessages(conv.id)}
                actions={[
                  <Popconfirm
                    title="确定删除这个对话吗？"
                    onConfirm={(e) => {
                      e?.stopPropagation()
                      handleDeleteConversation(conv.id)
                    }}
                    onCancel={(e) => e?.stopPropagation()}
                  >
                    <Button 
                      type="text" 
                      size="small" 
                      danger 
                      icon={<DeleteOutlined />}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Popconfirm>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar size={40} style={{ background: '#f0f0f0' }}><MessageOutlined /></Avatar>}
                  title={<span style={{ fontWeight: 500 }}>{conv.title}</span>}
                  description={
                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                      <span>{conv.messageCount} 条消息</span>
                      <span style={{ margin: '0 8px' }}>•</span>
                      <span>{conv.totalCredits} 积分</span>
                      <span style={{ margin: '0 8px' }}>•</span>
                      <span>{conv.lastMessageAt.toLocaleDateString()}</span>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Drawer>

      {/* 设置抽屉 */}
      <Drawer
        title="运行设置"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        width={360}
      >
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>创造性 (Temperature)</span>
            <span style={{ color: '#1890ff' }}>{settings.temperature}</span>
          </div>
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={settings.temperature}
            onChange={(v) => setSettings(s => ({ ...s, temperature: v }))}
          />
          <div style={{ color: '#8c8c8c', fontSize: 12 }}>
            值越高回答越有创意，值越低回答越稳定
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>最大输出长度</span>
            <span style={{ color: '#1890ff' }}>{settings.maxTokens}</span>
          </div>
          <Slider
            min={500}
            max={4000}
            step={100}
            value={settings.maxTokens}
            onChange={(v) => setSettings(s => ({ ...s, maxTokens: v }))}
          />
        </div>

        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div>流式输出</div>
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>实时显示生成内容</div>
          </div>
          <Switch 
            checked={settings.streamOutput}
            onChange={(v) => setSettings(s => ({ ...s, streamOutput: v }))}
          />
        </div>

        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div>自动保存对话</div>
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>保存对话历史记录到云端</div>
          </div>
          <Switch 
            checked={settings.autoSave}
            onChange={(v) => setSettings(s => ({ ...s, autoSave: v }))}
          />
        </div>

        <Button block onClick={() => setSettings({ temperature: 0.7, maxTokens: 2000, streamOutput: true, autoSave: true })}>
          <ReloadOutlined /> 恢复默认设置
        </Button>
      </Drawer>
    </div>
  )
}
