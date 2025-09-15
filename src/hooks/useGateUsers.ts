import { useState, useEffect } from 'react'

interface GateUser {
  id: string
  cardNumber: string
  name: string
  phone: string
  email: string
  role: 'admin' | 'manager' | 'operator' | 'viewer'
  status: 'active' | 'inactive' | 'suspended'
  accessLevel: 'all' | 'station' | 'line'
  accessStations: string[]
  accessLines: string[]
  createdTime: string
  lastLogin: string
  lastUpdated: string
  lastUpdatedBy: string
}

// 模拟数据
const mockUsers: GateUser[] = [
  {
    id: '1',
    cardNumber: 'C00001',
    name: '张三',
    phone: '13800138001',
    email: 'zhang.san@example.com',
    role: 'admin',
    status: 'active',
    accessLevel: 'all',
    accessStations: [],
    accessLines: [],
    createdTime: '2023-01-01T00:00:00Z',
    lastLogin: '2023-06-15T10:30:00Z',
    lastUpdated: '2023-06-15T00:00:00Z',
    lastUpdatedBy: 'system'
  },
  {
    id: '2',
    cardNumber: 'C00002',
    name: '李四',
    phone: '13800138002',
    email: 'li.si@example.com',
    role: 'manager',
    status: 'active',
    accessLevel: 'station',
    accessStations: ['1', '2'],
    accessLines: [],
    createdTime: '2023-01-01T00:00:00Z',
    lastLogin: '2023-06-14T16:45:00Z',
    lastUpdated: '2023-06-15T00:00:00Z',
    lastUpdatedBy: 'admin'
  },
  {
    id: '3',
    cardNumber: 'C00003',
    name: '王五',
    phone: '13800138003',
    email: 'wang.wu@example.com',
    role: 'operator',
    status: 'suspended',
    accessLevel: 'line',
    accessStations: [],
    accessLines: ['1号线'],
    createdTime: '2023-02-15T00:00:00Z',
    lastLogin: '2023-06-10T09:20:00Z',
    lastUpdated: '2023-06-12T00:00:00Z',
    lastUpdatedBy: 'admin'
  },
  {
    id: '4',
    cardNumber: 'C00004',
    name: '赵六',
    phone: '13800138004',
    email: 'zhao.liu@example.com',
    role: 'operator',
    status: 'active',
    accessLevel: 'station',
    accessStations: ['3', '4'],
    accessLines: [],
    createdTime: '2023-03-01T00:00:00Z',
    lastLogin: '2023-06-15T14:10:00Z',
    lastUpdated: '2023-06-15T00:00:00Z',
    lastUpdatedBy: 'admin'
  },
  {
    id: '5',
    cardNumber: 'C00005',
    name: '钱七',
    phone: '13800138005',
    email: 'qian.qi@example.com',
    role: 'viewer',
    status: 'inactive',
    accessLevel: 'line',
    accessStations: [],
    accessLines: ['3号线', '4号线'],
    createdTime: '2023-04-01T00:00:00Z',
    lastLogin: '2023-05-20T11:30:00Z',
    lastUpdated: '2023-06-01T00:00:00Z',
    lastUpdatedBy: 'admin'
  },
  {
    id: '6',
    cardNumber: 'C00006',
    name: '孙八',
    phone: '13800138006',
    email: 'sun.ba@example.com',
    role: 'manager',
    status: 'active',
    accessLevel: 'station',
    accessStations: ['5', '6'],
    accessLines: [],
    createdTime: '2023-05-15T00:00:00Z',
    lastLogin: '2023-06-15T08:50:00Z',
    lastUpdated: '2023-06-15T00:00:00Z',
    lastUpdatedBy: 'admin'
  }
]

export const useGateUsers = (searchTerm: string) => {
  const [gateUsers, setGateUsers] = useState<GateUser[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<GateUser[]>(mockUsers)
  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm)
  const [availableRoles, setAvailableRoles] = useState<string[]>(['admin', 'manager', 'operator', 'viewer'])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  // 应用筛选条件
  useEffect(() => {
    let results = [...gateUsers]
    
    // 应用搜索词筛选
    if (internalSearchTerm) {
      const term = internalSearchTerm.toLowerCase()
      results = results.filter(user =>
        user.cardNumber.toLowerCase().includes(term) ||
        user.name.toLowerCase().includes(term) ||
        user.phone.includes(term) ||
        (user.email && user.email.toLowerCase().includes(term))
      )
    }
    
    // 按创建时间排序
    results.sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())
    
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
    setFilteredUsers(results.slice(startIndex, endIndex))
  }, [gateUsers, internalSearchTerm, currentPage, pageSize])

  // 监听外部搜索词变化
  useEffect(() => {
    setInternalSearchTerm(searchTerm)
  }, [searchTerm])

  // 重置筛选条件
  const resetFilters = () => {
    setCurrentPage(1)
    setPageSize(5)
  }

  // 保存用户（添加或编辑）
  const saveUser = (userData: Partial<GateUser>, isEdit: boolean) => {
    if (isEdit && userData.id) {
      // 编辑现有用户
      setGateUsers(prev => prev.map(user =>
        user.id === userData.id ? { ...user, ...userData, lastUpdated: new Date().toISOString() } : user
      ))
    } else {
      // 添加新用户
      // 检查卡号是否已存在
      if (gateUsers.some(user => user.cardNumber === userData.cardNumber)) {
        alert('该卡号已存在')
        return
      }
      
      const newUser: GateUser = {
        id: Date.now().toString(),
        cardNumber: userData.cardNumber || '',
        name: userData.name || '',
        phone: userData.phone || '',
        email: userData.email || '',
        role: userData.role || 'operator',
        status: userData.status || 'active',
        accessLevel: userData.accessLevel || 'station',
        accessStations: userData.accessStations || [],
        accessLines: userData.accessLines || [],
        createdTime: new Date().toISOString(),
        lastLogin: '',
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: 'admin'
      }
      setGateUsers(prev => [...prev, newUser])
    }
  }

  // 修改用户状态
  const changeUserStatus = (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    setGateUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, status, lastUpdated: new Date().toISOString() } : user
    ))
  }

  // 根据ID获取用户
  const getUserById = (userId: string): GateUser | undefined => {
    return gateUsers.find(user => user.id === userId)
  }

  // 删除用户
  const deleteUser = (userId: string) => {
    if (window.confirm('确定要删除这个用户吗？')) {
      setGateUsers(prev => prev.filter(user => user.id !== userId))
    }
  }

  return {
    gateUsers,
    filteredUsers,
    currentPage,
    totalPages,
    pageSize,
    availableRoles,
    setSearchTerm: setInternalSearchTerm,
    setCurrentPage,
    setPageSize,
    resetFilters,
    saveUser,
    changeUserStatus,
    deleteUser,
    getUserById
  }
}