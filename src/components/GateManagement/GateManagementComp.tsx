import React, { useState } from 'react'
import Modal from '../Common/Modal.tsx'

interface Gate {
  id: string
  code: string
  name: string
  stationId: string
  stationName: string
  line: string
  city: string
  type: 'entry' | 'exit' | 'both'
  location: string
  status: 'active' | 'inactive' | 'maintenance'
  lastCheckTime: string
  errorCount: number
  dailyPassCount: number
  createdTime: string
  lastUpdated: string
}

interface Station {
  id: string
  name: string
  line: string
  city: string
}

interface GateManagementProps {
  gates: Gate[]
  filteredGates: Gate[]
  stations: Station[]
  currentPage: number
  totalPages: number
  pageSize: number
  availableCities: string[]
  availableLines: string[]
  cityFilter: string
  lineFilter: string
  statusFilter: string
  typeFilter: string
  searchTerm: string
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCityFilterChange: (city: string) => void
  onLineFilterChange: (line: string) => void
  onStatusFilterChange: (status: string) => void
  onTypeFilterChange: (type: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onResetFilters: () => void
  onSaveGate: (gate: Partial<Gate>, isEdit: boolean) => void
  onDeleteGate: (gateId: string) => void
  onGetGateById: (gateId: string) => Gate | undefined
}

const GateManagement: React.FC<GateManagementProps> = ({
  gates,
  filteredGates,
  stations,
  currentPage,
  totalPages,
  pageSize,
  availableCities,
  availableLines,
  cityFilter,
  lineFilter,
  statusFilter,
  typeFilter,
  searchTerm,
  onSearch,
  onCityFilterChange,
  onLineFilterChange,
  onStatusFilterChange,
  onTypeFilterChange,
  onPageChange,
  onPageSizeChange,
  onResetFilters,
  onSaveGate,
  onDeleteGate,
  onGetGateById
}) => {
  const [showGateModal, setShowGateModal] = useState(false)
  const [editingGate, setEditingGate] = useState<Gate | null>(null)
  const [gateForm, setGateForm] = useState<Partial<Gate>>({
    code: '',
    name: '',
    stationId: '',
    type: 'both',
    location: '',
    status: 'active',
    stationName: '',
    line: '',
    city: ''
  })

  const handleGateEdit = (gate: Gate) => {
    setEditingGate(gate)
    setGateForm(gate)
    setShowGateModal(true)
  }

  const handleGateSave = () => {
    if (!gateForm.code || !gateForm.name || !gateForm.stationId) {
      alert('请填写必填字段（闸机编号、名称、所属站点）')
      return
    }

    // 获取站点信息
    const selectedStation = stations.find(s => s.id === gateForm.stationId)
    if (selectedStation) {
      setGateForm(prev => ({
        ...prev,
        stationName: selectedStation.name,
        line: selectedStation.line,
        city: selectedStation.city
      }))
    }

    onSaveGate(gateForm, !!editingGate)
    setShowGateModal(false)
    setEditingGate(null)
    setGateForm({
      code: '',
      name: '',
      stationId: '',
      type: 'both',
      location: '',
      status: 'active',
      stationName: '',
      line: '',
      city: ''
    })
  }

  const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stationId = e.target.value
    const station = stations.find(s => s.id === stationId)

    setGateForm(prev => ({
      ...prev,
      stationId,
      stationName: station?.name || '',
      line: station?.line || '',
      city: station?.city || ''
    }))
  }

  const handleCancel = () => {
    setShowGateModal(false)
    setEditingGate(null)
    setGateForm({
      code: '',
      name: '',
      stationId: '',
      type: 'both',
      location: '',
      status: 'active',
      stationName: '',
      line: '',
      city: ''
    })
  }

  const getGateTypeText = (type: string) => {
    switch (type) {
      case 'entry':
        return '进站'
      case 'exit':
        return '出站'
      case 'both':
        return '双向'
      default:
        return type
    }
  }

  const getGateStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '正常'
      case 'inactive':
        return '关闭'
      case 'maintenance':
        return '维护'
      default:
        return status
    }
  }

  return (
    <div className="gates-section">
      <div className="section-header">
        <h3>闸机管理</h3>
        <div className="header-actions">
          <input
            type="text"
            placeholder="搜索闸机编号、名称或所属站点"
            value={searchTerm}
            onChange={onSearch}
            className="search-input"
          />
          <button className="create-btn" onClick={() => setShowGateModal(true)}>
            + 添加闸机
          </button>
        </div>
      </div>

      {/* 筛选条件 */}
      <div className="filter-section">
        <div className="filter-row">
          <select
            value={cityFilter}
            onChange={(e) => onCityFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="">全部城市</option>
            {availableCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={lineFilter}
            onChange={(e) => onLineFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="">全部线路</option>
            {availableLines.map(line => (
              <option key={line} value={line}>{line}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="">全部状态</option>
            <option value="active">正常</option>
            <option value="inactive">关闭</option>
            <option value="maintenance">维护</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="">全部类型</option>
            <option value="entry">进站</option>
            <option value="exit">出站</option>
            <option value="both">双向</option>
          </select>

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
          共找到 {filteredGates.length} 个闸机，按闸机编号排序
        </div>
      </div>

      <div className="gates-table-wrapper">
        <table className="gates-table">
          <thead>
            <tr>
              <th>闸机编号</th>
              <th>闸机名称</th>
              <th>所属站点</th>
              <th>线路</th>
              <th>城市</th>
              <th>类型</th>
              <th>状态</th>
              <th>位置</th>
              <th>上次检测</th>
              <th>错误次数</th>
              <th>日通过率</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredGates.map(gate => (
              <tr key={gate.id} className="gate-row">
                <td className="gate-code">{gate.code}</td>
                <td className="gate-name">{gate.name}</td>
                <td className="gate-station">{gate.stationName}</td>
                <td className="gate-line">{gate.line}</td>
                <td className="gate-city">{gate.city}</td>
                <td className={`gate-type ${gate.type}`}>
                  {getGateTypeText(gate.type)}
                </td>
                <td className={`gate-status ${gate.status}`}>
                  <span className="status-dot"></span>
                  {getGateStatusText(gate.status)}
                </td>
                <td className="gate-location">{gate.location}</td>
                <td className="gate-check-time">
                  {gate.lastCheckTime ? gate.lastCheckTime : '暂无记录'}
                </td>
                <td className="gate-error-count">{gate.errorCount}</td>
                <td className="gate-pass-count">{gate.dailyPassCount}</td>
                <td className="gate-actions">
                  <button
                    className="action-btn edit"
                    onClick={() => handleGateEdit(gate)}
                    title="编辑"
                  >
                    编辑
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => onDeleteGate(gate.id)}
                    title="删除"
                  >
                    删除
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

      {/* 闸机模态框 */}
      {showGateModal && (
        <Modal
          isOpen={showGateModal}
          onClose={handleCancel}
          title={editingGate ? '编辑闸机' : '添加闸机'}
          className="gate-modal"
        >
          <div className="form-container">
            <div className="form-grid">
              <div className="form-group">
                <label>闸机编号 *</label>
                <input
                  type="text"
                  value={gateForm.code || ''}
                  onChange={(e) => setGateForm(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="请输入闸机编号"
                />
              </div>
              <div className="form-group">
                <label>闸机名称 *</label>
                <input
                  type="text"
                  value={gateForm.name || ''}
                  onChange={(e) => setGateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="请输入闸机名称"
                />
              </div>
              <div className="form-group">
                <label>所属站点 *</label>
                <select
                  value={gateForm.stationId || ''}
                  onChange={handleStationChange}
                >
                  <option value="">请选择站点</option>
                  {stations.map(station => (
                    <option key={station.id} value={station.id}>
                      {station.name} ({station.line})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>闸机类型</label>
                <select
                  value={gateForm.type || 'both'}
                  onChange={(e) => setGateForm(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <option value="entry">进站</option>
                  <option value="exit">出站</option>
                  <option value="both">双向</option>
                </select>
              </div>
              <div className="form-group">
                <label>状态</label>
                <select
                  value={gateForm.status || 'active'}
                  onChange={(e) => setGateForm(prev => ({ ...prev, status: e.target.value as any }))}
                >
                  <option value="active">正常</option>
                  <option value="inactive">关闭</option>
                  <option value="maintenance">维护</option>
                </select>
              </div>
              <div className="form-group">
                <label>物理位置</label>
                <input
                  type="text"
                  value={gateForm.location || ''}
                  onChange={(e) => setGateForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="请输入闸机物理位置"
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="cancel-btn" onClick={handleCancel}>
              取消
            </button>
            <button className="save-btn" onClick={handleGateSave}>
              {editingGate ? '保存修改' : '添加闸机'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default GateManagement
