import React from 'react';
import Card from './Card.tsx';
import '../../styles/Dashboard.css';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
}

/**
 * 统计数据卡片组件
 * 用于展示关键指标的卡片，包含标题、数值、变化率和图标
 */
const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => {
  return (
    <Card variant="analytics" className="stat-card">
      <img src={`/${icon}`} alt={title} width={80} height={80} />
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
        <span className={`change ${change.startsWith('+') ? 'positive' : 'negative'}`}>
          {change}
        </span>
      </div>
    </Card>
  );
};

export default StatCard;