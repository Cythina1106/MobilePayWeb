import React, { useEffect } from 'react'
import { Gate, Station } from '../../../types/gate'

interface GateFormProps {
  gate: Partial<Gate> | null
  editingGate: Gate | null
  stations: Station[]
  onSave: (gateData: Partial<Gate>) => void
  onCancel: () => void
}

const GateForm: React.FC<GateFormProps> = ({ 
  gate, 
  editingGate, 
  stations, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = React.useState<Partial<Gate>>({ 
    ...gate 
  })

  useEffect(() => {
    setFormData({ ...gate })
  }, [gate])

  const handleInputChange = (field: keyof Gate, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  const handleCancel = () => {
    onCancel()
  }

  return (
    <div className="gate-form">
      <div className="form-group">
        <label htmlFor="stationId">所属站点 <span className="required">*</span></label>
        <select
          id="stationId"
          value={formData.stationId || ''}
          onChange={(e) => handleInputChange('stationId', e.target.value)}
        >
          <option value="">请选择站点</option>
          {stations.map(station => (
            <option key={station.id} value={station.id}>{station.name}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="gateNumber">闸机编号 <span className="required">*</span></label>
        <input
          id="gateNumber"
          type="text"
          value={formData.gateNumber || ''}
          onChange={(e) => handleInputChange('gateNumber', e.target.value)}
          placeholder="请输入闸机编号"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="position">位置 <span className="required">*</span></label>
        <input
          id="position"
          type="text"
          value={formData.position || ''}
          onChange={(e) => handleInputChange('position', e.target.value)}
          placeholder="请输入闸机位置"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="type">类型</label>
        <select
          id="type"
          value={formData.type || 'entry'}
          onChange={(e) => handleInputChange('type', e.target.value)}
        >
          <option value="entry">进站闸机</option>
          <option value="exit">出站闸机</option>
          <option value="bidirectional">双向闸机</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="model">型号</label>
        <input
          id="model"
          type="text"
          value={formData.model || ''}
          onChange={(e) => handleInputChange('model', e.target.value)}
          placeholder="请输入闸机型号"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="serialNumber">序列号</label>
        <input
          id="serialNumber"
          type="text"
          value={formData.serialNumber || ''}
          onChange={(e) => handleInputChange('serialNumber', e.target.value)}
          placeholder="请输入序列号"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="status">状态</label>
        <select
          id="status"
          value={formData.status || 'online'}
          onChange={(e) => handleInputChange('status', e.target.value)}
        >
          <option value="online">在线</option>
          <option value="offline">离线</option>
          <option value="maintenance">维护中</option>
          <option value="error">故障</option>
        </select>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-primary" onClick={handleSave}>
          {editingGate ? '更新' : '添加'}
        </button>
        <button type="button" className="btn-secondary" onClick={handleCancel}>
          取消
        </button>
      </div>
    </div>
  )
}

export default GateForm