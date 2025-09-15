import React, { useEffect } from 'react'
import { Station, RegionData } from '../../../types/gate'

interface StationFormProps {
  station: Partial<Station> | null
  editingStation: Station | null
  regionData: RegionData
  onSave: (stationData: Partial<Station>) => void
  onCancel: () => void
}

const StationForm: React.FC<StationFormProps> = ({ 
  station, 
  editingStation, 
  regionData, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = React.useState<Partial<Station>>({ 
    ...station 
  })
  const [cities, setCities] = React.useState<string[]>([])
  const [districts, setDistricts] = React.useState<string[]>([])

  useEffect(() => {
    // 当初始数据变化时更新表单数据
    setFormData({ ...station })
  }, [station])

  useEffect(() => {
    // 当省份变化时，更新城市列表
    if (formData.province && regionData[formData.province]) {
      setCities(Object.keys(regionData[formData.province]))
      // 重置城市和区域
      setFormData(prev => ({ ...prev, city: '', district: '' }))
    }
  }, [formData.province, regionData])

  useEffect(() => {
    // 当城市变化时，更新区域列表
    if (formData.province && formData.city && regionData[formData.province]?.[formData.city]) {
      setDistricts(regionData[formData.province][formData.city])
      // 重置区域
      setFormData(prev => ({ ...prev, district: '' }))
    }
  }, [formData.province, formData.city, regionData])

  const handleInputChange = (field: keyof Station, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  const handleCancel = () => {
    onCancel()
  }

  return (
    <div className="station-form">
      <div className="form-group">
        <label htmlFor="stationName">站点名称 <span className="required">*</span></label>
        <input
          id="stationName"
          type="text"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="请输入站点名称"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="stationCode">站点编码 <span className="required">*</span></label>
        <input
          id="stationCode"
          type="text"
          value={formData.code || ''}
          onChange={(e) => handleInputChange('code', e.target.value)}
          placeholder="请输入站点编码"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="stationLine">所属线路 <span className="required">*</span></label>
        <input
          id="stationLine"
          type="text"
          value={formData.line || ''}
          onChange={(e) => handleInputChange('line', e.target.value)}
          placeholder="请输入所属线路"
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="province">省份 <span className="required">*</span></label>
          <select
            id="province"
            value={formData.province || ''}
            onChange={(e) => handleInputChange('province', e.target.value)}
          >
            <option value="">请选择省份</option>
            {Object.keys(regionData).map(province => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="city">城市 <span className="required">*</span></label>
          <select
            id="city"
            value={formData.city || ''}
            onChange={(e) => handleInputChange('city', e.target.value)}
            disabled={!formData.province}
          >
            <option value="">请选择城市</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="district">区域 <span className="required">*</span></label>
          <select
            id="district"
            value={formData.district || ''}
            onChange={(e) => handleInputChange('district', e.target.value)}
            disabled={!formData.city}
          >
            <option value="">请选择区域</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="address">详细地址</label>
        <input
          id="address"
          type="text"
          value={formData.address || ''}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="请输入详细地址"
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="openTime">开放时间</label>
          <input
            id="openTime"
            type="time"
            value={formData.openTime || ''}
            onChange={(e) => handleInputChange('openTime', e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="closeTime">关闭时间</label>
          <input
            id="closeTime"
            type="time"
            value={formData.closeTime || ''}
            onChange={(e) => handleInputChange('closeTime', e.target.value)}
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="status">状态</label>
        <select
          id="status"
          value={formData.status || 'active'}
          onChange={(e) => handleInputChange('status', e.target.value)}
        >
          <option value="active">正常运行</option>
          <option value="maintenance">维护中</option>
          <option value="closed">已关闭</option>
        </select>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-primary" onClick={handleSave}>
          {editingStation ? '更新' : '添加'}
        </button>
        <button type="button" className="btn-secondary" onClick={handleCancel}>
          取消
        </button>
      </div>
    </div>
  )
}

export default StationForm