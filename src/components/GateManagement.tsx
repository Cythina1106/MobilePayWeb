import { useState } from 'react'
import './GateManagement.css'

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

interface Gate {
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

interface GateUser {
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

interface TripRecord {
  id: string
  userId: string
  userName: string
  cardNumber: string
  entryStation: string
  exitStation: string
  entryTime: string
  exitTime: string
  duration: string
  fare: number
  paymentMethod: 'balance' | 'mobile' | 'card'
  status: 'completed' | 'entryOnly' | 'exitOnly'
}

const GateManagement = () => {
  const [activeTab, setActiveTab] = useState<'stations' | 'gates' | 'users' | 'records'>('stations')
  const [searchTerm, setSearchTerm] = useState('')
  const [showStationModal, setShowStationModal] = useState(false)
  const [showGateModal, setShowGateModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingStation, setEditingStation] = useState<Station | null>(null)
  const [editingGate, setEditingGate] = useState<Gate | null>(null)
  const [editingUser, setEditingUser] = useState<GateUser | null>(null)

  // 省份城市区域数据
  const regionData: Record<string, Record<string, string[]>> = {
    '北京市': {
      '北京': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区']
    },
    '上海市': {
      '上海': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区', '闵行区', '宝山区', '嘉定区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区']
    },
    '广东省': {
      '广州': ['荔湾区', '越秀区', '海珠区', '天河区', '白云区', '黄埔区', '番禺区', '花都区', '南沙区', '从化区', '增城区'],
      '深圳': ['罗湖区', '福田区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区', '光明区', '大鹏新区']
    },
    '四川省': {
      '成都': ['锦江区', '青羊区', '金牛区', '武侯区', '成华区', '龙泉驿区', '青白江区', '新都区', '温江区', '双流区', '郫都区', '新津区', '金堂县', '大邑县', '蒲江县', '都江堰市', '彭州市', '崇州市', '邛崃市', '简阳市']
    },
    '江苏省': {
      '南京': ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区', '栖霞区', '雨花台区', '江宁区', '六合区', '溧水区', '高淳区'],
      '苏州': ['姑苏区', '虎丘区', '吴中区', '相城区', '吴江区', '常熟市', '张家港市', '昆山市', '太仓市']
    },
    '浙江省': {
      '杭州': ['上城区', '下城区', '江干区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '富阳区', '临安区', '桐庐县', '淳安县', '建德市'],
      '宁波': ['海曙区', '江北区', '北仑区', '镇海区', '鄞州区', '奉化区', '象山县', '宁海县', '余姚市', '慈溪市']
    }
  }

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  // 筛选状态
  const [cityFilter, setCityFilter] = useState('')
  const [lineFilter, setLineFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // 站点数据
  const [stations, setStations] = useState<Station[]>([
    {
      id: '1',
      name: '天安门东站',
      code: 'TAD',
      line: '1号线',
      city: '北京',
      province: '北京市',
      district: '东城区',
      address: '东长安街',
      status: 'active',
      openTime: '05:00',
      closeTime: '23:30',
      gateCount: 12,
      dailyFlow: 45600,
      createdTime: '2024-01-15 10:00',
      lastUpdated: '2025-07-18 09:30'
    },
    {
      id: '2',
      name: '王府井站',
      code: 'WFJ',
      line: '1号线',
      city: '北京',
      province: '北京市',
      district: '东城区',
      address: '王府井大街',
      status: 'active',
      openTime: '05:00',
      closeTime: '23:30',
      gateCount: 8,
      dailyFlow: 32400,
      createdTime: '2024-01-15 10:00',
      lastUpdated: '2025-07-18 08:45'
    },
    {
      id: '3',
      name: '西单站',
      code: 'XD',
      line: '1号线',
      city: '北京',
      province: '北京市',
      district: '西城区',
      address: '西单北大街',
      status: 'maintenance',
      openTime: '05:00',
      closeTime: '23:30',
      gateCount: 10,
      dailyFlow: 28900,
      createdTime: '2024-01-15 10:00',
      lastUpdated: '2025-07-17 16:20'
    },
    {
      id: '4',
      name: '人民广场站',
      code: 'RMGC',
      line: '1号线',
      city: '上海',
      province: '上海市',
      district: '黄浦区',
      address: '南京东路',
      status: 'active',
      openTime: '05:30',
      closeTime: '23:00',
      gateCount: 16,
      dailyFlow: 68500,
      createdTime: '2024-02-01 10:00',
      lastUpdated: '2025-07-18 10:15'
    },
    {
      id: '5',
      name: '陆家嘴站',
      code: 'LJZ',
      line: '2号线',
      city: '上海',
      province: '上海市',
      district: '浦东新区',
      address: '世纪大道',
      status: 'active',
      openTime: '05:30',
      closeTime: '23:00',
      gateCount: 12,
      dailyFlow: 45200,
      createdTime: '2024-02-01 10:00',
      lastUpdated: '2025-07-18 09:45'
    },
    {
      id: '6',
      name: '珠江新城站',
      code: 'ZJXC',
      line: '3号线',
      city: '广州',
      province: '广东省',
      district: '天河区',
      address: '珠江新城',
      status: 'active',
      openTime: '06:00',
      closeTime: '23:30',
      gateCount: 14,
      dailyFlow: 52100,
      createdTime: '2024-03-01 10:00',
      lastUpdated: '2025-07-18 11:20'
    },
    {
      id: '7',
      name: '春熙路站',
      code: 'CXL',
      line: '2号线',
      city: '成都',
      province: '四川省',
      district: '锦江区',
      address: '春熙路',
      status: 'active',
      openTime: '06:30',
      closeTime: '22:30',
      gateCount: 10,
      dailyFlow: 38900,
      createdTime: '2024-03-15 10:00',
      lastUpdated: '2025-07-18 08:30'
    }
  ])

  // 闸机设备数据
  const [gates, setGates] = useState<Gate[]>([
    {
      id: '1',
      stationId: '1',
      stationName: '天安门东站',
      gateNumber: 'A01',
      type: 'entry',
      position: 'A进站口',
      status: 'online',
      model: 'GT-2000',
      serialNumber: 'GT2000-001',
      installDate: '2024-01-20',
      lastMaintenance: '2025-07-01',
      dailyPassages: 3800,
      errorCount: 2
    },
    {
      id: '2',
      stationId: '1',
      stationName: '天安门东站',
      gateNumber: 'A02',
      type: 'entry',
      position: 'A进站口',
      status: 'online',
      model: 'GT-2000',
      serialNumber: 'GT2000-002',
      installDate: '2024-01-20',
      lastMaintenance: '2025-07-01',
      dailyPassages: 3650,
      errorCount: 1
    },
    {
      id: '3',
      stationId: '1',
      stationName: '天安门东站',
      gateNumber: 'B01',
      type: 'exit',
      position: 'B出站口',
      status: 'error',
      model: 'GT-2000',
      serialNumber: 'GT2000-003',
      installDate: '2024-01-20',
      lastMaintenance: '2025-06-15',
      dailyPassages: 0,
      errorCount: 15
    },
    {
      id: '4',
      stationId: '2',
      stationName: '王府井站',
      gateNumber: 'A01',
      type: 'bidirectional',
      position: '主进出口',
      status: 'online',
      model: 'GT-3000',
      serialNumber: 'GT3000-001',
      installDate: '2024-02-01',
      lastMaintenance: '2025-07-10',
      dailyPassages: 4200,
      errorCount: 0
    }
  ])

  // 闸机用户数据
  const [gateUsers, setGateUsers] = useState<GateUser[]>([
    {
      id: '1',
      cardNumber: '6001001234567890',
      userName: '张三',
      phone: '13812345678',
      userType: 'regular',
      status: 'active',
      balance: 128.50,
      registrationDate: '2024-03-15',
      lastUsed: '2025-07-18 08:30',
      totalTrips: 245,
      monthlyLimit: 200
    },
    {
      id: '2',
      cardNumber: '6001001234567891',
      userName: '李四',
      phone: '13987654321',
      userType: 'student',
      status: 'active',
      balance: 45.80,
      registrationDate: '2024-05-20',
      lastUsed: '2025-07-17 18:45',
      totalTrips: 156,
      monthlyLimit: 150
    },
    {
      id: '3',
      cardNumber: '6001001234567892',
      userName: '王五',
      phone: '13756789012',
      userType: 'senior',
      status: 'active',
      balance: 89.20,
      registrationDate: '2024-02-10',
      lastUsed: '2025-07-16 14:20',
      totalTrips: 378,
      monthlyLimit: 100
    },
    {
      id: '4',
      cardNumber: '6001001234567893',
      userName: '赵六',
      phone: '13645678901',
      userType: 'staff',
      status: 'suspended',
      balance: 0.00,
      registrationDate: '2024-01-25',
      lastUsed: '2025-07-10 09:15',
      totalTrips: 89,
      monthlyLimit: 300
    }
  ])

  // 出行记录数据
  const [tripRecords] = useState<TripRecord[]>([
    {
      id: '1',
      userId: '1',
      userName: '张三',
      cardNumber: '6001001234567890',
      entryStation: '天安门东站',
      exitStation: '王府井站',
      entryTime: '2025-07-18 08:30',
      exitTime: '2025-07-18 08:45',
      duration: '15分钟',
      fare: 3.00,
      paymentMethod: 'balance',
      status: 'completed'
    },
    {
      id: '2',
      userId: '2',
      userName: '李四',
      cardNumber: '6001001234567891',
      entryStation: '王府井站',
      exitStation: '西单站',
      entryTime: '2025-07-18 07:20',
      exitTime: '2025-07-18 07:35',
      duration: '15分钟',
      fare: 2.50,
      paymentMethod: 'mobile',
      status: 'completed'
    },
    {
      id: '3',
      userId: '3',
      userName: '王五',
      cardNumber: '6001001234567892',
      entryStation: '西单站',
      exitStation: '',
      entryTime: '2025-07-18 09:10',
      exitTime: '',
      duration: '',
      fare: 0,
      paymentMethod: 'balance',
      status: 'entryOnly'
    }
  ])

  // 表单状态
  const [stationForm, setStationForm] = useState<Partial<Station>>({
    name: '',
    code: '',
    line: '',
    city: '',
    province: '',
    district: '',
    address: '',
    status: 'active',
    openTime: '05:00',
    closeTime: '23:30',
    gateCount: 0
  })

  const [gateForm, setGateForm] = useState<Partial<Gate>>({
    stationId: '',
    gateNumber: '',
    type: 'entry',
    position: '',
    status: 'online',
    model: '',
    serialNumber: ''
  })

  const [userForm, setUserForm] = useState<Partial<GateUser>>({
    cardNumber: '',
    userName: '',
    phone: '',
    userType: 'regular',
    status: 'active',
    balance: 0,
    monthlyLimit: 200
  })

  // 过滤数据
  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.includes(searchTerm) || 
                         station.code.includes(searchTerm) ||
                         station.line.includes(searchTerm) ||
                         station.province.includes(searchTerm) ||
                         station.district.includes(searchTerm) ||
                         station.address.includes(searchTerm)
    const matchesCity = !cityFilter || station.city === cityFilter
    const matchesLine = !lineFilter || station.line === lineFilter
    const matchesStatus = !statusFilter || station.status === statusFilter
    
    return matchesSearch && matchesCity && matchesLine && matchesStatus
  })

  // 分页处理
  const totalPages = Math.ceil(filteredStations.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedStations = filteredStations.slice(startIndex, startIndex + pageSize)

  // 获取唯一的城市和线路列表
  const availableCities = Array.from(new Set(stations.map(station => station.city)))
  const availableLines = Array.from(new Set(stations.map(station => station.line)))

  const filteredGates = gates.filter(gate =>
    gate.stationName.includes(searchTerm) ||
    gate.gateNumber.includes(searchTerm) ||
    gate.position.includes(searchTerm)
  )

  const filteredUsers = gateUsers.filter(user =>
    user.userName.includes(searchTerm) ||
    user.cardNumber.includes(searchTerm) ||
    user.phone.includes(searchTerm)
  )

  const filteredRecords = tripRecords.filter(record =>
    record.userName.includes(searchTerm) ||
    record.cardNumber.includes(searchTerm) ||
    record.entryStation.includes(searchTerm) ||
    record.exitStation.includes(searchTerm)
  )

  // 处理站点操作
  const handleStationSave = () => {
    if (!stationForm.name || !stationForm.code || !stationForm.line || !stationForm.city || !stationForm.province || !stationForm.district) {
      alert('请填写必填字段（站点名称、编码、线路、城市、省份、区域）')
      return
    }

    const now = new Date().toLocaleString('zh-CN')
    
    if (editingStation) {
      setStations(prev => prev.map(station =>
        station.id === editingStation.id
          ? { ...station, ...stationForm, lastUpdated: now } as Station
          : station
      ))
    } else {
      const newStation: Station = {
        ...stationForm,
        id: Date.now().toString(),
        dailyFlow: 0,
        createdTime: now,
        lastUpdated: now
      } as Station
      setStations(prev => [...prev, newStation])
    }

    setShowStationModal(false)
    setEditingStation(null)
    setStationForm({
      name: '',
      code: '',
      line: '',
      city: '',
      province: '',
      district: '',
      address: '',
      status: 'active',
      openTime: '05:00',
      closeTime: '23:30',
      gateCount: 0
    })
  }

  const handleStationEdit = (station: Station) => {
    setEditingStation(station)
    setStationForm(station)
    setShowStationModal(true)
  }

  const handleStationDelete = (stationId: string) => {
    if (confirm('确定要删除这个站点吗？')) {
      setStations(prev => prev.filter(station => station.id !== stationId))
      // 同时删除相关闸机
      setGates(prev => prev.filter(gate => gate.stationId !== stationId))
    }
  }

  // 处理闸机操作
  const handleGateSave = () => {
    if (!gateForm.stationId || !gateForm.gateNumber || !gateForm.position) {
      alert('请填写必填字段')
      return
    }

    const station = stations.find(s => s.id === gateForm.stationId)
    if (!station) {
      alert('请选择有效的站点')
      return
    }

    if (editingGate) {
      setGates(prev => prev.map(gate =>
        gate.id === editingGate.id
          ? { ...gate, ...gateForm, stationName: station.name } as Gate
          : gate
      ))
    } else {
      const newGate: Gate = {
        ...gateForm,
        id: Date.now().toString(),
        stationName: station.name,
        installDate: new Date().toISOString().split('T')[0],
        lastMaintenance: new Date().toISOString().split('T')[0],
        dailyPassages: 0,
        errorCount: 0
      } as Gate
      setGates(prev => [...prev, newGate])
    }

    setShowGateModal(false)
    setEditingGate(null)
    setGateForm({
      stationId: '',
      gateNumber: '',
      type: 'entry',
      position: '',
      status: 'online',
      model: '',
      serialNumber: ''
    })
  }

  const handleGateEdit = (gate: Gate) => {
    setEditingGate(gate)
    setGateForm(gate)
    setShowGateModal(true)
  }

  const handleGateDelete = (gateId: string) => {
    if (confirm('确定要删除这个闸机吗？')) {
      setGates(prev => prev.filter(gate => gate.id !== gateId))
    }
  }

  // 处理用户操作
  const handleUserSave = () => {
    if (!userForm.cardNumber || !userForm.userName || !userForm.phone) {
      alert('请填写必填字段')
      return
    }

    const now = new Date().toLocaleString('zh-CN')
    
    if (editingUser) {
      setGateUsers(prev => prev.map(user =>
        user.id === editingUser.id
          ? { ...user, ...userForm } as GateUser
          : user
      ))
    } else {
      const newUser: GateUser = {
        ...userForm,
        id: Date.now().toString(),
        registrationDate: now.split(' ')[0],
        lastUsed: '从未使用',
        totalTrips: 0
      } as GateUser
      setGateUsers(prev => [...prev, newUser])
    }

    setShowUserModal(false)
    setEditingUser(null)
    setUserForm({
      cardNumber: '',
      userName: '',
      phone: '',
      userType: 'regular',
      status: 'active',
      balance: 0,
      monthlyLimit: 200
    })
  }

  const handleUserEdit = (user: GateUser) => {
    setEditingUser(user)
    setUserForm(user)
    setShowUserModal(true)
  }

  const handleUserStatusChange = (userId: string, newStatus: 'active' | 'suspended') => {
    setGateUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ))
  }

  // 重置筛选条件
  const resetFilters = () => {
    setSearchTerm('')
    setCityFilter('')
    setLineFilter('')
    setStatusFilter('')
    setCurrentPage(1)
  }

  // 渲染站点管理
  const renderStations = () => (
    <div className="stations-section">
      <div className="section-header">
        <h3>站点管理</h3>
        <div className="header-actions">
          <input
            type="text"
            placeholder="搜索站点名称、编码、线路或地址"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="create-btn" onClick={() => setShowStationModal(true)}>
            + 添加站点
          </button>
        </div>
      </div>

      {/* 筛选条件 */}
      <div className="filter-section">
        <div className="filter-row">
          <select 
            value={cityFilter} 
            onChange={(e) => {
              setCityFilter(e.target.value)
              setCurrentPage(1) // 重置到第一页
            }}
            className="filter-select"
          >
            <option value="">全部城市</option>
            {availableCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          
          <select 
            value={lineFilter} 
            onChange={(e) => {
              setLineFilter(e.target.value)
              setCurrentPage(1) // 重置到第一页
            }}
            className="filter-select"
          >
            <option value="">全部线路</option>
            {availableLines.map(line => (
              <option key={line} value={line}>{line}</option>
            ))}
          </select>
          
          <select 
            value={statusFilter} 
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1) // 重置到第一页
            }}
            className="filter-select"
          >
            <option value="">全部状态</option>
            <option value="active">运营中</option>
            <option value="inactive">已关闭</option>
            <option value="maintenance">维护中</option>
          </select>

          <select 
            value={pageSize} 
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1) // 重置到第一页
            }}
            className="page-size-select"
          >
            <option value={5}>每页 5 条</option>
            <option value={10}>每页 10 条</option>
            <option value={20}>每页 20 条</option>
            <option value={50}>每页 50 条</option>
          </select>

          <button 
            className="reset-filters-btn"
            onClick={resetFilters}
            title="清除所有筛选条件"
          >
            重置筛选
          </button>
        </div>
        
        <div className="results-info">
          共找到 {filteredStations.length} 个站点，按站点编码排序
        </div>
      </div>

      <div className="stations-grid">
        {paginatedStations.map(station => (
          <div key={station.id} className="station-card">
            <div className="station-header">
              <div className="station-info">
                <h4>{station.name}</h4>
                <div className="station-meta">
                  <span className="station-code">{station.code}</span>
                  <span className="station-line">{station.line}</span>
                  <span className="station-city">{station.city}</span>
                </div>
              </div>
              <span className={`status ${station.status}`}>
                <span className="status-dot"></span>
                {station.status === 'active' ? '运营中' : 
                 station.status === 'inactive' ? '已关闭' : '维护中'}
              </span>
            </div>
            
            <div className="station-details">
              <div className="detail-item">
                <span className="label">地址：</span>
                <span className="value">{station.province}{station.city}{station.district}{station.address}</span>
              </div>
              <div className="detail-item">
                <span className="label">运营时间：</span>
                <span className="value">{station.openTime} - {station.closeTime}</span>
              </div>
              <div className="detail-item">
                <span className="label">闸机数量：</span>
                <span className="value">{station.gateCount} 台</span>
              </div>
              <div className="detail-item">
                <span className="label">日均客流：</span>
                <span className="value">{station.dailyFlow.toLocaleString()} 人次</span>
              </div>
            </div>
            
            <div className="station-actions">
              <button 
                className="action-btn edit"
                onClick={() => handleStationEdit(station)}
              >
                编辑
              </button>
              <button 
                className="action-btn delete"
                onClick={() => handleStationDelete(station.id)}
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            上一页
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button 
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            下一页
          </button>
          
          <span className="page-info">
            第 {currentPage} 页，共 {totalPages} 页
          </span>
        </div>
      )}
    </div>
  )

  // 渲染闸机管理
  const renderGates = () => (
    <div className="gates-section">
      <div className="section-header">
        <h3>闸机设备管理</h3>
        <div className="header-actions">
          <input
            type="text"
            placeholder="搜索站点、闸机编号或位置"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="create-btn" onClick={() => setShowGateModal(true)}>
            + 添加闸机
          </button>
        </div>
      </div>

      <div className="gates-table-container">
        <table className="gates-table">
          <thead>
            <tr>
              <th>站点</th>
              <th>闸机编号</th>
              <th>类型</th>
              <th>位置</th>
              <th>状态</th>
              <th>设备型号</th>
              <th>日通过量</th>
              <th>故障次数</th>
              <th>最后维护</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredGates.map(gate => (
              <tr key={gate.id}>
                <td>{gate.stationName}</td>
                <td>
                  <span className="gate-number">{gate.gateNumber}</span>
                </td>
                <td>
                  <span className={`gate-type ${gate.type}`}>
                    {gate.type === 'entry' ? '进站' : 
                     gate.type === 'exit' ? '出站' : '双向'}
                  </span>
                </td>
                <td>{gate.position}</td>
                <td>
                  <span className={`gate-status ${gate.status}`}>
                    <span className="status-dot"></span>
                    {gate.status === 'online' ? '在线' :
                     gate.status === 'offline' ? '离线' :
                     gate.status === 'error' ? '故障' : '维护'}
                  </span>
                </td>
                <td>
                  <div className="device-info">
                    <span>{gate.model}</span>
                    <small>{gate.serialNumber}</small>
                  </div>
                </td>
                <td>{gate.dailyPassages.toLocaleString()}</td>
                <td>
                  <span className={`error-count ${gate.errorCount > 5 ? 'high' : gate.errorCount > 0 ? 'medium' : 'low'}`}>
                    {gate.errorCount}
                  </span>
                </td>
                <td>{gate.lastMaintenance}</td>
                <td>
                  <div className="gate-actions">
                    <button 
                      className="action-btn edit"
                      onClick={() => handleGateEdit(gate)}
                    >
                      编辑
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleGateDelete(gate.id)}
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // 渲染用户管理
  const renderUsers = () => (
    <div className="users-section">
      <div className="section-header">
        <h3>闸机用户管理</h3>
        <div className="header-actions">
          <input
            type="text"
            placeholder="搜索用户姓名、卡号或手机号"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="create-btn" onClick={() => setShowUserModal(true)}>
            + 注册用户
          </button>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>卡号</th>
              <th>姓名</th>
              <th>手机号</th>
              <th>用户类型</th>
              <th>状态</th>
              <th>余额</th>
              <th>总出行次数</th>
              <th>月度限额</th>
              <th>最后使用</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <span className="card-number">{user.cardNumber}</span>
                </td>
                <td>
                  <div className="user-info">
                    <span className="user-name">{user.userName}</span>
                  </div>
                </td>
                <td>{user.phone}</td>
                <td>
                  <span className={`user-type ${user.userType}`}>
                    {user.userType === 'regular' ? '普通用户' :
                     user.userType === 'student' ? '学生' :
                     user.userType === 'senior' ? '老年人' : '员工'}
                  </span>
                </td>
                <td>
                  <span className={`user-status ${user.status}`}>
                    <span className="status-dot"></span>
                    {user.status === 'active' ? '正常' :
                     user.status === 'suspended' ? '暂停' : '过期'}
                  </span>
                </td>
                <td>
                  <span className={`balance ${user.balance < 10 ? 'low' : ''}`}>
                    ¥{user.balance.toFixed(2)}
                  </span>
                </td>
                <td>{user.totalTrips}</td>
                <td>{user.monthlyLimit}</td>
                <td>{user.lastUsed}</td>
                <td>
                  <div className="user-actions">
                    <button 
                      className="action-btn edit"
                      onClick={() => handleUserEdit(user)}
                    >
                      编辑
                    </button>
                    {user.status === 'active' ? (
                      <button 
                        className="action-btn suspend"
                        onClick={() => handleUserStatusChange(user.id, 'suspended')}
                      >
                        暂停
                      </button>
                    ) : (
                      <button 
                        className="action-btn activate"
                        onClick={() => handleUserStatusChange(user.id, 'active')}
                      >
                        激活
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // 渲染出行记录
  const renderRecords = () => (
    <div className="records-section">
      <div className="section-header">
        <h3>出行记录</h3>
        <div className="header-actions">
          <input
            type="text"
            placeholder="搜索用户、卡号或站点"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="export-btn">导出记录</button>
        </div>
      </div>

      <div className="records-table-container">
        <table className="records-table">
          <thead>
            <tr>
              <th>用户</th>
              <th>卡号</th>
              <th>进站</th>
              <th>出站</th>
              <th>进站时间</th>
              <th>出站时间</th>
              <th>行程时长</th>
              <th>费用</th>
              <th>支付方式</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map(record => (
              <tr key={record.id}>
                <td>{record.userName}</td>
                <td>
                  <span className="card-number">{record.cardNumber}</span>
                </td>
                <td>{record.entryStation}</td>
                <td>{record.exitStation || '-'}</td>
                <td>{record.entryTime}</td>
                <td>{record.exitTime || '-'}</td>
                <td>{record.duration || '-'}</td>
                <td>
                  <span className="fare">
                    {record.fare > 0 ? `¥${record.fare.toFixed(2)}` : '-'}
                  </span>
                </td>
                <td>
                  <span className={`payment-method ${record.paymentMethod}`}>
                    {record.paymentMethod === 'balance' ? '余额' :
                     record.paymentMethod === 'mobile' ? '手机支付' : '刷卡'}
                  </span>
                </td>
                <td>
                  <span className={`trip-status ${record.status}`}>
                    {record.status === 'completed' ? '已完成' :
                     record.status === 'entryOnly' ? '仅进站' : '仅出站'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="gate-management">
      <div className="management-header">
        <h2>闸机设备管理</h2>
        <p>管理地铁站点、闸机设备和用户出行服务</p>
      </div>

      <div className="management-tabs">
        <button 
          className={`tab-btn ${activeTab === 'stations' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('stations')
            setSearchTerm('')
          }}
        >
          站点管理
        </button>
        <button 
          className={`tab-btn ${activeTab === 'gates' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('gates')
            setSearchTerm('')
          }}
        >
          闸机设备
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('users')
            setSearchTerm('')
          }}
        >
          用户管理
        </button>
        <button 
          className={`tab-btn ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('records')
            setSearchTerm('')
          }}
        >
          出行记录
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'stations' && renderStations()}
        {activeTab === 'gates' && renderGates()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'records' && renderRecords()}
      </div>

      {/* 站点模态框 */}
      {showStationModal && (
        <div className="modal-overlay" onClick={() => setShowStationModal(false)}>
          <div className="modal-content station-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingStation ? '编辑站点' : '添加站点'}</h3>
              <button className="close-btn" onClick={() => setShowStationModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-container">
                <div className="form-grid">
                  <div className="form-group">
                    <label>站点名称 *</label>
                    <input
                      type="text"
                      value={stationForm.name || ''}
                      onChange={(e) => setStationForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="请输入站点名称"
                    />
                  </div>
                  <div className="form-group">
                    <label>站点编码 *</label>
                    <input
                      type="text"
                      value={stationForm.code || ''}
                      onChange={(e) => setStationForm(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="请输入站点编码"
                    />
                  </div>
                  <div className="form-group">
                    <label>所属线路 *</label>
                    <select
                      value={stationForm.line || ''}
                      onChange={(e) => setStationForm(prev => ({ ...prev, line: e.target.value }))}
                    >
                      <option value="">请选择线路</option>
                      <option value="1号线">1号线</option>
                      <option value="2号线">2号线</option>
                      <option value="3号线">3号线</option>
                      <option value="4号线">4号线</option>
                      <option value="5号线">5号线</option>
                      <option value="6号线">6号线</option>
                      <option value="10号线">10号线</option>
                    </select>
                  </div>
                  <div className="address-selection">
                    <div className="form-group">
                      <label>所属城市</label>
                      <select
                        value={stationForm.city || ''}
                        onChange={(e) => {
                          const city = e.target.value
                          // 查找该城市所属的省份
                          const province = Object.keys(regionData).find(prov => 
                            Object.keys(regionData[prov]).includes(city)
                          ) || ''
                          
                          setStationForm(prev => ({ 
                            ...prev, 
                            city,
                            province,
                            district: '' // 重置区域选择
                          }))
                        }}
                      >
                        <option value="">请选择城市</option>
                        {Object.values(regionData).flatMap(provinces => 
                          Object.keys(provinces)
                        ).map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>所属省份</label>
                      <input
                        type="text"
                        value={stationForm.province || ''}
                        readOnly
                        placeholder="请先选择城市"
                      />
                    </div>
                    <div className="form-group">
                      <label>所属区域</label>
                      <select
                        value={stationForm.district || ''}
                        onChange={(e) => setStationForm(prev => ({ ...prev, district: e.target.value }))}
                        disabled={!stationForm.city}
                      >
                        <option value="">请选择区域</option>
                        {stationForm.city && stationForm.province && 
                          regionData[stationForm.province]?.[stationForm.city]?.map((district: string) => (
                            <option key={district} value={district}>{district}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>状态</label>
                    <select
                      value={stationForm.status || 'active'}
                      onChange={(e) => setStationForm(prev => ({ ...prev, status: e.target.value as any }))}
                    >
                      <option value="active">运营中</option>
                      <option value="inactive">已关闭</option>
                      <option value="maintenance">维护中</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>开始运营时间</label>
                    <input
                      type="time"
                      value={stationForm.openTime || '05:00'}
                      onChange={(e) => setStationForm(prev => ({ ...prev, openTime: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>结束运营时间</label>
                    <input
                      type="time"
                      value={stationForm.closeTime || '23:30'}
                      onChange={(e) => setStationForm(prev => ({ ...prev, closeTime: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>闸机数量</label>
                    <input
                      type="number"
                      min="0"
                      value={stationForm.gateCount || ''}
                      onChange={(e) => setStationForm(prev => ({ ...prev, gateCount: Number(e.target.value) }))}
                      placeholder="请输入闸机数量"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>详细地址</label>
                    <input
                      type="text"
                      value={stationForm.address || ''}
                      onChange={(e) => setStationForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="请输入详细地址"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowStationModal(false)}>
                取消
              </button>
              <button className="save-btn" onClick={handleStationSave}>
                {editingStation ? '保存修改' : '添加站点'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 闸机模态框 */}
      {showGateModal && (
        <div className="modal-overlay" onClick={() => setShowGateModal(false)}>
          <div className="modal-content gate-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingGate ? '编辑闸机' : '添加闸机'}</h3>
              <button className="close-btn" onClick={() => setShowGateModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-container">
                <div className="form-grid">
                  <div className="form-group">
                    <label>所属站点 *</label>
                    <select
                      value={gateForm.stationId || ''}
                      onChange={(e) => setGateForm(prev => ({ ...prev, stationId: e.target.value }))}
                    >
                      <option value="">请选择站点</option>
                      {stations.map(station => (
                        <option key={station.id} value={station.id}>
                          {station.name} ({station.line})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>闸机编号 *</label>
                    <input
                      type="text"
                      value={gateForm.gateNumber || ''}
                      onChange={(e) => setGateForm(prev => ({ ...prev, gateNumber: e.target.value }))}
                      placeholder="如：A01"
                    />
                  </div>
                  <div className="form-group">
                    <label>闸机类型</label>
                    <select
                      value={gateForm.type || 'entry'}
                      onChange={(e) => setGateForm(prev => ({ ...prev, type: e.target.value as any }))}
                    >
                      <option value="entry">进站</option>
                      <option value="exit">出站</option>
                      <option value="bidirectional">双向</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>安装位置 *</label>
                    <input
                      type="text"
                      value={gateForm.position || ''}
                      onChange={(e) => setGateForm(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="如：A进站口"
                    />
                  </div>
                  <div className="form-group">
                    <label>设备型号</label>
                    <input
                      type="text"
                      value={gateForm.model || ''}
                      onChange={(e) => setGateForm(prev => ({ ...prev, model: e.target.value }))}
                      placeholder="如：GT-2000"
                    />
                  </div>
                  <div className="form-group">
                    <label>设备序列号</label>
                    <input
                      type="text"
                      value={gateForm.serialNumber || ''}
                      onChange={(e) => setGateForm(prev => ({ ...prev, serialNumber: e.target.value }))}
                      placeholder="如：GT2000-001"
                    />
                  </div>
                  <div className="form-group">
                    <label>设备状态</label>
                    <select
                      value={gateForm.status || 'online'}
                      onChange={(e) => setGateForm(prev => ({ ...prev, status: e.target.value as any }))}
                    >
                      <option value="online">在线</option>
                      <option value="offline">离线</option>
                      <option value="error">故障</option>
                      <option value="maintenance">维护</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowGateModal(false)}>
                取消
              </button>
              <button className="save-btn" onClick={handleGateSave}>
                {editingGate ? '保存修改' : '添加闸机'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 用户模态框 */}
      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUser ? '编辑用户' : '注册用户'}</h3>
              <button className="close-btn" onClick={() => setShowUserModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-container">
                <div className="form-grid">
                  <div className="form-group">
                    <label>卡号 *</label>
                    <input
                      type="text"
                      value={userForm.cardNumber || ''}
                      onChange={(e) => setUserForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                      placeholder="请输入16位卡号"
                      maxLength={16}
                    />
                  </div>
                  <div className="form-group">
                    <label>用户姓名 *</label>
                    <input
                      type="text"
                      value={userForm.userName || ''}
                      onChange={(e) => setUserForm(prev => ({ ...prev, userName: e.target.value }))}
                      placeholder="请输入用户姓名"
                    />
                  </div>
                  <div className="form-group">
                    <label>手机号 *</label>
                    <input
                      type="tel"
                      value={userForm.phone || ''}
                      onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="请输入手机号"
                      maxLength={11}
                    />
                  </div>
                  <div className="form-group">
                    <label>用户类型</label>
                    <select
                      value={userForm.userType || 'regular'}
                      onChange={(e) => setUserForm(prev => ({ ...prev, userType: e.target.value as any }))}
                    >
                      <option value="regular">普通用户</option>
                      <option value="student">学生</option>
                      <option value="senior">老年人</option>
                      <option value="staff">员工</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>初始余额</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={userForm.balance || ''}
                      onChange={(e) => setUserForm(prev => ({ ...prev, balance: Number(e.target.value) }))}
                      placeholder="请输入初始余额"
                    />
                  </div>
                  <div className="form-group">
                    <label>月度出行限额</label>
                    <input
                      type="number"
                      min="0"
                      value={userForm.monthlyLimit || ''}
                      onChange={(e) => setUserForm(prev => ({ ...prev, monthlyLimit: Number(e.target.value) }))}
                      placeholder="请输入月度出行限额"
                    />
                  </div>
                  <div className="form-group">
                    <label>账户状态</label>
                    <select
                      value={userForm.status || 'active'}
                      onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value as any }))}
                    >
                      <option value="active">正常</option>
                      <option value="suspended">暂停</option>
                      <option value="expired">过期</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowUserModal(false)}>
                取消
              </button>
              <button className="save-btn" onClick={handleUserSave}>
                {editingUser ? '保存修改' : '注册用户'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GateManagement
