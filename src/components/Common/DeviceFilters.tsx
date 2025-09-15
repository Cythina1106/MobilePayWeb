import React from 'react';
import '../../styles/DeviceManagement.css';

interface Site {
  id: string;
  site_name: string;
}

interface DeviceFiltersProps {
  keyword: string;
  siteId: string;
  status: string;
  sites: Site[];
  onSearch: (keyword: string) => void;
  onSiteFilter: (siteId: string) => void;
  onStatusFilter: (status: string) => void;
}

/**
 * 设备管理筛选组件
 * 封装搜索框、站点筛选和状态筛选功能
 */
const DeviceFilters: React.FC<DeviceFiltersProps> = ({ 
  keyword, 
  siteId, 
  status, 
  sites, 
  onSearch, 
  onSiteFilter, 
  onStatusFilter 
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 搜索框 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            搜索设备
          </label>
          <input
            type="text"
            placeholder="设备名称、编码或描述"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={keyword}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* 站点筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            站点
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={siteId}
            onChange={(e) => onSiteFilter(e.target.value)}
          >
            <option value="">所有站点</option>
            {sites.map(site => (
              <option key={site.id} value={site.id}>{site.site_name}</option>
            ))}
          </select>
        </div>

        {/* 状态筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            状态
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={status}
            onChange={(e) => onStatusFilter(e.target.value)}
          >
            <option value="">所有状态</option>
            <option value="online">在线</option>
            <option value="offline">离线</option>
            <option value="maintenance">维护中</option>
            <option value="error">错误</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DeviceFilters;