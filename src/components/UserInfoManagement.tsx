import { useState } from 'react'
import './UserInfoManagement.css'

interface UserInfo {
  id: string
  username: string
  realName: string
  phone: string
  email: string
  idCard: string
  bankCard: string
  registrationTime: string
  status: 'active' | 'inactive' | 'pending' | 'rejected' | 'frozen'
  verificationStatus: 'verified' | 'unverified' | 'pending'
  lastLoginTime: string
  totalTransactions: number
  totalAmount: string
  riskLevel: 'low' | 'medium' | 'high'
}

interface PendingUser {
  id: string
  username: string
  realName: string
  phone: string
  email: string
  idCard: string
  bankCard: string
  idCardFront: string
  idCardBack: string
  applicationTime: string
  applicationReason: string
  reviewStatus: 'pending' | 'approved' | 'rejected'
  reviewTime?: string
  reviewReason?: string
}

const UserInfoManagement = () => {
  const [activeTab, setActiveTab] = useState<'userList' | 'userAudit' | 'userStatus'>('userList')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [selectedPendingUser, setSelectedPendingUser] = useState<PendingUser | null>(null)

  // 用户信息列表
  const [users, setUsers] = useState<UserInfo[]>([
    {
      id: '1',
      username: 'user001',
      realName: '张三',
      phone: '13812345678',
      email: 'zhangsan@example.com',
      idCard: '110101199001011234',
      bankCard: '6226*********1234',
      registrationTime: '2024-01-15 10:30',
      status: 'active',
      verificationStatus: 'verified',
      lastLoginTime: '2025-07-17 09:30',
      totalTransactions: 156,
      totalAmount: '¥45,678.90',
      riskLevel: 'low'
    },
    {
      id: '2',
      username: 'user002',
      realName: '李四',
      phone: '13987654321',
      email: 'lisi@example.com',
      idCard: '110101199002021234',
      bankCard: '6228*********5678',
      registrationTime: '2024-02-20 14:20',
      status: 'active',
      verificationStatus: 'verified',
      lastLoginTime: '2025-07-16 18:45',
      totalTransactions: 89,
      totalAmount: '¥23,456.78',
      riskLevel: 'low'
    },
    {
      id: '3',
      username: 'user003',
      realName: '王五',
      phone: '13756789012',
      email: 'wangwu@example.com',
      idCard: '110101199003031234',
      bankCard: '6229*********9012',
      registrationTime: '2024-03-10 16:15',
      status: 'frozen',
      verificationStatus: 'verified',
      lastLoginTime: '2025-07-10 12:20',
      totalTransactions: 234,
      totalAmount: '¥67,890.12',
      riskLevel: 'high'
    },
    {
      id: '4',
      username: 'user004',
      realName: '赵六',
      phone: '13645678901',
      email: 'zhaoliu@example.com',
      idCard: '110101199004041234',
      bankCard: '6230*********3456',
      registrationTime: '2024-04-05 11:30',
      status: 'inactive',
      verificationStatus: 'unverified',
      lastLoginTime: '2025-07-05 15:10',
      totalTransactions: 12,
      totalAmount: '¥1,234.56',
      riskLevel: 'medium'
    }
  ])

  // 待审核用户列表
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([
    {
      id: 'p1',
      username: 'newuser001',
      realName: '孙七',
      phone: '13534567890',
      email: 'sunqi@example.com',
      idCard: '110101199005051234',
      bankCard: '6231*********7890',
      idCardFront: '/images/idcard-front-1.jpg',
      idCardBack: '/images/idcard-back-1.jpg',
      applicationTime: '2025-07-16 10:20',
      applicationReason: '个人消费支付需求',
      reviewStatus: 'pending'
    },
    {
      id: 'p2',
      username: 'newuser002',
      realName: '周八',
      phone: '13423456789',
      email: 'zhouba@example.com',
      idCard: '110101199006061234',
      bankCard: '6232*********4567',
      idCardFront: '/images/idcard-front-2.jpg',
      idCardBack: '/images/idcard-back-2.jpg',
      applicationTime: '2025-07-15 15:45',
      applicationReason: '商户收款需求',
      reviewStatus: 'pending'
    },
    {
      id: 'p3',
      username: 'newuser003',
      realName: '吴九',
      phone: '13312345678',
      email: 'wujiu@example.com',
      idCard: '110101199007071234',
      bankCard: '6233*********8901',
      idCardFront: '/images/idcard-front-3.jpg',
      idCardBack: '/images/idcard-back-3.jpg',
      applicationTime: '2025-07-14 09:30',
      applicationReason: '个人转账需求',
      reviewStatus: 'approved',
      reviewTime: '2025-07-15 10:20',
      reviewReason: '资料齐全，审核通过'
    }
  ])

  // 过滤用户列表
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.realName.includes(searchTerm) || 
                         user.username.includes(searchTerm) || 
                         user.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // 处理用户状态变更
  const handleUserStatusChange = (userId: string, newStatus: 'active' | 'inactive' | 'frozen') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ))
  }

  // 处理用户审核
  const handleUserAudit = (userId: string, action: 'approve' | 'reject', reason: string) => {
    setPendingUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          reviewStatus: action === 'approve' ? 'approved' : 'rejected',
          reviewTime: new Date().toLocaleString('zh-CN'),
          reviewReason: reason
        }
      }
      return user
    }))

    // 如果审核通过，添加到正式用户列表
    if (action === 'approve') {
      const approvedUser = pendingUsers.find(u => u.id === userId)
      if (approvedUser) {
        const newUser: UserInfo = {
          id: Date.now().toString(),
          username: approvedUser.username,
          realName: approvedUser.realName,
          phone: approvedUser.phone,
          email: approvedUser.email,
          idCard: approvedUser.idCard,
          bankCard: approvedUser.bankCard,
          registrationTime: new Date().toLocaleString('zh-CN'),
          status: 'active',
          verificationStatus: 'verified',
          lastLoginTime: '从未登录',
          totalTransactions: 0,
          totalAmount: '¥0.00',
          riskLevel: 'low'
        }
        setUsers(prev => [...prev, newUser])
      }
    }
    setShowAuditModal(false)
    setSelectedPendingUser(null)
  }

  // 查看用户详情
  const handleViewUser = (user: UserInfo) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  // 审核用户
  const handleAuditUser = (user: PendingUser) => {
    setSelectedPendingUser(user)
    setShowAuditModal(true)
  }

  // 用户列表页面
  const renderUserList = () => (
    <div className="user-list-section">
      <div className="section-header">
        <h3>用户信息管理</h3>
        <div className="header-actions">
          <div className="search-group">
            <input
              type="text"
              placeholder="搜索用户姓名、用户名或手机号"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">全部状态</option>
            <option value="active">正常</option>
            <option value="inactive">停用</option>
            <option value="frozen">冻结</option>
          </select>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>用户名</th>
              <th>真实姓名</th>
              <th>手机号</th>
              <th>邮箱</th>
              <th>注册时间</th>
              <th>账户状态</th>
              <th>认证状态</th>
              <th>风险等级</th>
              <th>最后登录</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.realName}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{user.registrationTime}</td>
                <td>
                  <span className={`status ${user.status}`}>
                    <span className="status-dot"></span>
                    {user.status === 'active' ? '正常' : 
                     user.status === 'inactive' ? '停用' : '冻结'}
                  </span>
                </td>
                <td>
                  <span className={`verification ${user.verificationStatus}`}>
                    {user.verificationStatus === 'verified' ? '已认证' : 
                     user.verificationStatus === 'unverified' ? '未认证' : '待认证'}
                  </span>
                </td>
                <td>
                  <span className={`risk-level ${user.riskLevel}`}>
                    {user.riskLevel === 'low' ? '低' : 
                     user.riskLevel === 'medium' ? '中' : '高'}
                  </span>
                </td>
                <td>{user.lastLoginTime}</td>
                <td>
                  <div className="user-actions">
                    <button 
                      className="action-btn view"
                      onClick={() => handleViewUser(user)}
                    >
                      查看
                    </button>
                    {user.status === 'active' && (
                      <button 
                        className="action-btn freeze"
                        onClick={() => handleUserStatusChange(user.id, 'frozen')}
                      >
                        冻结
                      </button>
                    )}
                    {user.status === 'frozen' && (
                      <button 
                        className="action-btn activate"
                        onClick={() => handleUserStatusChange(user.id, 'active')}
                      >
                        解冻
                      </button>
                    )}
                    {user.status !== 'inactive' && (
                      <button 
                        className="action-btn disable"
                        onClick={() => handleUserStatusChange(user.id, 'inactive')}
                      >
                        停用
                      </button>
                    )}
                    {user.status === 'inactive' && (
                      <button 
                        className="action-btn activate"
                        onClick={() => handleUserStatusChange(user.id, 'active')}
                      >
                        启用
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

  // 用户审核页面
  const renderUserAudit = () => (
    <div className="user-audit-section">
      <div className="section-header">
        <h3>用户账号审核</h3>
        <div className="audit-stats">
          <div className="stat-item">
            <span className="stat-label">待审核</span>
            <span className="stat-value">
              {pendingUsers.filter(u => u.reviewStatus === 'pending').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">已通过</span>
            <span className="stat-value">
              {pendingUsers.filter(u => u.reviewStatus === 'approved').length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">已驳回</span>
            <span className="stat-value">
              {pendingUsers.filter(u => u.reviewStatus === 'rejected').length}
            </span>
          </div>
        </div>
      </div>

      <div className="audit-table-container">
        <table className="audit-table">
          <thead>
            <tr>
              <th>申请用户名</th>
              <th>真实姓名</th>
              <th>手机号</th>
              <th>身份证号</th>
              <th>申请时间</th>
              <th>申请原因</th>
              <th>审核状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.realName}</td>
                <td>{user.phone}</td>
                <td>{user.idCard}</td>
                <td>{user.applicationTime}</td>
                <td>{user.applicationReason}</td>
                <td>
                  <span className={`review-status ${user.reviewStatus}`}>
                    {user.reviewStatus === 'pending' ? '待审核' : 
                     user.reviewStatus === 'approved' ? '已通过' : '已驳回'}
                  </span>
                </td>
                <td>
                  <div className="audit-actions">
                    <button 
                      className="action-btn view"
                      onClick={() => handleAuditUser(user)}
                    >
                      审核
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

  // 用户状态管理页面
  const renderUserStatus = () => (
    <div className="user-status-section">
      <div className="section-header">
        <h3>用户状态统计</h3>
      </div>

      <div className="status-overview">
        <div className="status-card active">
          <div className="status-icon">✅</div>
          <div className="status-info">
            <h4>正常用户</h4>
            <div className="status-count">{users.filter(u => u.status === 'active').length}</div>
            <div className="status-desc">账户正常使用中</div>
          </div>
        </div>

        <div className="status-card inactive">
          <div className="status-icon">❌</div>
          <div className="status-info">
            <h4>停用用户</h4>
            <div className="status-count">{users.filter(u => u.status === 'inactive').length}</div>
            <div className="status-desc">账户已被停用</div>
          </div>
        </div>

        <div className="status-card frozen">
          <div className="status-icon">🧊</div>
          <div className="status-info">
            <h4>冻结用户</h4>
            <div className="status-count">{users.filter(u => u.status === 'frozen').length}</div>
            <div className="status-desc">账户被临时冻结</div>
          </div>
        </div>

        <div className="status-card risk">
          <div className="status-icon">⚠️</div>
          <div className="status-info">
            <h4>高风险用户</h4>
            <div className="status-count">{users.filter(u => u.riskLevel === 'high').length}</div>
            <div className="status-desc">需要重点关注</div>
          </div>
        </div>
      </div>

      <div className="status-actions-panel">
        <h4>批量操作</h4>
        <div className="batch-actions">
          <button className="batch-btn freeze">批量冻结高风险用户</button>
          <button className="batch-btn activate">批量激活正常用户</button>
          <button className="batch-btn export">导出用户状态报表</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="user-info-management">
      <div className="management-header">
        <h2>用户信息管理</h2>
        <p>管理用户注册信息、账号审核和状态控制</p>
      </div>

      <div className="management-tabs">
        <button 
          className={`tab-btn ${activeTab === 'userList' ? 'active' : ''}`}
          onClick={() => setActiveTab('userList')}
        >
          用户列表
        </button>
        <button 
          className={`tab-btn ${activeTab === 'userAudit' ? 'active' : ''}`}
          onClick={() => setActiveTab('userAudit')}
        >
          账号审核
        </button>
        <button 
          className={`tab-btn ${activeTab === 'userStatus' ? 'active' : ''}`}
          onClick={() => setActiveTab('userStatus')}
        >
          状态管理
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'userList' && renderUserList()}
        {activeTab === 'userAudit' && renderUserAudit()}
        {activeTab === 'userStatus' && renderUserStatus()}
      </div>

      {/* 用户详情模态框 */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content user-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>用户详细信息</h3>
              <button className="close-btn" onClick={() => setShowUserModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="user-detail-info">
                <div className="info-section">
                  <h4>基本信息</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">用户名：</span>
                      <span className="value">{selectedUser.username}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">真实姓名：</span>
                      <span className="value">{selectedUser.realName}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">手机号：</span>
                      <span className="value">{selectedUser.phone}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">邮箱：</span>
                      <span className="value">{selectedUser.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">身份证号：</span>
                      <span className="value">{selectedUser.idCard}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">银行卡：</span>
                      <span className="value">{selectedUser.bankCard}</span>
                    </div>
                  </div>
                </div>
                
                <div className="info-section">
                  <h4>账户状态</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">注册时间：</span>
                      <span className="value">{selectedUser.registrationTime}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">账户状态：</span>
                      <span className={`value status ${selectedUser.status}`}>
                        {selectedUser.status === 'active' ? '正常' : 
                         selectedUser.status === 'inactive' ? '停用' : '冻结'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">认证状态：</span>
                      <span className={`value verification ${selectedUser.verificationStatus}`}>
                        {selectedUser.verificationStatus === 'verified' ? '已认证' : '未认证'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">风险等级：</span>
                      <span className={`value risk-level ${selectedUser.riskLevel}`}>
                        {selectedUser.riskLevel === 'low' ? '低风险' : 
                         selectedUser.riskLevel === 'medium' ? '中风险' : '高风险'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <h4>交易统计</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">总交易次数：</span>
                      <span className="value">{selectedUser.totalTransactions} 次</span>
                    </div>
                    <div className="info-item">
                      <span className="label">总交易金额：</span>
                      <span className="value">{selectedUser.totalAmount}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">最后登录：</span>
                      <span className="value">{selectedUser.lastLoginTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 审核模态框 */}
      {showAuditModal && selectedPendingUser && (
        <div className="modal-overlay" onClick={() => setShowAuditModal(false)}>
          <div className="modal-content audit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>用户账号审核</h3>
              <button className="close-btn" onClick={() => setShowAuditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="audit-user-info">
                <h4>申请用户信息</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">用户名：</span>
                    <span className="value">{selectedPendingUser.username}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">真实姓名：</span>
                    <span className="value">{selectedPendingUser.realName}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">手机号：</span>
                    <span className="value">{selectedPendingUser.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">邮箱：</span>
                    <span className="value">{selectedPendingUser.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">身份证号：</span>
                    <span className="value">{selectedPendingUser.idCard}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">银行卡：</span>
                    <span className="value">{selectedPendingUser.bankCard}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">申请时间：</span>
                    <span className="value">{selectedPendingUser.applicationTime}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">申请原因：</span>
                    <span className="value">{selectedPendingUser.applicationReason}</span>
                  </div>
                </div>

                <div className="id-card-section">
                  <h4>身份证照片</h4>
                  <div className="id-card-images">
                    <div className="id-card-item">
                      <span className="id-label">身份证正面</span>
                      <div className="id-card-placeholder">身份证正面照片</div>
                    </div>
                    <div className="id-card-item">
                      <span className="id-label">身份证反面</span>
                      <div className="id-card-placeholder">身份证反面照片</div>
                    </div>
                  </div>
                </div>

                {selectedPendingUser.reviewStatus === 'pending' && (
                  <div className="audit-actions">
                    <button 
                      className="audit-btn approve"
                      onClick={() => handleUserAudit(selectedPendingUser.id, 'approve', '资料齐全，审核通过')}
                    >
                      通过审核
                    </button>
                    <button 
                      className="audit-btn reject"
                      onClick={() => handleUserAudit(selectedPendingUser.id, 'reject', '资料不完整，需要重新提交')}
                    >
                      驳回申请
                    </button>
                  </div>
                )}

                {selectedPendingUser.reviewStatus !== 'pending' && (
                  <div className="review-result">
                    <h4>审核结果</h4>
                    <div className="info-item">
                      <span className="label">审核状态：</span>
                      <span className={`value review-status ${selectedPendingUser.reviewStatus}`}>
                        {selectedPendingUser.reviewStatus === 'approved' ? '已通过' : '已驳回'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">审核时间：</span>
                      <span className="value">{selectedPendingUser.reviewTime}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">审核原因：</span>
                      <span className="value">{selectedPendingUser.reviewReason}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserInfoManagement
