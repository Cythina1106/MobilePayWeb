import React, { useState } from 'react'
import Card from '../Common/Card.tsx'
import Modal from '../Common/Modal.tsx'

interface Station {
  id: string
  name: string
  code: string
  line: string
  city: string
  province: string
  district: string
  address: string
  status: 'active' | 'inactive' | 'maintenance'
  openTime: string
  closeTime: string
  gateCount: number
  dailyFlow: number
  createdTime: string
  lastUpdated: string
}

interface StationManagementProps {
  stations: Station[]
  filteredStations: Station[]
  currentPage: number
  totalPages: number
  pageSize: number
  availableCities: string[]
  availableLines: string[]
  cityFilter: string
  lineFilter: string
  statusFilter: string
  searchTerm: string
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCityFilterChange: (city: string) => void
  onLineFilterChange: (line: string) => void
  onStatusFilterChange: (status: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onResetFilters: () => void
  onSaveStation: (station: Partial<Station>, isEdit: boolean) => void
  onDeleteStation: (stationId: string) => void
  onGetStationById: (stationId: string) => Station | undefined
}

const StationManagement: React.FC<StationManagementProps> = ({
  stations,
  filteredStations,
  currentPage,
  totalPages,
  pageSize,
  availableCities,
  availableLines,
  cityFilter,
  lineFilter,
  statusFilter,
  searchTerm,
  onSearch,
  onCityFilterChange,
  onLineFilterChange,
  onStatusFilterChange,
  onPageChange,
  onPageSizeChange,
  onResetFilters,
  onSaveStation,
  onDeleteStation,
  onGetStationById
}) => {
  const [showStationModal, setShowStationModal] = useState(false)
  const [editingStation, setEditingStation] = useState<Station | null>(null)
  const [stationForm, setStationForm] = useState<Partial<Station>>({
    name: '',
    code: '',
    line: '',
    city: '',
    province: '',
    district: '',
    address: '',
    status: 'active',
    openTime: '05:00',
    closeTime: '23:30',
    gateCount: 0
  })

  // 省份城市区域数据
  const regionData: Record<string, Record<string, string[]>> = {
    '北京市': {
      '北京': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区']
    },
    '上海市': {
      '上海': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区', '闵行区', '宝山区', '嘉定区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区']
    },
    '广东省': {
      '广州': ['荔湾区', '越秀区', '海珠区', '天河区', '白云区', '黄埔区', '番禺区', '海都区', '南沙区', '从化区', '增城区'],
      '深圳': ['罗湖区', '福田区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区', '光明区', '大鹏新区']
    },
    '四川省': {
      '成都': ['锦江区', '青羊区', '金牛区', '武侯区', '成华区', '龙泉驿区', '青白江区', '新都区', '温江区', '双流区', '郫都区', '新津区', '金堂县', '大邑县', '蒲江县', '都江堰市', '彭州市', '崇州市', '邛崃市', '简阳市']
    },
    '江苏省': {
      '南京': ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区', '栖霞区', '雨花台区', '江宁区', '六合区', '溧水区', '高淳区'],
      '苏州': ['姑苏区', '虎丘区', '吴中区', '相城区', '吴江区', '常熟市', '张家港市', '昆山市', '太仓市']
    },
    '浙江省': {
      '杭州': ['上城区', '下城区', '江干区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '富阳区', '临安区', '桐庐县', '淳安县', '建德市'],
      '宁波': ['海曙区', '江北区', '北仑区', '镇海区', '鄞州区', '奉化区', '象山县', '宁海县', '余姚市', '慈溪市']
    }
  }

  const handleStationEdit = (station: Station) => {
    setEditingStation(station)
    setStationForm(station)
    setShowStationModal(true)
  }

  const handleStationSave = () => {
    if (!stationForm.name || !stationForm.code || !stationForm.line || !stationForm.city || !stationForm.province || !stationForm.district) {
      alert('请填写必填字段（站点名称、编码、线路、城市、省份、区域）')
      return
    }

    onSaveStation(stationForm, !!editingStation)
    setShowStationModal(false)
    setEditingStation(null)
    setStationForm({
      name: '',
      code: '',
      line: '',
      city: '',
      province: '',
      district: '',
      address: '',
      status: 'active',
      openTime: '05:00',
      closeTime: '23:30',
      gateCount: 0
    })
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value
    // 查找该城市所属的省份
    const province = Object.keys(regionData).find(prov =>
      Object.keys(regionData[prov]).includes(city)
    ) || ''

    setStationForm(prev => ({
      ...prev,
      city,
      province,
      district: '' // 重置区域选择
    }))
  }

  const handleCancel = () => {
    setShowStationModal(false)
    setEditingStation(null)
    setStationForm({
      name: '',
      code: '',
      line: '',
      city: '',
      province: '',
      district: '',
      address: '',
      status: 'active',
      openTime: '05:00',
      closeTime: '23:30',
      gateCount: 0
    })
  }

  return (
    <div className="stations-section">
      <div className="section-header">
        <h3>站点管理</h3>
        <div className="header-actions">
          <input
            type="text"
            placeholder="搜索站点名称、编码、线路或地址"
            value={searchTerm}
            onChange={onSearch}
            className="search-input"
          />
          <button className="create-btn" onClick={() => setShowStationModal(true)}>
            + 添加站点
          </button>
        </div>
      </div>

      {/* 筛选条件 */}
      <div className="filter-section">
        <div className="filter-row">
          <select
            value={cityFilter}
            onChange={(e) => onCityFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="">全部城市</option>
            {availableCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={lineFilter}
            onChange={(e) => onLineFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="">全部线路</option>
            {availableLines.map(line => (
              <option key={line} value={line}>{line}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="">全部状态</option>
            <option value="active">运营中</option>
            <option value="inactive">已关闭</option>
            <option value="maintenance">维护中</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="page-size-select"
          >
            <option value={5}>每页 5 条</option>
            <option value={10}>每页 10 条</option>
            <option value={20}>每页 20 条</option>
            <option value={50}>每页 50 条</option>
          </select>

          <button
            className="reset-filters-btn"
            onClick={onResetFilters}
            title="清除所有筛选条件"
          >
            重置筛选
          </button>
        </div>

        <div className="results-info">
          共找到 {filteredStations.length} 个站点，按站点编码排序
        </div>
      </div>

      <div className="stations-grid">
        {filteredStations.map(station => (
          <Card key={station.id} variant="station" className="station-card">
            <div className="station-header">
              <div className="station-info">
                <h4>{station.name}</h4>
                <div className="station-meta">
                  <span className="station-code">{station.code}</span>
                  <span className="station-line">{station.line}</span>
                  <span className="station-city">{station.city}</span>
                </div>
              </div>
              <span className={`status ${station.status}`}>
                <span className="status-dot"></span>
                {station.status === 'active' ? '运营中' :
                 station.status === 'inactive' ? '已关闭' : '维护中'}
              </span>
            </div>

            <div className="station-details">
              <div className="detail-item">
                <span className="label">地址：</span>
                <span className="value">{station.province}{station.city}{station.district}{station.address}</span>
              </div>
              <div className="detail-item">
                <span className="label">运营时间：</span>
                <span className="value">{station.openTime} - {station.closeTime}</span>
              </div>
              <div className="detail-item">
                <span className="label">闸机数量：</span>
                <span className="value">{station.gateCount} 台</span>
              </div>
              <div className="detail-item">
                <span className="label">日均客流：</span>
                <span className="value">{station.dailyFlow.toLocaleString()} 人次</span>
              </div>
            </div>

            <div className="station-actions">
              <button
                className="action-btn edit"
                onClick={() => handleStationEdit(station)}
              >
                编辑
              </button>
              <button
                className="action-btn delete"
                onClick={() => onDeleteStation(station.id)}
              >
                删除
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            上一页
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            下一页
          </button>

          <span className="page-info">
            第 {currentPage} 页，共 {totalPages} 页
          </span>
        </div>
      )}

      {/* 站点模态框 */}
      {showStationModal && (
        <Modal
          isOpen={showStationModal}
          onClose={handleCancel}
          title={editingStation ? '编辑站点' : '添加站点'}
          className="station-modal"
        >
          <div className="form-container">
            <div className="form-grid">
              <div className="form-group">
                <label>站点名称 *</label>
                <input
                  type="text"
                  value={stationForm.name || ''}
                  onChange={(e) => setStationForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="请输入站点名称"
                />
              </div>
              <div className="form-group">
                <label>站点编码 *</label>
                <input
                  type="text"
                  value={stationForm.code || ''}
                  onChange={(e) => setStationForm(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="请输入站点编码"
                />
              </div>
              <div className="form-group">
                <label>所属线路 *</label>
                <select
                  value={stationForm.line || ''}
                  onChange={(e) => setStationForm(prev => ({ ...prev, line: e.target.value }))}
                >
                  <option value="">请选择线路</option>
                  <option value="1号线">1号线</option>
                  <option value="2号线">2号线</option>
                  <option value="3号线">3号线</option>
                  <option value="4号线">4号线</option>
                  <option value="5号线">5号线</option>
                  <option value="6号线">6号线</option>
                  <option value="10号线">10号线</option>
                </select>
              </div>
              <div className="address-selection">
                <div className="form-group">
                  <label>所属城市</label>
                  <select
                    value={stationForm.city || ''}
                    onChange={handleCityChange}
                  >
                    <option value="">请选择城市</option>
                    {Object.values(regionData).flatMap(provinces =>
                      Object.keys(provinces)
                    ).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>所属省份</label>
                  <input
                    type="text"
                    value={stationForm.province || ''}
                    readOnly
                    placeholder="请先选择城市"
                  />
                </div>
                <div className="form-group">
                  <label>所属区域</label>
                  <select
                    value={stationForm.district || ''}
                    onChange={(e) => setStationForm(prev => ({ ...prev, district: e.target.value }))}
                    disabled={!stationForm.city}
                  >
                    <option value="">请选择区域</option>
                    {stationForm.city && stationForm.province &&
                      regionData[stationForm.province]?.[stationForm.city]?.map((district: string) => (
                        <option key={district} value={district}>{district}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>状态</label>
                <select
                  value={stationForm.status || 'active'}
                  onChange={(e) => setStationForm(prev => ({ ...prev, status: e.target.value as any }))}
                >
                  <option value="active">运营中</option>
                  <option value="inactive">已关闭</option>
                  <option value="maintenance">维护中</option>
                </select>
              </div>
              <div className="form-group">
                <label>开始运营时间</label>
                <input
                  type="time"
                  value={stationForm.openTime || '05:00'}
                  onChange={(e) => setStationForm(prev => ({ ...prev, openTime: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>结束运营时间</label>
                <input
                  type="time"
                  value={stationForm.closeTime || '23:30'}
                  onChange={(e) => setStationForm(prev => ({ ...prev, closeTime: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>闸机数量</label>
                <input
                  type="number"
                  min="0"
                  value={stationForm.gateCount || ''}
                  onChange={(e) => setStationForm(prev => ({ ...prev, gateCount: Number(e.target.value) }))}
                  placeholder="请输入闸机数量"
                />
              </div>
              <div className="form-group full-width">
                <label>详细地址</label>
                <input
                  type="text"
                  value={stationForm.address || ''}
                  onChange={(e) => setStationForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="请输入详细地址"
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="cancel-btn" onClick={handleCancel}>
              取消
            </button>
            <button className="save-btn" onClick={handleStationSave}>
              {editingStation ? '保存修改' : '添加站点'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default StationManagement