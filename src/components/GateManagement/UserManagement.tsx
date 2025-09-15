import React, { useState } from 'react'
import Modal from '../Common/Modal.tsx'

interface GateUser {
  id: string
  cardNumber: string
  name: string
  phone: string
  email: string
  role: 'admin' | 'manager' | 'operator' | 'viewer'
  status: 'active' | 'inactive' | 'suspended'
  accessLevel: 'all' | 'station' | 'line'
  accessStations: string[]
  accessLines: string[]
  createdTime: string
  lastLogin: string
  lastUpdated: string
  lastUpdatedBy: string
}

interface UserManagementProps {
  gateUsers: GateUser[]
  filteredUsers: GateUser[]
  currentPage: number
  totalPages: number
  pageSize: number
  availableRoles: string[]
  searchTerm: string
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onResetFilters: () => void
  onSaveUser: (user: Partial<GateUser>, isEdit: boolean) => void
  onDeleteUser: (userId: string) => void
  onChangeUserStatus: (userId: string, status: 'active' | 'inactive' | 'suspended') => void
}

const UserManagement: React.FC<UserManagementProps> = ({
  gateUsers,
  filteredUsers,
  currentPage,
  totalPages,
  pageSize,
  availableRoles,
  searchTerm,
  onSearch,
  onPageChange,
  onPageSizeChange,
  onResetFilters,
  onSaveUser,
  onDeleteUser,
  onChangeUserStatus
}) => {
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<GateUser | null>(null)
  const [userForm, setUserForm] = useState<Partial<GateUser>>({
    cardNumber: '',
    name: '',
    phone: '',
    email: '',
    role: 'operator',
    status: 'active',
    accessLevel: 'station',
    accessStations: [],
    accessLines: []
  })

  const handleUserEdit = (user: GateUser) => {
    setEditingUser(user)
    setUserForm(user)
    setShowUserModal(true)
  }

  const handleUserSave = () => {
    if (!userForm.cardNumber || !userForm.name || !userForm.phone) {
      alert('请填写必填字段（卡号、姓名、手机号）')
      return
    }

    onSaveUser(userForm, !!editingUser)
    setShowUserModal(false)
    setEditingUser(null)
    setUserForm({
      cardNumber: '',
      name: '',
      phone: '',
      email: '',
      role: 'operator',
      status: 'active',
      accessLevel: 'station',
      accessStations: [],
      accessLines: []
    })
  }

  const handleCancel = () => {
    setShowUserModal(false)
    setEditingUser(null)
    setUserForm({
      cardNumber: '',
      name: '',
      phone: '',
      email: '',
      role: 'operator',
      status: 'active',
      accessLevel: 'station',
      accessStations: [],
      accessLines: []
    })
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return '系统管理员'
      case 'manager':
        return '部门经理'
      case 'operator':
        return '操作员'
      case 'viewer':
        return '查看者'
      default:
        return role
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '活跃'
      case 'inactive':
        return '禁用'
      case 'suspended':
        return '暂停'
      default:
        return status
    }
  }

  const getAccessLevelText = (level: string) => {
    switch (level) {
      case 'all':
        return '全部'
      case 'station':
        return '站点'
      case 'line':
        return '线路'
      default:
        return level
    }
  }

  return (
    <div className="users-section">
      <div className="section-header">
        <h3>用户管理</h3>
        <div className="header-actions">
          <input
            type="text"
            placeholder="搜索卡号、姓名、手机号或邮箱"
            value={searchTerm}
            onChange={onSearch}
            className="search-input"
          />
          <button className="create-btn" onClick={() => setShowUserModal(true)}>
            + 添加用户
          </button>
        </div>
      </div>

      {/* 筛选条件 */}
      <div className="filter-section">
        <div className="filter-row">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="page-size-select"
          >
            <option value={5}>每页 5 条</option>
            <option value={10}>每页 10 条</option>
            <option value={20}>每页 20 条</option>
            <option value={50}>每页 50 条</option>
          </select>

          <button
            className="reset-filters-btn"
            onClick={onResetFilters}
            title="清除所有筛选条件"
          >
            重置筛选
          </button>
        </div>

        <div className="results-info">
          共找到 {filteredUsers.length} 个用户，按创建时间排序
        </div>
      </div>

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>卡号</th>
              <th>姓名</th>
              <th>手机号</th>
              <th>邮箱</th>
              <th>角色</th>
              <th>状态</th>
              <th>访问权限</th>
              <th>最后登录</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="user-row">
                <td className="user-card-number">{user.cardNumber}</td>
                <td className="user-name">{user.name}</td>
                <td className="user-phone">{user.phone}</td>
                <td className="user-email">{user.email}</td>
                <td className={`user-role ${user.role}`}>
                  {getRoleText(user.role)}
                </td>
                <td className={`user-status ${user.status}`}>
                  <span className="status-dot"></span>
                  <select
                    value={user.status}
                    onChange={(e) => onChangeUserStatus(user.id, e.target.value as any)}
                    className="status-select"
                  >
                    <option value="active">活跃</option>
                    <option value="inactive">禁用</option>
                    <option value="suspended">暂停</option>
                  </select>
                </td>
                <td className="user-access-level">
                  {getAccessLevelText(user.accessLevel)}
                </td>
                <td className="user-last-login">
                  {user.lastLogin ? user.lastLogin : '从未登录'}
                </td>
                <td className="user-created-time">{user.createdTime}</td>
                <td className="user-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => handleUserEdit(user)}
                    title="编辑"
                  >
                    编辑
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => onDeleteUser(user.id)}
                    title="删除"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            上一页
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            下一页
          </button>

          <span className="page-info">
            第 {currentPage} 页，共 {totalPages} 页
          </span>
        </div>
      )}

      {/* 用户模态框 */}
      {showUserModal && (
        <Modal
          isOpen={showUserModal}
          onClose={handleCancel}
          title={editingUser ? '编辑用户' : '添加用户'}
          className="user-modal"
        >
          <div className="form-container">
            <div className="form-grid">
              <div className="form-group">
                <label>卡号 *</label>
                <input
                  type="text"
                  value={userForm.cardNumber || ''}
                  onChange={(e) => setUserForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                  placeholder="请输入卡号"
                />
              </div>
              <div className="form-group">
                <label>姓名 *</label>
                <input
                  type="text"
                  value={userForm.name || ''}
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="请输入姓名"
                />
              </div>
              <div className="form-group">
                <label>手机号 *</label>
                <input
                  type="text"
                  value={userForm.phone || ''}
                  onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="请输入手机号"
                />
              </div>
              <div className="form-group">
                <label>邮箱</label>
                <input
                  type="email"
                  value={userForm.email || ''}
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="请输入邮箱"
                />
              </div>
              <div className="form-group">
                <label>角色</label>
                <select
                  value={userForm.role || 'operator'}
                  onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value as any }))}
                >
                  <option value="admin">系统管理员</option>
                  <option value="manager">部门经理</option>
                  <option value="operator">操作员</option>
                  <option value="viewer">查看者</option>
                </select>
              </div>
              <div className="form-group">
                <label>状态</label>
                <select
                  value={userForm.status || 'active'}
                  onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value as any }))}
                >
                  <option value="active">活跃</option>
                  <option value="inactive">禁用</option>
                  <option value="suspended">暂停</option>
                </select>
              </div>
              <div className="form-group">
                <label>访问权限</label>
                <select
                  value={userForm.accessLevel || 'station'}
                  onChange={(e) => setUserForm(prev => ({ ...prev, accessLevel: e.target.value as any }))}
                >
                  <option value="all">全部</option>
                  <option value="station">站点</option>
                  <option value="line">线路</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="cancel-btn" onClick={handleCancel}>
              取消
            </button>
            <button className="save-btn" onClick={handleUserSave}>
              {editingUser ? '保存修改' : '添加用户'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default UserManagement
