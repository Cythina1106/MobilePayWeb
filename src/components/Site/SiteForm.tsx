import React, { useState, useEffect } from 'react';

interface SiteFormData {
  site_name: string;
  site_code: string;
  site_address: string;
  contact_person: string;
  contact_phone: string;
  site_type: string;
  description: string;
  longitude: number;
  latitude: number;
  city: string;
  line_name: string;
  business_start_time: string;
  business_end_time: string;
}

interface SiteFormProps {
  initialData?: Partial<SiteFormData>;
  isEditing?: boolean;
  isLoading: boolean;
  onSubmit: (data: SiteFormData) => Promise<void>;
  onClose: () => void;
  cities: Array<{ cityCode: string; cityName: string }>;
}

const SiteForm: React.FC<SiteFormProps> = ({ 
  initialData, 
  isEditing = false, 
  isLoading, 
  onSubmit, 
  onClose, 
  cities 
}) => {
  const [formData, setFormData] = useState<SiteFormData>({
    site_name: '',
    site_code: '',
    site_address: '',
    contact_person: '',
    contact_phone: '',
    site_type: 'STATION',
    description: '',
    longitude: 0,
    latitude: 0,
    city: cities[0]?.cityName || '',
    line_name: '',
    business_start_time: '06:00',
    business_end_time: '22:00'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.site_name || !formData.site_code || !formData.site_address) {
      alert('请填写必填字段');
      return;
    }
    await onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{isEditing ? '✏️ 编辑站点' : '➕ 创建新站点'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>站点名称 *</label>
            <input
              type="text"
              name="site_name"
              value={formData.site_name}
              onChange={handleChange}
              placeholder="请输入站点名称"
              required
            />
          </div>

          <div className="form-group">
            <label>站点代码 *</label>
            <input
              type="text"
              name="site_code"
              value={formData.site_code}
              onChange={handleChange}
              placeholder="请输入站点代码"
              required
            />
          </div>

          <div className="form-group full-width">
            <label>站点地址 *</label>
            <input
              type="text"
              name="site_address"
              value={formData.site_address}
              onChange={handleChange}
              placeholder="请输入站点地址"
              required
            />
          </div>

          <div className="form-group">
            <label>联系人</label>
            <input
              type="text"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              placeholder="请输入联系人"
            />
          </div>

          <div className="form-group">
            <label>联系电话</label>
            <input
              type="text"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleChange}
              placeholder="请输入联系电话"
            />
          </div>

          <div className="form-group">
            <label>站点类型</label>
            <select
              name="site_type"
              value={formData.site_type}
              onChange={handleChange}
            >
              <option value="BRANCH">分支机构</option>
              <option value="HQ">总部</option>
              <option value="TERMINAL">终端</option>
              <option value="STATION">车站</option>
              <option value="DEPOT">车库</option>
              <option value="OFFICE">办公室</option>
            </select>
          </div>

          <div className="form-group">
            <label>线路名称</label>
            <input
              type="text"
              name="line_name"
              value={formData.line_name}
              onChange={handleChange}
              placeholder="请输入线路名称"
            />
          </div>

          <div className="form-group">
            <label>经度</label>
            <input
              type="number"
              step="0.000001"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="请输入经度"
            />
          </div>

          <div className="form-group">
            <label>纬度</label>
            <input
              type="number"
              step="0.000001"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="请输入纬度"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
              取消
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? '处理中...' : isEditing ? '更新站点' : '创建站点'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteForm;
