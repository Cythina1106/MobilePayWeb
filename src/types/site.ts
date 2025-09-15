// 站点相关类型
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
      avgDowntime: number
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
