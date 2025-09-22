import React, { useState, useEffect } from 'react'
import { siteApi } from '../services/api'
import { City, Site, SiteQuery, SiteListResponse, SiteCreateRequest, SiteUpdateRequest, Line, LineQuery, LineListResponse } from '../types/api'
import './SiteManagement.css'

/**
 * 站点管理组件
 * 实现站点信息的增删改查和状态管理
 * 包含所有站点相关API接口的测试和展示
 */
const SiteManagement: React.FC = () => {
  // 城市相关状态
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('')

  // 站点相关状态
  const [sites, setSites] = useState<Site[]>([])
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [siteQuery, setSiteQuery] = useState<SiteQuery>({
    pageNum: 1,
    pageSize: 100,  // 修改页面大小为100
    keyword: '',
    status: '',
    siteType: '',
    city: '',
    orderBy: 'created_time',
    orderDirection: 'desc'
  })
  const [siteListResponse, setSiteListResponse] = useState<SiteListResponse | null>(null)

  // 弹窗状态
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)

  // 表单状态
  const [siteForm, setSiteForm] = useState<Partial<SiteCreateRequest>>({
    siteName: '',
    siteCode: '',
    siteAddress: '',
    contactPerson: '',
    contactPhone: '',
    siteType: 'STATION',
    description: '',
    longitude: 0,
    latitude: 0,
    city: '',
    lineName: '',
    businessStartTime: '06:00',
    businessEndTime: '22:00'
  })

  // 线路相关状态
  const [lines, setLines] = useState<Line[]>([])
  const [lineQuery, setLineQuery] = useState<LineQuery>({
    pageNum: 1,
    pageSize: 10,
    keyword: '',
    city: '',
    lineType: ''
  })
  const [lineListResponse, setLineListResponse] = useState<LineListResponse | null>(null)

  // API测试状态
  const [activeApiTab, setActiveApiTab] = useState<string>('cities')
  const [apiResults, setApiResults] = useState<Record<string, any>>({})
  const [apiLoading, setApiLoading] = useState<Record<string, boolean>>({})

  // 通用状态
  const [loading, setLoading] = useState(false)
  const [sitesLoading, setSitesLoading] = useState(false)
  const [error, setError] = useState<string>('')
  // 移除单独的searchKeyword状态，直接使用siteQuery.keyword

  // 获取城市列表
  const fetchCities = async () => {
    setLoading(true)
    setError('')
    try {
      console.log('调用站点城市列表API...')
      const response = await siteApi.getCities()
      console.log('城市列表API响应:', response)

      if (response.success && response.data) {
        setCities(response.data)
        // 默认选择第一个城市
        if (response.data.length > 0 && !selectedCity) {
          setSelectedCity(response.data[0].cityCode)
          setSiteQuery(prev => ({ ...prev, city: response.data[0].cityName }))
        }
        console.log(`成功获取 ${response.data.length} 个城市`)
      } else {
        setError(`获取城市列表失败: ${response.message}`)
      }
    } catch (err) {
      console.error('获取城市列表失败:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setError(`网络错误: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // 获取站点列表
  const fetchSites = async (query: SiteQuery = siteQuery) => {
    setSitesLoading(true)
    try {
      console.log('调用站点列表API...', query)
      const response = await siteApi.getSites(query)
      console.log('站点列表API响应:', response)

      if (response.success && response.data) {
        // 适配后端返回的数据格式
        const adaptedData: SiteListResponse = {
          records: response.data.records || [],
          total: response.data.total || 0,
          size: response.data.size || query.pageSize || 100,
          current: response.data.current || query.pageNum || 1,
          pages: response.data.pages || 1,
          // 向后兼容的字段映射
          sites: response.data.records || [],
          pageNum: response.data.current || query.pageNum || 1,
          pageSize: response.data.size || query.pageSize || 100,
          totalPages: response.data.pages || 1
        }

        setSiteListResponse(adaptedData)
        setSites(response.data.records || [])
        console.log(`成功获取 ${response.data.records?.length || 0} 个站点`)
      } else {
        setError(`获取站点列表失败: ${response.message}`)
      }
    } catch (err) {
      console.error('获取站点列表失败:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setError(`获取站点列表失败: ${errorMessage}`)
    } finally {
      setSitesLoading(false)
    }
  }

  // 获取站点详情
  const fetchSiteDetail = async (id: string) => {
    try {
      console.log('调用站点详情API...', id)
      const response = await siteApi.getSiteById(id)
      console.log('站点详情API响应:', response)

      if (response.success && response.data) {
        setSelectedSite(response.data)
        setShowViewModal(true)
      } else {
        setError(`获取站点详情失败: ${response.message}`)
      }
    } catch (err) {
      console.error('获取站点详情失败:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setError(`获取站点详情失败: ${errorMessage}`)
    }
  }

  // 创建站点
  const createSite = async () => {
    if (!siteForm.siteName || !siteForm.siteCode || !siteForm.siteAddress) {
      setError('请填写必填字段')
      return
    }

    setLoading(true)
    try {
      console.log('调用创建站点API...', siteForm)
      const response = await siteApi.createSite(siteForm as SiteCreateRequest)
      console.log('创建站点API响应:', response)

      if (response.success) {
        setShowCreateModal(false)
        setSiteForm({
          siteName: '',
          siteCode: '',
          siteAddress: '',
          contactPerson: '',
          contactPhone: '',
          siteType: 'STATION',
          description: '',
          longitude: 0,
          latitude: 0,
          city: '',
          lineName: '',
          businessStartTime: '06:00',
          businessEndTime: '22:00'
        })
        fetchSites() // 刷新列表
        alert('站点创建成功！')
      } else {
        setError(`创建站点失败: ${response.message}`)
      }
    } catch (err) {
      console.error('创建站点失败:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setError(`创建站点失败: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // 更新站点
  const updateSite = async () => {
    if (!editingSite || !siteForm.siteName || !siteForm.siteCode || !siteForm.siteAddress) {
      setError('请填写必填字段')
      return
    }

    setLoading(true)
    try {
      console.log('调用更新站点API...', editingSite.id, siteForm)
      const response = await siteApi.updateSite(editingSite.id, siteForm as SiteUpdateRequest)
      console.log('更新站点API响应:', response)

      if (response.success) {
        setShowEditModal(false)
        setEditingSite(null)
        setSiteForm({
          siteName: '',
          siteCode: '',
          siteAddress: '',
          contactPerson: '',
          contactPhone: '',
          siteType: 'STATION',
          description: '',
          longitude: 0,
          latitude: 0,
          city: '',
          lineName: '',
          businessStartTime: '06:00',
          businessEndTime: '22:00'
        })
        fetchSites() // 刷新列表
        alert('站点更新成功！')
      } else {
        setError(`更新站点失败: ${response.message}`)
      }
    } catch (err) {
      console.error('更新站点失败:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setError(`更新站点失败: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // 删除站点
  const deleteSite = async (site: Site) => {
    if (!confirm(`确定要删除站点 "${site.site_name}" 吗？`)) {
      return
    }

    setLoading(true)
    try {
      console.log('调用删除站点API...', site.siteId)
      const response = await siteApi.deleteSite(site.siteId.toString())
      console.log('删除站点API响应:', response)

      if (response.success) {
        fetchSites() // 刷新列表
        alert('站点删除成功！')
      } else {
        setError(`删除站点失败: ${response.message}`)
      }
    } catch (err) {
      console.error('删除站点失败:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setError(`删除站点失败: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // 搜索站点 - 重置到第一页并刷新数据
  const searchSites = async () => {
    // 搜索时重置到第一页
    const updatedQuery = {
      ...siteQuery,
      pageNum: 1
    }
    setSiteQuery(updatedQuery)
    await fetchSites(updatedQuery)
  }

  // 获取线路列表
  const fetchLines = async (query: LineQuery = lineQuery) => {
    setApiLoading(prev => ({ ...prev, lines: true }))
    try {
      console.log('调用线路列表API...', query)
      const response = await siteApi.getLines(query)
      console.log('线路列表API响应:', response)

      if (response.success && response.data) {
        setLineListResponse(response.data)
        setLines(response.data.lines)
        setApiResults(prev => ({ ...prev, lines: response.data }))
        console.log(`成功获取 ${response.data.lines.length} 条线路`)
      } else {
        setError(`获取线路列表失败: ${response.message}`)
      }
    } catch (err) {
      console.error('获取线路列表失败:', err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setError(`获取线路列表失败: ${errorMessage}`)
    } finally {
      setApiLoading(prev => ({ ...prev, lines: false }))
    }
  }

  // API测试函数
  const testApi = async (apiName: string, params?: any) => {
    setApiLoading(prev => ({ ...prev, [apiName]: true }))
    try {
      let response: any

      switch (apiName) {
        case 'cities':
          response = await siteApi.getCities()
          setCities(response.data || [])
          break

        case 'sites':
          response = await siteApi.getSites(params || siteQuery)
          setSiteListResponse(response.data)
          setSites(response.data?.sites || [])
          break

        case 'siteDetail':
          if (params?.id) {
            response = await siteApi.getSiteById(params.id)
          }
          break

        case 'createSite':
          if (params) {
            response = await siteApi.createSite(params)
          }
          break

        case 'updateSite':
          if (params?.id && params?.data) {
            response = await siteApi.updateSite(params.id, params.data)
          }
          break

        case 'deleteSite':
          if (params?.id) {
            response = await siteApi.deleteSite(params.id)
          }
          break

        case 'searchSites':
          if (params?.keyword) {
            response = await siteApi.searchSites(params.keyword)
            setSites(response.data || [])
          }
          break

        case 'lines':
          response = await siteApi.getLines(params || lineQuery)
          setLineListResponse(response.data)
          setLines(response.data?.lines || [])
          break

        default:
          throw new Error(`未知的API: ${apiName}`)
      }

      setApiResults(prev => ({ ...prev, [apiName]: response }))
      console.log(`API ${apiName} 调用成功:`, response)

    } catch (err) {
      console.error(`API ${apiName} 调用失败:`, err)
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setApiResults(prev => ({ ...prev, [apiName]: { error: errorMessage } }))
      setError(`API ${apiName} 调用失败: ${errorMessage}`)
    } finally {
      setApiLoading(prev => ({ ...prev, [apiName]: false }))
    }
  }

  // 组件加载时获取城市列表和站点列表
  useEffect(() => {
    fetchCities()
  }, [])

  useEffect(() => {
    if (selectedCity) {
      fetchSites()
    }
  }, [selectedCity, siteQuery])

  // 处理城市选择
  const handleCitySelect = (cityCode: string) => {
    setSelectedCity(cityCode)
    const selectedCityInfo = cities.find(city => city.cityCode === cityCode)
    if (selectedCityInfo) {
      setSiteQuery(prev => ({ ...prev, city: selectedCityInfo.cityName, pageNum: 1 }))
    }
    console.log('选择城市:', cityCode)
  }

  // 处理查询参数变化
  const handleQueryChange = (key: keyof SiteQuery, value: any) => {
    setSiteQuery(prev => ({ ...prev, [key]: value, pageNum: 1 }))
  }

  // 处理分页
  const handlePageChange = (pageNum: number) => {
    setSiteQuery(prev => ({ ...prev, pageNum }))
  }

  // 打开创建站点弹窗
  const openCreateModal = () => {
    setSiteForm({
      siteName: '',
      siteCode: '',
      siteAddress: '',
      contactPerson: '',
      contactPhone: '',
      siteType: 'STATION',
      description: '',
      longitude: 0,
      latitude: 0,
      city: cities.find(c => c.cityCode === selectedCity)?.cityName || '',
      lineName: '',
      businessStartTime: '06:00',
      businessEndTime: '22:00'
    })
    setShowCreateModal(true)
  }

  // 打开编辑站点弹窗
  const openEditModal = (site: Site) => {
    setEditingSite(site)
    setSiteForm({
      siteName: site.siteName || site.name,
      siteCode: site.siteCode,
      siteAddress: site.address,
      contactPerson: '',
      contactPhone: '',
      siteType: site.siteType as any || 'STATION',
      description: site.description || '',
      longitude: site.longitude,
      latitude: site.latitude,
      city: site.city,
      lineName: site.lineName,
      businessStartTime: site.operatingHours?.open || '06:00',
      businessEndTime: site.operatingHours?.close || '22:00'
    })
    setShowEditModal(true)
  }

  // 关闭弹窗
  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowViewModal(false)
    setEditingSite(null)
    setSelectedSite(null)
    setError('')
  }

  // 获取选中城市的详细信息
  const getSelectedCityInfo = () => {
    return cities.find(city => city.cityCode === selectedCity)
  }

  const selectedCityInfo = getSelectedCityInfo()

  return (
    <div className="site-management">
      {/* 页面标题 */}
      <div className="site-header">
        <h1>🏢 站点管理系统</h1>
        <p>站点信息的增删改查和状态管理 - API接口测试</p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="error-message">
          <strong>⚠️ 错误:</strong> {error}
          <button
            style={{ float: 'right', background: 'none', border: 'none', color: '#721c24', cursor: 'pointer' }}
            onClick={() => setError('')}
          >
            ✕
          </button>
        </div>
      )}

      {/* API测试标签页 */}
      <div className="site-controls">
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>📋 API接口测试</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { key: 'cities', label: 'GET /site/cities', desc: '获取城市列表' },
              { key: 'sites', label: 'GET /site', desc: '分页查询站点列表' },
              { key: 'siteDetail', label: 'GET /site/{id}', desc: '获取站点详情' },
              { key: 'createSite', label: 'POST /site', desc: '创建站点' },
              { key: 'updateSite', label: 'PUT /site/{id}', desc: '更新站点' },
              { key: 'deleteSite', label: 'DELETE /site/{id}', desc: '删除站点' },
              { key: 'searchSites', label: 'GET /site/search', desc: '搜索站点' },
              { key: 'lines', label: 'GET /site/lines', desc: '获取线路列表' }
            ].map(api => (
              <button
                key={api.key}
                className={`btn ${activeApiTab === api.key ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveApiTab(api.key)}
                title={api.desc}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {api.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 控制面板 */}
      <div className="site-controls">
        <div className="controls-row">
          <div className="control-group">
            <label>选择城市</label>
            <select
              value={selectedCity}
              onChange={(e) => handleCitySelect(e.target.value)}
              disabled={loading}
            >
              <option value="">请选择城市...</option>
              {cities.map((city) => (
                <option key={city.cityCode} value={city.cityCode}>
                  {city.cityName} ({city.cityCode})
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>站点状态</label>
            <select
              value={siteQuery.status || ''}
              onChange={(e) => handleQueryChange('status', e.target.value)}
            >
              <option value="">全部状态</option>
              <option value="ACTIVE">正常运营</option>
              <option value="INACTIVE">停止运营</option>
              <option value="MAINTENANCE">维护中</option>
              <option value="CONSTRUCTION">建设中</option>
            </select>
          </div>

          <div className="control-group">
            <label>站点类型</label>
            <select
              value={siteQuery.site_type || ''}
              onChange={(e) => handleQueryChange('site_type', e.target.value)}
            >
              <option value="">全部类型</option>
              <option value="BRANCH">分支机构</option>
              <option value="HQ">总部</option>
              <option value="TERMINAL">终端</option>
              <option value="STATION">车站</option>
              <option value="DEPOT">车库</option>
              <option value="OFFICE">办公室</option>
            </select>
          </div>

          <div className="search-group">
            <input
              type="text"
              className="search-input"
              placeholder="搜索站点名称或代码..."
              value={siteQuery.keyword || ''}
              onChange={(e) => handleQueryChange('keyword', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchSites()}
            />
            <button
              className="btn btn-primary"
              onClick={searchSites}
              disabled={sitesLoading}
            >
              🔍 搜索
            </button>
          </div>
        </div>

        <div className="controls-row">
          <button
            className="btn btn-success"
            onClick={openCreateModal}
            disabled={!selectedCity}
          >
            ➕ 新建站点
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => fetchSites()}
            disabled={sitesLoading}
          >
            {sitesLoading ? '刷新中...' : '🔄 刷新列表'}
          </button>

          <button
            className="btn btn-secondary"
            onClick={fetchCities}
            disabled={loading}
          >
            {loading ? '加载中...' : '🏙️ 刷新城市'}
          </button>
        </div>
      </div>

      {/* 站点列表 */}
      <div className="sites-table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: '0', color: '#333', fontSize: '1.5em' }}>
            📍 站点列表
          </h2>
          {siteListResponse && (
            <div className="pagination-info">
              共 {siteListResponse.total} 个站点，第 {siteListResponse.current} / {siteListResponse.pages} 页
            </div>
          )}
        </div>

        {sitesLoading ? (
          <div className="loading-spinner">
            <div>⏳ 加载站点数据中...</div>
          </div>
        ) : sites.length > 0 ? (
          <>
            <table className="sites-table">
              <thead>
                <tr>
                  <th>站点名称</th>
                  <th>站点代码</th>
                  <th>地址</th>
                  <th>城市</th>
                  <th>线路</th>
                  <th>类型</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site) => (
                  <tr key={site.site_id}>
                    <td>
                      <strong>{site.site_name}</strong>
                    </td>
                    <td>
                      <code>{site.site_code}</code>
                    </td>
                    <td title={site.site_address}>
                      {site.site_address && site.site_address.length > 30 ?
                        `${site.site_address.substring(0, 30)}...` :
                        site.site_address || '-'}
                    </td>
                    <td>{site.city}</td>
                    <td>{site.line_name || '-'}</td>
                    <td>
                      <span className="site-type-badge">
                        {site.type_name || site.site_type_name || '未知类型'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${site.status?.toLowerCase()}`}>
                        {site.status_name || site.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="btn btn-primary"
                          onClick={() => fetchSiteDetail(site.site_id.toString())}
                          title="查看详情"
                        >
                          👁️
                        </button>
                        <button
                          className="btn btn-warning"
                          onClick={() => openEditModal(site)}
                          title="编辑站点"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteSite(site)}
                          title="删除站点"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 分页控件 */}
            {siteListResponse && siteListResponse.pages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChange(siteListResponse.current - 1)}
                  disabled={siteListResponse.current <= 1}
                >
                  ⬅️ 上一页
                </button>

                <span className="pagination-info">
                  第 {siteListResponse.current} / {siteListResponse.pages} 页
                </span>

                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChange(siteListResponse.current + 1)}
                  disabled={siteListResponse.current >= siteListResponse.pages}
                >
                  下一页 ➡️
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🏢</div>
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>暂无站点数据</div>
            <div style={{ fontSize: '14px' }}>
              {selectedCity ? '当前城市暂无站点，请尝试创建新站点' : '请先选择城市'}
            </div>
          </div>
        )}
      </div>

      {/* 创建站点弹窗 */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModals()}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">➕ 创建新站点</h3>
              <button className="close-btn" onClick={closeModals}>×</button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>站点名称 *</label>
                <input
                  type="text"
                  value={siteForm.site_name || ''}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, site_name: e.target.value }))}
                  placeholder="请输入站点名称"
                />
              </div>

              <div className="form-group">
                <label>站点代码 *</label>
                <input
                  type="text"
                  value={siteForm.site_code || ''}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, site_code: e.target.value }))}
                  placeholder="请输入站点代码"
                />
              </div>

              <div className="form-group full-width">
                <label>站点地址 *</label>
                <input
                  type="text"
                  value={siteForm.site_address || ''}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, site_address: e.target.value }))}
                  placeholder="请输入站点地址"
                />
              </div>

              <div className="form-group">
                <label>联系人</label>
                <input
                  type="text"
                  value={siteForm.contact_person || ''}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, contact_person: e.target.value }))}
                  placeholder="请输入联系人"
                />
              </div>

              <div className="form-group">
                <label>联系电话</label>
                <input
                  type="text"
                  value={siteForm.contact_phone || ''}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, contact_phone: e.target.value }))}
                  placeholder="请输入联系电话"
                />
              </div>

              <div className="form-group">
                <label>站点类型</label>
                <select
                  value={siteForm.site_type || 'STATION'}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, site_type: e.target.value as any }))}
                >
                  <option value="BRANCH">分支机构</option>
                  <option value="HQ">总部</option>
                  <option value="TERMINAL">终端</option>
                  <option value="STATION">车站</option>
                  <option value="DEPOT">车库</option>
                  <option value="OFFICE">办公室</option>
                </select>
              </div>

              <div className="form-group">
                <label>线路名称</label>
                <input
                  type="text"
                  value={siteForm.line_name || ''}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, line_name: e.target.value }))}
                  placeholder="请输入线路名称"
                />
              </div>

              <div className="form-group">
                <label>经度</label>
                <input
                  type="number"
                  step="0.000001"
                  value={siteForm.longitude || 0}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                  placeholder="请输入经度"
                />
              </div>

              <div className="form-group">
                <label>纬度</label>
                <input
                  type="number"
                  step="0.000001"
                  value={siteForm.latitude || 0}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                  placeholder="请输入纬度"
                />
              </div>

              <div className="form-group">
                <label>营业开始时间</label>
                <input
                  type="time"
                  value={siteForm.business_start_time || '06:00'}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, business_start_time: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>营业结束时间</label>
                <input
                  type="time"
                  value={siteForm.business_end_time || '22:00'}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, business_end_time: e.target.value }))}
                />
              </div>

              <div className="form-group full-width">
                <label>描述</label>
                <textarea
                  value={siteForm.description || ''}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="请输入站点描述"
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModals}>
                取消
              </button>
              <button
                className="btn btn-success"
                onClick={createSite}
                disabled={loading || !siteForm.site_name || !siteForm.site_code || !siteForm.site_address}
              >
                {loading ? '创建中...' : '创建站点'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑站点弹窗 */}
      {showEditModal && editingSite && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModals()}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">✏️ 编辑站点</h3>
              <button className="close-btn" onClick={closeModals}>×</button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>站点名称 *</label>
                <input
                  type="text"
                  value={siteForm.site_name || ''}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, site_name: e.target.value }))}
                  placeholder="请输入站点名称"
                />
              </div>

              <div className="form-group">
                <label>站点代码 *</label>
                <input
                  type="text"
                  value={siteForm.site_code || ''}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, site_code: e.target.value }))}
                  placeholder="请输入站点代码"
                />
              </div>

              <div className="form-group full-width">
                <label>站点地址 *</label>
                <input
                  type="text"
                  value={siteForm.site_address || ''}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, site_address: e.target.value }))}
                  placeholder="请输入站点地址"
                />
              </div>

              <div className="form-group">
                <label>联系人</label>
                <input
                  type="text"
                  value={siteForm.contact_person || ''}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, contact_person: e.target.value }))}
                  placeholder="请输入联系人"
                />
              </div>

              <div className="form-group">
                <label>联系电话</label>
                <input
                  type="text"
                  value={siteForm.contact_phone || ''}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, contact_phone: e.target.value }))}
                  placeholder="请输入联系电话"
                />
              </div>

              <div className="form-group">
                <label>站点类型</label>
                <select
                  value={siteForm.site_type || 'STATION'}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, site_type: e.target.value as any }))}
                >
                  <option value="BRANCH">分支机构</option>
                  <option value="HQ">总部</option>
                  <option value="TERMINAL">终端</option>
                  <option value="STATION">车站</option>
                  <option value="DEPOT">车库</option>
                  <option value="OFFICE">办公室</option>
                </select>
              </div>

              <div className="form-group">
                <label>线路名称</label>
                <input
                  type="text"
                  value={siteForm.line_name || ''}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, line_name: e.target.value }))}
                  placeholder="请输入线路名称"
                />
              </div>

              <div className="form-group">
                <label>经度</label>
                <input
                  type="number"
                  step="0.000001"
                  value={siteForm.longitude || 0}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                  placeholder="请输入经度"
                />
              </div>

              <div className="form-group">
                <label>纬度</label>
                <input
                  type="number"
                  step="0.000001"
                  value={siteForm.latitude || 0}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                  placeholder="请输入纬度"
                />
              </div>

              <div className="form-group">
                <label>营业开始时间</label>
                <input
                  type="time"
                  value={siteForm.business_start_time || '06:00'}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, business_start_time: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>营业结束时间</label>
                <input
                  type="time"
                  value={siteForm.business_end_time || '22:00'}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, business_end_time: e.target.value }))}
                />
              </div>

              <div className="form-group full-width">
                <label>描述</label>
                <textarea
                  value={siteForm.description || ''}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="请输入站点描述"
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModals}>
                取消
              </button>
              <button
                className="btn btn-warning"
                onClick={updateSite}
                disabled={loading || !siteForm.site_name || !siteForm.site_code || !siteForm.site_address}
              >
                {loading ? '更新中...' : '更新站点'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 查看站点详情弹窗 */}
      {showViewModal && selectedSite && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModals()}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">👁️ 站点详情</h3>
              <button className="close-btn" onClick={closeModals}>×</button>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">站点名称</div>
                <div className="detail-value">{selectedSite.site_name || selectedSite.name}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">站点代码</div>
                <div className="detail-value">
                  <code>{selectedSite.site_code}</code>
                </div>
              </div>

              <div className="detail-item full-width">
                <div className="detail-label">站点地址</div>
                <div className="detail-value">{selectedSite.address}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">城市</div>
                <div className="detail-value">{selectedSite.city}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">线路名称</div>
                <div className="detail-value">{selectedSite.line_name || '-'}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">站点类型</div>
                <div className="detail-value">
                  <span className="site-type-badge">
                    {selectedSite.site_type === 'BRANCH' ? '分支机构' :
                     selectedSite.site_type === 'HQ' ? '总部' :
                     selectedSite.site_type === 'TERMINAL' ? '终端' :
                     selectedSite.site_type === 'STATION' ? '车站' :
                     selectedSite.site_type === 'DEPOT' ? '车库' :
                     selectedSite.site_type === 'OFFICE' ? '办公室' :
                     selectedSite.site_type || '其他'}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">状态</div>
                <div className="detail-value">
                  <span className={`status-badge status-${selectedSite.status}`}>
                    {selectedSite.status === 'active' ? '活跃' :
                     selectedSite.status === 'inactive' ? '非活跃' :
                     selectedSite.status === 'maintenance' ? '维护中' :
                     selectedSite.status === 'construction' ? '建设中' :
                     selectedSite.status}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">经度</div>
                <div className="detail-value">{selectedSite.longitude}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">纬度</div>
                <div className="detail-value">{selectedSite.latitude}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">营业时间</div>
                <div className="detail-value">
                  {selectedSite.operatingHours ?
                    `${selectedSite.operatingHours.open} - ${selectedSite.operatingHours.close}` :
                    '-'
                  }
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">容量</div>
                <div className="detail-value">{selectedSite.capacity || '-'}</div>
              </div>

              {selectedSite.facilities && selectedSite.facilities.length > 0 && (
                <div className="detail-item full-width">
                  <div className="detail-label">设施</div>
                  <div className="detail-value">
                    {selectedSite.facilities.join(', ')}
                  </div>
                </div>
              )}

              {selectedSite.description && (
                <div className="detail-item full-width">
                  <div className="detail-label">描述</div>
                  <div className="detail-value">{selectedSite.description}</div>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModals}>
                关闭
              </button>
              <button
                className="btn btn-warning"
                onClick={() => {
                  closeModals()
                  openEditModal(selectedSite)
                }}
              >
                编辑站点
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SiteManagement
