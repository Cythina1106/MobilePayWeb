// 统计相关API
import {createApiWrapper} from "./api.ts";
import {ApiResponse} from "../types/common.ts";
import {UserStatistics} from "../types/stats.ts";
import {mockApi} from "./mockApi.ts";
import {DeviceUsageQuery, DeviceUsageStatistics} from "../types/device.ts";
import {DiscountStatistics, DiscountStatisticsQuery} from "../types/discount.ts";
import {SiteStatistics} from "../types/site.ts";

export const statisticsApi = {
    // 获取用户统计数据
    getUserStatistics: createApiWrapper(
        (): Promise<ApiResponse<UserStatistics>> => {
            // 根据JavaScript接口要求使用X-User-Id请求头
            const userId = localStorage.getItem('userId') || ''

            const headers = new Headers()
            headers.append("X-User-Id", userId)

            const requestOptions: RequestInit = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
            }

            return fetch("/statistics/user", requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }
                    return response.text()
                })
                .then(result => {
                    let data: UserStatistics
                    try {
                        data = JSON.parse(result)
                    } catch {
                        // 如果解析失败，返回默认统计数据
                        data = {
                            totalUsers: 0,
                            activeUsers: 0,
                            newUsers: 0,
                            verifiedUsers: 0,
                            usersByStatus: { active: 0, inactive: 0, locked: 0, pending: 0 },
                            usersByRole: { superAdmin: 0, admin: 0, operator: 0, viewer: 0 },
                            userGrowthTrend: [],
                            userActivityStats: {
                                lastLogin: { today: 0, thisWeek: 0, thisMonth: 0 },
                                transactions: { averagePerUser: 0, topUsers: [] }
                            }
                        }
                    }

                    return {
                        success: true,
                        code: 200,
                        message: 'success',
                        data: data,
                        timestamp: new Date().toISOString()
                    } as ApiResponse<UserStatistics>
                })
                .catch(error => {
                    console.error('获取用户统计数据失败:', error)
                    throw error
                })
        },
        mockApi.statistics.getUserStatistics
    ),

    // 获取站点数据统计
    getSiteStatistics: createApiWrapper(
        (): Promise<ApiResponse<SiteStatistics>> => {
            // 根据JavaScript接口要求使用X-User-Id请求头
            const userId = localStorage.getItem('userId') || ''

            const headers = new Headers()
            headers.append("X-User-Id", userId)

            const requestOptions: RequestInit = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
            }

            return fetch("/statistics/site", requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }
                    return response.text()
                })
                .then(result => {
                    let data: SiteStatistics
                    try {
                        data = JSON.parse(result)
                    } catch {
                        // 如果解析失败，返回默认站点统计数据
                        data = {
                            totalSites: 0,
                            activeSites: 0,
                            inactiveSites: 0,
                            maintenanceSites: 0,
                            siteTypeDistribution: [],
                            sitePerformanceStats: [],
                            geographicDistribution: [],
                            operationalStatus: {
                                online: { count: 0, percentage: 0, avgUptime: 0 },
                                offline: { count: 0, percentage: 0, avgDowntime: 0 },
                                maintenance: { count: 0, percentage: 0, avgDowntime: 0 }
                            },
                            revenueAnalysis: {
                                totalRevenue: 0,
                                avgRevenuePerSite: 0,
                                topPerformingSites: [],
                                revenueByRegion: [],
                                monthlyTrend: []
                            },
                            deviceConfiguration: {
                                totalDevices: 0,
                                avgDevicesPerSite: 0,
                                deviceTypeDistribution: [],
                                utilizationRate: 0,
                                maintenanceSchedule: { scheduled: 0, overdue: 0, completed: 0 }
                            },
                            trafficAnalysis: {
                                totalVisits: 0,
                                avgVisitsPerSite: 0,
                                peakHours: [],
                                customerFlow: []
                            },
                            serviceQualityMetrics: {
                                avgResponseTime: 0,
                                successRate: 0,
                                customerSatisfaction: 0,
                                errorRate: 0,
                                maintenanceFrequency: 0,
                                qualityScore: 0,
                                improvements: []
                            }
                        }
                    }

                    return {
                        success: true,
                        code: 200,
                        message: 'success',
                        data: data,
                        timestamp: new Date().toISOString()
                    } as ApiResponse<SiteStatistics>
                })
                .catch(error => {
                    console.error('获取站点统计数据失败:', error)
                    throw error
                })
        },
        mockApi.statistics.getSiteStatistics
    ),

    // 获取设备使用统计
    getDeviceUsageStatistics: createApiWrapper(
        (query?: DeviceUsageQuery): Promise<ApiResponse<DeviceUsageStatistics>> => {
            // 根据JavaScript接口要求使用Authorization请求头
            const token = localStorage.getItem('token') || ''

            const headers = new Headers()
            headers.append("Authorization", token)

            // 构建查询参数
            const searchParams = new URLSearchParams()
            if (query?.startDate) searchParams.append('startDate', query.startDate)
            if (query?.endDate) searchParams.append('endDate', query.endDate)
            if (query?.city) searchParams.append('city', query.city)
            if (query?.siteId) searchParams.append('siteId', query.siteId)

            const url = `/statistics/device${searchParams.toString() ? '?' + searchParams.toString() : ''}`

            const requestOptions: RequestInit = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
            }

            return fetch(url, requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }
                    return response.text()
                })
                .then(result => {
                    let data: DeviceUsageStatistics
                    try {
                        data = JSON.parse(result)
                    } catch {
                        // 如果解析失败，返回默认设备使用统计数据
                        data = {
                            totalDevices: 0,
                            activeDevices: 0,
                            onlineDevices: 0,
                            offlineDevices: 0,
                            maintenanceDevices: 0,
                            devicesByType: { terminal: 0, scanner: 0, printer: 0, kiosk: 0, mobile: 0 },
                            devicesByStatus: { active: 0, inactive: 0, maintenance: 0, error: 0, offline: 0 },
                            usageByLocation: [],
                            usageByTime: [],
                            dailyUsage: [],
                            topDevices: [],
                            performanceMetrics: {
                                averageUptime: 0,
                                averageTransactionTime: 0,
                                successRate: 0,
                                errorRate: 0,
                                maintenanceFrequency: 0
                            },
                            alertSummary: { critical: 0, warning: 0, info: 0, resolved: 0 },
                            siteStats: []
                        }
                    }

                    return {
                        success: true,
                        code: 200,
                        message: 'success',
                        data: data,
                        timestamp: new Date().toISOString()
                    } as ApiResponse<DeviceUsageStatistics>
                })
                .catch(error => {
                    console.error('获取设备使用统计数据失败:', error)
                    throw error
                })
        },
        mockApi.statistics.getDeviceUsageStatistics
    ),

    // 获取折扣策略统计
    getDiscountStatistics: createApiWrapper(
        (query?: DiscountStatisticsQuery): Promise<ApiResponse<DiscountStatistics>> => {
            // 根据JavaScript接口要求使用Authorization请求头
            const token = localStorage.getItem('token') || ''

            const headers = new Headers()
            headers.append("Authorization", token)

            // 构建查询参数
            const searchParams = new URLSearchParams()
            if (query?.startDate) searchParams.append('startDate', query.startDate)
            if (query?.endDate) searchParams.append('endDate', query.endDate)
            if (query?.strategyType) searchParams.append('strategyType', query.strategyType)

            const url = `/statistics/discount${searchParams.toString() ? '?' + searchParams.toString() : ''}`

            const requestOptions: RequestInit = {
                method: 'GET',
                headers: headers,
                redirect: 'follow'
            }

            return fetch(url, requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }
                    return response.text()
                })
                .then(result => {
                    let data: DiscountStatistics
                    try {
                        data = JSON.parse(result)
                    } catch {
                        // 如果解析失败，返回默认折扣策略统计数据
                        data = {
                            totalStrategies: 0,
                            activeStrategies: 0,
                            expiredStrategies: 0,
                            draftStrategies: 0,
                            strategyTypeDistribution: [],
                            strategyUsageStats: [],
                            usageTrend: [],
                            cityDistribution: [],
                            effectivenessAnalysis: {
                                highPerformance: { count: 0, avgConversionRate: 0, topStrategies: [] },
                                mediumPerformance: { count: 0, avgConversionRate: 0 },
                                lowPerformance: { count: 0, avgConversionRate: 0, improvementSuggestions: [] }
                            },
                            userBehaviorStats: {
                                totalUniqueUsers: 0,
                                repeatUsageRate: 0,
                                avgStrategiesPerUser: 0,
                                userSegmentation: []
                            },
                            financialImpact: {
                                totalDiscountAmount: 0,
                                totalTransactionAmount: 0,
                                discountRate: 0,
                                estimatedRevenueLoss: 0,
                                estimatedCustomerAcquisitionValue: 0,
                                roi: 0
                            }
                        }
                    }

                    return {
                        success: true,
                        code: 200,
                        message: 'success',
                        data: data,
                        timestamp: new Date().toISOString()
                    } as ApiResponse<DiscountStatistics>
                })
                .catch(error => {
                    console.error('获取折扣策略统计数据失败:', error)
                    throw error
                })
        },
        mockApi.statistics.getDiscountStatistics
    ),

}
