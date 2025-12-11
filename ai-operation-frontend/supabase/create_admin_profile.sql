-- =============================================
-- 手动创建管理员 Profile
-- =============================================

-- 首先，查找用户的 UUID
-- 在 Authentication -> Users 中找到 57126755@qq.com 的 ID
-- 或者运行以下查询（需要在 Supabase Dashboard 的 SQL Editor 中）

-- 查看 auth.users 表中的用户
SELECT id, email, created_at 
FROM auth.users 
WHERE email = '57126755@qq.com';

-- 复制上面查询返回的 id，然后替换下面的 'USER_UUID_HERE'

-- 手动插入 profile 记录（请替换 USER_UUID_HERE 为实际的用户 ID）
INSERT INTO public.profiles (id, email, nickname, role, credits, membership_type)
VALUES (
  'USER_UUID_HERE',  -- 替换为实际的用户 UUID
  '57126755@qq.com',
  '管理员',
  'admin',
  1000,
  'enterprise'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  credits = 1000,
  membership_type = 'enterprise';

-- 验证插入结果
SELECT id, email, nickname, role, credits, membership_type
FROM public.profiles
WHERE email = '57126755@qq.com';
