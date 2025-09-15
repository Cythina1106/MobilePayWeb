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
