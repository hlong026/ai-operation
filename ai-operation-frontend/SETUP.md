# 项目安装和启动指南

## 前置要求

- Node.js 18+ 
- npm 或 yarn

## 安装步骤

### 1. 进入项目目录

```bash
cd ai-operation-frontend
```

### 2. 安装依赖

```bash
npm install
```

如果安装速度慢，可以使用国内镜像：

```bash
npm install --registry=https://registry.npmmirror.com
```

### 3. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动，浏览器会自动打开。

## 项目功能演示

### 登录/注册
- 访问 http://localhost:3000/login 查看登录页面
- 访问 http://localhost:3000/register 查看注册页面
- 目前是模拟登录，输入任意邮箱密码即可

### 主要功能页面

1. **首页** - http://localhost:3000/
   - 快速操作入口
   - 常用工具展示
   - 热门工作流推荐

2. **工作流管理** - http://localhost:3000/workflows
   - 工作流列表
   - 筛选和搜索
   - 点击"查看详情"可以查看工作流详情
   - 点击"立即使用"可以执行工作流

3. **工作流上传** - http://localhost:3000/workflows/upload
   - 上传新工作流
   - 配置Webhook
   - 上传演示材料

4. **工具箱** - http://localhost:3000/tools
   - 各类AI工具
   - 分类浏览

5. **一键创作** - http://localhost:3000/create
   - 4步创作流程
   - 选题 → 文案 → 素材 → 发布

6. **数据分析** - http://localhost:3000/analytics
   - 数据统计卡片
   - 内容排行榜

7. **账号管理** - http://localhost:3000/accounts
   - 多平台账号绑定
   - 发布历史

8. **团队管理** - http://localhost:3000/team
   - 成员管理
   - 配额分配

9. **会员套餐** - http://localhost:3000/pricing
   - 套餐对比
   - 升级选项

## 开发说明

### 修改端口

如果3000端口被占用，可以修改 `vite.config.ts`：

```typescript
export default defineConfig({
  server: {
    port: 3001, // 改为其他端口
  },
})
```

### 热更新

Vite 支持热模块替换(HMR)，修改代码后会自动刷新页面。

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

## 常见问题

### Q: 安装依赖失败？
A: 尝试清除缓存后重新安装：
```bash
rm -rf node_modules package-lock.json
npm install
```

### Q: 启动后页面空白？
A: 检查浏览器控制台是否有错误，确保所有依赖都已正确安装。

### Q: 如何连接后端API？
A: 在 `src/services/api.ts` 中配置后端API地址：
```typescript
const API_BASE_URL = 'http://localhost:8000/api'
```

### Q: 如何添加新页面？
A: 
1. 在 `src/pages/` 创建新页面组件
2. 在 `src/App.tsx` 添加路由
3. 在 `src/components/layout/Layout.tsx` 添加菜单项

## 下一步

- [ ] 集成后端API
- [ ] 添加数据图表库（Recharts/ECharts）
- [ ] 添加富文本编辑器
- [ ] 实现状态管理
- [ ] 添加单元测试
- [ ] 优化移动端体验

## 技术支持

如有问题，请查看：
- [React 文档](https://react.dev/)
- [Ant Design 文档](https://ant.design/)
- [Vite 文档](https://vitejs.dev/)
