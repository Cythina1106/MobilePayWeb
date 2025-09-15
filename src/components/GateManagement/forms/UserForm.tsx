import React, { useEffect } from 'react'
import { GateUser } from '../../../types/gate'

interface UserFormProps {
  user: Partial<GateUser> | null
  editingUser: GateUser | null
  onSave: (userData: Partial<GateUser>) => void
  onCancel: () => void
}

const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  editingUser, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = React.useState<Partial<GateUser>>({ 
    ...user 
  })

  useEffect(() => {
    setFormData({ ...user })
  }, [user])

  const handleInputChange = (field: keyof GateUser, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  const handleCancel = () => {
    onCancel()
  }

  return (
    <div className="user-form">
      <div className="form-group">
        <label htmlFor="cardNumber">卡号 <span className="required">*</span></label>
        <input
          id="cardNumber"
          type="text"
          value={formData.cardNumber || ''}
          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
          placeholder="请输入卡号"
          disabled={editingUser} // 编辑时不允许修改卡号
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="name">姓名 <span className="required">*</span></label>
        <input
          id="name"
          type="text"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="请输入姓名"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="phone">手机号 <span className="required">*</span></label>
        <input
          id="phone"
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="请输入手机号"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">邮箱</label>
        <input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="请输入邮箱"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="role">角色</label>
        <select
          id="role"
          value={formData.role || 'regular'}
          onChange={(e) => handleInputChange('role', e.target.value)}
        >
          <option value="regular">普通用户</option>
          <option value="vip">VIP用户</option>
          <option value="admin">管理员</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="status">状态</label>
        <select
          id="status"
          value={formData.status || 'active'}
          onChange={(e) => handleInputChange('status', e.target.value)}
        >
          <option value="active">启用</option>
          <option value="inactive">禁用</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="accessLevel">访问权限</label>
        <select
          id="accessLevel"
          value={formData.accessLevel || 'all'}
          onChange={(e) => handleInputChange('accessLevel', e.target.value)}
        >
          <option value="all">全部站点</option>
          <option value="limited">限制站点</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="balance">余额</label>
        <input
          id="balance"
          type="number"
          step="0.01"
          value={formData.balance || 0}
          onChange={(e) => handleInputChange('balance', e.target.value)}
          placeholder="请输入余额"
        />
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-primary" onClick={handleSave}>
          {editingUser ? '更新' : '添加'}
        </button>
        <button type="button" className="btn-secondary" onClick={handleCancel}>
          取消
        </button>
      </div>
    </div>
  )
}

export default UserForm