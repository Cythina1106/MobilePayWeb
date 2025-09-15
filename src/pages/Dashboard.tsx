import { useEffect } from 'react'
import { dashboardApi } from '../services/api.ts';
import { useApi } from '../hooks/useApi.ts'
import StatCard from '../components/Common/StatCard.tsx'
import Card from '../components/Common/Card.tsx';
import { DashboardStats } from '../types/api.ts'
import '../styles/Dashboard.css'

const Dashboard = () => {
  // 使用API Hook获取仪表盘数据
  const { data: dashboardData, loading, execute: loadDashboard } = useApi(dashboardApi.getStats, {
    immediate: false,
    onError: (error) => {
      console.error('获取仪表盘数据失败:', error.message)
    }
  })

  // 如果API数据不可用，使用模拟数据
  const fallbackStats = [
    { title: '今日交易额', value: '¥2,456,789', change: '+12.5%', icon: '今日交易额.svg' },
    { title: '交易笔数', value: '8,432', change: '+5.2%', icon: '交易笔款.svg' },
    { title: '活跃用户', value: '12,345', change: '+8.7%', icon: '活跃用户.svg' },
    { title: '成功率', value: '99.8%', change: '+0.2%', icon: '成功率.svg' },
  ]

  const fallbackTransactions = [
    { id: '202407160001', user: '张三', amount: '¥299.00', status: '成功', method: '余额支付', time: '14:32' },
    { id: '202407160002', user: '李四', amount: '¥1,299.00', status: '成功', method: '银行卡支付', time: '14:28' },
    { id: '202407160003', user: '王五', amount: '¥599.00', status: '处理中', method: '银行卡支付', time: '14:25' },
    { id: '202407160004', user: '赵六', amount: '¥89.00', status: '成功', method: '余额支付', time: '14:20' },
    { id: '202407160005', user: '孙七', amount: '¥2,599.00', status: '失败', method: '银行卡支付', time: '14:18' },
  ]

  // 处理API数据转换为显示格式
  const formatStats = (data: DashboardStats | null) => {
    if (!data) return fallbackStats

    return [
      {
        title: '今日交易额',
        value: `¥${data.todayTransactions.amount.toLocaleString()}`,
        change: `+${data.todayTransactions.successRate}%`,
        icon: '💰'
      },
      {
        title: '交易笔数',
        value: data.todayTransactions.count.toLocaleString(),
        change: '+5.2%', // 可以从API获取变化率
        icon: '📊'
      },
      {
        title: '活跃用户',
        value: data.totalUsers.activeCount.toLocaleString(),
        change: `+${Math.round((data.totalUsers.newCount / data.totalUsers.count) * 100)}%`,
        icon: '👥'
      },
      {
        title: '成功率',
        value: `${data.todayTransactions.successRate}%`,
        change: '+0.2%',
        icon: '✅'
      }
    ]
  }

  const formatTransactions = (data: DashboardStats | null) => {
    if (!data || !data.recentTransactions) return fallbackTransactions

    return data.recentTransactions.slice(0, 5).map(transaction => ({
      id: transaction.orderNo,
      user: transaction.userName,
      amount: `¥${transaction.amount.toFixed(2)}`,
      status: transaction.status === 'success' ? '成功' :
              transaction.status === 'pending' ? '处理中' :
              transaction.status === 'failed' ? '失败' : '未知',
      method: transaction.paymentMethod === 'balance' ? '余额支付' :
              transaction.paymentMethod === 'bank_card' ? '银行卡支付' :
              transaction.paymentMethod === 'alipay' ? '支付宝' :
              transaction.paymentMethod === 'wechat' ? '微信支付' : '其他',
      time: new Date(transaction.createTime).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }))
  }

  const stats = formatStats(dashboardData)
  const recentTransactions = formatTransactions(dashboardData)

  // 定时刷新数据
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboard()
    }, 30000) // 每30秒刷新一次

    return () => clearInterval(interval)
  }, [loadDashboard])

  if (loading && !dashboardData) {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>正在加载数据...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>数据概览</h2>
        <p>今日实时数据统计</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="dashboard-content">
        <div className="recent-transactions">
          <h3>最近交易</h3>
          <div className="transaction-table">
            <div className="table-header">
                <div>交易ID</div>
                <div>用户</div>
                <div>金额</div>
                <div>支付方式</div>
                <div>状态</div>
                <div>时间</div>
            </div>

            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="table-row">
                <div className="transaction-id">{transaction.id}</div>
                <div>{transaction.user}</div>
                <div className="amount">{transaction.amount}</div>
                <div className="payment-method">{transaction.method}</div>
                <div className={`status ${transaction.status}`}>
                  <span className="status-dot"></span>
                  {transaction.status}
                </div>
                <div>{transaction.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="charts-section">
          <Card variant="chart" className="chart-card">
              <h3>今日交易趋势</h3>
              <div className="chart-placeholder">
                <div className="chart-bars">
                  <div className="bar" style={{height: '60%'}}></div>
                  <div className="bar" style={{height: '80%'}}></div>
                  <div className="bar" style={{height: '45%'}}></div>
                  <div className="bar" style={{height: '90%'}}></div>
                  <div className="bar" style={{height: '70%'}}></div>
                  <div className="bar" style={{height: '85%'}}></div>
                  <div className="bar" style={{height: '95%'}}></div>
                </div>

                <div className="chart-labels">
                  <span>09:00</span>
                  <span>11:00</span>
                  <span>13:00</span>
                  <span>15:00</span>
                  <span>17:00</span>
                  <span>19:00</span>
                  <span>21:00</span>
                </div>
              </div>
            </Card>
            <Card variant="chart" className="chart-card">
              <h3>支付方式分布</h3>
              <div className="payment-distribution">
                <div className="pie-chart">
                  <div className="pie-segment balance" style={{transform: 'rotate(0deg)'}}>
                    <span>余额支付 60%</span>
                  </div>
                  <div className="pie-segment bank" style={{transform: 'rotate(216deg)'}}>
                    <span>银行卡支付 40%</span>
                  </div>
                </div>
              </div>
            </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
