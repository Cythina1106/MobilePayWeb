import { useState } from 'react'
import '../styles/TransactionList.css'
import TransactionStatsCard from "../components/Common/TransactionStatsCard.tsx"

interface Transaction {
  id: string
  user: string
  amount: string
  status: '成功' | '失败' | '处理中' | '已退款'
  method: string
  time: string
  date: string
  orderId: string
  description: string
}

const TransactionList = () => {

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('today')

  const transactions: Transaction[] = [
    {
      id: '202407160001',
      user: '张三',
      amount: '¥299.00',
      status: '成功',
      method: '余额支付',
      time: '14:32:15',
      date: '2025-07-16',
      orderId: 'ORD20250716001',
      description: '商品购买'
    },
    {
      id: '202407160002',
      user: '李四',
      amount: '¥1,299.00',
      status: '成功',
      method: '银行卡支付',
      time: '14:28:42',
      date: '2025-07-16',
      orderId: 'ORD20250716002',
      description: '在线充值'
    },
    {
      id: '202407160003',
      user: '王五',
      amount: '¥599.00',
      status: '处理中',
      method: '银行卡支付',
      time: '14:25:08',
      date: '2025-07-16',
      orderId: 'ORD20250716003',
      description: '服务订购'
    },
    {
      id: '202407160004',
      user: '赵六',
      amount: '¥89.00',
      status: '成功',
      method: '余额支付',
      time: '14:20:35',
      date: '2025-07-16',
      orderId: 'ORD20250716004',
      description: '商品购买'
    },
    {
      id: '202407160005',
      user: '孙七',
      amount: '¥2,599.00',
      status: '失败',
      method: '银行卡支付',
      time: '14:18:22',
      date: '2025-07-16',
      orderId: 'ORD20250716005',
      description: '大额转账'
    },
    {
      id: '202407160006',
      user: '周八',
      amount: '¥159.00',
      status: '已退款',
      method: '余额支付',
      time: '14:15:10',
      date: '2025-07-16',
      orderId: 'ORD20250716006',
      description: '商品退款'
    }
  ]

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.user.includes(searchTerm) ||
        transaction.id.includes(searchTerm) ||
        transaction.orderId.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleExport = () => {
    alert('导出功能正在开发中...')
  }

  const handleRefund = (transactionId: string) => {
    alert(`退款交易 ${transactionId}`)
  }

  const handleViewDetails = (transaction: Transaction) => {
    alert(`查看交易详情: ${transaction.id}`)
  }
  return (
    <div className="transaction-list">
      <div className="transaction-header">
        <h2>交易管理</h2>
        <p>管理和监控所有支付交易</p>
      </div>

      <div className="filters-section">
        <div className="search-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="搜索用户名、交易ID或订单号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">所有状态</option>
            <option value="成功">成功</option>
            <option value="失败">失败</option>
            <option value="处理中">处理中</option>
            <option value="已退款">已退款</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-select"
          >
            <option value="today">今天</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
            <option value="custom">自定义</option>
          </select>
        </div>

        <button className="export-btn" onClick={handleExport}>
          📊 导出报表
        </button>
      </div>

      <div className="transaction-stats">
          <TransactionStatsCard
            label="总交易数"
            value={filteredTransactions.length}
          />
          <TransactionStatsCard
            label="成功交易"
            value={filteredTransactions.filter(t => t.status === '成功').length}
            status="success"
          />
          <TransactionStatsCard
            label="失败交易"
            value={filteredTransactions.filter(t => t.status === '失败').length}
            status="failed"
          />
          <TransactionStatsCard
            label="处理中"
            value={filteredTransactions.filter(t => t.status === '处理中').length}
            status="pending"
          />
      </div>

      <div className="transaction-table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>交易ID</th>
              <th>订单号</th>
              <th>用户</th>
              <th>金额</th>
              <th>支付方式</th>
              <th>状态</th>
              <th>交易时间</th>
              <th>描述</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td className="transaction-id">{transaction.id}</td>
                <td className="order-id">{transaction.orderId}</td>
                <td>{transaction.user}</td>
                <td className="amount">{transaction.amount}</td>
                <td>
                  <span className={`payment-method ${transaction.method.toLowerCase()}`}>
                    {transaction.method}
                  </span>
                </td>
                <td>
                  <span className={`status ${transaction.status}`}>
                    <span className="status-dot"></span>
                    {transaction.status}
                  </span>
                </td>
                <td>
                  <div className="time-info">
                    <div>{transaction.date}</div>
                    <div className="time">{transaction.time}</div>
                  </div>
                </td>
                <td>{transaction.description}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn view"
                      onClick={() => handleViewDetails(transaction)}
                    >
                      查看
                    </button>
                    {transaction.status === '成功' && (
                      <button
                        className="action-btn refund"
                        onClick={() => handleRefund(transaction.id)}
                      >
                        退款
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="page-btn">上一页</button>
        <span className="page-info">第 1 页，共 10 页</span>
        <button className="page-btn">下一页</button>
      </div>
    </div>
  )
}

export default TransactionList
