import { useState, useEffect } from 'react'
import './App.css'
// import CardDemo from './pages/CardDemo'
import Login from './pages/Login.tsx'
import Sidebar from './layout/Sidebar'
import Dashboard from './pages/Dashboard.tsx'
import TransactionList from './pages/TransactionList.tsx'
import UserCenter from './pages/UserCenter.tsx'
import GateSystem from './pages/GateSystem.tsx'
import DiscountStrategy from './pages/DiscountStrategy.tsx'
import PermissionManagement from './pages/PermissionManagement.tsx'
import Settings from './pages/Settings.tsx'
import { authApi } from "./services/api.ts";
import { UserInfo } from './types/api'

type ActivePage = 'dashboard' | 'transactions' | 'userCenter' | 'discount' | 'gateSystem' | 'settings' | 'permissions' /*| 'cardDemo'*/

function App() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [activePage, setActivePage] = useState<ActivePage>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  // 简化：只检查token是否存在，并从缓存获取用户信息
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token')
      if (token) {
        console.log('✅ 发现本地token，用户已登录')

        // 尝试从缓存获取用户信息
        const cachedUserInfo = localStorage.getItem('user_info')
        let userInfo = null

        if (cachedUserInfo) {
          try {
            userInfo = JSON.parse(cachedUserInfo)
            console.log('📦 从缓存获取用户信息:', userInfo)
          } catch (error) {
            console.log('❌ 缓存用户信息解析失败:', error)
          }
        }

        // 如果没有缓存信息，使用默认信息
        if (!userInfo) {
          userInfo = {
            id: '1',
            username: 'admin',
            name: '管理员',
            role: 'admin',
            roleName: '管理员',
            status: 'active',
            createTime: new Date().toISOString(),
            permissions: ['dashboard', 'transactions', 'users', 'settings', 'permissions']
          }
        }

        // 确保权限数组存在（用于菜单显示）
        if (!userInfo.permissions || userInfo.permissions.length === 0) {
          userInfo.permissions = ['dashboard', 'transactions', 'users', 'settings', 'permissions']
        }

        setUser(userInfo as UserInfo)
      } else {
        console.log('ℹ️ 未发现本地token，需要登录')
      }
      setIsInitializing(false)
    }

    checkAuthStatus()
  }, [])

  const handleLogin = (userInfo: UserInfo) => {
    setUser(userInfo)
    // 将用户信息存储到localStorage
    localStorage.setItem('user_info', JSON.stringify(userInfo))
    console.log('✅ 用户登录成功，用户信息已存储到localStorage:', userInfo)
  }

  const handleLogout = async () => {
    try {
      // 调用退出登录接口
      await authApi.logout()
    } catch (error) {
      console.error('退出登录接口调用失败:', error)
    } finally {
      // 无论接口调用是否成功，都清除本地状态和存储
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_info')
      console.log('🚪 已清除本地token和用户信息')
      setUser(null)
      setActivePage('dashboard')
    }
  }

  // 简化：只检查用户是否已登录，不检查具体权限
  const isLoggedIn = () => {
    return !!user && !!localStorage.getItem('token')
  }

  const handlePageChange = (page: ActivePage) => {
    // 简化：只要已登录就可以访问所有页面
    if (isLoggedIn()) {
      setActivePage(page)
    } else {
      alert('请先登录')
    }
  }

  const renderContent = () => {
    // 简化：移除权限检查，直接渲染对应组件
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />
      case 'transactions':
        return <TransactionList />
      case 'userCenter':
        return <UserCenter />
      case 'discount':
        return <DiscountStrategy />
      case 'gateSystem':
        return <GateSystem />
      case 'settings':
        return <Settings />
      case 'permissions':
        return <PermissionManagement />
      /*case 'cardDemo':
        return <CardDemo />*/
      default:
        return <Dashboard />
    }
  }

  // 如果正在初始化，显示加载状态
  if (isInitializing) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        正在检查登录状态...
      </div>
    )
  }

  // 如果没有登录，显示登录页面
  if (!user) {
    console.log('❌ 用户未登录，显示登录页面')
    return <Login onLogin={handleLogin} />
  }

  console.log('✅ 用户已登录，渲染主界面:', {
    user: { id: user.id, username: user.username, permissions: user.permissions },
    activePage
  })

  return (
    <div className="admin-app">
      <Sidebar
        activePage={activePage}
        onPageChange={handlePageChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userPermissions={user.permissions}
      />
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="top-header">
          <h1>移动支付后台管理系统</h1>
          <div className="user-info">
             {/* <span>{user.name} ({user.role === 'super_admin' ? '管理员' :user.role == 'operator' ? '操作员' : user.role == 'viewer' ? '查看员' : ''})</span> */}
            <span>{user.name}</span>
            <div className="avatar">👤</div>
            <button className="logout-btn" onClick={handleLogout}>
              退出登录
            </button>
          </div>
        </header>
        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App
