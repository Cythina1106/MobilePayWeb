import React from 'react'
import Card from '../Common/Card.tsx'

interface User {
  id: string
  userName: string
  phone: string
  email: string
  userType: 'regular' | 'student' | 'senior' | 'staff'
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISABLED'
  balance: number
  registrationDate: string
  lastUsed: string
  totalTrips: number
  avatar?: string
  idCard?: string
  address?: string
  username?: string
  name?: string
}

interface UserCardProps {
  user: User
  onStatusChange: (userId: string, newStatus: 'APPROVED' | 'DISABLED') => void
  loading: boolean
}

const UserCard: React.FC<UserCardProps> = ({ user, onStatusChange, loading }) => {
  return (
    <Card key={user.id} variant="user" className="user-card">
      <div className="user-header">
        <div className="user-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.userName} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          ) : (
            <span>{user.userName.charAt(0)}</span>
          )}
        </div>
        <div className="user-info">
          <h4>{user.userName}</h4>
          <p className="user-phone">{user.phone}</p>
          <p className="user-email">{user.email}</p>
        </div>
        <div className={`user-status ${user.status}`}>
          <span className="status-dot"></span>
        </div>
      </div>

      <div className="user-details">
        <div className="detail-row">
          <span>类型</span>
          <span className={`user-type ${user.userType}`}>
            {user.userType === 'regular' ? '普通用户' :
             user.userType === 'student' ? '学生' :
             user.userType === 'senior' ? '老年人' : '员工'}
          </span>
        </div>
        <div className="detail-row">
          <span>余额</span>
          <span className={`balance ${(user.balance || 0) < 10 ? 'low' : ''}`}>
            ¥{(user.balance || 0).toFixed(2)}
          </span>
        </div>
        <div className="detail-row">
          <span>出行次数</span>
          <span>{user.totalTrips} 次</span>
        </div>
        <div className="detail-row">
          <span>最后使用</span>
          <span className="last-used">{user.lastUsed}</span>
        </div>
      </div>

      <div className="user-actions">
        {user.status === 'APPROVED' ? (
          <button
            className="action-btn suspend"
            onClick={() => onStatusChange(user.id, 'DISABLED')}
            disabled={loading}
          >
            禁用
          </button>
        ) : (
          <button
            className="action-btn activate"
            onClick={() => onStatusChange(user.id, 'APPROVED')}
            disabled={loading}
          >
            启用
          </button>
        )}
      </div>
    </Card>
  )
}

export default UserCard
