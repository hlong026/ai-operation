import { supabase } from '../lib/supabase'

export interface Conversation {
  id: string
  user_id: string
  agent_id: string
  title: string
  message_count: number
  total_credits: number
  last_message_at: string
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  credits_used: number
  created_at: string
}

// 获取用户与某智能体的所有对话
export async function getConversations(agentId: string) {
  const { data, error } = await supabase
    .from('agent_conversations')
    .select('*')
    .eq('agent_id', agentId)
    .order('updated_at', { ascending: false })
  
  if (error) throw error
  return data as Conversation[]
}

// 获取单个对话的所有消息
export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('agent_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data as Message[]
}

// 创建新对话
export async function createConversation(agentId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('未登录')

  const { data, error } = await supabase
    .from('agent_conversations')
    .insert({
      user_id: user.id,
      agent_id: agentId,
      title: '新对话'
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Conversation
}

// 添加消息
export async function addMessage(
  conversationId: string, 
  role: 'user' | 'assistant', 
  content: string,
  creditsUsed: number = 0
) {
  const { data, error } = await supabase
    .from('agent_messages')
    .insert({
      conversation_id: conversationId,
      role,
      content,
      credits_used: creditsUsed
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Message
}

// 删除对话
export async function deleteConversation(conversationId: string) {
  const { error } = await supabase
    .from('agent_conversations')
    .delete()
    .eq('id', conversationId)
  
  if (error) throw error
}

// 更新对话标题
export async function updateConversationTitle(conversationId: string, title: string) {
  const { error } = await supabase
    .from('agent_conversations')
    .update({ title })
    .eq('id', conversationId)
  
  if (error) throw error
}
