import React from 'react'

interface StatisticsCardProps {
  title: string
  icon: string
  value: number
  description: string
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ title, icon, value, description }) => {
  // 格式化数值显示
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value

  // 判断是emoji还是svg路径
  const isSvgIcon = icon.endsWith('.svg')

  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ fontSize: '32px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px' }}>
        {isSvgIcon ? (
          <img 
            src={icon} 
            alt={title} 
            style={{ width: '80%', height: '80%', objectFit: 'contain' }}
          />
        ) : (
          icon
        )}
      </div>
      <div className="stat-content">
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#333' }}>{title}</h3>
        <p className="stat-value" style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
          {formattedValue}
        </p>
        <p className="stat-description" style={{ margin: '0', fontSize: '12px', color: '#666' }}>
          {description}
        </p>
      </div>
    </div>
  )
}

export default StatisticsCard
