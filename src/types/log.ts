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
