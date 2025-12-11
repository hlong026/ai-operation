-- 修复 profiles 表的 RLS 无限递归问题
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 先删除现有的有问题的策略
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users" ON profiles;

-- 2. 创建简单的 RLS 策略（不引用 profiles 表自身）
-- 允许用户查看自己的 profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- 允许用户更新自己的 profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 允许新用户创建自己的 profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 3. 确保 RLS 已启用
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. 检查你的用户是否有 profile，如果没有则创建
-- 替换下面的 UUID 为你的用户 ID: d8a36437-78b4-4b73-9a92-665ccf39ca49
INSERT INTO profiles (id, email, role, credits, created_at, updated_at)
VALUES (
  'd8a36437-78b4-4b73-9a92-665ccf39ca49',
  '57126755@qq.com',  -- 你的邮箱
  'admin',  -- 设置为管理员
  1000,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- 5. 验证
SELECT * FROM profiles WHERE id = 'd8a36437-78b4-4b73-9a92-665ccf39ca49';
