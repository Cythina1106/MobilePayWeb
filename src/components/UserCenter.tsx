import { useState, useEffect } from 'react'
import './UserCenter.css'
import { userApi } from '../services/api'
import { UserQuery, PendingUser, PendingUserQuery, UserAuditRequest, UserRejectRequest } from '../types/api'

// UI用户类型定义
interface User {
  id: string
  // cardNumber?: string
  userName: string
  phone: string
  email: string
  userType: 'regular' | 'student' | 'senior' | 'staff'
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISABLED'
  balance: number
  registrationDate: string
  lastUsed: string
  totalTrips: number
  avatar?: string
  idCard?: string
  address?: string
  // API字段
  username?: string
  name?: string
}

interface UserRegistration {
  id: string
  applicantName: string
  phone: string
  email: string
  idCard: string
  userType: 'regular' | 'student' | 'senior' | 'staff'
  applicationDate: string
  status: 'pending' | 'approved' | 'rejected'
  reviewDate?: string
  reviewer?: string
  rejectReason?: string
  documents: string[]
}

const UserCenter = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'applications' | 'analytics'>('users')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showUserModal, setShowUserModal] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<UserRegistration | null>(null)

  // API状态
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  // 分页状态
  const [userQuery, setUserQuery] = useState<UserQuery>({
    page_num: 1,
    page_size: 10,
    keyword: '',
    status: ''
  })
  const [pendingQuery, setPendingQuery] = useState<PendingUserQuery>({
    pageNum: 1,
    pageSize: 10,
    keyword: ''
  })

  // 用户数据
  const [users, setUsers] = useState<User[]>([])
  const [totalUsers, setTotalUsers] = useState(0)

  // 申请数据
  const [applications, setApplications] = useState<UserRegistration[]>([])

  // 表单状态
  const [userForm, setUserForm] = useState<Partial<User>>({})

  // 统计数据状态
  const [statistics, setStatistics] = useState<any>({})
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  // API数据获取函数
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setApiError('')

      const response = await userApi.getUsers(userQuery)

      if (response.success && response.data) {
        // 转换API数据为UI数据格式
        const apiData = response.data as any
        const convertedUsers: User[] = apiData.records?.map((apiUser: any) => ({
          id: apiUser.userId?.toString() || apiUser.id?.toString(),
          // cardNumber: `600100${apiUser.user_id || apiUser.id}`,
          userName: apiUser.realName || apiUser.nickname || '未知用户',
          phone: apiUser.phone || '',
          email: apiUser.email || '',
          userType: 'regular' as const,
          status: apiUser.status, // 直接使用API返回的状态值
          balance: apiUser.balance || 0,
          registrationDate: apiUser.createTime?.split('T')[0] || '',
          lastUsed: apiUser.updateTime?.split('T')[0] || '从未使用',
          totalTrips: 0, // API中没有此字段，设为默认值
          idCard: apiUser.idCard || '',
          avatar: apiUser.avatarUrl || apiUser.avatar || '',
          username: apiUser.nickname,
          name: apiUser.realName
        })) || []

        setUsers(convertedUsers)
        setTotalUsers(apiData.total || 0)

      } else {
        setApiError(`获取用户列表失败: ${response.message}`)

      }
    } catch (err) {

      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setApiError(`获取用户列表失败: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingUsers = async () => {
    try {
      setLoading(true)
      setApiError('')

      const response = await userApi.getPendingUsers(pendingQuery)

      if (response.success && response.data) {
        // 转换待审核用户数据 - 使用实际的API数据格式
        const pendingData = response.data as any
        // 如果API返回的是和用户列表相同的格式，使用records字段
        const userRecords = pendingData.records || pendingData.users || []
        const convertedApplications: UserRegistration[] = userRecords.map((pendingUser: any) => ({
          id: pendingUser.userId?.toString() || pendingUser.verificationId?.toString(),
          applicantName: pendingUser.realName || pendingUser.nickname || '未知申请人',
          phone: pendingUser.phone || '',
          email: pendingUser.email || '',
          idCard: pendingUser.idCard || '',
          userType: 'regular' as const,
          applicationDate: pendingUser.submitTime?.split('T')[0] || pendingUser.createTime?.split('T')[0] || '',
          status: pendingUser.status === 'PENDING' ? 'pending' :
                 pendingUser.status === 'APPROVED' ? 'approved' :
                 pendingUser.status === 'REJECTED' ? 'rejected' : 'pending',
          documents: [
            pendingUser.idCardFront ? '身份证正面' : '',
            pendingUser.idCardBack ? '身份证反面' : ''
          ].filter(Boolean),
          // 添加审核相关字段
          reviewDate: pendingUser.auditTime?.split('T')[0] || '',
          reviewer: pendingUser.auditTime ? '管理员' : '',
          rejectReason: pendingUser.rejectReason || ''
        })) || []

        setApplications(convertedApplications)

      } else {
        setApiError(`获取待审核用户失败: ${response.message}`)

      }
    } catch (err) {

      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setApiError(`获取待审核用户失败: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      setLoading(true)
      setApiError('')
      const response = await userApi.getUserStatistics(dateRange)

      if (response.success && response.data) {
        setStatistics(response.data)
      } else {
        setApiError(`获取统计数据失败: ${response.message}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setApiError(`获取统计数据失败: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // 初始化数据加载
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    } else if (activeTab === 'applications') {
      fetchPendingUsers()
    } else if (activeTab === 'analytics') {
      fetchStatistics()
    }
  }, [activeTab, userQuery, pendingQuery, dateRange])

  // 过滤数据
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.userName.includes(searchTerm) ||
                         user.phone.includes(searchTerm) ||
                         user.email.includes(searchTerm) ||
                         (user.idCard || '').includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.includes(searchTerm) ||
                         app.phone.includes(searchTerm) ||
                         app.email.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // 处理用户操作
  const handleUserSave = async () => {
    try {
      setLoading(true)
      setApiError('')

      if (editingUser) {
        // 编辑用户
        const updateData = {
          id: editingUser.id,
          name: userForm.userName,
          phone: userForm.phone,
          email: userForm.email,
          remark: userForm.address
        }
        const response = await userApi.updateUser(updateData)
        if (response.success) {
          // 刷新用户列表
          fetchUsers()
          setShowUserModal(false)
          setEditingUser(null)
          setUserForm({})
        } else {
          setApiError(`更新用户失败: ${response.message}`)
        }
      } else {
        // 新增用户
        const createData = {
          username: userForm.userName || '',
          name: userForm.userName || '',
          phone: userForm.phone || '',
          email: userForm.email || '',
          password: '123456', // 默认密码
          initialBalance: userForm.balance || 0,
          remark: userForm.address || ''
        }
        const response = await userApi.createUser(createData)
        if (response.success) {
          // 刷新用户列表
          fetchUsers()
          setShowUserModal(false)
          setEditingUser(null)
          setUserForm({})
        } else {
          setApiError(`创建用户失败: ${response.message}`)
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setApiError(`保存用户失败: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUserEdit = async (user: User) => {
    try {
      setLoading(true)
      setApiError('')
      setEditingUser(user)

      // 调用用户详情接口获取完整信息
      const response = await userApi.getUser(user.id)

      if (response.success && response.data) {
        const userDetail = response.data as any
        // 将API返回的详情数据转换为表单数据
        const formData: Partial<User> = {
          id: userDetail.userId?.toString() || userDetail.id?.toString(),
          userName: userDetail.realName || userDetail.nickname || user.userName,
          phone: userDetail.phone || user.phone,
          email: userDetail.email || user.email,
          userType: user.userType, // 保持原有类型
          status: userDetail.status || user.status, // 直接使用API返回的状态值
          balance: userDetail.balance || user.balance,
          address: userDetail.address || user.address,
          idCard: userDetail.idCard || user.idCard,
          avatar: userDetail.avatar || user.avatar
        }
        setUserForm(formData)
      } else {
        // 如果详情接口失败，使用列表中的数据
        setUserForm(user)
        setApiError(`获取用户详情失败: ${response.message}`)
      }

      setShowUserModal(true)
    } catch (err) {
      // 如果详情接口异常，使用列表中的数据
      setUserForm(user)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setApiError(`获取用户详情失败: ${errorMessage}`)
      setShowUserModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleUserStatusChange = async (userId: string, newStatus: 'APPROVED' | 'DISABLED') => {
    try {
      setLoading(true)
      setApiError('')

      if (newStatus === 'APPROVED') {
        const response = await userApi.enableUser(userId)
        if (response.success) {

          // 刷新用户列表
          fetchUsers()
        } else {
          setApiError(`启用用户失败: ${response.message}`)
        }
      } else {
        const response = await userApi.disableUser(userId, '管理员操作')
        if (response.success) {

          // 刷新用户列表
          fetchUsers()
        } else {
          setApiError(`禁用用户失败: ${response.message}`)
        }
      }
    } catch (err) {

      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setApiError(`用户状态变更失败: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // 处理申请审核
  const handleApplicationReview = async (applicationId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      setLoading(true)
      setApiError('')

      if (action === 'approve') {

        const auditData: UserAuditRequest = {
          auditResult: 'APPROVED',
          auditReason: '审核通过',
          auditType: 'REGISTER'
        }
        const response = await userApi.approveUser(applicationId, auditData)
        if (response.success) {

          // 刷新待审核列表和用户列表
          fetchPendingUsers()
          fetchUsers()
        } else {
          setApiError(`审核通过失败: ${response.message}`)
        }
      } else {

        const rejectData: UserRejectRequest = {
          auditResult: 'REJECTED',
          auditReason: reason || '审核不通过',
          auditType: 'REGISTER'
        }
        const response = await userApi.rejectUser(applicationId, rejectData)
        if (response.success) {

          // 刷新待审核列表
          fetchPendingUsers()
        } else {
          setApiError(`拒绝申请失败: ${response.message}`)
        }
      }
    } catch (err) {

      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setApiError(`申请审核失败: ${errorMessage}`)
    } finally {
      setLoading(false)
    }

    setShowApplicationModal(false)
    setSelectedApplication(null)
  }

  // 统计数据现在通过API获取，不再使用本地计算

  // 渲染用户列表
  const renderUsers = () => (
    <div className="users-section">
      <div className="section-header">
        <h3>用户管理</h3>
        <div className="header-actions">
          {apiError && (
            <div className="error-message" style={{
              color: '#dc3545',
              background: '#f8d7da',
              padding: '8px 12px',
              borderRadius: '4px',
              marginRight: '10px',
              fontSize: '14px'
            }}>
              {apiError}
            </div>
          )}
          <div className="search-container">
            <input
              type="text"
              placeholder="搜索用户..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                // 更新查询参数
                setUserQuery(prev => ({ ...prev, keyword: e.target.value, page_num: 1 }))
              }}
              className="search-input"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              // 更新查询参数
              setUserQuery(prev => ({ ...prev, status: e.target.value === 'all' ? '' : e.target.value, page_num: 1 }))
            }}
            className="filter-select"
          >
            <option value="all">全部状态</option>
            <option value="PENDING">待审核</option>
            <option value="APPROVED">已通过</option>
            <option value="REJECTED">已拒绝</option>
            <option value="DISABLED">已禁用</option>
          </select>
          <button className="add-btn" onClick={() => setShowUserModal(true)}>
            <span>+</span> 添加用户
          </button>
        </div>
      </div>

      <div className="users-grid">
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666',
            gridColumn: '1 / -1'
          }}>
            加载中...
          </div>
        )}
        {!loading && filteredUsers.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666',
            gridColumn: '1 / -1'
          }}>
            暂无用户数据
          </div>
        )}
        {!loading && filteredUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <div className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.userName} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                ) : (
                  <span>{user.userName.charAt(0)}</span>
                )}
              </div>
              <div className="user-info">
                <h4>{user.userName}</h4>
                <p className="user-phone">{user.phone}</p>
                <p className="user-email">{user.email}</p>
              </div>
              <div className={`user-status ${user.status}`}>
                <span className="status-dot"></span>
                {user.status === 'APPROVED' ? '已通过' :
                 user.status === 'PENDING' ? '待审核' :
                 user.status === 'REJECTED' ? '已拒绝' :
                 user.status === 'DISABLED' ? '已禁用' : '未知'}
              </div>
            </div>
            
            <div className="user-details">
              {/* <div className="detail-row">
                <span>卡号</span>
                <span className="card-number">{user.cardNumber}</span>
              </div> */}
              <div className="detail-row">
                <span>类型</span>
                <span className={`user-type ${user.userType}`}>
                  {user.userType === 'regular' ? '普通用户' :
                   user.userType === 'student' ? '学生' :
                   user.userType === 'senior' ? '老年人' : '员工'}
                </span>
              </div>
              <div className="detail-row">
                <span>余额</span>
                <span className={`balance ${(user.balance || 0) < 10 ? 'low' : ''}`}>
                  ¥{(user.balance || 0).toFixed(2)}
                </span>
              </div>
              <div className="detail-row">
                <span>出行次数</span>
                <span>{user.totalTrips} 次</span>
              </div>
              <div className="detail-row">
                <span>最后使用</span>
                <span className="last-used">{user.lastUsed}</span>
              </div>
            </div>
            
            <div className="user-actions">
              <button
                className="action-btn edit"
                onClick={() => handleUserEdit(user)}
                disabled={loading}
              >
                编辑
              </button>
              {user.status === 'APPROVED' ? (
                <button
                  className="action-btn suspend"
                  onClick={() => handleUserStatusChange(user.id, 'DISABLED')}
                  disabled={loading}
                >
                  禁用
                </button>
              ) : (
                <button
                  className="action-btn activate"
                  onClick={() => handleUserStatusChange(user.id, 'APPROVED')}
                  disabled={loading}
                >
                  启用
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // 渲染申请列表
  const renderApplications = () => (
    <div className="applications-section">
      <div className="section-header">
        <h3>用户申请</h3>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="搜索申请..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">全部状态</option>
            <option value="pending">待审核</option>
            <option value="approved">已通过</option>
            <option value="rejected">已拒绝</option>
          </select>
        </div>
      </div>

      <div className="applications-list">
        {filteredApplications.map(app => (
          <div key={app.id} className="application-card">
            <div className="application-header">
              <div className="applicant-info">
                <h4>{app.applicantName}</h4>
                <p>{app.phone} • {app.email}</p>
              </div>
              <div className={`application-status ${app.status}`}>
                <span className="status-dot"></span>
                {app.status === 'pending' ? '待审核' :
                 app.status === 'approved' ? '已通过' : '已拒绝'}
              </div>
            </div>
            
            <div className="application-details">
              <div className="detail-row">
                <span>申请日期</span>
                <span>{app.applicationDate}</span>
              </div>
              <div className="detail-row">
                <span>用户类型</span>
                <span className={`user-type ${app.userType}`}>
                  {app.userType === 'regular' ? '普通用户' :
                   app.userType === 'student' ? '学生' :
                   app.userType === 'senior' ? '老年人' : '员工'}
                </span>
              </div>
              <div className="detail-row">
                <span>身份证号</span>
                <span className="id-card">{app.idCard}</span>
              </div>
              <div className="detail-row">
                <span>附件</span>
                <span className="documents">{app.documents.join('、')}</span>
              </div>
              {app.reviewDate && (
                <div className="detail-row">
                  <span>审核时间</span>
                  <span>{app.reviewDate} • {app.reviewer}</span>
                </div>
              )}
              {app.rejectReason && (
                <div className="detail-row">
                  <span>拒绝原因</span>
                  <span className="reject-reason">{app.rejectReason}</span>
                </div>
              )}
            </div>
            
            {app.status === 'pending' && (
              <div className="application-actions">
                <button 
                  className="action-btn approve"
                  onClick={() => handleApplicationReview(app.id, 'approve')}
                >
                  通过
                </button>
                <button 
                  className="action-btn reject"
                  onClick={() => {
                    setSelectedApplication(app)
                    setShowApplicationModal(true)
                  }}
                >
                  拒绝
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  // 渲染统计分析
  const renderAnalytics = () => (
    <div className="analytics-section">
      <div className="section-header">
        <h3>用户统计</h3>
        <div className="header-actions">
          {apiError && (
            <div className="error-message" style={{
              color: '#dc3545',
              background: '#f8d7da',
              padding: '8px 12px',
              borderRadius: '4px',
              marginRight: '10px',
              fontSize: '14px'
            }}>
              {apiError}
            </div>
          )}
          <div className="date-range-picker">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              placeholder="开始日期"
              style={{ marginRight: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              placeholder="结束日期"
              style={{ marginRight: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <button
              onClick={fetchStatistics}
              disabled={loading}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '查询中...' : '查询'}
            </button>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {loading && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px',
            color: '#666'
          }}>
            加载中...
          </div>
        )}
        {!loading && (
          <>
            <div className="stat-card">
              <div className="stat-value">{statistics.totalUsers || 0}</div>
              <div className="stat-label">总用户数</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statistics.approvedUsers || 0}</div>
              <div className="stat-label">已通过用户</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statistics.pendingUsers || 0}</div>
              <div className="stat-label">待审核用户</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statistics.rejectedUsers || 0}</div>
              <div className="stat-label">已拒绝用户</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statistics.disabledUsers || 0}</div>
              <div className="stat-label">已禁用用户</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statistics.newUsersToday || 0}</div>
              <div className="stat-label">今日新增</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statistics.newUsersThisMonth || 0}</div>
              <div className="stat-label">本月新增</div>
            </div>
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="user-center">
      <div className="center-header">
        <h2>用户中心</h2>
        <p>统一管理用户信息、申请审核和数据统计</p>
      </div>

      <div className="center-tabs">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('users')
            setSearchTerm('')
            setStatusFilter('all')
          }}
        >
          用户管理
        </button>
        <button 
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('applications')
            setSearchTerm('')
            setStatusFilter('all')
          }}
        >
          申请审核
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('analytics')
            setSearchTerm('')
            setStatusFilter('all')
          }}
        >
          数据统计
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>

      {/* 用户编辑模态框 */}
      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUser ? '编辑用户' : '添加用户'}</h3>
              <button className="close-btn" onClick={() => setShowUserModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {apiError && (
                <div className="error-message" style={{
                  color: '#dc3545',
                  background: '#f8d7da',
                  padding: '10px',
                  borderRadius: '4px',
                  marginBottom: '15px'
                }}>
                  {apiError}
                </div>
              )}
              <div className="form-grid">
                <div className="form-group">
                  <label>用户姓名</label>
                  <input
                    type="text"
                    value={userForm.userName || ''}
                    onChange={(e) => setUserForm(prev => ({ ...prev, userName: e.target.value }))}
                    placeholder="请输入用户姓名"
                  />
                </div>
                <div className="form-group">
                  <label>手机号</label>
                  <input
                    type="tel"
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
                  <label>用户类型</label>
                  <select
                    value={userForm.userType || 'regular'}
                    onChange={(e) => setUserForm(prev => ({ ...prev, userType: e.target.value as any }))}
                  >
                    <option value="regular">普通用户</option>
                    <option value="student">学生</option>
                    <option value="senior">老年人</option>
                    <option value="staff">员工</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>初始余额</label>
                  <input
                    type="number"
                    step="0.01"
                    value={userForm.balance || ''}
                    onChange={(e) => setUserForm(prev => ({ ...prev, balance: Number(e.target.value) }))}
                    placeholder="请输入初始余额"
                  />
                </div>
                <div className="form-group">
                  <label>身份证号</label>
                  <input
                    type="text"
                    value={userForm.idCard || ''}
                    onChange={(e) => setUserForm(prev => ({ ...prev, idCard: e.target.value }))}
                    placeholder="请输入身份证号"
                  />
                </div>
                <div className="form-group full-width">
                  <label>地址</label>
                  <input
                    type="text"
                    value={userForm.address || ''}
                    onChange={(e) => setUserForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="请输入地址"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowUserModal(false)}>
                取消
              </button>
              <button className="save-btn" onClick={handleUserSave} disabled={loading}>
                {loading ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 申请拒绝模态框 */}
      {showApplicationModal && selectedApplication && (
        <div className="modal-overlay" onClick={() => setShowApplicationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>拒绝申请</h3>
              <button className="close-btn" onClick={() => setShowApplicationModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>确定要拒绝 <strong>{selectedApplication.applicantName}</strong> 的申请吗？</p>
              <div className="form-group">
                <label>拒绝原因</label>
                <textarea
                  placeholder="请输入拒绝原因..."
                  rows={3}
                  id="rejectReason"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowApplicationModal(false)}>
                取消
              </button>
              <button 
                className="reject-btn"
                onClick={() => {
                  const reason = (document.getElementById('rejectReason') as HTMLTextAreaElement)?.value
                  handleApplicationReview(selectedApplication.id, 'reject', reason)
                }}
              >
                确认拒绝
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserCenter
