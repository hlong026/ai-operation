-- =============================================
-- 积分计费系统 - 完整 Schema
-- =============================================

-- =============================================
-- 1. 更新 profiles 表，添加创作者收益字段
-- =============================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS total_earnings INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS pending_earnings INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS withdrawn_earnings INTEGER NOT NULL DEFAULT 0;

-- =============================================
-- 2. 更新 workflows 表，添加分成比例字段
-- =============================================
ALTER TABLE public.workflows 
ADD COLUMN IF NOT EXISTS creator_share_ratio DECIMAL(3,2) NOT NULL DEFAULT 0.70,
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS reject_reason TEXT;

-- 更新已有记录的 status（如果 published = true 则设为 approved）
UPDATE public.workflows SET status = 'approved' WHERE published = true AND status = 'pending';

-- =============================================
-- 3. 创建工具表（如果不存在）
-- =============================================
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
  credits_per_call INTEGER NOT NULL DEFAULT 5,
  creator_share_ratio DECIMAL(3,2) NOT NULL DEFAULT 0.70,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reject_reason TEXT,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- 工具策略
DROP POLICY IF EXISTS "Anyone can view approved tools" ON public.tools;
DROP POLICY IF EXISTS "Users can view own tools" ON public.tools;
DROP POLICY IF EXISTS "Users can create tools" ON public.tools;
DROP POLICY IF EXISTS "Users can update own pending tools" ON public.tools;
DROP POLICY IF EXISTS "Users can delete own tools" ON public.tools;

CREATE POLICY "Anyone can view approved tools" ON public.tools FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view own tools" ON public.tools FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tools" ON public.tools FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pending tools" ON public.tools FOR UPDATE USING (auth.uid() = user_id AND status != 'approved');
CREATE POLICY "Users can delete own tools" ON public.tools FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 4. 积分充值套餐表
-- =============================================
CREATE TABLE IF NOT EXISTS public.credit_packages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  bonus_credits INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.credit_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active packages" ON public.credit_packages FOR SELECT USING (is_active = true);

-- 插入默认积分套餐
INSERT INTO public.credit_packages (name, credits, price, bonus_credits, sort_order) VALUES
  ('体验包', 100, 9.90, 0, 1),
  ('基础包', 500, 39.90, 50, 2),
  ('标准包', 1000, 69.90, 150, 3),
  ('专业包', 3000, 199.00, 500, 4),
  ('企业包', 10000, 599.00, 2000, 5)
ON CONFLICT DO NOTHING;

-- =============================================
-- 5. 会员套餐表
-- =============================================
CREATE TABLE IF NOT EXISTS public.membership_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('free', 'basic', 'pro', 'enterprise')),
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
  credits_monthly INTEGER NOT NULL DEFAULT 0,
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active plans" ON public.membership_plans FOR SELECT USING (is_active = true);

-- 插入默认会员套餐
INSERT INTO public.membership_plans (name, type, price_monthly, price_yearly, credits_monthly, features, sort_order) VALUES
  ('免费版', 'free', 0, 0, 100, '["基础工具", "3个工作流", "社区支持"]', 1),
  ('基础版', 'basic', 29, 290, 500, '["全部工具", "10个工作流", "邮件支持", "数据分析"]', 2),
  ('专业版', 'pro', 99, 990, 2000, '["全部工具", "无限工作流", "优先支持", "高级分析", "API访问"]', 3),
  ('企业版', 'enterprise', 299, 2990, 10000, '["全部功能", "专属客服", "定制开发", "SLA保障", "团队管理"]', 4)
ON CONFLICT DO NOTHING;

-- =============================================
-- 6. 积分交易记录表
-- =============================================
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('recharge', 'consume', 'earn', 'refund', 'gift', 'membership')),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  -- 关联信息
  related_id UUID,
  related_type TEXT CHECK (related_type IN ('workflow', 'tool', 'order', 'membership')),
  -- 分成信息（仅 consume 类型）
  creator_id UUID REFERENCES public.profiles(id),
  creator_earn INTEGER DEFAULT 0,
  -- 描述
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id OR auth.uid() = creator_id);
CREATE POLICY "System can insert transactions" ON public.credit_transactions FOR INSERT WITH CHECK (true);

-- 索引
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_creator_id ON public.credit_transactions(creator_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON public.credit_transactions(type);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON public.credit_transactions(created_at);

-- =============================================
-- 7. 创作者提现记录表
-- =============================================
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('alipay', 'wechat', 'bank')),
  payment_account TEXT NOT NULL,
  reject_reason TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own withdrawals" ON public.withdrawals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create withdrawals" ON public.withdrawals FOR INSERT WITH CHECK (auth.uid() = user_id);


-- =============================================
-- 8. 系统配置表（管理员设置）
-- =============================================
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view settings" ON public.system_settings FOR SELECT USING (true);

-- 插入默认配置
INSERT INTO public.system_settings (key, value, description) VALUES
  ('default_creator_share_ratio', '0.70', '默认创作者分成比例（70%）'),
  ('min_withdrawal_amount', '100', '最低提现积分'),
  ('new_user_bonus_credits', '100', '新用户注册赠送积分'),
  ('referral_bonus_credits', '50', '邀请好友奖励积分'),
  ('platform_fee_ratio', '0.30', '平台服务费比例（30%）')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- 9. 核心函数：使用工作流/工具并扣费
-- =============================================
CREATE OR REPLACE FUNCTION public.use_resource_with_credits(
  p_user_id UUID,
  p_resource_type TEXT,  -- 'workflow' 或 'tool'
  p_resource_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_user_credits INTEGER;
  v_credits_required INTEGER;
  v_creator_id UUID;
  v_creator_share DECIMAL(3,2);
  v_creator_earn INTEGER;
  v_platform_earn INTEGER;
  v_resource_name TEXT;
  v_new_balance INTEGER;
BEGIN
  -- 1. 获取用户当前积分
  SELECT credits INTO v_user_credits
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  -- 2. 获取资源信息
  IF p_resource_type = 'workflow' THEN
    SELECT credits_per_call, user_id, creator_share_ratio, name
    INTO v_credits_required, v_creator_id, v_creator_share, v_resource_name
    FROM public.workflows
    WHERE id = p_resource_id AND status = 'approved';
  ELSIF p_resource_type = 'tool' THEN
    SELECT credits_per_call, user_id, creator_share_ratio, name
    INTO v_credits_required, v_creator_id, v_creator_share, v_resource_name
    FROM public.tools
    WHERE id = p_resource_id AND status = 'approved';
  ELSE
    RETURN jsonb_build_object('success', false, 'error', '无效的资源类型');
  END IF;

  -- 3. 检查资源是否存在
  IF v_credits_required IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', '资源不存在或未上架');
  END IF;

  -- 4. 检查积分是否足够
  IF v_user_credits < v_credits_required THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', '积分不足',
      'required', v_credits_required,
      'current', v_user_credits
    );
  END IF;

  -- 5. 计算分成
  v_creator_earn := FLOOR(v_credits_required * v_creator_share);
  v_platform_earn := v_credits_required - v_creator_earn;

  -- 6. 扣除用户积分
  v_new_balance := v_user_credits - v_credits_required;
  UPDATE public.profiles
  SET credits = v_new_balance
  WHERE id = p_user_id;

  -- 7. 增加创作者收益（如果创作者不是用户自己）
  IF v_creator_id != p_user_id THEN
    UPDATE public.profiles
    SET pending_earnings = pending_earnings + v_creator_earn,
        total_earnings = total_earnings + v_creator_earn
    WHERE id = v_creator_id;
  END IF;

  -- 8. 更新资源使用次数
  IF p_resource_type = 'workflow' THEN
    UPDATE public.workflows SET usage_count = usage_count + 1 WHERE id = p_resource_id;
  ELSE
    UPDATE public.tools SET usage_count = usage_count + 1 WHERE id = p_resource_id;
  END IF;

  -- 9. 记录交易
  INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, related_id, related_type,
    creator_id, creator_earn, description
  ) VALUES (
    p_user_id, 'consume', -v_credits_required, v_new_balance, p_resource_id, p_resource_type,
    v_creator_id, v_creator_earn, '使用' || v_resource_name
  );

  RETURN jsonb_build_object(
    'success', true,
    'credits_used', v_credits_required,
    'new_balance', v_new_balance,
    'creator_earn', v_creator_earn
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 10. 积分充值函数
-- =============================================
CREATE OR REPLACE FUNCTION public.recharge_credits(
  p_user_id UUID,
  p_package_id UUID,
  p_order_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_credits INTEGER;
  v_bonus INTEGER;
  v_total_credits INTEGER;
  v_new_balance INTEGER;
  v_package_name TEXT;
BEGIN
  -- 获取套餐信息
  SELECT credits, bonus_credits, name
  INTO v_credits, v_bonus, v_package_name
  FROM public.credit_packages
  WHERE id = p_package_id AND is_active = true;

  IF v_credits IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', '套餐不存在');
  END IF;

  v_total_credits := v_credits + v_bonus;

  -- 增加用户积分
  UPDATE public.profiles
  SET credits = credits + v_total_credits
  WHERE id = p_user_id
  RETURNING credits INTO v_new_balance;

  -- 记录交易
  INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, related_id, related_type, description
  ) VALUES (
    p_user_id, 'recharge', v_total_credits, v_new_balance, p_order_id, 'order',
    '充值' || v_package_name || '，获得' || v_total_credits || '积分'
  );

  RETURN jsonb_build_object(
    'success', true,
    'credits_added', v_total_credits,
    'new_balance', v_new_balance
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 11. 会员开通/续费函数
-- =============================================
CREATE OR REPLACE FUNCTION public.activate_membership(
  p_user_id UUID,
  p_plan_type TEXT,
  p_duration_months INTEGER
)
RETURNS JSONB AS $$
DECLARE
  v_credits_monthly INTEGER;
  v_total_credits INTEGER;
  v_new_balance INTEGER;
  v_new_expiry TIMESTAMPTZ;
  v_current_expiry TIMESTAMPTZ;
BEGIN
  -- 获取套餐信息
  SELECT credits_monthly INTO v_credits_monthly
  FROM public.membership_plans
  WHERE type = p_plan_type AND is_active = true;

  IF v_credits_monthly IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', '套餐不存在');
  END IF;

  v_total_credits := v_credits_monthly * p_duration_months;

  -- 获取当前会员到期时间
  SELECT membership_expiry INTO v_current_expiry
  FROM public.profiles WHERE id = p_user_id;

  -- 计算新的到期时间
  IF v_current_expiry IS NULL OR v_current_expiry < NOW() THEN
    v_new_expiry := NOW() + (p_duration_months || ' months')::INTERVAL;
  ELSE
    v_new_expiry := v_current_expiry + (p_duration_months || ' months')::INTERVAL;
  END IF;

  -- 更新用户信息
  UPDATE public.profiles
  SET 
    membership_type = p_plan_type,
    membership_expiry = v_new_expiry,
    credits = credits + v_total_credits
  WHERE id = p_user_id
  RETURNING credits INTO v_new_balance;

  -- 记录交易
  INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, related_type, description
  ) VALUES (
    p_user_id, 'membership', v_total_credits, v_new_balance, 'membership',
    '开通/续费' || p_plan_type || '会员' || p_duration_months || '个月，获得' || v_total_credits || '积分'
  );

  RETURN jsonb_build_object(
    'success', true,
    'credits_added', v_total_credits,
    'new_balance', v_new_balance,
    'expiry', v_new_expiry
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 12. 创作者提现函数
-- =============================================
CREATE OR REPLACE FUNCTION public.request_withdrawal(
  p_user_id UUID,
  p_amount INTEGER,
  p_payment_method TEXT,
  p_payment_account TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_pending_earnings INTEGER;
  v_min_amount INTEGER;
BEGIN
  -- 获取最低提现金额
  SELECT (value::TEXT)::INTEGER INTO v_min_amount
  FROM public.system_settings WHERE key = 'min_withdrawal_amount';
  v_min_amount := COALESCE(v_min_amount, 100);

  -- 检查提现金额
  IF p_amount < v_min_amount THEN
    RETURN jsonb_build_object('success', false, 'error', '提现金额不能低于' || v_min_amount || '积分');
  END IF;

  -- 获取可提现余额
  SELECT pending_earnings INTO v_pending_earnings
  FROM public.profiles WHERE id = p_user_id FOR UPDATE;

  IF v_pending_earnings < p_amount THEN
    RETURN jsonb_build_object('success', false, 'error', '可提现余额不足');
  END IF;

  -- 扣除待提现余额
  UPDATE public.profiles
  SET pending_earnings = pending_earnings - p_amount
  WHERE id = p_user_id;

  -- 创建提现记录
  INSERT INTO public.withdrawals (user_id, amount, payment_method, payment_account)
  VALUES (p_user_id, p_amount, p_payment_method, p_payment_account);

  RETURN jsonb_build_object('success', true, 'amount', p_amount);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 13. 索引优化
-- =============================================
CREATE INDEX IF NOT EXISTS idx_tools_user_id ON public.tools(user_id);
CREATE INDEX IF NOT EXISTS idx_tools_status ON public.tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_category ON public.tools(category);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON public.workflows(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON public.withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON public.withdrawals(status);

-- =============================================
-- 14. 更新时间戳触发器
-- =============================================
DROP TRIGGER IF EXISTS update_tools_updated_at ON public.tools;
CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON public.tools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- =============================================
-- 15. 智能体表
-- =============================================
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  avatar TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  webhook_url TEXT NOT NULL,
  api_key TEXT,
  instructions TEXT NOT NULL DEFAULT '',
  credits_per_call INTEGER NOT NULL DEFAULT 5,
  creator_share_ratio DECIMAL(3,2) NOT NULL DEFAULT 0.70,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reject_reason TEXT,
  usage_count INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  -- 智能体特有字段
  capabilities TEXT[] DEFAULT '{}',  -- 能力标签
  welcome_message TEXT,              -- 欢迎语
  sample_questions TEXT[] DEFAULT '{}', -- 示例问题
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- 智能体策略
CREATE POLICY "Anyone can view approved agents" ON public.agents FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view own agents" ON public.agents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create agents" ON public.agents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pending agents" ON public.agents FOR UPDATE USING (auth.uid() = user_id AND status != 'approved');
CREATE POLICY "Users can delete own agents" ON public.agents FOR DELETE USING (auth.uid() = user_id);

-- 索引
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON public.agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_status ON public.agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_category ON public.agents(category);

-- 更新时间戳触发器
DROP TRIGGER IF EXISTS update_agents_updated_at ON public.agents;
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- 16. 更新使用资源函数，支持智能体
-- =============================================
CREATE OR REPLACE FUNCTION public.use_resource_with_credits(
  p_user_id UUID,
  p_resource_type TEXT,  -- 'workflow', 'tool', 'agent'
  p_resource_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_user_credits INTEGER;
  v_credits_required INTEGER;
  v_creator_id UUID;
  v_creator_share DECIMAL(3,2);
  v_creator_earn INTEGER;
  v_platform_earn INTEGER;
  v_resource_name TEXT;
  v_new_balance INTEGER;
BEGIN
  -- 1. 获取用户当前积分
  SELECT credits INTO v_user_credits
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  -- 2. 获取资源信息
  IF p_resource_type = 'workflow' THEN
    SELECT credits_per_call, user_id, creator_share_ratio, name
    INTO v_credits_required, v_creator_id, v_creator_share, v_resource_name
    FROM public.workflows
    WHERE id = p_resource_id AND status = 'approved';
  ELSIF p_resource_type = 'tool' THEN
    SELECT credits_per_call, user_id, creator_share_ratio, name
    INTO v_credits_required, v_creator_id, v_creator_share, v_resource_name
    FROM public.tools
    WHERE id = p_resource_id AND status = 'approved';
  ELSIF p_resource_type = 'agent' THEN
    SELECT credits_per_call, user_id, creator_share_ratio, name
    INTO v_credits_required, v_creator_id, v_creator_share, v_resource_name
    FROM public.agents
    WHERE id = p_resource_id AND status = 'approved';
  ELSE
    RETURN jsonb_build_object('success', false, 'error', '无效的资源类型');
  END IF;

  -- 3. 检查资源是否存在
  IF v_credits_required IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', '资源不存在或未上架');
  END IF;

  -- 4. 检查积分是否足够
  IF v_user_credits < v_credits_required THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', '积分不足',
      'required', v_credits_required,
      'current', v_user_credits
    );
  END IF;

  -- 5. 计算分成
  v_creator_earn := FLOOR(v_credits_required * v_creator_share);
  v_platform_earn := v_credits_required - v_creator_earn;

  -- 6. 扣除用户积分
  v_new_balance := v_user_credits - v_credits_required;
  UPDATE public.profiles
  SET credits = v_new_balance
  WHERE id = p_user_id;

  -- 7. 增加创作者收益（如果创作者不是用户自己）
  IF v_creator_id != p_user_id THEN
    UPDATE public.profiles
    SET pending_earnings = pending_earnings + v_creator_earn,
        total_earnings = total_earnings + v_creator_earn
    WHERE id = v_creator_id;
  END IF;

  -- 8. 更新资源使用次数
  IF p_resource_type = 'workflow' THEN
    UPDATE public.workflows SET usage_count = usage_count + 1 WHERE id = p_resource_id;
  ELSIF p_resource_type = 'tool' THEN
    UPDATE public.tools SET usage_count = usage_count + 1 WHERE id = p_resource_id;
  ELSE
    UPDATE public.agents SET usage_count = usage_count + 1 WHERE id = p_resource_id;
  END IF;

  -- 9. 记录交易
  INSERT INTO public.credit_transactions (
    user_id, type, amount, balance_after, related_id, related_type,
    creator_id, creator_earn, description
  ) VALUES (
    p_user_id, 'consume', -v_credits_required, v_new_balance, p_resource_id, p_resource_type,
    v_creator_id, v_creator_earn, '使用' || v_resource_name
  );

  RETURN jsonb_build_object(
    'success', true,
    'credits_used', v_credits_required,
    'new_balance', v_new_balance,
    'creator_earn', v_creator_earn
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
