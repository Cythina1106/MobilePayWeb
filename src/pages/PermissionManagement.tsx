import { useState } from 'react'
import '../styles/PermissionManagement.css'
import Card from '../components/Common/Card.tsx';

interface Permission {
  id: string
  name: string
  description: string
  module: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
}

interface User {
  id: string
  username: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  lastLogin: string
}

const PermissionManagement = () => {

  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'permissions'>('roles')

  const permissions: Permission[] = [
    { id: 'dashboard_view', name: '查看仪表盘', description: '可以查看数据概览和统计信息', module: '仪表盘' },
    { id: 'dashboard_export', name: '导出仪表盘数据', description: '可以导出仪表盘数据报表', module: '仪表盘' },
    { id: 'transaction_view', name: '查看交易', description: '可以查看所有交易记录', module: '交易管理' },
    { id: 'transaction_manage', name: '管理交易', description: '可以处理交易、退款等操作', module: '交易管理' },
    { id: 'transaction_export', name: '导出交易数据', description: '可以导出交易数据报表', module: '交易管理' },
    { id: 'user_view', name: '查看用户', description: '可以查看用户信息和列表', module: '用户管理' },
    { id: 'user_manage', name: '管理用户', description: '可以冻结、解冻用户账户', module: '用户管理' },
    { id: 'user_create', name: '创建用户', description: '可以创建新的用户账户', module: '用户管理' },
    { id: 'settings_view', name: '查看设置', description: '可以查看系统设置信息', module: '系统设置' },
    { id: 'settings_manage', name: '管理设置', description: '可以修改系统参数和配置', module: '系统设置' },
    { id: 'permission_view', name: '查看权限', description: '可以查看角色和权限信息', module: '权限管理' },
    { id: 'permission_manage', name: '管理权限', description: '可以分配和修改用户角色权限', module: '权限管理' }
  ]

  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: '超级管理员',
      description: '拥有系统所有权限',
      permissions: permissions.map(p => p.id),
      userCount: 1
    },
    {
      id: '2',
      name: '操作员',
      description: '可以处理日常业务操作',
      permissions: ['dashboard_view', 'transaction_view', 'transaction_manage', 'user_view', 'user_manage'],
      userCount: 3
    },
    {
      id: '3',
      name: '查看员',
      description: '只能查看数据，无操作权限',
      permissions: ['dashboard_view', 'transaction_view', 'user_view'],
      userCount: 5
    }
  ])

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      name: '系统管理员',
      email: 'admin@example.com',
      role: '1',
      status: 'active',
      lastLogin: '2025-07-17 09:30'
    },
    {
      id: '2',
      username: 'operator1',
      name: '操作员一',
      email: 'op1@example.com',
      role: '2',
      status: 'active',
      lastLogin: '2025-07-17 08:45'
    },
    {
      id: '3',
      username: 'operator2',
      name: '操作员二',
      email: 'op2@example.com',
      role: '2',
      status: 'active',
      lastLogin: '2025-07-16 18:20'
    },
    {
      id: '4',
      username: 'viewer1',
      name: '查看员一',
      email: 'view1@example.com',
      role: '3',
      status: 'active',
      lastLogin: '2025-07-17 07:15'
    },
    {
      id: '5',
      username: 'viewer2',
      name: '查看员二',
      email: 'view2@example.com',
      role: '3',
      status: 'inactive',
      lastLogin: '2025-07-15 16:30'
    }
  ])

  const handleRolePermissionChange = (roleId: string, permissionId: string, checked: boolean) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const newPermissions = checked
          ? [...role.permissions, permissionId]
          : role.permissions.filter(p => p !== permissionId)
        return { ...role, permissions: newPermissions }
      }
      return role
    }))
  }

  const handleUserRoleChange = (userId: string, newRoleId: string) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, role: newRoleId } : user
    ))
  }

  const handleUserStatusChange = (userId: string, newStatus: 'active' | 'inactive') => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ))
  }

  const renderRolesTab = () => (
    <div className="roles-section">
      <div className="section-header">
        <h3>角色管理</h3>
        <button className="add-btn">
          + 添加角色
        </button>
      </div>

      <div className="roles-grid">
        {roles.map(role => (
          <Card key={role.id} variant="role" className="role-card">
            <div className="role-header">
              <h4>{role.name}</h4>
              <span className="user-count">{role.userCount} 个用户</span>
            </div>
            <p className="role-description">{role.description}</p>

            <div className="permissions-section">
              <h5>权限列表</h5>
              <div className="permissions-grid">
                {permissions.map(permission => (
                  <label key={permission.id} className="permission-item">
                    <input
                      type="checkbox"
                      checked={role.permissions.includes(permission.id)}
                      onChange={(e) => handleRolePermissionChange(role.id, permission.id, e.target.checked)}
                    />
                    <span className="permission-name">{permission.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="role-actions">
              <button className="edit-btn">编辑</button>
              <button className="delete-btn">删除</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderUsersTab = () => (
    <div className="users-section">
      <div className="section-header">
        <h3>用户管理</h3>
        <button className="add-btn">
          + 添加用户
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>用户名</th>
              <th>姓名</th>
              <th>邮箱</th>
              <th>角色</th>
              <th>状态</th>
              <th>最后登录</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                    className="role-select"
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <span className={`status ${user.status}`}>
                    <span className="status-dot"></span>
                    {user.status === 'active' ? '正常' : '停用'}
                  </span>
                </td>
                <td>{user.lastLogin}</td>
                <td>
                  <div className="user-actions">
                    <button className="action-btn edit">编辑</button>
                    <button
                      className={`action-btn ${user.status === 'active' ? 'disable' : 'enable'}`}
                      onClick={() => handleUserStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}
                    >
                      {user.status === 'active' ? '停用' : '启用'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderPermissionsTab = () => (
    <div className="permissions-section">
      <div className="section-header">
        <h3>权限列表</h3>
        <button className="add-btn">+ 添加权限</button>
      </div>

      <div className="permissions-table-container">
        <table className="permissions-table">
          <thead>
            <tr>
              <th>权限名称</th>
              <th>所属模块</th>
              <th>描述</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map(permission => (
              <tr key={permission.id}>
                <td className="permission-name">{permission.name}</td>
                <td>
                  <span className="module-tag">{permission.module}</span>
                </td>
                <td>{permission.description}</td>
                <td>
                  <div className="permission-actions">
                    <button className="action-btn edit">编辑</button>
                    <button className="action-btn delete">删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="permission-management">
      <div className="permission-header">
        <h2>权限管理</h2>
        <p>管理系统角色、用户权限和访问控制</p>
      </div>

      <div className="permission-tabs">
        <button
          className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          角色管理
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          用户管理
        </button>
        <button
          className={`tab-btn ${activeTab === 'permissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('permissions')}
        >
          权限列表
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'roles' && renderRolesTab()}
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'permissions' && renderPermissionsTab()}
      </div>
    </div>
  )
}

export default PermissionManagement
