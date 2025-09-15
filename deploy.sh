#!/bin/bash

# 移动支付管理系统部署脚本
echo "开始部署移动支付管理系统..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "错误: 请先安装 Node.js"
    exit 1
fi

# 安装依赖
echo "正在安装依赖..."
npm install

# 构建项目
echo "正在构建项目..."
npm run build

# 检查构建是否成功
if [ -d "dist" ]; then
    echo "✅ 构建成功！dist 文件夹已生成"
    echo "📁 构建文件位置: $(pwd)/dist"
    echo ""
    echo "🚀 部署选项："
    echo "1. 本地预览: npm run preview"
    echo "2. 上传 dist 文件夹到服务器"
    echo "3. 使用 Docker 部署"
    echo ""
    echo "📋 测试账户："
    echo "- 超级管理员: admin / admin123"
    echo "- 操作员: operator / op123"
    echo "- 查看员: viewer / view123"
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi
