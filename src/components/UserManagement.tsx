import { useState } from 'react'
import './UserManagement.css'

interface User {
  id: string
  name: string
  email: string
  phone: string
  status: '正常' | '冻结' | '待审核'
  registerDate: string
  lastLogin: string
  totalAmount: string
  transactionCount: number
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const users: User[] = [
    {
      id: 'U202407160001',
      name: '张三',
      email: 'zhangsan@example.com',
      phone: '138****1234',
      status: '正常',
      registerDate: '2025-01-15',
      lastLogin: '2025-07-16 14:30',
      totalAmount: '¥12,580.00',
      transactionCount: 45
    },
    {
      id: 'U202407160002',
      name: '李四',
      email: 'lisi@example.com',
      phone: '139****5678',
      status: '正常',
      registerDate: '2025-02-20',
      lastLogin: '2025-07-16 13:45',
      totalAmount: '¥8,920.00',
      transactionCount: 32
    },
    {
      id: 'U202407160003',
      name: '王五',
      email: 'wangwu@example.com',
      phone: '137****9012',
      status: '冻结',
      registerDate: '2025-03-10',
      lastLogin: '2025-07-15 16:20',
      totalAmount: '¥25,600.00',
      transactionCount: 78
    },
    {
      id: 'U202407160004',
      name: '赵六',
      email: 'zhaoliu@example.com',
      phone: '136****3456',
      status: '待审核',
      registerDate: '2025-07-16',
      lastLogin: '-',
      totalAmount: '¥0.00',
      transactionCount: 0
    }
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.includes(searchTerm) || 
                         user.email.includes(searchTerm) ||
                         user.phone.includes(searchTerm) ||
                         user.id.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleUserAction = (userId: string, action: string) => {
    alert(`对用户 ${userId} 执行操作: ${action}`)
  }

  return (
    <div className="user-management">
      <div className="user-header">
        <h2>用户管理</h2>
        <p>管理注册用户和账户状态</p>
      </div>

      <div className="user-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索用户名、邮箱或手机号..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">所有状态</option>
          <option value="正常">正常</option>
          <option value="冻结">冻结</option>
          <option value="待审核">待审核</option>
        </select>

        <button className="add-user-btn">+ 添加用户</button>
      </div>

      <div className="user-stats">
        <div className="stat-item">
          <span className="stat-label">总用户数</span>
          <span className="stat-value">{filteredUsers.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">正常用户</span>
          <span className="stat-value normal">
            {filteredUsers.filter(u => u.status === '正常').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">冻结用户</span>
          <span className="stat-value frozen">
            {filteredUsers.filter(u => u.status === '冻结').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">待审核</span>
          <span className="stat-value pending">
            {filteredUsers.filter(u => u.status === '待审核').length}
          </span>
        </div>
      </div>

      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>用户ID</th>
              <th>姓名</th>
              <th>邮箱</th>
              <th>手机号</th>
              <th>状态</th>
              <th>注册时间</th>
              <th>最后登录</th>
              <th>交易总额</th>
              <th>交易次数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="user-id">{user.id}</td>
                <td className="user-name">
                  <div className="user-avatar">👤</div>
                  {user.name}
                </td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <span className={`status ${user.status}`}>
                    <span className="status-dot"></span>
                    {user.status}
                  </span>
                </td>
                <td>{user.registerDate}</td>
                <td>{user.lastLogin}</td>
                <td className="total-amount">{user.totalAmount}</td>
                <td className="transaction-count">{user.transactionCount}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn view"
                      onClick={() => handleUserAction(user.id, '查看详情')}
                    >
                      查看
                    </button>
                    {user.status === '正常' ? (
                      <button 
                        className="action-btn freeze"
                        onClick={() => handleUserAction(user.id, '冻结账户')}
                      >
                        冻结
                      </button>
                    ) : user.status === '冻结' ? (
                      <button 
                        className="action-btn unfreeze"
                        onClick={() => handleUserAction(user.id, '解冻账户')}
                      >
                        解冻
                      </button>
                    ) : (
                      <button 
                        className="action-btn approve"
                        onClick={() => handleUserAction(user.id, '审核通过')}
                      >
                        审核
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserManagement
