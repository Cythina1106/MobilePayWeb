import { ApiResponse, DashboardStats, UserStatistics, DeviceUsageStatistics, DeviceUsageQuery, DiscountStatistics, DiscountStatisticsQuery, SiteStatistics, Transaction, User, UserInfo, UserSearchQuery, UserSearchResult, PendingUserQuery, PendingUser, PendingUserResult, TravelRecord, TravelRecordsResponse, DiscountStrategy, City, UpdateDiscountStrategyRequest, Device, DeviceQuery, CreateDeviceRequest, UpdateDeviceRequest, Site, PageResponse, Line, LineQuery, LineListResponse } from '../types/api'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    username: 'user001',
    name: '张三',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    balance: 1299.50,
    status: 'normal',
    isVip: false,
    createTime: '2024-01-15T08:30:00Z',
    lastLoginTime: '2024-07-24T14:30:00Z',
    totalTransactions: 45,
    totalAmount: 12580.00
  },
  {
    id: '2',
    username: 'user002',
    name: '李四',
    phone: '13800138002',
    email: 'lisi@example.com',
    balance: 2899.00,
    status: 'normal',
    isVip: true,
    vipLevel: 2,
    createTime: '2024-02-20T10:15:00Z',
    lastLoginTime: '2024-07-24T16:45:00Z',
    totalTransactions: 89,
    totalAmount: 28900.00
  }
]

// 模拟待审核用户数据
const mockPendingUsers: PendingUser[] = [
  {
    id: 'pending_001',
    username: 'pending_user001',
    name: '王五',
    phone: '13900139001',
    email: 'wangwu@example.com',
    avatar: 'https://picsum.photos/80/80?random=101',
    status: 'pending',
    submitTime: '2024-07-25T09:15:00Z',
    documents: {
      idCard: 'id_card_001.jpg',
      businessLicense: 'business_001.jpg',
      bankCard: 'bank_001.jpg',
      photos: ['photo1_001.jpg', 'photo2_001.jpg']
    },
    remark: '申请开通商户支付功能'
  },
  {
    id: 'pending_002',
    username: 'pending_user002',
    name: '赵六',
    phone: '13900139002',
    email: 'zhaoliu@example.com',
    status: 'reviewing',
    submitTime: '2024-07-24T14:20:00Z',
    reviewTime: '2024-07-25T10:30:00Z',
    reviewerId: 'admin_001',
    reviewerName: '管理员张三',
    documents: {
      idCard: 'id_card_002.jpg',
      photos: ['photo1_002.jpg']
    },
    remark: '个人用户认证申请'
  },
  {
    id: 'pending_003',
    username: 'pending_user003',
    name: '孙七',
    phone: '13900139003',
    email: 'sunqi@example.com',
    status: 'rejected',
    submitTime: '2024-07-23T16:45:00Z',
    reviewTime: '2024-07-24T11:15:00Z',
    reviewerId: 'admin_002',
    reviewerName: '管理员李四',
    rejectReason: '身份证信息不清晰，请重新上传',
    documents: {
      idCard: 'id_card_003.jpg',
      bankCard: 'bank_003.jpg'
    },
    remark: '企业用户认证申请'
  },
  {
    id: 'pending_004',
    username: 'pending_user004',
    name: '周八',
    phone: '13900139004',
    status: 'pending',
    submitTime: '2024-07-26T08:30:00Z',
    documents: {
      idCard: 'id_card_004.jpg',
      businessLicense: 'business_004.jpg',
      photos: ['photo1_004.jpg', 'photo2_004.jpg', 'photo3_004.jpg']
    },
    remark: '高级商户权限申请'
  },
  {
    id: 'pending_005',
    username: 'pending_user005',
    name: '吴九',
    phone: '13900139005',
    email: 'wujiu@example.com',
    status: 'reviewing',
    submitTime: '2024-07-25T13:20:00Z',
    reviewTime: '2024-07-26T09:45:00Z',
    reviewerId: 'admin_001',
    reviewerName: '管理员张三',
    documents: {
      idCard: 'id_card_005.jpg',
      bankCard: 'bank_005.jpg',
      photos: ['photo1_005.jpg']
    },
    remark: 'VIP用户升级申请'
  }
]

// 模拟城市数据 - 扩展版本包含更多主要城市
const mockCities: City[] = [
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
  { cityCode: '440700', cityName: '江门市', provinceCode: '440000', provinceName: '广东省', isActive: true },
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

// 模拟折扣策略数据
const mockDiscountStrategies: DiscountStrategy[] = [
  {
    id: '1',
    strategy_name: '新用户首次支付优惠',
    strategy_code: 'NEW_USER_FIRST_PAY',
    description: '新用户首次使用支付享受9折优惠',
    strategy_type: 'NEW_USER',
    discount_type: 'PERCENTAGE',
    status: 'active',
    discount_rate: 0.9,
    discount_amount: 0,
    min_amount: 10,
    max_discount: 50,
    target_user_type: 'NEW',
    target_cities: ['北京'],
    target_sites: [1, 2],
    start_time: '2024-01-01T00:00:00Z',
    end_time: '2024-12-31T23:59:59Z',
    usage_limit: 1000,
    user_usage_limit: 1,
    priority: 1,
    stackable: false,
    created_by: 'admin',
    created_time: '2024-01-01T00:00:00Z',
    last_modified: '2024-07-20T10:30:00Z',
    // 兼容字段
    name: '新用户首次支付优惠',
    target_city: '110100',
    target_city_name: '北京市',
    conditions: {
      min_amount: 10,
      max_amount: 1000,
      payment_methods: ['balance', 'bank_card'],
      user_types: ['new'],
      first_time_only: true,
      max_usage: 1000,
      used_count: 256
    },
    discount: {
      value: 10,
      max_discount: 50
    }
  },
  {
    id: '2',
    strategy_name: '满100减20优惠',
    strategy_code: 'FULL_100_MINUS_20',
    description: '单笔消费满100元减20元',
    strategy_type: 'PAYMENT',
    discount_type: 'FIXED_AMOUNT',
    status: 'active',
    discount_rate: 0,
    discount_amount: 20,
    min_amount: 100,
    max_discount: 20,
    target_user_type: 'ALL',
    target_cities: ['北京'],
    target_sites: [1],
    start_time: '2024-07-01T00:00:00Z',
    end_time: '2024-07-31T23:59:59Z',
    usage_limit: 5000,
    user_usage_limit: 5,
    priority: 2,
    stackable: true,
    created_by: 'admin',
    created_time: '2024-06-25T00:00:00Z',
    last_modified: '2024-07-15T14:20:00Z',
    // 兼容字段
    name: '满100减20优惠',
    target_city: '110100',
    target_city_name: '北京市',
    conditions: {
      min_amount: 100,
      payment_methods: ['balance', 'bank_card'],
      max_usage: 5000,
      used_count: 1234
    },
    discount: {
      value: 20
    }
  },
  {
    id: '3',
    strategy_name: '阶梯优惠',
    strategy_code: 'LADDER_DISCOUNT',
    description: '根据消费金额享受不同优惠',
    strategy_type: 'PAYMENT',
    discount_type: 'LADDER',
    status: 'active',
    discount_rate: 0,
    discount_amount: 0,
    min_amount: 50,
    max_discount: 80,
    target_user_type: 'ALL',
    target_cities: ['上海'],
    target_sites: [1, 2, 3],
    start_time: '2024-06-01T00:00:00Z',
    end_time: '2024-08-31T23:59:59Z',
    usage_limit: 10000,
    user_usage_limit: 10,
    priority: 3,
    stackable: true,
    created_by: 'operator',
    created_time: '2024-05-28T00:00:00Z',
    last_modified: '2024-07-10T09:15:00Z',
    // 兼容字段
    name: '阶梯优惠',
    target_city: '310100',
    target_city_name: '上海市',
    conditions: {
      min_amount: 50,
      payment_methods: ['balance', 'bank_card'],
      max_usage: 10000,
      used_count: 892
    },
    discount: {
      value: 0,
      tiers: [
        { min_amount: 50, discount: 5 },
        { min_amount: 100, discount: 12 },
        { min_amount: 200, discount: 30 },
        { min_amount: 500, discount: 80 }
      ]
    }
  },
  {
    id: '4',
    strategy_name: 'VIP专享8折',
    strategy_code: 'VIP_80_PERCENT',
    description: 'VIP用户专享8折优惠',
    strategy_type: 'TRAVEL',
    discount_type: 'PERCENTAGE',
    status: 'active',
    discount_rate: 0.8,
    discount_amount: 0,
    min_amount: 0,
    max_discount: 100,
    target_user_type: 'VIP',
    target_cities: ['广州'],
    target_sites: [1],
    start_time: '2024-01-01T00:00:00Z',
    end_time: '2024-12-31T23:59:59Z',
    usage_limit: 99999,
    user_usage_limit: 20,
    priority: 4,
    stackable: false,
    created_by: 'admin',
    created_time: '2024-01-01T00:00:00Z',
    last_modified: '2024-07-18T16:45:00Z',
    // 兼容字段
    name: 'VIP专享8折',
    target_city: '440100',
    target_city_name: '广州市',
    conditions: {
      min_amount: 20,
      user_types: ['vip'],
      payment_methods: ['balance', 'bank_card'],
      max_usage: 99999,
      used_count: 3456
    },
    discount: {
      value: 20,
      max_discount: 100
    }
  }
]

const mockTransactions: Transaction[] = [
  {
    id: '1',
    orderNo: '202407240001',
    userId: '1',
    userName: '张三',
    userPhone: '13800138001',
    amount: 299.00,
    paymentMethod: 'balance',
    status: 'success',
    type: 'payment',
    description: '商品购买',
    createTime: '2024-07-24T14:32:00Z',
    updateTime: '2024-07-24T14:32:05Z',
    completeTime: '2024-07-24T14:32:05Z'
  },
  {
    id: '2',
    orderNo: '202407240002',
    userId: '2',
    userName: '李四',
    userPhone: '13800138002',
    amount: 1299.00,
    paymentMethod: 'bank_card',
    status: 'success',
    type: 'payment',
    description: '服务购买',
    createTime: '2024-07-24T14:28:00Z',
    updateTime: '2024-07-24T14:28:10Z',
    completeTime: '2024-07-24T14:28:10Z'
  },
  {
    id: '3',
    orderNo: '202407240003',
    userId: '1',
    userName: '张三',
    amount: 599.00,
    paymentMethod: 'bank_card',
    status: 'pending',
    type: 'payment',
    description: '充值',
    createTime: '2024-07-24T14:25:00Z',
    updateTime: '2024-07-24T14:25:00Z'
  }
]

// Mock设备数据
const mockDevices: Device[] = [
  {
    id: '1',
    deviceName: '收银设备001',
    deviceCode: 'DEV001',
    deviceType: 'POS',
    firmwareVersion: '1.2.3',
    siteId: 'site_001',
    siteName: '北京朝阳地铁站',
    status: 'online',
    isOnline: true,
    lastHeartbeatTime: '2024-07-24T16:45:00Z',
    createdTime: '2024-01-15T08:30:00Z',
    updatedTime: '2024-07-24T14:30:00Z',
    heartbeatTimeoutMinutes: 5,
    ipAddress: '192.168.1.100',
    macAddress: '00:11:22:33:44:55',
    location: '北京市朝阳区xxx街道',
    description: '主要收银设备',
    device_code: 'DEV001',
    device_name: '收银设备001',
    device_type: 'POS',
    firmware_version: '1.2.3',
    is_online: true,
    last_heartbeat_time: '2024-07-24T16:45:00Z',
    created_time: '2024-01-15T08:30:00Z',
    updated_time: '2024-07-24T14:30:00Z',
    ip_address: '192.168.1.100',
    mac_address: '00:11:22:33:44:55',
    heartbeat_timeout_minutes: 5
  },
  {
    id: '2',
    deviceName: '收银设备002',
    deviceCode: 'DEV002',
    deviceType: 'SCANNER',
    firmwareVersion: '1.1.8',
    siteId: 'site_001',
    siteName: '北京朝阳地铁站',
    status: 'offline',
    isOnline: false,
    lastHeartbeatTime: '2024-07-24T10:30:00Z',
    createdTime: '2024-02-20T10:15:00Z',
    updatedTime: '2024-07-20T09:20:00Z',
    heartbeatTimeoutMinutes: 5,
    ipAddress: '192.168.1.101',
    macAddress: '00:11:22:33:44:56',
    location: '北京市朝阳区xxx街道',
    description: '扫码设备',
    device_code: 'DEV002',
    device_name: '收银设备002',
    device_type: 'SCANNER',
    firmware_version: '1.1.8',
    is_online: false,
    last_heartbeat_time: '2024-07-24T10:30:00Z',
    created_time: '2024-02-20T10:15:00Z',
    updated_time: '2024-07-20T09:20:00Z',
    ip_address: '192.168.1.101',
    mac_address: '00:11:22:33:44:56',
    heartbeat_timeout_minutes: 5
  },
  {
    id: '3',
    deviceName: '收银设备003',
    deviceCode: 'DEV003',
    deviceType: 'POS',
    firmwareVersion: '1.2.5',
    siteId: 'site_003',
    siteName: '广州天河购物中心',
    status: 'maintenance',
    isOnline: false,
    lastHeartbeatTime: '2024-07-22T11:45:00Z',
    createdTime: '2024-03-10T14:20:00Z',
    updatedTime: '2024-07-22T11:45:00Z',
    heartbeatTimeoutMinutes: 5,
    ipAddress: '192.168.1.102',
    macAddress: '00:11:22:33:44:57',
    location: '上海市浦东新区xxx路',
    description: '维修中的设备',
    device_code: 'DEV003',
    device_name: '收银设备003',
    device_type: 'POS',
    firmware_version: '1.2.5',
    is_online: false,
    last_heartbeat_time: '2024-07-22T11:45:00Z',
    created_time: '2024-03-10T14:20:00Z',
    updated_time: '2024-07-22T11:45:00Z',
    ip_address: '192.168.1.102',
    mac_address: '00:11:22:33:44:57',
    heartbeat_timeout_minutes: 5
  }
]

// Mock线路数据
const mockLines: Line[] = [
  {
    id: 'line_001',
    line_name: '地铁1号线',
    line_code: 'BJ_SUBWAY_LINE_1',
    line_type: 'subway',
    city: '北京',
    status: 'active',
    description: '北京地铁1号线，东西贯穿北京市区的重要轨道交通线路',
    total_stations: 23,
    total_length: 30.44,
    operating_company: '北京地铁运营有限公司',
    start_station: '苹果园',
    end_station: '四惠东',
    operating_hours: {
      start_time: '05:00',
      end_time: '23:30'
    },
    ticket_price_range: {
      min_price: 3,
      max_price: 9
    },
    createTime: '2024-01-01T00:00:00Z',
    updateTime: '2024-07-25T10:00:00Z'
  },
  {
    id: 'line_002',
    line_name: '地铁2号线',
    line_code: 'BJ_SUBWAY_LINE_2',
    line_type: 'subway',
    city: '北京',
    status: 'active',
    description: '北京地铁2号线，环形线路，连接北京市区主要商业区',
    total_stations: 18,
    total_length: 23.1,
    operating_company: '北京地铁运营有限公司',
    start_station: '积水潭',
    end_station: '积水潭',
    operating_hours: {
      start_time: '05:00',
      end_time: '23:30'
    },
    ticket_price_range: {
      min_price: 3,
      max_price: 7
    },
    createTime: '2024-01-02T00:00:00Z',
    updateTime: '2024-07-25T10:00:00Z'
  },
  {
    id: 'line_003',
    line_name: '浦东机场线',
    line_code: 'SH_AIRPORT_LINE',
    line_type: 'subway',
    city: '上海',
    status: 'active',
    description: '上海浦东机场线，连接市区与浦东国际机场的快速轨道交通',
    total_stations: 9,
    total_length: 32.68,
    operating_company: '上海申通地铁运营有限公司',
    start_station: '龙阳路',
    end_station: '浦东国际机场',
    operating_hours: {
      start_time: '06:00',
      end_time: '22:00'
    },
    ticket_price_range: {
      min_price: 5,
      max_price: 50
    },
    createTime: '2024-01-03T00:00:00Z',
    updateTime: '2024-07-25T10:00:00Z'
  },
  {
    id: 'line_004',
    line_name: '京广高铁',
    line_code: 'CN_HSR_JINGGUANG',
    line_type: 'train',
    city: '广州',
    status: 'active',
    description: '京广高速铁路，连接北京与广州的高速铁路干线',
    total_stations: 38,
    total_length: 2298,
    operating_company: '中国铁路总公司',
    start_station: '北京西',
    end_station: '广州南',
    operating_hours: {
      start_time: '06:00',
      end_time: '23:00'
    },
    ticket_price_range: {
      min_price: 515,
      max_price: 1748
    },
    createTime: '2024-01-04T00:00:00Z',
    updateTime: '2024-07-25T10:00:00Z'
  },
  {
    id: 'line_005',
    line_name: '华强北商圈',
    line_code: 'SZ_BUSINESS_HQB',
    line_type: 'bus',
    city: '深圳',
    status: 'active',
    description: '深圳华强北商圈公交线路群，服务于华强北电子商业区',
    total_stations: 15,
    total_length: 12.5,
    operating_company: '深圳巴士集团',
    start_station: '华强北地铁站',
    end_station: '万象城',
    operating_hours: {
      start_time: '06:30',
      end_time: '22:30'
    },
    ticket_price_range: {
      min_price: 2,
      max_price: 5
    },
    createTime: '2024-01-05T00:00:00Z',
    updateTime: '2024-07-25T10:00:00Z'
  },
  {
    id: 'line_006',
    line_name: '双流机场线',
    line_code: 'CD_AIRPORT_LINE',
    line_type: 'subway',
    city: '成都',
    status: 'maintenance',
    description: '成都双流机场地铁专线，连接市区与双流国际机场',
    total_stations: 17,
    total_length: 18.5,
    operating_company: '成都地铁运营有限公司',
    start_station: '韦家碾',
    end_station: '双流机场1航站楼',
    operating_hours: {
      start_time: '06:00',
      end_time: '23:00'
    },
    ticket_price_range: {
      min_price: 4,
      max_price: 12
    },
    createTime: '2024-01-06T00:00:00Z',
    updateTime: '2024-07-25T10:00:00Z'
  },
  {
    id: 'line_007',
    line_name: '杭州地铁1号线',
    line_code: 'HZ_SUBWAY_LINE_1',
    line_type: 'subway',
    city: '杭州',
    status: 'maintenance',
    description: '杭州地铁1号线，连接杭州主城区的南北主干线',
    total_stations: 34,
    total_length: 53.4,
    operating_company: '杭州地铁集团有限责任公司',
    start_station: '临平',
    end_station: '湘湖',
    operating_hours: {
      start_time: '06:00',
      end_time: '22:30'
    },
    ticket_price_range: {
      min_price: 2,
      max_price: 8
    },
    createTime: '2024-01-07T00:00:00Z',
    updateTime: '2024-07-25T10:00:00Z'
  },
  {
    id: 'line_008',
    line_name: '新街口商圈',
    line_code: 'NJ_BUSINESS_XJK',
    line_type: 'bus',
    city: '南京',
    status: 'active',
    description: '南京新街口商圈公交线路网，服务于新街口核心商业区',
    total_stations: 20,
    total_length: 15.8,
    operating_company: '南京公交集团',
    start_station: '新街口',
    end_station: '中央商场',
    operating_hours: {
      start_time: '06:00',
      end_time: '23:00'
    },
    ticket_price_range: {
      min_price: 2,
      max_price: 4
    },
    createTime: '2024-01-08T00:00:00Z',
    updateTime: '2024-07-25T10:00:00Z'
  },
  {
    id: 'line_009',
    line_name: '京广铁路',
    line_code: 'CN_RAILWAY_JINGGUANG',
    line_type: 'train',
    city: '武汉',
    status: 'active',
    description: '京广铁路传统线路，连接北京与广州的重要铁路干线',
    total_stations: 124,
    total_length: 2324,
    operating_company: '中国铁路总公司',
    start_station: '北京',
    end_station: '广州',
    operating_hours: {
      start_time: '00:00',
      end_time: '23:59'
    },
    ticket_price_range: {
      min_price: 180,
      max_price: 580
    },
    createTime: '2024-01-09T00:00:00Z',
    updateTime: '2024-07-25T10:00:00Z'
  },
  {
    id: 'line_010',
    line_name: '环城高速',
    line_code: 'MULTI_HIGHWAY_RING',
    line_type: 'highway',
    city: '北京',
    status: 'active',
    description: '各城市环城高速公路网，连接城市各个区域',
    total_stations: 0,
    total_length: 600,
    operating_company: '各地高速公路管理局',
    start_station: '无固定起点',
    end_station: '无固定终点',
    operating_hours: {
      start_time: '00:00',
      end_time: '23:59'
    },
    ticket_price_range: {
      min_price: 5,
      max_price: 200
    },
    createTime: '2024-01-10T00:00:00Z',
    updateTime: '2024-07-25T10:00:00Z'
  }
]

// Mock站点数据
const mockSites: Site[] = [
  {
    id: 'site_001',
    name: '北京朝阳地铁站',
    siteId: 1,
    siteName: '北京朝阳地铁站',
    site_name: '北京朝阳地铁站',
    siteCode: 'BJ_CY_001',
    site_code: 'BJ_CY_001',
    siteAddress: '北京市朝阳区建国门外大街1号',
    address: '北京市朝阳区建国门外大街1号',
    city: '北京',
    status: 'ACTIVE',
    statusName: '活跃',
    siteType: 'subway_station',
    site_type: 'subway_station',
    siteTypeName: '地铁站',
    type: 'SUBWAY',
    typeName: '地铁',
    lineName: '地铁1号线',
    line_name: '地铁1号线',
    longitude: 116.4074,
    latitude: 39.9042,
    contactPerson: '张三',
    contact_person: '张三',
    contactPhone: '010-12345678',
    contact_phone: '010-12345678',
    description: '北京市中心繁华地段地铁站点',
    businessStartTime: '05:00',
    businessEndTime: '23:30',
    createdTime: '2024-01-01T00:00:00Z',
    created_time: '2024-01-01T00:00:00Z',
    updatedTime: '2024-07-25T10:30:00Z',
    updated_time: '2024-07-25T10:30:00Z'
  },
  {
    id: 'site_002',
    name: '上海浦东机场T1',
    siteId: 2,
    siteName: '上海浦东机场T1',
    site_name: '上海浦东机场T1',
    siteCode: 'SH_PD_002',
    site_code: 'SH_PD_002',
    siteAddress: '上海市浦东新区机场大道900号',
    address: '上海市浦东新区机场大道900号',
    city: '上海',
    status: 'ACTIVE',
    statusName: '活跃',
    siteType: 'airport',
    site_type: 'airport',
    siteTypeName: '机场',
    type: 'TRAIN',
    typeName: '火车',
    lineName: '浦东机场线',
    line_name: '浦东机场线',
    longitude: 121.8056,
    latitude: 31.1443,
    contactPerson: '李四',
    contact_person: '李四',
    contactPhone: '021-87654321',
    contact_phone: '021-87654321',
    description: '上海浦东国际机场T1航站楼',
    businessStartTime: '04:30',
    businessEndTime: '24:00',
    createdTime: '2024-01-15T00:00:00Z',
    created_time: '2024-01-15T00:00:00Z',
    updatedTime: '2024-07-24T16:20:00Z',
    updated_time: '2024-07-24T16:20:00Z'
  },
  {
    id: 'site_003',
    name: '广州火车南站',
    siteId: 3,
    siteName: '广州火车南站',
    site_name: '广州火车南站',
    siteCode: 'GZ_NZ_003',
    site_code: 'GZ_NZ_003',
    siteAddress: '广州市番禺区石壁街道石壁村',
    address: '广州市番禺区石壁街道石壁村',
    city: '广州',
    status: 'MAINTENANCE',
    statusName: '维护中',
    siteType: 'train_station',
    site_type: 'train_station',
    siteTypeName: '火车站',
    type: 'TRAIN',
    typeName: '火车',
    lineName: '京广高铁',
    line_name: '京广高铁',
    longitude: 113.3265,
    latitude: 23.1291,
    contactPerson: '王五',
    contact_person: '王五',
    contactPhone: '020-39876543',
    contact_phone: '020-39876543',
    description: '广州南站高铁站点',
    businessStartTime: '05:30',
    businessEndTime: '23:00',
    createdTime: '2024-02-01T00:00:00Z',
    created_time: '2024-02-01T00:00:00Z',
    updatedTime: '2024-07-25T08:15:00Z',
    updated_time: '2024-07-25T08:15:00Z'
  },
  {
    id: 'site_004',
    name: '深圳万象城购物中心',
    siteId: 4,
    siteName: '深圳万象城购物中心',
    site_name: '深圳万象城购物中心',
    siteCode: 'SZ_WXC_004',
    site_code: 'SZ_WXC_004',
    siteAddress: '深圳市罗湖区宝安南路1881号',
    address: '深圳市罗湖区宝安南路1881号',
    city: '深圳',
    status: 'ACTIVE',
    statusName: '活跃',
    siteType: 'shopping_mall',
    site_type: 'shopping_mall',
    siteTypeName: '购物中心',
    type: 'SUBWAY',
    typeName: '地铁',
    lineName: '华强北商圈',
    line_name: '华强北商圈',
    longitude: 114.1077,
    latitude: 22.5431,
    contactPerson: '赵六',
    contact_person: '赵六',
    contactPhone: '0755-82345678',
    contact_phone: '0755-82345678',
    description: '深圳知名购物中心',
    businessStartTime: '10:00',
    businessEndTime: '22:00',
    createdTime: '2024-03-01T00:00:00Z',
    created_time: '2024-03-01T00:00:00Z',
    updatedTime: '2024-07-23T12:45:00Z',
    updated_time: '2024-07-23T12:45:00Z'
  },
  {
    id: 'site_005',
    name: '成都双流国际机场T2',
    siteId: 5,
    siteName: '成都双流国际机场T2',
    site_name: '成都双流国际机场T2',
    siteCode: 'CD_SL_005',
    site_code: 'CD_SL_005',
    siteAddress: '成都市双流区胜利镇',
    address: '成都市双流区胜利镇',
    city: '成都',
    status: 'INACTIVE',
    statusName: '未激活',
    siteType: 'airport',
    site_type: 'airport',
    siteTypeName: '机场',
    type: 'TRAIN',
    typeName: '火车',
    lineName: '双流机场线',
    line_name: '双流机场线',
    longitude: 103.9427,
    latitude: 30.5728,
    contactPerson: '孙七',
    contact_person: '孙七',
    contactPhone: '028-85436789',
    contact_phone: '028-85436789',
    description: '成都双流国际机场T2航站楼',
    businessStartTime: '05:00',
    businessEndTime: '23:30',
    createdTime: '2024-03-15T00:00:00Z',
    created_time: '2024-03-15T00:00:00Z',
    updatedTime: '2024-07-22T09:30:00Z',
    updated_time: '2024-07-22T09:30:00Z'
  },
  {
    id: 'site_006',
    name: '杭州西湖文化广场地铁站',
    siteId: 6,
    siteName: '杭州西湖文化广场地铁站',
    site_name: '杭州西湖文化广场地铁站',
    siteCode: 'HZ_XH_006',
    site_code: 'HZ_XH_006',
    siteAddress: '杭州市下城区中山北路与体育场路交叉口',
    address: '杭州市下城区中山北路与体育场路交叉口',
    city: '杭州',
    status: 'MAINTENANCE',
    statusName: '维护中',
    siteType: 'subway_station',
    site_type: 'subway_station',
    siteTypeName: '地铁站',
    type: 'SUBWAY',
    typeName: '地铁',
    lineName: '地铁1号线',
    line_name: '地铁1号线',
    longitude: 120.1551,
    latitude: 30.2741,
    contactPerson: '周八',
    contact_person: '周八',
    contactPhone: '0571-87123456',
    contact_phone: '0571-87123456',
    description: '杭州市中心地铁枢纽站',
    businessStartTime: '06:00',
    businessEndTime: '23:00',
    createdTime: '2024-04-01T00:00:00Z',
    created_time: '2024-04-01T00:00:00Z',
    updatedTime: '2024-07-25T15:20:00Z',
    updated_time: '2024-07-25T15:20:00Z'
  },
  {
    id: 'site_007',
    name: '南京新街口中央商场',
    siteId: 7,
    siteName: '南京新街口中央商场',
    site_name: '南京新街口中央商场',
    siteCode: 'NJ_XJK_007',
    site_code: 'NJ_XJK_007',
    siteAddress: '南京市玄武区中山东路79号',
    address: '南京市玄武区中山东路79号',
    city: '南京',
    status: 'ACTIVE',
    statusName: '活跃',
    siteType: 'shopping_mall',
    site_type: 'shopping_mall',
    siteTypeName: '购物中心',
    type: 'SUBWAY',
    typeName: '地铁',
    lineName: '新街口商圈',
    line_name: '新街口商圈',
    longitude: 118.7965,
    latitude: 32.0465,
    contactPerson: '吴九',
    contact_person: '吴九',
    contactPhone: '025-83456789',
    contact_phone: '025-83456789',
    description: '南京市中心标志性商场',
    businessStartTime: '09:30',
    businessEndTime: '21:30',
    createdTime: '2024-04-15T00:00:00Z',
    created_time: '2024-04-15T00:00:00Z',
    updatedTime: '2024-07-20T11:15:00Z',
    updated_time: '2024-07-20T11:15:00Z'
  },
  {
    id: 'site_008',
    name: '武汉汉口火车站',
    siteId: 8,
    siteName: '武汉汉口火车站',
    site_name: '武汉汉口火车站',
    siteCode: 'WH_HK_008',
    site_code: 'WH_HK_008',
    siteAddress: '武汉市江汉区金家墩特1号',
    address: '武汉市江汉区金家墩特1号',
    city: '武汉',
    status: 'ACTIVE',
    statusName: '活跃',
    siteType: 'train_station',
    site_type: 'train_station',
    siteTypeName: '火车站',
    type: 'TRAIN',
    typeName: '火车',
    lineName: '京广铁路',
    line_name: '京广铁路',
    longitude: 114.2581,
    latitude: 30.6197,
    contactPerson: '郑十',
    contact_person: '郑十',
    contactPhone: '027-82345678',
    contact_phone: '027-82345678',
    description: '武汉重要交通枢纽',
    businessStartTime: '00:00',
    businessEndTime: '24:00',
    createdTime: '2024-05-01T00:00:00Z',
    created_time: '2024-05-01T00:00:00Z',
    updatedTime: '2024-07-25T13:40:00Z',
    updated_time: '2024-07-25T13:40:00Z'
  }
]

// 模拟用户出行记录数据
const mockTravelRecords: TravelRecord[] = [
  {
    id: 'travel_001',
    userId: '1',
    startLocation: '北京市朝阳区三里屯',
    endLocation: '北京市海淀区中关村',
    startTime: '2024-07-30T09:15:00Z',
    endTime: '2024-07-30T09:48:00Z',
    distance: 15.6,
    duration: 33,
    cost: 45.80,
    paymentMethod: 'balance',
    status: 'completed',
    vehicleType: 'taxi',
    routePoints: [
      { latitude: 39.9342, longitude: 116.4074, timestamp: '2024-07-30T09:15:00Z' },
      { latitude: 39.9456, longitude: 116.3908, timestamp: '2024-07-30T09:30:00Z' },
      { latitude: 39.9712, longitude: 116.3164, timestamp: '2024-07-30T09:48:00Z' }
    ],
    createTime: '2024-07-30T09:15:00Z',
    updateTime: '2024-07-30T09:48:00Z'
  },
  {
    id: 'travel_002',
    userId: '1',
    startLocation: '北京市海淀区中关村',
    endLocation: '北京市西城区西单',
    startTime: '2024-07-29T14:20:00Z',
    endTime: '2024-07-29T14:52:00Z',
    distance: 12.3,
    duration: 32,
    cost: 38.60,
    paymentMethod: 'bank_card',
    status: 'completed',
    vehicleType: 'subway',
    createTime: '2024-07-29T14:20:00Z',
    updateTime: '2024-07-29T14:52:00Z'
  },
  {
    id: 'travel_003',
    userId: '2',
    startLocation: '上海市黄浦区外滩',
    endLocation: '上海市浦东新区陆家嘴',
    startTime: '2024-07-28T16:30:00Z',
    endTime: '2024-07-28T17:15:00Z',
    distance: 8.9,
    duration: 45,
    cost: 25.40,
    paymentMethod: 'balance',
    status: 'completed',
    vehicleType: 'bus',
    createTime: '2024-07-28T16:30:00Z',
    updateTime: '2024-07-28T17:15:00Z'
  },
  {
    id: 'travel_004',
    userId: '1',
    startLocation: '北京市东城区王府井',
    endLocation: '北京市朝阳区国贸',
    startTime: '2024-07-27T11:45:00Z',
    endTime: '2024-07-27T12:20:00Z',
    distance: 18.2,
    duration: 35,
    cost: 52.30,
    paymentMethod: 'balance',
    status: 'completed',
    vehicleType: 'taxi',
    createTime: '2024-07-27T11:45:00Z',
    updateTime: '2024-07-27T12:20:00Z'
  },
  {
    id: 'travel_005',
    userId: '3',
    startLocation: '广州市天河区珠江新城',
    endLocation: '广州市越秀区北京路',
    startTime: '2024-07-26T19:00:00Z',
    endTime: '2024-07-26T19:35:00Z',
    distance: 14.7,
    duration: 35,
    cost: 41.20,
    paymentMethod: 'alipay',
    status: 'completed',
    vehicleType: 'ride_share',
    createTime: '2024-07-26T19:00:00Z',
    updateTime: '2024-07-26T19:35:00Z'
  }
]

// 模拟仪表盘数据
const mockDashboardStats: DashboardStats = {
  todayTransactions: {
    count: 156,
    amount: 45678.90,
    successRate: 98.5
  },
  totalUsers: {
    count: 12345,
    activeCount: 8432,
    newCount: 234
  },
  totalBalance: 2456789.00,
  systemStatus: {
    uptime: '99.8%',
    cpuUsage: 45.2,
    memoryUsage: 67.8,
    diskUsage: 34.5
  },
  recentTransactions: mockTransactions.slice(0, 5),
  paymentMethodStats: [
    { method: 'balance', count: 89, amount: 23456.78, percentage: 45.2 },
    { method: 'bank_card', count: 67, amount: 22222.12, percentage: 54.8 }
  ],
  transactionTrend: [
    { date: '2024-07-18', count: 145, amount: 38900.50 },
    { date: '2024-07-19', count: 167, amount: 42100.80 },
    { date: '2024-07-20', count: 134, amount: 35600.20 },
    { date: '2024-07-21', count: 189, amount: 48900.90 },
    { date: '2024-07-22', count: 156, amount: 41200.30 },
    { date: '2024-07-23', count: 178, amount: 46800.70 },
    { date: '2024-07-24', count: 156, amount: 45678.90 }
  ]
}

// 模拟用户统计数据
const mockUserStatistics: UserStatistics = {
  totalUsers: 12345,
  activeUsers: 8432,
  newUsers: 234,
  verifiedUsers: 11789,
  usersByStatus: {
    active: 8432,
    inactive: 2901,
    locked: 456,
    pending: 556
  },
  usersByRole: {
    superAdmin: 2,
    admin: 15,
    operator: 128,
    viewer: 12200
  },
  userGrowthTrend: [
    { date: '2024-07-18', newUsers: 45, totalUsers: 12100 },
    { date: '2024-07-19', newUsers: 52, totalUsers: 12152 },
    { date: '2024-07-20', newUsers: 38, totalUsers: 12190 },
    { date: '2024-07-21', newUsers: 67, totalUsers: 12257 },
    { date: '2024-07-22', newUsers: 41, totalUsers: 12298 },
    { date: '2024-07-23', newUsers: 29, totalUsers: 12327 },
    { date: '2024-07-24', newUsers: 18, totalUsers: 12345 }
  ],
  userActivityStats: {
    lastLogin: {
      today: 1245,
      thisWeek: 4567,
      thisMonth: 8432
    },
    transactions: {
      averagePerUser: 3.7,
      topUsers: [
        { userId: '1', username: 'admin', transactionCount: 156 },
        { userId: '2', username: 'operator1', transactionCount: 89 },
        { userId: '3', username: 'user001', transactionCount: 67 },
        { userId: '4', username: 'user002', transactionCount: 54 },
        { userId: '5', username: 'user003', transactionCount: 43 }
      ]
    }
  }
}

/* Mock旅行数据 - 暂时未使用
const mockTravelData = [
  {
    routeId: 'R001',
    routeName: '1号线-王府井站至国贸站',
    startStation: '王府井站',
    endStation: '国贸站',
    tripCount: 12350,
    averageTime: 25, // 平均时长（分钟）
    totalRevenue: 2470000 // 总收入（分）
  },
  {
    routeId: 'R002',
    routeName: '2号线-西直门站至东直门站',
    startStation: '西直门站',
    endStation: '东直门站',
    tripCount: 9876,
    averageTime: 30,
    totalRevenue: 1975200
  },
  {
    routeId: 'R003',
    routeName: '10号线-三元桥站至知春路站',
    startStation: '三元桥站',
    endStation: '知春路站',
    tripCount: 8765,
    averageTime: 22,
    totalRevenue: 1753000
  },
  {
    routeId: 'R004',
    routeName: '4号线-西单站至中关村站',
    startStation: '西单站',
    endStation: '中关村站',
    tripCount: 7654,
    averageTime: 28,
    totalRevenue: 1530800
  },
  {
    routeId: 'R005',
    routeName: '13号线-西二旗站至上地站',
    startStation: '西二旗站',
    endStation: '上地站',
    tripCount: 6543,
    averageTime: 15,
    totalRevenue: 1308600
  }
]
*/

// Mock设备使用统计数据
const mockDeviceUsageStatistics: DeviceUsageStatistics = {
  totalDevices: 1245,
  activeDevices: 1087,
  onlineDevices: 1023,
  offlineDevices: 158,
  maintenanceDevices: 64,
  devicesByType: {
    terminal: 456,    // 终端设备
    scanner: 298,     // 扫码设备
    printer: 187,     // 打印设备
    kiosk: 234,       // 自助终端
    mobile: 70        // 移动设备
  },
  devicesByStatus: {
    active: 1087,     // 活跃状态
    inactive: 95,     // 非活跃状态
    maintenance: 64,  // 维护状态
    error: 32,        // 错误状态
    offline: 158      // 离线状态
  },
  usageByLocation: [
    {
      cityCode: '110100',
      cityName: '北京市',
      totalDevices: 345,
      activeDevices: 312,
      usageRate: 90.4,
      totalTransactions: 45678,
      revenue: 9135600
    },
    {
      cityCode: '310100',
      cityName: '上海市',
      totalDevices: 298,
      activeDevices: 267,
      usageRate: 89.6,
      totalTransactions: 38901,
      revenue: 7780200
    },
    {
      cityCode: '440100',
      cityName: '广州市',
      totalDevices: 234,
      activeDevices: 201,
      usageRate: 85.9,
      totalTransactions: 29876,
      revenue: 5975200
    },
    {
      cityCode: '440300',
      cityName: '深圳市',
      totalDevices: 187,
      activeDevices: 165,
      usageRate: 88.2,
      totalTransactions: 24567,
      revenue: 4913400
    },
    {
      cityCode: '330100',
      cityName: '杭州市',
      totalDevices: 181,
      activeDevices: 142,
      usageRate: 78.5,
      totalTransactions: 18902,
      revenue: 3780400
    }
  ],
  usageByTime: [
    { hour: 6, activeDevices: 234, transactions: 1234, revenue: 246800 },
    { hour: 7, activeDevices: 567, transactions: 3456, revenue: 691200 },
    { hour: 8, activeDevices: 789, transactions: 5678, revenue: 1135600 },
    { hour: 9, activeDevices: 865, transactions: 6789, revenue: 1357800 },
    { hour: 10, activeDevices: 912, transactions: 7890, revenue: 1578000 },
    { hour: 11, activeDevices: 934, transactions: 8901, revenue: 1780200 },
    { hour: 12, activeDevices: 1023, transactions: 9876, revenue: 1975200 },
    { hour: 13, activeDevices: 989, transactions: 9234, revenue: 1846800 },
    { hour: 14, activeDevices: 923, transactions: 8567, revenue: 1713400 },
    { hour: 15, activeDevices: 876, transactions: 7654, revenue: 1530800 },
    { hour: 16, activeDevices: 834, transactions: 6987, revenue: 1397400 },
    { hour: 17, activeDevices: 798, transactions: 6543, revenue: 1308600 },
    { hour: 18, activeDevices: 723, transactions: 5432, revenue: 1086400 },
    { hour: 19, activeDevices: 634, transactions: 4321, revenue: 864200 },
    { hour: 20, activeDevices: 512, transactions: 3210, revenue: 642000 },
    { hour: 21, activeDevices: 387, transactions: 2109, revenue: 421800 },
    { hour: 22, activeDevices: 298, transactions: 1098, revenue: 219600 },
    { hour: 23, activeDevices: 187, transactions: 567, revenue: 113400 }
  ],
  dailyUsage: [
    { date: '2024-01-22', activeDevices: 1012, totalTransactions: 34567, revenue: 6913400, errorCount: 23, maintenanceCount: 3 },
    { date: '2024-01-23', activeDevices: 1034, totalTransactions: 36789, revenue: 7357800, errorCount: 18, maintenanceCount: 2 },
    { date: '2024-01-24', activeDevices: 1056, totalTransactions: 38901, revenue: 7780200, errorCount: 15, maintenanceCount: 4 },
    { date: '2024-01-25', activeDevices: 1078, totalTransactions: 41234, revenue: 8246800, errorCount: 12, maintenanceCount: 1 },
    { date: '2024-01-26', activeDevices: 1087, totalTransactions: 43567, revenue: 8713400, errorCount: 21, maintenanceCount: 5 },
    { date: '2024-01-27', activeDevices: 1065, totalTransactions: 42890, revenue: 8578000, errorCount: 27, maintenanceCount: 3 },
    { date: '2024-01-28', activeDevices: 1089, totalTransactions: 45678, revenue: 9135600, errorCount: 19, maintenanceCount: 2 }
  ],
  topDevices: [
    {
      deviceId: 'DEV001',
      deviceCode: 'TSL1100801',
      deviceName: '北京西单地铁站终端01',
      location: '北京市西城区西单地铁站A出口',
      transactionCount: 2345,
      revenue: 468900,
      uptime: 99.8,
      lastMaintenance: '2024-01-20T08:00:00Z'
    },
    {
      deviceId: 'DEV002',
      deviceCode: 'TSL1100802',
      deviceName: '上海人民广场终端02',
      location: '上海市黄浦区人民广场地铁站',
      transactionCount: 2198,
      revenue: 439600,
      uptime: 99.5,
      lastMaintenance: '2024-01-18T10:30:00Z'
    },
    {
      deviceId: 'DEV003',
      deviceCode: 'TSL1100803',
      deviceName: '广州体育西路终端03',
      location: '广州市天河区体育西路地铁站',
      transactionCount: 2076,
      revenue: 415200,
      uptime: 99.2,
      lastMaintenance: '2024-01-22T14:15:00Z'
    },
    {
      deviceId: 'DEV004',
      deviceCode: 'TSL1100804',
      deviceName: '深圳福田口岸终端04',
      location: '深圳市福田区福田口岸',
      transactionCount: 1987,
      revenue: 397400,
      uptime: 98.9,
      lastMaintenance: '2024-01-19T16:45:00Z'
    },
    {
      deviceId: 'DEV005',
      deviceCode: 'TSL1100805',
      deviceName: '杭州西湖景区终端05',
      location: '杭州市西湖区西湖景区入口',
      transactionCount: 1834,
      revenue: 366800,
      uptime: 99.1,
      lastMaintenance: '2024-01-21T09:20:00Z'
    }
  ],
  performanceMetrics: {
    averageUptime: 98.7,              // 平均在线率（百分比）
    averageTransactionTime: 2.3,      // 平均交易时间（秒）
    successRate: 99.2,                // 成功率（百分比）
    errorRate: 0.8,                   // 错误率（百分比）
    maintenanceFrequency: 0.3         // 维护频率（次/天）
  },
  alertSummary: {
    critical: 3,     // 严重警报
    warning: 12,     // 警告
    info: 28,        // 信息
    resolved: 156    // 已解决
  },
  siteStats: [
    {
      siteId: 'SITE001',
      siteName: '北京西单商圈',
      totalDevices: 45,
      activeDevices: 42,
      revenue: 1245600,
      transactions: 6228
    },
    {
      siteId: 'SITE002',
      siteName: '上海人民广场商圈',
      totalDevices: 38,
      activeDevices: 34,
      revenue: 987300,
      transactions: 4937
    },
    {
      siteId: 'SITE003',
      siteName: '广州天河城商圈',
      totalDevices: 32,
      activeDevices: 28,
      revenue: 823400,
      transactions: 4117
    },
    {
      siteId: 'SITE004',
      siteName: '深圳华强北商圈',
      totalDevices: 29,
      activeDevices: 26,
      revenue: 756200,
      transactions: 3781
    },
    {
      siteId: 'SITE005',
      siteName: '杭州西湖景区',
      totalDevices: 25,
      activeDevices: 21,
      revenue: 634500,
      transactions: 3173
    }
  ]
}

// 模拟折扣策略统计数据
const mockDiscountStatistics: DiscountStatistics = {
  // 基础统计信息
  totalStrategies: 25,
  activeStrategies: 18,
  expiredStrategies: 5,
  draftStrategies: 2,

  // 策略类型分布
  strategyTypeDistribution: [
    {
      type: 'percentage',
      name: '百分比折扣',
      count: 12,
      percentage: 48.0,
      totalDiscount: 125680.50,
      avgDiscount: 10473.38
    },
    {
      type: 'fixed',
      name: '固定金额',
      count: 8,
      percentage: 32.0,
      totalDiscount: 89420.00,
      avgDiscount: 11177.50
    },
    {
      type: 'cashback',
      name: '返现',
      count: 3,
      percentage: 12.0,
      totalDiscount: 45200.00,
      avgDiscount: 15066.67
    },
    {
      type: 'bundle',
      name: '套餐优惠',
      count: 2,
      percentage: 8.0,
      totalDiscount: 28900.00,
      avgDiscount: 14450.00
    }
  ],

  // 策略使用统计
  strategyUsageStats: [
    {
      strategyId: 'DS001',
      strategyName: '首次使用5%折扣',
      strategyType: 'percentage',
      usageCount: 1245,
      totalDiscountAmount: 45680.50,
      avgDiscountAmount: 36.69,
      conversionRate: 0.78,
      cityDistribution: [
        { cityCode: '110100', cityName: '北京市', usageCount: 289, discountAmount: 10567.20 },
        { cityCode: '310100', cityName: '上海市', usageCount: 234, discountAmount: 8890.30 },
        { cityCode: '440100', cityName: '广州市', usageCount: 198, discountAmount: 7234.50 },
        { cityCode: '440300', cityName: '深圳市', usageCount: 186, discountAmount: 6823.40 },
        { cityCode: '330100', cityName: '杭州市', usageCount: 145, discountAmount: 5234.80 }
      ]
    },
    {
      strategyId: 'DS002',
      strategyName: '满100减20',
      strategyType: 'fixed',
      usageCount: 987,
      totalDiscountAmount: 19740.00,
      avgDiscountAmount: 20.00,
      conversionRate: 0.85,
      cityDistribution: [
        { cityCode: '110100', cityName: '北京市', usageCount: 245, discountAmount: 4900.00 },
        { cityCode: '310100', cityName: '上海市', usageCount: 198, discountAmount: 3960.00 },
        { cityCode: '440100', cityName: '广州市', usageCount: 176, discountAmount: 3520.00 },
        { cityCode: '440300', cityName: '深圳市', usageCount: 167, discountAmount: 3340.00 },
        { cityCode: '330100', cityName: '杭州市', usageCount: 134, discountAmount: 2680.00 }
      ]
    },
    {
      strategyId: 'DS003',
      strategyName: '地铁出行返现',
      strategyType: 'cashback',
      usageCount: 756,
      totalDiscountAmount: 15120.00,
      avgDiscountAmount: 20.00,
      conversionRate: 0.72,
      cityDistribution: [
        { cityCode: '110100', cityName: '北京市', usageCount: 198, discountAmount: 3960.00 },
        { cityCode: '310100', cityName: '上海市', usageCount: 167, discountAmount: 3340.00 },
        { cityCode: '440100', cityName: '广州市', usageCount: 145, discountAmount: 2900.00 },
        { cityCode: '440300', cityName: '深圳市', usageCount: 123, discountAmount: 2460.00 },
        { cityCode: '330100', cityName: '杭州市', usageCount: 98, discountAmount: 1960.00 }
      ]
    }
  ],

  // 时间趋势分析
  usageTrend: [
    { date: '2024-07-01', totalUsage: 89, totalDiscountAmount: 1780.50, activeStrategies: 15, newStrategies: 0, avgDiscountPerUser: 18.32 },
    { date: '2024-07-02', totalUsage: 96, totalDiscountAmount: 1923.20, activeStrategies: 15, newStrategies: 1, avgDiscountPerUser: 20.03 },
    { date: '2024-07-03', totalUsage: 108, totalDiscountAmount: 2145.60, activeStrategies: 16, newStrategies: 0, avgDiscountPerUser: 19.87 },
    { date: '2024-07-04', totalUsage: 112, totalDiscountAmount: 2234.40, activeStrategies: 16, newStrategies: 0, avgDiscountPerUser: 19.95 },
    { date: '2024-07-05', totalUsage: 134, totalDiscountAmount: 2678.80, activeStrategies: 16, newStrategies: 1, avgDiscountPerUser: 19.99 },
    { date: '2024-07-06', totalUsage: 145, totalDiscountAmount: 2898.50, activeStrategies: 17, newStrategies: 0, avgDiscountPerUser: 19.99 },
    { date: '2024-07-07', totalUsage: 156, totalDiscountAmount: 3123.60, activeStrategies: 17, newStrategies: 0, avgDiscountPerUser: 20.02 }
  ],

  // 城市分布统计
  cityDistribution: [
    {
      cityCode: '110100',
      cityName: '北京市',
      strategiesCount: 18,
      totalUsage: 732,
      totalDiscountAmount: 19427.20,
      topStrategies: [
        { strategyId: 'DS001', strategyName: '首次使用5%折扣', usageCount: 289, discountAmount: 10567.20 },
        { strategyId: 'DS002', strategyName: '满100减20', usageCount: 245, discountAmount: 4900.00 },
        { strategyId: 'DS003', strategyName: '地铁出行返现', usageCount: 198, discountAmount: 3960.00 }
      ]
    },
    {
      cityCode: '310100',
      cityName: '上海市',
      strategiesCount: 16,
      totalUsage: 599,
      totalDiscountAmount: 16190.30,
      topStrategies: [
        { strategyId: 'DS001', strategyName: '首次使用5%折扣', usageCount: 234, discountAmount: 8890.30 },
        { strategyId: 'DS002', strategyName: '满100减20', usageCount: 198, discountAmount: 3960.00 },
        { strategyId: 'DS003', strategyName: '地铁出行返现', usageCount: 167, discountAmount: 3340.00 }
      ]
    },
    {
      cityCode: '440100',
      cityName: '广州市',
      strategiesCount: 14,
      totalUsage: 519,
      totalDiscountAmount: 13654.50,
      topStrategies: [
        { strategyId: 'DS001', strategyName: '首次使用5%折扣', usageCount: 198, discountAmount: 7234.50 },
        { strategyId: 'DS002', strategyName: '满100减20', usageCount: 176, discountAmount: 3520.00 },
        { strategyId: 'DS003', strategyName: '地铁出行返现', usageCount: 145, discountAmount: 2900.00 }
      ]
    }
  ],

  // 效果分析
  effectivenessAnalysis: {
    highPerformance: {
      count: 8,
      avgConversionRate: 0.82,
      topStrategies: ['DS002', 'DS001', 'DS005']
    },
    mediumPerformance: {
      count: 7,
      avgConversionRate: 0.65
    },
    lowPerformance: {
      count: 3,
      avgConversionRate: 0.42,
      improvementSuggestions: [
        '优化策略触发条件',
        '调整折扣力度',
        '改善用户体验流程'
      ]
    }
  },

  // 用户行为分析
  userBehaviorStats: {
    totalUniqueUsers: 2847,
    repeatUsageRate: 0.68,
    avgStrategiesPerUser: 1.85,
    userSegmentation: [
      {
        segment: '新用户',
        userCount: 1245,
        avgDiscountUsage: 28.50,
        favoriteStrategyTypes: ['percentage', 'fixed']
      },
      {
        segment: '活跃用户',
        userCount: 987,
        avgDiscountUsage: 45.20,
        favoriteStrategyTypes: ['cashback', 'percentage']
      },
      {
        segment: 'VIP用户',
        userCount: 615,
        avgDiscountUsage: 78.90,
        favoriteStrategyTypes: ['bundle', 'cashback']
      }
    ]
  },

  // 财务影响分析
  financialImpact: {
    totalDiscountAmount: 289200.50,
    totalTransactionAmount: 8967543.20,
    discountRate: 0.0322,
    estimatedRevenueLoss: 289200.50,
    estimatedCustomerAcquisitionValue: 745600.00,
    roi: 1.58
  }
}

// Mock站点数据统计
const mockSiteStatistics: SiteStatistics = {
  // 基础统计信息
  totalSites: 45,
  activeSites: 38,
  inactiveSites: 5,
  maintenanceSites: 2,

  // 站点类型分布
  siteTypeDistribution: [
    {
      type: 'metro',
      name: '地铁站点',
      count: 18,
      percentage: 40.0,
      avgDailyTransactions: 1245,
      avgRevenue: 24900.50
    },
    {
      type: 'bus',
      name: '公交站点',
      count: 12,
      percentage: 26.7,
      avgDailyTransactions: 687,
      avgRevenue: 13740.30
    },
    {
      type: 'shopping',
      name: '商业中心',
      count: 8,
      percentage: 17.8,
      avgDailyTransactions: 856,
      avgRevenue: 17120.80
    },
    {
      type: 'residential',
      name: '住宅区',
      count: 5,
      percentage: 11.1,
      avgDailyTransactions: 423,
      avgRevenue: 8460.20
    },
    {
      type: 'office',
      name: '办公区',
      count: 2,
      percentage: 4.4,
      avgDailyTransactions: 234,
      avgRevenue: 4680.10
    }
  ],

  // 站点性能统计
  sitePerformanceStats: [
    {
      siteId: 'SITE001',
      siteName: '北京西单地铁站',
      siteCode: 'BJ-XD-001',
      location: '北京市西城区西单地铁站',
      deviceCount: 8,
      dailyTransactions: 2345,
      dailyRevenue: 46900.50,
      uptime: 99.8,
      efficiency: 94.5,
      ranking: 1,
      lastMaintenanceDate: '2024-07-15T08:00:00Z'
    },
    {
      siteId: 'SITE002',
      siteName: '上海人民广场站',
      siteCode: 'SH-RMG-002',
      location: '上海市黄浦区人民广场地铁站',
      deviceCount: 6,
      dailyTransactions: 2198,
      dailyRevenue: 43960.30,
      uptime: 99.5,
      efficiency: 92.8,
      ranking: 2,
      lastMaintenanceDate: '2024-07-18T10:30:00Z'
    },
    {
      siteId: 'SITE003',
      siteName: '广州体育西路站',
      siteCode: 'GZ-TYX-003',
      location: '广州市天河区体育西路地铁站',
      deviceCount: 7,
      dailyTransactions: 1987,
      dailyRevenue: 39740.20,
      uptime: 99.2,
      efficiency: 91.3,
      ranking: 3,
      lastMaintenanceDate: '2024-07-20T14:15:00Z'
    },
    {
      siteId: 'SITE004',
      siteName: '深圳福田口岸',
      siteCode: 'SZ-FTK-004',
      location: '深圳市福田区福田口岸',
      deviceCount: 5,
      dailyTransactions: 1823,
      dailyRevenue: 36460.80,
      uptime: 98.9,
      efficiency: 89.7,
      ranking: 4,
      lastMaintenanceDate: '2024-07-22T16:45:00Z'
    },
    {
      siteId: 'SITE005',
      siteName: '杭州西湖景区',
      siteCode: 'HZ-XH-005',
      location: '杭州市西湖区西湖景区入口',
      deviceCount: 4,
      dailyTransactions: 1654,
      dailyRevenue: 33080.40,
      uptime: 99.1,
      efficiency: 88.2,
      ranking: 5,
      lastMaintenanceDate: '2024-07-25T09:20:00Z'
    }
  ],

  // 地理分布统计
  geographicDistribution: [
    {
      province: '北京市',
      city: '北京市',
      siteCount: 12,
      deviceCount: 48,
      totalTransactions: 15678,
      totalRevenue: 313560.80,
      avgSitePerformance: 93.2,
      coverage: {
        totalArea: 16410.54,
        coveredArea: 12308.41,
        coverageRate: 0.75
      }
    },
    {
      province: '上海市',
      city: '上海市',
      siteCount: 10,
      deviceCount: 40,
      totalTransactions: 13245,
      totalRevenue: 264900.50,
      avgSitePerformance: 91.8,
      coverage: {
        totalArea: 6340.5,
        coveredArea: 5072.4,
        coverageRate: 0.80
      }
    },
    {
      province: '广东省',
      city: '广州市',
      siteCount: 8,
      deviceCount: 32,
      totalTransactions: 11567,
      totalRevenue: 231340.30,
      avgSitePerformance: 90.5,
      coverage: {
        totalArea: 7434.4,
        coveredArea: 5200.08,
        coverageRate: 0.70
      }
    },
    {
      province: '广东省',
      city: '深圳市',
      siteCount: 9,
      deviceCount: 36,
      totalTransactions: 12890,
      totalRevenue: 257800.70,
      avgSitePerformance: 92.1,
      coverage: {
        totalArea: 1997.47,
        coveredArea: 1598.98,
        coverageRate: 0.80
      }
    },
    {
      province: '浙江省',
      city: '杭州市',
      siteCount: 6,
      deviceCount: 24,
      totalTransactions: 8934,
      totalRevenue: 178680.20,
      avgSitePerformance: 89.3,
      coverage: {
        totalArea: 16853.57,
        coveredArea: 10112.14,
        coverageRate: 0.60
      }
    }
  ],

  // 运营状态分析
  operationalStatus: {
    online: {
      count: 38,
      percentage: 84.4,
      avgUptime: 98.7
    },
    offline: {
      count: 5,
      percentage: 11.1,
      avgDowntime: 4.3
    },
    maintenance: {
      count: 2,
      percentage: 4.4,
      avgDowntime: 120 // 单位：分钟
    }
  },

  // 收入分析
  revenueAnalysis: {
    totalRevenue: 1246282.50,
    avgRevenuePerSite: 27695.17,
    topPerformingSites: [
      { siteId: 'SITE001', siteName: '北京西单地铁站', revenue: 46900.50, growth: 12.5 },
      { siteId: 'SITE002', siteName: '上海人民广场站', revenue: 43960.30, growth: 8.7 },
      { siteId: 'SITE003', siteName: '广州体育西路站', revenue: 39740.20, growth: 15.3 },
      { siteId: 'SITE004', siteName: '深圳福田口岸', revenue: 36460.80, growth: 6.9 },
      { siteId: 'SITE005', siteName: '杭州西湖景区', revenue: 33080.40, growth: 18.2 }
    ],
    revenueByRegion: [
      { region: '华北', revenue: 425670.80, siteCount: 15, avgRevenuePerSite: 28378.05 },
      { region: '华东', revenue: 378920.50, siteCount: 13, avgRevenuePerSite: 29147.73 },
      { region: '华南', revenue: 347850.70, siteCount: 12, avgRevenuePerSite: 28987.56 },
      { region: '西南', revenue: 93840.50, siteCount: 5, avgRevenuePerSite: 18768.10 }
    ],
    monthlyTrend: [
      { month: '2024-01', revenue: 98750.20, transactionCount: 4938, newSites: 2, avgRevenuePerSite: 2305.12 },
      { month: '2024-02', revenue: 89650.30, transactionCount: 4483, newSites: 1, avgRevenuePerSite: 2096.28 },
      { month: '2024-03', revenue: 105890.50, transactionCount: 5295, newSites: 3, avgRevenuePerSite: 2439.31 },
      { month: '2024-04', revenue: 112340.80, transactionCount: 5617, newSites: 2, avgRevenuePerSite: 2496.46 },
      { month: '2024-05', revenue: 118920.40, transactionCount: 5946, newSites: 4, avgRevenuePerSite: 2420.42 },
      { month: '2024-06', revenue: 124680.70, transactionCount: 6234, newSites: 1, avgRevenuePerSite: 2548.58 },
      { month: '2024-07', revenue: 131450.90, transactionCount: 6573, newSites: 3, avgRevenuePerSite: 2653.08 }
    ]
  },

  // 设备配置统计
  deviceConfiguration: {
    totalDevices: 180,
    avgDevicesPerSite: 4.0,
    deviceTypeDistribution: [
      { type: 'payment_terminal', count: 90, percentage: 50.0, avgPerSite: 2.0 },
      { type: 'qr_scanner', count: 54, percentage: 30.0, avgPerSite: 1.2 },
      { type: 'card_reader', count: 27, percentage: 15.0, avgPerSite: 0.6 },
      { type: 'receipt_printer', count: 9, percentage: 5.0, avgPerSite: 0.2 }
    ],
    utilizationRate: 87.5,
    maintenanceSchedule: {
      scheduled: 15,
      overdue: 3,
      completed: 28
    }
  },

  // 用户流量分析
  trafficAnalysis: {
    totalVisits: 67890,
    avgVisitsPerSite: 1508.67,
    peakHours: [
      { hour: 8, visits: 8923, sites: ['SITE001', 'SITE002', 'SITE004'] },
      { hour: 12, visits: 7845, sites: ['SITE003', 'SITE005', 'SITE001'] },
      { hour: 18, visits: 9234, sites: ['SITE002', 'SITE003', 'SITE004'] },
      { hour: 20, visits: 6782, sites: ['SITE005', 'SITE001', 'SITE002'] }
    ],
    customerFlow: [
      { siteId: 'SITE001', siteName: '北京西单地铁站', dailyVisits: 2567, peakTime: '08:00-09:00', conversionRate: 0.91 },
      { siteId: 'SITE002', siteName: '上海人民广场站', dailyVisits: 2234, peakTime: '18:00-19:00', conversionRate: 0.88 },
      { siteId: 'SITE003', siteName: '广州体育西路站', dailyVisits: 2089, peakTime: '12:00-13:00', conversionRate: 0.85 },
      { siteId: 'SITE004', siteName: '深圳福田口岸', dailyVisits: 1923, peakTime: '08:00-09:00', conversionRate: 0.89 },
      { siteId: 'SITE005', siteName: '杭州西湖景区', dailyVisits: 1756, peakTime: '20:00-21:00', conversionRate: 0.82 }
    ]
  },

  // 服务质量指标
  serviceQualityMetrics: {
    avgResponseTime: 1.8,
    successRate: 99.2,
    customerSatisfaction: 4.7,
    errorRate: 0.8,
    maintenanceFrequency: 2.3,
    qualityScore: 94.5,
    improvements: [
      { category: '设备维护', suggestion: '增加预防性维护频率', priority: 'high', impact: 8.5 },
      { category: '用户体验', suggestion: '优化支付流程界面', priority: 'medium', impact: 6.8 },
      { category: '系统性能', suggestion: '升级网络带宽', priority: 'medium', impact: 7.2 },
      { category: '安全性', suggestion: '加强数据加密', priority: 'high', impact: 9.1 },
      { category: '监控告警', suggestion: '完善实时监控系统', priority: 'low', impact: 5.5 }
    ]
  }
}

// 模拟API服务
export const mockApi = {
  // 认证相关
  auth: {
    login: async (data: any): Promise<ApiResponse<any>> => {
      await delay(1500)

      // 模拟登录验证 - 根据JavaScript接口，检查username, password, remember_me字段
      if (data.username === 'admin' && data.password === 'admin123') {
        return {
          code: 200,
          message: '登录成功',
          success: true,
          data: {
            token: 'mock_token_admin_' + Date.now(),
            refreshToken: 'mock_refresh_token_' + Date.now(),
            userInfo: {
              id: '1',
              username: 'admin',
              name: '系统管理员',
              role: 'superAdmin',
              email: 'admin@example.com',
              phone: '13800138000',
              status: 'active',
              createTime: '2024-01-01T00:00:00Z',
              permissions: ['dashboard', 'transactions', 'users', 'settings', 'permissions'],
              rememberMe: data.remember_me || false
            } as UserInfo,
            rememberMe: data.remember_me || false
          }
        }
      } else if (data.username === 'operator' && data.password === 'op123') {
        return {
          code: 200,
          message: '登录成功',
          success: true,
          data: {
            token: 'mock_token_operator_' + Date.now(),
            userInfo: {
              id: '2',
              username: 'operator',
              name: '操作员',
              role: 'operator',
              status: 'active',
              createTime: '2024-01-01T00:00:00Z',
              permissions: ['dashboard', 'transactions', 'users'],
              rememberMe: data.remember_me || false
            } as UserInfo,
            rememberMe: data.remember_me || false
          }
        }
      } else if (data.username === 'viewer' && data.password === 'view123') {
        return {
          code: 200,
          message: '登录成功',
          success: true,
          data: {
            token: 'mock_token_viewer_' + Date.now(),
            userInfo: {
              id: '3',
              username: 'viewer',
              name: '查看员',
              role: 'viewer',
              status: 'active',
              createTime: '2024-01-01T00:00:00Z',
              permissions: ['dashboard'],
              rememberMe: data.remember_me || false
            } as UserInfo,
            rememberMe: data.remember_me || false
          }
        }
      } else {
        return {
          code: 400,
          message: '用户名或密码错误',
          success: false,
          data: null
        }
      }
    },

    getCaptcha: async (): Promise<ApiResponse<any>> => {
      await delay(500)
      return {
        code: 200,
        message: '获取验证码成功',
        success: true,
        data: {
          captcha: Math.random().toString(36).substring(2, 6).toUpperCase(),
          key: 'captcha_' + Date.now()
        }
      }
    },

    getCurrentUser: async (): Promise<ApiResponse<UserInfo>> => {
      await delay(300)
      return {
        code: 200,
        message: '获取用户信息成功',
        success: true,
        data: {
          id: '1',
          username: 'admin',
          name: '系统管理员',
          role: 'superAdmin',
          email: 'admin@example.com',
          phone: '13800138000',
          status: 'active',
          createTime: '2024-01-01T00:00:00Z',
          permissions: ['dashboard', 'transactions', 'users', 'settings', 'permissions']
        }
      }
    },

    getProfile: async (): Promise<ApiResponse<UserInfo>> => {
      await delay(400)
      // 根据JavaScript接口 /auth/profile 端点，模拟获取管理员资料
      return {
        code: 200,
        message: '获取管理员资料成功',
        success: true,
        data: {
          id: '1',
          username: 'admin',
          name: '系统管理员',
          role: 'superAdmin',
          email: 'admin@example.com',
          phone: '13800138000',
          avatar: '/avatars/admin.jpg',
          status: 'active',
          createTime: '2024-01-01T00:00:00Z',
          lastLoginTime: new Date().toISOString(),
          permissions: [
            'dashboard',
            'transactions',
            'users',
            'settings',
            'permissions',
            'devices',
            'statistics',
            'audit',
            'system:read',
            'system:write',
            'admin:all'
          ]
        }
      }
    },

    logout: async (userId?: string): Promise<ApiResponse<void>> => {
      await delay(500)
      // 根据JavaScript接口 /auth/logout 端点，模拟管理员退出
      console.log('Mock logout - X-User-Id:', userId || '');

      return {
        code: 200,
        message: '退出登录成功',
        success: true,
        data: undefined
      }
    },

    refreshToken: async (userId?: string): Promise<ApiResponse<any>> => {
      await delay(400)
      // 根据JavaScript接口 /auth/refresh 端点，模拟刷新Token
      console.log('Mock refresh token - X-User-Id:', userId || '');

      // 生成新的token（模拟）
      const newToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const refreshToken = `mock_refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return {
        code: 200,
        message: 'Token刷新成功',
        success: true,
        data: {
          token: newToken,
          refreshToken: refreshToken,
          expiresIn: 7200, // 2小时
          tokenType: 'Bearer'
        }
      }
    }
  },

  // 仪表盘相关
  dashboard: {
    getStats: async (): Promise<ApiResponse<DashboardStats>> => {
      await delay(800)
      return {
        code: 200,
        message: '获取统计数据成功',
        success: true,
        data: mockDashboardStats
      }
    }
  },

  // 交易相关
  transactions: {
    getList: async (query: any): Promise<ApiResponse<any>> => {
      await delay(600)
      const { pageNum = 1, pageSize = 10 } = query
      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      const list = mockTransactions.slice(start, end)

      return {
        code: 200,
        message: '获取交易列表成功',
        success: true,
        data: {
          list,
          total: mockTransactions.length,
          pageNum,
          pageSize,
          totalPages: Math.ceil(mockTransactions.length / pageSize)
        }
      }
    }
  },

  // 用户相关
  users: {
    getList: async (query: any): Promise<ApiResponse<any>> => {
      await delay(500)
      console.log('Mock用户查询参数:', query);

      // 支持新的字段格式（page_num, page_size等）同时保持兼容性
      const pageNum = query.page_num || query.pageNum || 1
      const pageSize = query.page_size || query.pageSize || 10
      const keyword = query.keyword || ''
      const status = query.status || ''
      const startTime = query.start_time || query.startTime || ''
      const endTime = query.end_time || query.endTime || ''
      const orderBy = query.order_by || query.orderBy || 'createTime'
      const orderDirection = query.order_direction || query.orderDirection || 'desc'

      let filteredUsers = [...mockUsers]

      // 根据关键词过滤
      if (keyword) {
        filteredUsers = filteredUsers.filter(user =>
          user.username.includes(keyword) ||
          user.name.includes(keyword) ||
          user.phone.includes(keyword) ||
          (user.email && user.email.includes(keyword))
        )
      }

      // 根据状态过滤
      if (status) {
        filteredUsers = filteredUsers.filter(user => user.status === status)
      }

      // 根据时间范围过滤
      if (startTime) {
        filteredUsers = filteredUsers.filter(user =>
          new Date(user.createTime) >= new Date(startTime)
        )
      }

      if (endTime) {
        filteredUsers = filteredUsers.filter(user =>
          new Date(user.createTime) <= new Date(endTime)
        )
      }

      // 排序
      filteredUsers.sort((a, b) => {
        let aValue, bValue
        switch (orderBy) {
          case 'username':
            aValue = a.username
            bValue = b.username
            break
          case 'name':
            aValue = a.name
            bValue = b.name
            break
          case 'createTime':
            aValue = new Date(a.createTime).getTime()
            bValue = new Date(b.createTime).getTime()
            break
          case 'balance':
            aValue = a.balance
            bValue = b.balance
            break
          default:
            aValue = new Date(a.createTime).getTime()
            bValue = new Date(b.createTime).getTime()
        }

        if (orderDirection === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })

      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      const list = filteredUsers.slice(start, end)

      return {
        code: 200,
        message: '获取用户列表成功',
        success: true,
        data: {
          list,
          total: filteredUsers.length,
          pageNum,
          pageSize,
          totalPages: Math.ceil(filteredUsers.length / pageSize)
        }
      }
    },

    getUser: async (id: string): Promise<ApiResponse<User>> => {
      await delay(400)
      console.log('Mock获取用户详情 - ID:', id);

      // 在mockUsers中查找指定ID的用户
      const user = mockUsers.find(u => u.id === id)

      if (user) {
        return {
          code: 200,
          message: '获取用户详情成功',
          success: true,
          data: user
        }
      } else {
        return {
          code: 404,
          message: '用户不存在',
          success: false,
          data: null as any
        }
      }
    },

    searchUsers: async (query: UserSearchQuery): Promise<ApiResponse<UserSearchResult>> => {
      await delay(300)
      console.log('Mock用户搜索参数:', query);

      const keyword = query.keyword || ''

      if (!keyword.trim()) {
        return {
          code: 400,
          message: '搜索关键词不能为空',
          success: false,
          data: { users: [], total: 0 }
        }
      }

      // 根据关键词搜索用户（支持用户名、姓名、手机号、邮箱模糊匹配）
      const filteredUsers = mockUsers.filter(user =>
        user.username.toLowerCase().includes(keyword.toLowerCase()) ||
        user.name.toLowerCase().includes(keyword.toLowerCase()) ||
        user.phone.includes(keyword) ||
        (user.email && user.email.toLowerCase().includes(keyword.toLowerCase()))
      )

      return {
        code: 200,
        message: '用户搜索成功',
        success: true,
        data: {
          users: filteredUsers,
          total: filteredUsers.length
        }
      }
    },

    getPendingUsers: async (query?: PendingUserQuery): Promise<ApiResponse<PendingUserResult>> => {
      await delay(400)
      console.log('Mock获取待审核用户参数:', query);

      const pageNum = query?.pageNum || 1
      const pageSize = query?.pageSize || 10
      const keyword = query?.keyword || ''
      const startTime = query?.startTime || ''
      const endTime = query?.endTime || ''
      const orderBy = query?.orderBy || 'submitTime'
      const orderDirection = query?.orderDirection || 'desc'

      let filteredUsers = [...mockPendingUsers]

      // 根据关键词过滤
      if (keyword) {
        filteredUsers = filteredUsers.filter(user =>
          user.username.toLowerCase().includes(keyword.toLowerCase()) ||
          user.name.toLowerCase().includes(keyword.toLowerCase()) ||
          user.phone.includes(keyword) ||
          (user.email && user.email.toLowerCase().includes(keyword.toLowerCase())) ||
          (user.remark && user.remark.includes(keyword))
        )
      }

      // 根据时间范围过滤
      if (startTime) {
        filteredUsers = filteredUsers.filter(user =>
          new Date(user.submitTime) >= new Date(startTime)
        )
      }

      if (endTime) {
        filteredUsers = filteredUsers.filter(user =>
          new Date(user.submitTime) <= new Date(endTime)
        )
      }

      // 排序
      filteredUsers.sort((a, b) => {
        let aValue, bValue
        switch (orderBy) {
          case 'username':
            aValue = a.username
            bValue = b.username
            break
          case 'name':
            aValue = a.name
            bValue = b.name
            break
          case 'submitTime':
            aValue = new Date(a.submitTime).getTime()
            bValue = new Date(b.submitTime).getTime()
            break
          case 'status':
            aValue = a.status
            bValue = b.status
            break
          default:
            aValue = new Date(a.submitTime).getTime()
            bValue = new Date(b.submitTime).getTime()
        }

        if (orderDirection === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })

      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      const users = filteredUsers.slice(start, end)

      return {
        code: 200,
        message: '获取待审核用户成功',
        success: true,
        data: {
          users,
          total: filteredUsers.length
        }
      }
    },

    // 审核用户通过/拒绝 - 根据JavaScript接口实现
    approveUser: async (userId: string, auditData: any): Promise<ApiResponse<any>> => {
      await delay(800)
      console.log('Mock审核用户参数:', { userId, auditData });

      // 查找待审核用户
      const pendingUserIndex = mockPendingUsers.findIndex(user => user.id === userId)

      if (pendingUserIndex === -1) {
        return {
          code: 404,
          message: '待审核用户不存在',
          success: false,
          data: null
        }
      }

      const pendingUser = mockPendingUsers[pendingUserIndex]
      const currentTime = new Date().toISOString()

      // 根据审核结果更新用户状态
      if (auditData.audit_result === 'APPROVED') {
        // 审核通过 - 将用户从待审核列表移除并添加到正式用户列表
        const newUser: User = {
          id: `user_${mockUsers.length + 1}`,
          username: pendingUser.username,
          name: pendingUser.name,
          phone: pendingUser.phone,
          email: pendingUser.email,
          avatar: pendingUser.avatar,
          balance: 0,
          status: 'normal',
          isVip: false,
          createTime: currentTime,
          lastLoginTime: undefined,
          totalTransactions: 0,
          totalAmount: 0,
          remark: pendingUser.remark
        }

        // 添加到正式用户列表
        mockUsers.push(newUser)

        // 从待审核列表移除
        mockPendingUsers.splice(pendingUserIndex, 1)

        return {
          code: 200,
          message: '用户审核通过成功',
          success: true,
          data: {
            success: true,
            message: '用户审核通过，已添加到正式用户列表',
            auditId: `audit_${Date.now()}`,
            auditTime: currentTime,
            auditorId: 'admin_001',
            auditorName: '系统管理员',
            userId: newUser.id,
            auditResult: auditData.audit_result,
            auditReason: auditData.audit_reason,
            auditType: auditData.audit_type
          }
        }
      } else if (auditData.audit_result === 'REJECTED') {
        // 审核拒绝 - 更新待审核用户状态
        pendingUser.status = 'rejected'
        pendingUser.reviewTime = currentTime
        pendingUser.reviewerId = 'admin_001'
        pendingUser.reviewerName = '系统管理员'
        pendingUser.rejectReason = auditData.audit_reason

        return {
          code: 200,
          message: '用户审核拒绝成功',
          success: true,
          data: {
            success: true,
            message: '用户审核已拒绝',
            auditId: `audit_${Date.now()}`,
            auditTime: currentTime,
            auditorId: 'admin_001',
            auditorName: '系统管理员',
            userId: pendingUser.id,
            auditResult: auditData.audit_result,
            auditReason: auditData.audit_reason,
            auditType: auditData.audit_type
          }
        }
      } else {
        return {
          code: 400,
          message: '无效的审核结果',
          success: false,
          data: null
        }
      }
    },

    // 拒绝用户审核 - 根据JavaScript接口实现 POST /user/{id}/reject
    rejectUser: async (userId: string, rejectData: any): Promise<ApiResponse<any>> => {
      await delay(800)
      console.log('Mock拒绝用户参数:', { userId, rejectData });

      // 查找待审核用户
      const pendingUserIndex = mockPendingUsers.findIndex(user => user.id === userId)

      if (pendingUserIndex === -1) {
        return {
          code: 404,
          message: '待审核用户不存在',
          success: false,
          data: null
        }
      }

      const pendingUser = mockPendingUsers[pendingUserIndex]
      const currentTime = new Date().toISOString()

      // 只能拒绝，不能通过 - 专门用于 /user/{id}/reject 接口
      if (rejectData.audit_result === 'REJECTED') {
        // 更新待审核用户状态为已拒绝
        pendingUser.status = 'rejected'
        pendingUser.reviewTime = currentTime
        pendingUser.reviewerId = 'admin_001'
        pendingUser.reviewerName = '系统管理员'
        pendingUser.rejectReason = rejectData.audit_reason

        return {
          code: 200,
          message: '用户审核拒绝成功',
          success: true,
          data: {
            success: true,
            message: '用户审核已拒绝',
            auditId: `reject_audit_${Date.now()}`,
            auditTime: currentTime,
            auditorId: 'admin_001',
            auditorName: '系统管理员',
            userId: pendingUser.id,
            auditResult: rejectData.audit_result,
            auditReason: rejectData.audit_reason,
            auditType: rejectData.audit_type
          }
        }
      } else {
        return {
          code: 400,
          message: '拒绝接口只能用于拒绝审核',
          success: false,
          data: null
        }
      }
    },

    // 启用用户 - 根据JavaScript接口实现 POST /user/{id}/enable
    enableUser: async (userId: string): Promise<ApiResponse<any>> => {
      await delay(600)
      console.log('Mock启用用户参数:', { userId });

      // 查找用户
      const userIndex = mockUsers.findIndex(user => user.id === userId)

      if (userIndex === -1) {
        return {
          code: 404,
          message: '用户不存在',
          success: false,
          data: null
        }
      }

      const user = mockUsers[userIndex]
      const currentTime = new Date().toISOString()

      // 更新用户状态为正常
      const previousStatus = user.status
      user.status = 'normal'

      return {
        code: 200,
        message: '用户启用成功',
        success: true,
        data: {
          success: true,
          message: `用户已从 ${previousStatus} 状态启用为正常状态`,
          userId: user.id,
          status: user.status,
          operationTime: currentTime,
          operatorId: 'admin_001',
          operatorName: '系统管理员',
          previousStatus: previousStatus
        }
      }
    },

    // 禁用用户 - 根据JavaScript接口实现 POST /user/{id}/disable?reason=xxx
    disableUser: async (userId: string, reason?: string): Promise<ApiResponse<any>> => {
      await delay(600)
      console.log('Mock禁用用户参数:', { userId, reason });

      // 查找用户
      const userIndex = mockUsers.findIndex(user => user.id === userId)

      if (userIndex === -1) {
        return {
          code: 404,
          message: '用户不存在',
          success: false,
          data: null
        }
      }

      const user = mockUsers[userIndex]
      const currentTime = new Date().toISOString()

      // 更新用户状态为禁用
      const previousStatus = user.status
      user.status = 'disabled'

      return {
        code: 200,
        message: '用户禁用成功',
        success: true,
        data: {
          success: true,
          message: `用户已从 ${previousStatus} 状态禁用` + (reason ? `，原因：${reason}` : ''),
          userId: user.id,
          status: user.status,
          operationTime: currentTime,
          operatorId: 'admin_001',
          operatorName: '系统管理员',
          previousStatus: previousStatus,
          reason: reason || '未指定原因'
        }
      }
    },

    // 查看用户出行记录 - 根据JavaScript接口实现 GET /user/{id}/travel-records?pageNum=1&pageSize=10
    getTravelRecords: async (userId: string, query: { pageNum: number; pageSize: number }): Promise<ApiResponse<TravelRecordsResponse>> => {
      await delay(500)
      console.log('Mock查询用户出行记录参数:', { userId, query });

      // 根据用户ID筛选出行记录
      const userRecords = mockTravelRecords.filter(record => record.userId === userId)

      // 分页计算
      const { pageNum, pageSize } = query
      const total = userRecords.length
      const totalPages = Math.ceil(total / pageSize)
      const startIndex = (pageNum - 1) * pageSize
      const endIndex = startIndex + pageSize
      const records = userRecords.slice(startIndex, endIndex)

      return {
        code: 200,
        message: '查询用户出行记录成功',
        success: true,
        data: {
          records,
          total,
          pageNum,
          pageSize,
          totalPages
        }
      }
    }
  },

  // 折扣策略相关
  discount: {
    getCities: async (): Promise<ApiResponse<City[]>> => {
      await delay(300)
      return {
        code: 200,
        message: '获取城市列表成功',
        success: true,
        data: mockCities
      }
    },

    getStrategiesByCity: async (cityCode: string): Promise<ApiResponse<DiscountStrategy[]>> => {
      await delay(500)
      const strategies = mockDiscountStrategies.filter(s => s.cityCode === cityCode)
      return {
        code: 200,
        message: '获取城市策略列表成功',
        success: true,
        data: strategies
      }
    },

    getStrategiesByCityName: async (cityName: string): Promise<ApiResponse<DiscountStrategy[]>> => {
      await delay(500)
      const strategies = mockDiscountStrategies.filter(s => s.cityName === cityName)
      return {
        code: 200,
        message: '获取城市策略列表成功',
        success: true,
        data: strategies
      }
    },

    getStrategies: async (query: any): Promise<ApiResponse<any>> => {
      await delay(600)
      const {
        pageNum = 1,
        pageSize = 10,
        cityCode,
        targetCity,
        type,
        strategyType,
        discountType,
        status,
        keyword
      } = query

      let filtered = mockDiscountStrategies
      if (cityCode) filtered = filtered.filter(s => s.cityCode === cityCode)
      if (targetCity) filtered = filtered.filter(s => s.cityName === targetCity || s.cityCode === targetCity)
      if (type) filtered = filtered.filter(s => s.type === type)
      if (strategyType) filtered = filtered.filter(s => s.strategy_type === strategyType)
      if (discountType) filtered = filtered.filter(s => s.discount_type === discountType)
      if (status) filtered = filtered.filter(s => s.status === status)
      if (keyword) filtered = filtered.filter(s =>
        (s.strategy_name && s.strategy_name.includes(keyword)) ||
        (s.description && s.description.includes(keyword))
      )

      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      const list = filtered.slice(start, end)

      return {
        code: 200,
        message: '获取策略列表成功',
        success: true,
        data: {
          list,
          total: filtered.length,
          pageNum,
          pageSize,
          totalPages: Math.ceil(filtered.length / pageSize)
        }
      }
    },

    getStrategy: async (id: string): Promise<ApiResponse<DiscountStrategy>> => {
      await delay(400)
      const strategy = mockDiscountStrategies.find(s => s.id === id)

      if (strategy) {
        return {
          code: 200,
          message: '获取策略详情成功',
          success: true,
          data: strategy
        }
      } else {
        return {
          code: 404,
          message: '策略不存在',
          success: false,
          data: null as any
        }
      }
    },

    createStrategy: async (data: any): Promise<ApiResponse<DiscountStrategy>> => {
      await delay(800)
      const newStrategy: DiscountStrategy = {
        id: Math.random().toString(36).substr(2, 9),
        strategy_name: data.strategyName || data.strategy_name,
        strategy_code: data.strategyCode || data.strategy_code || `CODE_${Date.now()}`,
        description: data.description,
        strategy_type: data.strategyType || data.strategy_type,
        discount_type: data.discountType || data.discount_type,
        status: 'active',
        discount_rate: data.discountRate || data.discount_rate,
        discount_amount: data.discountAmount || data.discount_amount,
        min_amount: data.minAmount || data.min_amount,
        max_discount: data.maxDiscount || data.max_discount,
        target_user_type: data.targetUserType || data.target_user_type,
        target_cities: data.targetCities || data.target_cities,
        target_sites: data.targetSites || data.target_sites,
        start_time: data.startTime || data.start_time,
        end_time: data.endTime || data.end_time,
        usage_limit: data.usageLimit || data.usage_limit,
        user_usage_limit: data.userUsageLimit || data.user_usage_limit,
        priority: data.priority,
        stackable: data.stackable,
        created_by: 'admin',
        created_time: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        // 兼容字段
        name: data.strategyName || data.strategy_name,
        target_city: (data.targetCities || data.target_cities)?.[0] || '',
        conditions: {
          min_amount: data.minAmount || data.min_amount,
          max_usage: data.usageLimit || data.usage_limit
        },
        discount: {
          value: data.discountRate || data.discount_rate || data.discountAmount || data.discount_amount,
          max_discount: data.maxDiscount || data.max_discount
        }
      }

      mockDiscountStrategies.push(newStrategy)

      return {
        code: 200,
        message: '创建策略成功',
        success: true,
        data: newStrategy
      }
    },

    updateStrategy: async (id: string, data: UpdateDiscountStrategyRequest): Promise<ApiResponse<DiscountStrategy>> => {
      await delay(600)
      const index = mockDiscountStrategies.findIndex(s => s.id === id)

      if (index !== -1) {
        const existingStrategy = mockDiscountStrategies[index]
        const updatedStrategy: DiscountStrategy = {
          ...existingStrategy,
          strategy_name: data.strategyName || existingStrategy.strategy_name,
          strategy_code: data.strategyCode || existingStrategy.strategy_code,
          description: data.description || existingStrategy.description,
          strategy_type: data.strategyType || existingStrategy.strategy_type,
          discount_type: data.discountType || existingStrategy.discount_type,
          discount_rate: data.discountRate || existingStrategy.discount_rate,
          discount_amount: data.discountAmount || existingStrategy.discount_amount,
          min_amount: data.minAmount || existingStrategy.min_amount,
          max_discount: data.maxDiscount || existingStrategy.max_discount,
          target_user_type: data.targetUserType || existingStrategy.target_user_type,
          target_cities: data.targetCities || existingStrategy.target_cities,
          target_sites: data.targetSites || existingStrategy.target_sites,
          start_time: data.startTime || existingStrategy.start_time,
          end_time: data.endTime || existingStrategy.end_time,
          usage_limit: data.usageLimit || existingStrategy.usage_limit,
          user_usage_limit: data.userUsageLimit || existingStrategy.user_usage_limit,
          priority: data.priority || existingStrategy.priority,
          stackable: data.stackable !== undefined ? data.stackable : existingStrategy.stackable,
          status: data.status || existingStrategy.status,
          id: existingStrategy.id, // 保持原有ID
          last_modified: new Date().toISOString(),
          // 兼容字段更新
          name: data.strategyName || existingStrategy.name,
          target_city: data.targetCities?.[0] || existingStrategy.target_city,
          conditions: {
            ...existingStrategy.conditions,
            min_amount: data.minAmount,
            max_usage: data.usageLimit
          },
          discount: {
            ...existingStrategy.discount,
            value: data.discountRate || data.discountAmount,
            max_discount: data.maxDiscount
          }
        }

        mockDiscountStrategies[index] = updatedStrategy

        return {
          code: 200,
          message: '更新策略成功',
          success: true,
          data: updatedStrategy
        }
      } else {
        return {
          code: 404,
          message: '策略不存在',
          success: false,
          data: null as any
        }
      }
    },

    deleteStrategy: async (id: string): Promise<ApiResponse<void>> => {
      await delay(400)
      const index = mockDiscountStrategies.findIndex(s => s.id === id)

      if (index !== -1) {
        mockDiscountStrategies.splice(index, 1)

        return {
          code: 200,
          message: '删除策略成功',
          success: true,
          data: undefined
        }
      } else {
        return {
          code: 404,
          message: '策略不存在',
          success: false,
          data: undefined
        }
      }
    },

    enableStrategy: async (id: string): Promise<ApiResponse<void>> => {
      await delay(400)
      const index = mockDiscountStrategies.findIndex(s => s.id === id)

      if (index !== -1) {
        mockDiscountStrategies[index].status = 'active'
        mockDiscountStrategies[index].last_modified = new Date().toISOString()

        return {
          code: 200,
          message: '启用策略成功',
          success: true,
          data: undefined
        }
      } else {
        return {
          code: 404,
          message: '策略不存在',
          success: false,
          data: undefined
        }
      }
    },

    disableStrategy: async (id: string): Promise<ApiResponse<void>> => {
      await delay(400)
      const index = mockDiscountStrategies.findIndex(s => s.id === id)

      if (index !== -1) {
        mockDiscountStrategies[index].status = 'inactive'
        mockDiscountStrategies[index].last_modified = new Date().toISOString()

        return {
          code: 200,
          message: '禁用策略成功',
          success: true,
          data: undefined
        }
      } else {
        return {
          code: 404,
          message: '策略不存在',
          success: false,
          data: undefined
        }
      }
    },

    getActiveStrategies: async (): Promise<ApiResponse<DiscountStrategy[]>> => {
      await delay(500)

      // 过滤出所有活跃状态的策略
      const activeStrategies = mockDiscountStrategies.filter(s => s.status === 'active')

      return {
        code: 200,
        message: '获取活跃策略列表成功',
        success: true,
        data: activeStrategies
      }
    },

    getActiveCityStrategies: async (cityCode?: string): Promise<ApiResponse<DiscountStrategy[]>> => {
      await delay(500)

      let activeStrategies = mockDiscountStrategies.filter(s => s.status === 'active')

      // 如果指定了城市代码，进一步过滤
      if (cityCode) {
        activeStrategies = activeStrategies.filter(strategy =>
          strategy.target_cities && strategy.target_cities.includes(cityCode)
        )
      }

      return {
        code: 200,
        message: '获取城市可用活跃策略列表成功',
        success: true,
        data: activeStrategies
      }
    },

    batchUpdateStatus: async (strategyIds: string[], status: 'ACTIVE' | 'INACTIVE'): Promise<ApiResponse<void>> => {
      await delay(800) // 批量操作可能需要更长时间

      // 模拟批量更新策略状态
      const targetStatus = status === 'ACTIVE' ? 'active' : 'inactive'

      // 更新匹配的策略状态
      strategyIds.forEach(id => {
        const strategy = mockDiscountStrategies.find(s => s.id === id)
        if (strategy) {
          strategy.status = targetStatus as 'active' | 'inactive' | 'expired'
        }
      })

      return {
        code: 200,
        message: `成功批量更新 ${strategyIds.length} 个策略状态为 ${status}`,
        success: true,
        data: undefined
      }
    }
  },

  // 设备管理相关
  device: {
    getDevices: async (query: DeviceQuery): Promise<ApiResponse<PageResponse<Device>>> => {
      await delay(500)

      let filteredDevices = [...mockDevices]

      // 关键词筛选
      if (query.keyword) {
        const keyword = query.keyword.toLowerCase()
        filteredDevices = filteredDevices.filter(device =>
          (device.deviceName && device.deviceName.toLowerCase().includes(keyword)) ||
          (device.deviceCode && device.deviceCode.toLowerCase().includes(keyword)) ||
          (device.description && device.description.toLowerCase().includes(keyword))
        )
      }

      // 站点筛选
      if (query.siteId) {
        filteredDevices = filteredDevices.filter(device => device.siteId === query.siteId)
      }

      // 状态筛选
      if (query.status) {
        filteredDevices = filteredDevices.filter(device => device.status === query.status)
      }

      // 设备类型筛选
      if (query.deviceType) {
        filteredDevices = filteredDevices.filter(device => device.deviceType === query.deviceType)
      }

      // 固件版本筛选
      if (query.firmwareVersion) {
        filteredDevices = filteredDevices.filter(device => device.firmwareVersion === query.firmwareVersion)
      }

      // 在线状态筛选
      if (query.isOnline !== undefined) {
        filteredDevices = filteredDevices.filter(device => device.isOnline === query.isOnline)
      }

      // 时间范围筛选
      if (query.startTime) {
        filteredDevices = filteredDevices.filter(device => device.createdTime && device.createdTime >= query.startTime!)
      }

      if (query.endTime) {
        filteredDevices = filteredDevices.filter(device => device.createdTime && device.createdTime <= query.endTime!)
      }

      // 心跳时间范围筛选 - 支持驼峰格式
      if (query.heartbeatStartTime) {
        filteredDevices = filteredDevices.filter(device => device.lastHeartbeatTime && device.lastHeartbeatTime >= query.heartbeatStartTime!)
      }

      if (query.heartbeatEndTime) {
        filteredDevices = filteredDevices.filter(device => device.lastHeartbeatTime && device.lastHeartbeatTime <= query.heartbeatEndTime!)
      }

      // 排序 - 支持驼峰格式
      if (query.orderBy) {
        const orderBy = query.orderBy as keyof Device
        const orderDirection = query.orderDirection === 'desc' ? -1 : 1

        filteredDevices.sort((a, b) => {
          const aValue = a[orderBy]
          const bValue = b[orderBy]

          // 处理undefined值
          if (aValue === undefined && bValue === undefined) return 0
          if (aValue === undefined) return 1
          if (bValue === undefined) return -1

          if (aValue < bValue) return -1 * orderDirection
          if (aValue > bValue) return 1 * orderDirection
          return 0
        })
      }

      // 分页
      const pageNum = query.pageNum || 1
      const pageSize = query.pageSize || 10
      const total = filteredDevices.length
      const totalPages = Math.ceil(total / pageSize)
      const startIndex = (pageNum - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedDevices = filteredDevices.slice(startIndex, endIndex)

      return {
        code: 200,
        message: '获取设备列表成功',
        success: true,
        data: {
          list: paginatedDevices,
          total,
          pageNum,
          pageSize,
          totalPages
        },
        timestamp: new Date().toISOString()
      }
    },

    getDevice: async (id: string): Promise<ApiResponse<Device>> => {
      await delay(300)

      const device = mockDevices.find(d => d.id === id)
      if (!device) {
        throw new Error('设备不存在')
      }

      return {
        code: 200,
        message: '获取设备详情成功',
        success: true,
        data: device,
        timestamp: new Date().toISOString()
      }
    },

    createDevice: async (data: CreateDeviceRequest): Promise<ApiResponse<Device>> => {
      await delay(800)

      const newDevice: Device = {
        id: String(mockDevices.length + 1),
        deviceName: data.deviceName,
        deviceCode: data.deviceCode,
        deviceType: data.deviceType,
        firmwareVersion: data.firmwareVersion,
        siteId: data.siteId,
        siteName: mockSites.find(s => s.id === data.siteId)?.name,
        status: 'offline',
        isOnline: false,
        lastHeartbeatTime: new Date().toISOString(),
        createdTime: new Date().toISOString(),
        updatedTime: new Date().toISOString(),
        heartbeatTimeoutMinutes: 5, // 默认值
        ipAddress: data.ipAddress,
        macAddress: data.macAddress,
        location: data.location,
        description: data.description
      }

      mockDevices.push(newDevice)

      return {
        code: 200,
        message: '创建设备成功',
        success: true,
        data: newDevice,
        timestamp: new Date().toISOString()
      }
    },

    updateDevice: async (id: string, data: UpdateDeviceRequest): Promise<ApiResponse<Device>> => {
      await delay(600)

      const deviceIndex = mockDevices.findIndex(d => d.id === id)
      if (deviceIndex === -1) {
        throw new Error('设备不存在')
      }

      const updatedDevice = {
        ...mockDevices[deviceIndex],
        ...data,
        id, // 确保ID不被覆盖
        updated_time: new Date().toISOString()
      }

      // 如果更新了siteId，同时更新siteName
      if (data.siteId) {
        updatedDevice.siteName = mockSites.find(s => s.id === data.siteId)?.name
      }

      mockDevices[deviceIndex] = updatedDevice

      return {
        code: 200,
        message: '更新设备成功',
        success: true,
        data: updatedDevice,
        timestamp: new Date().toISOString()
      }
    },

    deleteDevice: async (id: string): Promise<ApiResponse<void>> => {
      await delay(500)

      const deviceIndex = mockDevices.findIndex(d => d.id === id)
      if (deviceIndex === -1) {
        throw new Error('设备不存在')
      }

      mockDevices.splice(deviceIndex, 1)

      return {
        code: 200,
        message: '删除设备成功',
        success: true,
        data: undefined,
        timestamp: new Date().toISOString()
      }
    },

    getSites: async (): Promise<ApiResponse<Site[]>> => {
      await delay(300)

      const activeSites = mockSites.filter(site => site.status === 'ACTIVE')

      return {
        code: 200,
        message: '获取站点列表成功',
        success: true,
        data: activeSites,
        timestamp: new Date().toISOString()
      }
    },

    batchUpdateDeviceStatus: async (deviceIds: number[], status: 'ACTIVE' | 'INACTIVE'): Promise<ApiResponse<void>> => {
      await delay(800)

      let updatedCount = 0
      let notFoundCount = 0

      deviceIds.forEach(deviceId => {
        const deviceIndex = mockDevices.findIndex(d => parseInt(d.id) === deviceId)
        if (deviceIndex !== -1) {
          // 将ACTIVE/INACTIVE状态映射到设备的status字段
          const deviceStatus = status === 'ACTIVE' ? 'online' : 'offline'
          mockDevices[deviceIndex] = {
            ...mockDevices[deviceIndex],
            status: deviceStatus,
            is_online: status === 'ACTIVE',
            updated_time: new Date().toISOString()
          }
          updatedCount++
        } else {
          notFoundCount++
        }
      })

      if (notFoundCount > 0) {
        throw new Error(`有${notFoundCount}个设备未找到`)
      }

      return {
        code: 200,
        message: `成功更新${updatedCount}个设备状态为${status}`,
        success: true,
        data: undefined,
        timestamp: new Date().toISOString()
      }
    },

    // 更新设备心跳
    updateDeviceHeartbeat: async (deviceCode: string): Promise<ApiResponse<void>> => {
      await delay(300)

      const deviceIndex = mockDevices.findIndex(d => d.device_code === deviceCode)
      if (deviceIndex === -1) {
        throw new Error(`设备代码 ${deviceCode} 不存在`)
      }

      // 更新设备心跳时间和在线状态
      mockDevices[deviceIndex] = {
        ...mockDevices[deviceIndex],
        last_heartbeat_time: new Date().toISOString(),
        is_online: true,
        status: 'online',
        updated_time: new Date().toISOString()
      }

      return {
        code: 200,
        message: `设备 ${deviceCode} 心跳更新成功`,
        success: true,
        data: undefined,
        timestamp: new Date().toISOString()
      }
    },

    // 搜索设备
    searchDevices: async (keyword: string): Promise<ApiResponse<Device[]>> => {
      await delay(500)

      if (!keyword || keyword.trim() === '') {
        return {
          code: 200,
          message: '搜索关键词不能为空',
          success: true,
          data: [],
          timestamp: new Date().toISOString()
        }
      }

      const searchKeyword = keyword.toLowerCase().trim()

      // 在设备名称、设备代码、设备类型、位置、描述等字段中搜索
      const searchResults = mockDevices.filter(device =>
        (device.deviceName && device.deviceName.toLowerCase().includes(searchKeyword)) ||
        (device.deviceCode && device.deviceCode.toLowerCase().includes(searchKeyword)) ||
        (device.deviceType && device.deviceType.toLowerCase().includes(searchKeyword)) ||
        (device.location && device.location.toLowerCase().includes(searchKeyword)) ||
        (device.description && device.description.toLowerCase().includes(searchKeyword)) ||
        (device.siteName && device.siteName.toLowerCase().includes(searchKeyword)) ||
        device.ip_address?.toLowerCase().includes(searchKeyword) ||
        device.mac_address?.toLowerCase().includes(searchKeyword)
      )

      return {
        code: 200,
        message: `找到 ${searchResults.length} 个相关设备`,
        success: true,
        data: searchResults,
        timestamp: new Date().toISOString()
      }
    }
  },

  // 统计相关API
  statistics: {
    // 获取用户统计数据
    getUserStatistics: async (): Promise<ApiResponse<UserStatistics>> => {
      await delay(800)

      return {
        code: 200,
        message: '获取用户统计数据成功',
        success: true,
        data: mockUserStatistics,
        timestamp: new Date().toISOString()
      }
    },

    // 获取站点数据统计
    getSiteStatistics: async (): Promise<ApiResponse<SiteStatistics>> => {
      await delay(1000)

      return {
        code: 200,
        message: '获取站点数据统计成功',
        success: true,
        data: mockSiteStatistics,
        timestamp: new Date().toISOString()
      }
    },

    // 获取设备使用统计
    getDeviceUsageStatistics: async (query?: DeviceUsageQuery): Promise<ApiResponse<DeviceUsageStatistics>> => {
      await delay(1200)

      // 模拟根据查询参数过滤数据
      let filteredData = { ...mockDeviceUsageStatistics }

      if (query?.city) {
        // 根据城市过滤位置数据
        filteredData.usageByLocation = filteredData.usageByLocation.filter(
          location => location.cityCode === query.city || location.cityName.includes(query.city!)
        )
      }

      if (query?.siteId) {
        // 根据站点过滤数据
        filteredData.siteStats = filteredData.siteStats.filter(
          site => site.siteId === query.siteId
        )
      }

      if (query?.startDate && query?.endDate) {
        // 模拟根据日期范围过滤数据
        const startDate = new Date(query.startDate)
        const endDate = new Date(query.endDate)

        filteredData.dailyUsage = filteredData.dailyUsage.filter(usage => {
          const usageDate = new Date(usage.date)
          return usageDate >= startDate && usageDate <= endDate
        })
      }

      return {
        code: 200,
        message: '获取设备使用统计成功',
        success: true,
        data: filteredData,
        timestamp: new Date().toISOString()
      }
    },

    // 获取折扣策略统计
    getDiscountStatistics: async (query?: DiscountStatisticsQuery): Promise<ApiResponse<DiscountStatistics>> => {
      await delay(1200)

      // 模拟根据查询参数过滤数据
      let filteredData = { ...mockDiscountStatistics }

      if (query?.strategyType) {
        // 根据策略类型过滤数据
        filteredData.strategyTypeDistribution = filteredData.strategyTypeDistribution.filter(
          dist => dist.type === query.strategyType
        )

        filteredData.strategyUsageStats = filteredData.strategyUsageStats.filter(
          stat => stat.strategyType === query.strategyType
        )
      }

      if (query?.startDate && query?.endDate) {
        // 模拟根据日期范围过滤趋势数据
        const startDate = new Date(query.startDate)
        const endDate = new Date(query.endDate)

        filteredData.usageTrend = filteredData.usageTrend.filter(trend => {
          const trendDate = new Date(trend.date)
          return trendDate >= startDate && trendDate <= endDate
        })
      }

      return {
        code: 200,
        message: '获取折扣策略统计成功',
        success: true,
        data: filteredData,
        timestamp: new Date().toISOString()
      }
    }
  },

  // 站点管理API
  site: {
    // 获取城市列表
    getCities: async (): Promise<ApiResponse<City[]>> => {
      await delay(500)
      return {
        code: 200,
        message: '获取城市列表成功',
        success: true,
        data: mockCities,
        timestamp: new Date().toISOString()
      }
    },

    // 分页查询站点列表
    getSites: async (query: any): Promise<ApiResponse<any>> => {
      await delay(800)

      let filteredSites = [...mockSites]

      // 根据查询条件过滤
      if (query.keyword) {
        const keyword = query.keyword.toLowerCase()
        filteredSites = filteredSites.filter(site =>
          (site.siteName && site.siteName.toLowerCase().includes(keyword)) ||
          (site.siteAddress && site.siteAddress.toLowerCase().includes(keyword)) ||
          (site.city && site.city.toLowerCase().includes(keyword)) ||
          (site.lineName && site.lineName.toLowerCase().includes(keyword))
        )
      }

      if (query.status) {
        filteredSites = filteredSites.filter(site => site.status === query.status)
      }

      if (query.site_type) {
        filteredSites = filteredSites.filter(site => site.site_type === query.site_type)
      }

      if (query.city) {
        filteredSites = filteredSites.filter(site => site.city.includes(query.city))
      }

      if (query.lineName) {
        filteredSites = filteredSites.filter(site => site.lineName && site.lineName.includes(query.lineName))
      }

      // 地理位置范围过滤
      if (query.min_longitude !== undefined && query.max_longitude !== undefined) {
        filteredSites = filteredSites.filter(site =>
          site.longitude >= query.min_longitude && site.longitude <= query.max_longitude
        )
      }

      if (query.min_latitude !== undefined && query.max_latitude !== undefined) {
        filteredSites = filteredSites.filter(site =>
          site.latitude >= query.min_latitude && site.latitude <= query.max_latitude
        )
      }

      // 时间范围过滤
      if (query.start_time && query.end_time) {
        const startDate = new Date(query.start_time)
        const endDate = new Date(query.end_time)
        filteredSites = filteredSites.filter(site => {
          const createDate = new Date(site.createdTime)
          return createDate >= startDate && createDate <= endDate
        })
      }

      // 排序
      if (query.order_by) {
        filteredSites.sort((a, b) => {
          let aValue: any, bValue: any
          switch (query.order_by) {
            case 'name':
              aValue = a.siteName
              bValue = b.siteName
              break
            case 'create_time':
              aValue = new Date(a.createdTime)
              bValue = new Date(b.createdTime)
              break
            case 'city':
              aValue = a.city
              bValue = b.city
              break
            default:
              aValue = a.createdTime
              bValue = b.createdTime
          }

          if (query.order_direction === 'desc') {
            return aValue > bValue ? -1 : 1
          }
          return aValue < bValue ? -1 : 1
        })
      }

      // 分页
      const pageNum = query.pageNum || 1
      const pageSize = query.pageSize || 10
      const total = filteredSites.length
      const totalPages = Math.ceil(total / pageSize)
      const startIndex = (pageNum - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedSites = filteredSites.slice(startIndex, endIndex)

      return {
        code: 200,
        message: '获取站点列表成功',
        success: true,
        data: {
          sites: paginatedSites,
          total,
          pageNum,
          pageSize,
          totalPages
        },
        timestamp: new Date().toISOString()
      }
    },

    // 获取站点详情
    getSiteById: async (id: string): Promise<ApiResponse<any>> => {
      await delay(500)

      const site = mockSites.find(s => s.id === id)
      if (!site) {
        return {
          code: 404,
          message: '站点不存在',
          success: false,
          data: null,
          timestamp: new Date().toISOString()
        }
      }

      return {
        code: 200,
        message: '获取站点详情成功',
        success: true,
        data: site,
        timestamp: new Date().toISOString()
      }
    },

    // 创建站点
    createSite: async (siteData: any): Promise<ApiResponse<any>> => {
      await delay(1000)

      const newSite = {
        ...siteData,
        id: `site_${String(mockSites.length + 1).padStart(3, '0')}`,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      }

      mockSites.push(newSite)

      return {
        code: 200,
        message: '创建站点成功',
        success: true,
        data: newSite,
        timestamp: new Date().toISOString()
      }
    },

    // 更新站点
    updateSite: async (id: string, siteData: any): Promise<ApiResponse<any>> => {
      await delay(800)

      const siteIndex = mockSites.findIndex(s => s.id === id)
      if (siteIndex === -1) {
        return {
          code: 404,
          message: '站点不存在',
          success: false,
          data: null,
          timestamp: new Date().toISOString()
        }
      }

      const updatedSite = {
        ...mockSites[siteIndex],
        ...siteData,
        id, // 确保ID不被覆盖
        updateTime: new Date().toISOString()
      }

      mockSites[siteIndex] = updatedSite

      return {
        code: 200,
        message: '更新站点成功',
        success: true,
        data: updatedSite,
        timestamp: new Date().toISOString()
      }
    },

    // 删除站点
    deleteSite: async (id: string): Promise<ApiResponse<boolean>> => {
      await delay(600)

      const siteIndex = mockSites.findIndex(s => s.id === id)
      if (siteIndex === -1) {
        return {
          code: 404,
          message: '站点不存在',
          success: false,
          data: false,
          timestamp: new Date().toISOString()
        }
      }

      mockSites.splice(siteIndex, 1)

      return {
        code: 200,
        message: '删除站点成功',
        success: true,
        data: true,
        timestamp: new Date().toISOString()
      }
    },

    // 搜索站点
    searchSites: async (keyword: string): Promise<ApiResponse<any[]>> => {
      await delay(400)

      if (!keyword) {
        return {
          code: 200,
          message: '搜索站点成功',
          success: true,
          data: [],
          timestamp: new Date().toISOString()
        }
      }

      const lowerKeyword = keyword.toLowerCase()
      const searchResults = mockSites.filter(site =>
        (site.siteName && site.siteName.toLowerCase().includes(lowerKeyword)) ||
        (site.siteAddress && site.siteAddress.toLowerCase().includes(lowerKeyword)) ||
        (site.city && site.city.toLowerCase().includes(lowerKeyword)) ||
        (site.lineName && site.lineName.toLowerCase().includes(lowerKeyword)) ||
        (site.description && site.description.toLowerCase().includes(lowerKeyword))
      )

      return {
        code: 200,
        message: '搜索站点成功',
        success: true,
        data: searchResults,
        timestamp: new Date().toISOString()
      }
    },

    // 获取线路列表
    getLines: async (query?: LineQuery): Promise<ApiResponse<LineListResponse>> => {
      await delay(500)

      let filteredLines = [...mockLines]

      // 根据查询条件过滤
      if (query) {
        if (query.keyword) {
          const keyword = query.keyword.toLowerCase()
          filteredLines = filteredLines.filter(line =>
            line.line_name.toLowerCase().includes(keyword) ||
            line.line_code.toLowerCase().includes(keyword) ||
            line.description?.toLowerCase().includes(keyword) ||
            line.operating_company?.toLowerCase().includes(keyword)
          )
        }

        if (query.lineName) {
          filteredLines = filteredLines.filter(line =>
            line.line_name.toLowerCase().includes(query.lineName!.toLowerCase())
          )
        }

        if (query.lineCode) {
          filteredLines = filteredLines.filter(line =>
            line.line_code.toLowerCase().includes(query.lineCode!.toLowerCase())
          )
        }

        if (query.lineType) {
          filteredLines = filteredLines.filter(line => line.line_type === query.lineType)
        }

        if (query.city) {
          filteredLines = filteredLines.filter(line => line.city.includes(query.city!))
        }

        if (query.status) {
          filteredLines = filteredLines.filter(line => line.status === query.status)
        }
      }

      // 分页
      const page = query?.pageNum || 1
      const limit = query?.pageSize || 10
      const total = filteredLines.length
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedLines = filteredLines.slice(startIndex, endIndex)

      return {
        code: 200,
        message: '获取线路列表成功',
        success: true,
        data: {
          list: paginatedLines,
          total,
          page,
          limit
        },
        timestamp: new Date().toISOString()
      }
    }
  }
}

// 检查是否启用Mock
export const isMockEnabled = () => {
  return import.meta.env.VITE_ENABLE_MOCK === 'true'
}

// Mock拦截器
export const setupMockInterceptor = () => {
  if (!isMockEnabled()) return

  // 可以在这里设置更复杂的Mock拦截逻辑
  console.log('Mock API已启用，用于开发调试')
}
