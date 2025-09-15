// 站点管理API
import {ApiResponse} from "../types/common.ts";
import {City} from "../types/discount.ts";
import {apiClient} from "../utils/apiClient.ts";
import {Site, SiteCreateRequest, SiteListResponse, SiteQuery, SiteUpdateRequest} from "../types/site.ts";
import {LineListResponse, LineQuery} from "../types/line.ts";

export const siteApi = {
    // 获取城市列表 - 使用统一的ApiClient
    getCities: (): Promise<ApiResponse<City[]>> => {
        console.log('🏙️ 调用获取城市列表API: GET /site')
        return apiClient.get<City[]>('/site', {}, true)
    },

    // 分页查询站点列表
    getSites: (query: SiteQuery): Promise<ApiResponse<SiteListResponse>> => {
        console.log('📍 调用分页查询站点列表API: GET /site', query)

        // 构建查询参数对象，确保所有参数都被正确传递
        const params: any = {}

        // 分页参数 - 根据后端接口调整参数名
        if (query.pageNum !== undefined) params.pageNum = query.pageNum  // 后端使用 pageNum
        if (query.pageSize !== undefined) params.pageSize = query.pageSize   // 后端使用 pageSize

        // 筛选参数 - 使用驼峰格式
        if (query.keyword && query.keyword.trim()) params.keyword = query.keyword.trim()
        if (query.status && query.status.trim()) params.status = query.status.trim()
        if (query.siteType && query.siteType.trim()) params.siteType = query.siteType.trim()
        if (query.city && query.city.trim()) params.city = query.city.trim()
        if (query.lineName && query.lineName.trim()) params.lineName = query.lineName.trim()

        // 时间范围参数
        if (query.startTime) params.startTime = query.startTime
        if (query.endTime) params.endTime = query.endTime

        // 排序参数
        if (query.orderBy) params.orderBy = query.orderBy
        if (query.orderDirection) params.orderDirection = query.orderDirection

        // 地理位置参数
        if (query.minLongitude !== undefined) params.minLongitude = query.minLongitude
        if (query.maxLongitude !== undefined) params.maxLongitude = query.maxLongitude
        if (query.minLatitude !== undefined) params.minLatitude = query.minLatitude
        if (query.maxLatitude !== undefined) params.maxLatitude = query.maxLatitude

        console.log('🔗 最终查询参数:', params)

        // 让ApiClient自动处理URL参数拼接
        return apiClient.get<SiteListResponse>('/site', params, true)
    },

    // 获取站点详情
    getSiteById: (id: string): Promise<ApiResponse<Site>> => {
        console.log('🔍 调用获取站点详情API: GET /site/{id}', id)
        return apiClient.get<Site>(`/site/${id}`, {}, true)
    },

    // 创建站点
    createSite: (siteData: SiteCreateRequest): Promise<ApiResponse<Site>> => {
        console.log('➕ 调用创建站点API: POST /site', siteData)
        // 直接发送驼峰格式的数据，因为后端返回的也是驼峰格式
        return apiClient.post<Site>('/site', siteData, true)
    },

    // 更新站点
    updateSite: (id: string, siteData: SiteUpdateRequest): Promise<ApiResponse<Site>> => {
        console.log('✏️ 调用更新站点API: PUT /site/{id}', id, siteData)
        // 直接发送驼峰格式的数据，因为后端返回的也是驼峰格式
        return apiClient.put<Site>(`/site/${id}`, siteData, true)
    },

    // 删除站点
    deleteSite: (id: string): Promise<ApiResponse<void>> => {
        console.log('🗑️ 调用删除站点API: DELETE /site/{id}', id)
        return apiClient.delete<void>(`/site/${id}`, {}, true)
    },

    // 搜索站点
    searchSites: (keyword: string): Promise<ApiResponse<Site[]>> => {
        console.log('🔍 调用搜索站点API: GET /site/search', keyword)
        return apiClient.get<Site[]>('/site/search', { keyword }, true)
    },

    // 获取线路列表
    getLines: (query?: LineQuery): Promise<ApiResponse<LineListResponse>> => {
        console.log('🚇 调用获取线路列表API: GET /site/lines', query)
        return apiClient.get<LineListResponse>('/site/lines', query || {}, true)
    },

    // 获取站点统计数据
    getSiteStatistics: (): Promise<ApiResponse<any>> => {
        return apiClient.get('/statistics/site', {})
    },

    // 获取设备统计数据
    getDeviceStatistics: (query: { startDate?: string; endDate?: string; city?: string; siteId?: number }): Promise<ApiResponse<any>> => {
        const params: any = {}
        if (query.startDate) params.startDate = query.startDate
        if (query.endDate) params.endDate = query.endDate
        if (query.city) params.city = query.city
        if (query.siteId) params.siteId = query.siteId
        return apiClient.get('/statistics/device', params)
    },

    // 获取出行统计数据（事件记录列表）
    getTravelStatistics: (query: { pageNum: number; pageSize: number }): Promise<ApiResponse<any>> => {
        const params = new URLSearchParams({
            pageNum: query.pageNum.toString(),
            pageSize: query.pageSize.toString()
        })
        return apiClient.get(`/statistics/travel?${params.toString()}`)
    }
}
