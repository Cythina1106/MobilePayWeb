import { useEffect, useState } from 'react'
import '../styles/UserCenter.css'
import { userApi } from '../services/api.ts'
import { UserQuery, PendingUserQuery, UserAuditRequest, UserRejectRequest } from '../types/api.ts'
import UserCard from '../components/UserCenter/UserCard.tsx';
import ApplicationCard from '../components/UserCenter/ApplicationCard.tsx';
import StatisticsCard from '../components/UserCenter/StatisticsCard.tsx';
import UserFormModal from '../components/UserCenter/UserFormModal.tsx';
import RejectModal from '../components/UserCenter/RejectModal.tsx';
import Pagination from '../components/UserCenter/Pagination.tsx';


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

interface Statistics {
  totalUsers: number;
  activeUsers: number;
  pendingApplications: number;
  totalBalance: number;
  newUsersThisMonth: number;
  dailyActiveUsers: number;
  averageTripsPerUser: number;
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
  // 统计数据专用loading状态
  const [statisticsLoading, setStatisticsLoading] = useState(false)

  // 分页状态
  const [userQuery, setUserQuery] = useState<UserQuery>({
    pageNum: 1,
    pageSize: 10,
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
  const [totalApplications, setTotalApplications] = useState(0)

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
        console.log('📊 API返回的用户数据:', apiData.records)
        const convertedUsers: User[] = apiData.records?.map((apiUser: any) => {
          const userId = apiUser.userId?.toString() || apiUser.id?.toString()
          console.log('👤 转换用户数据 - 原始userId:', apiUser.userId, '转换后ID:', userId)
          return {
            id: userId,
          // cardNumber: `600100${apiUser.userId || apiUser.id}`,
          userName: apiUser.nickname  || '未知用户',
          phone: apiUser.phone || '',
          email: apiUser.email || '',
          userType: 'regular' as const,
          status: apiUser.status, // 直接使用API返回的状态值
          balance: apiUser.balance || 0,
          registrationDate: apiUser.createdTime?.split('T')[0] || '',
          lastUsed: apiUser.updatedTime?.split('T')[0] || '从未使用',
          totalTrips: 0, // API中没有此字段，设为默认值
          idCard: apiUser.idCard || '',
          avatar: apiUser.avatar || '',
          username: apiUser.nickname,
          name: apiUser.realName
          }
        }) || []

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
          id: pendingUser.userId?.toString() || pendingUser.verification_id?.toString(),
          applicantName: pendingUser.realName || pendingUser.nickname || '未知申请人',
          phone: pendingUser.phone || '',
          email: pendingUser.email || '',
          idCard: pendingUser.idCard || '',
          userType: 'regular' as const,
          applicationDate: pendingUser.submitTime?.split('T')[0] || pendingUser.createdTime?.split('T')[0] || '',
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
        setTotalApplications(pendingData.total || 0)

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
      setStatisticsLoading(true)
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
      setStatisticsLoading(false)
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

      console.log('🔄 用户状态变更 - 用户ID:', userId, '新状态:', newStatus)

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
          audit_result: 'APPROVED',
          audit_reason: '审核通过',
          audit_type: 'REGISTER'
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
          audit_result: 'REJECTED',
          audit_reason: reason || '审核不通过',
          audit_type: 'REGISTER'
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
                setUserQuery(prev => ({ ...prev, keyword: e.target.value, pageNum: 1 }))
              }}
              className="search-input"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              // 更新查询参数
              setUserQuery(prev => ({ ...prev, status: e.target.value === 'all' ? '' : e.target.value, pageNum: 1 }))
            }}
            className="filter-select"
          >
            <option value="all">全部状态</option>
            <option value="PENDING">待审核</option>
            <option value="APPROVED">已通过</option>
            <option value="REJECTED">已拒绝</option>
            <option value="DISABLED">已禁用</option>
          </select>
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
          <UserCard
            key={user.id}
            user={user}
            onStatusChange={handleUserStatusChange}
            loading={loading}
          />
        ))}
      </div>

      {/* 分页控件 */}
      {!loading && totalUsers > 0 && (
        <div className="pagination-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px'
        }}>
          <Pagination
            totalItems={totalUsers}
            itemsPerPage={userQuery.pageSize || 10}
            currentPage={userQuery.pageNum || 1}
            onPageChange={(page) => setUserQuery(prev => ({ ...prev, pageNum: page }))}
            loading={loading}
          />
        </div>
      )}
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
              onChange={(e) => {
                setSearchTerm(e.target.value)
                // 更新查询参数
                setPendingQuery(prev => ({ ...prev, keyword: e.target.value, pageNum: 1 }))
              }}
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
          <ApplicationCard
            key={app.id}
            application={app}
            onApprove={() => handleApplicationReview(app.id, 'approve')}
            onReject={(app) => {
              setSelectedApplication(app)
              setShowApplicationModal(true)
            }}
          />
        ))}
      </div>

      {/* 分页控件 */}
      {!loading && totalApplications > 0 && (
        <div className="pagination-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px'
        }}>
          <Pagination
            totalItems={totalApplications}
            itemsPerPage={pendingQuery.pageSize || 10}
            currentPage={pendingQuery.pageNum || 1}
            onPageChange={(page) => setPendingQuery(prev => ({ ...prev, pageNum: page }))}
            loading={loading}
          />
        </div>
      )}
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
              disabled={statisticsLoading}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: statisticsLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {statisticsLoading ? '查询中...' : '查询'}
            </button>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {statisticsLoading && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px',
            color: '#666'
          }}>
            加载中...
          </div>
        )}
        {!statisticsLoading && (
          <>
            <StatisticsCard
              title="总用户数"
              icon="用户中心.svg"
              value={statistics.totalUsers || 0}
              description="平台注册用户总数"
            />
            <StatisticsCard
              title="已通过用户"
              icon="活跃用户.svg"
              value={statistics.approvedUsers || 0}
              description="审核通过的用户"
            />
            <StatisticsCard
              title="待审核用户"
              icon="交易笔款.svg"
              value={statistics.pendingUsers || 0}
              description="等待审核的用户"
            />
            <StatisticsCard
              title="已拒绝用户"
              icon="停用策略.svg"
              value={statistics.rejectedUsers || 0}
              description="审核拒绝的用户"
            />
            <StatisticsCard
              title="已禁用用户"
              icon="停用策略.svg"
              value={statistics.disabledUsers || 0}
              description="已禁用的用户"
            />
            <StatisticsCard
              title="今日新增"
              icon="今日交易额.svg"
              value={statistics.newUsersToday || 0}
              description="今日新增注册用户"
            />
            <StatisticsCard
              title="本月新增"
              icon="活跃策略.svg"
              value={statistics.newUsersThisMonth || 0}
              description="本月新增注册用户"
            />
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
      <UserFormModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        user={editingUser}
        userForm={userForm}
        setUserForm={setUserForm}
        loading={loading}
        error={apiError}
        onSave={handleUserSave}
      />

      {/* 申请拒绝模态框 */}
      <RejectModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        application={selectedApplication}
        onConfirm={(reason) => {
          if (selectedApplication) {
            handleApplicationReview(selectedApplication.id, 'reject', reason)
          }
        }}
      />
    </div>
  )
}

export default UserCenter;
