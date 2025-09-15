import { useState, useEffect } from 'react'

interface TripRecord {
  id: string
  userId: string
  cardNumber: string
  userName: string
  entryGateId: string
  exitGateId: string
  entryStation: string
  exitStation: string
  entryTime: string
  exitTime: string
  duration: string
  distance: number
  fare: number
  paymentMethod: 'mobile' | 'card' | 'cash'
  paymentStatus: 'success' | 'failed' | 'pending'
  createdTime: string
  updatedTime: string
}

// 模拟数据
const initialTripRecords: TripRecord[] = [
  {
    id: '1',
    userId: '1',
    cardNumber: 'C00001',
    userName: '张三',
    entryGateId: '1',
    exitGateId: '3',
    entryStation: '北京西站',
    exitStation: '天安门东站',
    entryTime: '2023-06-15T08:30:00Z',
    exitTime: '2023-06-15T08:45:00Z',
    duration: '15分钟',
    distance: 5.2,
    fare: 3.0,
    paymentMethod: 'mobile',
    paymentStatus: 'success',
    createdTime: '2023-06-15T08:45:00Z',
    updatedTime: '2023-06-15T08:45:00Z'
  },
  {
    id: '2',
    userId: '2',
    cardNumber: 'C00002',
    userName: '李四',
    entryGateId: '2',
    exitGateId: '4',
    entryStation: '北京西站',
    exitStation: '天安门东站',
    entryTime: '2023-06-15T09:10:00Z',
    exitTime: '2023-06-15T09:25:00Z',
    duration: '15分钟',
    distance: 5.2,
    fare: 3.0,
    paymentMethod: 'card',
    paymentStatus: 'success',
    createdTime: '2023-06-15T09:25:00Z',
    updatedTime: '2023-06-15T09:25:00Z'
  },
  {
    id: '3',
    userId: '3',
    cardNumber: 'C00003',
    userName: '王五',
    entryGateId: '4',
    exitGateId: '6',
    entryStation: '上海火车站',
    exitStation: '深圳北站',
    entryTime: '2023-06-14T16:30:00Z',
    exitTime: '2023-06-14T17:15:00Z',
    duration: '45分钟',
    distance: 22.5,
    fare: 8.0,
    paymentMethod: 'cash',
    paymentStatus: 'failed',
    createdTime: '2023-06-14T17:15:00Z',
    updatedTime: '2023-06-14T17:15:00Z'
  },
  {
    id: '4',
    userId: '4',
    cardNumber: 'C00004',
    userName: '赵六',
    entryGateId: '6',
    exitGateId: '2',
    entryStation: '深圳北站',
    exitStation: '北京西站',
    entryTime: '2023-06-14T07:45:00Z',
    exitTime: '2023-06-14T08:30:00Z',
    duration: '45分钟',
    distance: 25.8,
    fare: 10.0,
    paymentMethod: 'mobile',
    paymentStatus: 'success',
    createdTime: '2023-06-14T08:30:00Z',
    updatedTime: '2023-06-14T08:30:00Z'
  },
  {
    id: '5',
    userId: '5',
    cardNumber: 'C00005',
    userName: '钱七',
    entryGateId: '5',
    exitGateId: '1',
    entryStation: '南京东路',
    exitStation: '北京西站',
    entryTime: '2023-06-13T18:30:00Z',
    exitTime: '2023-06-13T19:15:00Z',
    duration: '45分钟',
    distance: 30.2,
    fare: 12.0,
    paymentMethod: 'card',
    paymentStatus: 'pending',
    createdTime: '2023-06-13T19:15:00Z',
    updatedTime: '2023-06-13T19:15:00Z'
  },
  {
    id: '6',
    userId: '6',
    cardNumber: 'C00006',
    userName: '孙八',
    entryGateId: '3',
    exitGateId: '5',
    entryStation: '天安门东站',
    exitStation: '南京东路',
    entryTime: '2023-06-12T10:15:00Z',
    exitTime: '2023-06-12T11:00:00Z',
    duration: '45分钟',
    distance: 28.5,
    fare: 11.0,
    paymentMethod: 'mobile',
    paymentStatus: 'success',
    createdTime: '2023-06-12T11:00:00Z',
    updatedTime: '2023-06-12T11:00:00Z'
  }
]

export const useTripRecords = (searchTerm: string) => {
  const [tripRecords, setTripRecords] = useState<TripRecord[]>(initialTripRecords)
  const [filteredRecords, setFilteredRecords] = useState<TripRecord[]>(initialTripRecords)
  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  // 应用筛选条件
  useEffect(() => {
    let results = [...tripRecords]
    
    // 应用搜索词筛选
    if (internalSearchTerm) {
      const term = internalSearchTerm.toLowerCase()
      results = results.filter(record =>
        record.cardNumber.toLowerCase().includes(term) ||
        record.userName.toLowerCase().includes(term) ||
        record.entryStation.toLowerCase().includes(term) ||
        record.exitStation.toLowerCase().includes(term) ||
        formatDate(record.entryTime).includes(term) ||
        formatDate(record.exitTime).includes(term)
      )
    }
    
    // 按出行时间排序（出站时间）
    results.sort((a, b) => new Date(b.exitTime).getTime() - new Date(a.exitTime).getTime())
    
    // 计算总页数
    const total = Math.ceil(results.length / pageSize)
    setTotalPages(total)
    
    // 确保当前页不超过总页数
    if (currentPage > total && total > 0) {
      setCurrentPage(total)
    }
    
    // 应用分页
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    setFilteredRecords(results.slice(startIndex, endIndex))
  }, [tripRecords, internalSearchTerm, currentPage, pageSize])

  // 监听外部搜索词变化
  useEffect(() => {
    setInternalSearchTerm(searchTerm)
  }, [searchTerm])

  // 重置筛选条件
  const resetFilters = () => {
    setCurrentPage(1)
    setPageSize(5)
  }

  // 导出记录
  const exportRecords = () => {
    // 在实际应用中，这里应该调用API导出数据
    // 这里我们简单地模拟导出功能
    setTimeout(() => {
      alert('出行记录已成功导出为CSV文件')
    }, 500)
  }

  // 格式化日期
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  // 添加新的出行记录
  const addTripRecord = (record: TripRecord) => {
    setTripRecords(prev => [record, ...prev])
  }

  // 根据ID获取出行记录
  const getTripRecordById = (recordId: string): TripRecord | undefined => {
    return tripRecords.find(record => record.id === recordId)
  }

  // 更新出行记录状态
  const updateTripRecordStatus = (recordId: string, status: 'success' | 'failed' | 'pending') => {
    setTripRecords(prev => prev.map(record =>
      record.id === recordId ? { ...record, paymentStatus: status, updatedTime: new Date().toISOString() } : record
    ))
  }

  return {
    tripRecords,
    filteredRecords,
    currentPage,
    totalPages,
    pageSize,
    setSearchTerm: setInternalSearchTerm,
    setCurrentPage,
    setPageSize,
    resetFilters,
    exportRecords,
    addTripRecord,
    getTripRecordById,
    updateTripRecordStatus
  }
}