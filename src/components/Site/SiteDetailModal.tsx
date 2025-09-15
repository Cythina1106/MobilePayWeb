import React from 'react';

interface SiteDetail {
  site_id: string;
  site_name?: string;
  name?: string;
  site_code: string;
  address: string;
  city: string;
  line_name?: string;
  site_type?: string;
  status?: string;
  longitude: number;
  latitude: number;
  operatingHours?: { open: string; close: string };
  capacity?: string;
  facilities?: string[];
  description?: string;
}

interface SiteDetailModalProps {
  isOpen: boolean;
  site: SiteDetail | null;
  onClose: () => void;
}

const SiteDetailModal: React.FC<SiteDetailModalProps> = ({ isOpen, site, onClose }) => {
  if (!isOpen || !site) return null;

  const getSiteTypeName = (type?: string) => {
    switch (type) {
      case 'BRANCH': return '分支机构';
      case 'HQ': return '总部';
      case 'TERMINAL': return '终端';
      case 'STATION': return '车站';
      case 'DEPOT': return '车库';
      case 'OFFICE': return '办公室';
      default: return type || '其他';
    }
  };

  const getStatusName = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return '活跃';
      case 'inactive': return '非活跃';
      case 'maintenance': return '维护中';
      case 'construction': return '建设中';
      default: return status;
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">👁️ 站点详情</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <div className="detail-label">站点名称</div>
            <div className="detail-value">{site.site_name || site.name}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">站点代码</div>
            <div className="detail-value">
              <code>{site.site_code}</code>
            </div>
          </div>

          <div className="detail-item full-width">
            <div className="detail-label">站点地址</div>
            <div className="detail-value">{site.address}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">城市</div>
            <div className="detail-value">{site.city}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">线路名称</div>
            <div className="detail-value">{site.line_name || '-'}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">站点类型</div>
            <div className="detail-value">
              <span className="site-type-badge">
                {getSiteTypeName(site.site_type)}
              </span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-label">状态</div>
            <div className="detail-value">
              <span className={`status-badge status-${site.status?.toLowerCase()}`}>
                {getStatusName(site.status)}
              </span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-label">经度</div>
            <div className="detail-value">{site.longitude}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">纬度</div>
            <div className="detail-value">{site.latitude}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">营业时间</div>
            <div className="detail-value">
              {site.operatingHours ?
                `${site.operatingHours.open} - ${site.operatingHours.close}` :
                '-'}
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-label">容量</div>
            <div className="detail-value">{site.capacity || '-'}</div>
          </div>

          {site.facilities && site.facilities.length > 0 && (
            <div className="detail-item full-width">
              <div className="detail-label">设施</div>
              <div className="detail-value">
                {site.facilities.join(', ')}
              </div>
            </div>
          )}

          {site.description && (
            <div className="detail-item full-width">
              <div className="detail-label">描述</div>
              <div className="detail-value">{site.description}</div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteDetailModal;
