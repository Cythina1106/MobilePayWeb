// 操作日志相关API
import {LogQuery, OperationLog} from "../types/log.ts";
import {ApiResponse, PageResponse} from "../types/common.ts";
import {apiClient} from "../utils/apiClient.ts";

export const logApi = {
    // 获取操作日志
    getLogs: (query: LogQuery): Promise<ApiResponse<PageResponse<OperationLog>>> => {
        return apiClient.get('/logs', query)
    },

    // 获取日志详情
    getLog: (id: string): Promise<ApiResponse<OperationLog>> => {
        console.log('📝 调用获取操作日志API: GET /logs/{id}', id)
        return apiClient.get(`/logs/${id}`, {}, true)
    },

    // 清理日志
    clearLogs: (beforeDate: string): Promise<ApiResponse<void>> => {
        return apiClient.delete('/logs', { beforeDate })
    }
}
