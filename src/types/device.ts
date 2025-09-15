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
