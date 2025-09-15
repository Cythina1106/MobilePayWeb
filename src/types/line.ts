// 线路相关类型
 export interface Line {
  id: string
  line_name: string
  line_code: string
  line_type: 'subway' | 'bus' | 'train' | 'highway' | 'other'
  city: string
  status: 'active' | 'inactive' | 'maintenance' | 'construction'
  description?: string
  total_stations?: number
  total_length?: number
  operating_company?: string
  start_station?: string
  end_station?: string
  operating_hours?: {
    start_time: string
    end_time: string
  }
  ticket_price_range?: {
    min_price: number
    max_price: number
  }
  createTime: string
  updateTime: string
}

export interface LineQuery {
  lineName?: string
  lineCode?: string
  lineType?: string
  city?: string
  status?: string
  pageNum?: number
  pageSize?: number
  keyword?: string
}

export interface LineListResponse {
  list: Line[]
  total: number
  page: number
  limit: number
}

export interface LineCreateRequest {
  line_name: string
  line_code: string
  line_type: 'subway' | 'bus' | 'train' | 'highway' | 'other'
  city: string
  status: 'active' | 'inactive' | 'maintenance' | 'construction'
  description?: string
  total_stations?: number
  total_length?: number
  operating_company?: string
  start_station?: string
  end_station?: string
  operating_hours?: {
    start_time: string
    end_time: string
  }
  ticket_price_range?: {
    min_price: number
    max_price: number
  }
}

export interface LineUpdateRequest extends Partial<LineCreateRequest> {
  id: string
}
