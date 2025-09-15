// 折扣策略相关API - 强制使用真实API
import {ApiResponse, PageResponse} from "../types/common.ts";
import {
    City,
    CreateDiscountStrategyRequest,
    DiscountStrategy,
    DiscountStrategyQuery,
    UpdateDiscountStrategyRequest
} from "../types/discount.ts";
import {apiClient} from "../utils/apiClient.ts";
import {createApiWrapper, siteApi} from "./api.ts";
import {mockApi} from "./mockApi.ts";

export const discountApi = {
    // 获取折扣策略详情 - GET /discounts/{id}
    getStrategy: (id: string): Promise<ApiResponse<DiscountStrategy>> => {
        console.log('💰 调用获取折扣策略详情API: GET /discounts/' + id)
        return apiClient.get(`/discounts/${id}`, {}, true)
    },

    // 分页获取折扣策略列表 - GET /discounts
    getStrategies: (query: DiscountStrategyQuery): Promise<ApiResponse<PageResponse<DiscountStrategy>>> => {
        console.log('📋 调用分页获取折扣策略列表API: GET /discounts', query)

        // 只传递必要的筛选参数
        const params: any = {}

        // 基础分页参数
        if (query.pageNum) params.pageNum = query.pageNum
        if (query.pageSize) params.pageSize = query.pageSize

        // 主要筛选参数 - 使用驼峰格式
        // if (query.targetCity) params.targetCity = query.targetCity // 城市
        if (query.keyword) params.keyword = query.keyword // 关键词
        if (query.status) params.status = query.status // 状态
        if (query.strategyType) params.strategyType = query.strategyType // 类型
        if (query.discountType) params.discountType = query.discountType // 折扣类型

        // 使用GET方法，需要认证
        return apiClient.get('/discounts', params, true)
    },

    // 创建折扣策略 - POST /discounts
    createStrategy: (data: CreateDiscountStrategyRequest): Promise<ApiResponse<DiscountStrategy>> => {
        console.log('➕ 调用创建折扣策略API: POST /discounts', data)

        // 直接发送驼峰格式的数据
        return apiClient.post('/discounts', data, true)
    },

    // 更新折扣策略 - PUT /discounts/{id}
    updateStrategy: (id: string, data: UpdateDiscountStrategyRequest): Promise<ApiResponse<DiscountStrategy>> => {
        console.log('✏️ 调用更新折扣策略API: PUT /discounts/' + id, data)

        // 直接发送驼峰格式的数据
        return apiClient.put(`/discounts/${id}`, data, true)
    },

    // 删除折扣策略 - DELETE /discounts/{id}
    deleteStrategy: (id: string): Promise<ApiResponse<void>> => {
        console.log('🗑️ 调用删除折扣策略API: DELETE /discounts/' + id)
        return apiClient.delete(`/discounts/${id}`, {}, true)
    },

    // 启用折扣策略 - POST /discounts/{id}/enable
    enableStrategy: (id: string): Promise<ApiResponse<void>> => {
        console.log('✅ 调用启用折扣策略API: POST /discounts/' + id + '/enable')
        return apiClient.post(`/discounts/${id}/enable`, {}, true)
    },

    // 禁用折扣策略 - POST /discounts/{id}/disable
    disableStrategy: (id: string): Promise<ApiResponse<void>> => {
        console.log('❌ 调用禁用折扣策略API: POST /discounts/' + id + '/disable')
        return apiClient.post(`/discounts/${id}/disable`, {}, true)
    },

    // 批量更新策略状态 - POST /discounts/batch/status (使用FormData)
    batchUpdateStatus: (strategyIds: number[], status: 'ACTIVE' | 'INACTIVE'): Promise<ApiResponse<void>> => {
        console.log('📦 调用批量更新策略状态API: POST /discounts/batch/status (FormData)', { strategyIds, status })

        // 创建FormData对象
        const formData = new FormData()

        // 添加策略ID数组 - 用逗号连接成字符串
        formData.append('strategyIds', strategyIds.join(','))

        // 添加状态字段
        formData.append('status', status)

        // 调试：打印FormData内容
        console.log('FormData内容:')
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`)
        }

        // postFormData方法会自动添加Authorization头
        return apiClient.postFormData('/discounts/batch/status', formData)
    },

    // 获取城市可用策略 - GET /discounts/city-available
    getCityAvailableStrategies: (cityCode?: string): Promise<ApiResponse<DiscountStrategy[]>> => {
        console.log('🏙️ 调用获取城市可用策略API: GET /discounts/city-available', { cityCode })
        const params = cityCode ? { cityCode } : {}
        return apiClient.get('/discounts/city-available', params, true)
    },

    // 获取活跃策略列表 - GET /discounts/active/{strategyType}
    getActiveStrategies: (strategyType?: string): Promise<ApiResponse<DiscountStrategy[]>> => {
        const url = strategyType ? `/discounts/active/${strategyType}` : '/discounts/active'
        console.log('🔥 调用获取活跃策略列表API: GET ' + url)
        return apiClient.get(url, {}, true)
    },

    // 获取所有城市列表（保留向后兼容性）
    getCities: createApiWrapper(
        (): Promise<ApiResponse<City[]>> => {
            return siteApi.getCities()
        },
        mockApi.discount.getCities
    ),

    // 获取折扣策略统计数据
    getDiscountStatistics: (query: { startDate?: string; endDate?: string; strategyType?: string }): Promise<ApiResponse<any>> => {
        // 根据接口：GET /statistics/discount?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&strategyType=xxx
        const params: any = {}
        if (query.startDate) params.startDate = query.startDate
        if (query.endDate) params.endDate = query.endDate
        if (query.strategyType) params.strategyType = query.strategyType
        return apiClient.get('/statistics/discount', params)
    }
}
