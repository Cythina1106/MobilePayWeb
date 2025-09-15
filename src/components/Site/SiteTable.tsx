import React from 'react';

interface Site {
  site_id: string;
  site_name: string;
  site_code: string;
  site_address: string;
  city: string;
  line_name: string;
  type_name?: string;
  site_type_name?: string;
  status?: string;
  status_name?: string;
}

interface SiteTableProps {
  sites: Site[];
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetail: (id: string) => void;
  onEdit: (site: Site) => void;
  onDelete: (site: Site) => void;
}

const SiteTable: React.FC<SiteTableProps> = ({ 
  sites, 
  isLoading, 
  totalCount, 
  currentPage, 
  totalPages, 
  onPageChange, 
  onViewDetail, 
  onEdit, 
  onDelete 
}) => {
  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div>⏳ 加载站点数据中...</div>
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🏢</div>
        <div style={{ fontSize: '18px', marginBottom: '8px' }}>暂无站点数据</div>
        <div style={{ fontSize: '14px' }}>请先选择城市或创建新站点</div>
      </div>
    );
  }

  return (
    <div className="sites-table-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ margin: '0', color: '#333', fontSize: '1.5em' }}>
          📍 站点列表
        </h2>
        <div className="pagination-info">
          共 {totalCount} 个站点，第 {currentPage} / {totalPages} 页
        </div>
      </div>

      <table className="sites-table">
        <thead>
          <tr>
            <th>站点名称</th>
            <th>站点代码</th>
            <th>地址</th>
            <th>城市</th>
            <th>线路</th>
            <th>类型</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <tr key={site.site_id}>
              <td>
                <strong>{site.site_name}</strong>
              </td>
              <td>
                <code>{site.site_code}</code>
              </td>
              <td title={site.site_address}>
                {site.site_address && site.site_address.length > 30 ?
                  `${site.site_address.substring(0, 30)}...` :
                  site.site_address || '-'}
              </td>
              <td>{site.city}</td>
              <td>{site.line_name || '-'}</td>
              <td>
                <span className="site-type-badge">
                  {site.type_name || site.site_type_name || '未知类型'}
                </span>
              </td>
              <td>
                <span className={`status-badge status-${site.status?.toLowerCase()}`}>
                  {site.status_name || site.status}
                </span>
              </td>
              <td>
                <div className="actions-cell">
                  <button
                    className="btn btn-primary"
                    onClick={() => onViewDetail(site.site_id.toString())}
                    title="查看详情"
                  >
                    👁️
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => onEdit(site)}
                    title="编辑站点"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => onDelete(site)}
                    title="删除站点"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            ⬅️ 上一页
          </button>

          <span className="pagination-info">
            第 {currentPage} / {totalPages} 页
          </span>

          <button
            className="btn btn-secondary"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            下一页 ➡️
          </button>
        </div>
      )}
    </div>
  );
};

export default SiteTable;
