// API 响应基础类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp?: string
  success: boolean
}

// API 错误类型
export interface ApiError {
  code: number
  message: string
  details?: any
}

// 分页响应类型
export interface PageResponse<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
  totalPages: number
}

// 登录相关类型
export interface LoginRequest {
  username: string
  password: string
  captcha?: string
  captchaKey?: string
  remember_me: boolean
}

export interface LoginResponse {
  token: string
  accessToken?: string
  tokenType?: string
  refreshToken?: string
  userInfo: UserInfo
  permissions: string[]
  rememberMe?: boolean
}

export interface UserInfo {
  id: string
  username: string
  name: string
  email?: string
  phone?: string
  avatar?: string
  role: 'superAdmin' | 'admin' | 'operator' | 'viewer'
  roleName?: string  // 角色中文名称
  status: 'active' | 'inactive' | 'locked'
  createTime: string
  lastLoginTime?: string
  permissions: string[]
}

export interface RefreshTokenResponse {
  token: string
  refreshToken?: string
  expiresIn: number
  tokenType?: string
}

// 交易相关类型
export interface Transaction {
  id: string
  orderNo: string
  userId: string
  userName: string
  userPhone?: string
  amount: number
  paymentMethod: 'balance' | 'bank_card' | 'alipay' | 'wechat'
  paymentChannel?: string
  status: 'pending' | 'success' | 'failed' | 'cancelled' | 'refunded'
  type: 'payment' | 'refund' | 'transfer'
  description?: string
  merchantId?: string
  merchantName?: string
  createTime: string
  updateTime: string
  completeTime?: string
  remark?: string
  refundAmount?: number
  refundReason?: string
}

export interface TransactionQuery {
  pageNum?: number
  pageSize?: number
  orderNo?: string
  userId?: string
  userName?: string
  status?: string
  paymentMethod?: string
  type?: string
  startTime?: string
  endTime?: string
  minAmount?: number
  maxAmount?: number
}

// 用户管理相关类型
export interface User {
  id: string
  username: string
  name: string
  email?: string
  phone: string
  avatar?: string
  balance: number
  status: 'normal' | 'frozen' | 'disabled'
  isVip: boolean
  vipLevel?: number
  createTime: string
  lastLoginTime?: string
  totalTransactions: number
  totalAmount: number
  remark?: string
}

export interface UserQuery {
  pageNum?: number
  pageSize?: number
  keyword?: string
  status?: string
  startTime?: string
  endTime?: string
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
  username?: string
  name?: string
  phone?: string
  email?: string
  isVip?: boolean
}

export interface CreateUserRequest {
  username: string
  name: string
  phone: string
  email?: string
  password: string
  initialBalance?: number
  remark?: string
}

export interface UpdateUserRequest {
  id: string
  name?: string
  phone?: string
  email?: string
  status?: string
  remark?: string
}

export interface UserSearchQuery {
  keyword: string
}

export interface UserSearchResult {
  users: User[]
  total: number
}

export interface PendingUserQuery {
  pageNum?: number
  pageSize?: number
  keyword?: string
  startTime?: string
  endTime?: string
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}

export interface PendingUser {
  id: string
  username: string
  name: string
  email?: string
  phone: string
  avatar?: string
  status: 'pending' | 'reviewing' | 'rejected'
  submitTime: string
  reviewTime?: string
  reviewerId?: string
  reviewerName?: string
  rejectReason?: string
  documents: {
    idCard?: string
    businessLicense?: string
    bankCard?: string
    photos?: string[]
  }
  remark?: string
}

export interface PendingUserResult {
  users: PendingUser[]
  total: number
}

// 用户审核相关类型
export interface UserAuditRequest {
  audit_result: 'APPROVED' | 'REJECTED'
  audit_reason: string
  audit_type: 'REGISTER' | 'KYC' | 'MERCHANT' | 'WITHDRAWAL'
}

export interface UserAuditResponse {
  success: boolean
  message: string
  auditId?: string
  auditTime?: string
  auditorId?: string
  auditorName?: string
}

// 用户拒绝审核请求类型 - 专门用于 /user/{id}/reject 接口
export interface UserRejectRequest {
  audit_result: 'REJECTED'
  audit_reason: string
  audit_type: 'REGISTER' | 'KYC' | 'MERCHANT' | 'WITHDRAWAL'
}

export interface UserRejectResponse {
  success: boolean
  message: string
  auditId?: string
  auditTime?: string
  auditorId?: string
  auditorName?: string
}

// 用户启用/禁用相关类型
export interface UserEnableResponse {
  success: boolean
  message: string
  userId: string
  status: 'normal' | 'frozen' | 'disabled'
  operationTime: string
  operatorId?: string
  operatorName?: string
}

export interface UserDisableResponse {
  success: boolean
  message: string
  userId: string
  status: 'normal' | 'frozen' | 'disabled'
  operationTime: string
  operatorId?: string
  operatorName?: string
  reason?: string
}

// 统计数据类型
export interface DashboardStats {
  todayTransactions: {
    count: number
    amount: number
    successRate: number
  }
  totalUsers: {
    count: number
    activeCount: number
    newCount: number
  }
  totalBalance: number
  systemStatus: {
    uptime: string
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
  }
  recentTransactions: Transaction[]
  paymentMethodStats: {
    method: string
    count: number
    amount: number
    percentage: number
  }[]
  transactionTrend: {
    date: string
    count: number
    amount: number
  }[]
}

// 用户统计数据类型
export interface UserStatistics {
  totalUsers: number
  activeUsers: number
  newUsers: number
  verifiedUsers: number
  usersByStatus: {
    active: number
    inactive: number
    locked: number
    pending: number
  }
  usersByRole: {
    superAdmin: number
    admin: number
    operator: number
    viewer: number
  }
  userGrowthTrend: {
    date: string
    newUsers: number
    totalUsers: number
  }[]
  userActivityStats: {
    lastLogin: {
      today: number
      thisWeek: number
      thisMonth: number
    }
    transactions: {
      averagePerUser: number
      topUsers: {
        userId: string
        username: string
        transactionCount: number
      }[]
    }
  }
}

// 设备使用统计接口
export interface DeviceUsageStatistics {
  totalDevices: number
  activeDevices: number
  onlineDevices: number
  offlineDevices: number
  maintenanceDevices: number
  devicesByType: {
    terminal: number
    scanner: number
    printer: number
    kiosk: number
    mobile: number
  }
  devicesByStatus: {
    active: number
    inactive: number
    maintenance: number
    error: number
    offline: number
  }
  usageByLocation: Array<{
    cityCode: string
    cityName: string
    totalDevices: number
    activeDevices: number
    usageRate: number
    totalTransactions: number
    revenue: number
  }>
  usageByTime: Array<{
    hour: number
    activeDevices: number
    transactions: number
    revenue: number
  }>
  dailyUsage: Array<{
    date: string
    activeDevices: number
    totalTransactions: number
    revenue: number
    errorCount: number
    maintenanceCount: number
  }>
  topDevices: Array<{
    deviceId: string
    deviceCode: string
    deviceName: string
    location: string
    transactionCount: number
    revenue: number
    uptime: number
    lastMaintenance: string
  }>
  performanceMetrics: {
    averageUptime: number
    averageTransactionTime: number
    successRate: number
    errorRate: number
    maintenanceFrequency: number
  }
  alertSummary: {
    critical: number
    warning: number
    info: number
    resolved: number
  }
  siteStats: Array<{
    siteId: string
    siteName: string
    totalDevices: number
    activeDevices: number
    revenue: number
    transactions: number
  }>
}

// 设备使用统计查询参数
export interface DeviceUsageQuery {
  startDate?: string
  endDate?: string
  city?: string
  siteId?: string
}

// 出行数据统计接口
export interface TravelStatistics {
  totalTrips: number
  activeRoutes: number
  totalDistance: number
  totalPayments: number
  paymentMethods: {
    qrCode: number
    nfc: number
    card: number
    wallet: number
  }
  tripsByTransportType: {
    subway: number
    bus: number
    taxi: number
    bike: number
    walking: number
  }
  popularRoutes: Array<{
    routeId: string
    routeName: string
    startStation: string
    endStation: string
    tripCount: number
    averageTime: number
    totalRevenue: number
  }>
  peakHours: Array<{
    hour: number
    tripCount: number
    revenue: number
  }>
  dailyTrends: Array<{
    date: string
    tripCount: number
    revenue: number
    averageDistance: number
  }>
  cityStats: {
    coverage: number
    activeStations: number
    totalStations: number
    busRoutes: number
    subwayLines: number
  }
  userBehavior: {
    averageTripsPerUser: number
    averageSpendingPerTrip: number
    frequentUsers: Array<{
      userId: string
      username: string
      tripCount: number
      totalSpending: number
    }>
    rushHourUsage: {
      morning: number
      evening: number
      offPeak: number
    }
  }
}

// 系统设置类型
export interface SystemConfig {
  id: string
  key: string
  value: string
  description: string
  type: 'string' | 'number' | 'boolean' | 'json'
  category: 'payment' | 'security' | 'notification' | 'system'
  updateTime: string
}

export interface UpdateConfigRequest {
  configs: {
    key: string
    value: string
  }[]
}

// 操作日志类型
export interface OperationLog {
  id: string
  userId: string
  userName: string
  operation: string
  module: string
  description: string
  ip: string
  userAgent: string
  createTime: string
  status: 'success' | 'failed'
  errorMessage?: string
}

export interface LogQuery {
  pageNum?: number
  pageSize?: number
  userId?: string
  userName?: string
  operation?: string
  module?: string
  startTime?: string
  endTime?: string
  status?: string
}

// 折扣策略相关类型
export interface DiscountStrategy {
  id: string
  strategy_name: string
  strategy_code?: string
  description: string
  strategy_type: 'TRAVEL' | 'PAYMENT' | 'NEW_USER' | 'HOLIDAY'
  discount_type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'LADDER'
  status?: 'active' | 'inactive' | 'expired'
  discount_rate: number
  discount_amount: number
  min_amount: number
  max_discount: number
  target_user_type: 'ALL' | 'NEW' | 'VIP' | 'REGULAR'
  target_cities: string[]
  target_sites: number[]
  start_time: string
  end_time: string
  usage_limit: number
  user_usage_limit: number
  priority: number
  stackable: boolean
  created_by?: string
  created_time?: string
  last_modified?: string

  // 保持兼容性的字段映射
  name?: string
  type?: 'percentage' | 'fixed' | 'tiered' | 'combo' | 'NEW_USER' | 'REGULAR' | 'VIP' | 'SPECIAL'
  target_city?: string
  target_city_name?: string
  valid_start_time?: string
  valid_end_time?: string
  conditions?: {
    min_amount?: number
    max_amount?: number
    payment_methods?: string[]
    user_types?: string[]
    first_time_only?: boolean
    max_usage?: number
    used_count?: number
  }
  discount?: {
    value: number
    max_discount?: number
    tiers?: { min_amount: number; discount: number }[]
  }
  cityCode?: string
  cityName?: string
  startDate?: string
  endDate?: string
  createdTime?: string
  lastModified?: string
}

export interface City {
  cityCode: string
  cityName: string
  provinceCode: string
  provinceName: string
  isActive: boolean
}

export interface DiscountStrategyQuery {
  pageNum?: number
  pageSize?: number
  targetCity?: string // 城市
  keyword?: string // 关键词
  status?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' // 状态
  strategyType?: 'TRAVEL' | 'PAYMENT' | 'NEW_USER' | 'HOLIDAY' // 类型
  discountType?: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'LADDER' // 折扣类型
}

export interface CreateDiscountStrategyRequest {
  strategyName: string
  strategyCode?: string
  description: string
  strategyType: 'TRAVEL' | 'PAYMENT' | 'NEW_USER' | 'HOLIDAY'
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'LADDER'
  discountRate: number
  discountAmount: number
  minAmount: number
  maxDiscount: number
  targetUserType: 'ALL' | 'NEW' | 'VIP' | 'REGULAR'
  targetCities: string[]
  targetSites: number[]
  startTime: string
  endTime: string
  usageLimit: number
  userUsageLimit: number
  priority: number
  stackable: boolean
}

export interface UpdateDiscountStrategyRequest {
  strategyName: string
  strategyCode?: string
  description: string
  strategyType: 'TRAVEL' | 'PAYMENT' | 'NEW_USER' | 'HOLIDAY'
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'LADDER'
  discountRate: number
  discountAmount: number
  minAmount: number
  maxDiscount: number
  targetUserType: 'ALL' | 'NEW' | 'VIP' | 'REGULAR'
  targetCities: string[]
  targetSites: number[]
  startTime: string
  endTime: string
  usageLimit: number
  userUsageLimit: number
  priority: number
  stackable: boolean
  status?: 'active' | 'inactive' | 'expired'
}

// 设备管理相关类型
export interface Device {
  id: string
  deviceName: string
  deviceCode: string
  deviceType: string
  firmwareVersion: string
  siteId: string
  siteName?: string
  status: 'online' | 'offline' | 'maintenance' | 'error'
  isOnline: boolean
  lastHeartbeatTime: string
  createdTime: string
  updatedTime: string
  ipAddress?: string
  macAddress?: string
  location?: string
  description?: string
  heartbeatTimeoutMinutes: number

  // 兼容字段，用于向后兼容
  device_name?: string
  device_code?: string
  device_type?: string
  firmware_version?: string
  is_online?: boolean
  last_heartbeat_time?: string
  created_time?: string
  updated_time?: string
  ip_address?: string
  mac_address?: string
  heartbeat_timeout_minutes?: number
}

export interface DeviceQuery {
  pageNum?: number
  pageSize?: number
  keyword?: string
  siteId?: string
  status?: string
  deviceType?: string
  firmwareVersion?: string
  startTime?: string
  endTime?: string
  heartbeatStartTime?: string
  heartbeatEndTime?: string
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
  isOnline?: boolean
  heartbeatTimeoutMinutes?: number
}

export interface DeviceSearchQuery {
  keyword: string
}

export interface CreateDeviceRequest {
  deviceCode: string
  deviceName: string
  siteId: string
  deviceType: string
  description?: string
  firmwareVersion: string
  ipAddress?: string
  macAddress?: string
  location?: string
}

export interface UpdateDeviceRequest {
  deviceCode: string
  deviceName: string
  siteId: string
  deviceType: string
  description: string
  firmwareVersion: string
  ipAddress: string
  macAddress: string
  location: string
}

// 闸机管理相关类型（基于Device类型）
export type Gate = Device

export interface GateQuery extends DeviceQuery {
  deviceType?: string
  siteId?: string
}

export interface GateListResponse {
  records: Gate[]
  total: number
  size: number
  current: number
  pages: number
  // 向后兼容的字段映射
  gates?: Gate[]
  pageNum?: number
  pageSize?: number
  totalPages?: number
}

export interface GateCreateRequest extends CreateDeviceRequest {
  // 闸机特有字段可以在这里扩展
}

export interface GateUpdateRequest extends UpdateDeviceRequest {
  // 闸机特有字段可以在这里扩展
}

// 设备心跳请求
export interface DeviceHeartbeatRequest {
  deviceCode: string
  timestamp?: string
}

// 批量更新设备状态请求
export interface DeviceBatchStatusRequest {
  deviceIds: string[]
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'ERROR'
}

export interface Site {
  siteId: number
  siteName: string
  siteCode: string
  siteAddress: string | null
  contactPerson: string | null
  contactPhone: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
  statusName: string
  siteType: string | null
  siteTypeName: string
  type: 'SUBWAY' | 'BUS' | 'TRAIN'
  typeName: string
  city: string
  lineName: string
  longitude: number
  latitude: number
  businessStartTime: string | null
  businessEndTime: string | null
  createdTime: string
  updatedTime: string

  // 兼容字段，用于向后兼容
  id?: string
  name?: string
  address?: string
  site_name?: string
  site_code?: string
  site_address?: string
  contact_person?: string
  contact_phone?: string
  site_type?: string
  description?: string
  line_name?: string
  business_start_time?: string
  business_end_time?: string
  created_time?: string
  updated_time?: string
}

// 折扣策略统计相关类型
export interface DiscountStatisticsQuery {
  startDate?: string
  endDate?: string
  strategyType?: string
}

export interface DiscountStatistics {
  // 基础统计信息
  totalStrategies: number
  activeStrategies: number
  expiredStrategies: number
  draftStrategies: number

  // 策略类型分布
  strategyTypeDistribution: {
    type: string
    name: string
    count: number
    percentage: number
    totalDiscount: number
    avgDiscount: number
  }[]

  // 策略使用统计
  strategyUsageStats: {
    strategyId: string
    strategyName: string
    strategyType: string
    usageCount: number
    totalDiscountAmount: number
    avgDiscountAmount: number
    conversionRate: number
    cityDistribution: {
      cityCode: string
      cityName: string
      usageCount: number
      discountAmount: number
    }[]
  }[]

  // 时间趋势分析
  usageTrend: {
    date: string
    totalUsage: number
    totalDiscountAmount: number
    activeStrategies: number
    newStrategies: number
    avgDiscountPerUser: number
  }[]

  // 城市分布统计
  cityDistribution: {
    cityCode: string
    cityName: string
    strategiesCount: number
    totalUsage: number
    totalDiscountAmount: number
    topStrategies: {
      strategyId: string
      strategyName: string
      usageCount: number
      discountAmount: number
    }[]
  }[]

  // 效果分析
  effectivenessAnalysis: {
    highPerformance: {
      count: number
      avgConversionRate: number
      topStrategies: string[]
    }
    mediumPerformance: {
      count: number
      avgConversionRate: number
    }
    lowPerformance: {
      count: number
      avgConversionRate: number
      improvementSuggestions: string[]
    }
  }

  // 用户行为分析
  userBehaviorStats: {
    totalUniqueUsers: number
    repeatUsageRate: number
    avgStrategiesPerUser: number
    userSegmentation: {
      segment: string
      userCount: number
      avgDiscountUsage: number
      favoriteStrategyTypes: string[]
    }[]
  }

  // 财务影响分析
  financialImpact: {
    totalDiscountAmount: number
    totalTransactionAmount: number
    discountRate: number
    estimatedRevenueLoss: number
    estimatedCustomerAcquisitionValue: number
    roi: number
  }
}

// 站点统计数据类型
export interface SiteStatistics {
  // 基础统计信息
  totalSites: number
  activeSites: number
  inactiveSites: number
  maintenanceSites: number

  // 站点类型分布
  siteTypeDistribution: {
    type: string
    name: string
    count: number
    percentage: number
    avgDailyTransactions: number
    avgRevenue: number
  }[]

  // 站点性能统计
  sitePerformanceStats: {
    siteId: string
    siteName: string
    siteCode: string
    location: string
    deviceCount: number
    dailyTransactions: number
    dailyRevenue: number
    uptime: number
    efficiency: number
    ranking: number
    lastMaintenanceDate: string
  }[]

  // 地理分布统计
  geographicDistribution: {
    province: string
    city: string
    siteCount: number
    deviceCount: number
    totalTransactions: number
    totalRevenue: number
    avgSitePerformance: number
    coverage: {
      totalArea: number
      coveredArea: number
      coverageRate: number
    }
  }[]

  // 运营状态分析
  operationalStatus: {
    online: {
      count: number
      percentage: number
      avgUptime: number
    }
    offline: {
      count: number
      percentage: number
      avgDowntime: number
    }
    maintenance: {
      count: number
      percentage: number
      scheduledMaintenance: number
      emergencyMaintenance: number
    }
  }

  // 收入分析
  revenueAnalysis: {
    totalRevenue: number
    avgRevenuePerSite: number
    topPerformingSites: {
      siteId: string
      siteName: string
      revenue: number
      growth: number
    }[]
    revenueByRegion: {
      region: string
      revenue: number
      siteCount: number
      avgRevenuePerSite: number
    }[]
    monthlyTrend: {
      month: string
      revenue: number
      transactionCount: number
      newSites: number
      avgRevenuePerSite: number
    }[]
  }

  // 设备配置统计
  deviceConfiguration: {
    totalDevices: number
    avgDevicesPerSite: number
    deviceTypeDistribution: {
      type: string
      count: number
      percentage: number
      avgPerSite: number
    }[]
    utilizationRate: number
    maintenanceSchedule: {
      scheduled: number
      overdue: number
      completed: number
    }
  }

  // 用户流量分析
  trafficAnalysis: {
    totalVisits: number
    avgVisitsPerSite: number
    peakHours: {
      hour: number
      visits: number
      sites: string[]
    }[]
    customerFlow: {
      siteId: string
      siteName: string
      dailyVisits: number
      peakTime: string
      conversionRate: number
    }[]
  }

  // 服务质量指标
  serviceQualityMetrics: {
    avgResponseTime: number
    successRate: number
    customerSatisfaction: number
    errorRate: number
    maintenanceFrequency: number
    qualityScore: number
    improvements: {
      category: string
      suggestion: string
      priority: 'high' | 'medium' | 'low'
      impact: number
    }[]
  }
}

// 用户出行记录相关类型
export interface TravelRecord {
  id: string
  userId: string
  startLocation: string
  endLocation: string
  startTime: string
  endTime: string
  distance: number
  duration: number
  cost: number
  paymentMethod: string
  status: 'completed' | 'cancelled' | 'ongoing'
  vehicleType: string
  routePoints?: Array<{
    latitude: number
    longitude: number
    timestamp: string
  }>
  createTime: string
  updateTime: string
}

export interface TravelRecordsQuery {
  pageNum: number
  pageSize: number
  userId?: string
  startDate?: string
  endDate?: string
  status?: string
  vehicleType?: string
}

export interface TravelRecordsResponse {
  records: TravelRecord[]
  total: number
  pageNum: number
  pageSize: number
  totalPages: number
}

// 站点管理相关查询类型
export interface SiteQuery {
  pageNum: number
  pageSize: number
  keyword?: string
  status?: string
  siteType?: string
  city?: string
  lineName?: string
  startTime?: string
  endTime?: string
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
  minLongitude?: number
  maxLongitude?: number
  minLatitude?: number
  maxLatitude?: number
}

export interface SiteListResponse {
  records: Site[]
  total: number
  size: number
  current: number
  pages: number

  // 兼容字段，用于向后兼容
  sites?: Site[]
  pageNum?: number
  pageSize?: number
  totalPages?: number
}

export interface SiteCreateRequest {
  siteName: string
  siteCode: string
  siteAddress: string
  contactPerson: string
  contactPhone: string
  siteType: 'BRANCH' | 'HQ' | 'TERMINAL' | 'STATION' | 'DEPOT' | 'OFFICE'
  description: string
  longitude: number
  latitude: number
  city: string
  lineName: string
  businessStartTime: string
  businessEndTime: string
}

export interface SiteUpdateRequest extends Partial<SiteCreateRequest> {
  id: string
}

// 线路相关类型
export interface Line {
  id: string
  line_name: string
  line_code: string
  line_type: 'subway' | 'bus' | 'train' | 'highway' | 'other'
  city: string
  status: 'active' | 'inactive' | 'maintenance' | 'construction'
  description?: string
  total_stations?: number
  total_length?: number
  operating_company?: string
  start_station?: string
  end_station?: string
  operating_hours?: {
    start_time: string
    end_time: string
  }
  ticket_price_range?: {
    min_price: number
    max_price: number
  }
  createTime: string
  updateTime: string
}

export interface LineQuery {
  lineName?: string
  lineCode?: string
  lineType?: string
  city?: string
  status?: string
  pageNum?: number
  pageSize?: number
  keyword?: string
}

export interface LineListResponse {
  list: Line[]
  total: number
  page: number
  limit: number
}

export interface LineCreateRequest {
  line_name: string
  line_code: string
  line_type: 'subway' | 'bus' | 'train' | 'highway' | 'other'
  city: string
  status: 'active' | 'inactive' | 'maintenance' | 'construction'
  description?: string
  total_stations?: number
  total_length?: number
  operating_company?: string
  start_station?: string
  end_station?: string
  operating_hours?: {
    start_time: string
    end_time: string
  }
  ticket_price_range?: {
    min_price: number
    max_price: number
  }
}

export interface LineUpdateRequest extends Partial<LineCreateRequest> {
  id: string
}
