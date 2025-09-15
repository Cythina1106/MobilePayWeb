import React from 'react';
import '../../styles/TransactionList.css';

interface TransactionFiltersProps {
  searchTerm: string;
  statusFilter: string;
  dateFilter: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onExport: () => void;
}

/**
 * 交易列表筛选组件
 * 封装搜索框、状态筛选器、日期筛选器和导出按钮
 */
const TransactionFilters: React.FC<TransactionFiltersProps> = ({ 
  searchTerm, 
  statusFilter, 
  dateFilter, 
  onSearchChange, 
  onStatusChange, 
  onDateChange, 
  onExport 
}) => {
  return (
    <div className="filters-section">
      <div className="search-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索用户名、交易ID或订单号..."
            value={searchTerm}
            onChange={onSearchChange}
          />
          <span className="search-icon">🔍</span>
        </div>

        <select
          value={statusFilter}
          onChange={onStatusChange}
          className="filter-select"
        >
          <option value="all">所有状态</option>
          <option value="成功">成功</option>
          <option value="失败">失败</option>
          <option value="处理中">处理中</option>
          <option value="已退款">已退款</option>
        </select>

        <select
          value={dateFilter}
          onChange={onDateChange}
          className="filter-select"
        >
          <option value="today">今天</option>
          <option value="week">本周</option>
          <option value="month">本月</option>
          <option value="custom">自定义</option>
        </select>
      </div>

      <button className="export-btn" onClick={onExport}>
        📊 导出报表
      </button>
    </div>
  );
};

export default TransactionFilters;