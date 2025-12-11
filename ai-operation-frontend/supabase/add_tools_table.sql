-- =============================================
-- 工具表 - 用于创作者中心上传的工具
-- =============================================

-- 1. 创建工具表
CREATE TABLE IF NOT EXISTS public.tools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT DEFAULT '🔧',
  webhook_url TEXT NOT NULL,
  api_key TEXT,
  instructions TEXT NOT NULL DEFAULT '',
  -- 审核状态: pending(待审核), approved(已通过), rejected(已拒绝)
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reject_reason TEXT,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 启用 RLS
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- 3. 工具策略
-- 任何人可以查看已通过审核的工具
CREATE POLICY "Anyone can view approved tools" ON public.tools
  FOR SELECT USING (status = 'approved');

-- 用户可以查看自己的所有工具
CREATE POLICY "Users can view own tools" ON public.tools
  FOR SELECT USING (auth.uid() = user_id);

-- 用户可以创建工具
CREATE POLICY "Users can create tools" ON public.tools
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户可以更新自己的工具（仅限待审核或被拒绝的）
CREATE POLICY "Users can update own pending tools" ON public.tools
  FOR UPDATE USING (auth.uid() = user_id AND status != 'approved');

-- 用户可以删除自己的工具
CREATE POLICY "Users can delete own tools" ON public.tools
  FOR DELETE USING (auth.uid() = user_id);

-- 管理员可以查看和更新所有工具
CREATE POLICY "Admins can view all tools" ON public.tools
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update all tools" ON public.tools
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. 为工作流表添加审核状态字段（如果不存在）
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workflows' AND column_name = 'status') THEN
    ALTER TABLE public.workflows ADD COLUMN status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workflows' AND column_name = 'reject_reason') THEN
    ALTER TABLE public.workflows ADD COLUMN reject_reason TEXT;
  END IF;
END $$;

-- 5. 更新工作流表的 RLS 策略
DROP POLICY IF EXISTS "Anyone can view published workflows" ON public.workflows;
CREATE POLICY "Anyone can view approved workflows" ON public.workflows
  FOR SELECT USING (status = 'approved');

-- 6. 创建索引
CREATE INDEX IF NOT EXISTS idx_tools_user_id ON public.tools(user_id);
CREATE INDEX IF NOT EXISTS idx_tools_status ON public.tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_category ON public.tools(category);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON public.workflows(status);

-- 7. 添加更新时间戳触发器
CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON public.tools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
