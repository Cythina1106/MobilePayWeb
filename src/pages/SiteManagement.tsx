import React, {useEffect, useState} from 'react'
import SiteTable from '../components/Site/SiteTable'
import SiteForm from '../components/Site/SiteForm'
import SiteDetailModal from '../components/Site/SiteDetailModal'
import useSiteData from '../hooks/useSiteData'
import {siteApi} from '../services/siteApi'
import { City, Site, SiteQuery, SiteListResponse, SiteCreateRequest, SiteUpdateRequest, Line, LineQuery, LineListResponse } from '../types/api.ts'
import '../styles/SiteManagement.css'

/**
 * 站点管理组件
 * 实现站点信息的增删改查和状态管理
 * 包含所有站点相关API接口的测试和展示
 */
const SiteManagement: React.FC = () => {
  // 弹窗状态
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [editingSite, setEditingSite] = useState<Site | null>(null)

  // 表单状态
  const [siteForm, setSiteForm] = useState<Partial<SiteCreateRequest>>({
    site_name: '',
    site_code: '',
    site_address: '',
    contact_person: '',
    contact_phone: '',
    site_type: 'STATION',
    description: '',
    longitude: 0,
    latitude: 0,
    city: '',
    line_name: '',
    business_start_time: '06:00',
    business_end_time: '22:00'
  })

  // 线路相关状态
  const [lines, setLines] = useState<Line[]>([])
  const [lineQuery, setLineQuery] = useState<LineQuery>({
    pageNum: 1,
    pageSize: 10,
    keyword: '',
    city: '',
    line_type: ''
  })
  const [lineListResponse, setLineListResponse] = useState<LineListResponse | null>(null)

  // API测试状态
  const [activeApiTab, setActiveApiTab] = useState<string>('cities')
  const [apiResults, setApiResults] = useState<Record<string, any>>({})
  const [apiLoading, setApiLoading] = useState<Record<string, boolean>>({})

  // 数据逻辑与状态管理
  const {
    cities,
    sites,
    siteListResponse,
    selectedCity,
    siteQuery,
    loading,
    sitesLoading,
    error,
    setError,
    setLoading,
    setSiteQuery,
    setSelectedCity,
    fetchCities,
    fetchSites,
    searchSites,
    handleCitySelect,
    handleQueryChange,
    handlePageChange
  } = useSiteData();
  // 移除单独的searchKeyword状态，直接使用siteQuery.keyword

  // 数据获取方法由useSiteData hook提供
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
          site_name: '',
          site_code: '',
          site_address: '',
          contact_person: '',
          contact_phone: '',
          site_type: 'STATION',
          description: '',
          longitude: 0,
          latitude: 0,
          city: '',
          line_name: '',
          business_start_time: '06:00',
          business_end_time: '22:00'
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
      const response = await siteApi.updateSite(editingSite.id || '', siteForm as SiteUpdateRequest)
      console.log('更新站点API响应:', response)

      if (response.success) {
        setShowEditModal(false)
        setEditingSite(null)
        setSiteForm({
          site_name: '',
          site_code: '',
          site_address: '',
          contact_person: '',
          contact_phone: '',
          site_type: 'STATION',
          description: '',
          longitude: 0,
          latitude: 0,
          city: '',
          line_name: '',
          business_start_time: '06:00',
          business_end_time: '22:00'
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
      site_name: '',
      site_code: '',
      site_address: '',
      contact_person: '',
      contact_phone: '',
      site_type: 'STATION',
      description: '',
      longitude: 0,
      latitude: 0,
      city: cities.find(c => c.cityCode === selectedCity)?.cityName || '',
      line_name: '',
      business_start_time: '06:00',
      business_end_time: '22:00'
    })
    setShowCreateModal(true)
  }

  // 打开编辑站点弹窗
  const openEditModal = (site: Site) => {
    setEditingSite(site)
    setSiteForm({
      site_name: site.site_name || site.name,
      site_code: site.site_code,
      site_address: site.address,
      contact_person: '',
      contact_phone: '',
      site_type: site.site_type as any || 'STATION',
      description: site.description || '',
      longitude: site.longitude,
      latitude: site.latitude,
      city: site.city,
      line_name: site.line_name,
      business_start_time: site.operatingHours?.open || '06:00',
      business_end_time: site.operatingHours?.close || '22:00'
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
      <SiteTable
        sites={sites}
        loading={sitesLoading}
        error={error}
        siteListResponse={siteListResponse}
        siteQuery={siteQuery}
        onPageChange={handlePageChange}
        onViewDetail={fetchSiteDetail}
        onEdit={openEditModal}
        onDelete={deleteSite}
      />

      {/* 创建站点弹窗 */}
      <SiteForm
        isOpen={showCreateModal}
        isEditing={false}
        initialData={{ city: selectedCity }}
        cities={cities}
        onClose={closeModals}
        onSubmit={createSite}
        loading={loading}
      />

      {/* 编辑站点弹窗 */}
      <SiteForm
        isOpen={showEditModal}
        isEditing={true}
        initialData={editingSite}
        cities={cities}
        onClose={closeModals}
        onSubmit={updateSite}
        loading={loading}
      />

      {/* 查看站点详情弹窗 */}
      <SiteDetailModal
        isOpen={showViewModal}
        site={selectedSite}
        onClose={closeModals}
        onEdit={() => {
          closeModals()
          openEditModal(selectedSite)
        }}
      />
    </div>
  )
}

export default SiteManagement
