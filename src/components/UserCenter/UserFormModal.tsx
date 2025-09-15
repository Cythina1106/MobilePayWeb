import React, { useState, useEffect } from 'react'

interface User {
  id: string
  userName: string
  phone: string
  email: string
  userType: 'regular' | 'student' | 'senior' | 'staff'
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISABLED'
  balance: number
  idCard?: string
  address?: string
  registrationDate?: string
  lastUsed?: string
  totalTrips?: number
}

interface UserFormModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onSave: (user: User) => void
  loading: boolean
}

const UserFormModal: React.FC<UserFormModalProps> = ({ user, isOpen, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState<User>({
    id: '',
    userName: '',
    phone: '',
    email: '',
    userType: 'regular',
    status: 'APPROVED',
    balance: 0
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        id: user.id,
        userName: user.userName,
        phone: user.phone,
        email: user.email,
        userType: user.userType,
        status: user.status,
        balance: user.balance,
        idCard: user.idCard,
        address: user.address,
        registrationDate: user.registrationDate,
        lastUsed: user.lastUsed,
        totalTrips: user.totalTrips
      })
      setErrors({})
    }
  }, [user, isOpen])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.userName.trim()) {
      newErrors.userName = '用户名不能为空'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '手机号不能为空'
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入正确的手机号'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空'
    } else if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(formData.email)) {
      newErrors.email = '请输入正确的邮箱'
    }
    
    if (formData.balance < 0) {
      newErrors.balance = '余额不能为负数'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave({ ...formData })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>编辑用户信息</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <form className="user-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName">用户名</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="请输入用户名"
            />
            {errors.userName && <span className="error-message">{errors.userName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">手机号</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="请输入手机号"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="请输入邮箱"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="userType">用户类型</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
            >
              <option value="regular">普通用户</option>
              <option value="student">学生</option>
              <option value="senior">老年人</option>
              <option value="staff">员工</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">状态</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="APPROVED">已通过</option>
              <option value="DISABLED">已禁用</option>
              <option value="PENDING">待审核</option>
              <option value="REJECTED">已拒绝</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="balance">余额</label>
            <input
              type="number"
              id="balance"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              placeholder="请输入余额"
              min="0"
              step="0.01"
            />
            {errors.balance && <span className="error-message">{errors.balance}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="idCard">身份证号</label>
            <input
              type="text"
              id="idCard"
              name="idCard"
              value={formData.idCard || ''}
              onChange={handleChange}
              placeholder="请输入身份证号"
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">地址</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              placeholder="请输入地址"
            />
          </div>

          {formData.registrationDate && (
            <div className="form-group">
              <label>注册日期</label>
              <input type="text" value={formData.registrationDate} disabled />
            </div>
          )}

          {formData.lastUsed && (
            <div className="form-group">
              <label>最后使用</label>
              <input type="text" value={formData.lastUsed} disabled />
            </div>
          )}

          {formData.totalTrips !== undefined && (
            <div className="form-group">
              <label>出行次数</label>
              <input type="text" value={formData.totalTrips} disabled />
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>取消</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserFormModal
