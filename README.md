# 移动支付后台管理系统

一个现代化的移动支付应用后台管理系统，使用 React + TypeScript + Vite 构建。

## 🚀 特性

- ⚡ **Vite** - 极速的开发体验
- ⚛️ **React 18** - 最新的 React 版本
- 🔷 **TypeScript** - 类型安全的开发
- 📱 **响应式设计** - 完美适配各种屏幕尺寸
- 🎨 **现代化 UI** - 简洁专业的管理界面
- � **数据可视化** - 直观的数据展示和图表
- 🔐 **权限管理** - 完整的用户权限控制

## 🛠️ 技术栈

- React 18
- TypeScript
- Vite
- CSS3 (Grid, Flexbox, 渐变效果)
- ESLint

## 📦 安装

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 🔧 开发

启动开发服务器后，访问 http://localhost:3000 查看应用。

### 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产版本
- `npm run lint` - 运行 ESLint 检查

## 📱 功能模块

### 📊 仪表盘
- 实时数据统计：交易额、交易笔数、活跃用户等
- 最近交易列表
- 交易趋势图表
- 支付方式分布

### 💳 交易管理
- 交易记录查询和筛选
- 交易状态管理
- 退款操作
- 交易数据导出
- 实时状态监控

### 👥 用户管理
- 用户信息查看和编辑
- 账户状态管理（正常/冻结/待审核）
- 用户交易历史
- 用户行为分析

### ⚙️ 系统设置
- 支付参数配置
- 安全策略设置
- 通知规则配置
- 系统信息监控

## 🎨 界面特色

- **侧边栏导航**：可折叠的导航菜单
- **数据卡片**：清晰的数据展示卡片
- **表格设计**：响应式数据表格
- **状态指示**：直观的状态颜色标识
- **交互反馈**：流畅的悬停和点击效果

## 📝 项目结构

```
src\
├── App.css               # 应用主样式
├── App.tsx               # 应用主组件
├── components\           # 可复用组件
│   ├── Common\           # 通用组件
│   ├── GateManagement\   # 闸机管理相关组件
│   ├── QRCodeScanner\    # 二维码扫描组件
│   ├── Site\             # 站点相关组件
│   └── UserCenter\       # 用户中心相关组件
├── examples\             # 示例代码
├── hooks\                # React Hooks
│   ├── useApi.ts         # API调用Hook
│   ├── useGateUsers.ts   # 闸机用户相关Hook
│   ├── useGates.ts       # 闸机相关Hook
│   ├── useSiteData.ts    # 站点数据相关Hook
│   ├── useStations.ts    # 车站相关Hook
│   └── useTripRecords.ts # 行程记录相关Hook
├── index.css             # 全局样式
├── layout\               # 布局组件
│   ├── Sidebar.tsx       # 侧边栏组件
│   ├── Sidebar_fixed.tsx # 固定侧边栏组件
│   └── Sidebar_new.tsx   # 新侧边栏组件
├── main.tsx              # 应用入口文件
├── pages\                # 页面组件
│   ├── Dashboard.tsx             # 仪表盘页面
│   ├── DeviceManagement.tsx      # 设备管理页面
│   ├── DiscountStrategy.tsx      # 折扣策略页面
│   ├── GateManagement.tsx        # 闸机管理页面
│   ├── GateSystem.tsx            # 闸机系统页面
│   ├── Login.tsx                 # 登录页面
│   ├── PaymentMethods.tsx        # 支付方式页面
│   ├── PermissionManagement.tsx  # 权限管理页面
│   ├── Settings.tsx              # 设置页面
│   ├── SiteManagement.tsx        # 站点管理页面
│   ├── TransactionList.tsx       # 交易列表页面
│   ├── UserCenter.tsx            # 用户中心页面
│   ├── UserInfoManagement.tsx    # 用户信息管理页面
│   └── UserManagement.tsx        # 用户管理页面
├── services\             # API服务
│   ├── api.ts            # API基础封装
│   ├── apiWrapper.ts     # API包装器
│   ├── authApi.ts        # 认证相关API
│   ├── configApi.ts      # 配置相关API
│   ├── dashboardApi.ts   # 仪表盘相关API
│   ├── deviceApi.ts      # 设备相关API
│   ├── discountApi.ts    # 折扣相关API
│   ├── logApi.ts         # 日志相关API
│   ├── mockApi.ts        # 模拟API数据
│   ├── reportApi.ts      # 报告相关API
│   ├── siteApi.ts        # 站点相关API
│   ├── statisticsApi.ts  # 统计相关API
│   ├── transactionApi.ts # 交易相关API
│   ├── uploadApi.ts      # 上传相关API
│   └── userApi.ts        # 用户相关API
├── styles\               # 样式文件
├── types\                # TypeScript类型定义
│   ├── api.ts            # API类型
│   ├── common.ts         # 通用类型
│   ├── device.ts         # 设备类型
│   ├── discount.ts       # 折扣类型
│   ├── gate.ts           # 闸机类型
│   ├── line.ts           # 线路类型
│   ├── log.ts            # 日志类型
│   ├── site.ts           # 站点类型
│   ├── stats.ts          # 统计类型
│   ├── system.ts         # 系统类型
│   ├── transaction.ts    # 交易类型
│   ├── travel.ts         # 行程类型
│   └── user.ts           # 用户类型
├── utils\                # 工具函数
│   └── apiClient.ts      # API客户端
└── vite-env.d.ts         # Vite环境类型声明
```

## 🔐 功能权限

- **管理员权限**：完整的系统管理功能
- **操作员权限**：基础的业务操作功能
- **查看权限**：只读的数据查看功能

## 📈 数据监控

- 实时交易监控
- 异常交易预警
- 系统性能监控
- 用户行为分析

## 🚀 部署

项目可以部署到任何静态网站托管服务，如：
- Vercel
- Netlify
- GitHub Pages
- AWS S3

构建命令：`npm run build`，构建输出目录：`dist/`

## 🔒 安全特性

- 数据加密传输
- 权限验证机制
- 操作日志记录
- 异常访问检测
