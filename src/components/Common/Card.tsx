import React from 'react';
import '../../styles/CardDemo.css';

interface CardProps {
  /** 卡片变体样式 */
  variant?: 'default' | 'analytics' | 'method' | 'chart' | 'settings' | 'user' | 'balance' | 'bankCard' | 'role';
  /** 自定义边框圆角 */
  borderRadius?: number;
  /** 自定义内边距 */
  padding?: string;
  /** 是否显示阴影 */
  shadow?: boolean;
  /** 边框样式 */
  border?: string;
  /** 悬停效果 */
  hoverEffect?: 'lift' | 'shadow' | 'none';
  /** 卡片内容 */
  children: React.ReactNode;
  /** 额外CSS类名 */
  className?: string;
}

/**
 * 通用卡片组件
 * 支持多种样式变体和自定义属性
 */
const Card: React.FC<CardProps> = ({
  variant = 'default',
  borderRadius,
  padding,
  shadow = true,
  border = '1px solid #e2e8f0',
  hoverEffect = 'lift',
  children,
  className = ''
}) => {
  // 根据变体设置默认样式
  const baseStyles: React.CSSProperties = {};

  switch (variant) {
    case 'analytics':
      baseStyles.borderRadius = borderRadius || 12;
      baseStyles.padding = padding || '20px';
      baseStyles.boxShadow = shadow ? '0 2px 8px rgba(0,0,0,0.1)' : 'none';
      break;
    case 'method':
      baseStyles.borderRadius = borderRadius || 16;
      baseStyles.padding = padding || '24px';
      baseStyles.boxShadow = shadow ? '0 4px 12px rgba(0, 0, 0, 0.08)' : 'none';
      break;
    case 'chart':
      baseStyles.borderRadius = borderRadius || 12;
      baseStyles.padding = padding || '1.5rem';
      baseStyles.boxShadow = shadow ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none';
      break;
    default:
      baseStyles.borderRadius = borderRadius || 8;
      baseStyles.padding = padding || '16px';
      baseStyles.boxShadow = shadow ? '0 1px 3px rgba(0,0,0,0.1)' : 'none';
  }

  // 应用自定义样式覆盖
  if (borderRadius) baseStyles.borderRadius = borderRadius;
  if (padding) baseStyles.padding = padding;
  if (!shadow) baseStyles.boxShadow = 'none';

  return (
    <div
      className={`common-card variant-${variant} hover-${hoverEffect} ${className}`}
      style={{
        backgroundColor: 'white',
        border,
        ...baseStyles
      }}
    >
      {children}
    </div>
  );
};

export default Card;
