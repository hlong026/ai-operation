-- =============================================
-- AI运营系统 Supabase 数据库 Schema
-- =============================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. 用户 Profile 表
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  nickname TEXT,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  credits INTEGER NOT NULL DEFAULT 100,
  membership_type TEXT NOT NULL DEFAULT 'free' CHECK (membership_type IN ('free', 'basic', 'pro', 'enterprise')),
  membership_expiry TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 启用 RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile 策略：用户只能查看和更新自己的 profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 管理员可以查看所有 profile
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- 2. 自动创建 Profile 的触发器
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nickname, credits)
  VALUES (
    NEW.id,
    NEW.email,
    SPLIT_PART(NEW.email, '@', 1),
    100  -- 新用户赠送 100 积分
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 删除已存在的触发器（如果有）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 3. 工作流表
-- =============================================
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('coze', 'n8n')),
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  webhook_url TEXT NOT NULL,
  api_key TEXT,
  credits_per_call INTEGER NOT NULL DEFAULT 5,
  demo_video TEXT,
  screenshots TEXT[] DEFAULT '{}',
  instructions TEXT NOT NULL DEFAULT '',
  published BOOLEAN NOT NULL DEFAULT false,
  usage_count INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

-- 工作流策略
CREATE POLICY "Anyone can view published workflows" ON public.workflows
  FOR SELECT USING (published = true);

CREATE POLICY "Users can view own workflows" ON public.workflows
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create workflows" ON public.workflows
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workflows" ON public.workflows
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workflows" ON public.workflows
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 4. 工作流执行记录表
-- =============================================
CREATE TABLE IF NOT EXISTS public.workflow_executions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  input JSONB NOT NULL DEFAULT '{}',
  output JSONB,
  error TEXT,
  credits_used INTEGER NOT NULL DEFAULT 0,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ
);

-- 启用 RLS
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;

-- 执行记录策略
CREATE POLICY "Users can view own executions" ON public.workflow_executions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create executions" ON public.workflow_executions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own executions" ON public.workflow_executions
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- 5. 订单表
-- =============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  credits INTEGER NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('wechat', 'alipay')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 订单策略
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 6. 使用日志表
-- =============================================
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  credits INTEGER NOT NULL DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- 使用日志策略
CREATE POLICY "Users can view own logs" ON public.usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create logs" ON public.usage_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 7. 更新时间戳触发器
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为各表添加更新时间戳触发器
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- 8. 扣除积分的函数
-- =============================================
CREATE OR REPLACE FUNCTION public.deduct_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_action TEXT,
  p_resource TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_credits INTEGER;
BEGIN
  -- 获取当前积分
  SELECT credits INTO v_current_credits
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  -- 检查积分是否足够
  IF v_current_credits < p_amount THEN
    RETURN FALSE;
  END IF;

  -- 扣除积分
  UPDATE public.profiles
  SET credits = credits - p_amount
  WHERE id = p_user_id;

  -- 记录使用日志
  INSERT INTO public.usage_logs (user_id, action, resource, credits)
  VALUES (p_user_id, p_action, p_resource, p_amount);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 9. 索引优化
-- =============================================
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON public.workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_published ON public.workflows(published);
CREATE INDEX IF NOT EXISTS idx_workflows_category ON public.workflows(category);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_user_id ON public.workflow_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON public.workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON public.usage_logs(created_at);

-- =============================================
-- 10. 邮箱验证码表
-- =============================================
CREATE TABLE IF NOT EXISTS public.verification_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'register' CHECK (type IN ('register', 'reset_password', 'change_email')),
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户操作验证码（注册前用户还没有登录）
CREATE POLICY "Allow insert verification codes" ON public.verification_codes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select verification codes" ON public.verification_codes
  FOR SELECT USING (true);

CREATE POLICY "Allow update verification codes" ON public.verification_codes
  FOR UPDATE USING (true);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON public.verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires ON public.verification_codes(expires_at);

-- 清理过期验证码的函数
CREATE OR REPLACE FUNCTION public.cleanup_expired_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.verification_codes
  WHERE expires_at < NOW() OR used = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 验证验证码的函数
CREATE OR REPLACE FUNCTION public.verify_code(
  p_email TEXT,
  p_code TEXT,
  p_type TEXT DEFAULT 'register'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_valid BOOLEAN;
BEGIN
  -- 检查是否存在有效的验证码
  SELECT EXISTS (
    SELECT 1 FROM public.verification_codes
    WHERE email = p_email
      AND code = p_code
      AND type = p_type
      AND expires_at > NOW()
      AND used = false
  ) INTO v_valid;

  -- 如果验证成功，标记为已使用
  IF v_valid THEN
    UPDATE public.verification_codes
    SET used = true
    WHERE email = p_email
      AND code = p_code
      AND type = p_type;
  END IF;

  RETURN v_valid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
