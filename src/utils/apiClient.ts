import { ApiResponse, ApiError } from '../types/api'

// API 配置
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  TIMEOUT: 30000,
  TOKEN_KEY: 'token',
  REFRESH_TOKEN_KEY: 'refresh_token'
}

// 请求拦截器类型
interface RequestConfig extends RequestInit {
  url: string
  params?: Record<string, any>
  requireAuth?: boolean
}

class ApiClient {
  private baseURL: string
  private timeout: number

  constructor(baseURL: string = API_CONFIG.BASE_URL, timeout: number = API_CONFIG.TIMEOUT) {
    this.baseURL = baseURL
    this.timeout = timeout
  }

  // 获取存储的token
  private getToken(): string | null {
    return localStorage.getItem(API_CONFIG.TOKEN_KEY)
  }

  // 设置token
  public setToken(token: string): void {
    localStorage.setItem(API_CONFIG.TOKEN_KEY, token)
  }

  // 清除token
  public clearToken(): void {
    localStorage.removeItem(API_CONFIG.TOKEN_KEY)
    localStorage.removeItem(API_CONFIG.REFRESH_TOKEN_KEY)
  }

  // 构建查询字符串
  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    return searchParams.toString()
  }

  // 构建完整URL
  private buildURL(url: string, params?: Record<string, any>): string {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`
    if (params) {
      const queryString = this.buildQueryString(params)
      return queryString ? `${fullURL}?${queryString}` : fullURL
    }
    return fullURL
  }

  // 处理响应
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: any

    try {
      data = await response.json()
    } catch {
      data = { code: response.status, message: '响应解析失败', success: false }
    }

    if (!response.ok) {
      const error: ApiError = {
        code: response.status,
        message: data.message || `HTTP Error: ${response.status}`,
        details: data
      }
      throw error
    }

    // 如果后端返回的数据结构不符合预期，进行适配
    if (typeof data === 'object' && data !== null) {
      return {
        code: data.code || 200,
        message: data.message || 'success',
        data: data.data !== undefined ? data.data : data,
        success: data.success !== undefined ? data.success : (data.code === 200 || data.code === 0),
        timestamp: data.timestamp || new Date().toISOString()
      }
    }

    return {
      code: 200,
      message: 'success',
      data: data as T,
      success: true,
      timestamp: new Date().toISOString()
    }
  }

  // 通用请求方法
  private async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const { url, params, requireAuth = true, ...fetchConfig } = config

    // 构建请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchConfig.headers as Record<string, string> || {})
    }

    // 添加认证头
    if (requireAuth) {
      const token = this.getToken()
      console.log('🔍 Token检查 - requireAuth:', requireAuth)
      console.log('🔍 TOKEN_KEY:', API_CONFIG.TOKEN_KEY)
      console.log('🔍 localStorage中的token:', localStorage.getItem(API_CONFIG.TOKEN_KEY) ? 'exists' : 'null')
      console.log('🔍 getToken()返回:', token ? token.substring(0, 20) + '...' : 'null')

      if (token) {
        // 直接使用存储的token（登录时已包含Bearer前缀）
        headers['Authorization'] = token
        console.log('✅ 成功添加Authorization头:', token.substring(0, 20) + '...')
      } else {
        console.error('❌ 未找到token，请先登录')
        console.error('❌ 检查localStorage keys:', Object.keys(localStorage))
      }
    } else {
      console.log('ℹ️ 此请求不需要认证 (requireAuth: false)')
    }

    // 构建请求配置
    const requestConfig: RequestInit = {
      ...fetchConfig,
      headers,
      signal: AbortSignal.timeout(this.timeout)
    }

    // 构建URL
    const requestURL = this.buildURL(url, fetchConfig.method === 'GET' ? params : undefined)

    // 添加请求体
    if (fetchConfig.method !== 'GET' && params) {
      requestConfig.body = JSON.stringify(params)
    }

    try {
      const response = await fetch(requestURL, requestConfig)
      return await this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof Error) {
        // 处理网络错误、超时等
        const apiError: ApiError = {
          code: 0,
          message: error.message.includes('timeout') ? '请求超时' : '网络错误',
          details: error
        }
        throw apiError
      }
      throw error
    }
  }

  // GET 请求
  public get<T>(url: string, params?: Record<string, any>, requireAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      params,
      method: 'GET',
      requireAuth
    })
  }

  // POST 请求
  public post<T>(url: string, data?: any, requireAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      params: data,
      method: 'POST',
      requireAuth
    })
  }

  // PUT 请求
  public put<T>(url: string, data?: any, requireAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      params: data,
      method: 'PUT',
      requireAuth
    })
  }

  // DELETE 请求
  public delete<T>(url: string, params?: Record<string, any>, requireAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      params,
      method: 'DELETE',
      requireAuth
    })
  }

  // POST 请求 - 支持自定义请求头
  public postWithHeaders<T>(
    url: string,
    data?: any,
    customHeaders?: Record<string, string>,
    requireAuth = false
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      params: data,
      method: 'POST',
      headers: customHeaders,
      requireAuth
    })
  }

  // FormData POST请求
  public postFormData<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch (error) {
            reject(new Error('响应解析失败'))
          }
        } else {
          reject(new Error(`请求失败: ${xhr.status}`))
        }
      }

      xhr.onerror = () => reject(new Error('网络错误'))

      xhr.open('POST', this.buildURL(url))

      const token = this.getToken()
      if (token) {
        // 直接使用存储的token（登录时已包含Bearer前缀）
        xhr.setRequestHeader('Authorization', token)
        console.log('🔑 FormData请求添加Authorization头:', token.substring(0, 20) + '...')
      }

      // 注意：不要设置Content-Type，让浏览器自动设置multipart/form-data
      xhr.send(formData)
    })
  }

  // 文件上传
  public upload<T>(url: string, file: File, progressCallback?: (progress: number) => void): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('file', file)

      const xhr = new XMLHttpRequest()

      // 上传进度
      if (progressCallback) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100
            progressCallback(progress)
          }
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch {
            reject(new Error('响应解析失败'))
          }
        } else {
          reject(new Error(`上传失败: ${xhr.status}`))
        }
      }

      xhr.onerror = () => reject(new Error('上传失败'))

      xhr.open('POST', this.buildURL(url))

      const token = this.getToken()
      if (token) {
        // 直接使用存储的token（登录时已包含Bearer前缀）
        xhr.setRequestHeader('Authorization', token)
        console.log('🔑 Upload请求添加Authorization头:', token.substring(0, 20) + '...')
      }

      xhr.send(formData)
    })
  }
}

// 创建默认API客户端实例
export const apiClient = new ApiClient()

// 导出API客户端类，供自定义使用
export { ApiClient }
