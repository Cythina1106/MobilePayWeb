// 仪表盘相关API
import {createApiWrapper} from "./api.ts";
import {ApiResponse} from "../types/common.ts";
import {DashboardStats} from "../types/stats.ts";
import {apiClient} from "../utils/apiClient.ts";
import {mockApi} from "./mockApi.ts";

export const dashboardApi = {
    // 获取仪表盘统计数据
    getStats: createApiWrapper(
        (): Promise<ApiResponse<DashboardStats>> => {
            console.log('📊 调用获取仪表板统计API: GET /dashboard/stats')
            return apiClient.get('/dashboard/stats', {}, true)
        },
        mockApi.dashboard.getStats
    ),

    // 获取实时数据
    getRealTimeData: (): Promise<ApiResponse<any>> => {
        console.log('⚡ 调用获取实时数据API: GET /dashboard/realtime')
        return apiClient.get('/dashboard/realtime', {}, true)
    },

    // 获取图表数据
    getChartData: (type: string, period: string): Promise<ApiResponse<any>> => {
        return apiClient.get('/dashboard/charts', { type, period })
    }
}
