import React from 'react';
import Card from './Card.tsx';
import '../../styles/TransactionList.css';

interface TransactionStatsCardProps {
  label: string;
  value: string | number;
  status?: 'success' | 'failed' | 'pending';
}

/**
 * 交易统计卡片组件
 * 用于展示交易相关的统计数据卡片
 */
const TransactionStatsCard: React.FC<TransactionStatsCardProps> = ({ label, value, status }) => {
  const statusClass = status ? `stat-value ${status}` : 'stat-value';

  return (
    <Card variant="analytics" className="stat-item">
      <span className="stat-label">{label}</span>
      <span className={statusClass}>{value}</span>
    </Card>
  );
};

export default TransactionStatsCard;