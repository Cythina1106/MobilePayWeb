// 交易相关类型
 export interface Transaction {
  id: string
  orderNo: string
  userId: string
  userName: string
  userPhone?: string
  amount: number
  paymentMethod: 'balance' | 'bank_card' | 'alipay' | 'wechat'
  paymentChannel?: string
  status: 'pending' | 'success' | 'failed' | 'cancelled' | 'refunded'
  type: 'payment' | 'refund' | 'transfer'
  description?: string
  merchantId?: string
  merchantName?: string
  createTime: string
  updateTime: string
  completeTime?: string
  remark?: string
  refundAmount?: number
  refundReason?: string
}

export interface TransactionQuery {
  pageNum?: number
  pageSize?: number
  orderNo?: string
  userId?: string
  userName?: string
  status?: string
  paymentMethod?: string
  type?: string
  startTime?: string
  endTime?: string
  minAmount?: number
  maxAmount?: number
}
