import { useState, useEffect, useRef } from 'react'
import { siteApi, discountApi, deviceApi } from '../services/api'
import {
  City,
  Site,
  SiteQuery,
  SiteListResponse,
  SiteCreateRequest,
  SiteUpdateRequest,
  Line,
  LineQuery,
  LineListResponse,
  Device,
  DeviceQuery,
  CreateDeviceRequest,
  UpdateDeviceRequest,
  Gate,
  GateQuery,
  GateListResponse,
  GateCreateRequest,
  GateUpdateRequest
} from '../types/api'
import './GateSystem.css'

interface Station {
  id: string
  name: string
  line: string
  address: string
  status: 'active' | 'maintenance' | 'closed'
  gateCount: number
  dailyTraffic: number
  createdAt: string
}

interface Gate {
  id: string
  stationId: string
  name: string
  type: 'entry' | 'exit' | 'bidirectional'
  status: 'online' | 'offline' | 'maintenance'
  location: string
  deviceModel: string
  installDate: string
  lastMaintenance: string
  scanCount: number
  errorCount: number
}

interface QRCodeData {
  cardNumber: string
  userName: string
  userType: 'regular' | 'student' | 'senior' | 'staff'
  balance: number
  status: 'active' | 'suspended' | 'expired'
  lastUsed: string
  validUntil: string
}

interface TripEvent {
  id: string
  timestamp: string
  eventType: 'entry' | 'exit'
  cardNumber: string
  userName: string
  userType: 'regular' | 'student' | 'senior' | 'staff'
  stationId: string
  stationName: string
  gateId: string
  gateName: string
  fare: number
  balance: number
  newBalance: number
  status: 'success' | 'failed' | 'pending'
  errorMessage?: string
}

const GateSystem = () => {
  const [activeTab, setActiveTab] = useState<'stations' | 'gates' | 'scanner' | 'events'>('stations')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showStationModal, setShowStationModal] = useState(false)
  const [showGateModal, setShowGateModal] = useState(false)
  const [editingStation, setEditingStation] = useState<Station | null>(null)
  const [editingGate, setEditingGate] = useState<Gate | null>(null)
  const [selectedStation, setSelectedStation] = useState<string>('')
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<QRCodeData | null>(null)
  const [scanError, setScanError] = useState('')
  const [activeGate, setActiveGate] = useState<Gate | null>(null)

  // 站点管理API相关状态
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [sites, setSites] = useState<Site[]>([])
  const [siteQuery, setSiteQuery] = useState<SiteQuery>({
    pageNum: 1,
    pageSize: 10,  // 修改页面大小为10，用于分页显示
    keyword: '',
    status: '',
    siteType: '',
    city: '',
    orderBy: 'created_time',
    orderDirection: 'desc'
  })
  const [siteListResponse, setSiteListResponse] = useState<SiteListResponse | null>(null)
  const [lines, setLines] = useState<Line[]>([])
  const [lineQuery, setLineQuery] = useState<LineQuery>({
    pageNum: 1,
    pageSize: 10,
    keyword: '',
    city: '',
    lineType: ''
  })
  const [lineListResponse, setLineListResponse] = useState<LineListResponse | null>(null)

  // 错误状态
  const [apiError, setApiError] = useState<string>('')

  // 站点统计数据状态
  const [siteStatistics, setSiteStatistics] = useState<any>({})
  const [siteStatisticsLoading, setSiteStatisticsLoading] = useState(false)
  const [siteStatisticsError, setSiteStatisticsError] = useState('')

  // 设备统计数据状态
  const [deviceStatistics, setDeviceStatistics] = useState<any>({})
  const [deviceStatisticsLoading, setDeviceStatisticsLoading] = useState(false)
  const [deviceStatisticsError, setDeviceStatisticsError] = useState('')
  const [deviceStatisticsQuery, setDeviceStatisticsQuery] = useState({
    startDate: '',
    endDate: '',
    city: '',
    siteId: undefined as number | undefined
  })

  // 事件记录列表状态
  const [travelEvents, setTravelEvents] = useState<any[]>([])
  const [travelEventsLoading, setTravelEventsLoading] = useState(false)
  const [travelEventsError, setTravelEventsError] = useState('')
  const [travelQuery, setTravelQuery] = useState({
    pageNum: 1,
    pageSize: 10
  })
  const [travelTotal, setTravelTotal] = useState(0)

  // 站点表单状态
  const [siteForm, setSiteForm] = useState<Partial<SiteCreateRequest>>({
    siteName: '',
    siteCode: '',
    siteAddress: '',
    contactPerson: '',
    contactPhone: '',
    siteType: 'STATION',
    description: '',
    longitude: 0,
    latitude: 0,
    city: '',
    lineName: '',
    businessStartTime: '06:00',
    businessEndTime: '22:00'
  })

  // 站点数据 - 使用API返回的数据，不再使用固定数据
  const [stations, setStations] = useState<Station[]>([])

  // 站点编辑/新增相关状态
  const [showSiteModal, setShowSiteModal] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [siteFormData, setSiteFormData] = useState<Partial<SiteCreateRequest>>({})
  const [siteFormLoading, setSiteFormLoading] = useState(false)

  // 闸机管理相关状态（新增）
  const [gateListResponse, setGateListResponse] = useState<GateListResponse | null>(null)
  const [gateQuery, setGateQuery] = useState<GateQuery>({
    pageNum: 1,
    pageSize: 10,
    keyword: '',
    deviceType: '',
    status: '',
    siteId: '',
    orderBy: 'created_time',
    orderDirection: 'desc'
  })
  const [selectedSiteForGates, setSelectedSiteForGates] = useState<string>('')
  const [gateFormData, setGateFormData] = useState<Partial<GateCreateRequest>>({})
  const [gateFormLoading, setGateFormLoading] = useState(false)

  // 从站点管理跳转到闸机管理
  const viewSiteGates = (siteId: string) => {
    // 切换到闸机管理tab
    setActiveTab('gates')
    // 设置站点筛选
    const newQuery = { ...gateQuery, siteId: siteId, pageNum: 1 }
    setGateQuery(newQuery)
    setSelectedSiteForGates(siteId)
  }

  // 将API返回的Site数据转换为Station格式
  const convertSiteToStation = (site: Site): Station => {
    return {
      id: site.siteId?.toString() || '',
      name: site.siteName || '未知站点',
      line: site.lineName || '未知线路',
      address: site.siteAddress || '地址未知',
      status: site.status === 'ACTIVE' ? 'active' :
              site.status === 'MAINTENANCE' ? 'maintenance' : 'closed',
      gateCount: 0, // API中没有闸机数量，设为默认值
      dailyTraffic: 0, // API中没有日流量，设为默认值
      createdAt: site.createdTime ? site.createdTime.split('T')[0] : '未知'
    }
  }

  // 打开新增站点模态框
  const openAddSiteModal = () => {
    setEditingSite(null)
    setSiteFormData({
      siteName: '',
      siteCode: '',
      siteAddress: '',
      contactPerson: '',
      contactPhone: '', // 联系电话现在是必填字段
      siteType: 'BRANCH',
      description: '',
      longitude: 0,
      latitude: 0,
      city: '',
      lineName: '',
      businessStartTime: '05:30',
      businessEndTime: '23:00'
    })
    setApiError('') // 清空之前的错误信息
    setShowSiteModal(true)
  }

  // 打开编辑站点模态框
  const openEditSiteModal = async (station: Station) => {
    setSiteFormLoading(true)
    try {
      console.log('获取站点详情...', station.id)
      const response = await siteApi.getSiteById(station.id)
      console.log('站点详情API响应:', response)

      if (response.success && response.data) {
        setEditingSite(response.data)
        setSiteFormData({
          siteName: response.data.siteName,
          siteCode: response.data.siteCode,
          siteAddress: response.data.siteAddress || '',
          contactPerson: response.data.contactPerson || '',
          contactPhone: response.data.contactPhone || '',
          siteType: (response.data.siteType as 'BRANCH' | 'HQ' | 'TERMINAL' | 'STATION' | 'DEPOT' | 'OFFICE') || 'BRANCH',
          description: '',
          longitude: response.data.longitude || 0,
          latitude: response.data.latitude || 0,
          city: response.data.city,
          lineName: response.data.lineName || '',
          businessStartTime: response.data.businessStartTime || '05:30',
          businessEndTime: response.data.businessEndTime || '23:00'
        })
        setShowSiteModal(true)
      } else {
        setApiError(`获取站点详情失败: ${response.message}`)
      }
    } catch (err) {
      console.error('获取站点详情失败:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setApiError(`获取站点详情失败: ${errorMessage}`)
    } finally {
      setSiteFormLoading(false)
    }
  }

  // 手机号验证函数
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  // 打开新增闸机模态框
  const openAddGateModal = () => {
    setEditingGate(null)
    setGateFormData({
      deviceName: '',
      deviceCode: '',
      deviceType: 'BOTH',
      siteId: '',
      firmwareVersion: '1.0.0',
      description: '',
      ipAddress: '',
      macAddress: '',
      location: ''
    })
    setApiError('')
    setShowGateModal(true)
  }

  // 打开编辑闸机模态框
  const openEditGateModal = async (gate: Gate) => {
    console.log('gate===>', gate)
    setGateFormLoading(true)
    setApiError('') // 清空之前的错误信息
    try {
      // 尝试从多个可能的字段获取设备ID
      const deviceId = gate.id || (gate as any).deviceId || (gate as any).device_id
      console.log('🔍 获取闸机详情...', 'deviceId:', deviceId, 'gate.id:', gate.id)

      if (!deviceId) {
        throw new Error('无法获取设备ID')
      }

      const response = await deviceApi.getDevice(deviceId)
      console.log('📋 闸机详情API响应:', response)

      if (response.success && response.data) {
        // 将 Device 转换为 Gate 格式
        const gateData: Gate = {
          ...response.data,
          id: (response.data as any).deviceId?.toString() || (response.data as any).device_id?.toString() || deviceId, // 确保使用正确的设备ID
          stationId: response.data.siteId,
          name: response.data.deviceName || response.data.device_name || '',
          type: 'bidirectional' as const,
          status: ((response.data as any).status === 'ACTIVE'  ? 'online' :
                  (response.data as any).status === 'ONLINE'  ? 'online' :
                  (response.data as any).status === 'INACTIVE' ? 'offline' :
                  (response.data as any).status === 'MAINTENANCE' ? 'maintenance' : 'offline') as 'online' | 'offline' | 'maintenance',
          location: response.data.location || '',
          deviceModel: response.data.deviceType || response.data.device_type || '',
          installDate: response.data.createdTime?.split('T')[0] || response.data.created_time?.split('T')[0] || '',
          lastMaintenance: response.data.updatedTime?.split('T')[0] || response.data.updated_time?.split('T')[0] || '',
          scanCount: 0,
          errorCount: 0
        }
        setEditingGate(gateData)
        setGateFormData({
          deviceName: response.data.deviceName || response.data.device_name,
          deviceCode: response.data.deviceCode || response.data.device_code,
          deviceType: response.data.deviceType || response.data.device_type,
          siteId: response.data.siteId?.toString() || '', // 确保是字符串类型
          firmwareVersion: response.data.firmwareVersion || response.data.firmware_version,
          description: response.data.description || '',
          ipAddress: response.data.ipAddress || response.data.ip_address || '',
          macAddress: response.data.macAddress || response.data.mac_address || '',
          location: response.data.location || ''
        })
        setShowGateModal(true)
      } else {
        setApiError(`获取闸机详情失败: ${response.message}`)
        console.error('❌ 获取闸机详情失败:', response.message)
      }
    } catch (err) {
      console.error('❌ 获取闸机详情失败:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setApiError(`获取闸机详情失败: ${errorMessage}`)
    } finally {
      setGateFormLoading(false)
    }
  }

  // 关闭闸机模态框
  const closeGateModal = () => {
    setShowGateModal(false)
    setEditingGate(null)
    setGateFormData({})
    setApiError('')
  }

  // 保存闸机（新增或编辑）
  const saveGate = async () => {
    // 必填字段验证
    if (!gateFormData.deviceName) {
      alert('❌ 设备名称不能为空！')
      return
    }

    if (!gateFormData.deviceCode) {
      alert('❌ 设备代码不能为空！')
      return
    }

    if (!gateFormData.siteId) {
      alert('❌ 请选择所属站点！')
      return
    }

    setGateFormLoading(true)
    setApiError('') // 清空之前的错误信息
    try {
      let response
      if (editingGate) {
        // 编辑闸机 - 构建符合API要求的数据格式
        const updateData: UpdateDeviceRequest = {
          deviceName: gateFormData.deviceName!,
          deviceCode: gateFormData.deviceCode!,
          deviceType: gateFormData.deviceType || 'BOTH',
          siteId: gateFormData.siteId!.toString(), // 确保是字符串类型的ID
          firmwareVersion: gateFormData.firmwareVersion || '1.0.0',
          description: gateFormData.description || '',
          ipAddress: gateFormData.ipAddress || '',
          macAddress: gateFormData.macAddress || '',
          location: gateFormData.location || ''
        }
        console.log('✏️ 更新闸机...', 'editingGate.id:', editingGate.id, 'updateData:', updateData)
        console.log('✏️ editingGate完整对象:', editingGate)
        response = await deviceApi.updateDevice(editingGate.id, updateData)
        console.log('✏️ 更新闸机API响应:', response)
      } else {
        // 新增闸机 - 构建符合API要求的数据格式
        const createData: CreateDeviceRequest = {
          deviceName: gateFormData.deviceName!,
          deviceCode: gateFormData.deviceCode!,
          deviceType: gateFormData.deviceType || 'BOTH',
          siteId: gateFormData.siteId!.toString(), // 确保是字符串类型的ID
          firmwareVersion: gateFormData.firmwareVersion || '1.0.0',
          description: gateFormData.description || '',
          ipAddress: gateFormData.ipAddress || '',
          macAddress: gateFormData.macAddress || '',
          location: gateFormData.location || ''
        }
        console.log('➕ 创建闸机...', 'siteId类型:', typeof createData.siteId, 'siteId值:', createData.siteId, '完整数据:', createData)
        response = await deviceApi.createDevice(createData)
        console.log('➕ 创建闸机API响应:', response)
      }

      if (response.success) {
        // 先关闭弹窗和清理状态
        setShowGateModal(false)
        setEditingGate(null)
        setGateFormData({})
        setApiError('')

        // 显示成功提示
        alert(editingGate ? '闸机更新成功！' : '闸机创建成功！')

        // 强制刷新闸机列表
        setTimeout(() => {
          console.log('🔄 强制刷新闸机列表...')
          callGateApi(gateQuery, false, true) // 第三个参数为true表示强制刷新
        }, 100) // 短暂延迟确保弹窗完全关闭
      } else {
        setApiError(`${editingGate ? '更新' : '创建'}闸机失败: ${response.message}`)
        console.error(`❌ ${editingGate ? '更新' : '创建'}闸机失败:`, response.message)
      }
    } catch (err) {
      console.error(`❌ ${editingGate ? '更新' : '创建'}闸机失败:`, err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setApiError(`${editingGate ? '更新' : '创建'}闸机失败: ${errorMessage}`)
    } finally {
      setGateFormLoading(false)
    }
  }

  // 保存站点（新增或编辑）
  const saveSite = async () => {
    // 必填字段验证
    if (!siteFormData.siteName) {
      alert('❌ 站点名称不能为空！')
      return
    }

    if (!siteFormData.siteCode) {
      alert('❌ 站点代码不能为空！')
      return
    }

    if (!siteFormData.contactPhone) {
      alert('❌ 联系电话不能为空！')
      return
    }

    // 手机号格式验证
    if (!validatePhoneNumber(siteFormData.contactPhone)) {
      alert('❌ 联系电话格式不正确！\n请输入正确的手机号码（11位数字，以1开头）')
      return
    }

    setSiteFormLoading(true)
    try {
      let response
      if (editingSite) {
        // 编辑站点 - 构建符合API要求的数据格式
        const updateData: SiteUpdateRequest = {
          id: editingSite.siteId?.toString() || editingSite.id || '',
          siteName: siteFormData.siteName,
          siteCode: siteFormData.siteCode,
          siteAddress: siteFormData.siteAddress,
          contactPerson: siteFormData.contactPerson,
          contactPhone: siteFormData.contactPhone,
          siteType: siteFormData.siteType,
          description: siteFormData.description,
          longitude: siteFormData.longitude,
          latitude: siteFormData.latitude,
          city: siteFormData.city,
          lineName: siteFormData.lineName,
          businessStartTime: siteFormData.businessStartTime,
          businessEndTime: siteFormData.businessEndTime
        }
        console.log('更新站点...', editingSite.siteId, updateData)
        response = await siteApi.updateSite(editingSite.siteId?.toString() || editingSite.id || '', updateData)
        console.log('更新站点API响应:', response)
      } else {
        // 新增站点 - 构建符合API要求的数据格式
        const createData = {
          siteName: siteFormData.siteName!,
          siteCode: siteFormData.siteCode!,
          siteAddress: siteFormData.siteAddress || '',
          contactPerson: siteFormData.contactPerson || '',
          contactPhone: siteFormData.contactPhone || '',
          siteType: siteFormData.siteType || 'BRANCH',
          description: siteFormData.description || '',
          longitude: siteFormData.longitude || 0,
          latitude: siteFormData.latitude || 0,
          city: siteFormData.city || '',
          lineName: siteFormData.lineName || '',
          businessStartTime: siteFormData.businessStartTime || '05:30',
          businessEndTime: siteFormData.businessEndTime || '23:00'
        }
        console.log('创建站点...', createData)
        response = await siteApi.createSite(createData)
        console.log('创建站点API响应:', response)
      }

      if (response.success) {
        // 先关闭弹窗和清理状态
        setShowSiteModal(false)
        setEditingSite(null)
        setSiteFormData({})
        setApiError('')

        // 显示成功提示
        alert(editingSite ? '站点更新成功！' : '站点创建成功！')

        // 强制刷新站点列表 - 确保在弹窗关闭后执行
        setTimeout(() => {
          console.log('🔄 强制刷新站点列表...')
          callSiteApi(siteQuery, false, true) // 第三个参数为true表示强制刷新
        }, 100) // 短暂延迟确保弹窗完全关闭
      } else {
        setApiError(`${editingSite ? '更新' : '创建'}站点失败: ${response.message}`)
      }
    } catch (err) {
      console.error(`${editingSite ? '更新' : '创建'}站点失败:`, err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setApiError(`${editingSite ? '更新' : '创建'}站点失败: ${errorMessage}`)
    } finally {
      setSiteFormLoading(false)
    }
  }

  // 关闭站点模态框
  const closeSiteModal = () => {
    setShowSiteModal(false)
    setEditingSite(null)
    setSiteFormData({})
  }

  // 闸机数据 - 移除固定模拟数据，改为从API获取
  const [gates, setGates] = useState<Gate[]>([])

  // 事件数据
  const [events, setEvents] = useState<TripEvent[]>([
    {
      id: '1',
      timestamp: '2025-07-18 08:30:15',
      eventType: 'entry',
      cardNumber: '6001001234567890',
      userName: '张三',
      userType: 'regular',
      stationId: '1',
      stationName: '天安门东',
      gateId: '1',
      gateName: 'A出入口-1',
      fare: 3.00,
      balance: 128.50,
      newBalance: 125.50,
      status: 'success'
    },
    {
      id: '2',
      timestamp: '2025-07-18 08:45:22',
      eventType: 'exit',
      cardNumber: '6001001234567890',
      userName: '张三',
      userType: 'regular',
      stationId: '2',
      stationName: '王府井',
      gateId: '3',
      gateName: 'B出入口-1',
      fare: 0,
      balance: 125.50,
      newBalance: 125.50,
      status: 'success'
    }
  ])

  // 表单状态
  const [stationForm, setStationForm] = useState<Partial<Station>>({})
  const [gateForm, setGateForm] = useState<Partial<Gate>>({})



  // 获取城市列表
  const fetchCities = async () => {
    try {
      console.log('🏙️ 调用获取城市列表API...')
      const response = await siteApi.getCities()
      setCities(Array.isArray(response.data) ? response.data : [])
      console.log('✅ 城市列表获取成功:', response)
    } catch (err) {
      console.error('❌ 获取城市列表失败:', err)
      setCities([]) // 确保在错误时也设置为空数组
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setApiError(`获取城市列表失败: ${errorMessage}`)
    }
  }

  // 获取站点统计数据
  const fetchSiteStatistics = async () => {
    try {
      setSiteStatisticsLoading(true)
      setSiteStatisticsError('')
      const response = await siteApi.getSiteStatistics()

      if (response.success && response.data) {
        setSiteStatistics(response.data)
      } else {
        setSiteStatisticsError(`获取站点统计数据失败: ${response.message}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setSiteStatisticsError(`获取站点统计数据失败: ${errorMessage}`)
    } finally {
      setSiteStatisticsLoading(false)
    }
  }

  // 获取设备统计数据
  const fetchDeviceStatistics = async () => {
    try {
      setDeviceStatisticsLoading(true)
      setDeviceStatisticsError('')
      const response = await siteApi.getDeviceStatistics(deviceStatisticsQuery)

      if (response.success && response.data) {
        setDeviceStatistics(response.data)
      } else {
        setDeviceStatisticsError(`获取设备统计数据失败: ${response.message}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setDeviceStatisticsError(`获取设备统计数据失败: ${errorMessage}`)
    } finally {
      setDeviceStatisticsLoading(false)
    }
  }

  // 获取事件记录列表
  const fetchTravelEvents = async (query: { pageNum: number; pageSize: number } = travelQuery) => {
    try {
      setTravelEventsLoading(true)
      setTravelEventsError('')
      const response = await siteApi.getTravelStatistics(query)

      if (response.success && response.data) {
        // 根据实际API返回格式调整
        const data = response.data as any
        setTravelEvents(data.records || [])
        setTravelTotal(data.total || 0)
        // 更新当前页码信息
        setTravelQuery(prev => ({
          ...prev,
          pageNum: data.current || prev.pageNum
        }))
      } else {
        setTravelEventsError(`获取事件记录失败: ${response.message}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setTravelEventsError(`获取事件记录失败: ${errorMessage}`)
    } finally {
      setTravelEventsLoading(false)
    }
  }

  // 获取站点列表
  const fetchSites = async (query: SiteQuery = siteQuery) => {
    try {
      console.log('📍 调用获取站点列表API...', query)
      const response = await siteApi.getSites(query)

      if (response.success && response.data) {
        // 直接使用后端返回的数据格式
        setSiteListResponse(response.data)
        setSites(response.data.records || [])

        // 将Site数据转换为Station格式
        const convertedStations = (response.data.records || []).map(convertSiteToStation)
        setStations(convertedStations)

        console.log('✅ 站点列表获取成功:', response)
      }
    } catch (err) {
      console.error('❌ 获取站点列表失败:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setApiError(`获取站点列表失败: ${errorMessage}`)
    }
  }

  // 专门为闸机筛选获取站点数据的函数
  const fetchSitesForFilter = async () => {
    try {
      console.log('📍 为闸机筛选获取站点数据...')
      const filterQuery: SiteQuery = {
        pageNum: 1,
        pageSize: 500, // 获取500条数据用于筛选
        keyword: '',
        status: '',
        siteType: ''
      }
      const response = await siteApi.getSites(filterQuery)

      if (response.success && response.data) {
        const apiData = response.data as any
        console.log('✅ 筛选站点数据获取成功:', apiData.records?.length || 0, '条')
        // 只更新sites数据，不影响站点管理的分页数据
        setSites(apiData.records || [])
        // 转换为Station格式用于兼容
        const convertedStations = (apiData.records || []).map(convertSiteToStation)
        setStations(convertedStations)
      } else {
        console.warn('⚠️ 筛选站点数据获取失败:', response.message)
      }
    } catch (err) {
      console.error('❌ 获取筛选站点数据失败:', err)
    }
  }

  // 获取闸机列表
  const fetchGates = async (query: GateQuery = gateQuery) => {
    try {
      console.log('🚪 调用获取闸机列表API...', query)

      // 将 GateQuery 转换为 DeviceQuery 格式
      const deviceQuery: DeviceQuery = {
        pageNum: query.pageNum,
        pageSize: query.pageSize,
        keyword: query.keyword,
        siteId: query.siteId,
        status: query.status,
        deviceType: query.deviceType,
        orderBy: query.orderBy,
        orderDirection: query.orderDirection
      }

      const response = await deviceApi.getDevices(deviceQuery)

      if (response.success && response.data) {
        // 适配后端返回的数据格式 - 使用类型断言处理API返回格式
        const apiData = response.data as any
        const adaptedData: GateListResponse = {
          records: apiData.records || [],
          total: apiData.total || 0,
          size: apiData.size || query.pageSize || 10,
          current: apiData.current || query.pageNum || 1,
          pages: apiData.pages || 1,
          // 向后兼容的字段映射
          gates: apiData.records || [],
          pageNum: apiData.current || query.pageNum || 1,
          pageSize: apiData.size || query.pageSize || 10,
          totalPages: apiData.pages || 1
        }
        setGateListResponse(adaptedData)

        // 将 Device 数据转换为 Gate 格式
        const gateData = (apiData.records || []).map((device: any) => {
          console.log('设备原始数据:', device)
          const mappedDevice = {
            ...device,
            // 为了兼容现有的 Gate 接口，添加必要的字段映射
            id: (device.deviceId || device.device_id || device.id)?.toString(), // 支持多种ID字段格式，确保为字符串
          stationId: device.siteId || device.site_id,
          name: device.deviceName || device.device_name,
          type: 'bidirectional' as const, // 默认类型
          status: (device.status === 'ACTIVE' ? 'online' :
                  device.status === 'ONLINE' ? 'online' :
                  device.status === 'INACTIVE' ? 'offline' :
                  device.status === 'MAINTENANCE' ? 'maintenance' :
                  device.status === 'FAULT' ? 'offline' : 'offline') as 'online' | 'offline' | 'maintenance',
          location: device.location || '', // 确保 location 不为 undefined
          deviceModel: device.deviceType || device.device_type || '',
          installDate: device.createdTime?.split('T')[0] || device.created_time?.split('T')[0] || '',
          lastMaintenance: device.updatedTime?.split('T')[0] || device.updated_time?.split('T')[0] || '',
          scanCount: 0, // API中没有此字段，设为默认值
          errorCount: 0 // API中没有此字段，设为默认值
          }
          console.log('转换后的设备数据:', mappedDevice)
          return mappedDevice
        })
        setGates(gateData)

        console.log('✅ 闸机列表获取成功:', response)
      } else {
        console.warn('⚠️ 闸机列表API返回失败:', response.message)
        setApiError(`获取闸机列表失败: ${response.message}`)
      }
    } catch (err) {
      console.error('❌ 获取闸机列表失败:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setApiError(`获取闸机列表失败: ${errorMessage}`)
    }
  }

  // 添加一个标志来跟踪是否已经初始化
  const [isInitialized, setIsInitialized] = useState(false)
  // 添加一个ref来跟踪上次的查询参数，避免重复请求
  const lastQueryRef = useRef<string>('')
  // 添加一个ref来跟踪防抖定时器
  const debounceTimerRef = useRef<number | null>(null)

  // 统一的API调用函数
  const callSiteApi = (query: SiteQuery, isInitial = false, forceRefresh = false) => {
    const queryString = JSON.stringify(query)

    // 如果查询参数没有变化且不是强制刷新，跳过调用
    if (!isInitial && !forceRefresh && queryString === lastQueryRef.current) {
      console.log('🚫 查询参数未变化，跳过API调用')
      return
    }

    console.log(
      isInitial ? '🚀 初始化站点数据' :
      forceRefresh ? '🔄 强制刷新站点数据' :
      '🔄 查询参数变化，刷新数据',
      query
    )
    fetchSites(query)
    lastQueryRef.current = queryString
  }

  // 统一的闸机API调用函数
  const callGateApi = (query: GateQuery, isInitial = false, forceRefresh = false) => {
    const queryString = JSON.stringify(query)

    // 如果查询参数没有变化且不是强制刷新，跳过调用
    if (!isInitial && !forceRefresh && queryString === lastQueryRef.current) {
      console.log('🚫 闸机查询参数未变化，跳过API调用')
      return
    }

    console.log(
      isInitial ? '🚀 初始化闸机数据' :
      forceRefresh ? '🔄 强制刷新闸机数据' :
      '🔄 闸机查询参数变化，刷新数据',
      query
    )
    fetchGates(query)
    lastQueryRef.current = queryString
  }

  // 组件加载时获取数据
  useEffect(() => {
    fetchCities()
    fetchSiteStatistics()
  }, [])

  // 当切换到站点管理标签时初始化数据
  useEffect(() => {
    if (activeTab === 'stations' && !isInitialized) {
      callSiteApi(siteQuery, true)
      setIsInitialized(true)
    }
    // 切换tab时调用对应的统计接口
    if (activeTab === 'stations') {
      fetchSiteStatistics()
    } else if (activeTab === 'gates') {
      fetchDeviceStatistics()
    } else if (activeTab === 'events') {
      fetchTravelEvents()
    }
  }, [activeTab])

  // 当切换到闸机管理标签时初始化数据
  useEffect(() => {
    if (activeTab === 'gates') {
      callGateApi(gateQuery, true)
    }
  }, [activeTab])

  // 当闸机查询参数变化时自动刷新数据（使用防抖）
  useEffect(() => {
    if (activeTab === 'gates') {
      // 确保站点数据已加载，用于筛选下拉框
      if (sites.length === 0) {
        fetchSitesForFilter()
      }

      // 清除之前的定时器
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // 设置新的防抖定时器
      debounceTimerRef.current = setTimeout(() => {
        callGateApi(gateQuery)
      }, 300)

      // 清理函数
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
      }
    }
  }, [gateQuery, activeTab])

  // 当站点查询参数变化时自动刷新数据（使用防抖）
  useEffect(() => {
    if (isInitialized && activeTab === 'stations') {
      // 清除之前的定时器
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // 设置新的防抖定时器
      debounceTimerRef.current = setTimeout(() => {
        callSiteApi(siteQuery)
      }, 300)

      // 清理函数
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
      }
    }
  }, [siteQuery, activeTab, isInitialized])

  // 过滤数据 - 由于API已经根据siteQuery进行了筛选，直接使用stations数据
  const filteredStations = stations

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.userName.includes(searchTerm) ||
                         event.cardNumber.includes(searchTerm) ||
                         event.stationName.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // 模拟用户数据
  const mockUserData: QRCodeData[] = [
    {
      cardNumber: '6001001234567890',
      userName: '张三',
      userType: 'regular',
      balance: 125.50,
      status: 'active',
      lastUsed: '2025-07-18 08:30:15',
      validUntil: '2026-07-18'
    },
    {
      cardNumber: '6001001234567891',
      userName: '李四',
      userType: 'student',
      balance: 8.50,
      status: 'active',
      lastUsed: '2025-07-17 18:45:22',
      validUntil: '2026-07-17'
    },
    {
      cardNumber: '6001001234567892',
      userName: '王五',
      userType: 'senior',
      balance: 0,
      status: 'active',
      lastUsed: '2025-07-16 14:20:33',
      validUntil: '2026-07-16'
    }
  ]

  // 处理扫码
  const handleScan = () => {
    if (!activeGate) {
      setScanError('请先选择闸机设备')
      return
    }

    setIsScanning(true)
    setScanError('')
    setScanResult(null)

    // 模拟扫码过程
    setTimeout(() => {
      const randomCard = mockUserData[Math.floor(Math.random() * mockUserData.length)]
      
      // 模拟各种异常情况
      const random = Math.random()
      
      if (random < 0.1) {
        setScanError('二维码识别失败，请重新扫描')
        setIsScanning(false)
        return
      }
      
      if (random < 0.2) {
        setScanError('卡片已过期，请及时续费')
        setIsScanning(false)
        return
      }
      
      if (random < 0.3) {
        setScanError('账户余额不足，请充值后再试')
        setIsScanning(false)
        return
      }
      
      if (random < 0.35) {
        setScanError('账户已被暂停，请联系客服')
        setIsScanning(false)
        return
      }

      setScanResult(randomCard)
      setIsScanning(false)
    }, 2000)
  }

  // 处理进出站事件
  const handleStationEvent = (eventType: 'entry' | 'exit') => {
    if (!scanResult || !activeGate) return

    const station = stations.find(s => s.id === activeGate.stationId)
    if (!station) return

    // 计算费用
    let fare = 0
    if (eventType === 'entry') {
      fare = scanResult.userType === 'student' ? 1.50 : 
             scanResult.userType === 'senior' ? 1.00 : 3.00
    }

    // 检查余额
    if (scanResult.balance < fare) {
      setScanError('余额不足，请充值')
      return
    }

    const newEvent: TripEvent = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      eventType,
      cardNumber: scanResult.cardNumber,
      userName: scanResult.userName,
      userType: scanResult.userType,
      stationId: station.id,
      stationName: station.name,
      gateId: activeGate.id,
      gateName: activeGate.name,
      fare,
      balance: scanResult.balance,
      newBalance: scanResult.balance - fare,
      status: 'success'
    }

    setEvents(prev => [newEvent, ...prev])
    
    // 更新扫码结果中的余额
    setScanResult(prev => prev ? {
      ...prev,
      balance: prev.balance - fare,
      lastUsed: new Date().toLocaleString()
    } : null)

    // 更新闸机统计
    setGates(prev => prev.map(gate =>
      gate.id === activeGate.id ? {
        ...gate,
        scanCount: gate.scanCount + 1
      } : gate
    ))
  }

  // 处理站点保存
  const handleStationSave = () => {
    if (editingStation) {
      setStations(prev => prev.map(station =>
        station.id === editingStation.id ? { ...station, ...stationForm } as Station : station
      ))
    } else {
      const newStation: Station = {
        ...stationForm,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        gateCount: 0,
        dailyTraffic: 0
      } as Station
      setStations(prev => [...prev, newStation])
    }
    setShowStationModal(false)
    setEditingStation(null)
    setStationForm({})
  }

  // 处理闸机保存
  const handleGateSave = () => {
    if (editingGate) {
      setGates(prev => prev.map(gate =>
        gate.id === editingGate.id ? { ...gate, ...gateForm } as Gate : gate
      ))
    } else {
      const newGate: Gate = {
        ...gateForm,
        id: Date.now().toString(),
        installDate: new Date().toISOString().split('T')[0],
        lastMaintenance: new Date().toISOString().split('T')[0],
        scanCount: 0,
        errorCount: 0
      } as Gate
      setGates(prev => [...prev, newGate])
    }
    setShowGateModal(false)
    setEditingGate(null)
    setGateForm({})
  }

  // 统计数据现在通过API获取，不再使用本地计算
  // 渲染闸机管理
  const renderGates = () => (
    <div className="gates-section">
      <div className="section-header">
        <h3>闸机管理
          {gateListResponse && (
            <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>
              (共 {gateListResponse.total} 个闸机，当前显示 {gates.length} 个)
            </span>
          )}
          {gateQuery.siteId && (
            <span style={{ fontSize: '14px', color: '#007bff', fontWeight: 'normal', marginLeft: '10px' }}>
              - 筛选站点: {sites.find((s: Site) => s.siteId?.toString() === gateQuery.siteId?.toString())?.siteName || '未知站点'}
            </span>
          )}
        </h3>
        <div className="header-actions">
          <input
            type="text"
            placeholder="搜索设备名称或代码..."
            value={gateQuery.keyword || ''}
            onChange={(e) => {
              const newQuery = { ...gateQuery, keyword: e.target.value, pageNum: 1 }
              setGateQuery(newQuery)
              // 同时更新本地搜索词
              setSearchTerm(e.target.value)
            }}
            className="search-input"
          />
          <select
            value={gateQuery.deviceType || ''}
            onChange={(e) => {
              const newQuery = { ...gateQuery, deviceType: e.target.value, pageNum: 1 }
              setGateQuery(newQuery)
            }}
            className="filter-select"
          >
            <option value="">全部类型</option>
            <option value="ENTRY">进站闸机</option>
            <option value="EXIT">出站闸机</option>
            <option value="BOTH">双向闸机</option>
          </select>
          <select
            value={gateQuery.status || ''}
            onChange={(e) => {
              const newQuery = { ...gateQuery, status: e.target.value, pageNum: 1 }
              setGateQuery(newQuery)
              // 同时更新本地状态筛选
              setStatusFilter(e.target.value || 'all')
            }}
            className="filter-select"
          >
            <option value="">全部状态</option>
            <option value="ONLINE">在线</option>
            <option value="OFFLINE">离线</option>
            <option value="MAINTENANCE">维护中</option>
            <option value="FAULT">故障</option>
          </select>
          <select
            value={gateQuery.siteId || ''}
            onChange={(e) => {
              const newQuery = { ...gateQuery, siteId: e.target.value, pageNum: 1 }
              setGateQuery(newQuery)
            }}
            className="filter-select"
          >
            <option value="">全部站点</option>
            {sites.map((site: Site) => (
              <option key={site.siteId} value={site.siteId}>{site.siteName}</option>
            ))}
          </select>
          {gateQuery.siteId && (
            <button
              className="clear-filter-btn"
              onClick={() => {
                const newQuery = { ...gateQuery, siteId: '', pageNum: 1 }
                setGateQuery(newQuery)
                setSelectedSiteForGates('')
              }}
              style={{
                padding: '8px 12px',
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                color: '#6c757d',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              清除站点筛选
            </button>
          )}
          <button className="add-btn" onClick={openAddGateModal}>
            <span>+</span> 添加闸机
          </button>
          <button
            className="add-btn"
            onClick={() => {
              console.log('🔄 手动刷新闸机列表')
              callGateApi(gateQuery, false, true) // 强制刷新
            }}
            style={{ marginLeft: '10px', backgroundColor: '#28a745' }}
            title="刷新闸机列表"
          >
            🔄 刷新
          </button>
        </div>
      </div>

      {/* 闸机列表 */}
      <div className="gates-grid">
        {gates.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666',
            gridColumn: '1 / -1'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚪</div>
            <h4 style={{ marginBottom: '10px' }}>暂无闸机数据</h4>
            <p>
              {gateQuery.keyword || gateQuery.status || gateQuery.deviceType || gateQuery.siteId ?
                '没有找到符合筛选条件的闸机，请尝试调整筛选条件' :
                '正在加载闸机数据，请稍候...'}
            </p>
          </div>
        ) : (
          gates.map((gate) => (
            <div key={gate.id} className="device-card">
              {/* 设备头部信息 */}
              <div className="device-header">
                <div className="device-title">
                  <h3>{(gate as any).deviceName || (gate as any).device_name || gate.name || '未知设备'}</h3>
                  <span className="device-code">#{(gate as any).deviceCode || (gate as any).device_code || '未知代码'}</span>
                </div>
                <div className="device-status">
                  <span className={`status-indicator ${gate.status?.toLowerCase()}`}>
                    {gate.status === 'online' ? '在线' :
                     gate.status === 'offline' ? '离线' :
                     gate.status === 'maintenance' ? '维护中' : '未知'}
                  </span>
                </div>
              </div>

              {/* 设备详细信息 */}
              <div className="device-info-grid">
                <div className="info-row">
                  <span className="info-label">设备类型</span>
                  <span className="info-value">
                    {((gate as any).deviceType || (gate as any).device_type) === 'BOTH' ? '双向' :
                     ((gate as any).deviceType || (gate as any).device_type) === 'ENTRY' ? '进站' :
                     ((gate as any).deviceType || (gate as any).device_type) === 'EXIT' ? '出站' : '未知'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">设备型号</span>
                  <span className="info-value">{(gate as any).device_type_name || 'GT-2000'}</span>
                </div>
                {/* <div className="info-row">
                  <span className="info-label">扫码次数</span>
                  <span className="info-value">2,580</span>
                </div>
                <div className="info-row">
                  <span className="info-label">错误次数</span>
                  <span className="info-value">12</span>
                </div> */}
                <div className="info-row">
                  <span className="info-label">最后维护</span>
                  <span className="info-value">{(gate as any).updatedTime?.split('T')[0] || (gate as any).updated_time?.split('T')[0] || ''}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">所属站点</span>
                  <span className="info-value">{(gate as any).siteName || (gate as any).site_name || '未知站点'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">固件版本</span>
                  <span className="info-value">{(gate as any).firmwareVersion || (gate as any).firmware_version || '未知'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">IP地址</span>
                  <span className="info-value">{(gate as any).ipAddress || (gate as any).ip_address || '未设置'}</span>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="device-actions">
                <button
                  className="btn-edit"
                  onClick={() => openEditGateModal(gate)}
                  disabled={gateFormLoading}
                >
                  编辑设备
                </button>
                <button
                  className="btn-delete"
                  onClick={() => {
                    if (confirm(`确定要删除闸机 "${(gate as any).device_name || gate.name}" 吗？`)) {
                      deleteGate(gate.id)
                    }
                  }}
                >
                  删除设备
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 分页控件 */}
      {gateListResponse && (gateListResponse.pages || gateListResponse.totalPages || 1) > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '30px',
          gap: '10px'
        }}>
          <button
            onClick={() => {
              const newQuery = { ...gateQuery, pageNum: (gateQuery.pageNum || 1) - 1 }
              setGateQuery(newQuery)
            }}
            disabled={(gateQuery.pageNum || 1) <= 1}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: (gateQuery.pageNum || 1) <= 1 ? '#f5f5f5' : '#fff',
              color: (gateQuery.pageNum || 1) <= 1 ? '#999' : '#333',
              cursor: (gateQuery.pageNum || 1) <= 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ⬅️ 上一页
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '0 20px'
          }}>
            <span style={{ color: '#666', fontSize: '14px' }}>
              第 {gateQuery.pageNum || 1} / {gateListResponse.pages || gateListResponse.totalPages || 1} 页
            </span>
            <span style={{ color: '#999', fontSize: '12px' }}>
              (显示第 {((gateQuery.pageNum || 1) - 1) * (gateQuery.pageSize || 10) + 1} - {Math.min((gateQuery.pageNum || 1) * (gateQuery.pageSize || 10), gateListResponse.total)} 条，共 {gateListResponse.total} 条记录)
            </span>
          </div>

          <button
            onClick={() => {
              const newQuery = { ...gateQuery, pageNum: (gateQuery.pageNum || 1) + 1 }
              setGateQuery(newQuery)
            }}
            disabled={(gateQuery.pageNum || 1) >= (gateListResponse.pages || gateListResponse.totalPages || 1)}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: (gateQuery.pageNum || 1) >= (gateListResponse.pages || gateListResponse.totalPages || 1) ? '#f5f5f5' : '#fff',
              color: (gateQuery.pageNum || 1) >= (gateListResponse.pages || gateListResponse.totalPages || 1) ? '#999' : '#333',
              cursor: (gateQuery.pageNum || 1) >= (gateListResponse.pages || gateListResponse.totalPages || 1) ? 'not-allowed' : 'pointer'
            }}
          >
            下一页 ➡️
          </button>

          {/* 页面大小选择器 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginLeft: '20px'
          }}>
            <span style={{ fontSize: '14px', color: '#666' }}>每页显示</span>
            <select
              value={gateQuery.pageSize}
              onChange={(e) => {
                const newQuery = {
                  ...gateQuery,
                  pageSize: parseInt(e.target.value),
                  pageNum: 1  // 重置到第一页
                }
                setGateQuery(newQuery)
              }}
              style={{
                padding: '4px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value={5}>5条</option>
              <option value={10}>10条</option>
              <option value={20}>20条</option>
              <option value={50}>50条</option>
              <option value={100}>100条</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )

  // 删除闸机
  const deleteGate = async (gateId: string) => {
    try {
      console.log('🗑️ 删除闸机...', gateId)
      const response = await deviceApi.deleteDevice(gateId)
      console.log('🗑️ 删除闸机API响应:', response)

      if (response.success) {
        alert('闸机删除成功！')
        // 刷新列表
        console.log('🔄 删除成功，刷新闸机列表...')
        callGateApi(gateQuery, false, true)
      } else {
        alert(`删除闸机失败: ${response.message}`)
        console.error('❌ 删除闸机失败:', response.message)
      }
    } catch (err) {
      console.error('❌ 删除闸机失败:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      alert(`删除闸机失败: ${errorMessage}`)
    }
  }

  // 渲染站点管理
  const renderStations = () => (
    <div className="stations-section">
      <div className="section-header">
        <h3>站点管理
          {siteListResponse && (
            <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>
              (共 {siteListResponse.total} 个站点，当前显示 {stations.length} 个)
            </span>
          )}
        </h3>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="搜索站点名称或代码..."
              value={siteQuery.keyword || ''}
              onChange={(e) => {
                const newQuery = { ...siteQuery, keyword: e.target.value, pageNum: 1 }
                setSiteQuery(newQuery)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchSites(siteQuery)
                }
              }}
              className="search-input"
            />
          </div>
          <select
            value={siteQuery.status || ''}
            onChange={(e) => {
              const newQuery = { ...siteQuery, status: e.target.value, pageNum: 1 }
              setSiteQuery(newQuery)
              // 移除自动调用API，让useEffect统一处理
            }}
            className="filter-select"
          >
            <option value="">全部状态</option>
            <option value="ACTIVE">正常运营</option>
            <option value="INACTIVE">停止运营</option>
            <option value="MAINTENANCE">维护中</option>
            <option value="CONSTRUCTION">建设中</option>
          </select>
          <button className="add-btn" onClick={openAddSiteModal}>
            <span>+</span> 添加站点
          </button>
          <button
            className="add-btn"
            onClick={() => {
              console.log('🔄 手动刷新站点列表')
              callSiteApi(siteQuery, false, true) // 强制刷新
            }}
            style={{ marginLeft: '10px', backgroundColor: '#28a745' }}
            title="刷新站点列表"
          >
            🔄 刷新
          </button>
        </div>
      </div>

      <div className="stations-grid">
        {filteredStations.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666',
            gridColumn: '1 / -1'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏢</div>
            <h4 style={{ marginBottom: '10px' }}>暂无站点数据</h4>
            <p>
              {siteQuery.keyword || siteQuery.status ?
                '没有找到符合筛选条件的站点，请尝试调整筛选条件' :
                '正在加载站点数据，请稍候...'}
            </p>
          </div>
        ) : (
          filteredStations.map(station => (
          <div key={station.id} className="station-card">
            <div className="station-header">
              <div className="station-info">
                <h4>{station.name}</h4>
                <p className="station-line">{station.line}</p>
                <p className="station-address">{station.address}</p>
              </div>
              <div className={`station-status ${station.status}`}>
                <span className="status-dot"></span>
                {station.status === 'active' ? '正常运营' :
                 station.status === 'maintenance' ? '维护中' : '已关闭'}
              </div>
            </div>
            
            {/* <div className="station-stats">
              <div className="stat-item">
                <span className="stat-value">{station.gateCount}</span>
                <span className="stat-label">闸机数量</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{station.dailyTraffic.toLocaleString()}</span>
                <span className="stat-label">日均客流</span>
              </div>
            </div> */}
            
            <div className="station-actions">
              <button
                className="action-btn edit"
                onClick={() => openEditSiteModal(station)}
                disabled={siteFormLoading}
              >
                编辑
              </button>
              <button
                className="action-btn view"
                onClick={() => {
                  // 从站点数据中获取正确的siteId
                  const siteData = sites.find((s: Site) => s.siteId?.toString() === station.id)
                  const siteId = siteData ? siteData.siteId?.toString() : station.id
                  viewSiteGates(siteId)
                }}
              >
                查看闸机
              </button>
            </div>
          </div>
          ))
        )}
      </div>

      {/* 分页控件 */}
      {siteListResponse && siteListResponse.pages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          {/* 首页按钮 */}
          <button
            onClick={() => {
              const newQuery = { ...siteQuery, pageNum: 1 }
              setSiteQuery(newQuery)
            }}
            disabled={siteQuery.pageNum <= 1}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: siteQuery.pageNum <= 1 ? '#f5f5f5' : '#fff',
              color: siteQuery.pageNum <= 1 ? '#999' : '#333',
              cursor: siteQuery.pageNum <= 1 ? 'not-allowed' : 'pointer',
              fontSize: '12px'
            }}
          >
            首页
          </button>

          <button
            onClick={() => {
              const newQuery = { ...siteQuery, pageNum: siteQuery.pageNum - 1 }
              setSiteQuery(newQuery)
            }}
            disabled={siteQuery.pageNum <= 1}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: siteQuery.pageNum <= 1 ? '#f5f5f5' : '#fff',
              color: siteQuery.pageNum <= 1 ? '#999' : '#333',
              cursor: siteQuery.pageNum <= 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ⬅️ 上一页
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '0 20px'
          }}>
            <span style={{ color: '#666', fontSize: '14px' }}>
              第 {siteQuery.pageNum} / {siteListResponse.pages} 页
            </span>
            <span style={{ color: '#999', fontSize: '12px' }}>
              (显示第 {(siteQuery.pageNum - 1) * siteQuery.pageSize + 1} - {Math.min(siteQuery.pageNum * siteQuery.pageSize, siteListResponse.total)} 条，共 {siteListResponse.total} 条记录)
            </span>
          </div>

          <button
            onClick={() => {
              const newQuery = { ...siteQuery, pageNum: siteQuery.pageNum + 1 }
              setSiteQuery(newQuery)
            }}
            disabled={siteQuery.pageNum >= siteListResponse.pages}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: siteQuery.pageNum >= siteListResponse.pages ? '#f5f5f5' : '#fff',
              color: siteQuery.pageNum >= siteListResponse.pages ? '#999' : '#333',
              cursor: siteQuery.pageNum >= siteListResponse.pages ? 'not-allowed' : 'pointer'
            }}
          >
            下一页 ➡️
          </button>

          {/* 末页按钮 */}
          <button
            onClick={() => {
              const newQuery = { ...siteQuery, pageNum: siteListResponse.pages }
              setSiteQuery(newQuery)
            }}
            disabled={siteQuery.pageNum >= siteListResponse.pages}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: siteQuery.pageNum >= siteListResponse.pages ? '#f5f5f5' : '#fff',
              color: siteQuery.pageNum >= siteListResponse.pages ? '#999' : '#333',
              cursor: siteQuery.pageNum >= siteListResponse.pages ? 'not-allowed' : 'pointer',
              fontSize: '12px'
            }}
          >
            末页
          </button>

          {/* 页码跳转 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginLeft: '20px'
          }}>
            <span style={{ fontSize: '14px', color: '#666' }}>跳转到</span>
            <input
              type="number"
              min="1"
              max={siteListResponse.pages}
              value={siteQuery.pageNum}
              onChange={(e) => {
                const pageNum = parseInt(e.target.value) || 1
                if (pageNum >= 1 && pageNum <= siteListResponse.pages) {
                  const newQuery = { ...siteQuery, pageNum }
                  setSiteQuery(newQuery)
                }
              }}
              style={{
                width: '60px',
                padding: '4px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                textAlign: 'center'
              }}
            />
            <span style={{ fontSize: '14px', color: '#666' }}>页</span>
          </div>

          {/* 页面大小选择器 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginLeft: '20px'
          }}>
            <span style={{ fontSize: '14px', color: '#666' }}>每页显示</span>
            <select
              value={siteQuery.pageSize}
              onChange={(e) => {
                const newQuery = {
                  ...siteQuery,
                  pageSize: parseInt(e.target.value),
                  pageNum: 1  // 重置到第一页
                }
                setSiteQuery(newQuery)
              }}
              style={{
                padding: '4px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value={5}>5条</option>
              <option value={10}>10条</option>
              <option value={20}>20条</option>
              <option value={50}>50条</option>
              <option value={100}>100条</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )



  // 渲染扫码器
  const renderScanner = () => (
    <div className="scanner-section">
      <div className="section-header">
        <h3>扫码识别</h3>
        {activeGate && (
          <div className="active-gate-info">
            <span>当前闸机：{activeGate.name}</span>
            <span>({stations.find(s => s.id === activeGate.stationId)?.name})</span>
          </div>
        )}
      </div>

      <div className="scanner-container">
        <div className="scanner-panel">
          <div className="scanner-frame">
            <div className={`scanner-area ${isScanning ? 'scanning' : ''}`}>
              {isScanning ? (
                <div className="scanning-animation">
                  <div className="scan-line"></div>
                  <p>正在扫描...</p>
                </div>
              ) : (
                <div className="scan-placeholder">
                  <div className="scan-icon">📱</div>
                  <p>请将二维码对准扫描区域</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="scanner-controls">
            <button 
              className="scan-btn"
              onClick={handleScan}
              disabled={isScanning || !activeGate}
            >
              {isScanning ? '扫描中...' : '开始扫描'}
            </button>
            {!activeGate && (
              <p className="gate-hint">请先在闸机管理中选择一个闸机设备</p>
            )}
          </div>
        </div>

        <div className="scan-result-panel">
          {scanError && (
            <div className="scan-error">
              <div className="error-icon">⚠️</div>
              <div className="error-message">{scanError}</div>
              <button className="retry-btn" onClick={() => setScanError('')}>
                重试
              </button>
            </div>
          )}

          {scanResult && (
            <div className="scan-success">
              <div className="user-info">
                <h4>用户信息</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span>姓名</span>
                    <span>{scanResult.userName}</span>
                  </div>
                  <div className="info-item">
                    <span>卡号</span>
                    <span>{scanResult.cardNumber}</span>
                  </div>
                  <div className="info-item">
                    <span>类型</span>
                    <span className={`user-type ${scanResult.userType}`}>
                      {scanResult.userType === 'regular' ? '普通用户' :
                       scanResult.userType === 'student' ? '学生' :
                       scanResult.userType === 'senior' ? '老年人' : '员工'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span>余额</span>
                    <span className={`balance ${scanResult.balance < 10 ? 'low' : ''}`}>
                      ¥{scanResult.balance.toFixed(2)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span>状态</span>
                    <span className={`status ${scanResult.status}`}>
                      {scanResult.status === 'active' ? '正常' :
                       scanResult.status === 'suspended' ? '暂停' : '过期'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span>有效期</span>
                    <span>{scanResult.validUntil}</span>
                  </div>
                </div>
              </div>

              <div className="event-actions">
                <button 
                  className="event-btn entry"
                  onClick={() => handleStationEvent('entry')}
                  disabled={scanResult.status !== 'active'}
                >
                  进站
                </button>
                <button 
                  className="event-btn exit"
                  onClick={() => handleStationEvent('exit')}
                  disabled={scanResult.status !== 'active'}
                >
                  出站
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // 渲染事件记录
  const renderEvents = () => (
    <div className="events-section">
      <div className="section-header">
        <h3>事件记录</h3>
        <div className="header-actions">
          {/* <div className="search-container">
            <input
              type="text"
              placeholder="搜索事件..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">全部状态</option>
            <option value="success">成功</option>
            <option value="failed">失败</option>
            <option value="pending">处理中</option>
          </select> */}
        </div>
      </div>

      <div className="events-list">
        {travelEventsLoading && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666'
          }}>
            加载事件记录中...
          </div>
        )}
        {!travelEventsLoading && travelEvents.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#999'
          }}>
            暂无事件记录
          </div>
        )}
        {!travelEventsLoading && travelEvents.map((event, index) => (
          <div key={event.transactionId || index} className="event-card">
            <div className="event-header">
              <div className="event-info">
                <div className="event-type">
                  <span className={`type-badge ${event.mode?.toLowerCase() || 'subway'}`}>
                    {event.mode === 'SUBWAY' || event.mode === '地铁' ? '地铁出行' : '出行'}
                  </span>
                  <span className="event-time">{event.entryTime?.split('T')[0] || '未知时间'}</span>
                </div>
                <div className="event-user">
                  <span className="user-name">用户{event.userId}</span>
                  <span className="card-number">{event.transactionId}</span>
                </div>
              </div>
              <div className={`event-status ${event.status === 0 ? 'success' : event.status === 2 ? 'failed' : 'pending'}`}>
                <span className="status-dot"></span>
                {event.statusName || '未知状态'}
              </div>
            </div>
            
            <div className="event-details">
              <div className="detail-row">
                <span>站点</span>
                <span>{event.entrySiteName || '未知站点'} → {event.exitSiteName || '未出站'}</span>
              </div>
              <div className="detail-row">
                <span>用户类型</span>
                <span>普通用户</span>
              </div>
              <div className="detail-row">
                <span>费用</span>
                <span className="fare">¥{(event.actualAmount || 0).toFixed(2)}</span>
              </div>
              {(event.beforeBalance !== undefined && event.afterBalance !== undefined) && (
                <div className="detail-row">
                  <span>余额变动</span>
                  <span className="balance-change">
                    ¥{(event.beforeBalance || 0).toFixed(2)} → ¥{(event.afterBalance || 0).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 分页控件 */}
      {!travelEventsLoading && travelTotal > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          borderTop: '1px solid #eee',
          marginTop: '20px'
        }}>
          <button
            onClick={() => {
              const newQuery = { ...travelQuery, pageNum: travelQuery.pageNum - 1 }
              setTravelQuery(newQuery)
              fetchTravelEvents(newQuery)
            }}
            disabled={travelQuery.pageNum <= 1}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: travelQuery.pageNum <= 1 ? '#f5f5f5' : '#fff',
              color: travelQuery.pageNum <= 1 ? '#999' : '#333',
              cursor: travelQuery.pageNum <= 1 ? 'not-allowed' : 'pointer'
            }}
          >
            上一页
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '0 20px'
          }}>
            <span style={{ color: '#666', fontSize: '14px' }}>
              第 {travelQuery.pageNum} 页
            </span>
            <span style={{ color: '#999', fontSize: '12px', marginLeft: '10px' }}>
              (显示第 {(travelQuery.pageNum - 1) * travelQuery.pageSize + 1} - {Math.min(travelQuery.pageNum * travelQuery.pageSize, travelTotal)} 条，共 {travelTotal} 条记录)
            </span>
          </div>

          <button
            onClick={() => {
              const newQuery = { ...travelQuery, pageNum: travelQuery.pageNum + 1 }
              setTravelQuery(newQuery)
              fetchTravelEvents(newQuery)
            }}
            disabled={travelQuery.pageNum * travelQuery.pageSize >= travelTotal}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: travelQuery.pageNum * travelQuery.pageSize >= travelTotal ? '#f5f5f5' : '#fff',
              color: travelQuery.pageNum * travelQuery.pageSize >= travelTotal ? '#999' : '#333',
              cursor: travelQuery.pageNum * travelQuery.pageSize >= travelTotal ? 'not-allowed' : 'pointer'
            }}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="gate-system">
      <div className="system-header">
        <h2>闸机系统</h2>
        <p>统一管理站点、闸机设备和进出站事件</p>
      </div>

      <div className="system-stats">
        {/* 站点管理tab显示站点统计 */}
        {activeTab === 'stations' && (
          <>
            {siteStatisticsLoading && (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#666'
              }}>
                加载站点统计数据中...
              </div>
            )}
            {siteStatisticsError && (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '20px',
                color: '#dc3545',
                background: '#f8d7da',
                borderRadius: '4px',
                margin: '10px'
              }}>
                {siteStatisticsError}
              </div>
            )}
            {!siteStatisticsLoading && !siteStatisticsError && (
              <>
                <div className="stat-card">
                  <div className="stat-value">{siteStatistics.totalSites || 0}</div>
                  <div className="stat-label">总站点数</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{siteStatistics.activeSites || 0}</div>
                  <div className="stat-label">活跃站点</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{siteStatistics.inactiveSites || 0}</div>
                  <div className="stat-label">停用站点</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{siteStatistics.maintenanceSites || 0}</div>
                  <div className="stat-label">维护站点</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{siteStatistics.totalCities || 0}</div>
                  <div className="stat-label">覆盖城市</div>
                </div>
              </>
            )}
          </>
        )}

        {/* 闸机管理tab显示设备统计 */}
        {activeTab === 'gates' && (
          <>
            {deviceStatisticsLoading && (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#666'
              }}>
                加载设备统计数据中...
              </div>
            )}
            {deviceStatisticsError && (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '20px',
                color: '#dc3545',
                background: '#f8d7da',
                borderRadius: '4px',
                margin: '10px'
              }}>
                {deviceStatisticsError}
              </div>
            )}
            {!deviceStatisticsLoading && !deviceStatisticsError && (
              <>
                <div className="stat-card">
                  <div className="stat-value">{deviceStatistics.totalDevices || 0}</div>
                  <div className="stat-label">总设备数</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{deviceStatistics.activeDevices || 0}</div>
                  <div className="stat-label">活跃设备</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{deviceStatistics.inactiveDevices || 0}</div>
                  <div className="stat-label">停用设备</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{deviceStatistics.offlineDevices || 0}</div>
                  <div className="stat-label">离线设备</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{deviceStatistics.maintenanceDevices || 0}</div>
                  <div className="stat-label">维护设备</div>
                </div>
              </>
            )}
          </>
        )}

        {/* 其他tab显示默认统计 */}
        {activeTab !== 'stations' && activeTab !== 'gates' && (
          <>
            <div className="stat-card">
              <div className="stat-value">-</div>
              <div className="stat-label">请选择tab查看统计</div>
            </div>
          </>
        )}
      </div>

      <div className="system-tabs">
        <button
          className={`tab-btn ${activeTab === 'stations' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('stations')
            setSearchTerm('')
            setStatusFilter('all')
          }}
        >
          站点管理
        </button>
        <button
          className={`tab-btn ${activeTab === 'gates' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('gates')
            setSearchTerm('')
            setStatusFilter('all')
          }}
        >
          闸机管理
        </button>
        <button
          className={`tab-btn ${activeTab === 'scanner' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('scanner')
            setSearchTerm('')
            setStatusFilter('all')
          }}
        >
          扫码识别
        </button>
        <button
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('events')
            setSearchTerm('')
            setStatusFilter('all')
          }}
        >
          事件记录
        </button>

      </div>

      <div className="tab-content">
        {activeTab === 'stations' && renderStations()}
        {activeTab === 'gates' && renderGates()}
        {activeTab === 'scanner' && renderScanner()}
        {activeTab === 'events' && renderEvents()}

      </div>

      {/* 闸机编辑模态框 */}
      {showGateModal && (
        <div className="modal-overlay" onClick={closeGateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingGate ? '编辑闸机' : '添加闸机'}</h3>
              <button className="close-btn" onClick={closeGateModal}>×</button>
            </div>
            <div className="modal-body">
              {apiError && (
                <div className="error-message" style={{ marginBottom: '20px' }}>
                  {apiError}
                </div>
              )}
              <div className="form-grid">
                <div className="form-group">
                  <label>设备名称 *</label>
                  <input
                    type="text"
                    value={gateFormData.deviceName || ''}
                    onChange={(e) => setGateFormData({...gateFormData, deviceName: e.target.value})}
                    placeholder="请输入设备名称"
                  />
                </div>
                <div className="form-group">
                  <label>设备代码 *</label>
                  <input
                    type="text"
                    value={gateFormData.deviceCode || ''}
                    onChange={(e) => setGateFormData({...gateFormData, deviceCode: e.target.value})}
                    placeholder="请输入设备代码"
                  />
                </div>
                <div className="form-group">
                  <label>设备类型</label>
                  <select
                    value={gateFormData.deviceType || 'BOTH'}
                    onChange={(e) => setGateFormData({...gateFormData, deviceType: e.target.value})}
                  >
                    <option value="ENTRY">进站闸机</option>
                    <option value="EXIT">出站闸机</option>
                    <option value="BOTH">双向闸机</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>所属站点 *</label>
                  <select
                    value={gateFormData.siteId || ''}
                    onChange={(e) => setGateFormData({...gateFormData, siteId: e.target.value})}
                  >
                    <option value="">请选择站点</option>
                    {sites.map((site: Site) => (
                      <option key={site.siteId} value={site.siteId}>{site.siteName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>固件版本</label>
                  <input
                    type="text"
                    value={gateFormData.firmwareVersion || ''}
                    onChange={(e) => setGateFormData({...gateFormData, firmwareVersion: e.target.value})}
                    placeholder="请输入固件版本"
                  />
                </div>
                <div className="form-group">
                  <label>IP地址</label>
                  <input
                    type="text"
                    value={gateFormData.ipAddress || ''}
                    onChange={(e) => setGateFormData({...gateFormData, ipAddress: e.target.value})}
                    placeholder="请输入IP地址"
                  />
                </div>
                <div className="form-group">
                  <label>MAC地址</label>
                  <input
                    type="text"
                    value={gateFormData.macAddress || ''}
                    onChange={(e) => setGateFormData({...gateFormData, macAddress: e.target.value})}
                    placeholder="请输入MAC地址"
                  />
                </div>
                <div className="form-group">
                  <label>设备位置</label>
                  <input
                    type="text"
                    value={gateFormData.location || ''}
                    onChange={(e) => setGateFormData({...gateFormData, location: e.target.value})}
                    placeholder="请输入设备位置"
                  />
                </div>
                <div className="form-group full-width">
                  <label>设备描述</label>
                  <textarea
                    value={gateFormData.description || ''}
                    onChange={(e) => setGateFormData({...gateFormData, description: e.target.value})}
                    placeholder="请输入设备描述"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeGateModal} disabled={gateFormLoading}>
                取消
              </button>
              <button className="save-btn" onClick={saveGate} disabled={gateFormLoading}>
                {gateFormLoading ? '保存中...' : (editingGate ? '更新' : '创建')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 站点编辑模态框 */}
      {showStationModal && (
        <div className="modal-overlay" onClick={() => setShowStationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingStation ? '编辑站点' : '添加站点'}</h3>
              <button className="close-btn" onClick={() => setShowStationModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>站点名称</label>
                  <input
                    type="text"
                    value={stationForm.name || ''}
                    onChange={(e) => setStationForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="请输入站点名称"
                  />
                </div>
                <div className="form-group">
                  <label>所属线路</label>
                  <input
                    type="text"
                    value={stationForm.line || ''}
                    onChange={(e) => setStationForm(prev => ({ ...prev, line: e.target.value }))}
                    placeholder="请输入线路信息"
                  />
                </div>
                <div className="form-group full-width">
                  <label>站点地址</label>
                  <input
                    type="text"
                    value={stationForm.address || ''}
                    onChange={(e) => setStationForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="请输入站点地址"
                  />
                </div>
                <div className="form-group">
                  <label>状态</label>
                  <select
                    value={stationForm.status || 'active'}
                    onChange={(e) => setStationForm(prev => ({ ...prev, status: e.target.value as any }))}
                  >
                    <option value="active">正常运行</option>
                    <option value="maintenance">维护中</option>
                    <option value="closed">已关闭</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowStationModal(false)}>
                取消
              </button>
              <button className="save-btn" onClick={handleStationSave}>
                保存
              </button>
            </div>
          </div>
        </div>
      )}



      {/* 新的站点编辑/新增模态框 */}
      {showSiteModal && (
        <div className="modal-overlay" onClick={closeSiteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingSite ? '编辑站点' : '新增站点'}</h3>
              <button className="close-btn" onClick={closeSiteModal}>×</button>
            </div>
            <div className="modal-body">
              {apiError && (
                <div style={{
                  color: '#dc3545',
                  background: '#f8d7da',
                  padding: '10px',
                  borderRadius: '4px',
                  marginBottom: '15px'
                }}>
                  {apiError}
                </div>
              )}
              <div className="form-grid">
                <div className="form-group">
                  <label>站点名称 *</label>
                  <input
                    type="text"
                    value={siteFormData.siteName || ''}
                    onChange={(e) => setSiteFormData({...siteFormData, siteName: e.target.value})}
                    placeholder="请输入站点名称"
                  />
                </div>
                <div className="form-group">
                  <label>站点代码 *</label>
                  <input
                    type="text"
                    value={siteFormData.siteCode || ''}
                    onChange={(e) => setSiteFormData({...siteFormData, siteCode: e.target.value})}
                    placeholder="请输入站点代码"
                  />
                </div>
                <div className="form-group">
                  <label>站点地址</label>
                  <input
                    type="text"
                    value={siteFormData.siteAddress || ''}
                    onChange={(e) => setSiteFormData({...siteFormData, siteAddress: e.target.value})}
                    placeholder="请输入站点地址"
                  />
                </div>
                <div className="form-group">
                  <label>联系人</label>
                  <input
                    type="text"
                    value={siteFormData.contactPerson || ''}
                    onChange={(e) => setSiteFormData({...siteFormData, contactPerson: e.target.value})}
                    placeholder="请输入联系人姓名"
                  />
                </div>
                <div className="form-group">
                  <label>联系电话 <span style={{color: '#dc3545'}}>*</span></label>
                  <input
                    type="tel"
                    value={siteFormData.contactPhone || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '') // 只允许数字
                      if (value.length <= 11) { // 限制最大长度为11位
                        setSiteFormData({...siteFormData, contactPhone: value})
                      }
                    }}
                    placeholder="请输入11位手机号码"
                    maxLength={11}
                    style={{
                      borderColor: siteFormData.contactPhone && !validatePhoneNumber(siteFormData.contactPhone) ? '#dc3545' : '#ddd'
                    }}
                  />
                  {siteFormData.contactPhone && !validatePhoneNumber(siteFormData.contactPhone) && (
                    <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                      请输入正确的手机号码（11位数字，以1开头）
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>站点类型</label>
                  <select
                    value={siteFormData.siteType || 'BRANCH'}
                    onChange={(e) => setSiteFormData({...siteFormData, siteType: e.target.value as 'BRANCH' | 'HQ' | 'TERMINAL' | 'STATION' | 'DEPOT' | 'OFFICE'})}
                  >
                    <option value="BRANCH">分支</option>
                    <option value="HQ">总部</option>
                    <option value="TERMINAL">终端</option>
                    <option value="STATION">车站</option>
                    <option value="DEPOT">车库</option>
                    <option value="OFFICE">办公室</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>城市</label>
                  <input
                    type="text"
                    value={siteFormData.city || ''}
                    onChange={(e) => setSiteFormData({...siteFormData, city: e.target.value})}
                    placeholder="请输入城市"
                  />
                </div>
                <div className="form-group">
                  <label>线路名称</label>
                  <input
                    type="text"
                    value={siteFormData.lineName || ''}
                    onChange={(e) => setSiteFormData({...siteFormData, lineName: e.target.value})}
                    placeholder="请输入线路名称"
                  />
                </div>
                <div className="form-group">
                  <label>经度</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={siteFormData.longitude || 0}
                    onChange={(e) => setSiteFormData({...siteFormData, longitude: parseFloat(e.target.value) || 0})}
                    placeholder="请输入经度"
                  />
                </div>
                <div className="form-group">
                  <label>纬度</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={siteFormData.latitude || 0}
                    onChange={(e) => setSiteFormData({...siteFormData, latitude: parseFloat(e.target.value) || 0})}
                    placeholder="请输入纬度"
                  />
                </div>
                <div className="form-group">
                  <label>营业开始时间</label>
                  <input
                    type="time"
                    value={siteFormData.businessStartTime || '05:30'}
                    onChange={(e) => setSiteFormData({...siteFormData, businessStartTime: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>营业结束时间</label>
                  <input
                    type="time"
                    value={siteFormData.businessEndTime || '23:00'}
                    onChange={(e) => setSiteFormData({...siteFormData, businessEndTime: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>描述</label>
                  <textarea
                    value={siteFormData.description || ''}
                    onChange={(e) => setSiteFormData({...siteFormData, description: e.target.value})}
                    placeholder="请输入站点描述"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeSiteModal} disabled={siteFormLoading}>
                取消
              </button>
              <button className="save-btn" onClick={saveSite} disabled={siteFormLoading}>
                {siteFormLoading ? '保存中...' : (editingSite ? '更新' : '创建')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GateSystem
