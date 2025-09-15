// 统计报表相关API
import {ApiResponse} from "../types/common.ts";
import {apiClient} from "../utils/apiClient.ts";

export const reportApi = {
    // 获取交易报表
    getTransactionReport: (params: {
        startTime: string
        endTime: string
        groupBy: 'day' | 'week' | 'month'
        type?: string
    }): Promise<ApiResponse<any>> => {
        return apiClient.get('/reports/transactions', params)
    },

    // 获取用户报表
    getUserReport: (params: {
        startTime: string
        endTime: string
        groupBy: 'day' | 'week' | 'month'
    }): Promise<ApiResponse<any>> => {
        return apiClient.get('/reports/users', params)
    },

    // 获取收入报表
    getRevenueReport: (params: {
        startTime: string
        endTime: string
        groupBy: 'day' | 'week' | 'month'
    }): Promise<ApiResponse<any>> => {
        return apiClient.get('/reports/revenue', params)
    }
}
