-- 智能体对话会话表
CREATE TABLE IF NOT EXISTS agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL,
  title VARCHAR(200) DEFAULT '新对话',
  message_count INT DEFAULT 0,
  total_credits INT DEFAULT 0,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 对话消息表
CREATE TABLE IF NOT EXISTS agent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES agent_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  credits_used INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_conversations_user ON agent_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_agent ON agent_conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON agent_conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON agent_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON agent_messages(created_at);

-- RLS 策略
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的对话
CREATE POLICY "Users can view own conversations" ON agent_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations" ON agent_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON agent_conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" ON agent_conversations
  FOR DELETE USING (auth.uid() = user_id);

-- 用户只能访问自己对话中的消息
CREATE POLICY "Users can view own messages" ON agent_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM agent_conversations 
      WHERE id = agent_messages.conversation_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own conversations" ON agent_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM agent_conversations 
      WHERE id = agent_messages.conversation_id 
      AND user_id = auth.uid()
    )
  );

-- 更新对话统计的触发器
CREATE OR REPLACE FUNCTION update_conversation_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE agent_conversations
  SET 
    message_count = message_count + 1,
    total_credits = total_credits + COALESCE(NEW.credits_used, 0),
    last_message_at = NEW.created_at,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_stats
  AFTER INSERT ON agent_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_stats();

-- 自动生成对话标题（取第一条用户消息的前30个字符）
CREATE OR REPLACE FUNCTION auto_set_conversation_title()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'user' THEN
    UPDATE agent_conversations
    SET title = LEFT(NEW.content, 30) || CASE WHEN LENGTH(NEW.content) > 30 THEN '...' ELSE '' END
    WHERE id = NEW.conversation_id AND title = '新对话';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_title
  AFTER INSERT ON agent_messages
  FOR EACH ROW
  EXECUTE FUNCTION auto_set_conversation_title();
