// 系统配置相关API
import {ApiResponse} from "../types/common.ts";
import {SystemConfig, UpdateConfigRequest} from "../types/system.ts";
import {apiClient} from "../utils/apiClient.ts";

export const configApi = {
    // 获取系统配置
    getConfigs: (category?: string): Promise<ApiResponse<SystemConfig[]>> => {
        return apiClient.get('/configs', { category })
    },

    // 更新系统配置
    updateConfigs: (data: UpdateConfigRequest): Promise<ApiResponse<void>> => {
        return apiClient.put('/configs', data)
    },

    // 获取单个配置
    getConfig: (key: string): Promise<ApiResponse<SystemConfig>> => {
        console.log('⚙️ 调用获取系统配置API: GET /configs/{key}', key)
        return apiClient.get(`/configs/${key}`, {}, true)
    },

    // 重置配置到默认值
    resetConfig: (key: string): Promise<ApiResponse<void>> => {
        console.log('🔄 调用重置系统配置API: POST /configs/{key}/reset', key)
        return apiClient.post(`/configs/${key}/reset`, {}, true)
    }
}
