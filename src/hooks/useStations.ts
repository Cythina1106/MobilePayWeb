import { useState, useEffect } from 'react'

interface Station {
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

// 模拟数据
const mockStations: Station[] = [
  {
    id: '1',
    name: '北京西站',
    code: 'BJCX001',
    line: '1号线',
    city: '北京',
    province: '北京市',
    district: '西城区',
    address: '莲花池东路',
    status: 'active',
    openTime: '05:00',
    closeTime: '23:30',
    gateCount: 12,
    dailyFlow: 25000,
    createdTime: '2023-01-01T00:00:00Z',
    lastUpdated: '2023-06-15T00:00:00Z'
  },
  {
    id: '2',
    name: '天安门东站',
    code: 'BJCX002',
    line: '1号线',
    city: '北京',
    province: '北京市',
    district: '东城区',
    address: '东长安街',
    status: 'active',
    openTime: '05:00',
    closeTime: '23:30',
    gateCount: 10,
    dailyFlow: 32000,
    createdTime: '2023-01-01T00:00:00Z',
    lastUpdated: '2023-06-15T00:00:00Z'
  },
  {
    id: '3',
    name: '上海火车站',
    code: 'SHCX001',
    line: '3号线',
    city: '上海',
    province: '上海市',
    district: '静安区',
    address: '秣陵路',
    status: 'active',
    openTime: '05:00',
    closeTime: '23:30',
    gateCount: 15,
    dailyFlow: 45000,
    createdTime: '2023-01-01T00:00:00Z',
    lastUpdated: '2023-06-15T00:00:00Z'
  },
  {
    id: '4',
    name: '南京东路',
    code: 'SHCX002',
    line: '2号线',
    city: '上海',
    province: '上海市',
    district: '黄浦区',
    address: '南京东路',
    status: 'active',
    openTime: '05:00',
    closeTime: '23:30',
    gateCount: 8,
    dailyFlow: 28000,
    createdTime: '2023-01-01T00:00:00Z',
    lastUpdated: '2023-06-15T00:00:00Z'
  },
  {
    id: '5',
    name: '广州东站',
    code: 'GZCZ001',
    line: '1号线',
    city: '广州',
    province: '广东省',
    district: '天河区',
    address: '林和西路',
    status: 'maintenance',
    openTime: '05:00',
    closeTime: '23:30',
    gateCount: 10,
    dailyFlow: 22000,
    createdTime: '2023-01-01T00:00:00Z',
    lastUpdated: '2023-06-15T00:00:00Z'
  },
  {
    id: '6',
    name: '深圳北站',
    code: 'SZCZ001',
    line: '4号线',
    city: '深圳',
    province: '广东省',
    district: '龙华区',
    address: '民治街道',
    status: 'active',
    openTime: '05:00',
    closeTime: '23:30',
    gateCount: 20,
    dailyFlow: 50000,
    createdTime: '2023-01-01T00:00:00Z',
    lastUpdated: '2023-06-15T00:00:00Z'
  }
]

export const useStations = (searchTerm: string) => {
  const [stations, setStations] = useState<Station[]>(mockStations)
  const [filteredStations, setFilteredStations] = useState<Station[]>(mockStations)
  const [cityFilter, setCityFilter] = useState('')
  const [lineFilter, setLineFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [availableLines, setAvailableLines] = useState<string[]>([])
  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm)

  // 初始化可用的城市和线路列表
  useEffect(() => {
    const cities = [...new Set(stations.map(station => station.city))].sort()
    const lines = [...new Set(stations.map(station => station.line))].sort()
    setAvailableCities(cities)
    setAvailableLines(lines)
  }, [stations])

  // 应用筛选条件
  useEffect(() => {
    let results = [...stations]
    
    // 应用搜索词筛选
    if (internalSearchTerm) {
      const term = internalSearchTerm.toLowerCase()
      results = results.filter(station =>
        station.name.toLowerCase().includes(term) ||
        station.code.toLowerCase().includes(term) ||
        station.line.toLowerCase().includes(term) ||
        station.address.toLowerCase().includes(term)
      )
    }
    
    // 应用城市筛选
    if (cityFilter) {
      results = results.filter(station => station.city === cityFilter)
    }
    
    // 应用线路筛选
    if (lineFilter) {
      results = results.filter(station => station.line === lineFilter)
    }
    
    // 应用状态筛选
    if (statusFilter) {
      results = results.filter(station => station.status === statusFilter)
    }
    
    // 按站点编码排序
    results.sort((a, b) => a.code.localeCompare(b.code))
    
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
    setFilteredStations(results.slice(startIndex, endIndex))
  }, [stations, internalSearchTerm, cityFilter, lineFilter, statusFilter, currentPage, pageSize])

  // 监听外部搜索词变化
  useEffect(() => {
    setInternalSearchTerm(searchTerm)
  }, [searchTerm])

  // 重置筛选条件
  const resetFilters = () => {
    setCityFilter('')
    setLineFilter('')
    setStatusFilter('')
    setCurrentPage(1)
    setPageSize(5)
  }

  // 保存站点（添加或编辑）
  const saveStation = (stationData: Partial<Station>, isEdit: boolean) => {
    if (isEdit && stationData.id) {
      // 编辑现有站点
      setStations(prev => prev.map(station =>
        station.id === stationData.id ? { ...station, ...stationData, lastUpdated: new Date().toISOString() } : station
      ))
    } else {
      // 添加新站点
      const newStation: Station = {
        id: Date.now().toString(),
        name: stationData.name || '',
        code: stationData.code || '',
        line: stationData.line || '',
        city: stationData.city || '',
        province: stationData.province || '',
        district: stationData.district || '',
        address: stationData.address || '',
        status: stationData.status || 'active',
        openTime: stationData.openTime || '05:00',
        closeTime: stationData.closeTime || '23:30',
        gateCount: stationData.gateCount || 0,
        dailyFlow: 0,
        createdTime: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
      setStations(prev => [...prev, newStation])
    }
  }

  // 删除站点
  const deleteStation = (stationId: string) => {
    if (window.confirm('确定要删除这个站点吗？')) {
      setStations(prev => prev.filter(station => station.id !== stationId))
    }
  }

  // 根据ID获取站点
  const getStationById = (stationId: string): Station | undefined => {
    return stations.find(station => station.id === stationId)
  }

  return {
    stations,
    filteredStations,
    currentPage,
    totalPages,
    pageSize,
    availableCities,
    availableLines,
    cityFilter,
    lineFilter,
    statusFilter,
    setSearchTerm: setInternalSearchTerm,
    setCityFilter,
    setLineFilter,
    setStatusFilter,
    setCurrentPage,
    setPageSize,
    resetFilters,
    saveStation,
    deleteStation,
    getStationById
  }
}