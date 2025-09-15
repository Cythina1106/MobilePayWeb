// 闸机相关类型
export interface Gate {
  id: string
  stationId: string
  stationName: string
  gateNumber: string
  type: 'entry' | 'exit' | 'bidirectional'
  position: string
  status: 'online' | 'offline' | 'error' | 'maintenance'
  model: string
  serialNumber: string
  installDate: string
  lastMaintenance: string
  dailyPassages: number
  errorCount: number
}

// 闸机用户类型
export interface GateUser {
  id: string
  cardNumber: string
  userName: string
  phone: string
  userType: 'regular' | 'student' | 'senior' | 'staff'
  status: 'active' | 'suspended' | 'expired'
  balance: number
  registrationDate: string
  lastUsed: string
  totalTrips: number
  monthlyLimit: number
  avatar?: string
}

// 区域数据类型
export interface RegionData {
  [province: string]: {
    [city: string]: string[]
  }
}

// 站点类型
export interface Station {
  id: string
  name: string
  code: string
  line: string
  city: string
  province: string
  district: string
  address: string
  status: 'active' | 'inactive' | 'maintenance'
  openTime: string
  closeTime: string
  gateCount: number
  dailyFlow: number
  createdTime: string
  lastUpdated: string
}