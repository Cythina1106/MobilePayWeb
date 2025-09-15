import { useState } from 'react'
import '../styles/PaymentMethods.css'
import Card from '../components/Common/Card.tsx';

interface PaymentMethod {
  id: string
  type: 'balance' | 'bankCard'
  name: string
  balance?: number
  cardNumber?: string
  bankName?: string
  isDefault: boolean
  isActive: boolean
}

interface Transaction {
  id: string
  amount: number
  type: 'payment' | 'refund' | 'recharge'
  paymentMethod: string
  status: 'success' | 'pending' | 'failed'
  timestamp: string
  description: string
}

const PaymentMethods = () => {
  const [activeTab, setActiveTab] = useState<'methods' | 'transactions' | 'settings'>('methods')
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'balance',
      name: '账户余额',
      balance: 1288.50,
      isDefault: true,
      isActive: true
    },
    {
      id: '2',
      type: 'bankCard',
      name: '工商银行储蓄卡',
      cardNumber: '****1234',
      bankName: '中国工商银行',
      isDefault: false,
      isActive: true
    },
    {
      id: '3',
      type: 'bankCard',
      name: '建设银行信用卡',
      cardNumber: '****5678',
      bankName: '中国建设银行',
      isDefault: false,
      isActive: true
    }
  ])

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      amount: 50.00,
      type: 'payment',
      paymentMethod: '账户余额',
      status: 'success',
      timestamp: '2025-07-18 14:30:00',
      description: '地铁支付'
    },
    {
      id: '2',
      amount: 100.00,
      type: 'recharge',
      paymentMethod: '工商银行储蓄卡',
      status: 'success',
      timestamp: '2025-07-18 10:15:00',
      description: '账户充值'
    },
    {
      id: '3',
      amount: 25.80,
      type: 'payment',
      paymentMethod: '账户余额',
      status: 'success',
      timestamp: '2025-07-18 09:45:00',
      description: '公交支付'
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    bankName: '',
    cardType: 'debit'
  })

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === id
    })))
  }

  const handleToggleActive = (id: string) => {
    setPaymentMethods(prev => prev.map(method =>
      method.id === id ? { ...method, isActive: !method.isActive } : method
    ))
  }

  const handleAddCard = () => {
    if (newCard.cardNumber && newCard.bankName) {
      const newMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: 'bankCard',
        name: `${newCard.bankName}${newCard.cardType === 'credit' ? '信用卡' : '储蓄卡'}`,
        cardNumber: `****${newCard.cardNumber.slice(-4)}`,
        bankName: newCard.bankName,
        isDefault: false,
        isActive: true
      }
      setPaymentMethods(prev => [...prev, newMethod])
      setNewCard({ cardNumber: '', bankName: '', cardType: 'debit' })
      setShowAddModal(false)
    }
  }

  const renderPaymentMethods = () => (
    <div className="payment-methods-section">
      <div className="section-header">
        <h3>支付方式管理</h3>
        <button
          className="add-btn"
          onClick={() => setShowAddModal(true)}
        >
          + 添加银行卡
        </button>
      </div>

      <div className="methods-grid">
        {paymentMethods.map(method => (
          <Card key={method.id} variant={method.type} className="method-card">
            <div className="method-header">
              <div className="method-info">
                <h4>{method.name}</h4>
                {method.type === 'balance' && (
                  <p className="balance">¥{method.balance?.toFixed(2)}</p>
                )}
                {method.type === 'bankCard' && (
                  <p className="card-info">{method.cardNumber}</p>
                )}
              </div>
              <div className="method-actions">
                <button
                  className={`default-btn ${method.isDefault ? 'active' : ''}`}
                  onClick={() => handleSetDefault(method.id)}
                >
                  {method.isDefault ? '默认' : '设为默认'}
                </button>
                <button
                  className={`toggle-btn ${method.isActive ? 'active' : ''}`}
                  onClick={() => handleToggleActive(method.id)}
                >
                  {method.isActive ? '启用' : '禁用'}
                </button>
              </div>
            </div>

            {method.type === 'balance' && (
              <div className="balance-actions">
                <button className="recharge-btn">充值</button>
                <button className="withdraw-btn">提现</button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )

  const renderTransactions = () => (
    <div className="transactions-section">
      <div className="section-header">
        <h3>交易记录</h3>
        <div className="filter-options">
          <select className="filter-select">
            <option value="all">全部类型</option>
            <option value="payment">支付</option>
            <option value="recharge">充值</option>
            <option value="refund">退款</option>
          </select>
          <select className="filter-select">
            <option value="all">全部状态</option>
            <option value="success">成功</option>
            <option value="pending">处理中</option>
            <option value="failed">失败</option>
          </select>
        </div>
      </div>

      <div className="transactions-table">
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th>类型</th>
              <th>金额</th>
              <th>支付方式</th>
              <th>状态</th>
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.timestamp}</td>
                <td>
                  <span className={`type-badge ${transaction.type}`}>
                    {transaction.type === 'payment' ? '支付' :
                     transaction.type === 'recharge' ? '充值' : '退款'}
                  </span>
                </td>
                <td className={`amount ${transaction.type}`}>
                  {transaction.type === 'payment' ? '-' : '+'}¥{transaction.amount.toFixed(2)}
                </td>
                <td>{transaction.paymentMethod}</td>
                <td>
                  <span className={`status-badge ${transaction.status}`}>
                    {transaction.status === 'success' ? '成功' :
                     transaction.status === 'pending' ? '处理中' : '失败'}
                  </span>
                </td>
                <td>{transaction.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h3>支付设置</h3>
      </div>

      <div className="settings-grid">
        <div className="setting-card">
          <h4>支付限额</h4>
          <div className="setting-item">
            <label>单笔支付限额</label>
            <input type="number" defaultValue="1000" />
          </div>
          <div className="setting-item">
            <label>日累计限额</label>
            <input type="number" defaultValue="5000" />
          </div>
        </div>

        <div className="setting-card">
          <h4>安全设置</h4>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              支付密码验证
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              短信验证
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              指纹验证
            </label>
          </div>
        </div>

        <div className="setting-card">
          <h4>自动充值</h4>
          <div className="setting-item">
            <label>
              <input type="checkbox" />
              启用自动充值
            </label>
          </div>
          <div className="setting-item">
            <label>余额低于</label>
            <input type="number" defaultValue="50" />
          </div>
          <div className="setting-item">
            <label>自动充值金额</label>
            <input type="number" defaultValue="100" />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="payment-methods">
      <div className="payment-header">
        <h2>支付方式管理</h2>
        <p>管理您的支付方式和交易记录</p>
      </div>

      {/* 标签页导航 */}
      <div className="payment-tabs">
        <button
          className={`tab-btn ${activeTab === 'methods' ? 'active' : ''}`}
          onClick={() => setActiveTab('methods')}
        >
          支付方式
        </button>
        <button
          className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          交易记录
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          支付设置
        </button>
      </div>

      {/* 标签页内容 */}
      <div className="tab-content">
        {activeTab === 'methods' && renderPaymentMethods()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* 添加银行卡模态框 */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>添加银行卡</h3>
              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>银行名称</label>
                <input
                  type="text"
                  value={newCard.bankName}
                  onChange={(e) => setNewCard(prev => ({ ...prev, bankName: e.target.value }))}
                  placeholder="请输入银行名称"
                />
              </div>
              <div className="form-group">
                <label>银行卡号</label>
                <input
                  type="text"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard(prev => ({ ...prev, cardNumber: e.target.value }))}
                  placeholder="请输入银行卡号"
                />
              </div>
              <div className="form-group">
                <label>卡片类型</label>
                <select
                  value={newCard.cardType}
                  onChange={(e) => setNewCard(prev => ({ ...prev, cardType: e.target.value }))}
                >
                  <option value="debit">储蓄卡</option>
                  <option value="credit">信用卡</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowAddModal(false)}
              >
                取消
              </button>
              <button
                className="confirm-btn"
                onClick={handleAddCard}
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentMethods
