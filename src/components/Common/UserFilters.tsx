import React from 'react';
import '../../styles/UserManagement.css';

interface UserFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddUser: () => void;
}

/**
 * 用户管理筛选组件
 * 封装搜索框、状态筛选和添加用户按钮
 */
const UserFilters: React.FC<UserFiltersProps> = ({ 
  searchTerm, 
  statusFilter, 
  onSearchChange, 
  onStatusChange, 
  onAddUser 
}) => {
  return (
    <div className="user-filters">
      <div className="search-box">
        <input
          type="text"
          placeholder="搜索用户名、邮箱或手机号..."
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
        <option value="正常">正常</option>
        <option value="冻结">冻结</option>
        <option value="待审核">待审核</option>
      </select>

      <button className="add-user-btn" onClick={onAddUser}>+ 添加用户</button>
    </div>
  );
};

export default UserFilters;