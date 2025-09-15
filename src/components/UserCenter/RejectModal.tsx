import React, { useState } from 'react'

interface UserRegistration {
  id: string
  applicantName: string
  phone: string
  email: string
  idCard: string
  userType: 'regular' | 'student' | 'senior' | 'staff'
  applicationDate: string
  status: 'pending' | 'approved' | 'rejected'
  reviewDate?: string
  reviewer?: string
  rejectReason?: string
  documents: string[]
}

interface RejectModalProps {
  application: UserRegistration | null
  isOpen: boolean
  onClose: () => void
  onReject: (applicationId: string, reason: string) => void
  loading: boolean
}

const RejectModal: React.FC<RejectModalProps> = ({ application, isOpen, onClose, onReject, loading }) => {
  const [reason, setReason] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!reason.trim()) {
      setError('请输入拒绝原因')
      return
    }
    
    if (reason.trim().length < 5) {
      setError('拒绝原因至少需要5个字符')
      return
    }
    
    if (application) {
      onReject(application.id, reason.trim())
    }
  }

  const handleCancel = () => {
    setReason('')
    setError('')
    onClose()
  }

  if (!isOpen || !application) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>拒绝用户申请</h2>
          <button className="modal-close" onClick={handleCancel}>&times;</button>
        </div>
        
        <form className="reject-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>申请人</label>
            <input type="text" value={application.applicantName} disabled />
          </div>

          <div className="form-group">
            <label>用户类型</label>
            <input 
              type="text" 
              value={
                application.userType === 'regular' ? '普通用户' :
                application.userType === 'student' ? '学生' :
                application.userType === 'senior' ? '老年人' : '员工'
              }
              disabled 
            />
          </div>

          <div className="form-group">
            <label htmlFor="rejectReason">拒绝原因 <span className="required">*</span></label>
            <textarea
              id="rejectReason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError('')
              }}
              placeholder="请输入拒绝原因..."
              rows={4}
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>取消</button>
            <button type="submit" className="btn-reject" disabled={loading}>
              {loading ? '处理中...' : '确认拒绝'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RejectModal
