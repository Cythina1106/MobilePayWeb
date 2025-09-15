# 移动支付管理系统部署指南

## 🚀 快速部署

### 方式一：一键部署（推荐）

**Windows 用户：**
```bash
# 双击运行
deploy.bat
```

**Linux/Mac 用户：**
```bash
# 给脚本执行权限
chmod +x deploy.sh
# 运行部署脚本
./deploy.sh
```

### 方式二：手动部署

```bash
# 1. 安装依赖
npm install

# 2. 构建项目
npm run build

# 3. 预览构建结果
npm run preview
```

## 🌐 部署到服务器

### 1. 静态文件部署

构建完成后，将 `dist` 文件夹上传到服务器：

```bash
# 上传到服务器
scp -r dist/* user@server:/var/www/html/

# 或使用 FTP 工具上传 dist 文件夹内容
```

### 2. Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

### 3. Docker 部署

```bash
# 构建镜像
docker build -t mobile-pay-web .

# 运行容器
docker run -d -p 80:80 --name mobile-pay-web mobile-pay-web

# 或使用 Docker Compose
docker-compose up -d
```

## 🔧 环境要求

- Node.js 16+
- npm 或 yarn
- 现代浏览器（Chrome、Firefox、Safari、Edge）

## 🔐 测试账户

| 角色 | 用户名 | 密码 | 权限 |
|------|--------|------|------|
| 超级管理员 | admin | admin123 | 完全访问权限 |
| 操作员 | operator | op123 | 交易管理权限 |
| 查看员 | viewer | view123 | 仅查看权限 |

## 🌍 访问地址

- **开发环境**: http://localhost:5173
- **预览环境**: http://localhost:4173
- **生产环境**: 根据部署配置

## 📱 功能特性

- ✅ 响应式设计，支持移动端
- ✅ 多角色权限管理
- ✅ 实时数据统计
- ✅ 交易记录管理
- ✅ 用户账户管理
- ✅ 系统设置配置

## 🛠️ 自定义配置

### 修改标题和图标

编辑 `index.html`：
```html
<title>您的系统名称</title>
<link rel="icon" href="/your-icon.ico" />
```

### 修改主题色

编辑相应的 CSS 文件，查找颜色值：
- 主色调：`#3b82f6`（蓝色）
- 背景色：`#ffffff`（白色）

## 🔍 故障排除

### 构建失败
```bash
# 清除缓存
npm run build --force

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### 端口占用
```bash
# 查看端口占用
netstat -ano | findstr :5173

# 或使用其他端口
npm run dev -- --port 3000
```

## 📞 技术支持

如遇到问题，请检查：
1. Node.js 版本是否正确
2. 依赖是否完整安装
3. 浏览器是否支持现代 JavaScript
4. 网络连接是否正常

## 🔄 更新部署

```bash
# 拉取最新代码
git pull origin main

# 重新构建
npm run build

# 更新部署
# 重新上传 dist 文件夹或重启容器
```
