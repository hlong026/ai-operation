# 设计文档

## 概述

AI自动运营系统采用现代化的微服务架构，前端使用React + TypeScript构建响应式Web应用，后端采用Node.js + Express提供RESTful API服务。系统集成Coze和n8n工作流引擎，支持可视化的自动化流程编排。数据存储使用PostgreSQL作为主数据库，Redis用于缓存和会话管理，OSS用于媒体文件存储。

系统的核心设计理念是"模块化、可扩展、易用性"，通过标准化的工作流模板和AI驱动的内容生成能力，帮助内容创作者和MCN机构实现规模化的内容生产。

## 技术选型说明

### 前端技术栈推荐

**推荐方案：React + Ant Design + Zustand + TanStack Query**

**理由：**
1. **Ant Design** - 最适合本项目的UI框架
   - 提供完整的企业级组件（表格、表单、上传、图表等）
   - 中文文档完善，国内生态成熟
   - 适合B端SaaS产品，与目标用户（内容创作者、MCN机构）契合
   - 内置响应式设计支持

2. **Zustand** - 轻量级状态管理
   - API简单，学习曲线平缓
   - 性能优秀，无需Provider包裹
   - 适合本项目的中等复杂度

3. **TanStack Query** - 服务端状态管理
   - 自动处理缓存、重试、轮询
   - 减少样板代码
   - 与RESTful API完美配合

4. **Vite** - 现代化构建工具
   - 开发服务器启动快
   - HMR（热模块替换）速度快
   - 生产构建优化好

**替代方案：**
- 如果需要更现代化的设计风格：Tailwind CSS + shadcn/ui
- 如果应用规模很大：Redux Toolkit 替代 Zustand
- 如果需要更强大的图表：Apache ECharts 替代 Recharts

## 架构

### 系统架构图

```mermaid
graph TB
    subgraph "客户端层"
        Web[Web应用<br/>React + TypeScript]
        Mobile[移动端<br/>响应式适配]
    end
    
    subgraph "API网关层"
        Gateway[API Gateway<br/>认证 | 限流 | 路由]
    end
    
    subgraph "应用服务层"
        AuthService[认证服务<br/>注册登录 | JWT]
        UserService[用户服务<br/>用户管理 | 会员]
        PaymentService[支付服务<br/>微信 | 支付宝]
        ContentService[内容服务<br/>选题 | 创作]
        WorkflowService[工作流服务<br/>Coze | n8n]
        ToolService[工具服务<br/>文案 | 视频]
        PlatformService[平台服务<br/>多平台发布]
        AnalyticsService[分析服务<br/>数据统计]
    end
    
    subgraph "外部工作流服务"
        CozeAPI[Coze API/Webhook]
        N8nWebhook[n8n Webhook]
    end
    
    subgraph "数据层"
        PostgreSQL[(PostgreSQL<br/>主数据库)]
        Redis[(Redis<br/>缓存)]
        OSS[(OSS<br/>文件存储)]
    end
    
    subgraph "外部服务"
        AIService[AI服务<br/>RunningHub]
        SocialPlatform[社交平台<br/>抖音 | 小红书 | 视频号]
        PaymentGateway[支付网关<br/>微信 | 支付宝]
    end
    
    Web --> Gateway
    Mobile --> Gateway
    Gateway --> AuthService
    Gateway --> UserService
    Gateway --> PaymentService
    Gateway --> ContentService
    Gateway --> WorkflowService
    Gateway --> ToolService
    Gateway --> PlatformService
    Gateway --> AnalyticsService
    
    WorkflowService --> CozeAPI
    WorkflowService --> N8nWebhook
    
    AuthService --> PostgreSQL
    UserService --> PostgreSQL
    PaymentService --> PostgreSQL
    ContentService --> PostgreSQL
    WorkflowService --> PostgreSQL
    ToolService --> PostgreSQL
    PlatformService --> PostgreSQL
    AnalyticsService --> PostgreSQL
    
    AuthService --> Redis
    UserService --> Redis
    
    ContentService --> OSS
    ToolService --> OSS
    
    ContentService --> AIService
    ToolService --> AIService
    PlatformService --> SocialPlatform
    PaymentService --> PaymentGateway
```

### 技术栈

**前端:**
- React 18 + TypeScript
- **UI框架**: Ant Design (推荐) 或 Tailwind CSS + shadcn/ui
  - Ant Design: 企业级组件库，开箱即用，适合B端产品
  - Tailwind + shadcn/ui: 更灵活，现代化设计，但需要更多定制
- **状态管理**: Zustand (轻量级) 或 Redux Toolkit
  - Zustand: 简单直观，适合中小型应用
  - Redux Toolkit: 更强大，适合大型复杂应用
- **数据获取**: TanStack Query (React Query v5)
  - 自动缓存、重试、轮询等功能
  - 与服务端状态管理完美配合
- **表单处理**: React Hook Form + Zod
  - 高性能、类型安全的表单验证
- **图表库**: Recharts 或 Apache ECharts
  - Recharts: React原生，简单易用
  - ECharts: 功能更强大，图表类型更丰富
- **富文本编辑器**: Tiptap 或 Quill
- **构建工具**: Vite (快速、现代化)
- **路由**: React Router v6

**后端:**
- Node.js 18+ + Express
- TypeScript
- Prisma (ORM)
- JWT (认证)
- Bull (任务队列)

**数据库:**
- PostgreSQL 14+ (主数据库)
- Redis 7+ (缓存和会话)

**存储:**
- 阿里云OSS / AWS S3 (文件存储)

**工作流集成:**
- Coze API/Webhook 集成
- n8n Webhook 集成

**外部服务:**
- RunningHub API (AI服务)
- 微信支付 / 支付宝支付
- 抖音开放平台
- 小红书开放平台
- 微信视频号开放平台

## 组件和接口

### 前端组件结构

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # 顶部导航栏
│   │   ├── Sidebar.tsx             # 侧边栏
│   │   └── Footer.tsx              # 页脚
│   ├── auth/
│   │   ├── LoginForm.tsx           # 登录表单
│   │   ├── RegisterForm.tsx        # 注册表单
│   │   └── VerifyEmail.tsx         # 邮箱验证
│   ├── payment/
│   │   ├── PricingCard.tsx         # 套餐卡片
│   │   ├── PaymentModal.tsx        # 支付弹窗
│   │   └── OrderHistory.tsx        # 订单历史
│   ├── content/
│   │   ├── TopicSelector.tsx       # 选题选择器
│   │   ├── ContentEditor.tsx       # 内容编辑器
│   │   ├── ContentPreview.tsx      # 内容预览
│   │   └── PublishPanel.tsx        # 发布面板
│   ├── workflow/
│   │   ├── WorkflowCard.tsx        # 工作流卡片
│   │   ├── WorkflowDetail.tsx      # 工作流详情
│   │   ├── WorkflowExecute.tsx     # 工作流执行界面
│   │   ├── ExecutionLog.tsx        # 执行日志
│   │   └── WorkflowUpload.tsx      # 工作流上传
│   ├── template/
│   │   ├── TemplateGallery.tsx     # 模板库
│   │   ├── TemplateCard.tsx        # 模板卡片
│   │   ├── TemplateDetail.tsx      # 模板详情
│   │   └── TemplateUpload.tsx      # 模板上传
│   ├── tools/
│   │   ├── ToolBox.tsx             # 工具箱
│   │   ├── ToolCard.tsx            # 工具卡片
│   │   ├── TextExtractor.tsx       # 文案提取
│   │   ├── TextRewriter.tsx        # 文案二创
│   │   ├── AccountAnalyzer.tsx     # 账号拆解
│   │   └── VideoAnalyzer.tsx       # 视频拆解
│   ├── platform/
│   │   ├── AccountList.tsx         # 账号列表
│   │   ├── AccountBind.tsx         # 账号绑定
│   │   └── PublishHistory.tsx      # 发布历史
│   ├── analytics/
│   │   ├── Dashboard.tsx           # 数据仪表板
│   │   ├── ContentMetrics.tsx      # 内容指标
│   │   └── TrendChart.tsx          # 趋势图表
│   └── team/
│       ├── MemberList.tsx          # 成员列表
│       ├── MemberInvite.tsx        # 成员邀请
│       └── QuotaManagement.tsx     # 配额管理
├── pages/
│   ├── Home.tsx                    # 首页
│   ├── Login.tsx                   # 登录页
│   ├── Register.tsx                # 注册页
│   ├── Pricing.tsx                 # 套餐页
│   ├── Topic.tsx                   # 选题页
│   ├── Create.tsx                  # 创作页
│   ├── Workflow.tsx                # 工作流页
│   ├── Templates.tsx               # 模板库页
│   ├── Tools.tsx                   # 工具页
│   ├── Accounts.tsx                # 账号管理页
│   ├── Analytics.tsx               # 数据分析页
│   ├── Team.tsx                    # 团队管理页
│   └── Settings.tsx                # 设置页
├── hooks/
│   ├── useAuth.ts                  # 认证钩子
│   ├── usePayment.ts               # 支付钩子
│   ├── useWorkflow.ts              # 工作流钩子
│   └── useAnalytics.ts             # 分析钩子
├── services/
│   ├── api.ts                      # API客户端
│   ├── auth.service.ts             # 认证服务
│   ├── user.service.ts             # 用户服务
│   ├── payment.service.ts          # 支付服务
│   ├── content.service.ts          # 内容服务
│   ├── workflow.service.ts         # 工作流服务
│   ├── tool.service.ts             # 工具服务
│   ├── platform.service.ts         # 平台服务
│   └── analytics.service.ts        # 分析服务
└── types/
    ├── user.types.ts               # 用户类型
    ├── content.types.ts            # 内容类型
    ├── workflow.types.ts           # 工作流类型
    └── platform.types.ts           # 平台类型
```

### 后端API接口

#### 认证服务 API

```typescript
// POST /api/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  verificationCode: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
}

// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: UserProfile;
}

// POST /api/auth/verify-email
interface VerifyEmailRequest {
  token: string;
}

interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

// POST /api/auth/send-verification
interface SendVerificationRequest {
  email: string;
}

interface SendVerificationResponse {
  success: boolean;
  message: string;
}
```

#### 用户服务 API

```typescript
// GET /api/users/profile
interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  avatar: string;
  membershipType: 'free' | 'basic' | 'pro' | 'enterprise';
  membershipExpiry: Date;
  credits: number;
  createdAt: Date;
}

// PUT /api/users/profile
interface UpdateProfileRequest {
  nickname?: string;
  avatar?: string;
}

// GET /api/users/membership
interface MembershipInfo {
  type: string;
  expiry: Date;
  features: string[];
  credits: number;
  usageStats: {
    toolUsage: number;
    workflowExecutions: number;
    contentCreated: number;
  };
}
```

#### 支付服务 API

```typescript
// GET /api/payment/plans
interface PricingPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // 天数
  credits: number;
  features: string[];
}

// POST /api/payment/create-order
interface CreateOrderRequest {
  planId: string;
  paymentMethod: 'wechat' | 'alipay';
}

interface CreateOrderResponse {
  orderId: string;
  paymentUrl: string;
  qrCode: string;
}

// POST /api/payment/callback
interface PaymentCallback {
  orderId: string;
  status: 'success' | 'failed';
  transactionId: string;
}

// GET /api/payment/orders
interface OrderHistory {
  orders: Array<{
    id: string;
    planName: string;
    amount: number;
    status: string;
    createdAt: Date;
  }>;
}
```

#### 内容服务 API

```typescript
// GET /api/content/topics
interface TopicRequest {
  keyword?: string;
  category?: string;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  heatIndex: number;
  tags: string[];
  suggestedAngles: string[];
}

// POST /api/content/generate
interface GenerateContentRequest {
  topicId: string;
  platform: 'douyin' | 'xiaohongshu' | 'shipin';
  style?: string;
}

interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  tags: string[];
  script?: string;
  mediaUrls?: string[];
}

// POST /api/content/publish
interface PublishRequest {
  contentId: string;
  platforms: string[];
  scheduledTime?: Date;
}

interface PublishResponse {
  success: boolean;
  results: Array<{
    platform: string;
    status: 'success' | 'failed';
    postId?: string;
    error?: string;
  }>;
}
```

#### 工作流服务 API

```typescript
// GET /api/workflows
interface WorkflowQuery {
  category?: string;
  tags?: string[];
  keyword?: string;
  type?: 'coze' | 'n8n';
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  type: 'coze' | 'n8n';
  category: string;
  tags: string[];
  webhookUrl: string;
  apiKey?: string;
  creditsPerCall: number;
  demoVideo?: string;
  screenshots: string[];
  instructions: string;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// POST /api/workflows
interface CreateWorkflowRequest {
  name: string;
  description: string;
  type: 'coze' | 'n8n';
  category: string;
  tags: string[];
  webhookUrl: string;
  apiKey?: string;
  creditsPerCall: number;
  demoVideo?: string;
  screenshots?: string[];
  instructions: string;
}

// PUT /api/workflows/:id
interface UpdateWorkflowRequest {
  name?: string;
  description?: string;
  category?: string;
  tags?: string[];
  webhookUrl?: string;
  apiKey?: string;
  creditsPerCall?: number;
  demoVideo?: string;
  screenshots?: string[];
  instructions?: string;
}

// POST /api/workflows/:id/execute
interface ExecuteWorkflowRequest {
  input: object;
}

interface ExecuteWorkflowResponse {
  executionId: string;
  status: 'running' | 'completed' | 'failed';
  output?: object;
  error?: string;
  creditsUsed: number;
  remainingCredits: number;
}

// GET /api/workflows/:id/executions
interface ExecutionHistory {
  executions: Array<{
    id: string;
    status: string;
    startTime: Date;
    endTime?: Date;
    input: object;
    output?: object;
    error?: string;
    creditsUsed: number;
  }>;
}
```

#### 模板服务 API

```typescript
// GET /api/templates
interface TemplateQuery {
  category?: string;
  keyword?: string;
  sort?: 'popular' | 'latest';
}

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
  usageCount: number;
  config: object;
  author: {
    id: string;
    name: string;
  };
  createdAt: Date;
}

// POST /api/templates
interface CreateTemplateRequest {
  name: string;
  description: string;
  category: string;
  config: object;
  preview?: string;
}

// POST /api/templates/:id/use
interface UseTemplateResponse {
  workflowId: string;
  workflow: Workflow;
}
```

#### 工具服务 API

```typescript
// POST /api/tools/extract-text
interface ExtractTextRequest {
  videoUrl: string;
}

interface ExtractTextResponse {
  text: string;
  segments: Array<{
    timestamp: number;
    content: string;
  }>;
}

// POST /api/tools/rewrite-text
interface RewriteTextRequest {
  originalText: string;
  style?: string;
  mode: 'rewrite' | 'imitate';
}

interface RewriteTextResponse {
  variants: string[];
}

// POST /api/tools/analyze-account
interface AnalyzeAccountRequest {
  accountUrl: string;
  platform: string;
}

interface AnalyzeAccountResponse {
  profile: {
    name: string;
    followers: number;
    contentTypes: string[];
  };
  insights: {
    postFrequency: string;
    avgEngagement: number;
    topTopics: string[];
    recommendations: string[];
  };
}

// POST /api/tools/analyze-video
interface AnalyzeVideoRequest {
  videoUrl: string;
}

interface AnalyzeVideoResponse {
  timeline: Array<{
    timestamp: number;
    type: string;
    description: string;
  }>;
  elements: {
    transitions: string[];
    music: string[];
    effects: string[];
  };
  insights: string[];
}
```

#### 平台服务 API

```typescript
// GET /api/platforms/accounts
interface PlatformAccount {
  id: string;
  platform: 'douyin' | 'xiaohongshu' | 'shipin';
  accountName: string;
  accountId: string;
  avatar: string;
  status: 'active' | 'expired';
  connectedAt: Date;
}

// POST /api/platforms/connect
interface ConnectAccountRequest {
  platform: string;
  authCode: string;
}

interface ConnectAccountResponse {
  success: boolean;
  account: PlatformAccount;
}

// DELETE /api/platforms/accounts/:id
interface DisconnectAccountResponse {
  success: boolean;
  message: string;
}
```

#### 分析服务 API

```typescript
// GET /api/analytics/overview
interface AnalyticsOverview {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  trends: Array<{
    date: string;
    views: number;
    likes: number;
    comments: number;
  }>;
}

// GET /api/analytics/content/:id
interface ContentAnalytics {
  contentId: string;
  platform: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  audience: {
    ageGroups: object;
    genderRatio: object;
    regions: object;
  };
  trafficSources: object;
}

// GET /api/analytics/export
interface ExportRequest {
  startDate: Date;
  endDate: Date;
  format: 'csv' | 'excel';
}

interface ExportResponse {
  downloadUrl: string;
}
```

#### 团队服务 API

```typescript
// GET /api/team/members
interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
  quota: number;
  used: number;
  joinedAt: Date;
}

// POST /api/team/invite
interface InviteMemberRequest {
  email: string;
  role: 'admin' | 'member';
  quota: number;
}

interface InviteMemberResponse {
  success: boolean;
  inviteId: string;
}

// PUT /api/team/members/:id/quota
interface UpdateQuotaRequest {
  quota: number;
}

// GET /api/team/stats
interface TeamStats {
  totalMembers: number;
  totalQuota: number;
  totalUsed: number;
  contentCreated: number;
  workflowExecutions: number;
}
```

## 数据模型

### 数据库Schema

```prisma
// schema.prisma

model User {
  id                String    @id @default(uuid())
  email             String    @unique
  passwordHash      String
  nickname          String?
  avatar            String?
  emailVerified     Boolean   @default(false)
  verificationToken String?
  loginAttempts     Int       @default(0)
  lockedUntil       DateTime?
  membershipType    String    @default("free")
  membershipExpiry  DateTime?
  credits           Int       @default(0)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  orders            Order[]
  workflows         Workflow[]
  templates         Template[]
  contents          Content[]
  platformAccounts  PlatformAccount[]
  teamMemberships   TeamMember[]
  usageLogs         UsageLog[]
  
  @@index([email])
}

model Order {
  id              String   @id @default(uuid())
  userId          String
  planId          String
  amount          Decimal
  paymentMethod   String
  paymentStatus   String   @default("pending")
  transactionId   String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User     @relation(fields: [userId], references: [id])
  plan            Plan     @relation(fields: [planId], references: [id])
  
  @@index([userId])
  @@index([paymentStatus])
}

model Plan {
  id          String   @id @default(uuid())
  name        String
  price       Decimal
  duration    Int      // 天数
  credits     Int
  features    Json
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  orders      Order[]
}

model Workflow {
  id              String   @id @default(uuid())
  userId          String
  name            String
  description     String
  type            String   // 'coze' | 'n8n'
  category        String   // 分类：内容创作、数据分析、营销推广等
  tags            String[] // 标签数组
  webhookUrl      String
  apiKey          String?
  creditsPerCall  Int
  demoVideo       String?
  screenshots     String[]
  instructions    String   @db.Text
  published       Boolean  @default(false)
  usageCount      Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User     @relation(fields: [userId], references: [id])
  executions      WorkflowExecution[]
  
  @@index([userId])
  @@index([type])
  @@index([category])
  @@index([published])
}

model WorkflowExecution {
  id           String    @id @default(uuid())
  workflowId   String
  userId       String
  status       String    // 'running' | 'completed' | 'failed'
  input        Json
  output       Json?
  error        String?
  creditsUsed  Int
  startTime    DateTime  @default(now())
  endTime      DateTime?
  
  workflow     Workflow  @relation(fields: [workflowId], references: [id])
  
  @@index([workflowId])
  @@index([userId])
  @@index([status])
}

model Template {
  id          String   @id @default(uuid())
  authorId    String
  name        String
  description String
  category    String
  preview     String?
  config      Json
  usageCount  Int      @default(0)
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  author      User     @relation(fields: [authorId], references: [id])
  
  @@index([authorId])
  @@index([category])
  @@index([published])
}

model Content {
  id            String   @id @default(uuid())
  userId        String
  topicId       String?
  title         String
  content       String   @db.Text
  tags          String[]
  script        String?  @db.Text
  mediaUrls     String[]
  status        String   @default("draft")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  user          User     @relation(fields: [userId], references: [id])
  publications  Publication[]
  analytics     ContentAnalytics[]
  
  @@index([userId])
  @@index([status])
}

model Publication {
  id          String   @id @default(uuid())
  contentId   String
  platform    String
  postId      String?
  status      String   // 'pending' | 'published' | 'failed'
  scheduledAt DateTime?
  publishedAt DateTime?
  error       String?
  createdAt   DateTime @default(now())
  
  content     Content  @relation(fields: [contentId], references: [id])
  
  @@index([contentId])
  @@index([platform])
  @@index([status])
}

model PlatformAccount {
  id          String   @id @default(uuid())
  userId      String
  platform    String
  accountName String
  accountId   String
  avatar      String?
  accessToken String
  refreshToken String?
  expiresAt   DateTime?
  status      String   @default("active")
  connectedAt DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([platform])
  @@unique([userId, platform, accountId])
}

model ContentAnalytics {
  id          String   @id @default(uuid())
  contentId   String
  platform    String
  views       Int      @default(0)
  likes       Int      @default(0)
  comments    Int      @default(0)
  shares      Int      @default(0)
  audience    Json?
  traffic     Json?
  recordedAt  DateTime @default(now())
  
  content     Content  @relation(fields: [contentId], references: [id])
  
  @@index([contentId])
  @@index([platform])
}

model Team {
  id          String   @id @default(uuid())
  name        String
  ownerId     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  members     TeamMember[]
}

model TeamMember {
  id          String   @id @default(uuid())
  teamId      String
  userId      String
  role        String   // 'admin' | 'member'
  quota       Int      @default(0)
  used        Int      @default(0)
  joinedAt    DateTime @default(now())
  
  team        Team     @relation(fields: [teamId], references: [id])
  user        User     @relation(fields: [userId], references: [id])
  
  @@unique([teamId, userId])
  @@index([teamId])
  @@index([userId])
}

model UsageLog {
  id          String   @id @default(uuid())
  userId      String
  action      String   // 'tool_use' | 'workflow_execute' | 'content_create'
  resource    String
  credits     Int
  metadata    Json?
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([action])
  @@index([createdAt])
}

model ApiConfig {
  id          String   @id @default(uuid())
  userId      String
  service     String   // 'runninghub' | 'openai' | etc
  apiKey      String
  config      Json?
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([userId, service])
  @@index([userId])
}
```

## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的正式陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

### 属性 1: 注册后账号创建和邮件发送
*对于任何*有效的注册信息（邮箱、密码、验证码），提交注册后应在数据库中创建新账号，并在邮件队列中存在对应的验证邮件
**验证需求: 1.2**

### 属性 2: 邮箱验证激活账号
*对于任何*未激活的账号和有效的验证令牌，点击验证后账号的emailVerified字段应变为true
**验证需求: 1.3**

### 属性 3: 正确凭证返回有效令牌
*对于任何*已注册且已激活的用户，使用正确的邮箱和密码登录应返回有效的JWT令牌
**验证需求: 1.4**

### 属性 4: 登录失败锁定机制
*对于任何*用户账号，连续5次错误登录后账号应被锁定15分钟，且lockedUntil字段应设置为当前时间+15分钟
**验证需求: 1.5**

### 属性 5: 支付请求返回支付URL
*对于任何*有效的套餐选择和支付方式，创建订单应返回有效的支付URL或二维码
**验证需求: 2.2**

### 属性 6: 支付成功更新会员状态
*对于任何*成功的支付回调，用户的会员类型、到期时间和积分应根据购买的套餐正确更新
**验证需求: 2.3**

### 属性 7: 支付失败回滚订单
*对于任何*失败或超时的支付，订单状态应回滚为"failed"，用户的会员状态和积分不应改变
**验证需求: 2.4**

### 属性 8: 会员到期提醒
*对于任何*会员到期时间在7天内的用户，系统应发送续费提醒邮件和站内消息
**验证需求: 2.5**

### 属性 9: 选题搜索返回相关结果
*对于任何*关键词搜索请求，返回的选题列表中每个选题的标题、描述或标签应包含该关键词或相关词
**验证需求: 3.2**

### 属性 10: 选题大纲包含必需字段
*对于任何*选中的选题，生成的大纲应包含标题建议、内容要点和目标受众分析这三个必需字段
**验证需求: 3.3**

### 属性 11: 选题保存后可检索
*对于任何*保存的选题，应能从用户的选题库中通过选题ID检索到相同的选题数据
**验证需求: 3.4**

### 属性 12: 文案生成包含必需字段
*对于任何*确认的选题，生成的文案应包含标题、正文和标签建议这三个必需字段
**验证需求: 4.2**

### 属性 13: 视频素材生成返回URL
*对于任何*生成的文案，系统应返回至少一个视频素材URL（画面或配音）
**验证需求: 4.3**

### 属性 14: 发布返回状态
*对于任何*发布请求，系统应为每个选定的平台返回发布状态（成功或失败）
**验证需求: 4.5**

### 属性 15: 工作流上传验证Webhook
*对于任何*工作流上传请求，系统应验证Webhook URL的可访问性和响应格式
**验证需求: 5.4**

### 属性 16: 工作流保存后可检索
*对于任何*保存的工作流，应能从数据库中通过工作流ID检索到相同的工作流配置（包括分类和标签）
**验证需求: 5.4**

### 属性 17: 工作流执行调用Webhook
*对于任何*工作流执行请求，系统应正确调用配置的Webhook URL并传递输入数据
**验证需求: 5.5**

### 属性 18: 工作流测试返回响应数据
*对于任何*工作流测试运行，系统应返回Webhook的完整响应数据（输入和输出）
**验证需求: 6.4**

### 属性 19: 模板使用后出现在工作流列表
*对于任何*选择使用的模板，应在用户的工作流列表中创建一个新的工作流实例
**验证需求: 7.3**

### 属性 20: 模板上传后可见
*对于任何*上传的工作流模板，验证通过后应在模板库中可见并可被其他用户搜索到
**验证需求: 7.4**

### 属性 21: 模板搜索匹配关键词
*对于任何*模板搜索请求，返回的模板列表中每个模板的名称、描述或标签应包含搜索关键词
**验证需求: 7.5**

### 属性 22: 文案提取返回结构化数据
*对于任何*有效的视频链接，文案提取应返回包含时间戳和内容分段的结构化数据
**验证需求: 8.1, 8.2**

### 属性 23: 文案二创生成多个版本
*对于任何*输入的原始文案，二创工具应返回至少2个不同的改写版本
**验证需求: 8.3**

### 属性 24: 文案保存后可在内容库检索
*对于任何*保存的生成文案，应能从用户的内容库中通过文案ID检索到相同的文案内容
**验证需求: 8.5**

### 属性 25: 账号分析返回必需字段
*对于任何*有效的账号链接，分析结果应包含内容类型分布、发布频率、互动数据趋势和爆款内容特征
**验证需求: 9.1, 9.2**

### 属性 26: 视频拆解返回必需字段
*对于任何*选择拆解的视频，分析结果应包含镜头切换、文案节奏、音乐使用和视觉元素这四个维度的分析
**验证需求: 9.3**

### 属性 27: 拆解结果包含时间轴
*对于任何*完成的视频拆解，结果应包含可视化的时间轴分析和关键创作要素总结
**验证需求: 9.4**

### 属性 28: 导出生成有效PDF
*对于任何*分析报告导出请求，系统应返回有效的PDF文件下载链接
**验证需求: 9.5**

### 属性 29: OAuth授权安全存储凭证
*对于任何*成功的OAuth授权流程，访问令牌和刷新令牌应加密存储在数据库中
**验证需求: 10.2**

### 属性 30: 平台发布格式适配
*对于任何*内容发布请求，系统应根据目标平台（抖音/小红书/视频号）调整内容格式和参数
**验证需求: 10.3**

### 属性 31: 账号删除清除凭证
*对于任何*删除的平台账号，相关的访问令牌和刷新令牌应从数据库中完全清除
**验证需求: 10.4**

### 属性 32: 授权过期发送提醒
*对于任何*授权已过期的平台账号，系统应向用户发送重新授权的提醒
**验证需求: 10.5**

### 属性 33: 成员邀请发送邮件
*对于任何*新成员邀请，系统应发送包含邀请链接的邮件到指定邮箱
**验证需求: 11.2**

### 属性 34: 配额设置正确保存
*对于任何*管理员设置的成员配额，应正确保存到数据库并在成员信息中反映
**验证需求: 11.4**

### 属性 35: 超出配额阻止使用
*对于任何*已使用积分超过配额的成员，系统应拒绝其AI功能调用请求并返回配额不足错误
**验证需求: 11.5**

### 属性 36: 时间范围过滤数据
*对于任何*指定的时间范围查询，返回的数据记录的时间戳应全部在该时间范围内
**验证需求: 12.2**

### 属性 37: 导出生成有效Excel
*对于任何*数据报告导出请求，系统应返回有效的Excel文件下载链接
**验证需求: 12.5**

### 属性 38: 有效API Key保存成功
*对于任何*有效的API Key，验证通过后应成功保存到数据库并标记为active状态
**验证需求: 13.2**

### 属性 39: API Key配置启用节点
*对于任何*成功配置的API Key，对应的服务节点应在工作流节点库中变为可用状态
**验证需求: 13.4**

### 属性 40: 工作流执行扣除积分
*对于任何*工作流执行请求，用户的积分应减少该工作流设置的creditsPerCall数量
**验证需求: 需求5, 需求6**

### 属性 41: 积分不足拒绝执行
*对于任何*用户，当剩余积分少于工作流所需积分时，系统应拒绝执行并返回积分不足错误
**验证需求: 需求5, 需求6**

## 错误处理

### 认证错误
- 无效的邮箱格式：返回400错误和具体的验证错误信息
- 邮箱已存在：返回409错误提示邮箱已被注册
- 验证码错误：返回401错误提示验证码无效
- 账号被锁定：返回403错误并告知解锁时间
- JWT令牌过期：返回401错误要求重新登录

### 支付错误
- 套餐不存在：返回404错误
- 支付网关超时：返回504错误并保留订单供重试
- 支付验证失败：返回400错误并回滚订单
- 重复支付：返回409错误并返回原订单状态

### 工作流错误
- Webhook调用失败：记录错误日志，返回502错误
- 积分不足：返回402错误并提示充值
- 工作流配置无效：返回400错误并指出具体问题
- 执行超时：返回504错误并标记执行状态为failed

### 平台集成错误
- OAuth授权失败：返回401错误并提供重新授权链接
- 平台API限流：返回429错误并建议稍后重试
- 发布内容违规：返回400错误并返回平台的具体违规原因
- 账号授权过期：返回401错误并提示重新授权

### 通用错误处理原则
- 所有错误应记录到日志系统
- 敏感信息（如密码、令牌）不应出现在错误消息中
- 为用户提供可操作的错误提示
- 关键操作失败应发送通知给管理员

## 测试策略

### 单元测试
使用Jest + Supertest进行后端API单元测试，覆盖：
- 认证服务：注册、登录、邮箱验证逻辑
- 支付服务：订单创建、支付回调处理
- 工作流服务：Webhook调用、积分扣除
- 工具服务：文案提取、账号分析算法

使用React Testing Library进行前端组件测试，覆盖：
- 表单验证逻辑
- 状态管理
- 用户交互流程

### 属性测试
使用fast-check进行属性测试，验证正确性属性：
- 每个属性测试应运行至少100次迭代
- 使用智能生成器生成符合约束的测试数据
- 每个属性测试应明确标注对应的设计文档属性编号

### 集成测试
- API端到端测试：测试完整的用户流程
- 外部服务集成测试：模拟Coze/n8n/支付网关的响应
- 数据库事务测试：验证数据一致性

### 性能测试
- 负载测试：模拟1000并发用户
- 压力测试：测试系统极限
- 工作流执行性能：单个工作流执行时间应<5秒

### 安全测试
- SQL注入测试
- XSS攻击测试
- CSRF保护测试
- 敏感数据加密验证
- API限流测试

