import { useState, useRef } from 'react'
import './QRCodeScanner.css'

interface QRCodeData {
  userId: string
  cardNumber: string
  userName: string
  userType: 'regular' | 'student' | 'senior' | 'staff'
  balance: number
  status: 'active' | 'suspended' | 'expired'
  validUntil: string
}

interface Station {
  id: string
  name: string
  code: string
  line: string
}

interface Gate {
  id: string
  stationId: string
  stationName: string
  gateNumber: string
  type: 'entry' | 'exit' | 'bidirectional'
  status: 'online' | 'offline' | 'error'
}

interface TripEvent {
  id: string
  eventType: 'entry' | 'exit'
  userId: string
  cardNumber: string
  userName: string
  stationId: string
  stationName: string
  gateId: string
  gateNumber: string
  timestamp: string
  fare: number
  balance: number
  status: 'success' | 'insufficientBalance' | 'cardExpired' | 'cardSuspended' | 'systemError'
  errorMessage?: string
}

interface FareRule {
  fromStation: string
  toStation: string
  regularFare: number
  studentFare: number
  seniorFare: number
  staffFare: number
  distance: number
}

const QRCodeScanner = () => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'events' | 'analytics' | 'settings'>('scanner')
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [selectedGate, setSelectedGate] = useState<Gate | null>(null)
  const [scannerActive, setScannerActive] = useState(false)
  const [scannedData, setScannedData] = useState<QRCodeData | null>(null)
  const [processingEvent, setProcessingEvent] = useState(false)
  const [eventHistory, setEventHistory] = useState<TripEvent[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const scannerRef = useRef<HTMLDivElement>(null)

  // 模拟数据
  const stations: Station[] = [
    { id: '1', name: '天安门东站', code: 'TAD', line: '1号线' },
    { id: '2', name: '王府井站', code: 'WFJ', line: '1号线' },
    { id: '3', name: '西单站', code: 'XD', line: '1号线' },
    { id: '4', name: '复兴门站', code: 'FXM', line: '1号线' },
    { id: '5', name: '建国门站', code: 'JGM', line: '1号线' }
  ]

  const gates: Gate[] = [
    { id: '1', stationId: '1', stationName: '天安门东站', gateNumber: 'A01', type: 'entry', status: 'online' },
    { id: '2', stationId: '1', stationName: '天安门东站', gateNumber: 'A02', type: 'entry', status: 'online' },
    { id: '3', stationId: '1', stationName: '天安门东站', gateNumber: 'B01', type: 'exit', status: 'online' },
    { id: '4', stationId: '1', stationName: '天安门东站', gateNumber: 'B02', type: 'exit', status: 'online' },
    { id: '5', stationId: '2', stationName: '王府井站', gateNumber: 'A01', type: 'bidirectional', status: 'online' },
    { id: '6', stationId: '2', stationName: '王府井站', gateNumber: 'A02', type: 'bidirectional', status: 'online' }
  ]

  const fareRules: FareRule[] = [
    { fromStation: '天安门东站', toStation: '王府井站', regularFare: 3, studentFare: 1.5, seniorFare: 1.5, staffFare: 0, distance: 2 },
    { fromStation: '王府井站', toStation: '西单站', regularFare: 3, studentFare: 1.5, seniorFare: 1.5, staffFare: 0, distance: 3 },
    { fromStation: '天安门东站', toStation: '西单站', regularFare: 4, studentFare: 2, seniorFare: 2, staffFare: 0, distance: 5 },
    { fromStation: '西单站', toStation: '复兴门站', regularFare: 3, studentFare: 1.5, seniorFare: 1.5, staffFare: 0, distance: 2 },
    { fromStation: '复兴门站', toStation: '建国门站', regularFare: 5, studentFare: 2.5, seniorFare: 2.5, staffFare: 0, distance: 8 }
  ]

  // 模拟二维码数据
  const mockQRData: QRCodeData[] = [
    {
      userId: '1',
      cardNumber: '6001001234567890',
      userName: '张三',
      userType: 'regular',
      balance: 128.50,
      status: 'active',
      validUntil: '2025-12-31'
    },
    {
      userId: '2',
      cardNumber: '6001001234567891',
      userName: '李四',
      userType: 'student',
      balance: 45.80,
      status: 'active',
      validUntil: '2025-12-31'
    },
    {
      userId: '3',
      cardNumber: '6001001234567892',
      userName: '王五',
      userType: 'senior',
      balance: 2.50,
      status: 'active',
      validUntil: '2025-12-31'
    },
    {
      userId: '4',
      cardNumber: '6001001234567893',
      userName: '赵六',
      userType: 'staff',
      balance: 0.00,
      status: 'suspended',
      validUntil: '2025-12-31'
    }
  ]

  // 获取当前站点的闸机列表
  const getGatesForStation = (stationId: string) => {
    return gates.filter(gate => gate.stationId === stationId && gate.status === 'online')
  }

  // 计算票价
  const calculateFare = (fromStation: string, toStation: string, userType: string): number => {
    const rule = fareRules.find(r => 
      (r.fromStation === fromStation && r.toStation === toStation) ||
      (r.fromStation === toStation && r.toStation === fromStation)
    )
    
    if (!rule) return 3 // 默认票价
    
    switch (userType) {
      case 'student': return rule.studentFare
      case 'senior': return rule.seniorFare
      case 'staff': return rule.staffFare
      default: return rule.regularFare
    }
  }

  // 模拟扫码
  const simulateQRScan = () => {
    if (!selectedStation || !selectedGate) {
      alert('请先选择站点和闸机')
      return
    }

    setScannerActive(true)
    
    // 模拟扫码延迟
    setTimeout(() => {
      const randomUser = mockQRData[Math.floor(Math.random() * mockQRData.length)]
      setScannedData(randomUser)
      setScannerActive(false)
    }, 2000)
  }

  // 处理入站事件
  const handleEntryEvent = async (qrData: QRCodeData) => {
    if (!selectedStation || !selectedGate) return

    setProcessingEvent(true)

    try {
      // 验证用户状态
      if (qrData.status === 'suspended') {
        throw new Error('用户卡已被暂停使用')
      }

      if (qrData.status === 'expired') {
        throw new Error('用户卡已过期')
      }

      const now = new Date()
      if (new Date(qrData.validUntil) < now) {
        throw new Error('用户卡已过期')
      }

      // 检查是否有未完成的出行
      const existingTrip = eventHistory.find(event => 
        event.userId === qrData.userId && 
        event.eventType === 'entry' && 
        !eventHistory.some(exitEvent => 
          exitEvent.userId === qrData.userId && 
          exitEvent.eventType === 'exit' && 
          exitEvent.timestamp > event.timestamp
        )
      )

      if (existingTrip) {
        throw new Error('检测到未完成的出行记录，请先完成出站')
      }

      // 创建入站事件
      const entryEvent: TripEvent = {
        id: Date.now().toString(),
        eventType: 'entry',
        userId: qrData.userId,
        cardNumber: qrData.cardNumber,
        userName: qrData.userName,
        stationId: selectedStation.id,
        stationName: selectedStation.name,
        gateId: selectedGate.id,
        gateNumber: selectedGate.gateNumber,
        timestamp: now.toISOString(),
        fare: 0,
        balance: qrData.balance,
        status: 'success'
      }

      setEventHistory(prev => [entryEvent, ...prev])
      
      // 模拟闸机开门
      alert(`入站成功！\n用户：${qrData.userName}\n站点：${selectedStation.name}\n闸机：${selectedGate.gateNumber}\n余额：¥${qrData.balance.toFixed(2)}`)
      
    } catch (error) {
      // 创建失败事件记录
      const failedEvent: TripEvent = {
        id: Date.now().toString(),
        eventType: 'entry',
        userId: qrData.userId,
        cardNumber: qrData.cardNumber,
        userName: qrData.userName,
        stationId: selectedStation.id,
        stationName: selectedStation.name,
        gateId: selectedGate.id,
        gateNumber: selectedGate.gateNumber,
        timestamp: new Date().toISOString(),
        fare: 0,
        balance: qrData.balance,
        status: qrData.status === 'suspended' ? 'cardSuspended' : 
                qrData.status === 'expired' ? 'cardExpired' : 'systemError',
        errorMessage: error instanceof Error ? error.message : '未知错误'
      }

      setEventHistory(prev => [failedEvent, ...prev])
      alert(`入站失败：${error instanceof Error ? error.message : '系统错误'}`)
    } finally {
      setProcessingEvent(false)
      setScannedData(null)
    }
  }

  // 处理出站事件
  const handleExitEvent = async (qrData: QRCodeData) => {
    if (!selectedStation || !selectedGate) return

    setProcessingEvent(true)

    try {
      // 查找对应的入站记录
      const entryEvent = eventHistory.find(event => 
        event.userId === qrData.userId && 
        event.eventType === 'entry' && 
        event.status === 'success' &&
        !eventHistory.some(exitEvent => 
          exitEvent.userId === qrData.userId && 
          exitEvent.eventType === 'exit' && 
          exitEvent.timestamp > event.timestamp
        )
      )

      if (!entryEvent) {
        throw new Error('未找到对应的入站记录')
      }

      // 计算票价
      const fare = calculateFare(entryEvent.stationName, selectedStation.name, qrData.userType)
      
      // 检查余额
      if (qrData.balance < fare) {
        throw new Error(`余额不足，需要¥${fare.toFixed(2)}，当前余额¥${qrData.balance.toFixed(2)}`)
      }

      // 计算新余额
      const newBalance = qrData.balance - fare
      
      // 创建出站事件
      const exitEvent: TripEvent = {
        id: Date.now().toString(),
        eventType: 'exit',
        userId: qrData.userId,
        cardNumber: qrData.cardNumber,
        userName: qrData.userName,
        stationId: selectedStation.id,
        stationName: selectedStation.name,
        gateId: selectedGate.id,
        gateNumber: selectedGate.gateNumber,
        timestamp: new Date().toISOString(),
        fare: fare,
        balance: newBalance,
        status: 'success'
      }

      setEventHistory(prev => [exitEvent, ...prev])
      
      // 计算出行时间
      const entryTime = new Date(entryEvent.timestamp)
      const exitTime = new Date(exitEvent.timestamp)
      const duration = Math.round((exitTime.getTime() - entryTime.getTime()) / 1000 / 60) // 分钟

      alert(`出站成功！\n用户：${qrData.userName}\n从：${entryEvent.stationName}\n到：${selectedStation.name}\n出行时间：${duration}分钟\n扣费：¥${fare.toFixed(2)}\n余额：¥${newBalance.toFixed(2)}`)
      
    } catch (error) {
      // 创建失败事件记录
      const failedEvent: TripEvent = {
        id: Date.now().toString(),
        eventType: 'exit',
        userId: qrData.userId,
        cardNumber: qrData.cardNumber,
        userName: qrData.userName,
        stationId: selectedStation.id,
        stationName: selectedStation.name,
        gateId: selectedGate.id,
        gateNumber: selectedGate.gateNumber,
        timestamp: new Date().toISOString(),
        fare: 0,
        balance: qrData.balance,
        status: qrData.balance < 3 ? 'insufficientBalance' : 'systemError',
        errorMessage: error instanceof Error ? error.message : '未知错误'
      }

      setEventHistory(prev => [failedEvent, ...prev])
      alert(`出站失败：${error instanceof Error ? error.message : '系统错误'}`)
    } finally {
      setProcessingEvent(false)
      setScannedData(null)
    }
  }

  // 处理扫码结果
  const handleScanResult = (qrData: QRCodeData) => {
    if (!selectedGate) return

    if (selectedGate.type === 'entry') {
      handleEntryEvent(qrData)
    } else if (selectedGate.type === 'exit') {
      handleExitEvent(qrData)
    } else {
      // 双向闸机，需要判断用户状态
      const hasActiveTrip = eventHistory.some(event => 
        event.userId === qrData.userId && 
        event.eventType === 'entry' && 
        event.status === 'success' &&
        !eventHistory.some(exitEvent => 
          exitEvent.userId === qrData.userId && 
          exitEvent.eventType === 'exit' && 
          exitEvent.timestamp > event.timestamp
        )
      )

      if (hasActiveTrip) {
        handleExitEvent(qrData)
      } else {
        handleEntryEvent(qrData)
      }
    }
  }

  // 过滤事件历史
  const filteredEvents = eventHistory.filter(event => {
    const matchesSearch = event.userName.includes(searchTerm) || 
                         event.cardNumber.includes(searchTerm) ||
                         event.stationName.includes(searchTerm)
    
    const matchesDate = !dateFilter || event.timestamp.startsWith(dateFilter)
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    
    return matchesSearch && matchesDate && matchesStatus
  })

  // 统计数据
  const todayEvents = eventHistory.filter(event => 
    event.timestamp.startsWith(new Date().toISOString().split('T')[0])
  )
  
  const successfulEvents = todayEvents.filter(event => event.status === 'success')
  const failedEvents = todayEvents.filter(event => event.status !== 'success')
  const totalFare = successfulEvents.reduce((sum, event) => sum + event.fare, 0)

  // 渲染扫码器界面
  const renderScanner = () => (
    <div className="scanner-section">
      <div className="scanner-header">
        <h3>闸机扫码识别</h3>
        <div className="scanner-status">
          <span className={`status-indicator ${selectedStation && selectedGate ? 'ready' : 'waiting'}`}>
            {selectedStation && selectedGate ? '就绪' : '等待设置'}
          </span>
        </div>
      </div>

      <div className="scanner-config">
        <div className="config-row">
          <div className="config-group">
            <label>选择站点</label>
            <select 
              value={selectedStation?.id || ''} 
              onChange={(e) => {
                const station = stations.find(s => s.id === e.target.value)
                setSelectedStation(station || null)
                setSelectedGate(null)
              }}
            >
              <option value="">请选择站点</option>
              {stations.map(station => (
                <option key={station.id} value={station.id}>
                  {station.name} ({station.line})
                </option>
              ))}
            </select>
          </div>

          <div className="config-group">
            <label>选择闸机</label>
            <select 
              value={selectedGate?.id || ''} 
              onChange={(e) => {
                const gate = gates.find(g => g.id === e.target.value)
                setSelectedGate(gate || null)
              }}
              disabled={!selectedStation}
            >
              <option value="">请选择闸机</option>
              {selectedStation && getGatesForStation(selectedStation.id).map(gate => (
                <option key={gate.id} value={gate.id}>
                  {gate.gateNumber} - {gate.type === 'entry' ? '进站' : gate.type === 'exit' ? '出站' : '双向'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedStation && selectedGate && (
          <div className="gate-info">
            <div className="info-card">
              <h4>当前闸机信息</h4>
              <div className="info-details">
                <span>站点：{selectedStation.name}</span>
                <span>闸机：{selectedGate.gateNumber}</span>
                <span>类型：{selectedGate.type === 'entry' ? '进站闸机' : selectedGate.type === 'exit' ? '出站闸机' : '双向闸机'}</span>
                <span className="status online">状态：在线</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="scanner-area">
        <div className={`scanner-container ${scannerActive ? 'scanning' : ''}`} ref={scannerRef}>
          {!scannerActive && !scannedData && (
            <div className="scanner-placeholder">
              <div className="qr-frame">
                <div className="frame-corner tl"></div>
                <div className="frame-corner tr"></div>
                <div className="frame-corner bl"></div>
                <div className="frame-corner br"></div>
                <div className="scan-line"></div>
              </div>
              <p>请将二维码对准扫描框</p>
              <button 
                className="scan-btn"
                onClick={simulateQRScan}
                disabled={!selectedStation || !selectedGate}
              >
                模拟扫码
              </button>
            </div>
          )}

          {scannerActive && (
            <div className="scanning-indicator">
              <div className="scanning-animation">
                <div className="scan-beam"></div>
              </div>
              <p>正在扫描...</p>
            </div>
          )}

          {scannedData && (
            <div className="scan-result">
              <div className="user-info">
                <h4>扫码结果</h4>
                <div className="user-details">
                  <div className="detail-row">
                    <span>姓名：</span>
                    <span>{scannedData.userName}</span>
                  </div>
                  <div className="detail-row">
                    <span>卡号：</span>
                    <span>{scannedData.cardNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span>用户类型：</span>
                    <span className={`user-type ${scannedData.userType}`}>
                      {scannedData.userType === 'regular' ? '普通用户' :
                       scannedData.userType === 'student' ? '学生' :
                       scannedData.userType === 'senior' ? '老年人' : '员工'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>余额：</span>
                    <span className={`balance ${scannedData.balance < 10 ? 'low' : ''}`}>
                      ¥{scannedData.balance.toFixed(2)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>状态：</span>
                    <span className={`status ${scannedData.status}`}>
                      {scannedData.status === 'active' ? '正常' :
                       scannedData.status === 'suspended' ? '暂停' : '过期'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  className="process-btn"
                  onClick={() => handleScanResult(scannedData)}
                  disabled={processingEvent}
                >
                  {processingEvent ? '处理中...' : '确认通行'}
                </button>
                <button 
                  className="cancel-btn"
                  onClick={() => setScannedData(null)}
                  disabled={processingEvent}
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // 渲染事件历史
  const renderEvents = () => (
    <div className="events-section">
      <div className="events-header">
        <h3>事件历史记录</h3>
        <div className="events-filters">
          <input
            type="text"
            placeholder="搜索用户姓名、卡号或站点"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="date-filter"
          />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">全部状态</option>
            <option value="success">成功</option>
            <option value="insufficient_balance">余额不足</option>
            <option value="card_expired">卡已过期</option>
            <option value="card_suspended">卡已暂停</option>
            <option value="system_error">系统错误</option>
          </select>
        </div>
      </div>

      <div className="events-table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>事件类型</th>
              <th>用户</th>
              <th>卡号</th>
              <th>站点</th>
              <th>闸机</th>
              <th>费用</th>
              <th>余额</th>
              <th>状态</th>
              <th>错误信息</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(event => (
              <tr key={event.id}>
                <td>{new Date(event.timestamp).toLocaleString('zh-CN')}</td>
                <td>
                  <span className={`event-type ${event.eventType}`}>
                    {event.eventType === 'entry' ? '进站' : '出站'}
                  </span>
                </td>
                <td>{event.userName}</td>
                <td className="card-number">{event.cardNumber}</td>
                <td>{event.stationName}</td>
                <td>{event.gateNumber}</td>
                <td>
                  {event.fare > 0 ? `¥${event.fare.toFixed(2)}` : '-'}
                </td>
                <td className={`balance ${event.balance < 10 ? 'low' : ''}`}>
                  ¥{event.balance.toFixed(2)}
                </td>
                <td>
                  <span className={`event-status ${event.status}`}>
                    {event.status === 'success' ? '成功' :
                     event.status === 'insufficientBalance' ? '余额不足' :
                     event.status === 'cardExpired' ? '卡已过期' :
                     event.status === 'cardSuspended' ? '卡已暂停' : '系统错误'}
                  </span>
                </td>
                <td>{event.errorMessage || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // 渲染统计分析
  const renderAnalytics = () => (
    <div className="analytics-section">
      <div className="analytics-header">
        <h3>实时统计分析</h3>
        <div className="date-range">
          <span>日期：{new Date().toLocaleDateString('zh-CN')}</span>
        </div>
      </div>

      <div className="analytics-cards">
        <div className="analytics-card">
          <div className="card-header">
            <h4>今日事件总数</h4>
            <span className="card-icon">📊</span>
          </div>
          <div className="card-value">{todayEvents.length}</div>
          <div className="card-footer">
            <span className="success">成功: {successfulEvents.length}</span>
            <span className="failed">失败: {failedEvents.length}</span>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <h4>今日收入</h4>
            <span className="card-icon">💰</span>
          </div>
          <div className="card-value">¥{totalFare.toFixed(2)}</div>
          <div className="card-footer">
            <span>平均票价: ¥{successfulEvents.length > 0 ? (totalFare / successfulEvents.length).toFixed(2) : '0.00'}</span>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <h4>成功率</h4>
            <span className="card-icon">✅</span>
          </div>
          <div className="card-value">
            {todayEvents.length > 0 ? ((successfulEvents.length / todayEvents.length) * 100).toFixed(1) : '0'}%
          </div>
          <div className="card-footer">
            <span>异常处理: {failedEvents.length}</span>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <h4>活跃站点</h4>
            <span className="card-icon">🚇</span>
          </div>
          <div className="card-value">
            {selectedStation?.name || '未选择'}
          </div>
          <div className="card-footer">
            <span>闸机: {selectedGate?.gateNumber || '未选择'}</span>
          </div>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-container">
          <h4>事件类型分布</h4>
          <div className="chart-placeholder">
            <div className="chart-bar">
              <div className="bar entry" style={{ height: `${(todayEvents.filter(e => e.eventType === 'entry').length / Math.max(todayEvents.length, 1)) * 100}%` }}>
                <span>进站 ({todayEvents.filter(e => e.eventType === 'entry').length})</span>
              </div>
              <div className="bar exit" style={{ height: `${(todayEvents.filter(e => e.eventType === 'exit').length / Math.max(todayEvents.length, 1)) * 100}%` }}>
                <span>出站 ({todayEvents.filter(e => e.eventType === 'exit').length})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h4>异常事件分析</h4>
          <div className="exception-list">
            {failedEvents.length === 0 ? (
              <div className="no-exceptions">今日暂无异常事件</div>
            ) : (
              failedEvents.map(event => (
                <div key={event.id} className="exception-item">
                  <span className="exception-time">{new Date(event.timestamp).toLocaleTimeString('zh-CN')}</span>
                  <span className="exception-user">{event.userName}</span>
                  <span className={`exception-type ${event.status}`}>
                    {event.status === 'insufficientBalance' ? '余额不足' :
                     event.status === 'cardExpired' ? '卡已过期' :
                     event.status === 'cardSuspended' ? '卡已暂停' : '系统错误'}
                  </span>
                  <span className="exception-message">{event.errorMessage}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="qr-scanner">
      <div className="scanner-header">
        <h2>扫码识别与事件处理</h2>
        <p>实时处理闸机扫码、入站登记、出站扣费和异常识别</p>
      </div>

      <div className="scanner-tabs">
        <button 
          className={`tab-btn ${activeTab === 'scanner' ? 'active' : ''}`}
          onClick={() => setActiveTab('scanner')}
        >
          扫码识别
        </button>
        <button 
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          事件记录
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          统计分析
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'scanner' && renderScanner()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  )
}

export default QRCodeScanner
