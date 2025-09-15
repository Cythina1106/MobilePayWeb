import { Transaction } from './transaction';

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
