// 交易相关API
import {Transaction, TransactionQuery} from "../types/transaction.ts";
import {ApiResponse, PageResponse} from "../types/common.ts";
import {apiClient} from "../utils/apiClient.ts";

export const transactionApi = {
    // 获取交易列表
    getTransactions: (query: TransactionQuery): Promise<ApiResponse<PageResponse<Transaction>>> => {
        return apiClient.get('/transactions', query)
    },

    // 获取交易详情
    getTransaction: (id: string): Promise<ApiResponse<Transaction>> => {
        console.log('💳 调用获取交易详情API: GET /transactions/{id}', id)
        return apiClient.get(`/transactions/${id}`, {}, true)
    },

    // 创建交易
    createTransaction: (data: Partial<Transaction>): Promise<ApiResponse<Transaction>> => {
        return apiClient.post('/transactions', data)
    },

    // 更新交易状态
    updateTransactionStatus: (id: string, status: string, remark?: string): Promise<ApiResponse<void>> => {
        return apiClient.put(`/transactions/${id}/status`, { status, remark })
    },

    // 交易退款
    refundTransaction: (id: string, amount: number, reason: string): Promise<ApiResponse<void>> => {
        return apiClient.post(`/transactions/${id}/refund`, { amount, reason })
    },

    // 导出交易记录
    exportTransactions: (query: TransactionQuery): Promise<ApiResponse<{ downloadUrl: string }>> => {
        return apiClient.post('/transactions/export', query)
    },

    // 获取交易统计
    getTransactionStats: (startTime?: string, endTime?: string): Promise<ApiResponse<any>> => {
        return apiClient.get('/transactions/stats', { startTime, endTime })
    }
}
