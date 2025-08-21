import './Sidebar.css'

interface SidebarProps {
  activePage: string
  onPageChange: (page: 'dashboard' | 'transactions' | 'userCenter' | 'discount' | 'gateSystem' | 'paymentMethods' | 'settings' | 'permissions') => void
  collapsed: boolean
  onToggleCollapse: () => void
  userPermissions: string[]
}

const Sidebar = ({ activePage, onPageChange, collapsed, onToggleCollapse, userPermissions }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: '仪表盘', icon: '📊', permission: 'dashboard' },
    { id: 'transactions', label: '交易管理', icon: '💳', permission: 'transactions' },
    { id: 'paymentMethods', label: '支付方式', icon: '💰', permission: 'transactions' },
    { id: 'userCenter', label: '用户中心', icon: '👥', permission: 'users' },
    { id: 'discount', label: '折扣策略管理', icon: '🎫', permission: 'settings' },
    { id: 'gateSystem', label: '闸机系统', icon: '🚪', permission: 'settings' },
    { id: 'permissions', label: '权限管理', icon: '🔐', permission: 'permissions' },
    { id: 'settings', label: '系统设置', icon: '⚙️', permission: 'settings' },
  ]

  // 过滤用户有权限的菜单项
  const filteredMenuItems = menuItems.filter(item => 
    userPermissions.includes(item.permission)
  )

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">💰</span>
          {!collapsed && <span className="logo-text">支付管理</span>}
        </div>
        <button className="collapse-btn" onClick={onToggleCollapse}>
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {filteredMenuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onPageChange(item.id as any)}
            title={collapsed ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
