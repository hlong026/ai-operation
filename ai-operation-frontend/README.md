# AI自动运营系统 - 前端项目

这是一个基于 React + TypeScript + Ant Design 构建的AI自动运营系统前端项目。

## 技术栈

- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Ant Design 5** - UI组件库
- **React Router 6** - 路由管理
- **Zustand** - 状态管理
- **Vite** - 构建工具

## 功能模块

### 已完成的页面

1. **首页** (`/`) - 展示快速操作、常用工具和热门工作流
2. **工作流管理** (`/workflows`) - 浏览和管理工作流
3. **工作流详情** (`/workflows/:id`) - 查看工作流详细信息
4. **工作流上传** (`/workflows/upload`) - 上传新的工作流
5. **工作流执行** (`/workflows/:id/execute`) - 执行工作流
6. **工具箱** (`/tools`) - 各类AI工具
7. **一键创作** (`/create`) - 4步创作流程
8. **数据分析** (`/analytics`) - 数据统计和分析
9. **账号管理** (`/accounts`) - 多平台账号管理
10. **团队管理** (`/team`) - MCN团队功能
11. **会员套餐** (`/pricing`) - 套餐选择和升级
12. **登录** (`/login`) - 用户登录
13. **注册** (`/register`) - 用户注册

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

项目将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
ai-operation-frontend/
├── src/
│   ├── components/          # 组件
│   │   └── layout/         # 布局组件
│   │       └── Layout.tsx  # 主布局
│   ├── pages/              # 页面
│   │   ├── Home.tsx        # 首页
│   │   ├── Workflows.tsx   # 工作流列表
│   │   ├── WorkflowDetail.tsx
│   │   ├── WorkflowUpload.tsx
│   │   ├── WorkflowExecute.tsx
│   │   ├── Tools.tsx       # 工具箱
│   │   ├── Create.tsx      # 一键创作
│   │   ├── Analytics.tsx   # 数据分析
│   │   ├── Accounts.tsx    # 账号管理
│   │   ├── Team.tsx        # 团队管理
│   │   ├── Pricing.tsx     # 会员套餐
│   │   ├── Login.tsx       # 登录
│   │   └── Register.tsx    # 注册
│   ├── App.tsx             # 应用入口
│   ├── main.tsx            # 主文件
│   └── index.css           # 全局样式
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 设计特点

- **响应式设计** - 适配桌面和移动端
- **Ant Design风格** - 企业级UI设计
- **模块化架构** - 清晰的代码组织
- **TypeScript** - 类型安全和智能提示
- **路由管理** - React Router 6

## 待集成功能

以下功能需要后端API支持：

- [ ] 用户认证和授权
- [ ] 工作流Webhook调用
- [ ] 数据持久化
- [ ] 文件上传
- [ ] 支付集成
- [ ] 数据图表（建议使用 Recharts 或 ECharts）

## 开发建议

### 添加图表库

如果需要数据可视化，可以安装：

```bash
# Recharts (推荐)
npm install recharts

# 或 Apache ECharts
npm install echarts echarts-for-react
```

### 添加富文本编辑器

工作流上传页面可以集成富文本编辑器：

```bash
npm install react-quill
```

### 状态管理

项目已配置 Zustand，可以在 `src/store` 目录创建状态管理：

```typescript
// src/store/useAuthStore.ts
import { create } from 'zustand'

interface AuthState {
  user: any
  token: string | null
  login: (email: string, password: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (email, password) => {
    // 登录逻辑
  },
  logout: () => {
    set({ user: null, token: null })
  },
}))
```

## 注意事项

1. 当前所有数据都是模拟数据，需要连接后端API
2. 图表部分使用占位符，需要集成图表库
3. 文件上传功能需要配置OSS或后端接口
4. 支付功能需要集成微信/支付宝SDK

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## License

MIT
