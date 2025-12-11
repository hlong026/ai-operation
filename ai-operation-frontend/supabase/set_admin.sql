-- =============================================
-- 设置管理员账号
-- =============================================

-- 将指定邮箱设置为管理员
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = '57126755@qq.com';

-- 查询结果确认
SELECT id, email, nickname, role, credits, membership_type
FROM public.profiles 
WHERE email = '57126755@qq.com';
