// 设备管理相关API
import {createApiWrapper} from "./api";
import {CreateDeviceRequest, Device, DeviceQuery, UpdateDeviceRequest} from "../types/device";
import {ApiResponse, PageResponse} from "../types/common";
import {apiClient} from "../utils/apiClient";
import {mockApi} from "./mockApi";
import {Site} from "../types/site";

export const deviceApi = {
    // 获取设备列表（支持分页和筛选）
    getDevices: createApiWrapper(
        (query: DeviceQuery): Promise<ApiResponse<PageResponse<Device>>> => {
            // 构建查询参数对象
            const params: Record<string, any> = {}

            // 添加所有查询参数 - 使用驼峰格式
            if (query.pageNum) params.pageNum = query.pageNum
            if (query.pageSize) params.pageSize = query.pageSize
            if (query.keyword !== undefined) params.keyword = query.keyword
            if (query.siteId !== undefined) params.siteId = query.siteId
            if (query.status !== undefined) params.status = query.status
            if (query.deviceType !== undefined) params.deviceType = query.deviceType
            if (query.firmwareVersion !== undefined) params.firmwareVersion = query.firmwareVersion
            if (query.startTime !== undefined) params.startTime = query.startTime
            if (query.endTime !== undefined) params.endTime = query.endTime
            if (query.heartbeatStartTime !== undefined) params.heartbeatStartTime = query.heartbeatStartTime
            if (query.heartbeatEndTime !== undefined) params.heartbeatEndTime = query.heartbeatEndTime
            if (query.orderBy !== undefined) params.orderBy = query.orderBy
            if (query.orderDirection !== undefined) params.orderDirection = query.orderDirection
            if (query.isOnline !== undefined) params.isOnline = query.isOnline
            if (query.heartbeatTimeoutMinutes !== undefined) params.heartbeatTimeoutMinutes = query.heartbeatTimeoutMinutes

            // 使用apiClient发送GET请求，这样会自动使用正确的baseURL和认证
            return apiClient.get<PageResponse<Device>>('/devices', params)
        },
        mockApi.device.getDevices
    ),

    // 获取设备详情
    getDevice: createApiWrapper(
        (id: string): Promise<ApiResponse<Device>> => {
            // 使用apiClient发送GET请求，这样会自动使用正确的baseURL和认证
            return apiClient.get<Device>(`/devices/${id}`)
        },
        mockApi.device.getDevice
    ),

    // 创建设备
    createDevice: (data: CreateDeviceRequest): Promise<ApiResponse<Device>> => {
        console.log('➕ 调用创建设备API: POST /devices', data)
        // 直接发送驼峰格式的数据
        return apiClient.post<Device>('/devices', data, true)
    },

    // 更新设备
    updateDevice: (id: string, data: UpdateDeviceRequest): Promise<ApiResponse<Device>> => {
        console.log('✏️ 调用更新设备API: PUT /devices/{id}', id, data)
        // 直接发送驼峰格式的数据
        return apiClient.put<Device>(`/devices/${id}`, data, true)
    },

    // 删除设备
    deleteDevice: (id: string): Promise<ApiResponse<void>> => {
        console.log('🗑️ 调用删除设备API: DELETE /devices/{id}', id)
        return apiClient.delete<void>(`/devices/${id}`, {}, true)
    },

    // 获取站点列表
    getSites: createApiWrapper(
        (): Promise<ApiResponse<Site[]>> => {
            // 获取用户ID，按照接口要求使用X-User-Id请求头
            const userId = localStorage.getItem('userId') || ''
            const token = localStorage.getItem('authToken') || ''

            const headers = new Headers()
            headers.append("X-User-Id", userId)
            headers.append("Authorization", token)

            const requestOptions: RequestInit = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
            }

            return fetch("/site", requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }
                    return response.text()
                })
                .then(result => {
                    let data: Site[]
                    try {
                        data = JSON.parse(result)
                    } catch {
                        data = []
                    }

                    return {
                        success: true,
                        code: 200,
                        message: 'success',
                        data: data,
                        timestamp: new Date().toISOString()
                    } as ApiResponse<Site[]>
                })
                .catch(error => {
                    console.error('获取站点列表失败:', error)
                    throw error
                })
        },
        mockApi.device.getSites
    ),

    // 批量更新设备状态
    batchUpdateDeviceStatus: createApiWrapper(
        (deviceIds: number[], status: 'ACTIVE' | 'INACTIVE'): Promise<ApiResponse<void>> => {
            // 构建查询参数
            const params = {
                deviceIds: `[${deviceIds.join(',')}]`,
                status: status
            }

            // 使用apiClient发送POST请求
            return apiClient.post<void>('/devices/batch/status', params)
        },
        mockApi.device.batchUpdateDeviceStatus
    ),

    // 更新设备心跳
    updateDeviceHeartbeat: createApiWrapper(
        (deviceCode: string): Promise<ApiResponse<void>> => {
            // 使用apiClient发送POST请求
            return apiClient.post<void>(`/devices/heartbeat?deviceCode=${deviceCode}`)
        },
        mockApi.device.updateDeviceHeartbeat
    ),

    // 搜索设备
    searchDevices: createApiWrapper(
        (keyword: string): Promise<ApiResponse<Device[]>> => {
            // 使用apiClient发送GET请求
            const params = { keyword: keyword }
            return apiClient.get<Device[]>('/devices/search', params)
        },
        mockApi.device.searchDevices
    )
}
