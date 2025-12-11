# Supabase 设置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并登录
2. 点击 "New Project" 创建新项目
3. 填写项目信息：
   - Name: `ai-operation` (或你喜欢的名称)
   - Database Password: 设置一个强密码（请保存好）
   - Region: 选择离你最近的区域（推荐 Singapore 或 Tokyo）
4. 点击 "Create new project" 并等待创建完成（约2分钟）

## 2. 获取 API 密钥

1. 进入项目后，点击左侧菜单的 "Settings" (齿轮图标)
2. 点击 "API"
3. 复制以下信息：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. 配置环境变量

在项目根目录创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 Supabase 信息：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 4. 创建数据库表

### 方法一：使用 SQL Editor（推荐）

1. 在 Supabase 控制台，点击左侧菜单的 "SQL Editor"
2. 点击 "New query"
3. 复制 `supabase/schema.sql` 文件的全部内容
4. 粘贴到 SQL Editor 中
5. 点击 "Run" 执行

### 方法二：使用 Supabase CLI

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref your-project-id

# 执行 SQL
supabase db push
```

## 5. 配置邮箱验证

### 5.1 启用邮箱验证

1. 在 Supabase 控制台，点击 "Authentication" > "Providers"
2. 确保 "Email" 已启用
3. 点击 "Email" 进入设置

### 5.2 配置邮件模板（可选）

1. 点击 "Authentication" > "Email Templates"
2. 可以自定义以下模板：
   - **Confirm signup**: 注册确认邮件
   - **Magic Link**: 魔法链接登录
   - **Change Email Address**: 更改邮箱
   - **Reset Password**: 重置密码

### 5.3 配置自定义 SMTP（生产环境推荐）

默认情况下，Supabase 使用内置的邮件服务，但有发送限制。生产环境建议配置自己的 SMTP：

1. 点击 "Settings" > "Auth"
2. 滚动到 "SMTP Settings"
3. 启用 "Enable Custom SMTP"
4. 填写你的 SMTP 信息：
   - Host: `smtp.example.com`
   - Port: `587`
   - User: `your-email@example.com`
   - Password: `your-password`
   - Sender email: `noreply@yourdomain.com`
   - Sender name: `AI运营系统`

推荐的 SMTP 服务：
- [Resend](https://resend.com) - 免费额度大
- [SendGrid](https://sendgrid.com)
- [Mailgun](https://mailgun.com)
- 阿里云邮件推送

## 6. 配置重定向 URL

1. 点击 "Authentication" > "URL Configuration"
2. 设置以下 URL：

**Site URL:**
```
http://localhost:5173
```

**Redirect URLs:**
```
http://localhost:5173/auth/callback
http://localhost:5173/**
```

生产环境需要添加你的域名：
```
https://yourdomain.com/auth/callback
https://yourdomain.com/**
```

## 7. 测试认证流程

1. 启动开发服务器：
```bash
npm run dev
```

2. 访问 http://localhost:5173/register
3. 使用真实邮箱注册
4. 检查邮箱，点击验证链接
5. 验证成功后，使用邮箱密码登录

## 8. 常见问题

### Q: 注册后没有收到验证邮件？

1. 检查垃圾邮件文件夹
2. 确认邮箱地址正确
3. 在 Supabase 控制台 "Authentication" > "Users" 查看用户状态
4. 如果使用内置邮件服务，可能有发送延迟

### Q: 验证链接点击后报错？

1. 确认 Redirect URLs 配置正确
2. 确认 Site URL 配置正确
3. 检查浏览器控制台错误信息

### Q: 如何设置管理员？

在 Supabase SQL Editor 执行：

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

### Q: 如何查看用户列表？

1. 在 Supabase 控制台，点击 "Authentication" > "Users"
2. 或者在 "Table Editor" 中查看 `profiles` 表

## 9. 生产环境检查清单

- [ ] 配置自定义 SMTP
- [ ] 添加生产域名到 Redirect URLs
- [ ] 更新 Site URL 为生产域名
- [ ] 启用 RLS (Row Level Security) - 已在 schema.sql 中配置
- [ ] 配置数据库备份
- [ ] 设置 API 限流
- [ ] 配置 SSL 证书（Supabase 默认提供）
