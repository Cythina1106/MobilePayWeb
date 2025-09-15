import React from 'react';
import { Transaction } from '../../types/api.ts';

interface TransactionRowProps {
  transaction: Transaction;
  onRefund: (transactionId: string) => void;
  onViewDetails: (transaction: Transaction) => void;
}

/**
 * 交易列表行组件
 * 用于展示单个交易记录的表格行
 */
const TransactionRow: React.FC<TransactionRowProps> = ({ transaction, onRefund, onViewDetails }) => {
  return (
    <tr key={transaction.id} className="transaction-row">
      <td className="transaction-id">{transaction.id}</td>
      <td className="order-id">{transaction.orderNo}</td>
      <td className="user-name">{transaction.userName}</td>
      <td className="amount">{transaction.amount}</td>
      <td className="payment-method">{transaction.paymentMethod}</td>
      <td className={`status ${transaction.status}`}>{transaction.status}</td>
      <td className="transaction-time">{transaction.createTime}</td>
      <td className="description">{transaction.description}</td>
      <td className="actions">
        <button 
          className="action-btn view-btn"
          onClick={() => onViewDetails(transaction)}
        >
          详情
        </button>
        {transaction.status === 'success' && (
          <button 
            className="action-btn refund-btn"
            onClick={() => onRefund(transaction.id)}
          >
            退款
          </button>
        )}
      </td>
    </tr>
  );
};

export default TransactionRow;
