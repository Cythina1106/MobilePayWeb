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
