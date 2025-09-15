import React from 'react';
import '../../styles/SiteManagement.css';

interface City {
  cityCode: string;
  cityName: string;
}

interface SiteFiltersProps {
  selectedCity: string;
  status: string;
  siteType: string;
  keyword: string;
  cities: City[];
  loading: boolean;
  sitesLoading: boolean;
  onCitySelect: (cityCode: string) => void;
  onQueryChange: (field: string, value: string) => void;
  onSearch: () => void;
  onRefreshList: () => void;
  onRefreshCities: () => void;
  onOpenCreateModal: () => void;
}

/**
 * 站点管理筛选组件
 * 封装城市选择、状态筛选、类型筛选和搜索功能
 */
const SiteFilters: React.FC<SiteFiltersProps> = ({ 
  selectedCity, 
  status, 
  siteType, 
  keyword, 
  cities, 
  loading, 
  sitesLoading, 
  onCitySelect, 
  onQueryChange, 
  onSearch, 
  onRefreshList, 
  onRefreshCities, 
  onOpenCreateModal 
}) => {
  return (
    <div className="site-controls">
      <div className="controls-row">
        <div className="control-group">
          <label>选择城市</label>
          <select
            value={selectedCity}
            onChange={(e) => onCitySelect(e.target.value)}
            disabled={loading}
          >
            <option value="">请选择城市...</option>
            {cities.map((city) => (
              <option key={city.cityCode} value={city.cityCode}>
                {city.cityName} ({city.cityCode})
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>站点状态</label>
          <select
            value={status}
            onChange={(e) => onQueryChange('status', e.target.value)}
          >
            <option value="">全部状态</option>
            <option value="ACTIVE">正常运营</option>
            <option value="INACTIVE">停止运营</option>
            <option value="MAINTENANCE">维护中</option>
            <option value="CONSTRUCTION">建设中</option>
          </select>
        </div>

        <div className="control-group">
          <label>站点类型</label>
          <select
            value={siteType}
            onChange={(e) => onQueryChange('site_type', e.target.value)}
          >
            <option value="">全部类型</option>
            <option value="BRANCH">分支机构</option>
            <option value="HQ">总部</option>
            <option value="TERMINAL">终端</option>
            <option value="STATION">车站</option>
            <option value="DEPOT">车库</option>
            <option value="OFFICE">办公室</option>
          </select>
        </div>

        <div className="search-group">
          <input
            type="text"
            className="search-input"
            placeholder="搜索站点名称或代码..."
            value={keyword}
            onChange={(e) => onQueryChange('keyword', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          />
          <button
            className="btn btn-primary"
            onClick={onSearch}
            disabled={sitesLoading}
          >
            🔍 搜索
          </button>
        </div>
      </div>

      <div className="controls-row">
        <button
          className="btn btn-success"
          onClick={onOpenCreateModal}
          disabled={!selectedCity}
        >
          ➕ 新建站点
        </button>

        <button
          className="btn btn-secondary"
          onClick={onRefreshList}
          disabled={sitesLoading}
        >
          {sitesLoading ? '刷新中...' : '🔄 刷新列表'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={onRefreshCities}
          disabled={loading}
        >
          {loading ? '加载中...' : '🏙️ 刷新城市'}
        </button>
      </div>
    </div>
  );
};

export default SiteFilters;