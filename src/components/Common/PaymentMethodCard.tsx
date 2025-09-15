import React from 'react';
import Card from './Card.tsx';
import '../../styles/PaymentMethods.css';

interface PaymentMethod {
  id: string;
  type: 'balance' | 'bankCard';
  name: string;
  balance?: number;
  cardNumber?: string;
  isDefault: boolean;
  isActive: boolean;
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onSetDefault: (id: string) => void;
  onToggleActive: (id: string) => void;
}

/**
 * 支付方式卡片组件
 * 封装单个支付方式的展示和操作功能
 */
const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ 
  method, 
  onSetDefault, 
  onToggleActive 
}) => {
  return (
    <Card key={method.id} variant={method.type} className="method-card">
      <div className="method-header">
        <div className="method-info">
          <h4>{method.name}</h4>
          {method.type === 'balance' && (
            <p className="balance">¥{method.balance?.toFixed(2)}</p>
          )}
          {method.type === 'bankCard' && (
            <p className="card-info">{method.cardNumber}</p>
          )}
        </div>
        <div className="method-actions">
          <button
            className={method.isDefault ? 'default-btn active' : 'default-btn'}
            onClick={() => onSetDefault(method.id)}
            disabled={method.isDefault}
          >
            {method.isDefault ? '默认' : '设为默认'}
          </button>
          <button
            className={method.isActive ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => onToggleActive(method.id)}
          >
            {method.isActive ? '启用' : '禁用'}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default PaymentMethodCard;