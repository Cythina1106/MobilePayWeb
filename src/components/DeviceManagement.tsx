import React, { useState, useEffect } from 'react'
import { Device, DeviceQuery, Site } from '../types/api'
import { deviceApi } from '../services/api'

const DeviceManagement: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState<DeviceQuery>({
    pageNum: 1,
    pageSize: 10
  })
  const [total, setTotal] = useState(0)

  // 获取设备列表
  const fetchDevices = async () => {
    setLoading(true)
    try {
      const response = await deviceApi.getDevices(query)
      if (response.success) {
        setDevices(response.data.list)
        setTotal(response.data.total)
      }
    } catch (error) {
      console.error('获取设备列表失败:', error)
    } finally {
      setLoading(false)
    }
  }
  // 获取站点列表
  const fetchSites = async () => {
    try {
      const response = await deviceApi.getSites()
      if (response.success) {
        setSites(response.data)
      }
    } catch (error) {
      console.error('获取站点列表失败:', error)
    }
  }

  useEffect(() => {
    // 确保localStorage中有userId用于API调用
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', 'test-user-123')
      console.log('设置测试用户ID: test-user-123')
    }
    fetchSites()
  }, [])

  useEffect(() => {
    fetchDevices()
  }, [query])

  const handleSearch = (keyword: string) => {
    setQuery(prev => ({
      ...prev,
      keyword
    }))
  }

  const handleSiteFilter = (siteId: string) => {
    setQuery(prev => ({
      ...prev,
      siteId: siteId || undefined,
      pageNum: 1
    }))
  
  const handleStatusFilter = (status: string) => {
    setQuery(prev => ({
      ...prev,
      status: status || undefined,
      pageNum: 1
    }))
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return '在线'
      case 'offline': return '离线'
      case 'maintenance': return '维护中'
      default: return status
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800'
      case 'offline': return 'bg-gray-100 text-gray-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">设备管理</h1>
        
        {/* 筛选器 */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 搜索框 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                搜索设备
              </label>
              <input
                type="text"
                placeholder="设备名称、编码或描述"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
              />
            </div>

            {/* 站点筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                站点
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSiteFilter(e.target.value)}
              >
                <option value="">所有站点</option>
                {sites.map(site => (
                  <option key={site.id} value={site.id}>{site.site_name}</option>
                ))}
              </select>
            </div>

            {/* 状态筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                状态
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusFilter(e.target.value)}
              >
                <option value="">所有状态</option>
                <option value="online">在线</option>
                <option value="offline">离线</option>
                <option value="maintenance">维护中</option>
                <option value="error">错误</option>
              </select>
            </div>

            {/* 重置按钮 */}
            <div className="flex items-end">
              <button
                onClick={() => setQuery({ pageNum: 1, pageSize: 10 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                重置筛选
              </button>
            </div>
          </div>
        </div>

        {/* 设备列表 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">加载中...</div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        设备信息
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        站点
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        固件版本
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        最后心跳
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {devices.map((device) => (
                      <tr key={device.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {device.device_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {device.device_code} | {device.device_type}
                            </div>
                            {device.description && (
                              <div className="text-xs text-gray-400">
                                {device.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{device.siteName}</div>
                          {device.location && (
                            <div className="text-xs text-gray-500">{device.location}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(device.status)}`}>
                            {getStatusText(device.status)}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {device.is_online ? '🟢 在线' : '🔴 离线'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {device.firmware_version}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(device.last_heartbeat_time).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            编辑
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    显示 {((query.pageNum || 1) - 1) * (query.pageSize || 10) + 1} 到{' '}
                    {Math.min((query.pageNum || 1) * (query.pageSize || 10), total)} 条，共 {total} 条记录
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setQuery(prev => ({ ...prev, pageNum: Math.max(1, (prev.pageNum || 1) - 1) }))}
                      disabled={query.pageNum === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      上一页
                    </button>
                    <span className="px-3 py-1 border border-gray-300 rounded-md bg-gray-50">
                      第 {query.pageNum || 1} 页
                    </span>
                    <button
                      onClick={() => setQuery(prev => ({ ...prev, pageNum: (prev.pageNum || 1) + 1 }))}
                      disabled={(query.pageNum || 1) * (query.pageSize || 10) >= total}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      下一页
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeviceManagement
