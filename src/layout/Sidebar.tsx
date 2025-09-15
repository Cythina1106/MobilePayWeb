import '../styles/Sidebar.css'

interface SidebarProps {
  activePage: string
  onPageChange: (page: 'dashboard' | 'transactions' | 'userCenter' | 'discount' | 'gateSystem' | 'settings' | 'permissions' | 'cardDemo') => void
  collapsed: boolean
  onToggleCollapse: () => void
  userPermissions: string[]
}

const Sidebar = ({ activePage, onPageChange, collapsed, onToggleCollapse, userPermissions }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: '仪表盘', icon: '仪表盘.svg', permission: 'dashboard' },
    { id: 'transactions', label: '交易管理', icon: '交易管理.svg', permission: 'transactions' },
    { id: 'userCenter', label: '用户中心', icon: '用户中心.svg', permission: 'users' },
    { id: 'discount', label: '折扣策略管理', icon: '折扣策略管理.svg', permission: 'settings' },
    { id: 'gateSystem', label: '闸机系统', icon: '闸机系统.svg', permission: 'settings' },
    // { id: 'cardDemo', label: '卡片演示', icon: '交易笔款.svg', permission: 'settings' }
    // { id: 'permissions', label: '权限管理', icon: '🔐', permission: 'permissions' },
    // { id: 'settings', label: '系统设置', icon: '⚙️', permission: 'settings' },
  ]

  // 简化：不再过滤权限，显示所有菜单项
  const filteredMenuItems = menuItems

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <img src="/移动支付.svg" alt="logo" width={30} height={30}/>
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
              <img src={`/${item.icon}`} alt={item.label} width={25} height={25} className="svg-background-color"/>
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
