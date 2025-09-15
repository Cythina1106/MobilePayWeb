import { useState, useEffect, useCallback } from 'react'
import { ApiResponse, ApiError } from '../types/api'

// 通用API Hook类型
interface UseApiOptions<T> {
  immediate?: boolean // 是否立即执行
  defaultData?: T // 默认数据
  onSuccess?: (data: T) => void // 成功回调
  onError?: (error: ApiError) => void // 错误回调
}

interface UseApiResult<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  execute: (...args: any[]) => Promise<void>
  reset: () => void
}

// 通用API Hook
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const { immediate = false, defaultData = null, onSuccess, onError } = options

  const [data, setData] = useState<T | null>(defaultData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const execute = useCallback(async (...args: any[]) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiFunction(...args)
      
      if (response.success) {
        setData(response.data)
        onSuccess?.(response.data)
      } else {
        const apiError: ApiError = {
          code: response.code,
          message: response.message
        }
        setError(apiError)
        onError?.(apiError)
      }
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
      onError?.(apiError)
    } finally {
      setLoading(false)
    }
  }, [apiFunction, onSuccess, onError])

  const reset = useCallback(() => {
    setData(defaultData)
    setLoading(false)
    setError(null)
  }, [defaultData])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute])

  return { data, loading, error, execute, reset }
}

// 分页API Hook
type PaginationResponse<T> = { list: T[]; total: number; pageNum: number; pageSize: number; totalPages: number }

interface UsePaginationApiOptions<T> {
  pageSize?: number
  autoLoad?: boolean
  onSuccess?: (data: T[]) => void
  onError?: (error: ApiError) => void
}

interface UsePaginationApiResult<T> {
  data: T[]
  loading: boolean
  error: ApiError | null
  execute: (page?: number, size?: number, additionalParams?: any) => Promise<void>
  reset: () => void
  pageNum: number
  pageSize: number
  total: number
  totalPages: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  refresh: () => void
  loadMore: () => void
  hasMore: boolean
}

export function usePaginationApi<T>(
  apiFunction: (query: any) => Promise<ApiResponse<PaginationResponse<T>>>,
  options: UsePaginationApiOptions<T> = {}
): UsePaginationApiResult<T> {
  const { pageSize: defaultPageSize = 10, autoLoad = true, onSuccess, onError } = options

  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [data, setData] = useState<T[]>([])

  const { loading, error, execute: executeApi, reset } = useApi(
    apiFunction,
    {
      immediate: false,
      onSuccess: (response) => {
        setData(response.list)
        setTotal(response.total)
        setTotalPages(response.totalPages)
        onSuccess?.(response.list)
      },
      onError
    }
  )

  const loadData = useCallback(async (page = pageNum, size = pageSize, additionalParams = {}) => {
    await executeApi({ pageNum: page, pageSize: size, ...additionalParams })
  }, [executeApi, pageNum, pageSize])

  const setPage = useCallback((page: number) => {
    setPageNum(page)
    loadData(page, pageSize)
  }, [loadData, pageSize])

  const setPageSizeAndLoad = useCallback((size: number) => {
    setPageSize(size)
    setPageNum(1)
    loadData(1, size)
  }, [loadData])

  const refresh = useCallback(() => {
    loadData(pageNum, pageSize)
  }, [loadData, pageNum, pageSize])

  const loadMore = useCallback(() => {
    if (pageNum < totalPages) {
      const nextPage = pageNum + 1
      setPageNum(nextPage)
      loadData(nextPage, pageSize)
    }
  }, [loadData, pageNum, pageSize, totalPages])

  useEffect(() => {
    if (autoLoad) {
      loadData()
    }
  }, [autoLoad, loadData])

  return {
    data,
    loading,
    error,
    execute: loadData,
    reset,
    pageNum,
    pageSize,
    total,
    totalPages,
    setPage,
    setPageSize: setPageSizeAndLoad,
    refresh,
    loadMore,
    hasMore: pageNum < totalPages
  }
}

// 表单提交Hook
interface UseFormSubmitOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: ApiError) => void
  resetOnSuccess?: boolean
}

interface UseFormSubmitResult {
  submitting: boolean
  error: ApiError | null
  submit: (formData: any) => Promise<void>
  reset: () => void
}

export function useFormSubmit<T>(
  apiFunction: (data: any) => Promise<ApiResponse<T>>,
  options: UseFormSubmitOptions<T> = {}
): UseFormSubmitResult {
  const { onSuccess, onError, resetOnSuccess = false } = options

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const submit = useCallback(async (formData: any) => {
    try {
      setSubmitting(true)
      setError(null)

      const response = await apiFunction(formData)

      if (response.success) {
        onSuccess?.(response.data)
        if (resetOnSuccess) {
          setError(null)
        }
      } else {
        const apiError: ApiError = {
          code: response.code,
          message: response.message
        }
        setError(apiError)
        onError?.(apiError)
      }
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
      onError?.(apiError)
    } finally {
      setSubmitting(false)
    }
  }, [apiFunction, onSuccess, onError, resetOnSuccess])

  const reset = useCallback(() => {
    setSubmitting(false)
    setError(null)
  }, [])

  return { submitting, error, submit, reset }
}

// 数据轮询Hook
interface UsePollingOptions<T> extends UseApiOptions<T> {
  interval?: number // 轮询间隔（毫秒）
  enabled?: boolean // 是否启用轮询
}

export function usePolling<T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  options: UsePollingOptions<T> = {}
): UseApiResult<T> & { startPolling: () => void; stopPolling: () => void } {
  const { interval = 5000, enabled = false, ...apiOptions } = options

  const [isPolling, setIsPolling] = useState(enabled)
  const apiResult = useApi(apiFunction, { ...apiOptions, immediate: enabled })

  useEffect(() => {
    if (!isPolling) return

    const timer = setInterval(() => {
      apiResult.execute()
    }, interval)

    return () => clearInterval(timer)
  }, [isPolling, interval, apiResult.execute])

  const startPolling = useCallback(() => {
    setIsPolling(true)
  }, [])

  const stopPolling = useCallback(() => {
    setIsPolling(false)
  }, [])

  return {
    ...apiResult,
    startPolling,
    stopPolling
  }
}
