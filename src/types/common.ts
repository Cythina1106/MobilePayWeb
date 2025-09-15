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