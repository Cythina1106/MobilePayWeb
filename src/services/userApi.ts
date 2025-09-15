// 用户管理相关API
import {createApiWrapper} from "./api.ts";
import {
    CreateUserRequest,
    PendingUserQuery,
    PendingUserResult, UpdateUserRequest,
    User, UserAuditRequest, UserAuditResponse, UserDisableResponse, UserEnableResponse,
    UserQuery, UserRejectRequest, UserRejectResponse,
    UserSearchQuery,
    UserSearchResult
} from "../types/user.ts";
import {ApiResponse, PageResponse} from "../types/common.ts";
import {apiClient} from "../utils/apiClient.ts";
import {mockApi} from "./mockApi.ts";
import {TravelRecordsResponse} from "../types/travel.ts";
import {Transaction, TransactionQuery} from "../types/transaction.ts";

export const userApi = {
    // 获取用户列表 - 根据JavaScript接口使用Authorization请求头
    getUsers: createApiWrapper(
        (query: UserQuery): Promise<ApiResponse<PageResponse<User>>> => {
            // 根据JavaScript接口将URL路径更改为 /user 而不是 /users
            return apiClient.get('/user', query)
        },
        mockApi.users.getList
    ),

    // 获取用户详情 - 根据JavaScript接口使用Authorization请求头
    getUser: createApiWrapper(
        (id: string): Promise<ApiResponse<User>> => {
            // 根据JavaScript接口将URL路径更改为 /user/{id} 而不是 /users/{id}

            return apiClient.get(`/user/${id}`, {}, true)
        },
        mockApi.users.getUser
    ),

    // 搜索用户 - 根据JavaScript接口使用Authorization请求头
    searchUsers: createApiWrapper(
        (query: UserSearchQuery): Promise<ApiResponse<UserSearchResult>> => {
            // 根据JavaScript接口：GET /user/search?keyword=test
            return apiClient.get('/user/search', query)
        },
        mockApi.users.searchUsers
    ),

    // 获取待审核用户 - 根据JavaScript接口使用Authorization请求头
    getPendingUsers: createApiWrapper(
        (query?: PendingUserQuery): Promise<ApiResponse<PendingUserResult>> => {
            // 根据JavaScript接口：GET /user/pending
            return apiClient.get('/user/pending', query || {})
        },
        mockApi.users.getPendingUsers
    ),

    // 审核用户通过/拒绝 - 根据JavaScript接口使用Authorization请求头和JSON格式
    approveUser: createApiWrapper(
        (userId: string, auditData: UserAuditRequest): Promise<ApiResponse<UserAuditResponse>> => {
            // 根据JavaScript接口：POST /user/{id}/approve
            return apiClient.post(`/user/${userId}/approve`, auditData)
        },
        mockApi.users.approveUser
    ),

    // 拒绝用户审核 - 根据JavaScript接口使用Authorization请求头和JSON格式
    rejectUser: createApiWrapper(
        (userId: string, rejectData: UserRejectRequest): Promise<ApiResponse<UserRejectResponse>> => {
            // 根据JavaScript接口：POST /user/{id}/reject
            return apiClient.post(`/user/${userId}/reject`, rejectData)
        },
        mockApi.users.rejectUser
    ),

    // 启用用户 - 根据JavaScript接口使用Authorization请求头
    enableUser: createApiWrapper(
        (userId: string): Promise<ApiResponse<UserEnableResponse>> => {
            // 根据JavaScript接口：POST /user/{id}/enable
            console.log('✅ 调用启用用户API: POST /user/{id}/enable', userId)
            return apiClient.post(`/user/${userId}/enable`, {}, true)
        },
        mockApi.users.enableUser
    ),

    // 禁用用户 - 根据JavaScript接口使用Authorization请求头和reason查询参数
    disableUser: createApiWrapper(
        (userId: string, reason?: string): Promise<ApiResponse<UserDisableResponse>> => {
            // 根据JavaScript接口：POST /user/{id}/disable?reason=xxx
            const url = reason ? `/user/${userId}/disable?reason=${encodeURIComponent(reason)}` : `/user/${userId}/disable`
            console.log('❌ 调用禁用用户API: POST /user/{id}/disable', userId, reason)
            return apiClient.post(url, {}, true)
        },
        mockApi.users.disableUser
    ),

    // 创建用户
    createUser: (data: CreateUserRequest): Promise<ApiResponse<User>> => {
        return apiClient.post('/users', data)
    },

    // 更新用户信息
    updateUser: (data: UpdateUserRequest): Promise<ApiResponse<User>> => {
        return apiClient.put(`/users/${data.id}`, data)
    },

    // 删除用户
    deleteUser: (id: string): Promise<ApiResponse<void>> => {
        console.log('🗑️ 调用删除用户API: DELETE /users/{id}', id)
        return apiClient.delete(`/users/${id}`, {}, true)
    },

    // 冻结/解冻用户
    toggleUserStatus: (id: string, status: 'normal' | 'frozen' | 'disabled'): Promise<ApiResponse<void>> => {
        return apiClient.put(`/users/${id}/status`, { status })
    },

    // 查看用户出行记录 - 根据JavaScript接口使用Authorization请求头和查询参数
    getTravelRecords: createApiWrapper(
        (userId: string, query: { pageNum: number; pageSize: number }): Promise<ApiResponse<TravelRecordsResponse>> => {
            // 根据JavaScript接口：GET /user/{id}/travel-records?pageNum=1&pageSize=10
            const params = new URLSearchParams({
                pageNum: query.pageNum.toString(),
                pageSize: query.pageSize.toString()
            });
            console.log('🚇 调用获取用户出行记录API: GET /user/{id}/travel-records', userId)
            return apiClient.get(`/user/${userId}/travel-records?${params.toString()}`, {}, true)
        },
        mockApi.users.getTravelRecords
    ),

    // 查看用户转账记录 - 根据JavaScript接口使用Authorization请求头和查询参数
    getTransferRecords: createApiWrapper(
        (userId: string, query: { pageNum: number; pageSize: number }): Promise<ApiResponse<any>> => {
            // 根据JavaScript接口：GET /user/{id}/transfer-records?pageNum=1&pageSize=10
            const params = new URLSearchParams({
                pageNum: query.pageNum.toString(),
                pageSize: query.pageSize.toString()
            });

            return apiClient.get(`/user/${userId}/transfer-records?${params.toString()}`, {}, true)
        },
        mockApi.users.getTravelRecords
    ),

    // 调整用户余额
    adjustBalance: (id: string, amount: number, type: 'increase' | 'decrease', remark: string): Promise<ApiResponse<void>> => {
        return apiClient.post(`/users/${id}/balance`, { amount, type, remark })
    },

    // 重置用户密码
    resetPassword: (id: string, newPassword: string): Promise<ApiResponse<void>> => {
        return apiClient.post(`/users/${id}/reset-password`, { newPassword })
    },

    // 获取用户交易记录
    getUserTransactions: (id: string, query: TransactionQuery): Promise<ApiResponse<PageResponse<Transaction>>> => {
        return apiClient.get(`/users/${id}/transactions`, query)
    },

    // 获取用户统计数据
    getUserStatistics: (query: { startDate?: string; endDate?: string }): Promise<ApiResponse<any>> => {
        // 根据接口：GET /statistics/user?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd
        const params: any = {}
        if (query.startDate) params.startDate = query.startDate
        if (query.endDate) params.endDate = query.endDate
        return apiClient.get('/statistics/user', params)
    }
}
