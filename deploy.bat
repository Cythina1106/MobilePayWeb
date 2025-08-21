@echo off
chcp 65001 > nul
echo 开始部署移动支付管理系统...

:: 检查 Node.js 是否安装
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 请先安装 Node.js
    pause
    exit /b 1
)

:: 安装依赖
echo 正在安装依赖...
npm install
if %errorlevel% neq 0 (
    echo 依赖安装失败
    pause
    exit /b 1
)

:: 构建项目
echo 正在构建项目...
npm run build
if %errorlevel% neq 0 (
    echo 构建失败
    pause
    exit /b 1
)

:: 检查构建结果
if exist "dist" (
    echo ✅ 构建成功！dist 文件夹已生成
    echo 📁 构建文件位置: %cd%\dist
    echo.
    echo 🚀 部署选项：
    echo 1. 本地预览: npm run preview
    echo 2. 上传 dist 文件夹到服务器
    echo 3. 使用 Docker 部署
    echo.
    echo 📋 测试账户：
    echo - 超级管理员: admin / admin123
    echo - 操作员: operator / op123
    echo - 查看员: viewer / view123
    echo.
    echo 是否要启动本地预览？ (y/n)
    set /p choice=
    if /i "%choice%"=="y" (
        echo 启动本地预览...
        npm run preview
    )
) else (
    echo ❌ 构建失败，请检查错误信息
)

pause
