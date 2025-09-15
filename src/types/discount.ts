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
