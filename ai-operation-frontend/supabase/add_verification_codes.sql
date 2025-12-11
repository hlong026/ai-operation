-- =============================================
-- 添加邮箱验证码表（增量更新）
-- 如果你已经执行过 schema.sql，只需执行这个文件
-- =============================================

-- 创建验证码表
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

-- 删除已存在的策略（如果有）
DROP POLICY IF EXISTS "Allow insert verification codes" ON public.verification_codes;
DROP POLICY IF EXISTS "Allow select verification codes" ON public.verification_codes;
DROP POLICY IF EXISTS "Allow update verification codes" ON public.verification_codes;

-- 创建策略：允许匿名用户操作验证码（注册前用户还没有登录）
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
