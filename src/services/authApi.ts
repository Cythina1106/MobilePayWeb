// 认证相关API
import {LoginRequest, LoginResponse, RefreshTokenResponse, UserInfo} from "../types/user.ts";
import {ApiResponse} from "../types/common.ts";
import {apiClient} from "../utils/apiClient.ts";
import {createApiWrapper} from "./api.ts";
import {mockApi} from "./mockApi.ts";

export const authApi = {
    // 登录 - 强制使用真实API
    login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        console.log('🔐 调用登录API: POST /auth/login', data)
        return apiClient.post<LoginResponse>('/auth/login', data, false) // 登录不需要token
            .then(response => {
                if (response.code === 200 && response.data?.accessToken && response.data?.tokenType) {
                    // 拼接token_type和access_token，存储到localStorage
                    const fullToken = `${response.data.tokenType} ${response.data.accessToken}`
                    localStorage.setItem('token', fullToken)
                    console.log('🔑 Token已存储到localStorage:', fullToken)
                }
                return response
            })
    },

    // // 登出 - 根据JavaScript接口使用X-User-Id请求头
    // logout: createApiWrapper(
    //   (userId?: string): Promise<ApiResponse<void>> => {
    //     const headers: Record<string, string> = {
    //       'X-User-Id': userId || ''
    //     }
    //     return apiClient.postWithHeaders('/auth/logout', undefined, headers, false)
    //   },
    //   mockApi.auth.logout
    // ),

    // 登出 - 强制使用真实API
    logout: (): Promise<ApiResponse<void>> => {
        console.log('🚪 调用登出API: POST /auth/logout')
        return apiClient.post<void>('/auth/logout', {}, true)
            .then(response => {
                // 登出成功后清除token
                localStorage.removeItem('token')
                console.log('🔑 Token已清除')
                return response
            })
    },

    // 刷新token - 强制使用真实API
    refreshToken: (userId?: string): Promise<ApiResponse<RefreshTokenResponse>> => {
        console.log('调用真实刷新token API:', userId)
        const headers: Record<string, string> = {
            'X-User-Id': userId || ''
        }
        return apiClient.postWithHeaders('/auth/refresh', undefined, headers, false)
    },

    // 获取当前用户信息 - 使用Mock以避免刷新时权限问题
    profile: createApiWrapper(
        (): Promise<ApiResponse<UserInfo>> => {
            console.log('👤 调用获取用户信息API: GET /auth/profile')
            return apiClient.get('/auth/profile', {}, true)
        },
        mockApi.auth.getProfile
    ),

    // 获取当前用户信息（别名，保持向后兼容）
    getCurrentUser: createApiWrapper(
        (): Promise<ApiResponse<UserInfo>> => {
            console.log('👤 调用获取当前用户信息API: GET /auth/profile')
            return apiClient.get('/auth/profile', {}, true)
        },
        mockApi.auth.getCurrentUser
    ),

    // 获取管理员资料信息（别名，保持向后兼容）
    getProfile: createApiWrapper(
        (): Promise<ApiResponse<UserInfo>> => {
            console.log('👤 调用获取管理员资料信息API: GET /auth/profile')
            return apiClient.get('/auth/profile', {}, true)
        },
        mockApi.auth.getProfile
    ),

    // 修改密码
    changePassword: (data: { oldPassword: string; newPassword: string }): Promise<ApiResponse<void>> => {
        return apiClient.post('/auth/change-password', data)
    },

    // 获取验证码
    getCaptcha: createApiWrapper(
        (): Promise<ApiResponse<{ captcha: string; key: string }>> => {
            return apiClient.get('/auth/captcha', undefined, false)
        },
        mockApi.auth.getCaptcha
    )
}
