import { useState, useEffect } from 'react'

interface Gate {
  id: string
  code: string
  name: string
  stationId: string
  stationName: string
  line: string
  city: string
  type: 'entry' | 'exit' | 'both'
  location: string
  status: 'active' | 'inactive' | 'maintenance'
  lastCheckTime: string
  errorCount: number
  dailyPassCount: number
  createdTime: string
  lastUpdated: string
}

interface Station {
  id: string
  name: string
  line: string
  city: string
}

// 模拟数据
const mockGates: Gate[] = [
  {
    id: '1',
    code: 'G-BJCX001-01',
    name: '北京西站1号闸机',
    stationId: '1',
    stationName: '北京西站',
    line: '1号线',
    city: '北京',
    type: 'both',
    location: '东大厅A区',
    status: 'active',
    lastCheckTime: '2023-06-15T12:00:00Z',
    errorCount: 0,
    dailyPassCount: 3200,
    createdTime: '2023-01-01T00:00:00Z',
    lastUpdated: '2023-06-15T00:00:00Z'
  },
  {
    id: '2',
    code: 'G-BJCX001-02',
    name: '北京西站2号闸机',
    stationId: '1',
    stationName: '北京西站',
    line: '1号线',
    city: '北京',
    type: 'entry',
    location: '东大厅B区',
    status: 'active',
    lastCheckTime: '2023-06-15T12:00:00Z',
    errorCount: 0,
    dailyPassCount: 2800,
    createdTime: '2023-01-01T00:00:00Z',
    lastUpdated: '2023-06-15T00:00:00Z'
  },
  {
    id: '3',
    code: 'G-BJCX002-01',
    name: '天安门东站1号闸机',
    stationId: '2',
    stationName: '天安门东站',
    line: '1号线',
    city: '北京',
    type: 'exit',
    location: '南出口',
    status: 'maintenance',
    lastCheckTime: '2023-06-14T18:00:00Z',
    errorCount: 2,
    dailyPassCount: 0,
    createdTime: '2023-01-01T00:00:00Z',
    lastUpdated: '2023-06-14T00:00:00Z'
  },
  {
    id: '4',
    code: 'G-SHCX001-01',
    name: '上海火车站1号闸机',
    stationId: '3',
    stationName: '上海火车站',
    line: '3号线',
    city: '上海',
    type: 'both',
    location: '北广场',
    status: 'active',
    lastCheckTime: '2023-06-15T12:00:00Z',
    errorCount: 0,
    dailyPassCount: 4100,
    createdTime: '2023-01-01T00:00:00Z',
    lastUpdated: '2023-06-15T00:00:00Z'
  },
  {
    id: '5',
    code: 'G-SHCX002-01',
    name: '南京东路1号闸机',
    stationId: '4',
    stationName: '南京东路',
    line: '2号线',
    city: '上海',
    type: 'both',
    location: 'A出口',
    status: 'inactive',
    lastCheckTime: '2023-06-13T18:00:00Z',
    errorCount: 5,
    dailyPassCount: 0,
    createdTime: '2023-01-01T00:00:00Z',
    lastUpdated: '2023-06-13T00:00:00Z'
  },
  {
    id: '6',
    code: 'G-SZCZ001-01',
    name: '深圳北站1号闸机',
    stationId: '6',
    stationName: '深圳北站',
    line: '4号线',
    city: '深圳',
    type: 'both',
    location: '东广场A区',
    status: 'active',
    lastCheckTime: '2023-06-15T12:00:00Z',
    errorCount: 0,
    dailyPassCount: 5200,
    createdTime: '2023-01-01T00:00:00Z',
    lastUpdated: '2023-06-15T00:00:00Z'
  }
]

export const useGates = (searchTerm: string, stations: Station[]) => {
  const [gates, setGates] = useState<Gate[]>(mockGates)
  const [filteredGates, setFilteredGates] = useState<Gate[]>(mockGates)
  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm)
  const [cityFilter, setCityFilter] = useState('')
  const [lineFilter, setLineFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [availableLines, setAvailableLines] = useState<string[]>([])

  // 初始化可用的城市和线路列表
  useEffect(() => {
    const cities = [...new Set(gates.map(gate => gate.city))].sort()
    const lines = [...new Set(gates.map(gate => gate.line))].sort()
    setAvailableCities(cities)
    setAvailableLines(lines)
  }, [gates])

  // 应用筛选条件
  useEffect(() => {
    let results = [...gates]
    
    // 应用搜索词筛选
    if (internalSearchTerm) {
      const term = internalSearchTerm.toLowerCase()
      results = results.filter(gate =>
        gate.code.toLowerCase().includes(term) ||
        gate.name.toLowerCase().includes(term) ||
        gate.stationName.toLowerCase().includes(term)
      )
    }
    
    // 应用城市筛选
    if (cityFilter) {
      results = results.filter(gate => gate.city === cityFilter)
    }
    
    // 应用线路筛选
    if (lineFilter) {
      results = results.filter(gate => gate.line === lineFilter)
    }
    
    // 应用状态筛选
    if (statusFilter) {
      results = results.filter(gate => gate.status === statusFilter)
    }
    
    // 应用类型筛选
    if (typeFilter) {
      results = results.filter(gate => gate.type === typeFilter)
    }
    
    // 按闸机编号排序
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
    setFilteredGates(results.slice(startIndex, endIndex))
  }, [gates, internalSearchTerm, cityFilter, lineFilter, statusFilter, typeFilter, currentPage, pageSize])

  // 监听外部搜索词变化
  useEffect(() => {
    setInternalSearchTerm(searchTerm)
  }, [searchTerm])

  // 重置筛选条件
  const resetFilters = () => {
    setCityFilter('')
    setLineFilter('')
    setStatusFilter('')
    setTypeFilter('')
    setCurrentPage(1)
    setPageSize(5)
  }

  // 保存闸机（添加或编辑）
  const saveGate = (gateData: Partial<Gate>, isEdit: boolean) => {
    if (isEdit && gateData.id) {
      // 编辑现有闸机
      setGates(prev => prev.map(gate =>
        gate.id === gateData.id ? { ...gate, ...gateData, lastUpdated: new Date().toISOString() } : gate
      ))
    } else {
      // 添加新闸机
      const station = stations.find(s => s.id === gateData.stationId)
      if (!station) {
        alert('请选择有效的站点')
        return
      }
      
      const newGate: Gate = {
        id: Date.now().toString(),
        code: gateData.code || '',
        name: gateData.name || '',
        stationId: gateData.stationId || '',
        stationName: station.name,
        line: station.line,
        city: station.city,
        type: gateData.type || 'both',
        location: gateData.location || '',
        status: gateData.status || 'active',
        lastCheckTime: new Date().toISOString(),
        errorCount: 0,
        dailyPassCount: 0,
        createdTime: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
      setGates(prev => [...prev, newGate])
    }
  }

  // 删除闸机
  const deleteGate = (gateId: string) => {
    if (window.confirm('确定要删除这个闸机吗？')) {
      setGates(prev => prev.filter(gate => gate.id !== gateId))
    }
  }

  // 根据ID获取闸机
  const getGateById = (gateId: string): Gate | undefined => {
    return gates.find(gate => gate.id === gateId)
  }

  return {
    gates,
    filteredGates,
    currentPage,
    totalPages,
    pageSize,
    availableCities,
    availableLines,
    cityFilter,
    lineFilter,
    statusFilter,
    typeFilter,
    setSearchTerm: setInternalSearchTerm,
    setCityFilter,
    setLineFilter,
    setStatusFilter,
    setTypeFilter,
    setCurrentPage,
    setPageSize,
    resetFilters,
    saveGate,
    deleteGate,
    getGateById
  }
}