# AI运营系统 - 使用指南

## 功能概览

### ✅ 已完成功能

#### 1. 用户认证系统
- ✅ 邮箱注册（带验证码）
- ✅ 邮箱密码登录
- ✅ 退出登录
- ✅ 自动创建用户 Profile
- ✅ 新用户赠送 100 积分

#### 2. 用户界面区分
- ✅ **游客（未登录）**
  - 查看产品介绍和功能展示
  - 浏览工作流商店（只读）
  - 查看套餐价格
  - 引导注册/登录

- ✅ **已登录用户（普通用户）**
  - 个性化首页（数据统计、快捷操作）
  - 浏览工作流商店
  - **使用**工作流和工具（消耗积分）
  - 一键创作功能
  - 积分显示和管理
  - 个人资料管理
  - ⚠️ **无法上传**工作流和工具

- ✅ **管理员**
  - 所有普通用户功能
  - **上传和管理**工作流
  - **上传和管理**工具
  - **编辑**工作流
  - 管理后台入口（待实现）

#### 3. 页面设计
- ✅ 现代化游客首页
  - Hero 区域（主标题、CTA、数据统计）
  - 痛点对比（Before/After 卡片设计）
  - 创作流程展示
  - 热门工作流预览
  - 用户评价
- ✅ 响应式布局
- ✅ 路由保护

## 快速开始

### 1. 启动开发服务器

```bash
cd ai-operation-frontend
npm run dev
```

访问: http://localhost:3001/

### 2. 注册新用户

1. 点击"免费注册"
2. 输入邮箱
3. 点击"发送验证码"（开发模式下验证码会显示在页面上）
4. 输入验证码和密码
5. 完成注册

### 3. 登录

1. 使用注册的邮箱和密码登录
2. 如果邮箱未验证，需要先在 Supabase 控制台手动验证

### 4. 退出登录

1. 点击右上角头像
2. 点击"退出登录"

## 开发模式特性

### 验证码测试
- 开发环境下，验证码会直接显示在注册页面上
- 无需配置邮件服务即可测试

### 调试日志
- 浏览器控制台会显示详细的操作日志
- 便于调试和问题排查

## 数据库配置

### Supabase 设置

1. 在 Supabase SQL Editor 执行 `supabase/schema.sql`
2. 在 Supabase SQL Editor 执行 `supabase/add_verification_codes.sql`

### 手动验证用户邮箱

如果注册后无法登录（邮箱未验证）：

1. 登录 Supabase 控制台
2. Authentication → Users
3. 找到用户，点击进入详情
4. 在 `email_confirmed_at` 字段设置当前时间

### 设置管理员

在 Supabase SQL Editor 执行：

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## 环境变量

`.env` 文件配置：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 常见问题

### Q: 登录提示"邮箱或密码错误"？

**A:** 可能的原因：
1. 邮箱未验证 - 需要在 Supabase 控制台手动验证
2. 密码输入错误
3. 用户不存在 - 请先注册

### Q: 注册后没有收到验证码？

**A:** 开发模式下：
- 验证码会直接显示在页面上（蓝色提示框）
- 同时会在浏览器控制台打印

生产模式下：
- 需要配置 Supabase Edge Function 和邮件服务

### Q: 退出登录后还显示已登录状态？

**A:** 
- 硬刷新浏览器：Ctrl + Shift + R (Windows) 或 Cmd + Shift + R (Mac)
- 清除浏览器缓存

### Q: 如何查看所有用户？

**A:** 
- Supabase 控制台 → Authentication → Users
- 或 Table Editor → profiles 表

## 下一步开发

### 待实现功能

- [ ] 忘记密码功能
- [ ] 个人资料编辑
- [ ] 工作流上传和管理
- [ ] 工具箱功能实现
- [ ] 一键创作流程
- [ ] 数据分析页面
- [ ] 管理后台
- [ ] 支付集成

## 技术栈

- **前端**: React 18 + TypeScript + Vite
- **UI**: Ant Design 5
- **路由**: React Router 6
- **认证**: Supabase Auth
- **数据库**: Supabase (PostgreSQL)
- **状态管理**: React Context API

## 项目结构

```
ai-operation-frontend/
├── src/
│   ├── components/
│   │   ├── auth/          # 认证相关组件
│   │   └── layout/        # 布局组件
│   ├── contexts/          # React Context
│   ├── lib/               # 工具库
│   ├── pages/             # 页面组件
│   ├── services/          # API 服务
│   └── types/             # TypeScript 类型
├── supabase/              # 数据库 Schema
└── public/                # 静态资源
```

## 支持

如有问题，请查看：
- `SUPABASE_SETUP.md` - Supabase 详细配置指南
- `README.md` - 项目概览
- 浏览器控制台 - 调试日志


## 权限说明

### 普通用户 vs 管理员

| 功能 | 普通用户 | 管理员 |
|------|---------|--------|
| 浏览工作流 | ✅ | ✅ |
| 使用工作流 | ✅ | ✅ |
| 上传工作流 | ❌ | ✅ |
| 编辑工作流 | ❌ | ✅ |
| 浏览工具 | ✅ | ✅ |
| 使用工具 | ✅ | ✅ |
| 上传工具 | ❌ | ✅ |
| 一键创作 | ✅ | ✅ |
| 管理后台 | ❌ | ✅ |

### 权限设计理念

- **普通用户**：专注于使用平台提供的工具和工作流，通过消耗积分来使用各种AI功能
- **管理员**：负责内容管理，可以上传和维护工作流、工具，确保平台内容质量

### 如何成为管理员？

普通用户无法自行升级为管理员。需要超级管理员在 Supabase 数据库中手动设置：

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

### 权限检查

系统在以下位置进行权限检查：

1. **UI层面**：普通用户看不到"上传"和"编辑"按钮
2. **路由层面**：访问上传页面需要管理员权限，否则重定向到首页
3. **数据库层面**：RLS 策略确保只有管理员可以修改工作流和工具
