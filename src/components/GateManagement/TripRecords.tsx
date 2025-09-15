import React, { useState } from 'react'

interface TripRecord {
  id: string
  userId: string
  cardNumber: string
  userName: string
  entryGateId: string
  exitGateId: string
  entryStation: string
  exitStation: string
  entryTime: string
  exitTime: string
  duration: string
  distance: number
  fare: number
  paymentMethod: 'mobile' | 'card' | 'cash'
  paymentStatus: 'success' | 'failed' | 'pending'
  createdTime: string
  updatedTime: string
}

interface TripRecordsProps {
  tripRecords: TripRecord[]
  filteredRecords: TripRecord[]
  currentPage: number
  totalPages: number
  pageSize: number
  searchTerm: string
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onResetFilters: () => void
  onExportRecords: () => void
}

const TripRecords: React.FC<TripRecordsProps> = ({
  tripRecords,
  filteredRecords,
  currentPage,
  totalPages,
  pageSize,
  searchTerm,
  onSearch,
  onPageChange,
  onPageSizeChange,
  onResetFilters,
  onExportRecords
}) => {
  const [showExportModal, setShowExportModal] = useState(false)

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'mobile':
        return '移动支付'
      case 'card':
        return '交通卡'
      case 'cash':
        return '现金'
      default:
        return method
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return '成功'
      case 'failed':
        return '失败'
      case 'pending':
        return '处理中'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="trip-records-section">
      <div className="section-header">
        <h3>出行记录</h3>
        <div className="header-actions">
          <input
            type="text"
            placeholder="搜索卡号、姓名、站点或日期"
            value={searchTerm}
            onChange={onSearch}
            className="search-input"
          />
          <button className="export-btn" onClick={onExportRecords}>
            导出记录
          </button>
        </div>
      </div>

      {/* 筛选条件 */}
      <div className="filter-section">
        <div className="filter-row">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="page-size-select"
          >
            <option value={5}>每页 5 条</option>
            <option value={10}>每页 10 条</option>
            <option value={20}>每页 20 条</option>
            <option value={50}>每页 50 条</option>
          </select>

          <button
            className="reset-filters-btn"
            onClick={onResetFilters}
            title="清除所有筛选条件"
          >
            重置筛选
          </button>
        </div>

        <div className="results-info">
          共找到 {filteredRecords.length} 条记录，按出行时间排序
        </div>
      </div>

      <div className="trip-records-table-wrapper">
        <table className="trip-records-table">
          <thead>
            <tr>
              <th>卡号</th>
              <th>姓名</th>
              <th>进站站点</th>
              <th>出站站点</th>
              <th>进站时间</th>
              <th>出站时间</th>
              <th>行程时长</th>
              <th>距离(km)</th>
              <th>费用(元)</th>
              <th>支付方式</th>
              <th>支付状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map(record => (
              <tr key={record.id} className="trip-record-row">
                <td className="record-card-number">{record.cardNumber}</td>
                <td className="record-user-name">{record.userName}</td>
                <td className="record-entry-station">{record.entryStation}</td>
                <td className="record-exit-station">{record.exitStation}</td>
                <td className="record-entry-time">{formatDate(record.entryTime)}</td>
                <td className="record-exit-time">{formatDate(record.exitTime)}</td>
                <td className="record-duration">{record.duration}</td>
                <td className="record-distance">{record.distance}</td>
                <td className="record-fare">{record.fare.toFixed(2)}</td>
                <td className={`record-payment-method ${record.paymentMethod}`}>
                  {getPaymentMethodText(record.paymentMethod)}
                </td>
                <td className={`record-payment-status ${record.paymentStatus}`}>
                  <span className="status-dot"></span>
                  {getPaymentStatusText(record.paymentStatus)}
                </td>
                <td className="record-actions">
                  <button
                    className="action-btn view"
                    title="查看详情"
                  >
                    查看
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            上一页
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            下一页
          </button>

          <span className="page-info">
            第 {currentPage} 页，共 {totalPages} 页
          </span>
        </div>
      )}

      {/* 导出成功提示 */}
      {showExportModal && (
        <div className="export-modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="export-modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>导出成功</h4>
            <p>出行记录已成功导出为CSV文件</p>
            <button className="confirm-btn" onClick={() => setShowExportModal(false)}>
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TripRecords
