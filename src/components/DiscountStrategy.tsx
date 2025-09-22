import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { discountApi } from '../services/api'
import { DiscountStrategy as IDiscountStrategy, City, DiscountStrategyQuery, UpdateDiscountStrategyRequest, CreateDiscountStrategyRequest } from '../types/api'
import './DiscountStrategy.css'

// 类型映射辅助函数 - 策略类型映射为API要求的四个值
const mapFormTypeToApiType = (formType: string): 'TRAVEL' | 'PAYMENT' | 'NEW_USER' | 'HOLIDAY' => {
  switch (formType) {
    case 'payment':
      return 'PAYMENT' // 支付优惠
    case 'travel':
      return 'TRAVEL' // 出行优惠
    case 'newUser':
      return 'NEW_USER' // 新用户优惠
    case 'holiday':
      return 'HOLIDAY' // 节假日优惠
    default:
      return 'PAYMENT' // 默认为支付优惠
  }
}

const mapFormTypeToDiscountType = (formType: string): 'PERCENTAGE' | 'FIXED_AMOUNT' | 'LADDER' => {
  switch (formType) {
    case 'percentage':
      return 'PERCENTAGE'
    case 'fixed':
      return 'FIXED_AMOUNT'
    case 'tiered':
      return 'LADDER'
    default:
      return 'PERCENTAGE'
  }
}

// 反向映射：将API策略类型转换为表单类型
const mapApiTypeToFormType = (apiType: string): string => {
  switch (apiType) {
    case 'PAYMENT':
      return 'payment'
    case 'TRAVEL':
      return 'travel'
    case 'NEW_USER':
      return 'newUser'
    case 'HOLIDAY':
      return 'holiday'
    default:
      return 'payment'
  }
}

const mapFormUserTypeToApiType = (formUserType: string): 'ALL' | 'NEW' | 'VIP' | 'REGULAR' => {
  switch (formUserType) {
    case 'new':
      return 'NEW'
    case 'vip':
      return 'VIP'
    case 'regular':
      return 'REGULAR'
    default:
      return 'ALL'
  }
}

interface DiscountRule {
  id: string
  name: string
  description: string
  type: 'payment' | 'travel' | 'newUser' | 'holiday' // 策略类型
  discountType?: 'percentage' | 'fixed' | 'tiered' // 折扣类型
  status: 'active' | 'inactive' | 'expired'
  startDate: string
  endDate: string
  conditions: {
    minAmount?: number
    maxAmount?: number
    paymentMethods?: string[]
    userTypes?: string[]
    firstTimeOnly?: boolean
    maxUsage?: number
    usedCount?: number
  }
  discount: {
    value: number
    maxDiscount?: number
    tiers?: { minAmount: number; discount: number }[]
  }
  createdBy: string
  createdTime: string
  lastModified: string
}

interface DiscountCategory {
  id: string
  name: string
  description: string
  icon: string
  count: number
}

const DiscountStrategy = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'analytics'>('list')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showRuleModal, setShowRuleModal] = useState(false)
  const [editingRule, setEditingRule] = useState<DiscountRule | null>(null)
  
  // 新增：查看详情相关状态
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewingStrategy, setViewingStrategy] = useState<IDiscountStrategy | null>(null)
  
  // 城市相关状态
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [strategies, setStrategies] = useState<IDiscountStrategy[]>([])
  
  // 新增：城市分析选择状态
  const [selectedCityForAnalytics, setSelectedCityForAnalytics] = useState<string>('')
  
  // 新增：批量操作状态
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([])
  const [showBatchActions, setShowBatchActions] = useState(false)
  
  // 新增：折扣策略查询状态
  const [queryParams, setQueryParams] = useState<DiscountStrategyQuery>({
    pageNum: 1,
    pageSize: 10,
    keyword: '',
    status: undefined,
    strategyType: undefined,
    discountType: undefined
    // target_city 不设置默认值，让用户自己选择是否筛选城市
  })

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  // 统计数据状态
  const [statistics, setStatistics] = useState<any>({})
  const [statisticsLoading, setStatisticsLoading] = useState(false)
  const [statisticsError, setStatisticsError] = useState('')
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })
  const [selectedStrategyType, setSelectedStrategyType] = useState('')

  // 备用城市数据 - 扩展版本包含中国主要城市
  const fallbackCities: City[] = [
    // 直辖市
    { cityCode: '110100', cityName: '北京市', provinceCode: '110000', provinceName: '北京市', isActive: true },
    { cityCode: '120100', cityName: '天津市', provinceCode: '120000', provinceName: '天津市', isActive: true },
    { cityCode: '310100', cityName: '上海市', provinceCode: '310000', provinceName: '上海市', isActive: true },
    { cityCode: '500100', cityName: '重庆市', provinceCode: '500000', provinceName: '重庆市', isActive: true },
    
    // 副省级城市及重要地级市
    { cityCode: '440100', cityName: '广州市', provinceCode: '440000', provinceName: '广东省', isActive: true },
    { cityCode: '440300', cityName: '深圳市', provinceCode: '440000', provinceName: '广东省', isActive: true },
    { cityCode: '330100', cityName: '杭州市', provinceCode: '330000', provinceName: '浙江省', isActive: true },
    { cityCode: '320100', cityName: '南京市', provinceCode: '320000', provinceName: '江苏省', isActive: true },
    { cityCode: '510100', cityName: '成都市', provinceCode: '510000', provinceName: '四川省', isActive: true },
    { cityCode: '420100', cityName: '武汉市', provinceCode: '420000', provinceName: '湖北省', isActive: true },
    { cityCode: '610100', cityName: '西安市', provinceCode: '610000', provinceName: '陕西省', isActive: true },
    { cityCode: '210100', cityName: '沈阳市', provinceCode: '210000', provinceName: '辽宁省', isActive: true },
    { cityCode: '220100', cityName: '长春市', provinceCode: '220000', provinceName: '吉林省', isActive: true },
    { cityCode: '230100', cityName: '哈尔滨市', provinceCode: '230000', provinceName: '黑龙江省', isActive: true },
    { cityCode: '370100', cityName: '济南市', provinceCode: '370000', provinceName: '山东省', isActive: true },
    { cityCode: '370200', cityName: '青岛市', provinceCode: '370000', provinceName: '山东省', isActive: true },
    { cityCode: '210200', cityName: '大连市', provinceCode: '210000', provinceName: '辽宁省', isActive: true },
    { cityCode: '330200', cityName: '宁波市', provinceCode: '330000', provinceName: '浙江省', isActive: true },
    { cityCode: '350200', cityName: '厦门市', provinceCode: '350000', provinceName: '福建省', isActive: true },
    { cityCode: '440400', cityName: '珠海市', provinceCode: '440000', provinceName: '广东省', isActive: true },
    { cityCode: '440600', cityName: '佛山市', provinceCode: '440000', provinceName: '广东省', isActive: true },
    { cityCode: '441900', cityName: '东莞市', provinceCode: '440000', provinceName: '广东省', isActive: true },
    { cityCode: '442000', cityName: '中山市', provinceCode: '440000', provinceName: '广东省', isActive: true },
    
    // 省会城市
    { cityCode: '130100', cityName: '石家庄市', provinceCode: '130000', provinceName: '河北省', isActive: true },
    { cityCode: '140100', cityName: '太原市', provinceCode: '140000', provinceName: '山西省', isActive: true },
    { cityCode: '150100', cityName: '呼和浩特市', provinceCode: '150000', provinceName: '内蒙古自治区', isActive: true },
    { cityCode: '340100', cityName: '合肥市', provinceCode: '340000', provinceName: '安徽省', isActive: true },
    { cityCode: '350100', cityName: '福州市', provinceCode: '350000', provinceName: '福建省', isActive: true },
    { cityCode: '360100', cityName: '南昌市', provinceCode: '360000', provinceName: '江西省', isActive: true },
    { cityCode: '410100', cityName: '郑州市', provinceCode: '410000', provinceName: '河南省', isActive: true },
    { cityCode: '430100', cityName: '长沙市', provinceCode: '430000', provinceName: '湖南省', isActive: true },
    { cityCode: '450100', cityName: '南宁市', provinceCode: '450000', provinceName: '广西壮族自治区', isActive: true },
    { cityCode: '460100', cityName: '海口市', provinceCode: '460000', provinceName: '海南省', isActive: true },
    { cityCode: '520100', cityName: '贵阳市', provinceCode: '520000', provinceName: '贵州省', isActive: true },
    { cityCode: '530100', cityName: '昆明市', provinceCode: '530000', provinceName: '云南省', isActive: true },
    { cityCode: '540100', cityName: '拉萨市', provinceCode: '540000', provinceName: '西藏自治区', isActive: true },
    { cityCode: '620100', cityName: '兰州市', provinceCode: '620000', provinceName: '甘肃省', isActive: true },
    { cityCode: '630100', cityName: '西宁市', provinceCode: '630000', provinceName: '青海省', isActive: true },
    { cityCode: '640100', cityName: '银川市', provinceCode: '640000', provinceName: '宁夏回族自治区', isActive: true },
    { cityCode: '650100', cityName: '乌鲁木齐市', provinceCode: '650000', provinceName: '新疆维吾尔自治区', isActive: true },
    
    // 其他重要城市
    { cityCode: '320500', cityName: '苏州市', provinceCode: '320000', provinceName: '江苏省', isActive: true },
    { cityCode: '320200', cityName: '无锡市', provinceCode: '320000', provinceName: '江苏省', isActive: true },
    { cityCode: '330300', cityName: '温州市', provinceCode: '330000', provinceName: '浙江省', isActive: true },
    { cityCode: '370600', cityName: '烟台市', provinceCode: '370000', provinceName: '山东省', isActive: true },
    { cityCode: '370700', cityName: '潍坊市', provinceCode: '370000', provinceName: '山东省', isActive: true },
    { cityCode: '350500', cityName: '泉州市', provinceCode: '350000', provinceName: '福建省', isActive: true },
    { cityCode: '460200', cityName: '三亚市', provinceCode: '460000', provinceName: '海南省', isActive: true }
  ]

  // API 钩子 - 移除不必要的城市API调用

  const {
    data: strategiesData,
    loading: strategiesLoading,
    execute: fetchStrategies
  } = useApi(discountApi.getStrategies)

  const {
    data: activeStrategiesData,
    loading: activeStrategiesLoading,
    execute: fetchActiveStrategies
  } = useApi(discountApi.getActiveStrategies)



  const {
    loading: batchUpdateLoading,
    execute: executeBatchUpdate
  } = useApi(discountApi.batchUpdateStatus)

  // 添加城市可用策略API钩子
  const {
    data: cityAvailableStrategiesData,
    loading: cityAvailableLoading,
    execute: fetchCityAvailableStrategies
  } = useApi(discountApi.getCityAvailableStrategies)

  // 获取统计数据的函数
  const fetchStatistics = async () => {
    try {
      setStatisticsLoading(true)
      setStatisticsError('')
      const response = await discountApi.getDiscountStatistics({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        strategyType: selectedStrategyType
      })

      if (response.success && response.data) {
        setStatistics(response.data)
      } else {
        setStatisticsError(`获取统计数据失败: ${response.message}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setStatisticsError(`获取统计数据失败: ${errorMessage}`)
    } finally {
      setStatisticsLoading(false)
    }
  }

  // 初始化加载折扣策略数据
  useEffect(() => {
    console.log('折扣策略管理页面初始化')

    // 首先设置备用城市数据，确保界面立即可用
    if (cities.length === 0) {
      setCities(fallbackCities)
      setSelectedCity(fallbackCities[0].cityCode)
    }

    // 直接加载折扣策略数据，不调用site接口
    const initialQuery = {
      pageNum: 1,
      pageSize: 10,
      // targetCity: fallbackCities[0].cityCode
    }
    setQueryParams(initialQuery)
    fetchStrategies(initialQuery)
  }, [])

  // 移除城市数据处理逻辑，直接使用备用数据

  // 在切换到分析页面时获取统计数据
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchStatistics()
      fetchActiveStrategies()
    }
  }, [activeTab])

  // 当日期范围或策略类型改变时，重新获取统计数据
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchStatistics()
    }
  }, [dateRange, selectedStrategyType])

  // 当选择城市时，更新查询参数并加载策略（可选传递城市参数）
  useEffect(() => {
    if (selectedCity) {
      const newQueryParams = {
        ...queryParams,
        // 可以选择是否传递城市参数，这里注释掉默认不传递
        // targetCity: selectedCity,
        pageNum: 1 // 重置到第一页
      }
      setQueryParams(newQueryParams)
      setCurrentPage(1)
      fetchStrategies(newQueryParams)
    }
  }, [selectedCity])

  // 当查询参数变化时，重新加载数据（不依赖城市参数）
  useEffect(() => {
    // 移除城市参数依赖，直接加载数据
    fetchStrategies(queryParams)
  }, [queryParams])

  // 处理策略数据加载
  useEffect(() => {
    console.log('策略数据更新:', strategiesData)
    if (strategiesData) {
      // 根据实际API返回的数据结构解析
      const records = (strategiesData as any).records || strategiesData.list || []
      const total = strategiesData.total || 0
      const current = (strategiesData as any).current || strategiesData.pageNum || 1
      const size = (strategiesData as any).size || strategiesData.pageSize || 10

      console.log('解析后的数据:', { records: records.length, total, current, size })

      setStrategies(records)
      setTotal(total)
      setCurrentPage(current)
      setPageSize(size)
    }
  }, [strategiesData])

  // 处理城市选择变化
  const handleCityChange = (cityCode: string) => {
    setSelectedCity(cityCode)
  }

  // 处理查询参数更新
  const updateQueryParams = (updates: Partial<DiscountStrategyQuery>) => {
    const newParams = { ...queryParams, ...updates, pageNum: 1 }
    setQueryParams(newParams)
  }

  // 处理分页变化
  const handlePageChange = (page: number) => {
    const newParams = { ...queryParams, pageNum: page }
    setQueryParams(newParams)
  }

  // 处理页面大小变化
  const handlePageSizeChange = (size: number) => {
    const newParams = { ...queryParams, pageSize: size, pageNum: 1 }
    setQueryParams(newParams)
  }

  // 编辑策略 - 先调用详情接口获取完整数据
  const handleEditStrategy = async (strategy: IDiscountStrategy) => {
    try {
      console.log('编辑策略，先获取详情，ID:', (strategy as any).strategyId || strategy.id)
      const strategyId = String((strategy as any).strategyId || strategy.id)
      const response = await discountApi.getStrategy(strategyId)
      const fullStrategy = response.data

      // 转换API策略为表单格式
      const ruleFormData: Partial<DiscountRule> = {
        name: (fullStrategy as any).strategyName || fullStrategy.strategyName || fullStrategy.name || '',
        description: (fullStrategy as any).description || fullStrategy.description || '',
        type: mapApiTypeToFormType((fullStrategy as any).strategyType || fullStrategy.strategyType || fullStrategy.type || 'PAYMENT') as any,
        discountType: 'percentage', // 默认为百分比折扣，可以根据实际情况调整
        status: (fullStrategy as any).status || fullStrategy.status,
        startDate: (fullStrategy as any).startTime || fullStrategy.startTime || fullStrategy.startDate || '',
        endDate: (fullStrategy as any).endTime || fullStrategy.endTime || fullStrategy.endDate || '',
        conditions: {
          minAmount: (fullStrategy as any).minAmount || fullStrategy.minAmount || fullStrategy.conditions?.min_amount,
          maxAmount: fullStrategy.conditions?.maxAmount,
          paymentMethods: fullStrategy.conditions?.payment_methods,
          userTypes: fullStrategy.conditions?.userTypes,
          firstTimeOnly: fullStrategy.conditions?.firstTimeOnly,
          maxUsage: (fullStrategy as any).usageLimit || fullStrategy.usageLimit || fullStrategy.conditions?.maxUsage,
          usedCount: (fullStrategy as any).usedCount || fullStrategy.conditions?.usedCount
        },
        discount: {
          value: (fullStrategy as any).discountRate || fullStrategy.discountRate ||
                 (fullStrategy as any).discountAmount || fullStrategy.discountAmount ||
                 fullStrategy.discount?.value || 0,
          maxDiscount: (fullStrategy as any).maxDiscount || fullStrategy.maxDiscount || fullStrategy.discount?.maxDiscount,
          tiers: fullStrategy.discount?.tiers?.map(tier => ({
            minAmount: tier.minAmount,
            discount: tier.discount
          }))
        }
      }

      // 保留原始策略数据（包含ID），而不是转换后的表单数据
      setEditingRule(fullStrategy as any)
      setRuleForm(ruleFormData as DiscountRule)
      setShowRuleModal(true)
    } catch (error) {
      console.error('获取策略详情失败:', error)
      alert('获取策略详情失败，无法编辑')
    }
  }

  // 切换策略状态
  const handleToggleStatus = async (strategy: IDiscountStrategy) => {
    try {
      if (strategy.status === 'active') {
        await discountApi.disableStrategy(strategy.id)
        alert('禁用策略成功')
      } else {
        await discountApi.enableStrategy(strategy.id)
        alert('启用策略成功')
      }
      
      // 重新获取策略列表
      if (selectedCity) {
        const refreshParams = { ...queryParams, targetCity: selectedCity }
        fetchStrategies(refreshParams)
      }
    } catch (error) {
      console.error('更新策略状态失败:', error)
      alert('更新策略状态失败')
    }
  }

  // 启用策略
  const handleEnableStrategy = async (strategyId: string | number) => {
    try {
      console.log('启用策略，ID:', strategyId)
      await discountApi.enableStrategy(String(strategyId))

      // 重新获取策略列表
      if (selectedCity) {
        const refreshParams = { ...queryParams, targetCity: selectedCity }
        fetchStrategies(refreshParams)
      }

      alert('启用策略成功')
    } catch (error) {
      console.error('启用策略失败:', error)
      alert('启用策略失败')
    }
  }

  // 禁用策略
  const handleDisableStrategy = async (strategyId: string | number) => {
    try {
      console.log('禁用策略，ID:', strategyId)
      await discountApi.disableStrategy(String(strategyId))

      // 重新获取策略列表
      if (selectedCity) {
        const refreshParams = { ...queryParams, targetCity: selectedCity }
        fetchStrategies(refreshParams)
      }

      alert('禁用策略成功')
    } catch (error) {
      console.error('禁用策略失败:', error)
      alert('禁用策略失败')
    }
  }

  // 删除策略
  const handleDeleteStrategy = async (strategyId: string | number) => {
    if (confirm('确定要删除这个折扣策略吗？')) {
      try {
        console.log('删除策略，ID:', strategyId)
        await discountApi.deleteStrategy(String(strategyId))

        // 重新获取策略列表
        if (selectedCity) {
          const refreshParams = { ...queryParams, targetCity: selectedCity }
          fetchStrategies(refreshParams)
        }

        alert('删除策略成功')
      } catch (error) {
        console.error('删除策略失败:', error)
        alert('删除策略失败')
      }
    }
  }

  // 批量更新策略状态
  const handleBatchUpdateStatus = async (status: 'ACTIVE' | 'INACTIVE') => {
    if (selectedStrategies.length === 0) {
      alert('请选择要操作的策略')
      return
    }

    const statusText = status === 'ACTIVE' ? '启用' : '禁用'
    if (confirm(`确定要批量${statusText} ${selectedStrategies.length} 个策略吗？`)) {
      try {
        // 将字符串ID数组转换为数字ID数组
        const numericIds = selectedStrategies.map(id => parseInt(id, 10))
        console.log('批量更新策略状态，ID数组:', numericIds, '状态:', status)
        await executeBatchUpdate(numericIds, status)
        
        // 清空选择
        setSelectedStrategies([])
        setShowBatchActions(false)
        
        // 重新获取策略列表
        if (selectedCity) {
          const refreshParams = { ...queryParams, target_city: selectedCity }
          fetchStrategies(refreshParams)
        }
        
        alert(`批量${statusText}策略成功`)
      } catch (error) {
        console.error(`批量${statusText}策略失败:`, error)
        alert(`批量${statusText}策略失败`)
      }
    }
  }

  // 获取策略的统一ID
  const getStrategyId = (strategy: IDiscountStrategy): string => {
    return String((strategy as any).strategyId || strategy.id)
  }

  // 生成符合规范的策略编码：^[A-Z0-9_]{4,20}$
  const generateStrategyCode = (): string => {
    const timestamp = Date.now().toString().slice(-8) // 取时间戳后8位
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase() // 4位随机字符
    return `STG_${timestamp}_${randomStr}`.substring(0, 20) // 确保不超过20位
  }

  // 处理策略选择
  const handleStrategySelect = (strategyId: string, checked: boolean) => {
    console.log('策略选择变化:', strategyId, checked)
    if (checked) {
      setSelectedStrategies(prev => {
        const newSelected = [...prev, strategyId]
        console.log('新的选中列表:', newSelected)
        return newSelected
      })
    } else {
      setSelectedStrategies(prev => {
        const newSelected = prev.filter(id => id !== strategyId)
        console.log('新的选中列表:', newSelected)
        return newSelected
      })
    }
  }

  // 全选/全不选
  const handleSelectAll = (checked: boolean) => {
    console.log('全选操作:', checked)
    if (checked) {
      const allIds = strategies.map(strategy => getStrategyId(strategy))
      console.log('全选ID列表:', allIds)
      setSelectedStrategies(allIds)
    } else {
      setSelectedStrategies([])
    }
  }

  // 监听选择状态变化，自动显示/隐藏批量操作栏
  useEffect(() => {
    console.log('选中策略变化:', selectedStrategies)
    setShowBatchActions(selectedStrategies.length > 0)
  }, [selectedStrategies])

  // 调试：打印策略列表的ID信息
  useEffect(() => {
    if (strategies.length > 0) {
      console.log('策略列表ID信息:')
      strategies.forEach((strategy, index) => {
        console.log(`策略${index}:`, {
          id: strategy.id,
          strategyId: (strategy as any).strategyId,
          name: (strategy as any).strategyName || strategy.strategyName || strategy.name
        })
      })
    }
  }, [strategies])

  // 查看策略详情
  const handleViewStrategy = async (id: string | number) => {
    try {
      console.log('查看策略详情，ID:', id)
      const strategyId = String(id) // 确保ID是字符串类型
      const response = await discountApi.getStrategy(strategyId)
      setViewingStrategy(response.data)
      setShowViewModal(true)
    } catch (error) {
      console.error('获取策略详情失败:', error)
      alert('获取策略详情失败')
    }
  }

  // 折扣策略分类
  const categories: DiscountCategory[] = [
    { id: 'all', name: '全部策略', description: '所有折扣策略', icon: '📋', count: 12 },
    { id: 'percentage', name: '百分比折扣', description: '按比例减免', icon: '💯', count: 5 },
    { id: 'fixed', name: '固定金额', description: '减免固定金额', icon: '💰', count: 3 },
    { id: 'tiered', name: '阶梯折扣', description: '按金额分档折扣', icon: '📊', count: 2 },
    { id: 'combo', name: '组合优惠', description: '多重优惠组合', icon: '🎁', count: 2 }
  ]

  // 新建/编辑折扣规则表单
  const [ruleForm, setRuleForm] = useState<Partial<DiscountRule>>({
    name: '',
    description: '',
    type: 'payment',
    status: 'active',
    startDate: '',
    endDate: '',
    conditions: {
      minAmount: 0,
      maxAmount: undefined,
      paymentMethods: [],
      userTypes: [],
      firstTimeOnly: false,
      maxUsage: undefined
    },
    discount: {
      value: 0,
      maxDiscount: undefined,
      tiers: []
    }
  })

  // 过滤折扣规则 - 使用API获取的策略数据
  const filteredRules = strategies.filter(strategy => {
    const matchesSearch = !queryParams.keyword ||
                         (strategy.strategyName || strategy.name || '').includes(queryParams.keyword) ||
                         (strategy.description && strategy.description.includes(queryParams.keyword))
    // 如果有分类过滤，可以根据策略类型过滤
    const matchesCategory = selectedCategory === 'all' ||
                           (strategy.strategyType || strategy.type) === selectedCategory
    return matchesSearch && matchesCategory
  })

  // 保存规则
  const handleSaveRule = async () => {
    if (!ruleForm.name) {
      alert('请填写策略名称')
      return
    }

    if (!selectedCity) {
      alert('请先选择城市')
      return
    }

    try {
      const now = new Date().toISOString()
      
      const strategyData = {
        ...ruleForm,
        cityCode: selectedCity,
        cityName: cities.find(c => c.cityCode === selectedCity)?.cityName || '',
        createdTime: editingRule ? ruleForm.createdTime : now,
        lastModified: now,
        createdBy: editingRule ? ruleForm.createdBy : '当前用户',
        conditions: {
          ...ruleForm.conditions,
          usedCount: editingRule ? ruleForm.conditions?.usedCount : 0
        }
      }

      if (editingRule) {
        // 将表单数据转换为API更新请求格式
        const strategyId = String((editingRule as any).strategyId || editingRule.id)
        console.log('编辑策略保存，editingRule:', editingRule)
        console.log('提取的strategyId:', strategyId)

        if (!strategyId || strategyId === 'undefined') {
          alert('无法获取策略ID，请重新打开编辑窗口')
          return
        }

        const updateData: UpdateDiscountStrategyRequest = {
          strategyName: strategyData.name || '',
          strategyCode: (editingRule as any).strategyCode || generateStrategyCode(),
          description: strategyData.description || '',
          strategyType: mapFormTypeToApiType(strategyData.type || 'percentage'),
          discountType: mapFormTypeToDiscountType(strategyData.type || 'percentage'),
          discountRate: strategyData.discountType === 'percentage' ? (strategyData.discount?.value || 0) / 100 : 0,
          discountAmount: strategyData.discountType === 'fixed' ? (strategyData.discount?.value || 0) : 0,
          minAmount: strategyData.conditions?.minAmount || 0,
          maxDiscount: strategyData.discount?.maxDiscount || 0,
          targetUserType: 'ALL', // 根据API文档设置
          targetCities: [cities.find(c => c.cityCode === selectedCity)?.cityName || '北京'],
          targetSites: [1], // 根据API文档，数组格式
          startTime: strategyData.startDate ? new Date(strategyData.startDate).toISOString() : new Date().toISOString(),
          endTime: strategyData.endDate ? new Date(strategyData.endDate).toISOString() : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 默认一年后过期
          usageLimit: strategyData.conditions?.maxUsage || 1,
          userUsageLimit: strategyData.conditions?.firstTimeOnly ? 1 : 1,
          priority: 999, // 根据API示例
          stackable: true // 根据API示例
        }

        console.log('更新策略，ID:', strategyId, '数据:', updateData)
        await discountApi.updateStrategy(strategyId, updateData)
        alert('更新策略成功')
      } else {
        // 创建新策略 - 转换为正确的API格式
        const createData: CreateDiscountStrategyRequest = {
          strategyName: strategyData.name || '',
          strategyCode: '99HVAXMV4UQB51_NX',
          description: strategyData.description || '',
          strategyType: mapFormTypeToApiType(strategyData.type || 'payment'),
          discountType: strategyData.discountType === 'percentage' ? 'PERCENTAGE' : 'LADDER',
          discountRate: strategyData.discountType === 'percentage' ? (strategyData.discount?.value || 0) / 100 : 1,
          discountAmount: strategyData.discountType === 'fixed' ? (strategyData.discount?.value || 0) : 0,
          minAmount: strategyData.conditions?.minAmount || 0,
          maxDiscount: strategyData.discount?.maxDiscount || 0,
          targetUserType: 'ALL',
          targetCities: [cities.find(c => c.cityCode === selectedCity)?.cityName || '北京'],
          targetSites: [1],
          startTime: strategyData.startDate ? new Date(strategyData.startDate).toISOString() : new Date().toISOString(),
          endTime: strategyData.endDate ? new Date(strategyData.endDate).toISOString() : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 默认一年后过期
          usageLimit: strategyData.conditions?.maxUsage || 1,
          userUsageLimit: strategyData.conditions?.firstTimeOnly ? 1 : 1,
          stackable: true,
          priority: 999
        }

        await discountApi.createStrategy(createData)
        console.log('创建策略成功:', createData)
        alert('创建策略成功')
      }

      // 重新获取策略列表
      if (selectedCity) {
        const refreshParams = { ...queryParams, targetCity: selectedCity }
        fetchStrategies(refreshParams)
      }

      setShowRuleModal(false)
      setEditingRule(null)
      setRuleForm({
        name: '',
        description: '',
        type: 'payment',
        discountType: 'percentage',
        status: 'active',
        startDate: '',
        endDate: '',
        conditions: {
          minAmount: 0,
          maxAmount: undefined,
          paymentMethods: [],
          userTypes: [],
          firstTimeOnly: false,
          maxUsage: undefined
        },
        discount: {
          value: 0,
          maxDiscount: undefined,
          tiers: []
        }
      })
    } catch (error) {
      console.error('保存策略失败:', error)
      alert('保存策略失败')
    }
  }

  // 渲染策略列表
  const renderRulesList = () => (
    <div className="rules-list-section">
      <div className="section-header">
        <h3>折扣策略管理</h3>

        <div className="header-actions">
          <div className="search-group">
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="city-selector"
              disabled={false}
            >
              <option value="">请选择城市 ({cities.length} 个可用)</option>
              {cities.map(city => (
                <option key={city.cityCode} value={city.cityCode}>
                  {city.cityName} ({city.cityCode})
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="搜索策略名称或描述"
              value={queryParams.keyword || ''}
              onChange={(e) => updateQueryParams({ keyword: e.target.value })}
              className="search-input"
            />
            <select
              value={queryParams.status || ''}
              onChange={(e) => updateQueryParams({ status: e.target.value as any })}
              className="filter-select"
            >
              <option value="">全部状态</option>
              <option value="ACTIVE">生效中</option>
              <option value="INACTIVE">已停用</option>
              <option value="EXPIRED">已过期</option>
            </select>
            <select
              value={queryParams.strategy_type || ''}
              onChange={(e) => updateQueryParams({ strategy_type: e.target.value as any })}
              className="filter-select"
            >
              <option value="">全部类型</option>
              <option value="TRAVEL">出行优惠</option>
              <option value="PAYMENT">支付优惠</option>
              <option value="NEW_USER">新用户优惠</option>
              <option value="HOLIDAY">节假日优惠</option>
            </select>
            <select
              value={queryParams.discount_type || ''}
              onChange={(e) => updateQueryParams({ discount_type: e.target.value as any })}
              className="filter-select"
            >
              <option value="">全部折扣类型</option>
              <option value="PERCENTAGE">百分比折扣</option>
              <option value="FIXED_AMOUNT">固定金额</option>
              <option value="LADDER">阶梯折扣</option>
            </select>
          </div>
          <button className="create-btn" onClick={() => {
            // 清理编辑状态，确保是新建模式
            setEditingRule(null)
            setRuleForm({
              name: '',
              description: '',
              type: 'payment',
              status: 'active',
              startDate: '',
              endDate: '',
              conditions: {
                minAmount: 0,
                maxAmount: undefined,
                paymentMethods: [],
                userTypes: [],
                firstTimeOnly: false,
                maxUsage: undefined
              },
              discount: {
                value: 0,
                maxDiscount: undefined,
                tiers: []
              }
            })
            setShowRuleModal(true)
          }}>
            + 新建策略
          </button>
        </div>
      </div>

      {/* 显示当前选择的城市信息 */}
      {selectedCity && (
        <div className="city-info" style={{
          padding: '12px 16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          border: '1px solid #e9ecef',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span className="city-label" style={{ fontWeight: '500', color: '#495057' }}>当前城市：</span>
          <span className="city-name" style={{ fontWeight: 'bold', color: '#b01111ff' }}>
            {cities.find(c => c.cityCode === selectedCity)?.cityName || selectedCity}
          </span>
          <span className="strategy-count" style={{
            color: total > 0 ? '#28a745' : '#6c757d',
            fontWeight: '500'
          }}>
            （{total} 个可用策略）
          </span>
          {strategiesLoading && (
            <span className="loading-text" style={{ color: '#007bff' }}>
              <i className="loading-icon">⏳</i> 加载中...
            </span>
          )}
        </div>
      )}

      <div className="categories-grid">
        {categories.map(category => (
          <div
            key={category.id}
            className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className="category-icon">{category.icon}</div>
            <div className="category-info">
              <h4>{category.name}</h4>
              <p>{category.description}</p>
              <span className="category-count">{category.count} 个策略</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rules-table-container">
        {/* 批量操作栏 */}
        {showBatchActions && (
          <div className="batch-actions-bar">
            <div className="selected-info">
              已选择 {selectedStrategies.length} 个策略
            </div>
            <div className="batch-buttons">
              <button 
                className="batch-btn batch-enable"
                onClick={() => handleBatchUpdateStatus('ACTIVE')}
                disabled={batchUpdateLoading}
              >
                {batchUpdateLoading ? '处理中...' : '批量启用'}
              </button>
              <button 
                className="batch-btn batch-disable"
                onClick={() => handleBatchUpdateStatus('INACTIVE')}
                disabled={batchUpdateLoading}
              >
                {batchUpdateLoading ? '处理中...' : '批量禁用'}
              </button>
              <button 
                className="batch-btn batch-cancel"
                onClick={() => {
                  setSelectedStrategies([])
                  setShowBatchActions(false)
                }}
              >
                取消选择
              </button>
            </div>
          </div>
        )}
        
        <table className="rules-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={strategies.length > 0 && selectedStrategies.length === strategies.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="select-checkbox"
                />
              </th>
              <th>策略名称</th>
              <th>类型</th>
              <th>优惠内容</th>
              <th>使用条件</th>
              <th>有效期</th>
              <th>使用情况</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {strategies.map(strategy => {
              const strategyId = getStrategyId(strategy)
              return (
              <tr key={strategyId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedStrategies.includes(strategyId)}
                    onChange={(e) => handleStrategySelect(strategyId, e.target.checked)}
                    className="select-checkbox"
                  />
                </td>
                <td>
                  <div className="rule-name">
                    <strong>{(strategy as any).strategyName || strategy.strategy_name || strategy.name || '未命名策略'}</strong>
                    <p style={{ color: '#666', fontSize: '12px', margin: '4px 0 0 0' }}>
                      {strategy.description || '暂无描述'}
                    </p>
                    {((strategy as any).strategyId || strategy.id) && (
                      <p style={{ color: '#999', fontSize: '11px', margin: '2px 0 0 0' }}>
                        ID: {(strategy as any).strategyId || strategy.id}
                      </p>
                    )}
                  </div>
                </td>
                <td>
                  <div>
                    <span className={`rule-type ${(strategy as any).strategyType || strategy.strategy_type || strategy.type}`} style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: ((strategy as any).strategyType || strategy.strategy_type) === 'TRAVEL' ? '#e3f2fd' :
                                     ((strategy as any).strategyType || strategy.strategy_type) === 'PAYMENT' ? '#f3e5f5' :
                                     ((strategy as any).strategyType || strategy.strategy_type) === 'NEW_USER' ? '#e8f5e8' :
                                     ((strategy as any).strategyType || strategy.strategy_type) === 'HOLIDAY' ? '#fff3e0' : '#f5f5f5',
                      color: ((strategy as any).strategyType || strategy.strategy_type) === 'TRAVEL' ? '#1976d2' :
                             ((strategy as any).strategyType || strategy.strategy_type) === 'PAYMENT' ? '#7b1fa2' :
                             ((strategy as any).strategyType || strategy.strategy_type) === 'NEW_USER' ? '#388e3c' :
                             ((strategy as any).strategyType || strategy.strategy_type) === 'HOLIDAY' ? '#f57c00' : '#666'
                    }}>
                      {((strategy as any).strategyType || strategy.strategy_type) === 'TRAVEL' ? '出行优惠' :
                       ((strategy as any).strategyType || strategy.strategy_type) === 'PAYMENT' ? '支付优惠' :
                       ((strategy as any).strategyType || strategy.strategy_type) === 'NEW_USER' ? '新用户优惠' :
                       ((strategy as any).strategyType || strategy.strategy_type) === 'HOLIDAY' ? '节假日优惠' :
                       (strategy as any).strategyType || strategy.strategy_type || strategy.type || '其他'}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="discount-info">
                    <div style={{ fontWeight: 'bold', color: '#e91e63', marginBottom: '4px' }}>
                      {((strategy as any).discountType || strategy.discount_type) === 'PERCENTAGE' && (strategy as any).discountRate && (
                        <span>{((strategy as any).discountRate).toFixed(1)}% 折扣</span>
                      )}
                      {((strategy as any).discountType || strategy.discount_type) === 'FIXED_AMOUNT' && (strategy as any).discountAmount && (
                        <span>减免 ¥{(strategy as any).discountAmount}</span>
                      )}
                      {((strategy as any).discountType || strategy.discount_type) === 'LADDER' && (
                        <span>阶梯折扣</span>
                      )}
                      {/* 兼容旧字段显示 */}
                      {!((strategy as any).discountType || strategy.discount_type) && strategy.discount && (
                        <>
                          {strategy.type === 'percentage' && (
                            <span>{strategy.discount.value}% 折扣</span>
                          )}
                          {strategy.type === 'fixed' && (
                            <span>减免 ¥{strategy.discount.value}</span>
                          )}
                          {strategy.type === 'tiered' && (
                            <span>{strategy.discount.tiers?.length || 0} 个档位</span>
                          )}
                        </>
                      )}
                    </div>
                    {((strategy as any).maxDiscount || strategy.max_discount || strategy.discount?.max_discount) && (
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        最高 ¥{(strategy as any).maxDiscount || strategy.max_discount || strategy.discount?.max_discount}
                      </div>
                    )}
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                      {((strategy as any).discountType || strategy.discount_type) === 'PERCENTAGE' ? '百分比折扣' :
                       ((strategy as any).discountType || strategy.discount_type) === 'FIXED_AMOUNT' ? '固定金额' :
                       ((strategy as any).discountType || strategy.discount_type) === 'LADDER' ? '阶梯折扣' : '其他'}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="conditions">
                    {((strategy as any).minAmount || strategy.min_amount || strategy.conditions?.min_amount) && (
                      <div style={{
                        padding: '2px 6px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '3px',
                        fontSize: '12px',
                        marginBottom: '4px',
                        display: 'inline-block'
                      }}>
                        满 ¥{(strategy as any).minAmount || strategy.min_amount || strategy.conditions?.min_amount}
                      </div>
                    )}
                    {((strategy as any).usageLimit || strategy.usage_limit) && (
                      <div style={{
                        padding: '2px 6px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '3px',
                        fontSize: '12px',
                        marginBottom: '4px',
                        display: 'inline-block',
                        marginLeft: '4px'
                      }}>
                        限用 {(strategy as any).usageLimit || strategy.usage_limit} 次
                      </div>
                    )}
                    {((strategy as any).usedCount !== undefined) && (
                      <div style={{
                        padding: '2px 6px',
                        backgroundColor: '#fff3e0',
                        borderRadius: '3px',
                        fontSize: '12px',
                        display: 'inline-block',
                        marginLeft: '4px'
                      }}>
                        已用 {(strategy as any).usedCount} 次
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="date-range" style={{ fontSize: '12px' }}>
                    <div style={{ color: '#666' }}>
                      开始: {strategy.start_time || strategy.startDate ?
                        new Date(strategy.start_time || strategy.startDate || '').toLocaleDateString() : '未设置'}
                    </div>
                    <div style={{ color: '#666', marginTop: '2px' }}>
                      结束: {strategy.end_time || strategy.endDate ?
                        new Date(strategy.end_time || strategy.endDate || '').toLocaleDateString() : '未设置'}
                    </div>
                    {strategy.start_time && strategy.end_time && (
                      <div style={{ color: '#999', fontSize: '11px', marginTop: '2px' }}>
                        {Math.ceil((new Date(strategy.end_time).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} 天后到期
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="usage-info">
                    <span>{strategy.conditions?.used_count || 0}</span>
                    {(strategy.usage_limit || strategy.conditions?.max_usage) && (
                      <>
                        <span>/</span>
                        <span>{strategy.usage_limit || strategy.conditions?.max_usage}</span>
                      </>
                    )}
                    <div className="usage-bar">
                      <div 
                        className="usage-fill"
                        style={{
                          width: (strategy.usage_limit || strategy.conditions?.max_usage)
                            ? `${Math.min(100, ((strategy.conditions?.used_count || 0) / (strategy.usage_limit || strategy.conditions?.max_usage || 1)) * 100)}%`
                            : '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status ${strategy.status}`} style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: (strategy.status === 'active' || (strategy.status as any) === 'ACTIVE') ? '#e8f5e8' :
                                   (strategy.status === 'inactive' || (strategy.status as any) === 'INACTIVE') ? '#ffebee' : '#f5f5f5',
                    color: (strategy.status === 'active' || (strategy.status as any) === 'ACTIVE') ? '#2e7d32' :
                           (strategy.status === 'inactive' || (strategy.status as any) === 'INACTIVE') ? '#c62828' : '#757575',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span className="status-dot" style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: (strategy.status === 'active' || (strategy.status as any) === 'ACTIVE') ? '#4caf50' :
                                     (strategy.status === 'inactive' || (strategy.status as any) === 'INACTIVE') ? '#f44336' : '#9e9e9e'
                    }}></span>
                    {(strategy.status === 'active' || (strategy.status as any) === 'ACTIVE') ? '生效中' :
                     (strategy.status === 'inactive' || (strategy.status as any) === 'INACTIVE') ? '已停用' :
                     (strategy.status as any) === 'EXPIRED' ? '已过期' : '未知状态'}
                  </span>
                </td>
                <td>
                  <div className="rule-actions">
                    <button
                      className="action-btn view"
                      onClick={() => handleViewStrategy((strategy as any).strategyId || strategy.id)}
                    >
                      查看
                    </button>
                    <button
                      className="action-btn edit"
                      onClick={() => handleEditStrategy(strategy)}
                    >
                      编辑
                    </button>
                    {((strategy as any).status === 'ACTIVE' || strategy.status === 'active') ? (
                      <button
                        className="action-btn disable"
                        onClick={() => handleDisableStrategy((strategy as any).strategyId || strategy.id)}
                      >
                        停用
                      </button>
                    ) : (
                      <button
                        className="action-btn enable"
                        onClick={() => handleEnableStrategy((strategy as any).strategyId || strategy.id)}
                      >
                        启用
                      </button>
                    )}
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteStrategy((strategy as any).strategyId || strategy.id)}
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            )})}
            {strategies.length === 0 && !strategiesLoading && (
              <tr>
                <td colSpan={7} style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#999',
                  fontSize: '14px'
                }}>
                  <div>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                    <div style={{ marginBottom: '8px' }}>暂无折扣策略数据</div>
                    <div style={{ fontSize: '12px' }}>
                      {selectedCity ? '当前城市暂无可用策略' : '请选择城市查看策略列表'}
                    </div>
                  </div>
                </td>
              </tr>
            )}
            {strategiesLoading && (
              <tr>
                <td colSpan={7} style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  <div>
                    <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
                    <div>正在加载策略数据...</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 分页控件 */}
      {total > 0 && strategies.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            <span>共 {total} 条记录</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="page-size-select"
            >
              <option value={10}>每页 10 条</option>
              <option value={20}>每页 20 条</option>
              <option value={50}>每页 50 条</option>
              <option value={100}>每页 100 条</option>
            </select>
          </div>
          
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="page-btn"
            >
              上一页
            </button>
            
            <div className="page-numbers">
              {Array.from({ length: Math.ceil(total / pageSize) }, (_, i) => i + 1)
                .filter(page => {
                  const distance = Math.abs(page - currentPage)
                  return distance <= 2 || page === 1 || page === Math.ceil(total / pageSize)
                })
                .map((page, index, array) => {
                  const prev = array[index - 1]
                  const showEllipsis = prev && page - prev > 1
                  
                  return (
                    <div key={page}>
                      {showEllipsis && <span className="ellipsis">...</span>}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`page-number ${currentPage === page ? 'active' : ''}`}
                      >
                        {page}
                      </button>
                    </div>
                  )
                })
              }
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(total / pageSize)}
              className="page-btn"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  )

  // 渲染创建/编辑规则表单
  const renderRuleForm = () => (
    <div className="rule-form-section">
      <div className="section-header">
        <h3>{editingRule ? '编辑折扣策略' : '创建折扣策略'}</h3>
        <button className="back-btn" onClick={() => setActiveTab('list')}>
          ← 返回列表
        </button>
      </div>

      <div className="form-container">
        <div className="form-section">
          <h4>基本信息</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>策略名称 *</label>
              <input
                type="text"
                value={ruleForm.name || ''}
                onChange={(e) => setRuleForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="请输入策略名称"
              />
            </div>
            <div className="form-group">
              <label>策略类型 *</label>
              <select
                value={ruleForm.type || 'payment'}
                onChange={(e) => setRuleForm(prev => ({ ...prev, type: e.target.value as any }))}
              >
                <option value="payment">支付优惠</option>
                <option value="travel">出行优惠</option>
                <option value="new_user">新用户优惠</option>
                <option value="holiday">节假日优惠</option>
              </select>
            </div>
            <div className="form-group">
              <label>折扣类型 *</label>
              <select
                value={ruleForm.discountType || 'percentage'}
                onChange={(e) => setRuleForm(prev => ({ ...prev, discountType: e.target.value as any }))}
              >
                <option value="percentage">百分比折扣</option>
                <option value="fixed">固定金额</option>
                <option value="tiered">阶梯折扣</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>策略描述</label>
              <textarea
                value={ruleForm.description || ''}
                onChange={(e) => setRuleForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="请输入策略描述"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>有效期设置</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>开始日期</label>
              <input
                type="date"
                value={ruleForm.startDate || ''}
                onChange={(e) => setRuleForm(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>结束日期</label>
              <input
                type="date"
                value={ruleForm.endDate || ''}
                onChange={(e) => setRuleForm(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>状态</label>
              <select
                value={ruleForm.status || 'active'}
                onChange={(e) => setRuleForm(prev => ({ ...prev, status: e.target.value as any }))}
              >
                <option value="active">生效中</option>
                <option value="inactive">已停用</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>优惠设置</h4>
          <div className="form-grid">
            {ruleForm.discountType === 'percentage' && (
              <>
                <div className="form-group">
                  <label>折扣比例 (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={ruleForm.discount?.value || 0}
                    onChange={(e) => setRuleForm(prev => ({
                      ...prev,
                      discount: { ...prev.discount, value: Number(e.target.value) }
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label>最大优惠金额</label>
                  <input
                    type="number"
                    min="0"
                    value={ruleForm.discount?.maxDiscount || ''}
                    onChange={(e) => {
                      const value = Number(e.target.value) || undefined
                      setRuleForm(prev => ({
                        ...prev,
                        discount: { 
                          value: prev.discount?.value || 0,
                          maxDiscount: value,
                          tiers: prev.discount?.tiers
                        }
                      }))
                    }}
                    placeholder="不限制请留空"
                  />
                </div>
              </>
            )}
            
            {ruleForm.discountType === 'fixed' && (
              <div className="form-group">
                <label>减免金额 (元)</label>
                <input
                  type="number"
                  min="0"
                  value={ruleForm.discount?.value || 0}
                  onChange={(e) => setRuleForm(prev => ({
                    ...prev,
                    discount: { ...prev.discount, value: Number(e.target.value) }
                  }))}
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h4>使用条件</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>最低消费金额</label>
              <input
                type="number"
                min="0"
                value={ruleForm.conditions?.minAmount || ''}
                onChange={(e) => setRuleForm(prev => ({
                  ...prev,
                  conditions: { ...prev.conditions, minAmount: Number(e.target.value) || undefined }
                }))}
                placeholder="无限制请留空"
              />
            </div>
            <div className="form-group">
              <label>最大使用次数</label>
              <input
                type="number"
                min="1"
                value={ruleForm.conditions?.maxUsage || ''}
                onChange={(e) => setRuleForm(prev => ({
                  ...prev,
                  conditions: { ...prev.conditions, maxUsage: Number(e.target.value) || undefined }
                }))}
                placeholder="无限制请留空"
              />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={ruleForm.conditions?.firstTimeOnly || false}
                  onChange={(e) => setRuleForm(prev => ({
                    ...prev,
                    conditions: { ...prev.conditions, firstTimeOnly: e.target.checked }
                  }))}
                />
                <span>仅限首次使用</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className="cancel-btn" onClick={() => setActiveTab('list')}>
            取消
          </button>
          <button className="save-btn" onClick={handleSaveRule}>
            {editingRule ? '保存修改' : '创建策略'}
          </button>
        </div>
      </div>
    </div>
  )

  // 渲染数据分析
  const renderAnalytics = () => {
    const activeStrategies = activeStrategiesData || []

    return (
      <div className="analytics-section">
        <div className="section-header">
          <h3>折扣策略统计</h3>
          <div className="header-actions">
            {statisticsError && (
              <div className="error-message" style={{
                color: '#dc3545',
                background: '#f8d7da',
                padding: '8px 12px',
                borderRadius: '4px',
                marginRight: '10px',
                fontSize: '14px'
              }}>
                {statisticsError}
              </div>
            )}
            <div className="date-range-picker">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                placeholder="开始日期"
                style={{ marginRight: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                placeholder="结束日期"
                style={{ marginRight: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
              <select
                value={selectedStrategyType}
                onChange={(e) => setSelectedStrategyType(e.target.value)}
                style={{ marginRight: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value="">全部类型</option>
                <option value="TRAVEL">出行优惠</option>
                <option value="PAYMENT">支付优惠</option>
                <option value="NEW_USER">新用户优惠</option>
                <option value="HOLIDAY">节假日优惠</option>
              </select>
              <button
                onClick={fetchStatistics}
                disabled={statisticsLoading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: statisticsLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {statisticsLoading ? '查询中...' : '查询'}
              </button>
            </div>
          </div>
        </div>

        <div className="analytics-cards">
          {statisticsLoading && (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              加载中...
            </div>
          )}
          {!statisticsLoading && (
            <>
              <div className="analytics-card">
                <div className="card-icon">📊</div>
                <div className="card-info">
                  <h4>总策略数</h4>
                  <div className="card-value">{statistics.totalStrategies || 0}</div>
                  <div className="card-change neutral">策略总数</div>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon">⚡</div>
                <div className="card-info">
                  <h4>活跃策略</h4>
                  <div className="card-value">{statistics.activeStrategies || 0}</div>
                  <div className="card-change positive">正在运行</div>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon">⏸️</div>
                <div className="card-info">
                  <h4>停用策略</h4>
                  <div className="card-value">{statistics.inactiveStrategies || 0}</div>
                  <div className="card-change neutral">已停用</div>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon">📈</div>
                <div className="card-info">
                  <h4>总使用次数</h4>
                  <div className="card-value">{statistics.totalUsageCount || 0}</div>
                  <div className="card-change positive">累计使用</div>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon">💰</div>
                <div className="card-info">
                  <h4>总优惠金额</h4>
                  <div className="card-value">¥{(statistics.totalDiscountAmount || 0).toFixed(2)}</div>
                  <div className="card-change positive">累计优惠</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="discount-strategy">
      <div className="strategy-header">
        <h2>折扣策略管理</h2>
        <p>配置和管理各种优惠折扣策略</p>
      </div>

      <div className="strategy-tabs">
        <button 
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          策略列表
        </button>
        <button 
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          创建策略
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          数据分析
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'list' && renderRulesList()}
        {activeTab === 'create' && renderRuleForm()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>

      {/* 规则编辑模态框 */}
      {showRuleModal && (
        <div className="modal-overlay" onClick={() => setShowRuleModal(false)}>
          <div className="modal-content rule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingRule ? '编辑折扣策略' : '创建折扣策略'}</h3>
              <button className="close-btn" onClick={() => setShowRuleModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {/* 使用相同的表单内容 */}
              <div className="form-container">
                <div className="form-section">
                  <h4>基本信息</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>策略名称 *</label>
                      <input
                        type="text"
                        value={ruleForm.name || ''}
                        onChange={(e) => setRuleForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="请输入策略名称"
                      />
                    </div>
                    <div className="form-group">
                      <label>策略类型 *</label>
                      <select
                        value={ruleForm.type || 'percentage'}
                        onChange={(e) => setRuleForm(prev => ({ ...prev, type: e.target.value as any }))}
                      >
                        <option value="payment">支付优惠</option>
                        <option value="travel">出行优惠</option>
                        <option value="new_user">新用户优惠</option>
                        <option value="holiday">节假日优惠</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>策略描述</label>
                    <textarea
                      value={ruleForm.description || ''}
                      onChange={(e) => setRuleForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="请输入策略描述"
                      rows={2}
                    />
                  </div>
                </div>
                
                <div className="form-section">
                  <h4>优惠设置</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>{ruleForm.discountType === 'percentage' ? '折扣比例 (%)' : '减免金额 (元)'}</label>
                      <input
                        type="number"
                        min="0"
                        max={ruleForm.discountType === 'percentage' ? 100 : undefined}
                        value={ruleForm.discount?.value || 0}
                        onChange={(e) => setRuleForm(prev => ({
                          ...prev,
                          discount: { ...prev.discount, value: Number(e.target.value) }
                        }))}
                      />
                    </div>
                    {ruleForm.discountType === 'percentage' && (
                      <div className="form-group">
                        <label>最大优惠金额</label>
                        <input
                          type="number"
                          min="0"
                          value={ruleForm.discount?.maxDiscount || ''}
                          onChange={(e) => {
                            const value = Number(e.target.value) || undefined
                            setRuleForm(prev => ({
                              ...prev,
                              discount: { 
                                value: prev.discount?.value || 0,
                                maxDiscount: value,
                                tiers: prev.discount?.tiers
                              }
                            }))
                          }}
                          placeholder="不限制请留空"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="form-section">
                  <h4>使用条件</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>最低消费金额</label>
                      <input
                        type="number"
                        min="0"
                        value={ruleForm.conditions?.minAmount || ''}
                        onChange={(e) => setRuleForm(prev => ({
                          ...prev,
                          conditions: { ...prev.conditions, minAmount: Number(e.target.value) || undefined }
                        }))}
                        placeholder="无限制请留空"
                      />
                    </div>
                    <div className="form-group">
                      <label>最大使用次数</label>
                      <input
                        type="number"
                        min="1"
                        value={ruleForm.conditions?.maxUsage || ''}
                        onChange={(e) => setRuleForm(prev => ({
                          ...prev,
                          conditions: { ...prev.conditions, maxUsage: Number(e.target.value) || undefined }
                        }))}
                        placeholder="无限制请留空"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={ruleForm.conditions?.firstTimeOnly || false}
                        onChange={(e) => setRuleForm(prev => ({
                          ...prev,
                          conditions: { ...prev.conditions, firstTimeOnly: e.target.checked }
                        }))}
                      />
                      <span>仅限首次使用</span>
                    </label>
                  </div>
                </div>

                <div className="form-section">
                  <h4>有效期</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>开始日期</label>
                      <input
                        type="date"
                        value={ruleForm.startDate || ''}
                        onChange={(e) => setRuleForm(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>结束日期</label>
                      <input
                        type="date"
                        value={ruleForm.endDate || ''}
                        onChange={(e) => setRuleForm(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowRuleModal(false)}>
                取消
              </button>
              <button className="save-btn" onClick={handleSaveRule}>
                {editingRule ? '保存修改' : '创建策略'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 策略详情查看模态框 */}
      {showViewModal && viewingStrategy && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px', width: '90%' }}>
            <div className="modal-header">
              <h3>策略详情</h3>
              <button 
                className="close-btn" 
                onClick={() => {
                  setShowViewModal(false)
                  setViewingStrategy(null)
                }}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="strategy-detail-section">
                <h4>基本信息</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>策略ID:</label>
                    <span>{(viewingStrategy as any).strategyId || viewingStrategy.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>策略名称:</label>
                    <span>{(viewingStrategy as any).strategyName || viewingStrategy.strategy_name || viewingStrategy.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>策略类型:</label>
                    <span>
                      {((viewingStrategy as any).strategyType || viewingStrategy.strategy_type) === 'NEW_USER' ? '新用户优惠' :
                       ((viewingStrategy as any).strategyType || viewingStrategy.strategy_type) === 'TRAVEL' ? '出行优惠' :
                       ((viewingStrategy as any).strategyType || viewingStrategy.strategy_type) === 'PAYMENT' ? '支付优惠' :
                       ((viewingStrategy as any).strategyType || viewingStrategy.strategy_type) === 'HOLIDAY' ? '节假日优惠' :
                       (viewingStrategy as any).strategyType || viewingStrategy.strategy_type}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>折扣类型:</label>
                    <span>
                      {((viewingStrategy as any).discountType || viewingStrategy.discount_type) === 'PERCENTAGE' ? '百分比折扣' :
                       ((viewingStrategy as any).discountType || viewingStrategy.discount_type) === 'FIXED_AMOUNT' ? '固定金额' :
                       ((viewingStrategy as any).discountType || viewingStrategy.discount_type) === 'LADDER' ? '阶梯折扣' :
                       (viewingStrategy as any).discountType || viewingStrategy.discount_type}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>描述:</label>
                    <span>{(viewingStrategy as any).description || viewingStrategy.description || '暂无描述'}</span>
                  </div>
                  <div className="detail-item">
                    <label>状态:</label>
                    <span className={`status ${(viewingStrategy as any).status || viewingStrategy.status}`}>
                      {((viewingStrategy as any).status || viewingStrategy.status) === 'ACTIVE' ? '生效中' :
                       ((viewingStrategy as any).status || viewingStrategy.status) === 'INACTIVE' ? '已停用' :
                       ((viewingStrategy as any).status || viewingStrategy.status) === 'EXPIRED' ? '已过期' :
                       (viewingStrategy as any).status || viewingStrategy.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>当前是否有效:</label>
                    <span>{(viewingStrategy as any).isCurrentlyValid ? '是' : '否'}</span>
                  </div>
                </div>
              </div>

              <div className="strategy-detail-section">
                <h4>折扣设置</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>折扣率:</label>
                    <span>
                      {(viewingStrategy as any).discountRate ?
                        `${((viewingStrategy as any).discountRate).toFixed(1)}%` :
                        viewingStrategy.discount_rate ?
                        `${(viewingStrategy.discount_rate * 100).toFixed(1)}%` : '0%'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>折扣金额:</label>
                    <span>¥{(viewingStrategy as any).discountAmount || viewingStrategy.discount_amount || 0}</span>
                  </div>
                  <div className="detail-item">
                    <label>最低消费:</label>
                    <span>¥{(viewingStrategy as any).minAmount || viewingStrategy.min_amount || 0}</span>
                  </div>
                  <div className="detail-item">
                    <label>最大折扣:</label>
                    <span>¥{(viewingStrategy as any).maxDiscount || viewingStrategy.max_discount || 0}</span>
                  </div>
                </div>
              </div>

              <div className="strategy-detail-section">
                <h4>目标设置</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>目标城市:</label>
                    <span>
                      {(viewingStrategy as any).targetCitiesList?.join(', ') ||
                       viewingStrategy.target_cities?.join(', ') ||
                       viewingStrategy.target_city || '未设置'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>目标站点:</label>
                    <span>{viewingStrategy.target_sites?.join(', ') || '未设置'}</span>
                  </div>
                  <div className="detail-item">
                    <label>目标用户类型:</label>
                    <span>
                      {viewingStrategy.target_user_type === 'ALL' ? '所有用户' :
                       viewingStrategy.target_user_type === 'NEW' ? '新用户' :
                       viewingStrategy.target_user_type === 'VIP' ? 'VIP用户' :
                       viewingStrategy.target_user_type === 'NORMAL' ? '普通用户' :
                       viewingStrategy.target_user_type || '所有用户'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="strategy-detail-section">
                <h4>使用限制</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>总使用次数限制:</label>
                    <span>{(viewingStrategy as any).usageLimit || viewingStrategy.usage_limit || '无限制'}</span>
                  </div>
                  <div className="detail-item">
                    <label>已使用次数:</label>
                    <span>{(viewingStrategy as any).usedCount || 0}</span>
                  </div>
                  <div className="detail-item">
                    <label>剩余次数:</label>
                    <span>{(viewingStrategy as any).remainingCount || '无限制'}</span>
                  </div>
                  <div className="detail-item">
                    <label>单用户使用限制:</label>
                    <span>{viewingStrategy.user_usage_limit || '无限制'}</span>
                  </div>
                  <div className="detail-item">
                    <label>优先级:</label>
                    <span>{viewingStrategy.priority || 0}</span>
                  </div>
                  <div className="detail-item">
                    <label>可叠加:</label>
                    <span>{viewingStrategy.stackable ? '是' : '否'}</span>
                  </div>
                </div>
              </div>

              <div className="strategy-detail-section">
                <h4>时间设置</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>开始时间:</label>
                    <span>
                      {((viewingStrategy as any).startTime || viewingStrategy.start_time) ?
                        new Date((viewingStrategy as any).startTime || viewingStrategy.start_time).toLocaleString() :
                        '未设置'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>结束时间:</label>
                    <span>
                      {((viewingStrategy as any).endTime || viewingStrategy.end_time) ?
                        new Date((viewingStrategy as any).endTime || viewingStrategy.end_time).toLocaleString() :
                        '未设置'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>创建时间:</label>
                    <span>
                      {(viewingStrategy as any).createdTime ?
                        new Date((viewingStrategy as any).createdTime).toLocaleString() :
                        '未知'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>更新时间:</label>
                    <span>
                      {(viewingStrategy as any).updatedTime ?
                        new Date((viewingStrategy as any).updatedTime).toLocaleString() :
                        '未知'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>创建人:</label>
                    <span>{(viewingStrategy as any).createdByName || `ID: ${(viewingStrategy as any).createdBy}` || '未知'}</span>
                  </div>
                </div>
              </div>

              {viewingStrategy.conditions && (
                <div className="strategy-detail-section">
                  <h4>兼容条件信息</h4>
                  <div className="detail-content">
                    <pre>{JSON.stringify(viewingStrategy.conditions, null, 2)}</pre>
                  </div>
                </div>
              )}

              {viewingStrategy.discount && (
                <div className="strategy-detail-section">
                  <h4>兼容折扣信息</h4>
                  <div className="detail-content">
                    <pre>{JSON.stringify(viewingStrategy.discount, null, 2)}</pre>
                  </div>
                </div>
              )}

              <div className="strategy-detail-section">
                <h4>其他信息</h4>
                <div className="detail-grid">
                  {viewingStrategy.created_by && (
                    <div className="detail-item">
                      <label>创建者:</label>
                      <span>{viewingStrategy.created_by}</span>
                    </div>
                  )}
                  {viewingStrategy.created_time && (
                    <div className="detail-item">
                      <label>创建时间:</label>
                      <span>{new Date(viewingStrategy.created_time).toLocaleString()}</span>
                    </div>
                  )}
                  {viewingStrategy.last_modified && (
                    <div className="detail-item">
                      <label>更新时间:</label>
                      <span>{new Date(viewingStrategy.last_modified).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-btn" 
                onClick={() => {
                  setShowViewModal(false)
                  setViewingStrategy(null)
                }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscountStrategy
