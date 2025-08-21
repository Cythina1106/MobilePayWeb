import { apiClient } from '../utils/apiClient'
import { mockApi, isMockEnabled } from './mockApi'
import {
  LoginRequest,
  LoginResponse,
  UserInfo,
  RefreshTokenResponse,
  Transaction,
  TransactionQuery,
  PageResponse,
  User,
  UserQuery,
  CreateUserRequest,
  UpdateUserRequest,
  UserSearchQuery,
  UserSearchResult,
  PendingUserQuery,
  PendingUserResult,
  UserAuditRequest,
  UserAuditResponse,
  UserRejectRequest,
  UserRejectResponse,
  UserEnableResponse,
  UserDisableResponse,
  TravelRecordsResponse,
  DashboardStats,
  UserStatistics,
  TravelStatistics,
  DeviceUsageStatistics,
  DeviceUsageQuery,
  DiscountStatistics,
  DiscountStatisticsQuery,
  SiteStatistics,
  SystemConfig,
  UpdateConfigRequest,
  OperationLog,
  LogQuery,
  ApiResponse,
  DiscountStrategy,
  DiscountStrategyQuery,
  CreateDiscountStrategyRequest,
  UpdateDiscountStrategyRequest,
  City,
  Device,
  DeviceQuery,
  CreateDeviceRequest,
  UpdateDeviceRequest,
  Site,
  SiteQuery,
  SiteListResponse,
  SiteCreateRequest,
  SiteUpdateRequest,
  LineQuery,
  LineListResponse
} from '../types/api'

// API包装器，根据环境选择Mock或真实API
const createApiWrapper = <T extends (...args: any[]) => Promise<ApiResponse<any>>>(
  realApi: T,
  mockApi?: T
): T => {
  return ((...args: any[]) => {
    if (isMockEnabled() && mockApi) {
      return mockApi(...args)
    }
    return realApi(...args)
  }) as T
}

// 认证相关API
export const authApi = {
  // 登录 - 强制使用真实API
  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    console.log('🔐 调用登录API: POST /auth/login', data)
    return apiClient.post<LoginResponse>('/auth/login', data, false) // 登录不需要token
      .then(response => {
        if (response.code === 200 && response.data?.accessToken && response.data?.tokenType) {
          // 拼接token_type和access_token，存储到localStorage
          const fullToken = `${response.data.tokenType} ${response.data.accessToken}`
          localStorage.setItem('token', fullToken)
          console.log('🔑 Token已存储到localStorage:', fullToken)
        }
        return response
      })
  },

  // // 登出 - 根据JavaScript接口使用X-User-Id请求头
  // logout: createApiWrapper(
  //   (userId?: string): Promise<ApiResponse<void>> => {
  //     const headers: Record<string, string> = {
  //       'X-User-Id': userId || ''
  //     }
  //     return apiClient.postWithHeaders('/auth/logout', undefined, headers, false)
  //   },
  //   mockApi.auth.logout
  // ),

  // 登出 - 强制使用真实API
  logout: (): Promise<ApiResponse<void>> => {
    console.log('🚪 调用登出API: POST /auth/logout')
    return apiClient.post<void>('/auth/logout', {}, true)
      .then(response => {
        // 登出成功后清除token
        localStorage.removeItem('token')
        console.log('🔑 Token已清除')
        return response
      })
  },

  // 刷新token - 强制使用真实API
  refreshToken: (userId?: string): Promise<ApiResponse<RefreshTokenResponse>> => {
    console.log('调用真实刷新token API:', userId)
    const headers: Record<string, string> = {
      'X-User-Id': userId || ''
    }
    return apiClient.postWithHeaders('/auth/refresh', undefined, headers, false)
  },

  // 获取当前用户信息 - 使用Mock以避免刷新时权限问题
  profile: createApiWrapper(
    (): Promise<ApiResponse<UserInfo>> => {
      console.log('👤 调用获取用户信息API: GET /auth/profile')
      return apiClient.get('/auth/profile', {}, true)
    },
    mockApi.auth.getProfile
  ),

  // 获取当前用户信息（别名，保持向后兼容）
  getCurrentUser: createApiWrapper(
    (): Promise<ApiResponse<UserInfo>> => {
      console.log('👤 调用获取当前用户信息API: GET /auth/profile')
      return apiClient.get('/auth/profile', {}, true)
    },
    mockApi.auth.getCurrentUser
  ),

  // 获取管理员资料信息（别名，保持向后兼容）
  getProfile: createApiWrapper(
    (): Promise<ApiResponse<UserInfo>> => {
      console.log('👤 调用获取管理员资料信息API: GET /auth/profile')
      return apiClient.get('/auth/profile', {}, true)
    },
    mockApi.auth.getProfile
  ),

  // 修改密码
  changePassword: (data: { oldPassword: string; newPassword: string }): Promise<ApiResponse<void>> => {
    return apiClient.post('/auth/change-password', data)
  },

  // 获取验证码
  getCaptcha: createApiWrapper(
    (): Promise<ApiResponse<{ captcha: string; key: string }>> => {
      return apiClient.get('/auth/captcha', undefined, false)
    },
    mockApi.auth.getCaptcha
  )
}

// 交易相关API
export const transactionApi = {
  // 获取交易列表
  getTransactions: (query: TransactionQuery): Promise<ApiResponse<PageResponse<Transaction>>> => {
    return apiClient.get('/transactions', query)
  },

  // 获取交易详情
  getTransaction: (id: string): Promise<ApiResponse<Transaction>> => {
    console.log('💳 调用获取交易详情API: GET /transactions/{id}', id)
    return apiClient.get(`/transactions/${id}`, {}, true)
  },

  // 创建交易
  createTransaction: (data: Partial<Transaction>): Promise<ApiResponse<Transaction>> => {
    return apiClient.post('/transactions', data)
  },

  // 更新交易状态
  updateTransactionStatus: (id: string, status: string, remark?: string): Promise<ApiResponse<void>> => {
    return apiClient.put(`/transactions/${id}/status`, { status, remark })
  },

  // 交易退款
  refundTransaction: (id: string, amount: number, reason: string): Promise<ApiResponse<void>> => {
    return apiClient.post(`/transactions/${id}/refund`, { amount, reason })
  },

  // 导出交易记录
  exportTransactions: (query: TransactionQuery): Promise<ApiResponse<{ downloadUrl: string }>> => {
    return apiClient.post('/transactions/export', query)
  },

  // 获取交易统计
  getTransactionStats: (startTime?: string, endTime?: string): Promise<ApiResponse<any>> => {
    return apiClient.get('/transactions/stats', { startTime, endTime })
  }
}

// 用户管理相关API
export const userApi = {
  // 获取用户列表 - 根据JavaScript接口使用Authorization请求头
  getUsers: createApiWrapper(
    (query: UserQuery): Promise<ApiResponse<PageResponse<User>>> => {
      // 根据JavaScript接口将URL路径更改为 /user 而不是 /users
      return apiClient.get('/user', query)
    },
    mockApi.users.getList
  ),

  // 获取用户详情 - 根据JavaScript接口使用Authorization请求头
  getUser: createApiWrapper(
    (id: string): Promise<ApiResponse<User>> => {
      // 根据JavaScript接口将URL路径更改为 /user/{id} 而不是 /users/{id}

      return apiClient.get(`/user/${id}`, {}, true)
    },
    mockApi.users.getUser
  ),

  // 搜索用户 - 根据JavaScript接口使用Authorization请求头
  searchUsers: createApiWrapper(
    (query: UserSearchQuery): Promise<ApiResponse<UserSearchResult>> => {
      // 根据JavaScript接口：GET /user/search?keyword=test
      return apiClient.get('/user/search', query)
    },
    mockApi.users.searchUsers
  ),

  // 获取待审核用户 - 根据JavaScript接口使用Authorization请求头
  getPendingUsers: createApiWrapper(
    (query?: PendingUserQuery): Promise<ApiResponse<PendingUserResult>> => {
      // 根据JavaScript接口：GET /user/pending
      return apiClient.get('/user/pending', query || {})
    },
    mockApi.users.getPendingUsers
  ),

  // 审核用户通过/拒绝 - 根据JavaScript接口使用Authorization请求头和JSON格式
  approveUser: createApiWrapper(
    (userId: string, auditData: UserAuditRequest): Promise<ApiResponse<UserAuditResponse>> => {
      // 根据JavaScript接口：POST /user/{id}/approve
      return apiClient.post(`/user/${userId}/approve`, auditData)
    },
    mockApi.users.approveUser
  ),

  // 拒绝用户审核 - 根据JavaScript接口使用Authorization请求头和JSON格式
  rejectUser: createApiWrapper(
    (userId: string, rejectData: UserRejectRequest): Promise<ApiResponse<UserRejectResponse>> => {
      // 根据JavaScript接口：POST /user/{id}/reject
      return apiClient.post(`/user/${userId}/reject`, rejectData)
    },
    mockApi.users.rejectUser
  ),

  // 启用用户 - 根据JavaScript接口使用Authorization请求头
  enableUser: createApiWrapper(
    (userId: string): Promise<ApiResponse<UserEnableResponse>> => {
      // 根据JavaScript接口：POST /user/{id}/enable
      console.log('✅ 调用启用用户API: POST /user/{id}/enable', userId)
      return apiClient.post(`/user/${userId}/enable`, {}, true)
    },
    mockApi.users.enableUser
  ),

  // 禁用用户 - 根据JavaScript接口使用Authorization请求头和reason查询参数
  disableUser: createApiWrapper(
    (userId: string, reason?: string): Promise<ApiResponse<UserDisableResponse>> => {
      // 根据JavaScript接口：POST /user/{id}/disable?reason=xxx
      const url = reason ? `/user/${userId}/disable?reason=${encodeURIComponent(reason)}` : `/user/${userId}/disable`
      console.log('❌ 调用禁用用户API: POST /user/{id}/disable', userId, reason)
      return apiClient.post(url, {}, true)
    },
    mockApi.users.disableUser
  ),

  // 创建用户
  createUser: (data: CreateUserRequest): Promise<ApiResponse<User>> => {
    return apiClient.post('/users', data)
  },

  // 更新用户信息
  updateUser: (data: UpdateUserRequest): Promise<ApiResponse<User>> => {
    return apiClient.put(`/users/${data.id}`, data)
  },

  // 删除用户
  deleteUser: (id: string): Promise<ApiResponse<void>> => {
    console.log('🗑️ 调用删除用户API: DELETE /users/{id}', id)
    return apiClient.delete(`/users/${id}`, {}, true)
  },

  // 冻结/解冻用户
  toggleUserStatus: (id: string, status: 'normal' | 'frozen' | 'disabled'): Promise<ApiResponse<void>> => {
    return apiClient.put(`/users/${id}/status`, { status })
  },

  // 查看用户出行记录 - 根据JavaScript接口使用Authorization请求头和查询参数
  getTravelRecords: createApiWrapper(
    (userId: string, query: { pageNum: number; pageSize: number }): Promise<ApiResponse<TravelRecordsResponse>> => {
      // 根据JavaScript接口：GET /user/{id}/travel-records?pageNum=1&pageSize=10
      const params = new URLSearchParams({
        pageNum: query.pageNum.toString(),
        pageSize: query.pageSize.toString()
      });
      console.log('🚇 调用获取用户出行记录API: GET /user/{id}/travel-records', userId)
      return apiClient.get(`/user/${userId}/travel-records?${params.toString()}`, {}, true)
    },
    mockApi.users.getTravelRecords
  ),

  // 查看用户转账记录 - 根据JavaScript接口使用Authorization请求头和查询参数
  getTransferRecords: createApiWrapper(
    (userId: string, query: { pageNum: number; pageSize: number }): Promise<ApiResponse<any>> => {
      // 根据JavaScript接口：GET /user/{id}/transfer-records?pageNum=1&pageSize=10
      const params = new URLSearchParams({
        pageNum: query.pageNum.toString(),
        pageSize: query.pageSize.toString()
      });

      return apiClient.get(`/user/${userId}/transfer-records?${params.toString()}`, {}, true)
    },
    mockApi.users.getTravelRecords
  ),

  // 调整用户余额
  adjustBalance: (id: string, amount: number, type: 'increase' | 'decrease', remark: string): Promise<ApiResponse<void>> => {
    return apiClient.post(`/users/${id}/balance`, { amount, type, remark })
  },

  // 重置用户密码
  resetPassword: (id: string, newPassword: string): Promise<ApiResponse<void>> => {
    return apiClient.post(`/users/${id}/reset-password`, { newPassword })
  },

  // 获取用户交易记录
  getUserTransactions: (id: string, query: TransactionQuery): Promise<ApiResponse<PageResponse<Transaction>>> => {
    return apiClient.get(`/users/${id}/transactions`, query)
  },

  // 获取用户统计数据
  getUserStatistics: (query: { startDate?: string; endDate?: string }): Promise<ApiResponse<any>> => {
    // 根据接口：GET /statistics/user?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd
    const params: any = {}
    if (query.startDate) params.startDate = query.startDate
    if (query.endDate) params.endDate = query.endDate
    return apiClient.get('/statistics/user', params)
  }
}

// 仪表盘相关API
export const dashboardApi = {
  // 获取仪表盘统计数据
  getStats: createApiWrapper(
    (): Promise<ApiResponse<DashboardStats>> => {
      console.log('📊 调用获取仪表板统计API: GET /dashboard/stats')
      return apiClient.get('/dashboard/stats', {}, true)
    },
    mockApi.dashboard.getStats
  ),

  // 获取实时数据
  getRealTimeData: (): Promise<ApiResponse<any>> => {
    console.log('⚡ 调用获取实时数据API: GET /dashboard/realtime')
    return apiClient.get('/dashboard/realtime', {}, true)
  },

  // 获取图表数据
  getChartData: (type: string, period: string): Promise<ApiResponse<any>> => {
    return apiClient.get('/dashboard/charts', { type, period })
  }
}

// 统计相关API
export const statisticsApi = {
  // 获取用户统计数据
  getUserStatistics: createApiWrapper(
    (): Promise<ApiResponse<UserStatistics>> => {
      // 根据JavaScript接口要求使用X-User-Id请求头
      const userId = localStorage.getItem('userId') || ''

      const headers = new Headers()
      headers.append("X-User-Id", userId)

      const requestOptions: RequestInit = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
      }

      return fetch("/statistics/user", requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.text()
        })
        .then(result => {
          let data: UserStatistics
          try {
            data = JSON.parse(result)
          } catch {
            // 如果解析失败，返回默认统计数据
            data = {
              totalUsers: 0,
              activeUsers: 0,
              newUsers: 0,
              verifiedUsers: 0,
              usersByStatus: { active: 0, inactive: 0, locked: 0, pending: 0 },
              usersByRole: { superAdmin: 0, admin: 0, operator: 0, viewer: 0 },
              userGrowthTrend: [],
              userActivityStats: {
                lastLogin: { today: 0, thisWeek: 0, thisMonth: 0 },
                transactions: { averagePerUser: 0, topUsers: [] }
              }
            }
          }

          return {
            success: true,
            code: 200,
            message: 'success',
            data: data,
            timestamp: new Date().toISOString()
          } as ApiResponse<UserStatistics>
        })
        .catch(error => {
          console.error('获取用户统计数据失败:', error)
          throw error
        })
    },
    mockApi.statistics.getUserStatistics
  ),

  // 获取出行数据统计
  getTravelStatistics: createApiWrapper(
    (): Promise<ApiResponse<TravelStatistics>> => {
      // 根据JavaScript接口要求使用X-User-Id请求头
      const userId = localStorage.getItem('userId') || ''

      const headers = new Headers()
      headers.append("X-User-Id", userId)

      const requestOptions: RequestInit = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
      }

      return fetch("/statistics/travel", requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.text()
        })
        .then(result => {
          let data: TravelStatistics
          try {
            data = JSON.parse(result)
          } catch {
            // 如果解析失败，返回默认出行统计数据
            data = {
              totalTrips: 0,
              activeRoutes: 0,
              totalDistance: 0,
              totalPayments: 0,
              paymentMethods: { qrCode: 0, nfc: 0, card: 0, wallet: 0 },
              tripsByTransportType: { subway: 0, bus: 0, taxi: 0, bike: 0, walking: 0 },
              popularRoutes: [],
              peakHours: [],
              dailyTrends: [],
              cityStats: { coverage: 0, activeStations: 0, totalStations: 0, busRoutes: 0, subwayLines: 0 },
              userBehavior: {
                averageTripsPerUser: 0,
                averageSpendingPerTrip: 0,
                frequentUsers: [],
                rushHourUsage: { morning: 0, evening: 0, offPeak: 0 }
              }
            }
          }

          return {
            success: true,
            code: 200,
            message: 'success',
            data: data,
            timestamp: new Date().toISOString()
          } as ApiResponse<TravelStatistics>
        })
        .catch(error => {
          console.error('获取出行统计数据失败:', error)
          throw error
        })
    },
    mockApi.statistics.getTravelStatistics
  ),

  // 获取设备使用统计
  getDeviceUsageStatistics: createApiWrapper(
    (query?: DeviceUsageQuery): Promise<ApiResponse<DeviceUsageStatistics>> => {
      // 根据JavaScript接口要求使用Authorization请求头
      const token = localStorage.getItem('token') || ''

      const headers = new Headers()
      headers.append("Authorization", token)

      // 构建查询参数
      const searchParams = new URLSearchParams()
      if (query?.startDate) searchParams.append('startDate', query.startDate)
      if (query?.endDate) searchParams.append('endDate', query.endDate)
      if (query?.city) searchParams.append('city', query.city)
      if (query?.siteId) searchParams.append('siteId', query.siteId)

      const url = `/statistics/device${searchParams.toString() ? '?' + searchParams.toString() : ''}`

      const requestOptions: RequestInit = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
      }

      return fetch(url, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.text()
        })
        .then(result => {
          let data: DeviceUsageStatistics
          try {
            data = JSON.parse(result)
          } catch {
            // 如果解析失败，返回默认设备使用统计数据
            data = {
              totalDevices: 0,
              activeDevices: 0,
              onlineDevices: 0,
              offlineDevices: 0,
              maintenanceDevices: 0,
              devicesByType: { terminal: 0, scanner: 0, printer: 0, kiosk: 0, mobile: 0 },
              devicesByStatus: { active: 0, inactive: 0, maintenance: 0, error: 0, offline: 0 },
              usageByLocation: [],
              usageByTime: [],
              dailyUsage: [],
              topDevices: [],
              performanceMetrics: {
                averageUptime: 0,
                averageTransactionTime: 0,
                successRate: 0,
                errorRate: 0,
                maintenanceFrequency: 0
              },
              alertSummary: { critical: 0, warning: 0, info: 0, resolved: 0 },
              siteStats: []
            }
          }

          return {
            success: true,
            code: 200,
            message: 'success',
            data: data,
            timestamp: new Date().toISOString()
          } as ApiResponse<DeviceUsageStatistics>
        })
        .catch(error => {
          console.error('获取设备使用统计数据失败:', error)
          throw error
        })
    },
    mockApi.statistics.getDeviceUsageStatistics
  ),

  // 获取折扣策略统计
  getDiscountStatistics: createApiWrapper(
    (query?: DiscountStatisticsQuery): Promise<ApiResponse<DiscountStatistics>> => {
      // 根据JavaScript接口要求使用Authorization请求头
      const token = localStorage.getItem('token') || ''

      const headers = new Headers()
      headers.append("Authorization", token)

      // 构建查询参数
      const searchParams = new URLSearchParams()
      if (query?.startDate) searchParams.append('startDate', query.startDate)
      if (query?.endDate) searchParams.append('endDate', query.endDate)
      if (query?.strategyType) searchParams.append('strategyType', query.strategyType)

      const url = `/statistics/discount${searchParams.toString() ? '?' + searchParams.toString() : ''}`

      const requestOptions: RequestInit = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
      }

      return fetch(url, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.text()
        })
        .then(result => {
          let data: DiscountStatistics
          try {
            data = JSON.parse(result)
          } catch {
            // 如果解析失败，返回默认折扣策略统计数据
            data = {
              totalStrategies: 0,
              activeStrategies: 0,
              expiredStrategies: 0,
              draftStrategies: 0,
              strategyTypeDistribution: [],
              strategyUsageStats: [],
              usageTrend: [],
              cityDistribution: [],
              effectivenessAnalysis: {
                highPerformance: { count: 0, avgConversionRate: 0, topStrategies: [] },
                mediumPerformance: { count: 0, avgConversionRate: 0 },
                lowPerformance: { count: 0, avgConversionRate: 0, improvementSuggestions: [] }
              },
              userBehaviorStats: {
                totalUniqueUsers: 0,
                repeatUsageRate: 0,
                avgStrategiesPerUser: 0,
                userSegmentation: []
              },
              financialImpact: {
                totalDiscountAmount: 0,
                totalTransactionAmount: 0,
                discountRate: 0,
                estimatedRevenueLoss: 0,
                estimatedCustomerAcquisitionValue: 0,
                roi: 0
              }
            }
          }

          return {
            success: true,
            code: 200,
            message: 'success',
            data: data,
            timestamp: new Date().toISOString()
          } as ApiResponse<DiscountStatistics>
        })
        .catch(error => {
          console.error('获取折扣策略统计数据失败:', error)
          throw error
        })
    },
    mockApi.statistics.getDiscountStatistics
  ),

  // 获取站点统计
  getSiteStatistics: createApiWrapper(
    (): Promise<ApiResponse<SiteStatistics>> => {
      // 根据JavaScript接口要求使用Authorization请求头
      const token = localStorage.getItem('token') || ''

      const headers = new Headers()
      headers.append("Authorization", token)

      const requestOptions: RequestInit = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
      }

      return fetch("/statistics/site", requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.text()
        })
        .then(result => {
          let data: SiteStatistics
          try {
            data = JSON.parse(result)
          } catch {
            // 如果解析失败，返回默认站点统计数据
            data = {
              totalSites: 0,
              activeSites: 0,
              inactiveSites: 0,
              maintenanceSites: 0,
              siteTypeDistribution: [],
              sitePerformanceStats: [],
              geographicDistribution: [],
              operationalStatus: {
                online: { count: 0, percentage: 0, avgUptime: 0 },
                offline: { count: 0, percentage: 0, avgDowntime: 0 },
                maintenance: { count: 0, percentage: 0, scheduledMaintenance: 0, emergencyMaintenance: 0 }
              },
              revenueAnalysis: {
                totalRevenue: 0,
                avgRevenuePerSite: 0,
                topPerformingSites: [],
                revenueByRegion: [],
                monthlyTrend: []
              },
              deviceConfiguration: {
                totalDevices: 0,
                avgDevicesPerSite: 0,
                deviceTypeDistribution: [],
                utilizationRate: 0,
                maintenanceSchedule: { scheduled: 0, overdue: 0, completed: 0 }
              },
              trafficAnalysis: {
                totalVisits: 0,
                avgVisitsPerSite: 0,
                peakHours: [],
                customerFlow: []
              },
              serviceQualityMetrics: {
                avgResponseTime: 0,
                successRate: 0,
                customerSatisfaction: 0,
                errorRate: 0,
                maintenanceFrequency: 0,
                qualityScore: 0,
                improvements: []
              }
            }
          }

          return {
            success: true,
            code: 200,
            message: 'success',
            data: data,
            timestamp: new Date().toISOString()
          } as ApiResponse<SiteStatistics>
        })
        .catch(error => {
          console.error('获取站点统计数据失败:', error)
          throw error
        })
    },
    mockApi.statistics.getSiteStatistics
  )
}

// 系统配置相关API
export const configApi = {
  // 获取系统配置
  getConfigs: (category?: string): Promise<ApiResponse<SystemConfig[]>> => {
    return apiClient.get('/configs', { category })
  },

  // 更新系统配置
  updateConfigs: (data: UpdateConfigRequest): Promise<ApiResponse<void>> => {
    return apiClient.put('/configs', data)
  },

  // 获取单个配置
  getConfig: (key: string): Promise<ApiResponse<SystemConfig>> => {
    console.log('⚙️ 调用获取系统配置API: GET /configs/{key}', key)
    return apiClient.get(`/configs/${key}`, {}, true)
  },

  // 重置配置到默认值
  resetConfig: (key: string): Promise<ApiResponse<void>> => {
    console.log('🔄 调用重置系统配置API: POST /configs/{key}/reset', key)
    return apiClient.post(`/configs/${key}/reset`, {}, true)
  }
}

// 操作日志相关API
export const logApi = {
  // 获取操作日志
  getLogs: (query: LogQuery): Promise<ApiResponse<PageResponse<OperationLog>>> => {
    return apiClient.get('/logs', query)
  },

  // 获取日志详情
  getLog: (id: string): Promise<ApiResponse<OperationLog>> => {
    console.log('📝 调用获取操作日志API: GET /logs/{id}', id)
    return apiClient.get(`/logs/${id}`, {}, true)
  },

  // 清理日志
  clearLogs: (beforeDate: string): Promise<ApiResponse<void>> => {
    return apiClient.delete('/logs', { beforeDate })
  }
}

// 文件上传相关API
export const uploadApi = {
  // 上传头像
  uploadAvatar: (file: File, progressCallback?: (progress: number) => void): Promise<ApiResponse<{ url: string }>> => {
    return apiClient.upload('/upload/avatar', file, progressCallback)
  },

  // 上传文件
  uploadFile: (file: File, type: string, progressCallback?: (progress: number) => void): Promise<ApiResponse<{ url: string }>> => {
    return apiClient.upload(`/upload/${type}`, file, progressCallback)
  }
}

// 统计报表相关API
export const reportApi = {
  // 获取交易报表
  getTransactionReport: (params: {
    startTime: string
    endTime: string
    groupBy: 'day' | 'week' | 'month'
    type?: string
  }): Promise<ApiResponse<any>> => {
    return apiClient.get('/reports/transactions', params)
  },

  // 获取用户报表
  getUserReport: (params: {
    startTime: string
    endTime: string
    groupBy: 'day' | 'week' | 'month'
  }): Promise<ApiResponse<any>> => {
    return apiClient.get('/reports/users', params)
  },

  // 获取收入报表
  getRevenueReport: (params: {
    startTime: string
    endTime: string
    groupBy: 'day' | 'week' | 'month'
  }): Promise<ApiResponse<any>> => {
    return apiClient.get('/reports/revenue', params)
  }
}

// 折扣策略相关API - 强制使用真实API
export const discountApi = {
  // 获取折扣策略详情 - GET /discounts/{id}
  getStrategy: (id: string): Promise<ApiResponse<DiscountStrategy>> => {
    console.log('💰 调用获取折扣策略详情API: GET /discounts/' + id)
    return apiClient.get(`/discounts/${id}`, {}, true)
  },

  // 分页获取折扣策略列表 - GET /discounts
  getStrategies: (query: DiscountStrategyQuery): Promise<ApiResponse<PageResponse<DiscountStrategy>>> => {
    console.log('📋 调用分页获取折扣策略列表API: GET /discounts', query)

    // 只传递必要的筛选参数
    const params: any = {}

    // 基础分页参数
    if (query.pageNum) params.pageNum = query.pageNum
    if (query.pageSize) params.pageSize = query.pageSize

    // 主要筛选参数 - 使用驼峰格式
    // if (query.targetCity) params.targetCity = query.targetCity // 城市
    if (query.keyword) params.keyword = query.keyword // 关键词
    if (query.status) params.status = query.status // 状态
    if (query.strategyType) params.strategyType = query.strategyType // 类型
    if (query.discountType) params.discountType = query.discountType // 折扣类型

    // 使用GET方法，需要认证
    return apiClient.get('/discounts', params, true)
  },

  // 创建折扣策略 - POST /discounts
  createStrategy: (data: CreateDiscountStrategyRequest): Promise<ApiResponse<DiscountStrategy>> => {
    console.log('➕ 调用创建折扣策略API: POST /discounts', data)

    // 直接发送驼峰格式的数据
    return apiClient.post('/discounts', data, true)
  },

  // 更新折扣策略 - PUT /discounts/{id}
  updateStrategy: (id: string, data: UpdateDiscountStrategyRequest): Promise<ApiResponse<DiscountStrategy>> => {
    console.log('✏️ 调用更新折扣策略API: PUT /discounts/' + id, data)

    // 直接发送驼峰格式的数据
    return apiClient.put(`/discounts/${id}`, data, true)
  },

  // 删除折扣策略 - DELETE /discounts/{id}
  deleteStrategy: (id: string): Promise<ApiResponse<void>> => {
    console.log('🗑️ 调用删除折扣策略API: DELETE /discounts/' + id)
    return apiClient.delete(`/discounts/${id}`, {}, true)
  },

  // 启用折扣策略 - POST /discounts/{id}/enable
  enableStrategy: (id: string): Promise<ApiResponse<void>> => {
    console.log('✅ 调用启用折扣策略API: POST /discounts/' + id + '/enable')
    return apiClient.post(`/discounts/${id}/enable`, {}, true)
  },

  // 禁用折扣策略 - POST /discounts/{id}/disable
  disableStrategy: (id: string): Promise<ApiResponse<void>> => {
    console.log('❌ 调用禁用折扣策略API: POST /discounts/' + id + '/disable')
    return apiClient.post(`/discounts/${id}/disable`, {}, true)
  },

  // 批量更新策略状态 - POST /discounts/batch/status (使用FormData)
  batchUpdateStatus: (strategyIds: number[], status: 'ACTIVE' | 'INACTIVE'): Promise<ApiResponse<void>> => {
    console.log('📦 调用批量更新策略状态API: POST /discounts/batch/status (FormData)', { strategyIds, status })

    // 创建FormData对象
    const formData = new FormData()

    // 添加策略ID数组 - 用逗号连接成字符串
    formData.append('strategyIds', strategyIds.join(','))

    // 添加状态字段
    formData.append('status', status)

    // 调试：打印FormData内容
    console.log('FormData内容:')
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`)
    }

    // postFormData方法会自动添加Authorization头
    return apiClient.postFormData('/discounts/batch/status', formData)
  },

  // 获取城市可用策略 - GET /discounts/city-available
  getCityAvailableStrategies: (cityCode?: string): Promise<ApiResponse<DiscountStrategy[]>> => {
    console.log('🏙️ 调用获取城市可用策略API: GET /discounts/city-available', { cityCode })
    const params = cityCode ? { cityCode } : {}
    return apiClient.get('/discounts/city-available', params, true)
  },

  // 获取活跃策略列表 - GET /discounts/active/{strategyType}
  getActiveStrategies: (strategyType?: string): Promise<ApiResponse<DiscountStrategy[]>> => {
    const url = strategyType ? `/discounts/active/${strategyType}` : '/discounts/active'
    console.log('🔥 调用获取活跃策略列表API: GET ' + url)
    return apiClient.get(url, {}, true)
  },

  // 获取所有城市列表（保留向后兼容性）
  getCities: createApiWrapper(
    (): Promise<ApiResponse<City[]>> => {
      return siteApi.getCities()
    },
    mockApi.discount.getCities
  ),

  // 获取折扣策略统计数据
  getDiscountStatistics: (query: { startDate?: string; endDate?: string; strategyType?: string }): Promise<ApiResponse<any>> => {
    // 根据接口：GET /statistics/discount?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&strategyType=xxx
    const params: any = {}
    if (query.startDate) params.startDate = query.startDate
    if (query.endDate) params.endDate = query.endDate
    if (query.strategyType) params.strategyType = query.strategyType
    return apiClient.get('/statistics/discount', params)
  }
}

// 设备管理相关API
export const deviceApi = {
  // 获取设备列表（支持分页和筛选）
  getDevices: createApiWrapper(
    (query: DeviceQuery): Promise<ApiResponse<PageResponse<Device>>> => {
      // 构建查询参数对象
      const params: Record<string, any> = {}

      // 添加所有查询参数 - 使用驼峰格式
      if (query.pageNum) params.pageNum = query.pageNum
      if (query.pageSize) params.pageSize = query.pageSize
      if (query.keyword !== undefined) params.keyword = query.keyword
      if (query.siteId !== undefined) params.siteId = query.siteId
      if (query.status !== undefined) params.status = query.status
      if (query.deviceType !== undefined) params.deviceType = query.deviceType
      if (query.firmwareVersion !== undefined) params.firmwareVersion = query.firmwareVersion
      if (query.startTime !== undefined) params.startTime = query.startTime
      if (query.endTime !== undefined) params.endTime = query.endTime
      if (query.heartbeatStartTime !== undefined) params.heartbeatStartTime = query.heartbeatStartTime
      if (query.heartbeatEndTime !== undefined) params.heartbeatEndTime = query.heartbeatEndTime
      if (query.orderBy !== undefined) params.orderBy = query.orderBy
      if (query.orderDirection !== undefined) params.orderDirection = query.orderDirection
      if (query.isOnline !== undefined) params.isOnline = query.isOnline
      if (query.heartbeatTimeoutMinutes !== undefined) params.heartbeatTimeoutMinutes = query.heartbeatTimeoutMinutes

      // 使用apiClient发送GET请求，这样会自动使用正确的baseURL和认证
      return apiClient.get<PageResponse<Device>>('/devices', params)
    },
    mockApi.device.getDevices
  ),

  // 获取设备详情
  getDevice: createApiWrapper(
    (id: string): Promise<ApiResponse<Device>> => {
      // 使用apiClient发送GET请求，这样会自动使用正确的baseURL和认证
      return apiClient.get<Device>(`/devices/${id}`)
    },
    mockApi.device.getDevice
  ),

  // 创建设备
  createDevice: (data: CreateDeviceRequest): Promise<ApiResponse<Device>> => {
    console.log('➕ 调用创建设备API: POST /devices', data)
    // 直接发送驼峰格式的数据
    return apiClient.post<Device>('/devices', data, true)
  },

  // 更新设备
  updateDevice: (id: string, data: UpdateDeviceRequest): Promise<ApiResponse<Device>> => {
    console.log('✏️ 调用更新设备API: PUT /devices/{id}', id, data)
    // 直接发送驼峰格式的数据
    return apiClient.put<Device>(`/devices/${id}`, data, true)
  },

  // 删除设备
  deleteDevice: (id: string): Promise<ApiResponse<void>> => {
    console.log('🗑️ 调用删除设备API: DELETE /devices/{id}', id)
    return apiClient.delete<void>(`/devices/${id}`, {}, true)
  },

  // 获取站点列表
  getSites: createApiWrapper(
    (): Promise<ApiResponse<Site[]>> => {
      // 获取用户ID，按照接口要求使用X-User-Id请求头
      const userId = localStorage.getItem('userId') || ''
      const token = localStorage.getItem('authToken') || ''

      const headers = new Headers()
      headers.append("X-User-Id", userId)
      headers.append("Authorization", token)

      const requestOptions: RequestInit = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
      }

      return fetch("/site", requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.text()
        })
        .then(result => {
          let data: Site[]
          try {
            data = JSON.parse(result)
          } catch {
            data = []
          }

          return {
            success: true,
            code: 200,
            message: 'success',
            data: data,
            timestamp: new Date().toISOString()
          } as ApiResponse<Site[]>
        })
        .catch(error => {
          console.error('获取站点列表失败:', error)
          throw error
        })
    },
    mockApi.device.getSites
  ),

  // 批量更新设备状态
  batchUpdateDeviceStatus: createApiWrapper(
    (deviceIds: number[], status: 'ACTIVE' | 'INACTIVE'): Promise<ApiResponse<void>> => {
      // 构建查询参数
      const params = {
        deviceIds: `[${deviceIds.join(',')}]`,
        status: status
      }

      // 使用apiClient发送POST请求
      return apiClient.post<void>('/devices/batch/status', params)
    },
    mockApi.device.batchUpdateDeviceStatus
  ),

  // 更新设备心跳
  updateDeviceHeartbeat: createApiWrapper(
    (deviceCode: string): Promise<ApiResponse<void>> => {
      // 使用apiClient发送POST请求
      return apiClient.post<void>(`/devices/heartbeat?deviceCode=${deviceCode}`)
    },
    mockApi.device.updateDeviceHeartbeat
  ),

  // 搜索设备
  searchDevices: createApiWrapper(
    (keyword: string): Promise<ApiResponse<Device[]>> => {
      // 使用apiClient发送GET请求
      const params = { keyword: keyword }
      return apiClient.get<Device[]>('/devices/search', params)
    },
    mockApi.device.searchDevices
  )
}

// 站点管理API
export const siteApi = {
  // 获取城市列表 - 使用统一的ApiClient
  getCities: (): Promise<ApiResponse<City[]>> => {
    console.log('🏙️ 调用获取城市列表API: GET /site')
    return apiClient.get<City[]>('/site', {}, true)
  },

  // 分页查询站点列表
  getSites: (query: SiteQuery): Promise<ApiResponse<SiteListResponse>> => {
    console.log('📍 调用分页查询站点列表API: GET /site', query)

    // 构建查询参数对象，确保所有参数都被正确传递
    const params: any = {}

    // 分页参数 - 根据后端接口调整参数名
    if (query.pageNum !== undefined) params.pageNum = query.pageNum  // 后端使用 pageNum
    if (query.pageSize !== undefined) params.pageSize = query.pageSize   // 后端使用 pageSize

    // 筛选参数 - 使用驼峰格式
    if (query.keyword && query.keyword.trim()) params.keyword = query.keyword.trim()
    if (query.status && query.status.trim()) params.status = query.status.trim()
    if (query.siteType && query.siteType.trim()) params.siteType = query.siteType.trim()
    if (query.city && query.city.trim()) params.city = query.city.trim()
    if (query.lineName && query.lineName.trim()) params.lineName = query.lineName.trim()

    // 时间范围参数
    if (query.startTime) params.startTime = query.startTime
    if (query.endTime) params.endTime = query.endTime

    // 排序参数
    if (query.orderBy) params.orderBy = query.orderBy
    if (query.orderDirection) params.orderDirection = query.orderDirection

    // 地理位置参数
    if (query.minLongitude !== undefined) params.minLongitude = query.minLongitude
    if (query.maxLongitude !== undefined) params.maxLongitude = query.maxLongitude
    if (query.minLatitude !== undefined) params.minLatitude = query.minLatitude
    if (query.maxLatitude !== undefined) params.maxLatitude = query.maxLatitude

    console.log('🔗 最终查询参数:', params)

    // 让ApiClient自动处理URL参数拼接
    return apiClient.get<SiteListResponse>('/site', params, true)
  },

  // 获取站点详情
  getSiteById: (id: string): Promise<ApiResponse<Site>> => {
    console.log('🔍 调用获取站点详情API: GET /site/{id}', id)
    return apiClient.get<Site>(`/site/${id}`, {}, true)
  },

  // 创建站点
  createSite: (siteData: SiteCreateRequest): Promise<ApiResponse<Site>> => {
    console.log('➕ 调用创建站点API: POST /site', siteData)
    // 直接发送驼峰格式的数据，因为后端返回的也是驼峰格式
    return apiClient.post<Site>('/site', siteData, true)
  },

  // 更新站点
  updateSite: (id: string, siteData: SiteUpdateRequest): Promise<ApiResponse<Site>> => {
    console.log('✏️ 调用更新站点API: PUT /site/{id}', id, siteData)
    // 直接发送驼峰格式的数据，因为后端返回的也是驼峰格式
    return apiClient.put<Site>(`/site/${id}`, siteData, true)
  },

  // 删除站点
  deleteSite: (id: string): Promise<ApiResponse<void>> => {
    console.log('🗑️ 调用删除站点API: DELETE /site/{id}', id)
    return apiClient.delete<void>(`/site/${id}`, {}, true)
  },

  // 搜索站点
  searchSites: (keyword: string): Promise<ApiResponse<Site[]>> => {
    console.log('🔍 调用搜索站点API: GET /site/search', keyword)
    return apiClient.get<Site[]>('/site/search', { keyword }, true)
  },

  // 获取线路列表
  getLines: (query?: LineQuery): Promise<ApiResponse<LineListResponse>> => {
    console.log('🚇 调用获取线路列表API: GET /site/lines', query)
    return apiClient.get<LineListResponse>('/site/lines', query || {}, true)
  },

  // 获取站点统计数据
  getSiteStatistics: (): Promise<ApiResponse<any>> => {
    return apiClient.get('/statistics/site', {})
  },

  // 获取设备统计数据
  getDeviceStatistics: (query: { startDate?: string; endDate?: string; city?: string; siteId?: number }): Promise<ApiResponse<any>> => {
    const params: any = {}
    if (query.startDate) params.startDate = query.startDate
    if (query.endDate) params.endDate = query.endDate
    if (query.city) params.city = query.city
    if (query.siteId) params.siteId = query.siteId
    return apiClient.get('/statistics/device', params)
  },

  // 获取出行统计数据（事件记录列表）
  getTravelStatistics: (query: { pageNum: number; pageSize: number }): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams({
      pageNum: query.pageNum.toString(),
      pageSize: query.pageSize.toString()
    })
    return apiClient.get(`/statistics/travel?${params.toString()}`)
  }
}
