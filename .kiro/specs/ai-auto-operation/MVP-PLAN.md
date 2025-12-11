# AI创作助手 - MVP开发计划

## 项目概述

**项目名称**: AI创作助手 MVP版本  
**开发周期**: 6-8周  
**团队配置**: 2-3人（前端1人 + 后端1人 + 产品/设计0.5人）  
**目标**: 快速验证核心价值，上线获取用户反馈

---

## MVP核心价值主张

**一句话描述**: 帮助内容创作者用AI快速生成短视频内容（选题→文案→数字人视频）

**核心用户旅程**:
```
注册 → 选择选题 → AI生成文案 → 生成数字人视频 → 下载发布
```

---

## MVP功能范围

### ✅ 包含的功能（P0 - 必须有）

#### 1. 用户系统（简化版）
- [x] 邮箱注册/登录
- [x] 基础会员系统（免费版 + 基础版，2个套餐）
- [x] 积分系统
- [x] 简单支付（支付宝/微信扫码）
- [ ] ~~第三方登录~~ - V2.0
- [ ] ~~复杂的会员体系~~ - V2.0

#### 2. 选题库（精选版）
- [x] 热门选题列表（手动维护30个精选选题）
- [x] 选题详情页（包含案例、建议、标题方向）
- [x] 选题收藏功能
- [x] 简单的分类筛选（3-5个分类）
- [ ] ~~AI生成选题~~ - V2.0
- [ ] ~~复杂的筛选和搜索~~ - V2.0

#### 3. AI文案生成（核心功能）
- [x] 输入主题生成文案
- [x] 生成3个版本供选择
- [x] 文案编辑功能
- [x] 保存到草稿箱
- [x] 调用大模型API（GPT-4/文心一言/通义千问）
- [ ] ~~文案提取~~ - V2.0
- [ ] ~~文案二创~~ - V2.0

#### 4. 数字人视频生成（核心功能）
- [x] 选择数字人形象（3-5个预设形象）
- [x] 基础配音设置（声音类型、语速）
- [x] 基础视频设置（背景、比例、字幕）
- [x] 生成视频
- [x] 视频预览
- [x] 调用数字人API（HeyGen/D-ID/腾讯智影）
- [ ] ~~复杂的自定义设置~~ - V2.0
- [ ] ~~上传自定义形象~~ - V2.0

#### 5. 内容管理（简化版）
- [x] 草稿箱（保存未完成的内容）
- [x] 已生成内容列表
- [x] 视频下载
- [x] 删除内容
- [ ] ~~自动发布到平台~~ - V2.0
- [ ] ~~定时发布~~ - V2.0

#### 6. 个人中心（基础版）
- [x] 个人信息展示
- [x] 会员信息和到期时间
- [x] 积分余额和消耗记录
- [x] 订单历史
- [ ] ~~详细的使用统计~~ - V2.0

### ❌ 不包含的功能（延后到V2.0）

- AI分身功能
- 工具市场（文案提取、二创、竞品分析）
- 数据分析功能
- 自动发布到平台
- 账号管理（绑定抖音/小红书）
- 团队管理
- 管理后台
- 社区功能

---

## 技术架构

### 前端技术栈
- **框架**: React 18 + TypeScript
- **UI库**: Ant Design 5.x
- **状态管理**: Zustand
- **数据获取**: TanStack Query (React Query)
- **路由**: React Router v6
- **构建工具**: Vite
- **表单**: React Hook Form + Zod

### 后端技术栈
- **框架**: Node.js 18+ + Express
- **语言**: TypeScript
- **数据库**: PostgreSQL 14+
- **缓存**: Redis 7+
- **ORM**: Prisma
- **认证**: JWT
- **文件存储**: 阿里云OSS / AWS S3

### 第三方服务
- **大模型API**: 
  - 主选：OpenAI GPT-4 Turbo
  - 备选：文心一言、通义千问
- **数字人API**:
  - 主选：HeyGen API
  - 备选：D-ID、腾讯智影
- **支付**: 
  - 支付宝当面付
  - 微信支付扫码

---

## 数据库设计（MVP简化版）

### 核心表结构

```sql
-- 用户表
User {
  id: uuid
  email: string (unique)
  passwordHash: string
  nickname: string?
  avatar: string?
  membershipType: enum (free, basic)
  membershipExpiry: datetime?
  credits: int (default: 100)
  createdAt: datetime
  updatedAt: datetime
}

-- 订单表
Order {
  id: uuid
  userId: uuid (FK)
  planId: uuid (FK)
  amount: decimal
  paymentMethod: enum (alipay, wechat)
  paymentStatus: enum (pending, success, failed)
  transactionId: string?
  createdAt: datetime
}

-- 套餐表
Plan {
  id: uuid
  name: string
  price: decimal
  credits: int
  duration: int (天数)
  features: json
  active: boolean
}

-- 选题表
Topic {
  id: uuid
  title: string
  description: text
  category: string
  heatIndex: float
  tags: string[]
  content: json (包含案例、建议等)
  published: boolean
  createdAt: datetime
}

-- 内容表
Content {
  id: uuid
  userId: uuid (FK)
  topicId: uuid? (FK)
  title: string
  copywriting: text (文案)
  videoUrl: string?
  status: enum (draft, completed)
  metadata: json (包含配置信息)
  createdAt: datetime
  updatedAt: datetime
}

-- 使用记录表
UsageLog {
  id: uuid
  userId: uuid (FK)
  action: enum (generate_copy, generate_video)
  credits: int
  metadata: json
  createdAt: datetime
}
```

---

## API接口设计（MVP核心接口）

### 认证相关
```
POST   /api/auth/register          # 注册
POST   /api/auth/login             # 登录
POST   /api/auth/logout            # 登出
GET    /api/auth/me                # 获取当前用户信息
```

### 用户相关
```
GET    /api/users/profile          # 获取个人信息
PUT    /api/users/profile          # 更新个人信息
GET    /api/users/credits          # 获取积分信息
GET    /api/users/usage-logs       # 获取使用记录
```

### 支付相关
```
GET    /api/payment/plans          # 获取套餐列表
POST   /api/payment/create-order   # 创建订单
POST   /api/payment/callback       # 支付回调
GET    /api/payment/orders         # 获取订单历史
```

### 选题相关
```
GET    /api/topics                 # 获取选题列表
GET    /api/topics/:id             # 获取选题详情
POST   /api/topics/:id/favorite    # 收藏选题
DELETE /api/topics/:id/favorite    # 取消收藏
GET    /api/topics/favorites       # 获取收藏列表
```

### 内容创作相关
```
POST   /api/content/generate-copy  # 生成文案
POST   /api/content/generate-video # 生成数字人视频
GET    /api/content                # 获取内容列表
GET    /api/content/:id            # 获取内容详情
PUT    /api/content/:id            # 更新内容
DELETE /api/content/:id            # 删除内容
GET    /api/content/drafts         # 获取草稿列表
```

---

## 开发排期（6-8周）

### 第1周：项目搭建和基础功能
**前端**:
- [ ] 项目初始化（Vite + React + TS）
- [ ] 配置路由和状态管理
- [ ] 集成Ant Design
- [ ] 实现登录/注册页面
- [ ] 实现基础Layout

**后端**:
- [ ] 项目初始化（Express + TS）
- [ ] 配置数据库（PostgreSQL + Prisma）
- [ ] 配置Redis
- [ ] 实现用户认证（JWT）
- [ ] 实现注册/登录API

**产品/设计**:
- [ ] 确定UI设计规范
- [ ] 准备30个精选选题内容
- [ ] 准备数字人形象素材

---

### 第2周：用户系统和支付
**前端**:
- [ ] 实现会员套餐页面
- [ ] 实现支付流程页面
- [ ] 实现个人中心页面
- [ ] 集成支付SDK

**后端**:
- [ ] 实现套餐管理
- [ ] 集成支付宝支付
- [ ] 集成微信支付
- [ ] 实现支付回调处理
- [ ] 实现积分系统

---

### 第3周：选题库功能
**前端**:
- [ ] 实现选题库列表页
- [ ] 实现选题详情页
- [ ] 实现选题收藏功能
- [ ] 实现分类筛选

**后端**:
- [ ] 实现选题CRUD API
- [ ] 实现选题收藏API
- [ ] 导入30个精选选题数据
- [ ] 实现选题搜索和筛选

---

### 第4周：AI文案生成
**前端**:
- [ ] 实现文案生成页面
- [ ] 实现文案编辑器
- [ ] 实现草稿保存功能
- [ ] 实现生成结果展示

**后端**:
- [ ] 集成大模型API（GPT-4）
- [ ] 实现文案生成逻辑
- [ ] 实现Prompt工程优化
- [ ] 实现内容保存API
- [ ] 实现积分扣除逻辑

---

### 第5周：数字人视频生成
**前端**:
- [ ] 实现数字人形象选择
- [ ] 实现视频配置界面
- [ ] 实现视频生成流程
- [ ] 实现视频预览功能
- [ ] 实现视频下载功能

**后端**:
- [ ] 集成数字人API（HeyGen）
- [ ] 实现视频生成逻辑
- [ ] 实现视频状态轮询
- [ ] 实现视频文件存储（OSS）
- [ ] 实现积分扣除逻辑

---

### 第6周：内容管理和优化
**前端**:
- [ ] 实现内容列表页
- [ ] 实现草稿箱
- [ ] 实现内容详情页
- [ ] 优化用户体验
- [ ] 响应式适配

**后端**:
- [ ] 实现内容管理API
- [ ] 优化API性能
- [ ] 实现错误处理
- [ ] 实现日志记录

---

### 第7周：测试和修复
**全员**:
- [ ] 功能测试
- [ ] 集成测试
- [ ] 性能测试
- [ ] Bug修复
- [ ] 安全测试

---

### 第8周：上线准备
**全员**:
- [ ] 生产环境部署
- [ ] 数据库迁移
- [ ] 域名和SSL配置
- [ ] 监控和日志配置
- [ ] 准备运营素材
- [ ] 内测用户招募

---

## 成本预算

### 开发成本
- **人力成本**: 10-15万（2-3人 × 2个月）
- **服务器**: 2000元/月 × 2 = 4000元
- **域名和SSL**: 500元
- **总计**: 约10.5-15.5万

### 运营成本（前3个月）
- **大模型API**: 5000元/月 × 3 = 15000元
- **数字人API**: 8000元/月 × 3 = 24000元
- **服务器**: 2000元/月 × 3 = 6000元
- **OSS存储**: 1000元/月 × 3 = 3000元
- **总计**: 约4.8万

### 总预算: 15-20万

---

## 收入预测

### 套餐定价
- **免费版**: 0元/月，100积分
- **基础版**: 99元/月，1000积分

### 收入预测
- **第1个月**: 50付费用户 × 99元 = 4950元
- **第2个月**: 150付费用户 × 99元 = 14850元
- **第3个月**: 300付费用户 × 99元 = 29700元
- **3个月累计**: 约5万元

### ROI分析
- **投入**: 20万
- **3个月收入**: 5万
- **预计6-9个月回本**

---

## 成功指标（KPI）

### 用户指标
- **注册用户**: 500+ (第1个月)
- **付费用户**: 50+ (第1个月)
- **付费转化率**: 10%+
- **用户留存率**: 40%+ (7日留存)

### 产品指标
- **日活用户**: 100+ (第1个月)
- **内容生成量**: 1000+ 条/月
- **视频生成量**: 500+ 个/月
- **平均使用时长**: 15分钟+

### 技术指标
- **API响应时间**: <2秒
- **视频生成成功率**: >95%
- **系统可用性**: >99%

---

## 风险和应对

### 技术风险
**风险**: 第三方API不稳定
**应对**: 准备备选方案（多个API供应商）

**风险**: 视频生成速度慢
**应对**: 优化队列机制，提供预估时间

### 市场风险
**风险**: 用户不买单
**应对**: 快速迭代，调整功能和定价

**风险**: 竞品抢先
**应对**: 快速上线，建立先发优势

### 成本风险
**风险**: API调用成本过高
**应对**: 优化调用策略，设置合理的积分消耗

---

## 下一步行动

### 立即开始
1. [ ] 确认技术栈和架构
2. [ ] 注册第三方服务账号（OpenAI、HeyGen等）
3. [ ] 准备开发环境
4. [ ] 创建项目仓库

### 本周完成
1. [ ] 完成项目初始化
2. [ ] 完成数据库设计
3. [ ] 完成API接口设计
4. [ ] 开始第1周开发任务

---

## 附录

### 参考资料
- OpenAI API文档: https://platform.openai.com/docs
- HeyGen API文档: https://docs.heygen.com
- Ant Design文档: https://ant.design
- Prisma文档: https://www.prisma.io/docs

### 团队协作
- **项目管理**: 使用Notion/飞书
- **代码管理**: Git + GitHub/GitLab
- **设计协作**: Figma
- **沟通工具**: 微信/钉钉

