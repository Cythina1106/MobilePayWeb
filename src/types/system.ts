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
