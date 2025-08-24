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
mobilePayWeb/
├── public/                    # 静态资源目录
│   └── vite.svg              # Vite 图标
├── src/                      # 源代码目录
│   ├── components/           # 组件目录
│   │   ├── Dashboard.tsx     # 仪表盘组件
│   │   ├── Dashboard.css     # 仪表盘样式
│   │   ├── DeviceManagement.tsx # 设备管理组件
│   │   ├── DiscountStrategy.tsx # 折扣策略组件
│   │   ├── DiscountStrategy.css # 折扣策略样式
│   │   ├── GateManagement.tsx   # 门禁管理组件
│   │   ├── GateManagement.css   # 门禁管理样式
│   │   ├── GateSystem.tsx       # 门禁系统组件
│   │   ├── GateSystem.css       # 门禁系统样式
│   │   ├── Login.tsx            # 登录组件
│   │   ├── Login.css            # 登录样式
│   │   ├── PaymentMethods.tsx   # 支付方式组件
│   │   ├── PaymentMethods.css   # 支付方式样式
│   │   ├── PermissionManagement.tsx # 权限管理组件
│   │   ├── PermissionManagement.css # 权限管理样式
│   │   ├── QRCodeScanner.tsx    # 二维码扫描组件
│   │   ├── QRCodeScanner.css    # 二维码扫描样式
│   │   ├── Settings.tsx         # 设置组件
│   │   ├── Settings.css         # 设置样式
│   │   ├── Sidebar.tsx          # 侧边栏组件
│   │   ├── Sidebar.css          # 侧边栏样式
│   │   ├── Sidebar_fixed.tsx    # 固定侧边栏组件
│   │   ├── Sidebar_new.tsx      # 新版侧边栏组件
│   │   ├── SiteManagement.tsx   # 站点管理组件
│   │   ├── SiteManagement.css   # 站点管理样式
│   │   ├── TransactionList.tsx  # 交易列表组件
│   │   ├── TransactionList.css  # 交易列表样式
│   │   ├── UserCenter.tsx       # 用户中心组件
│   │   ├── UserCenter.css       # 用户中心样式
│   │   ├── UserInfoManagement.tsx # 用户信息管理组件
│   │   ├── UserInfoManagement.css # 用户信息管理样式
│   │   ├── UserManagement.tsx   # 用户管理组件
│   │   └── UserManagement.css   # 用户管理样式
│   ├── hooks/                # 自定义 Hooks
│   │   └── useApi.ts         # API 钩子
│   ├── services/             # 服务层
│   │   ├── api.ts           # API 服务
│   │   └── mockApi.ts       # 模拟 API 服务
│   ├── types/               # 类型定义
│   │   └── api.ts          # API 类型定义
│   ├── utils/               # 工具函数
│   │   └── apiClient.ts    # API 客户端
│   ├── examples/            # 示例代码
│   ├── pages/               # 页面组件
│   ├── App.tsx             # 主应用组件
│   ├── App.css             # 主应用样式
│   ├── main.tsx            # 应用入口
│   ├── index.css           # 全局样式
│   └── vite-env.d.ts       # Vite 类型声明
├── china-cities-complete.json # 中国城市数据
├── eslint.config.js        # ESLint 配置
├── index.html              # HTML 模板
├── package.json            # 项目依赖和脚本
├── tsconfig.json           # TypeScript 配置
├── tsconfig.node.json      # Node.js TypeScript 配置
├── vite.config.ts          # Vite 配置
├── Dockerfile              # Docker 镜像配置
├── docker-compose.yml      # Docker Compose 配置
├── nginx.conf              # Nginx 配置
├── deploy.sh               # Linux 部署脚本
├── deploy.bat              # Windows 部署脚本
├── DEPLOY.md               # 部署文档
└── README.md               # 项目说明文档
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
