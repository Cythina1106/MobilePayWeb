import React from 'react'

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

interface ApplicationCardProps {
  application: UserRegistration
  onApprove: (applicationId: string) => void
  onReject: (application: UserRegistration) => void
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onApprove, onReject }) => {
  return (
    <div key={application.id} className="application-card">
      <div className="application-header">
        <div className="applicant-info">
          <h4>{application.applicantName}</h4>
          <p>{application.phone} • {application.email}</p>
        </div>
        <div className={`application-status ${application.status}`}>
          <span className="status-dot"></span>
          {application.status === 'pending' ? '待审核' :
           application.status === 'approved' ? '已通过' : '已拒绝'}
        </div>
      </div>

      <div className="application-details">
        <div className="detail-row">
          <span>申请日期</span>
          <span>{application.applicationDate}</span>
        </div>
        <div className="detail-row">
          <span>用户类型</span>
          <span className={`user-type ${application.userType}`}>
            {application.userType === 'regular' ? '普通用户' :
             application.userType === 'student' ? '学生' :
             application.userType === 'senior' ? '老年人' : '员工'}
          </span>
        </div>
        <div className="detail-row">
          <span>身份证号</span>
          <span className="id-card">{application.idCard}</span>
        </div>
        <div className="detail-row">
          <span>附件</span>
          <span className="documents">{application.documents.join('、')}</span>
        </div>
        {application.reviewDate && (
          <div className="detail-row">
            <span>审核时间</span>
            <span>{application.reviewDate} • {application.reviewer}</span>
          </div>
        )}
        {application.rejectReason && (
          <div className="detail-row">
            <span>拒绝原因</span>
            <span className="reject-reason">{application.rejectReason}</span>
          </div>
        )}
      </div>

      {application.status === 'pending' && (
        <div className="application-actions">
          <button
            className="action-btn approve"
            onClick={() => onApprove(application.id)}
          >
            通过
          </button>
          <button
            className="action-btn reject"
            onClick={() => onReject(application)}
          >
            拒绝
          </button>
        </div>
      )}
    </div>
  )
}

export default ApplicationCard
